from datetime import datetime
from dateutil.parser import parse
from pathlib import Path

import cv2
import pymongo
import face_recognition
from uuid import uuid4
import requests
import numpy as np
from flask import Blueprint, request, jsonify
from flask import current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.json_util import dumps
from werkzeug.utils import secure_filename
from PIL import Image

import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


from chinderbuech.errors import ApiError

posts_api = Blueprint("posts", "posts")


def __day_exists():
    """ checks wether there is already a day entry for today"""
    start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0);
    end =  datetime.now().replace(hour=23, minute=59, second=59, microsecond=999);
    current_day = current_app.mongo.db.posts.find_one({
        "$and": [{
            "timestamp": {
                "$gte": start,
                "$lt": end
            },
            "type": "day"
        }]
    })
    print(f"Found day: {current_day}")
    return not current_day == None


def __insert_day_post():
    date = datetime.now()
    try:
        resp = requests.get(
            "http://api.openweathermap.org/data/2.5/weather?q=Bern,CH&appid=86d135eb406e3eb88e6fa5181a4e584c"
        ).json()
    except err:
        raise ApiError(f"Failed to get weather {err}!")

    post = {
        "type": "day",
        "content": {
            "date": datetime.now().replace(hour=00, minute=00, second=00, microsecond=000),
            "events": __insert_schedule_post(),
            "degrees": resp["main"]["temp"] - 273.15, # degrees in celsius
            "weather": resp['weather'][0]['main'].lower(),
        },
        "timestamp": datetime.now().replace(hour=23, minute=59, second=00, microsecond=000)
    }
    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201


