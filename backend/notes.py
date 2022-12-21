from flask import Response, request, jsonify
from flask_restful import Resource
from database.models import Notes, Groups
from user import User, Role
from flask_jwt_extended import jwt_required, get_jwt_identity
from errors import StudentNotFoundInGroup, TeacherNotFoundInGroup


class Note(Resource):
    @jwt_required()
    def post(self):
        teacher_id = get_jwt_identity()
        User.checkIfRole(self, teacher_id, Role.TEACHER)
        teacher = User.getObj(self, teacher_id)
        body = request.get_json()  # group_id, student_id , value, date, type
        sons = [group.to_mongo() for group in Groups.objects(teacher__in=[teacher])]
        dicts = [son.to_dict() for son in sons]
        group_ids = [group_dict["_id"] for group_dict in dicts]
        string_ids = [str(obj_id) for obj_id in group_ids]
        if body["group"] not in string_ids:
            raise TeacherNotFoundInGroup

        for group_dict in dicts:
            for student in group_dict["students"]:
                if str(student["_id"]["$oid"]) == body["student"]:
                    note = Notes(**body)
                    note.save()
                    return Response(note.to_json(), mimetype="application/json", status=200)
        raise StudentNotFoundInGroup


class StudentAllNotes(Resource):
    @jwt_required()
    def get(self):
        student_id = get_jwt_identity()
        student = User.getObj(self, student_id)
        return jsonify(Notes.objects(student__in=[student]))


class TeacherAllNotes(Resource):
    @jwt_required()
    def get(self):
        teacher_id = get_jwt_identity()
        teacher = User.getObj(self, teacher_id)
        sons = [grade.to_mongo() for grade in Groups.objects(teacher__in=[teacher])]
        dicts = [son.to_dict() for son in sons]
        id_array = []
        for group_dict in dicts:
            id_array.append(str(group_dict["_id"]))
        return jsonify(Notes.objects(group__in=id_array))