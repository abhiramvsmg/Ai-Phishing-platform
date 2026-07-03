from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.dashboard_service import (
    dashboard_monthly_scans
)

from app.services.dashboard_service import (
    get_dashboard_stats
)

router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def dashboard_stats(
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):

    return get_dashboard_stats(
        db,
        current_user.id
    )



from app.services.dashboard_service import (
    get_recent_dashboard_scans
)


@router.get("/recent-scans")
def recent_scans(
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):

    return get_recent_dashboard_scans(
        db,
        current_user.id
    )

from app.services.dashboard_service import (
    dashboard_risk_distribution
)


@router.get("/risk-distribution")
def risk_distribution(
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):

    return dashboard_risk_distribution(
        db,
        current_user.id
    )

@router.get("/monthly-scans")
def monthly_scans(
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):

    return dashboard_monthly_scans(
        db,
        current_user.id
    )