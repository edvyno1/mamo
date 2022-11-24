from .db import db
from enum import Enum
from flask_bcrypt import generate_password_hash, check_password_hash


class Role(Enum):
    ADMIN = 'admin'
    TEACHER = 'teacher'
    STUDENT = 'student'
    PARENT = 'parent'


class Users(db.Document):
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True, min_length=6)
    role = db.EnumField(Role, required=True)
    name = db.StringField(required=True, default="nameless")
    lastName = db.StringField(required=True, default="last nameless")

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password, password)