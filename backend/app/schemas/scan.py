from pydantic import BaseModel
from datetime import datetime


class URLScanRequest(BaseModel):
    url: str


class EmailScanRequest(BaseModel):
    email_text: str


class TextScanRequest(BaseModel):
    text: str


class ScanResponse(BaseModel):
    id: int
    scan_type: str
    content: str
    result: str
    risk_score: int
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True