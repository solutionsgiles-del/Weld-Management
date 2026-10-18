"""
WeldTrack Pro - Python Data Models & Schemas
Governing AWS D1.1, D1.2, D1.6, ASME IX, and ISO 9606 Welding Specifications.
"""
from dataclasses import dataclass, field, asdict
from typing import List, Optional, Dict, Any
from enum import Enum
import datetime

class WeldingProcess(str, Enum):
    SMAW = "SMAW"
    GMAW = "GMAW"
    GTAW = "GTAW"
    FCAW = "FCAW"
    SAW = "SAW"

class ProlongationInterval(str, Enum):
    SIX_MONTHS = "6_MONTHS"
    ANNUAL = "ANNUAL"

class WorkCardStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    IN_PROGRESS = "in_progress"
    INSPECTION_PENDING = "inspection_pending"
    COMPLETED = "completed"

@dataclass
class ProlongationRecord:
    id: str
    prolongedDate: str
    expiryDate: str
    confirmedBy: str
    ndtReportNo: Optional[str] = None
    notes: Optional[str] = None

@dataclass
class WelderQualification:
    id: str
    process: str
    standard: str
    materialGroup: str
    thicknessRangeQualified: str
    positionsQualified: List[str]
    qualificationDate: str
    interval: str  # "6_MONTHS" or "ANNUAL"
    currentExpiryDate: str
    proofDocumentName: str
    proofDocumentUrl: str
    prolongationHistory: List[Dict[str, Any]] = field(default_factory=list)

@dataclass
class Welder:
    id: str
    firstName: str
    surname: str
    idNumber: str
    stampNumber: str
    hireDate: str
    phone: Optional[str] = None
    email: Optional[str] = None
    qualifications: List[Dict[str, Any]] = field(default_factory=list)

@dataclass
class PassSequenceItem:
    passNo: str
    process: str
    fillerClass: str
    diameter: str
    currentType: str
    amperage: str
    voltage: str
    travelSpeed: str
    remarks: str

@dataclass
class WPS:
    id: str
    wpsNumber: str
    revision: str
    supportingPQR: str
    standard: str
    material: str
    materialGroup: str
    process: str
    processDescription: str
    thicknessRange: str
    voltRange: str
    ampRange: str
    fillerWireDiameter: str
    fillerWireClassification: str
    powerSourceType: str
    travelSpeed: str
    currentPolarity: str
    shieldingGas: str
    gasFlowRate: str
    preheatMin: str
    interpassMax: str
    pwht: str
    jointTypes: List[str]
    jointDiagramType: str
    positions: List[str]
    progression: str
    jointDetails: Dict[str, str]
    passSequence: List[Dict[str, str]]
    technique: Dict[str, str]
    notes: str

@dataclass
class WorkCardWelderAssignment:
    welderId: str
    welderName: str
    stampNumber: str
    chosenWpsId: Optional[str] = None
    jointReference: Optional[str] = None
    assignedPasses: Optional[str] = None
    signOffDate: Optional[str] = None
    inspectionPassed: bool = False

@dataclass
class WorkCardSpecSheet:
    id: str
    workCardNumber: str
    jobTitle: str
    clientProject: str
    drawingNumber: str
    material: str
    process: str
    jointType: str
    assignedWpsIds: List[str]
    assignedWelders: List[Dict[str, Any]]
    status: str
    createdAt: str
    targetCompletionDate: str
    qaSupervisor: str
    qaSupervisorStamp: str
    notes: Optional[str] = None
