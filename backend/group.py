from flask import Response, request, jsonify
from flask_restful import Resource
from database.models import Role, Groups
from user import User
from mongoengine.errors import DoesNotExist
from flask_jwt_extended import jwt_required, get_jwt_identity


class Group(Resource):
    def get(self, group_id):
        return jsonify(self.getObj(group_id))

    def getObj(self, group_id):
        try:
            return Groups.objects.get(id=group_id)
        except (DoesNotExist):
            raise DoesNotExist

    @jwt_required()
    def put(self, group_id):
        admin_id = get_jwt_identity()
        User.checkIfRole(self, admin_id, Role.ADMIN)
        group = User.getObj(self, group_id)
        body = request.get_json()
        group.update(**body)  # need validation

    @jwt_required()
    def delete(self, group_id):
        admin_id = get_jwt_identity()
        User.checkIfRole(self, admin_id, Role.ADMIN)
        group = Group.getObj(self, group_id)
        group.delete()


class GroupList(Resource):
    def get(self):
        groups = Groups.objects().to_json()
        return Response(groups, mimetype="application/json", status=200)

    @jwt_required()
    def post(self):
        admin_id = get_jwt_identity()
        User.checkIfRole(self, admin_id, Role.ADMIN)
        body = request.get_json()
        teacher_id = body["teacher"]
        User.checkIfRole(self, teacher_id, Role.TEACHER)
        student_ids = body["students"]
        for id in student_ids:
            User.checkIfRole(self, id, Role.STUDENT)
        groups = Groups(**body)
        groups.save()
        return Response(groups.to_json(), mimetype="application/json", status=200)


class GroupByUser(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.getObj(self, user_id)
        if user.role == Role.STUDENT:
            return jsonify(Groups.objects(students__in=[user]))
        return jsonify(Groups.objects(teacher__in=[user]))
