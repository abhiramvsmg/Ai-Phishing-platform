from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from typing import List
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.report import ReportResponse

from app.services.report_service import (
    generate_report,
    get_reports,
    get_report
)

from fastapi.responses import FileResponse

from app.services.export_service import (
    export_report_pdf,
    export_report_csv
)


router = APIRouter(
    prefix="/api/v1/reports",
    tags=["Reports"]
)


@router.post("/generate/{scan_id}", response_model=ReportResponse)
def create_report_api(
        scan_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):
    report = generate_report(
        db,
        current_user.id,
        scan_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )

    return report


@router.get("", response_model=List[ReportResponse])
def get_my_reports(
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):
    return get_reports(
        db,
        current_user.id
    )



@router.post("/export/pdf/{report_id}")
def export_pdf(
        report_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):
    report = get_report(
        db,
        report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    file_path = export_report_pdf(
        report
    )

    return FileResponse(
        path=file_path,
        filename=f"report_{report.id}.pdf",
        media_type="application/pdf"
    )


@router.post("/export/csv/{report_id}")
def export_csv(
        report_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):
    report = get_report(
        db,
        report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    file_path = export_report_csv(
        report
    )

    return FileResponse(
        path=file_path,
        filename=f"report_{report.id}.csv",
        media_type="text/csv"
    )

@router.get("/{report_id}", response_model=ReportResponse)
def get_report_by_id_api(
        report_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(
            get_current_user
        )
):
    report = get_report(
        db,
        report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return report