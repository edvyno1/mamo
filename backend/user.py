from flask import Response, request, jsonify
from flask_restful import Resource
from database.models import Users, Role
from errors import PermissionError, UserDoesNotExist, InvalidUserID, NotAStudentError, NotATeacherError
from mongoengine.errors import DoesNotExist, ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_bcrypt import generate_password_hash


class User(Resource):
    def get(self, user_id):
        return jsonify(self.getObj(user_id))

    def getObj(self, user_id):
        try:
            return Users.objects.get(id=user_id)
        except (DoesNotExist):
            raise UserDoesNotExist
        except (ValidationError):
            raise InvalidUserID

    @jwt_required()
    def put(self, user_id):
        admin_id = get_jwt_identity()
        User.checkIfRole(self, admin_id, Role.ADMIN)
        user = User.getObj(self, user_id)
        body = request.get_json()
        if "password" in body:
            body["password"] = generate_password_hash(body["password"]).decode('utf8')
        user.update(**body)  # need validation

    @jwt_required()
    def delete(self, user_id):
        admin_id = get_jwt_identity()
        User.checkIfRole(self, admin_id, Role.ADMIN)
        user = User.getObj(self, user_id)
        user.delete()

    def checkIfRole(self, user_id, role: Role):
        user = User.getObj(self, user_id)
        if user.role != role:
            if role == Role.TEACHER:
                raise NotATeacherError
            if role == Role.STUDENT:
                raise NotAStudentError
            if role == Role.ADMIN:
                raise PermissionError


class UserList(Resource):
    def get(self):
        users = Users.objects().to_json()
        return Response(users, mimetype="application/json", status=200)

    @jwt_required()
    def post(self):
        admin_id = get_jwt_identity()
        User.checkIfRole(self, admin_id, Role.ADMIN)
        body = request.get_json()
        users = Users(**body)
        users.hash_password()
        users.save()
        return Response(users.to_json(), mimetype="application/json", status=200)
