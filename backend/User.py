from flask import Response, request
from flask_restful import Resource
from database.models import Users, Role
from backend.errors import PermissionError
from flask_jwt_extended import jwt_required, get_jwt_identity


class User(Resource):
    def get(self, user_id):
        return Users.objects.get(id=user_id)

    def put(self, user_id):
        print("lol")


class UserList(Resource):
    def get(self):
        users = Users.objects().to_json()
        return Response(users, mimetype="application/json", status=200)

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.get(self, user_id)
        if user.role != Role.ADMIN:
            raise PermissionError
        body = request.get_json()
        users = Users(**body)
        users.hash_password()
        users.save()
        return Response(status=200)
