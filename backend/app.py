
from flask import Flask
from flask_restful import Api
from flask_cors import CORS  # comment this on deployment
from flask_jwt_extended import JWTManager
from database.db import initialize_db

from user import User, UserList
from login import LoginApi
from group import Group, GroupList, GroupByUser
from errors import errors

app = Flask(__name__, static_url_path='', static_folder='frontend/')
app.config["MONGO_URI"] = "mongodb://localhost:27017/mamo_db"
CORS(app)  # comment this on deployment
api = Api(app, errors=errors)

app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)

api.add_resource(User, '/users/<user_id>')
api.add_resource(UserList, '/users')

api.add_resource(Group, '/groups/<group_id>')
api.add_resource(GroupList, '/groups')
api.add_resource(GroupByUser, '/groups/user')

api.add_resource(LoginApi, '/login')
initialize_db(app)
