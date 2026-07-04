<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a0a0a,100:1a1a2e&height=200&section=header&text=PhishGuard&fontSize=60&fontColor=e5ff00&animation=fadeIn&fontAlignY=38&desc=AI-Powered%20Phishing%20Detection%20Platform&descAlignY=58&descSize=18&descColor=cfd8dc" width="100%"/>

<img src="https://readme-typing-svg.demolab.com/?font=JetBrains+Mono&size=18&duration=3000&pause=1000&color=E5FF00&center=true&vCenter=true&width=600&lines=Scan+URLs%2C+Emails+%26+Text+for+Threats;Real+Threat+Intelligence%2C+Not+a+Mockup;VirusTotal+%2B+Google+Safe+Browsing+%2B+Heuristics" alt="Typing SVG" />

<br/>

[![Frontend](https://img.shields.io/badge/Live_App-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://phishguard-frontend-five.vercel.app)
[![Backend](https://img.shields.io/badge/API_Docs-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://phishguard-backend-50r3.onrender.com/docs)
[![License](https://img.shields.io/badge/License-MIT-e5ff00?style=for-the-badge)](#license)

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

<br/>

## Live Demo

| Layer | Link | Notes |
|---|---|---|
| 🖥️ **Frontend** | [phishguard-frontend-five.vercel.app](https://phishguard-frontend-five.vercel.app) | Hosted on Vercel |
| ⚙️ **Backend API** | [phishguard-backend-50r3.onrender.com/docs](https://phishguard-backend-50r3.onrender.com/docs) | FastAPI + Swagger UI, hosted on Render |
| 🗄️ **Database** | PostgreSQL (Neon, managed) | Private connection — not publicly exposed |

> ⚠️ The backend is on Render's free tier, which sleeps after 15 minutes of inactivity. The first request after idle time may take 30–60 seconds to wake up — this is expected, not a bug.

<br/>

## What it does

A full-stack phishing detection platform: scan URLs, emails, and text for phishing indicators using real threat-intelligence APIs combined with pattern-based analysis.

<div align="center">

| 🔍 Detection | 📊 Insights | 👥 Teams |
|:---:|:---:|:---:|
| URL, email & text scanning with real-time risk scoring | Dashboard with scan stats, risk distribution & volume analytics | Multi-user team workspaces with private per-user history |

</div>

### Core features
- 🔗 **URL scanning** — VirusTotal + Google Safe Browsing run in parallel, combined with pattern analysis
- 📧 **Email analysis** — heuristic scoring for phishing language, urgency tactics, fake login requests
- 🎯 **Transparent risk scoring** — every scan gets a 0–100 score backed by the exact signals that produced it
- 📈 **Dashboard & analytics** — real scan history, risk distribution, and volume trends
- 🛰️ **Threat intel feed** — a live feed of all flagged scans across your account
- 📄 **Report export** — generate PDF/CSV reports from any scan
- 🔐 **JWT authentication** — hashed passwords, per-account isolation
- 👥 **Team workspaces** — group accounts by email, with role-based access
- 🧠 **Graceful fallback** — falls back to keyword-only scoring if no API keys are configured, so it never breaks

<br/>

## Tech stack

```
Frontend    → Next.js 16 · TypeScript · Tailwind CSS · Recharts
Backend     → FastAPI · SQLAlchemy · JWT Auth
Detection   → VirusTotal API · Google Safe Browsing API · keyword heuristics
Database    → PostgreSQL (prod) · SQLite (local dev)
Deployment  → Vercel (frontend) · Render (backend) · Neon (database)
```

<br/>

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

<br/>

## Local setup

<details>
<summary><b>⚙️ Backend</b></summary>
<br/>

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

Create `backend/.env` (see `backend/.env.example`):

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./test.db
VIRUSTOTAL_API_KEY=
GOOGLE_SAFE_BROWSING_API_KEY=
CORS_ORIGINS=http://localhost:3000
```

Run it:

```bash
uvicorn main:app --reload --port 8001
```

API docs available at `http://127.0.0.1:8001/docs`.

</details>

<details>
<summary><b>🖥️ Frontend</b></summary>
<br/>

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

> The frontend expects the backend on port 8001 by default. Override with `NEXT_PUBLIC_API_BASE_URL` in a `frontend/.env.local` file if your backend runs elsewhere.

</details>

<br/>

## Deployment

<div align="center">

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [Neon](https://neon.tech) (Postgres) |

</div>

<br/>

## License

MIT

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1a2e,100:0a0a0a&height=100&section=footer" width="100%"/>
</div>
