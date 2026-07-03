from sqlalchemy.orm import Session

from app.models.user import User

from app.repositories.user_repository import (
    update_user
)

from app.core.security import (
    hash_password,
    verify_password
)


def update_profile_name(
        db: Session,
        user: User,
        name: str
):
    user.name = name

    return update_user(
        db,
        user
    )


def change_password(
        db: Session,
        user: User,
        current_password: str,
        new_password: str
):
    if not verify_password(
        current_password,
        user.password_hash
    ):
        return None

    user.password_hash = hash_password(
        new_password
    )

    return update_user(
        db,
        user
    )
