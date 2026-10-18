# WeldTrack Pro - Python Core Engine Architecture

WeldTrack Pro's backend coding base is implemented entirely in **Python 3.10** with native **SQLite** persistence and the standard Python HTTP server library (zero external pip dependencies required).

## Directory Structure

```
backend/
├── models.py           # Python dataclasses for Welders, WPQR, WPS, WorkCards, and Prolongations
├── wps_matcher.py      # Python rules engine evaluating AWS D1.1 / ISO 9606 qualifications & 30-day notice alerts
├── db.py               # SQLite database manager (CRUD, transactions, schema initialization)
├── server.py           # Native Python REST API server (HTTP/JSON endpoints on port 8001)
├── export_excel.py     # CSV and Excel data export script
└── weldtrack.db        # SQLite database file
```

## Running the Python Backend Standalone

You can run the Python REST API server standalone on any port (default: 8001):

```bash
python3 backend/server.py 8001
```

To export welders, qualifications, and work cards to CSV for Excel:

```bash
python3 backend/export_excel.py
```

## REST API Endpoints Provided by Python

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health probe returning Python version, engine info, and database status |
| `/api/welders` | GET, POST | Retrieve or register welders with their WPQR credentials |
| `/api/welders/<id>/qualifications` | POST | Add qualified AWS welding process to a welder |
| `/api/welders/<id>/prolongations` | POST | Record 6-month or annual prolongation renewal |
| `/api/wps` | GET | Retrieve AWS Welding Procedure Specifications |
| `/api/work-cards` | GET, POST | Manage Job Spec Sheets & Work Cards |
| `/api/validate-welder-wps` | POST | Executes Python rule evaluation to verify welder eligibility |
| `/api/alerts` | GET | Evaluates 30-day upcoming prolongation notices and expired certifications |
| `/api/seed` | POST | Re-seeds SQLite database with factory AWS standard dataset |
