# GRC Risk Assessment & Heatmap Dashboard

## Overview

This project is a full-stack **GRC (Governance, Risk, and Compliance)** risk assessment tool that implements a standard **Likelihood × Impact risk matrix**, commonly used in frameworks such as **NIST SP 800-30** and **ISO/IEC 27001**.

The application allows users to:
- Assess risks using likelihood and impact scores (1–5)
- Automatically calculate risk score and risk level
- Persist risks in a database
- Visualize organizational risk posture via a 5×5 heatmap
- Analyze risks using filters, sorting, statistics, and CSV export

The goal of this assignment was to demonstrate the ability to independently build a **complete, production-style mini GRC system**, not just isolated backend or frontend components.

---

## Tech Stack

### Backend
- **FastAPI** – REST API
- **SQLite** – persistent storage
- **Pydantic** – request validation

### Frontend
- **React (Hooks)** – UI and state management
- **Fetch API** – backend communication
- **Plain CSS / inline styles** – clean, functional UI

---

## Risk Scoring Logic (Core GRC Concept)

Each risk is evaluated using:

Risk Score = Likelihood × Impact

### Risk Level Mapping

| Score Range | Level     | Meaning |
|------------|-----------|--------|
| 1–5        | Low       | Acceptable / Monitor |
| 6–12       | Medium    | Requires mitigation planning |
| 13–18      | High      | Priority action required |
| 19–25      | Critical  | Immediate mitigation & escalation |

This model mirrors common enterprise GRC tools and aligns with **NIST SP 800-30 risk assessment guidance**.

---

## Backend Features

- `POST /api/assess-risk`
  - Validates likelihood and impact (must be integers 1–5)
  - Calculates score, level, and mitigation hint
  - Persists risk in SQLite
  - Returns the created risk object

- `GET /api/risks`
  - Returns all risks
  - Supports filtering: `/api/risks?level=High`

- Strict input validation with clear HTTP 400 error messages

---

## Frontend Features

### Risk Input Form
- Asset and Threat inputs
- Likelihood & Impact sliders (1–5)
- **Real-time preview** of:
  - Risk Score
  - Risk Level
  - Mitigation Hint
- Client-side logic mirrors backend scoring
- Form resets after successful submission

### Dashboard
- Tabular view of all risks
- Sort by **Score**
- Filter by **Risk Level**
- Mitigation hint column
- Summary statistics:
  - Total risks
  - High + Critical risks
  - Average risk score

### Risk Heatmap (Key Feature)
- True **5×5 Likelihood × Impact matrix**
- Correct GRC orientation:
  - Likelihood on Y-axis (5 → 1)
  - Impact on X-axis (1 → 5)
- Cell color reflects risk severity
- Each cell shows count of risks
- Hover tooltip displays affected assets

### CSV Export
- Exports filtered risks
- Includes mitigation hints
- Ready for audit / reporting use

---

## Setup & Run Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+

---

### Backend Setup and frontend Sstup

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload


Backend runs at:
http://localhost:8000


Frontend Setup
cd frontend
npm install
npm start

```

### Risk Assessment Form with Live Preview
The risk input form allows users to define assets and threats, select likelihood and impact (1–5), and instantly preview the calculated risk score, level, and recommended mitigation before submission.

## Screenshots

### Risk Assessment Form with Live Preview
![Risk Form Preview](frontend/screenshots/Screenshot 2026-02-06 162225.png)

### Risk Dashboard with Filtering, Sorting, and Export
![Risk Dashboard Table](frontend/screenshots/Screenshot 2026-02-06 162247.png)

### Risk Heatmap (Likelihood × Impact Matrix)
![Risk Heatmap](frontend/screenshots/Screenshot 2026-02-06 162301.png)
