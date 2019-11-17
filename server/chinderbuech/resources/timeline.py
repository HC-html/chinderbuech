import itertools
from datetime import datetime
from datetime import timedelta

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

def __get_day_of(name, date):

    start = date.replace(hour=0, minute=0, second=0, microsecond=0);
    end =  date.replace(hour=23, minute=59, second=59, microsecond=999);

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
        .sort("content.smiles", pymongo.DESCENDING))

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

    def to_date(date_string):
        return datetime.strptime(date_string, "%Y-%m-%d")
    date = request.args.get('date', default = datetime.now(), type = to_date)

    print(f"Got date {date}")

    db_child = None
    if child:
        # calculate previous date offset
        db_child = current_app.mongo.db.children.find_one({
            "name": child
        })

        if not db_child:
            raise ApiError(f"Child {child} not found!")

    next_date = None
    prev_date = None
    if db_child:
        offset=1
        while not next_date:
            if (date + timedelta(days=offset)).weekday() in db_child['weekdays']:
                next_date = date+ timedelta(days=offset)
            else:
                offset = offset + 1

        offset=1
        while not prev_date:
            if (date - timedelta(days=offset)).weekday() in db_child['weekdays']:
                prev_date = date - timedelta(days=offset)
            else:
                offset = offset + 1
    else:
        next_date = date + timedelta(days=1)
        prev_date = date - timedelta(days=1)

    timeline = []
    if not child or (db_child and date.weekday() in db_child['weekdays']):
        start = date.replace(hour=0, minute=0, second=0, microsecond=0);
        end =  date.replace(hour=23, minute=59, second=59, microsecond=999);

        # Get all posts of today
        posts_query = (current_app.mongo.db.posts
            # get todays images of the person with 'name'
            .find({
                "$and": [{
                    "timestamp": {
                        "$gte": start,
                        "$lt": end
                    },
                }]
            })
            #.skip(offset)
            #.limit(limit)
            .sort("timestamp", pymongo.DESCENDING))

        total_posts = current_app.mongo.db.posts.count()
        posts = list(posts_query)

        def __get_image_content(image_post):
            return {
                "_id": image_post["_id"],
                "url": f"/static/img/{image_post['content']['filename']}",
                "children": image_post['content']['children'],
                "aspectRatio": image_post["content"]["aspect"]
            }

        def __group_images(child, img_posts):
            if child:
                child_filter = filter(lambda p: child in p['content']['children'], img_posts)
                not_child_filter = filter(lambda p: not child in p['content']['children'], img_posts)
                img_posts = list(child_filter) + list(not_child_filter)

            return {
                "type": "image-grid",
                "content": { "images": [__get_image_content(p) for p in img_posts]},
                "timestamp": img_posts[0]["timestamp"]
            }

        timeline = []
        group_posts = []
        for post in posts:
            if post["type"] == "image":
                group_posts.append(post)
            else:
                if len(group_posts) > 0:
                    timeline.append(__group_images(child, group_posts))
                    group_posts = []
                timeline.append(post)

        if len(group_posts) > 0:
            timeline.append(__group_images(child, group_posts))

        children = list(current_app.mongo.db.children.find({
            "weekdays": date.weekday()
        }))

        print(f"Found children {children}")
        if len(timeline) > 0 and timeline[0]['type'] == 'day':
            clist = [f"{c['name'].split('.')[0].capitalize()} {c['name'].split('.')[1].capitalize()}"
                for c in children]
            timeline[0]['content']['children'] = clist
        if child:
            # insert the post of the day after the day
            post_of_the_day = __get_day_of(child, date)
            if post_of_the_day:
                timeline.insert(1, {
                    "type": "hero",
                    "content": {
                        "title": f"So war {child.split('.')[0].capitalize()}'s Tag",
                        "image": __get_image_content(post_of_the_day)
                    }
                })

    return dumps({
        "_links": {
            "prev": {"href": f"/timeline/{child}?date={prev_date.date()}"},
            "next": {"href": f"/timeline/{child}?date={next_date.date()}"}
        },
        "timeline": timeline,
        "dates": {
            "next": next_date,
            "prev": prev_date
        }
    })
