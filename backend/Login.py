from flask import request
from flask_jwt_extended import create_access_token
from database.models import User
from flask_restful import Resource
import datetime



class LoginApi(Resource):
    def post(self):
        # try:
        body = request.get_json()
        user = User.objects.get(username=body.get('username'))
        authorized = user.check_password(body.get('password'))
        if not authorized:
            raise UnauthorizedError

        expires = datetime.timedelta(days=7)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)
        return {'token': access_token}, 200
        # except (UnauthorizedError, DoesNotExist):
        #     raise UnauthorizedError
        # except Exception as e:
        #     raise InternalServerError