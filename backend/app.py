from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3

app = FastAPI(title="GRC Risk Assessment API")

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
            level TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


# ---------- RISK LOGIC ----------
def calculate_risk(likelihood: int, impact: int):
    if not (1 <= likelihood <= 5 and 1 <= impact <= 5):
        raise HTTPException(
            status_code=400,
            detail="Invalid range: Likelihood and Impact must be 1–5."
        )

    score = likelihood * impact

    if score <= 5:
        level = "Low"
    elif score <= 12:
        level = "Medium"
    elif score <= 18:
        level = "High"
    else:
        level = "Critical"

    return score, level


# ---------- SCHEMA ----------
class RiskInput(BaseModel):
    asset: str
    threat: str
    likelihood: int
    impact: int


# ---------- API ENDPOINTS ----------
@app.post("/api/assess-risk")
def assess_risk(risk: RiskInput):
    score, level = calculate_risk(risk.likelihood, risk.impact)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO risks (asset, threat, likelihood, impact, score, level)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (risk.asset, risk.threat, risk.likelihood, risk.impact, score, level))
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
        "level": level
    }


@app.get("/api/risks")
def get_risks(level: str | None = None):
    conn = get_db_connection()
    cursor = conn.cursor()

    if level:
        cursor.execute("SELECT * FROM risks WHERE level = ?", (level,))
    else:
        cursor.execute("SELECT * FROM risks")

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]
