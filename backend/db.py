"""
WeldTrack Pro - SQLite Database Manager in Python
Handles persistent storage of Welder Registries, AWS Procedure Libraries, and Work Card Spec Sheets.
"""
import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "weldtrack.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS welders (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        surname TEXT NOT NULL,
        id_number TEXT NOT NULL,
        stamp_number TEXT UNIQUE NOT NULL,
        hire_date TEXT,
        phone TEXT,
        email TEXT,
        qualifications_json TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS wps (
        id TEXT PRIMARY KEY,
        wps_number TEXT NOT NULL,
        revision TEXT NOT NULL,
        supporting_pqr TEXT,
        standard TEXT,
        material TEXT,
        material_group TEXT,
        process TEXT NOT NULL,
        process_description TEXT,
        thickness_range TEXT,
        volt_range TEXT,
        amp_range TEXT,
        filler_wire_diameter TEXT,
        filler_wire_classification TEXT,
        power_source_type TEXT,
        travel_speed TEXT,
        current_polarity TEXT,
        shielding_gas TEXT,
        gas_flow_rate TEXT,
        preheat_min TEXT,
        interpass_max TEXT,
        pwht TEXT,
        joint_types_json TEXT,
        joint_diagram_type TEXT,
        positions_json TEXT,
        progression TEXT,
        joint_details_json TEXT,
        pass_sequence_json TEXT,
        technique_json TEXT,
        notes TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS work_cards (
        id TEXT PRIMARY KEY,
        work_card_number TEXT NOT NULL,
        job_title TEXT NOT NULL,
        client_project TEXT,
        drawing_number TEXT,
        material TEXT,
        process TEXT,
        joint_type TEXT,
        assigned_wps_ids_json TEXT,
        assigned_welders_json TEXT,
        status TEXT,
        created_at TEXT,
        target_completion_date TEXT,
        qa_supervisor TEXT,
        qa_supervisor_stamp TEXT,
        notes TEXT
    );
    """)

    conn.commit()
    conn.close()

def save_welder(welder_dict: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO welders (
        id, first_name, surname, id_number, stamp_number, hire_date, phone, email, qualifications_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        welder_dict.get("id"),
        welder_dict.get("firstName"),
        welder_dict.get("surname"),
        welder_dict.get("idNumber"),
        welder_dict.get("stampNumber"),
        welder_dict.get("hireDate"),
        welder_dict.get("phone"),
        welder_dict.get("email"),
        json.dumps(welder_dict.get("qualifications", []))
    ))
    conn.commit()
    conn.close()

def get_all_welders() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM welders ORDER BY surname, first_name")
    rows = cursor.fetchall()
    welders = []
    for r in rows:
        welders.append({
            "id": r["id"],
            "firstName": r["first_name"],
            "surname": r["surname"],
            "idNumber": r["id_number"],
            "stampNumber": r["stamp_number"],
            "hireDate": r["hire_date"],
            "phone": r["phone"],
            "email": r["email"],
            "qualifications": json.loads(r["qualifications_json"] or "[]")
        })
    conn.close()
    return welders

def save_wps(wps_dict: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO wps (
        id, wps_number, revision, supporting_pqr, standard, material, material_group,
        process, process_description, thickness_range, volt_range, amp_range,
        filler_wire_diameter, filler_wire_classification, power_source_type,
        travel_speed, current_polarity, shielding_gas, gas_flow_rate,
        preheat_min, interpass_max, pwht, joint_types_json, joint_diagram_type,
        positions_json, progression, joint_details_json, pass_sequence_json,
        technique_json, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        wps_dict.get("id"),
        wps_dict.get("wpsNumber"),
        wps_dict.get("revision"),
        wps_dict.get("supportingPQR"),
        wps_dict.get("standard"),
        wps_dict.get("material"),
        wps_dict.get("materialGroup"),
        wps_dict.get("process"),
        wps_dict.get("processDescription"),
        wps_dict.get("thicknessRange"),
        wps_dict.get("voltRange"),
        wps_dict.get("ampRange"),
        wps_dict.get("fillerWireDiameter"),
        wps_dict.get("fillerWireClassification"),
        wps_dict.get("powerSourceType"),
        wps_dict.get("travelSpeed"),
        wps_dict.get("currentPolarity"),
        wps_dict.get("shieldingGas"),
        wps_dict.get("gasFlowRate"),
        wps_dict.get("preheatMin"),
        wps_dict.get("interpassMax"),
        wps_dict.get("pwht"),
        json.dumps(wps_dict.get("jointTypes", [])),
        wps_dict.get("jointDiagramType"),
        json.dumps(wps_dict.get("positions", [])),
        wps_dict.get("progression"),
        json.dumps(wps_dict.get("jointDetails", {})),
        json.dumps(wps_dict.get("passSequence", [])),
        json.dumps(wps_dict.get("technique", {})),
        wps_dict.get("notes")
    ))
    conn.commit()
    conn.close()

def get_all_wps() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM wps ORDER BY wps_number")
    rows = cursor.fetchall()
    wps_list = []
    for r in rows:
        wps_list.append({
            "id": r["id"],
            "wpsNumber": r["wps_number"],
            "revision": r["revision"],
            "supportingPQR": r["supporting_pqr"],
            "standard": r["standard"],
            "material": r["material"],
            "materialGroup": r["material_group"],
            "process": r["process"],
            "processDescription": r["process_description"],
            "thicknessRange": r["thickness_range"],
            "voltRange": r["volt_range"],
            "ampRange": r["amp_range"],
            "fillerWireDiameter": r["filler_wire_diameter"],
            "fillerWireClassification": r["filler_wire_classification"],
            "powerSourceType": r["power_source_type"],
            "travelSpeed": r["travel_speed"],
            "currentPolarity": r["current_polarity"],
            "shieldingGas": r["shielding_gas"],
            "gasFlowRate": r["gas_flow_rate"],
            "preheatMin": r["preheat_min"],
            "interpassMax": r["interpass_max"],
            "pwht": r["pwht"],
            "jointTypes": json.loads(r["joint_types_json"] or "[]"),
            "jointDiagramType": r["joint_diagram_type"],
            "positions": json.loads(r["positions_json"] or "[]"),
            "progression": r["progression"],
            "jointDetails": json.loads(r["joint_details_json"] or "{}"),
            "passSequence": json.loads(r["pass_sequence_json"] or "[]"),
            "technique": json.loads(r["technique_json"] or "{}"),
            "notes": r["notes"]
        })
    conn.close()
    return wps_list

def save_work_card(card_dict: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO work_cards (
        id, work_card_number, job_title, client_project, drawing_number,
        material, process, joint_type, assigned_wps_ids_json, assigned_welders_json,
        status, created_at, target_completion_date, qa_supervisor, qa_supervisor_stamp, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        card_dict.get("id"),
        card_dict.get("workCardNumber"),
        card_dict.get("jobTitle"),
        card_dict.get("clientProject"),
        card_dict.get("drawingNumber"),
        card_dict.get("material"),
        card_dict.get("process"),
        card_dict.get("jointType"),
        json.dumps(card_dict.get("assignedWpsIds", [])),
        json.dumps(card_dict.get("assignedWelders", [])),
        card_dict.get("status"),
        card_dict.get("createdAt"),
        card_dict.get("targetCompletionDate"),
        card_dict.get("qaSupervisor"),
        card_dict.get("qaSupervisorStamp"),
        card_dict.get("notes")
    ))
    conn.commit()
    conn.close()

def get_all_work_cards() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM work_cards ORDER BY created_at DESC")
    rows = cursor.fetchall()
    cards = []
    for r in rows:
        cards.append({
            "id": r["id"],
            "workCardNumber": r["work_card_number"],
            "jobTitle": r["job_title"],
            "clientProject": r["client_project"],
            "drawingNumber": r["drawing_number"],
            "material": r["material"],
            "process": r["process"],
            "jointType": r["joint_type"],
            "assignedWpsIds": json.loads(r["assigned_wps_ids_json"] or "[]"),
            "assignedWelders": json.loads(r["assigned_welders_json"] or "[]"),
            "status": r["status"],
            "createdAt": r["created_at"],
            "targetCompletionDate": r["target_completion_date"],
            "qaSupervisor": r["qa_supervisor"],
            "qaSupervisorStamp": r["qa_supervisor_stamp"],
            "notes": r["notes"]
        })
    conn.close()
    return cards

def seed_initial_data(seed_wps: List[Dict[str, Any]], seed_welders: List[Dict[str, Any]], seed_cards: List[Dict[str, Any]]):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM welders")
    cursor.execute("DELETE FROM wps")
    cursor.execute("DELETE FROM work_cards")
    conn.commit()
    conn.close()

    for w in seed_wps:
        save_wps(w)
    for welder in seed_welders:
        save_welder(welder)
    for c in seed_cards:
        save_work_card(c)
