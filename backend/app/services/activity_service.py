from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog

from app.repositories.activity_repository import (
    create_log,
    get_user_logs
)


def log_activity(
        db: Session,
        user_id: int,
        action: str,
        description: str,
        ip_address: str = None
):
    log = ActivityLog(
        user_id=user_id,
        action=action,
        description=description,
        ip_address=ip_address
    )

    return create_log(
        db,
        log
    )


def get_logs(
        db: Session,
        user_id: int
):
    return get_user_logs(
        db,
        user_id
    )