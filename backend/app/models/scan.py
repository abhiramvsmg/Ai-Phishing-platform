from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.session import Base


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    scan_type = Column(
        String(20),
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    result = Column(
        String(100)
    )

    risk_score = Column(
        Integer
    )

    risk_level = Column(
        String(20)
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="scans"
    )

    reports = relationship(
        "Report",
        back_populates="scan"
    )