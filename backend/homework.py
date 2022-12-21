from flask import Response, request, jsonify
from flask_restful import Resource
from database.models import Homeworks
from group import Groups
from user import User, Role
from flask_jwt_extended import jwt_required, get_jwt_identity
from errors import TeacherNotFoundInGroup


class Homework(Resource):
    @jwt_required()
    def post(self):
        teacher_id = get_jwt_identity()
        User.checkIfRole(self, teacher_id, Role.TEACHER)
        teacher = User.getObj(self, teacher_id)
        body = request.get_json()  # group_id , value, date_due
        sons = [group.to_mongo() for group in Groups.objects(teacher__in=[teacher])]
        dicts = [son.to_dict() for son in sons]
        group_ids = [group_dict["_id"] for group_dict in dicts]
        string_ids = [str(obj_id) for obj_id in group_ids]
        if body["group"] not in string_ids:
            raise TeacherNotFoundInGroup

        homework = Homeworks(**body)
        homework.save()
        return Response(homework.to_json(), mimetype="application/json", status=200)


class StudentAllHomeworks(Resource):
    @jwt_required()
    def get(self):
        student_id = get_jwt_identity()
        student = User.getObj(self, student_id)
        sons = [group.to_mongo() for group in Groups.objects()]
        dicts = [son.to_dict() for son in sons]
        id_array = []
        for group_dict in dicts:
            for student in group_dict["students"]:
                if str(student_id) == str(student["_id"]["$oid"]):
                    id_array.append(str(group_dict["_id"]))
        return jsonify(Homeworks.objects(group__in=id_array))


class TeacherAllHomeworks(Resource):
    @jwt_required()
    def get(self):
        teacher_id = get_jwt_identity()
        teacher = User.getObj(self, teacher_id)
        sons = [group.to_mongo() for group in Groups.objects(teacher__in=[teacher])]
        dicts = [son.to_dict() for son in sons]
        id_array = []
        for group_dict in dicts:
            id_array.append(str(group_dict["_id"]))
        return jsonify(Homeworks.objects(group__in=id_array))