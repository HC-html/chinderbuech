import itertools
from datetime import datetime

import pymongo
from flask import Blueprint, request, jsonify
from flask import current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.json_util import dumps

from chinderbuech.errors import ApiError


timeline_api = Blueprint("timeline", "timeline")
users_api = Blueprint("users", "users")
posts_api = Blueprint("posts", "posts")

@timeline_api.route("/dummy", methods=["GET"])
def dummy_data():

    posts = [
        {
            "type": "image-grid",
            "content": [
                {"url": "statig/img1.jpeg"},
                {"url": "statig/img2.jpeg"},
                {"url": "statig/img3.jpeg"},
                {"url": "statig/img4.jpeg"},
                {"url": "statig/img5.jpeg"},
                {"url": "statig/img6.jpeg"},
            ],
            "timestamp": "2016-07-27T07:45:00Z"

        },
        {
            "type": "day",
            "content": {
                "day": "2016-07-27T07:45:00Z",
                "weather": "assets/sunny.jpg"
            },
            "timestamp": "2016-07-27T07:45:00Z"
        },
        {
            "type": "text",
            "content": {
                "title": "Ein tag im wald",
                "text": "Es war schoen wir waren wandern :)"
            },
            "timestamp": "2016-07-27T07:45:00Z"
        },
        {
            "type": "location",
            "content": {
                "long": "1.1.1.1.1.1",
                "lat": "1.1.1.1.1"
            }
        }
    ]

    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 10))
    return dumps({
        "_links": {
            "self": {"href": f"/timeline?offset={offset}&limit={limit}"},
            "next": {"href": f"/timeline?offset={offset + limit}&limit={limit}"}
        },
        "count": len(posts),
        "total": len(posts) + 10 ,
        "posts": posts
    })

@posts_api.route("/day", methods=["POST"])
#@jwt_required
def insert_post():
 #   current_user = get_jwt_identity()

    date = datetime.now()
    try:
        resp = request.get(
            "http://api.openweathermap.org/data/2.5/weather?q=Bern,CH&appid=86d135eb406e3eb88e6fa5181a4e584c"
        ).json()
    except err:
        raise ApiError(f"Failed to get weather {err}!")

    post = {
        "type": "date",
        "content": {
            "date": datetime.now(),
            "degrees": resp["main"]["temp"] - 273.15, # degrees in celsius
            "icon": f"https://openweathermap.org/img/wn/{resp['weather']['icon']}@2x.png",
            "timestamp": datetime.now(),
        }
    }
    post_id = current_app.mongo.db.posts.insert_one(post).inserted_id
    return jsonify({"post_id": str(post_id)}), 201


@timeline_api.route("/", methods=["GET"])
@jwt_required
def following_timeline():
    current_user = get_jwt_identity()
    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 10))

    following = list(current_app.mongo.db.users.find(
        {"username": current_user["username"]},
        {"following": 1, "_id": 0}))[0]["following"]

    following.append(current_user["username"])

    posts_query = current_app.mongo.db.posts.find(
            {"username": {"$in": following}}).skip(
                    offset).limit(limit).sort(
                            "timestamp", pymongo.DESCENDING)
    total_posts = current_app.mongo.db.posts.count()
    posts = list(posts_query)

    for post in posts:
        post["reaction_summary"] = sorted([
                (k, len(list(v))) for k, v
                in itertools.groupby(
                    sorted(post["reactions"], key=lambda x: x["message"]), key=lambda x: x["message"])
                ], key=lambda x: x[1], reverse=True)

    return dumps({
        "_links": {
            "self": {"href": f"/timeline?offset={offset}&limit={limit}"},
            "next": {"href": f"/timeline?offset={offset + limit}&limit={limit}"}
        },
        "count": len(posts),
        "total": total_posts,
        "posts": posts
    })


@timeline_api.route("/<string:username>", methods=["GET"])
@jwt_required
def user_timeline(username):
    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 10))

    posts_query = current_app.mongo.db.posts.find({"username": username}).skip(
            offset).limit(limit).sort("timestamp", pymongo.DESCENDING)
    total_posts = current_app.mongo.db.posts.count()
    posts = list(posts_query)

    for post in posts:
        post["reaction_summary"] = sorted([
                (k, len(list(v))) for k, v
                in itertools.groupby(sorted(post["reactions"], key=lambda x: x["message"]), key=lambda x: x["message"])
                ], key=lambda x: x[1], reverse=True)

    return dumps({
        "_links": {
            "self": {"href": f"/timeline/{username}?offset={offset}&limit={limit}"},
            "next": {"href": f"/timeline/{username}?offset={offset + limit}&limit={limit}"}
        },
        "count": len(posts),
        "total": total_posts,
        "posts": posts
    })


@users_api.route("/", methods=["GET"])
#@jwt_required
def search_user():
    current_user = get_jwt_identity()
    username = request.args.get("username", "")
    following = list(current_app.mongo.db.users.find(
        {"username": current_user["username"]},
        {"following": 1, "_id": 0}))[0]["following"]


    users_raw = current_app.mongo.db.users.find(
            {"username": {"$regex": username, "$options": "i"}}).sort("username")
    users = []
    for user in users_raw:
        users.append({
            "key": str(user["_id"]),
            "username": user["username"],
            "following": user["username"] in following
        })

    return dumps({
        "users": users
    })


@users_api.route("/<string:username>", methods=["GET"])
#@jwt_required
def user_profile(username):
    posts = list(current_app.mongo.db.posts.find({"username": username}))
    attention_points = sum(len(x["reactions"]) for x in posts)
    following = list(current_app.mongo.db.users.find(
        {"username": username}))[0]["following"]
    return dumps({
        "username": username,
        "post_count": len(posts),
        "attention_points": attention_points,
        "following": following
    })
