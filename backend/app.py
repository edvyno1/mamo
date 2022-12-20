
from flask import Flask
from flask_restful import Api
from flask_cors import CORS  # comment this on deployment
from flask_jwt_extended import JWTManager
from database.db import initialize_db

from user import User, UserList, CurrentUser
from login import LoginApi
from group import Group, GroupList, GroupByUser
from grade import Grade
from teacher import TeacherGroupGrades
from student import StudentMonthGrades
from errors import errors

app = Flask(__name__, static_url_path='', static_folder='frontend/')
app.config["MONGO_URI"] = "mongodb://localhost:27017/mamo_db"
CORS(app)  # comment this on deployment
api = Api(app, errors=errors)

app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)

api.add_resource(User, '/users/<user_id>')
api.add_resource(UserList, '/users')
api.add_resource(CurrentUser, '/me')

api.add_resource(TeacherGroupGrades, '/teacher/grades/<group_id>/<date>')
api.add_resource(StudentMonthGrades, '/student/grades/<date>')

api.add_resource(Group, '/groups/<group_id>')
api.add_resource(GroupList, '/groups')
api.add_resource(GroupByUser, '/groups/user')

api.add_resource(Grade, '/grades')

api.add_resource(LoginApi, '/login')
initialize_db(app)
