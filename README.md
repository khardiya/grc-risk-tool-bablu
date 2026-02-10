# GRC Risk Assessment & Heatmap Dashboard

This project implements a basic GRC risk assessment workflow using a
Likelihood × Impact matrix, aligned with NIST/ISO-style risk analysis.

## Features
- Add risks with likelihood and impact (1–5)
- Automatic risk score and level calculation
- Persistent storage using SQLite
- Dashboard with table and 5×5 heatmap visualization

## Run Backend
cd backend
pip install -r requirements.txt
python -m uvicorn app:app --reload

## Run Frontend
cd frontend
npm install
npm start

## Assumptions
- No authentication required
- Single-user local system
- Focused on core GRC risk scoring only
