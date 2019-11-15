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

def __get_day_of(name):

    start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0);
    end =  datetime.now().replace(hour=23, minute=59, second=59, microsecond=999);

    posts_query = (current_app.mongo.db.posts
        # get todays images of the person with 'name'
        .find({
            "$and": [{
                "timestamp": {
                    "$gte": start,
                    "$lt": end
                },
                "type": "image",
                "content.children": name
            }]
        })
        .sort("timestamp", pymongo.DESCENDING))

    posts = list(posts_query)
    if len(posts) == 0:
        print(f"No pictures of {name} found for today :( ")
        return None
    else:
        print(f"Found {len(posts)} images of {name} for today!")
        return posts[0]


@timeline_api.route("/", defaults={'child': None})
@timeline_api.route("/<string:child>", methods=["GET"])
#@jwt_required
def user_timeline(child):

    offset = int(request.args.get("offset", 0))
    limit = int(request.args.get("limit", 10))


    # TODO: filter for child (only child of parent)
    posts_query = (current_app.mongo.db.posts
        .find()
        #.skip(offset)
        #.limit(limit)
        .sort("timestamp", pymongo.DESCENDING))

    total_posts = current_app.mongo.db.posts.count()
    posts = list(posts_query)

    def __group_images(img_posts):
        return {
            "type": "image-grid",
            "content": { "images": [
                    {
                        "_id": p["_id"],
                        "url": f"/static/img/{p['content']['filename']}",
                        "aspectRatio": p["content"]["aspect"]
                    } for p in img_posts
                ]
            },
            "timestamp": img_posts[0]["timestamp"]
        }

    timeline = []
    group_posts = []
    for post in posts:
        if post["type"] == "image":
            group_posts.append(post)
        else:
            if len(group_posts) > 0:
                timeline.append(__group_images(group_posts))
                group_posts = []
            timeline.append(post)

    if len(group_posts) > 0:
        timeline.append(__group_images(group_posts))

    if child:
        # insert the post of the day after the day
        post_of_the_day = __get_day_of(child)
        if post_of_the_day:
            timeline.insert(1, {
                "type": "hero",
                "content": {
                    "title": f"So war {child.split(' ')[0]}'s Tag",
                    "image": post_of_the_day["content"]
                }
            })

    return dumps({
        "_links": {
            "self": {"href": f"/timeline/?offset={offset}&limit={limit}"},
            "next": {"href": f"/timeline/?offset={offset + limit}&limit={limit}"}
        },
        "count": len(posts),
        "total": total_posts,
        "timeline": timeline
    })
