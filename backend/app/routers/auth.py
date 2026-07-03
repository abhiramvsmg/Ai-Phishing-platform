from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse
)

from app.services.auth_service import (
    register,
    login
)

from app.database.session import (
    get_db
)

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
def register_user(
        request: RegisterRequest,
        db: Session = Depends(get_db)
):
    user = register(
        db,
        request.name,
        request.email,
        request.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )

    return {
        "message":
        "User registered successfully"
    }


@router.post(
    "/login",
    response_model=TokenResponse
)
def login_user(
        request: LoginRequest,
        db: Session = Depends(get_db)
):
    token = login(
        db,
        request.email,
        request.password
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    token = login(
        db,
        form_data.username,
        form_data.password
    )

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return {
        "access_token": token,
        "token_type": "bearer"
    }