from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog


def create_log(
        db: Session,
        log: ActivityLog
):
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def get_user_logs(
        db: Session,
        user_id: int
):
    return (
        db.query(ActivityLog)
        .filter(
            ActivityLog.user_id == user_id
        )
        .order_by(
            ActivityLog.created_at.desc()
        )
        .all()
    )


def get_all_activities(
        db: Session
):
    return db.query(
        ActivityLog
    ).all()