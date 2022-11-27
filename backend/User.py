from flask import Response, request
from flask_restful import Resource
from database.models import Users, Role
from errors import PermissionError, UserDoesNotExist, InvalidUserID
from mongoengine.errors import DoesNotExist, ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_bcrypt import generate_password_hash


class User(Resource):
    def get(self, user_id):
        try:
            return Users.objects.get(id=user_id).to_json()
        except (DoesNotExist):
            raise UserDoesNotExist
        except (ValidationError):
            raise InvalidUserID

    @jwt_required()
    def put(self, user_id):
        admin_id = get_jwt_identity()
        if not User.isAdmin(self, admin_id):
            raise PermissionError
        user = User.get(self, user_id)
        body = request.get_json()
        if "password" in body:
            body["password"] = generate_password_hash(body["password"]).decode('utf8')
        user.update(**body)  # need validation

    @jwt_required()
    def delete(self, user_id):
        admin_id = get_jwt_identity()
        if not User.isAdmin(self, admin_id):
            raise PermissionError  # perhaps reuse this in isAdmin func
        user = User.get(self, user_id)
        user.delete()

    def isAdmin(self, user_id):
        user = User.get(self, user_id)
        return True if user.role == Role.ADMIN else False


class UserList(Resource):
    def get(self):
        users = Users.objects().to_json()
        return Response(users, mimetype="application/json", status=200)

    @jwt_required()
    def post(self):
        admin_id = get_jwt_identity()
        if not User.isAdmin(self, admin_id):
            raise PermissionError
        body = request.get_json()
        users = Users(**body)
        users.hash_password()
        users.save()
        return Response(users.to_json(), mimetype="application/json", status=200)
