from sqlalchemy.orm import Session

from app.models.scan import ScanHistory

from app.repositories.scan_repository import (
    create_scan,
    get_user_scans,
    get_scan_by_id,
    search_scans,
    delete_scan,
    get_flagged_scans
)

from app.services.detection_service import (
    analyze_url,
    analyze_email,
    analyze_text
)

from app.services.activity_service import (
    log_activity
)


def scan_url(
        db: Session,
        user_id: int,
        url: str
):

    analysis = analyze_url(url)

    scan = ScanHistory(
        user_id=user_id,
        scan_type="URL",
        content=url,
        result=analysis["result"],
        risk_score=analysis["risk_score"],
        risk_level=analysis["risk_level"]
    )

    saved_scan = create_scan(
        db,
        scan
    )

    log_activity(
        db,
        user_id,
        "URL_SCAN",
        f"Scanned URL: {url}"
    )

    return saved_scan


def scan_email(
        db: Session,
        user_id: int,
        email_text: str
):

    analysis = analyze_email(
        email_text
    )

    scan = ScanHistory(
        user_id=user_id,
        scan_type="EMAIL",
        content=email_text,
        result=analysis["result"],
        risk_score=analysis["risk_score"],
        risk_level=analysis["risk_level"]
    )

    saved_scan = create_scan(
        db,
        scan
    )

    log_activity(
        db,
        user_id,
        "EMAIL_SCAN",
        "Scanned email content"
    )

    return saved_scan


def scan_text(
        db: Session,
        user_id: int,
        text: str
):

    analysis = analyze_text(text)

    scan = ScanHistory(
        user_id=user_id,
        scan_type="TEXT",
        content=text,
        result=analysis["result"],
        risk_score=analysis["risk_score"],
        risk_level=analysis["risk_level"]
    )

    saved_scan = create_scan(
        db,
        scan
    )

    log_activity(
        db,
        user_id,
        "TEXT_SCAN",
        "Scanned text content"
    )

    return saved_scan


def get_my_scans(
        db: Session,
        user_id: int
):
    return get_user_scans(
        db,
        user_id
    )


def get_scan(
        db: Session,
        scan_id: int
):
    return get_scan_by_id(
        db,
        scan_id
    )


def search_my_scans(
        db: Session,
        user_id: int,
        keyword: str
):
    return search_scans(
        db,
        user_id,
        keyword
    )


def remove_scan(
        db: Session,
        scan_id: int
):
    return delete_scan(
        db,
        scan_id
    )


def get_my_flagged_scans(
        db: Session,
        user_id: int
):
    return get_flagged_scans(
        db,
        user_id
    )