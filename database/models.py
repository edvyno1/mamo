from .db import db
from flask_bcrypt import generate_password_hash, check_password_hash


class User(db.Document):
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True, min_length=6)
    # questions = db.ListField(db.ReferenceField('Question', reverse_delete_rule=db.PULL))
    # comments = db.ListField(db.ReferenceField('Comments', reverse_delete_rule=db.PULL))
    # answers = db.ListField(db.ReferenceField('Answers', reverse_delete_rule=db.PULL))
    # answers_comment = db.ListField(db.ReferenceField('AnswerComments', reverse_delete_rule=db.PULL))

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password, password)