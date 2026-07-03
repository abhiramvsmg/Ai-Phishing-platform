from sqlalchemy.orm import Session

from app.models.user import User

from app.repositories.user_repository import (
    get_user_by_email,
    create_user
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


def register(
        db: Session,
        name: str,
        email: str,
        password: str
):
    existing_user = get_user_by_email(
        db,
        email
    )

    if existing_user:
        return None

    hashed_password = hash_password(
        password
    )

    user = User(
        name=name,
        email=email,
        password_hash=hashed_password
    )

    return create_user(
        db,
        user
    )


def login(
        db: Session,
        email: str,
        password: str
):
    user = get_user_by_email(
        db,
        email
    )

    if not user:
        return None

    valid = verify_password(
        password,
        user.password_hash
    )

    if not valid:
        return None

    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role
        }
    )

    return token