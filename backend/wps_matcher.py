"""
WeldTrack Pro - Python Qualification & Prolongation Evaluation Engine
Validates Welder Performance Qualification Records (WPQR) against AWS D1.1 Welding Procedure Specifications (WPS).
"""
import datetime
from typing import Dict, Any, List, Tuple

def parse_date(date_str: str) -> datetime.date:
    try:
        return datetime.datetime.strptime(date_str.split('T')[0], "%Y-%m-%d").date()
    except Exception:
        return datetime.date.today()

def get_qualification_status(expiry_date_str: str, reference_date: datetime.date = None) -> Dict[str, Any]:
    """
    Computes whether a qualification is active, expiring within 30 days, or expired.
    """
    if reference_date is None:
        reference_date = datetime.date.today()
    
    expiry = parse_date(expiry_date_str)
    delta_days = (expiry - reference_date).days

    if delta_days < 0:
        return {
            "status": "expired",
            "daysRemaining": delta_days,
            "label": f"Expired {abs(delta_days)}d ago",
            "isAlert": True
        }
    elif delta_days <= 30:
        return {
            "status": "expiring_soon",
            "daysRemaining": delta_days,
            "label": "Expires today" if delta_days == 0 else f"Expires in {delta_days}d",
            "isAlert": True
        }
    else:
        return {
            "status": "active",
            "daysRemaining": delta_days,
            "label": f"Valid ({delta_days}d left)",
            "isAlert": False
        }

def is_welder_qualified_for_wps(welder: Dict[str, Any], wps: Dict[str, Any], reference_date: datetime.date = None) -> Tuple[bool, str, Any]:
    """
    Checks if a welder has an unexpired WPQR matching the WPS process.
    """
    wps_process = wps.get("process")
    quals = welder.get("qualifications", [])
    
    matching_qual = next((q for q in quals if q.get("process") == wps_process), None)
    if not matching_qual:
        return False, f"Welder {welder.get('firstName')} {welder.get('surname')} has no WPQR for {wps_process}", None

    # Check expiration
    status_info = get_qualification_status(matching_qual.get("currentExpiryDate", ""), reference_date)
    if status_info["status"] == "expired":
        return False, f"WPQR for {wps_process} expired on {matching_qual.get('currentExpiryDate')} (Prolongation required)", matching_qual

    return True, "Qualified and authorized", matching_qual

def get_eligible_wps_for_welder(welder: Dict[str, Any], assigned_wps_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Filters allowable WPS list on a work card down to only what the welder is qualified for.
    """
    eligible = []
    ineligible = []

    for wps in assigned_wps_list:
        is_qual, reason, qual = is_welder_qualified_for_wps(welder, wps)
        if is_qual:
            eligible.append(wps)
        else:
            ineligible.append({"wps": wps, "reason": reason})

    return {
        "eligibleWps": eligible,
        "ineligibleWps": ineligible
    }

def get_prolongation_alerts(welders: List[Dict[str, Any]], reference_date: datetime.date = None) -> Dict[str, Any]:
    """
    Scans all welders and qualifications for 30-day upcoming prolongations and expired certs.
    """
    expiring_soon = []
    expired = []

    for welder in welders:
        for qual in welder.get("qualifications", []):
            status = get_qualification_status(qual.get("currentExpiryDate", ""), reference_date)
            if status["status"] == "expiring_soon":
                expiring_soon.append({
                    "welderId": welder.get("id"),
                    "welderName": f"{welder.get('firstName')} {welder.get('surname')}",
                    "stampNumber": welder.get("stampNumber"),
                    "qual": qual,
                    "status": status
                })
            elif status["status"] == "expired":
                expired.append({
                    "welderId": welder.get("id"),
                    "welderName": f"{welder.get('firstName')} {welder.get('surname')}",
                    "stampNumber": welder.get("stampNumber"),
                    "qual": qual,
                    "status": status
                })

    return {
        "expiringSoon": expiring_soon,
        "expired": expired,
        "totalAlerts": len(expiring_soon) + len(expired)
    }

def calculate_next_expiry(base_date_str: str, interval: str) -> str:
    """
    Calculates next expiry date based on interval (6 months or annual).
    """
    base = parse_date(base_date_str)
    if interval == "6_MONTHS":
        month = base.month + 6
        year = base.year
        if month > 12:
            month -= 12
            year += 1
        new_date = base.replace(year=year, month=month)
    else:
        new_date = base.replace(year=base.year + 1)
    return new_date.isoformat()
