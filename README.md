# GRC Risk Assessment & Heatmap Dashboard

This project is a full-stack GRC (Governance, Risk, and Compliance) risk assessment tool.
It allows users to assess risks using a standard likelihood × impact matrix, persist data,
and visualize risks via a dashboard and heatmap.

## Tech Stack
- Backend: FastAPI, SQLite
- Frontend: React (Vite)
- Visualization: Custom grid-based heatmap
- Styling: Basic CSS

## Features
- Add risks with asset, threat, likelihood, and impact
- Automatic risk score and level calculation
- Persistent storage using SQLite
- Dashboard with sortable and filterable risk table
- 5×5 risk heatmap visualization
- CSV export of risk register

## Risk Scoring Logic
- Score = Likelihood × Impact (1–25)
- Levels:
  - 1–5: Low
  - 6–12: Medium
  - 13–18: High
  - 19–25: Critical

## How to Run

### Backend
```bash
cd backend
python -m uvicorn app:app --reload
