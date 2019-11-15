from datetime import datetime
from pathlib import Path

import pymongo
from uuid import uuid4
import requests
from flask import Blueprint, request, jsonify
from flask import current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.json_util import dumps
from werkzeug.utils import secure_filename
from PIL import Image

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
    });
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
            "date": datetime.now().replace(hour=23, minute=59, second=59, microsecond=999),
            "degrees": resp["main"]["temp"] - 273.15, # degrees in celsius
            "weather": resp['weather'][0]['main'].lower(),
        },
        "timestamp": datetime.now().replace(hour=23, minute=59, second=59, microsecond=999)
    }
    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201


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
    except err:
        raise (f"Failed to get weather {err}!")

    location = ""
    try:
        location = requests.get(
            f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={long}"
        ).json()["display_name"]
    except err:
        print(f"Failed to get the location {err}")

    post = {
        "type": "location",
        "content": {
            "longitude": long,
            "latitude": lat,
            "location": location,
        },
        "timestamp": datetime.now()
    }
    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201


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

    # TODO: do face detection of children

    with Image.open(file_path) as img:
        width, height = img.size

    post = {
        "type": "image",
        "content": {
            "filename": filename,
            "aspect": width / height,
            "children": [],

        },
        "timestamp": datetime.now()
    }

    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201