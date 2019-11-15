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


"""
@timeline_api.route("/", methods=["GET"])
#@jwt_required
def following_timeline():
    #current_user = get_jwt_identity()
    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 10))

    # TODO: filter for child (only child of parent)
    posts_query = (current_app.mongo.db.posts
        .skip(offset)
        .limit(limit)
        .sort("timestamp", pymongo.DESCENDING))

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
"""

@timeline_api.route("/", methods=["GET"])
#@jwt_required
def user_timeline():
    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 10))

    # TODO: filter for child (only child of parent)
    posts_query = (current_app.mongo.db.posts
        .find()
        .skip(offset)
        .limit(limit)
        .sort("timestamp", pymongo.DESCENDING))

    total_posts = current_app.mongo.db.posts.count()
    posts = list(posts_query)

    timeline = []
    group_posts = []
    for post in posts:
        if post["type"] == "image":
            group_posts.append(post)
        else:
            if len(group_posts) > 0:
                timeline.append({
                    "type": "image-grid",
                    "content": { "images": [
                            {
                                "_id": p["_id"],
                                "url": f"/static/img/{p['content']['filename']}",
                                "aspectRatio": p["content"]["aspect"]
                            } for p in group_posts
                        ]
                    },
                    "timestamp": group_posts[0]["timestamp"]
                })
                group_posts = []
            timeline.append(post)

    return dumps({
        "_links": {
            "self": {"href": f"/timeline/?offset={offset}&limit={limit}"},
            "next": {"href": f"/timeline/?offset={offset + limit}&limit={limit}"}
        },
        "count": len(posts),
        "total": total_posts,
        "timeline": timeline
    })
