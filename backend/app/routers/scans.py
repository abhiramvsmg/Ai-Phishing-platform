from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.schemas.scan import (
    URLScanRequest,
    EmailScanRequest,
    TextScanRequest,
    ScanResponse
)

from app.services.scan_service import (
    scan_url,
    scan_email,
    scan_text,
    get_my_scans,
    search_my_scans,
    get_scan,
    get_my_flagged_scans
)

router = APIRouter(
    prefix="/api/v1/scans",
    tags=["Scans"]
)


@router.post(
    "/url",
    response_model=ScanResponse
)
def create_url_scan(
        request: URLScanRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return scan_url(
        db,
        current_user.id,
        request.url
    )


@router.post(
    "/email",
    response_model=ScanResponse
)
def create_email_scan(
        request: EmailScanRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return scan_email(
        db,
        current_user.id,
        request.email_text
    )


@router.post(
    "/text",
    response_model=ScanResponse
)
def create_text_scan(
        request: TextScanRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return scan_text(
        db,
        current_user.id,
        request.text
    )


@router.get("")
def get_scans(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return get_my_scans(
        db,
        current_user.id
    )


@router.get("/search/{keyword}")
def search_scans_api(
        keyword: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return search_my_scans(
        db,
        current_user.id,
        keyword
    )


@router.get("/flagged", response_model=list[ScanResponse])
def get_flagged_scans_api(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return get_my_flagged_scans(
        db,
        current_user.id
    )


@router.get(
    "/{scan_id}",
    response_model=ScanResponse
)
def get_scan_by_id_api(
        scan_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    scan = get_scan(
        db,
        scan_id
    )

    if not scan:
        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )

    return scan