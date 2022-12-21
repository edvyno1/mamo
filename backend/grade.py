from flask import Response, request, jsonify
from flask_restful import Resource
from database.models import Grades
from group import Groups
from user import User, Role
from flask_jwt_extended import jwt_required, get_jwt_identity
from errors import StudentNotFoundInGroup, TeacherNotFoundInGroup


class Grade(Resource):
    @jwt_required()
    def post(self):
        teacher_id = get_jwt_identity()
        User.checkIfRole(self, teacher_id, Role.TEACHER)
        teacher = User.getObj(self, teacher_id)
        body = request.get_json()  # group_id, student_id , value, date
        sons = [group.to_mongo() for group in Groups.objects(teacher__in=[teacher])]
        dicts = [son.to_dict() for son in sons]
        group_ids = [group_dict["_id"] for group_dict in dicts]
        string_ids = [str(obj_id) for obj_id in group_ids]
        if body["group"] not in string_ids:
            raise TeacherNotFoundInGroup

        for group_dict in dicts:
            for student in group_dict["students"]:
                if str(student["_id"]["$oid"]) == body["student"]:
                    grade = Grades(**body)
                    grade.save()
                    return Response(grade.to_json(), mimetype="application/json", status=200)
        raise StudentNotFoundInGroup


class StudentMonthGrades(Resource):
    @jwt_required()
    def get(self, date):
        student_id = get_jwt_identity()
        student = User.getObj(self, student_id)
        year = date.split("-")[0]
        month = date.split("-")[1]
        sons = [grade.to_mongo() for grade in Grades.objects(student__in=[student])]
        dicts = [son.to_dict() for son in sons]
        id_array = []
        for grade_dict in dicts:
            if str(grade_dict["date"].year) == year and str(grade_dict["date"].month) == month:
                id_array.append(str(grade_dict["_id"]))
        return jsonify(Grades.objects(pk__in=id_array))


class TeacherGroupGrades(Resource):
    @jwt_required()
    def get(self, group_id, date):
        year = date.split("-")[0]
        month = date.split("-")[1]
        sons = [grade.to_mongo() for grade in Grades.objects(group__in=[group_id])]
        dicts = [son.to_dict() for son in sons]
        id_array = []
        for grade_dict in dicts:
            if str(grade_dict["date"].year) == year and str(grade_dict["date"].month) == month:
                id_array.append(str(grade_dict["_id"]))
        return jsonify(Grades.objects(pk__in=id_array))
