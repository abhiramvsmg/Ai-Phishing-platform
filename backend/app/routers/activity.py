from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.services.activity_service import (
    get_logs
)

router = APIRouter(
    prefix="/api/v1/activity",
    tags=["Activity"]
)


@router.get("")
def activity_logs(
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):

    return get_logs(
        db,
        current_user.id
    )