import itertools
from datetime import datetime

import pymongo
import requests
from flask import Blueprint, request, jsonify
from flask import current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.json_util import dumps

from chinderbuech.errors import ApiError


timeline_api = Blueprint("timeline", "timeline")
posts_api = Blueprint("posts", "posts")

@timeline_api.route("/dummy", methods=["GET"])
def dummy_data():

    posts = [
        {
            "type": "day",
            "content": {
                "day": "2016-07-27T00:00:00Z",
                "weather": "cloudy",
                "degrees": 6
            },
            "timestamp": "2016-07-27T07:45:00Z"
        },
        {
            "type": "image-grid",
            "content": { "images": [
                {"url": "/static/img1.jpeg"},
                {"url": "/static/img2.jpeg"},
                {"url": "/static/img3.jpeg"},
                {"url": "/static/img4.jpeg"},
                {"url": "/static/img5.jpeg"},
                {"url": "/static/img6.jpeg"},
            ]},
            "timestamp": "2016-07-27T00:00:00Z"

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
        },
        {
            "type": "day",
            "content": {
                "day": "2016-07-26T07:45:00Z",
                "weather": "sunny",
                "degrees": 10
            },
            "timestamp": "2016-07-27T07:45:00Z"
        },
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