def __insert_schedule_post():

    # If modifying these scopes, delete the file token.pickle.
    SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

    """Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('calendar', 'v3', credentials=creds)

    start = datetime.utcnow().replace(hour=00, minute=00, second=00, microsecond=000).isoformat() + 'Z' # 'Z' indicates UTC time
    end = datetime.utcnow().replace(hour=23, minute=59, second=59, microsecond=999).isoformat() + 'Z' # 'Z' indicates UTC time
    print('Getting the upcoming 10 events')
    events_result = service.events().list(
        calendarId='21fbsekqbipcb7jdeseaqjf2j4@group.calendar.google.com',
        timeMin=start,
        timeMax=end,
        maxResults=10,
        singleEvents=True,
        orderBy='startTime',
    ).execute()
    events = events_result.get('items', [])

    return [{
        "name": event['summary'],
        "start": parse(event['start'].get('dateTime', event['start'].get('date'))),
        "end": parse(event['end'].get('dateTime', event['end'].get('date')))
     } for event in events]

    print(f"Adding {len(events)}")
    post_ids = []
    if events:
        for event in events:
            timestamp =  parse(event['start'].get('dateTime', event['start'].get('date')))
            print(f"Original date {event['start']}")
            print(f"Adding event {event['summary']}")
            post = {
                "type": "schedule",
                "content": {
                    "event": event['summary'],
                    "timestamp": timestamp
                },
                "timestamp": timestamp
            }

            post_ids.append(str(current_app.mongo.db.posts.insert_one(post).inserted_id))
    return post_ids


@posts_api.route("/text", methods=["POST"])
#@jwt_required
def insert_text_post():
 #   current_user = get_jwt_identity()
    if not __day_exists():
        __insert_day_post()

    raw_post = request.json
    print(raw_post)

    try:
        title = raw_post.get("title", "")
        text = raw_post["text"]
    except err:
        raise ApiError(f"Failed to get weather {err}!")

    post = {
        "type": "text",
        "content": {
            "title": title,
            "text": text,
        },
        "timestamp": datetime.now()
    }
    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201


@posts_api.route("/location", methods=["POST"])
#@jwt_required
def insert_location_post():
 #   current_user = get_jwt_identity()

    if not __day_exists():
        __insert_day_post()

    raw_post = request.json
    print(raw_post)

    try:
        lat = raw_post["latitude"]
        long = raw_post["longitude"]
        text = raw_post.get("text", None)
    except err:
        raise (f"Failed to get weather {err}!")

    location = ""
    try:
        loc = requests.get(
            f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={long}"
        ).json()
        location = loc["display_name"]
    except err:
        print(f"Failed to get the location {err}")

    if not text:
        text = f"Grüsse aus {loc['address']['city']}"

    post = {
        "type": "location",
        "content": {
            "longitude": long,
            "latitude": lat,
            "location": location,
            "text": text
        },
        "timestamp": datetime.now()
    }
    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201


def __learn_faces():
    known_face_encodings = []
    known_face_names = []

    training_path = Path().absolute() / Path("chinderbuech/static/ai-training")
    print(f"Training path {training_path}")
    pathlist = training_path.glob('*.jpg')
    for path in pathlist:
        print(f"learning {path}")
        known_image = face_recognition.load_image_file(str(path))
        known_face_encodings.append(
            face_recognition.face_encodings(known_image)[0]
        )
        known_face_names.append(str(path.stem))

    return (known_face_encodings, known_face_names)

def __face_detection(image_path, training):
    """ Returns what faces were detected in the image """

    known_face_encodings, known_face_names = training

    unknown_image = face_recognition.load_image_file(image_path)
    face_locations = face_recognition.face_locations(unknown_image)

    print(f"There are {len(face_locations)} in this image!")

    face_encodings = face_recognition.face_encodings(unknown_image)

    face_names = []
    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)

        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        name = None
        if matches[best_match_index]:
            name = known_face_names[best_match_index]

        if name:
            face_names.append(name)

        face_names.append(name)

    print(f"Found faces: {face_names}")
    return face_names

def __classify_happiness(image_path):
    training_path = Path().absolute() / Path("chinderbuech/static/ai-training")
    face_cascade = cv2.CascadeClassifier(str(training_path / 'haarcascade_frontalface_default.xml'))
    eye_cascade = cv2.CascadeClassifier(str(training_path / 'haarcascade_eye.xml'))
    smile_cascade = cv2.CascadeClassifier(str(training_path / 'haarcascade_smile.xml'))

    frame = cv2.imread(image_path)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces  = face_cascade.detectMultiScale(gray, 1.3, 5)
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), ((x + w), (y + h)), (255, 0, 0), 2)
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = frame[y:y + h, x:x + w]
        smiles = smile_cascade.detectMultiScale(roi_gray, 1.8, 20)

        print(f"{len(smiles)} smiles detected")
        return len(smiles)


learned_faces = {}

@posts_api.route('/image', methods=['POST'])
#@jwt_required
def insert_image_post():
#   current_user = get_jwt_identity()

    if not __day_exists():
        __insert_day_post()

    # check if the post request has the file part
    file = request.files.get("file", None)
    if not file or not file.filename:
        raise ApiError("No file received")

    filename = f"{uuid4()}{Path(file.filename).suffix}"
    file_path = str(current_app.config['UPLOAD_FOLDER'] / filename)
    file.save(file_path)

    if not learned_faces.get("faces", None):
        learned_faces["faces"] = __learn_faces()

    # detect faces
    # https://stackoverflow.com/a/4459730/12356463
    children = list(set(__face_detection(file_path, learned_faces["faces"])))
    with Image.open(file_path) as img:
        width, height = img.size

    # classify happiness :)
    smiles = __classify_happiness(file_path)

    post = {
        "type": "image",
        "content": {
            "filename": filename,
            "aspect": width / height,
            "children": children,
            "smiles": smiles

        },
        "timestamp": datetime.now()
    }

    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201



@posts_api.route("/children", methods=["GET"])
#@jwt_required
def fuck_this():
    child = {
        "name": "livio.brunner",
        "weekdays": [0,1,2,3,4,5]
    }
    kind_id = current_app.mongo.db.children.insert_one(child).inserted_id
    child = {
        "name": "jonas.wyss",
        "weekdays": [5]
    }
    kind_id = current_app.mongo.db.children.insert_one(child).inserted_id

    child = {
        "name": "benjamin.fassbind",
        "weekdays": [0,1]
    }
    kind_id = current_app.mongo.db.children.insert_one(child).inserted_id
    return jsonify({"post_id": str(post_id)}), 201