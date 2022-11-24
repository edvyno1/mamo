class UnauthorizedError(Exception):
    pass


class PermissionError(Exception):
    pass


errors = {
    "UnauthorizedError": {
        "message": "Invalid username or password",
        "status": 401
    },
    "PermissionError": {
        "message": "You do not have the permissions to do this action",
        "status": 403
    }
}
