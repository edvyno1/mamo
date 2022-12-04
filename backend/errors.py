class UnauthorizedError(Exception):
    pass


class PermissionError(Exception):
    pass


class UserDoesNotExist(Exception):
    pass


class NotATeacherError(Exception):
    pass


class NotAStudentError(Exception):
    pass


class InvalidUserID(Exception):
    pass


errors = {
    "UnauthorizedError": {
        "message": "Invalid username or password",
        "status": 401
    },
    "PermissionError": {
        "message": "You do not have the permissions to do this action",
        "status": 403
    },
    "UserDoesNotExist": {
        "message": "Unable to find user with given ID",
        "status": 404
    },
    "NotATeacherError": {
        "message": "Given user is not a teacher",
        "status": 401
    },
    "NotAStudentError": {
        "message": "Given user is not a student",
        "status": 401
    },
    "InvalidUserID": {
        "message": "Given user ID is not valid",
        "status": 401
    },
}
