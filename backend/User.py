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
            return Users.objects.get(id=user_id)
        except (DoesNotExist):
            raise UserDoesNotExist
        except (ValidationError):
            raise InvalidUserID

    @jwt_required()
    def put(self, user_id):
        admin_id = get_jwt_identity()
        User.checkIfAdmin(self, admin_id)
        user = User.get(self, user_id)
        body = request.get_json()
        if "password" in body:
            body["password"] = generate_password_hash(body["password"]).decode('utf8')
        user.update(**body)  # need validation

    @jwt_required()
    def delete(self, user_id):
        admin_id = get_jwt_identity()
        User.checkIfAdmin(self, admin_id)
        user = User.get(self, user_id)
        user.delete()

    def checkIfAdmin(self, user_id):
        user = User.get(self, user_id)
        if user.role != Role.ADMIN:
            raise PermissionError
        else:
            pass


class UserList(Resource):
    def get(self):
        users = Users.objects().to_json()
        return Response(users, mimetype="application/json", status=200)

    @jwt_required()
    def post(self):
        admin_id = get_jwt_identity()
        User.checkIfAdmin(self, admin_id)
        body = request.get_json()
        users = Users(**body)
        users.hash_password()
        users.save()
        return Response(users.to_json(), mimetype="application/json", status=200)
