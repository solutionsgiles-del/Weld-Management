#!/usr/bin/env python3
"""
WeldTrack Pro - Python Backend Server (Python 3.10 Standard Library)
Provides RESTful APIs for Work Cards, AWS WPS Procedures, and Welder WPQR Tracking.
Zero external package dependencies required.
"""
import http.server
import socketserver
import json
import urllib.parse
import sys
import os

from db import (
    init_db,
    save_welder,
    get_all_welders,
    save_wps,
    get_all_wps,
    save_work_card,
    get_all_work_cards,
    seed_initial_data,
)
from wps_matcher import (
    is_welder_qualified_for_wps,
    get_eligible_wps_for_welder,
    get_prolongation_alerts,
    calculate_next_expiry,
)

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8001

class WeldingAPIHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def _send_json_response(self, data, status_code=200):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/health":
            self._send_json_response({
                "status": "healthy",
                "backend": "python-3.10",
                "engine": "WeldTrack-Python-Core",
                "database": "sqlite3"
            })
            return

        elif path == "/api/welders":
            welders = get_all_welders()
            self._send_json_response(welders)
            return

        elif path == "/api/wps":
            wps_list = get_all_wps()
            self._send_json_response(wps_list)
            return

        elif path == "/api/work-cards":
            cards = get_all_work_cards()
            self._send_json_response(cards)
            return

        elif path == "/api/alerts":
            welders = get_all_welders()
            alerts = get_prolongation_alerts(welders)
            self._send_json_response(alerts)
            return

        else:
            self._send_json_response({"error": "Endpoint not found"}, status_code=404)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length > 0 else b"{}"

        try:
            payload = json.loads(body.decode("utf-8")) if body else {}
        except Exception:
            payload = {}

        if path == "/api/welders":
            save_welder(payload)
            self._send_json_response({"success": True, "welder": payload})
            return

        elif path.startswith("/api/welders/") and path.endswith("/qualifications"):
            parts = path.split("/")
            welder_id = parts[3]
            welders = get_all_welders()
            welder = next((w for w in welders if w["id"] == welder_id), None)
            if not welder:
                self._send_json_response({"error": "Welder not found"}, status_code=404)
                return

            quals = welder.get("qualifications", [])
            quals.append(payload)
            welder["qualifications"] = quals
            save_welder(welder)
            self._send_json_response({"success": True, "welder": welder})
            return

        elif path.startswith("/api/welders/") and path.endswith("/prolongations"):
            parts = path.split("/")
            welder_id = parts[3]
            welders = get_all_welders()
            welder = next((w for w in welders if w["id"] == welder_id), None)
            if not welder:
                self._send_json_response({"error": "Welder not found"}, status_code=404)
                return

            qual_id = payload.get("qualId")
            new_expiry = payload.get("newExpiryDate")
            interval = payload.get("interval")
            confirmed_by = payload.get("confirmedBy")
            ndt_report = payload.get("ndtReportNo")
            notes = payload.get("notes")

            new_record = {
                "id": f"PRO-{payload.get('timestamp', 'NOW')}",
                "prolongedDate": payload.get("prolongedDate", "2026-10-18"),
                "expiryDate": new_expiry,
                "confirmedBy": confirmed_by,
                "ndtReportNo": ndt_report,
                "notes": notes
            }

            for q in welder.get("qualifications", []):
                if q["id"] == qual_id:
                    q["interval"] = interval
                    q["currentExpiryDate"] = new_expiry
                    history = q.get("prolongationHistory", [])
                    q["prolongationHistory"] = [new_record] + history
                    break

            save_welder(welder)
            self._send_json_response({"success": True, "welder": welder})
            return

        elif path == "/api/work-cards":
            save_work_card(payload)
            self._send_json_response({"success": True, "workCard": payload})
            return

        elif path == "/api/validate-welder-wps":
            welder = payload.get("welder", {})
            wps = payload.get("wps", {})
            is_qual, reason, qual = is_welder_qualified_for_wps(welder, wps)
            self._send_json_response({
                "isQualified": is_qual,
                "reason": reason,
                "matchingQualification": qual
            })
            return

        elif path == "/api/eligible-wps":
            welder = payload.get("welder", {})
            assigned_wps = payload.get("assignedWpsList", [])
            result = get_eligible_wps_for_welder(welder, assigned_wps)
            self._send_json_response(result)
            return

        elif path == "/api/seed":
            seed_initial_data(
                payload.get("wpsLibrary", []),
                payload.get("weldersList", []),
                payload.get("workCards", [])
            )
            self._send_json_response({"success": True, "message": "Seeded SQLite database"})
            return

        else:
            self._send_json_response({"error": "Endpoint not found"}, status_code=404)

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length > 0 else b"{}"

        try:
            payload = json.loads(body.decode("utf-8")) if body else {}
        except Exception:
            payload = {}

        if path.startswith("/api/work-cards/"):
            save_work_card(payload)
            self._send_json_response({"success": True, "workCard": payload})
            return
        elif path.startswith("/api/welders/"):
            save_welder(payload)
            self._send_json_response({"success": True, "welder": payload})
            return
        else:
            self._send_json_response({"error": "Endpoint not found"}, status_code=404)

def run_server():
    init_db()
    with socketserver.TCPServer(("", PORT), WeldingAPIHandler) as httpd:
        print(f"[Python] WeldTrack Backend running at http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
