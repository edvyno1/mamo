from .db import db
from enum import Enum
from flask_bcrypt import generate_password_hash, check_password_hash


class Role(Enum):
    ADMIN = 'admin'
    TEACHER = 'teacher'
    STUDENT = 'student'
    PARENT = 'parent'


class NoteType(Enum):
    COMMENDATION = 'commendation'
    REPRIMAND = 'reprimand'


class Users(db.Document):
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True, min_length=6)
    role = db.EnumField(Role, required=True)
    firstName = db.StringField(required=True, default="nameless")
    lastName = db.StringField(required=True, default="last nameless")

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Groups(db.Document):
    teacher = db.ReferenceField('Users')
    students = db.ListField(db.DictField(db.ReferenceField('Users')))
    subject = db.StringField(required=True)


class Grades(db.Document):
    group = db.ReferenceField('Groups')
    student = db.ReferenceField('Users')
    value = db.IntField(required=True)
    date = db.DateTimeField(required=True)


class Notes(db.Document):
    group = db.ReferenceField('Groups')
    student = db.ReferenceField('Users')
    value = db.StringField(required=True)
    date = db.DateTimeField(required=True)
    type = db.EnumField(NoteType, required=True)


class Homeworks(db.Document):
    group = db.ReferenceField('Groups')
    value = db.StringField(required=True)
    date_due = db.DateTimeField(required=True)
