from .db import db
from enum import Enum
from flask_bcrypt import generate_password_hash, check_password_hash


class Role(Enum):
    ADMIN = 'admin'
    TEACHER = 'teacher'
    STUDENT = 'student'
    PARENT = 'parent'

# class PastabosTipas(Enum):
#   PAGYRIMAS = 'pagyrimas'
#   PASTABA = 'pastaba'


class Users(db.Document):
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True, min_length=6)
    role = db.EnumField(Role, required=True)
    firstName = db.StringField(required=True, default="nameless")
    lastName = db.StringField(required=True, default="last nameless")
    # listfield of grades
    # listfield of pastabos

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Groups(db.Document):
    #groupName = db.StringField
    teacher = db.ReferenceField('Users')
    students = db.ListField(db.ReferenceField('Users'))
    subject = db.StringField(required=True)

# class Grades():

# class Pastabos():

# class Subject()
#   
