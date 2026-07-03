from sqlalchemy.orm import Session

from app.models.report import Report


def create_report(
        db: Session,
        report: Report
):
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_user_reports(
        db: Session,
        user_id: int
):
    return (
        db.query(Report)
        .filter(
            Report.user_id == user_id
        )
        .all()
    )


def get_report_by_id(
        db: Session,
        report_id: int
):
    return (
        db.query(Report)
        .filter(
            Report.id == report_id
        )
        .first()
    )


def get_all_reports(
        db: Session
):
    return db.query(
        Report
    ).all()