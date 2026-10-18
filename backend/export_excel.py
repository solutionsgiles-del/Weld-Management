#!/usr/bin/env python3
"""
WeldTrack Pro - CSV / Excel Exporter in Python
Exports Welders, WPQR Qualifications, and Work Card Spec Sheets for Excel compliance audits.
"""
import csv
import json
import os
import sys
from db import get_all_welders, get_all_wps, get_all_work_cards

def export_welders_csv(filename="welders_wpqr_export.csv"):
    welders = get_all_welders()
    with open(filename, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Welder ID", "First Name", "Surname", "ID Number", "Stamp Number",
            "Process Qualified", "Standard", "Material Group", "Positions",
            "Qualification Date", "Interval", "Current Expiry", "Status"
        ])
        for w in welders:
            quals = w.get("qualifications", [])
            if not quals:
                writer.writerow([w["id"], w["firstName"], w["surname"], w["idNumber"], w["stampNumber"], "None", "", "", "", "", "", "", "No Quals"])
            else:
                for q in quals:
                    writer.writerow([
                        w["id"], w["firstName"], w["surname"], w["idNumber"], w["stampNumber"],
                        q.get("process"), q.get("standard"), q.get("materialGroup"),
                        ", ".join(q.get("positionsQualified", [])),
                        q.get("qualificationDate"), q.get("interval"),
                        q.get("currentExpiryDate"), "Active"
                    ])
    print(f"Exported {len(welders)} welders to {filename}")

def export_work_cards_csv(filename="work_cards_spec_sheets.csv"):
    cards = get_all_work_cards()
    with open(filename, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Work Card Number", "Job Title", "Client Project", "Drawing Number",
            "Material", "Process", "Joint Type", "Status", "Welders & Stamps", "Assigned WPS"
        ])
        for c in cards:
            welders_str = ", ".join([f"{w.get('welderName')} (#{w.get('stampNumber')})" for w in c.get("assignedWelders", [])])
            wps_str = ", ".join(c.get("assignedWpsIds", []))
            writer.writerow([
                c.get("workCardNumber"), c.get("jobTitle"), c.get("clientProject"),
                c.get("drawingNumber"), c.get("material"), c.get("process"),
                c.get("jointType"), c.get("status"), welders_str, wps_str
            ])
    print(f"Exported {len(cards)} work cards to {filename}")

if __name__ == "__main__":
    export_welders_csv()
    export_work_cards_csv()
