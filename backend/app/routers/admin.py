from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.dependencies.roles import (
    require_admin
)

from app.services.admin_service import (
    admin_users,
    admin_scans,
    admin_reports,
    admin_activities
)

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def admin_dashboard(
        admin=Depends(require_admin)
):
    return {
        "message":
        f"Welcome Admin {admin.name}"
    }


@router.get("/users")
def get_all_users_api(
        db: Session = Depends(get_db)
):
    return admin_users(db)


@router.get("/scans")
def get_all_scans_api(
        db: Session = Depends(get_db)
):
    return admin_scans(db)


@router.get("/reports")
def get_all_reports_api(
        db: Session = Depends(get_db)
):
    return admin_reports(db)


@router.get("/activities")
def get_all_activities_api(
        db: Session = Depends(get_db)
):
    return admin_activities(db)