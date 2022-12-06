from flask import Response, request, jsonify
from flask_restful import Resource
from database.models import Grades
from group import Groups
from user import Users, User, Role
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
        print(sons)
        for son in sons:
            dict = son.to_dict()
            if body["group"] == str(dict["_id"]):
                for student in dict["students"]:
                    if str(student) == body["student"]:
                        grade = Grades(**body)
                        grade.save()
                        return Response(grade.to_json(), mimetype="application/json", status=200)
            else:
                raise TeacherNotFoundInGroup
        raise StudentNotFoundInGroup
