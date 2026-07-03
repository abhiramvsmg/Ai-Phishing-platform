from fastapi import Depends, HTTPException

from app.dependencies.auth import get_current_user
from app.models.user import User


def require_admin(
        current_user: User = Depends(
            get_current_user
        )
):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    return current_user