from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.schemas.profile import (
    UpdateNameRequest,
    ChangePasswordRequest,
    ProfileResponse
)

from app.services.profile_service import (
    update_profile_name,
    change_password
)

router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


@router.get("/me")
def get_profile(
        current_user: User = Depends(
            get_current_user
        )
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


@router.put("/me", response_model=ProfileResponse)
def update_profile(
        request: UpdateNameRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):
    return update_profile_name(
        db,
        current_user,
        request.name
    )


@router.put("/me/password")
def update_password(
        request: ChangePasswordRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):
    updated = change_password(
        db,
        current_user,
        request.current_password,
        request.new_password
    )

    if not updated:
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    return {
        "message": "Password updated successfully"
    }
