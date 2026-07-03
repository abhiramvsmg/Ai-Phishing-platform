from sqlalchemy.orm import Session

from app.repositories.user_repository import (
    get_all_users
)

from app.repositories.scan_repository import (
    get_all_scans
)

from app.repositories.report_repository import (
    get_all_reports
)

from app.repositories.activity_repository import (
    get_all_activities
)


def admin_users(
        db: Session
):
    return get_all_users(db)


def admin_scans(
        db: Session
):
    return get_all_scans(db)


def admin_reports(
        db: Session
):
    return get_all_reports(db)


def admin_activities(
        db: Session
):
    return get_all_activities(db)