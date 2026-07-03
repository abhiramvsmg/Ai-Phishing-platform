from sqlalchemy.orm import Session


from app.repositories.scan_repository import (
    get_total_scans,
    get_safe_scans,
    get_phishing_scans,
    get_high_risk_scans,
    get_recent_scans,
    get_risk_distribution,
    get_monthly_scans
)


def get_dashboard_stats(
        db: Session,
        user_id: int
):
    return {
        "total_scans":
            get_total_scans(
                db,
                user_id
            ),

        "safe_scans":
            get_safe_scans(
                db,
                user_id
            ),

        "phishing_scans":
            get_phishing_scans(
                db,
                user_id
            ),

        "high_risk_scans":
            get_high_risk_scans(
                db,
                user_id
            )
    }


def get_recent_dashboard_scans(
        db: Session,
        user_id: int
):
    return get_recent_scans(
        db,
        user_id
    )


def dashboard_risk_distribution(
        db: Session,
        user_id: int
):
    return get_risk_distribution(
        db,
        user_id
    )


def dashboard_monthly_scans(
        db: Session,
        user_id: int
):
    return get_monthly_scans(
        db,
        user_id
    )