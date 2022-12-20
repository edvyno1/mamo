from flask import jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from database.models import Grades


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