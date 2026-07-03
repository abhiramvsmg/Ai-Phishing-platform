from sqlalchemy.orm import Session
from app.models.scan import ScanHistory
from sqlalchemy import extract


def create_scan(
        db: Session,
        scan: ScanHistory
):
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return scan


def get_user_scans(
        db: Session,
        user_id: int
):
    return (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == user_id
        )
        .all()
    )


def get_scan_by_id(
        db: Session,
        scan_id: int
):
    return (
        db.query(ScanHistory)
        .filter(
            ScanHistory.id == scan_id
        )
        .first()
    )




def get_total_scans(
        db: Session,
        user_id: int
):
    return (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == user_id
        )
        .count()
    )


def get_safe_scans(
        db: Session,
        user_id: int
):
    return (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == user_id,
            ScanHistory.result == "SAFE"
        )
        .count()
    )


def get_phishing_scans(
        db: Session,
        user_id: int
):
    return (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == user_id,
            ScanHistory.result == "PHISHING"
        )
        .count()
    )


def get_high_risk_scans(
        db: Session,
        user_id: int
):
    return (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == user_id,
            ScanHistory.risk_level == "HIGH"
        )
        .count()
    )

#API 1: Recent Scans

def get_recent_scans(
        db: Session,
        user_id: int,
        limit: int = 5
):
    return (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == user_id
        )
        .order_by(
            ScanHistory.created_at.desc()
        )
        .limit(limit)
        .all()
    )

#Api2: Risk distribution

def get_risk_distribution(
        db: Session,
        user_id: int
):
    scans = (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == user_id
        )
        .all()
    )

    low = 0
    medium = 0
    high = 0
    critical = 0

    for scan in scans:

        if scan.risk_level == "LOW":
            low += 1

        elif scan.risk_level == "MEDIUM":
            medium += 1

        elif scan.risk_level == "HIGH":
            high += 1

        elif scan.risk_level == "CRITICAL":
            critical += 1

    return {
        "LOW": low,
        "MEDIUM": medium,
        "HIGH": high,
        "CRITICAL": critical
    }


def get_all_scans(
        db: Session
):
    return db.query(
        ScanHistory
    ).all()

def get_monthly_scans(
        db: Session,
        user_id: int
):
    data = []

    for month in range(1, 13):

        count = (
            db.query(ScanHistory)
            .filter(
                ScanHistory.user_id == user_id,
                extract(
                    "month",
                    ScanHistory.created_at
                ) == month
            )
            .count()
        )

        data.append({
            "month": month,
            "count": count
        })

    return data


def search_scans(
        db: Session,
        user_id: int,
        keyword: str
):
    return (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == user_id,
            ScanHistory.content.ilike(
                f"%{keyword}%"
            )
        )
        .all()
    )


def delete_scan(
        db: Session,
        scan_id: int
):
    scan = (
        db.query(ScanHistory)
        .filter(
            ScanHistory.id == scan_id
        )
        .first()
    )

    if scan:
        db.delete(scan)
        db.commit()

    return scan


def get_flagged_scans(
        db: Session,
        user_id: int,
        limit: int = 50
):
    return (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == user_id,
            ScanHistory.result == "PHISHING"
        )
        .order_by(
            ScanHistory.created_at.desc()
        )
        .limit(limit)
        .all()
    )