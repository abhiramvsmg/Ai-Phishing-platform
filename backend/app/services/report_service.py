from sqlalchemy.orm import Session

from app.models.report import Report

from app.repositories.report_repository import (
    create_report,
    get_user_reports,
    get_report_by_id
)

from app.repositories.scan_repository import (
    get_scan_by_id
)

from app.services.activity_service import (
    log_activity
)


def generate_report(
        db: Session,
        user_id: int,
        scan_id: int
):
    scan = get_scan_by_id(
        db,
        scan_id
    )

    if not scan:
        return None

    details = (
        f"URL: {scan.content}\n"
        f"Result: {scan.result}\n"
        f"Risk Score: {scan.risk_score}\n"
        f"Risk Level: {scan.risk_level}"
    )

    report = Report(
        user_id=user_id,
        scan_id=scan.id,
        report_type="SCAN_REPORT",
        details=details
    )

    saved_report = create_report(
        db,
        report
    )

    log_activity(
        db,
        user_id,
        "GENERATE_REPORT",
        f"Generated report for scan {scan.id}"
    )

    return saved_report


def get_reports(
        db: Session,
        user_id: int
):
    return get_user_reports(
        db,
        user_id
    )


def get_report(
        db: Session,
        report_id: int
):
    return get_report_by_id(
        db,
        report_id
    )