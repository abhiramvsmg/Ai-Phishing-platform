from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import (
    engine,
    Base
)

# Import Models
from app.models.user import User
from app.models.scan import ScanHistory
from app.models.report import Report
from app.models.activity_log import ActivityLog
from app.models.team import Team
from app.models.team_member import TeamMember

# Import Routers
from app.routers.auth import (
    router as auth_router
)
from app.routers.users import (
    router as users_router
)
from app.routers.admin import (
    router as admin_router
)
from app.routers.scans import (
    router as scans_router
)
from app.routers.dashboard import (
    router as dashboard_router
)
from app.routers.activity import (
    router as activity_router
)
from app.routers.reports import (
    router as reports_router
)
from app.routers.team import (
    router as team_router
)

# Create Tables
Base.metadata.create_all(
    bind=engine
)

# Create FastAPI App
app = FastAPI(
    title="AI Phishing Detection Platform",
    version="1.0.0"
)

# Allow the Next.js frontend (localhost:3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(admin_router)
app.include_router(scans_router)
app.include_router(dashboard_router)
app.include_router(activity_router)
app.include_router(reports_router)
app.include_router(team_router)


@app.get("/")
def home():
    return {
        "message": "Backend Running"
    }
