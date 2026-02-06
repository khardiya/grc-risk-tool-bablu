from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3

app = FastAPI(title="GRC Risk Assessment API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://grc-risk-assessment-dashboard.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DB_NAME = "risks.db"


# ---------- DATABASE SETUP ----------
def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


@app.on_event("startup")
def startup():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS risks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset TEXT NOT NULL,
            threat TEXT NOT NULL,
            likelihood INTEGER NOT NULL,
            impact INTEGER NOT NULL,
            score INTEGER NOT NULL,
            level TEXT NOT NULL,
            hint TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


# ---------- RISK LOGIC ----------
def calculate_risk(likelihood: int, impact: int):
    if likelihood < 1 or likelihood > 5 or impact < 1 or impact > 5:
        raise HTTPException(
            status_code=400,
            detail="Invalid range: Likelihood and Impact must be 1–5."
        )

    score = likelihood * impact

    if score <= 5:
        level = "Low"
        hint = "Accept risk; monitor periodically (ISO 27001 risk acceptance)"
    elif score <= 12:
        level = "Medium"
        hint = "Plan mitigation; define controls and timelines (NIST ID.RA)"
    elif score <= 18:
        level = "High"
        hint = "Recommend NIST PR.AC-7: Rate limiting and access control enforcement"
    else:
        level = "Critical"
        hint = (
            "Immediate mitigation required; executive escalation "
            "(NIST CSF RS & ISO 27001 incident response)"
        )

    return score, level, hint



# ---------- SCHEMA ----------
class RiskInput(BaseModel):
    asset: str
    threat: str
    likelihood: int
    impact: int


# ---------- API ENDPOINTS ----------
@app.post("/api/assess-risk")
def assess_risk(risk: RiskInput):
    score, level, hint = calculate_risk(
        risk.likelihood,
        risk.impact
    )

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO risks (asset, threat, likelihood, impact, score, level, hint)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        risk.asset,
        risk.threat,
        risk.likelihood,
        risk.impact,
        score,
        level,
        hint
    ))

    conn.commit()
    risk_id = cursor.lastrowid
    conn.close()

    return {
        "id": risk_id,
        "asset": risk.asset,
        "threat": risk.threat,
        "likelihood": risk.likelihood,
        "impact": risk.impact,
        "score": score,
        "level": level,
        "hint": hint
    }


@app.get("/api/risks")
def get_risks(level: str | None = None):
    conn = get_db_connection()
    cursor = conn.cursor()

    if level:
        cursor.execute(
            "SELECT * FROM risks WHERE level = ?",
            (level,)
        )
    else:
        cursor.execute("SELECT * FROM risks")

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]
