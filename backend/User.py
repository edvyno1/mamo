from flask import Response, request
from flask_restful import Resource
from database.db import db
from database.models import Users
from bson import json_util, objectid
import json
from flask_jwt_extended import jwt_required, get_jwt_identity


def parse_json(data):
    return json.loads(json_util.dumps(data))


class User(Resource):
    def get(self, user_id):
        return parse_json([i for i in db.users.find({"_id": objectid.ObjectId(user_id)})])

    def put(self, user_id):
        print("lol")


class UserList(Resource):
    def get(self):
        users = Users.objects().to_json()
        return Response(users, mimetype="application/json", status=200)

    def post(self):
            # parser = reqparse.RequestParser()
            # parser.add_argument('username', type=str)
            # parser.add_argument('password', type=str)
            # args = parser.parse_args()
            # username = args["username"]
            # password = args["password"]
        
        # user_id = get_jwt_identity()
        # print(user_id)
        body = request.get_json()
        users = Users(**body)
        users.hash_password()
        users.save()
        print(body)
        # db.users.insert_one(
        #     {
        #         "username": username,
        #         "password": password
        #     }
        # )
