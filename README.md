# PhishGuard — AI Phishing Detection Platform

A full-stack phishing detection platform: scan URLs, emails, and text
for phishing indicators using real threat-intelligence APIs combined
with pattern-based analysis.

## Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS, Recharts
- **Backend:** FastAPI, SQLAlchemy, JWT authentication
- **Detection:** VirusTotal API + Google Safe Browsing API + keyword
  heuristics (falls back to keyword-only scoring if no API keys are
  configured)
- **Database:** PostgreSQL (or SQLite for local development)

## Project structure

```
.
├── frontend/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # Shared React components
│   ├── lib/               # API client, auth, types, utils
│   └── public/
└── backend/
    ├── main.py
    └── app/
        ├── routers/       # API endpoints
        ├── services/      # Business logic
        ├── repositories/  # Database queries
        ├── models/        # SQLAlchemy models
        └── schemas/       # Pydantic request/response shapes
```

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create `backend/.env` (see `backend/.env.example`):

```
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./test.db
VIRUSTOTAL_API_KEY=
GOOGLE_SAFE_BROWSING_API_KEY=
```

Run the backend:

```bash
uvicorn main:app --reload --port 8001
```

API docs available at `http://127.0.0.1:8001/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

> The frontend expects the backend on port 8001 by default. Override
> with `NEXT_PUBLIC_API_BASE_URL` in a `frontend/.env.local` file if
> your backend runs elsewhere.

## Features

- URL, email, and text scanning with real-time risk scoring
- VirusTotal + Google Safe Browsing integration (optional — falls
  back to keyword analysis if no keys are set)
- Dashboard with real scan statistics and history
- Risk distribution and scan-volume analytics
- Threat intel feed of all flagged scans
- PDF/CSV report generation and export
- Account settings: update name, change password

## Known limitations

- **Team/multi-user workspaces** are not implemented yet — each
  account only sees its own scan history. This is a planned feature
  that needs new database tables (teams, members, invites) and
  changes to most existing queries to scope by team.
