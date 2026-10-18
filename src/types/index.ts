export type WeldingProcess = 'SMAW' | 'GMAW' | 'GTAW' | 'FCAW' | 'SAW';

export type ProlongationInterval = '6_MONTHS' | 'ANNUAL';

export type JointType = 
  | 'Butt Joint (Single-V Groove)'
  | 'Butt Joint (Double-V Groove)'
  | 'T-Joint (Fillet Weld)'
  | 'Corner Joint'
  | 'Lap Joint';

export type WorkCardStatus = 'draft' | 'active' | 'in_progress' | 'inspection_pending' | 'completed';

export interface ProlongationRecord {
  id: string;
  prolongedDate: string; // ISO YYYY-MM-DD
  expiryDate: string; // ISO YYYY-MM-DD
  confirmedBy: string; // QC Inspector / Welding Coordinator name & stamp
  ndtReportNo?: string;
  notes?: string;
}

export interface WelderQualification {
  id: string;
  process: WeldingProcess;
  standard: 'AWS D1.1' | 'AWS D1.2' | 'AWS D1.6' | 'ASME IX' | 'ISO 9606-1';
  materialGroup: string; // e.g. "P-No. 1 Carbon Steel"
  thicknessRangeQualified: string; // e.g. "3.0 mm - Unlimited"
  positionsQualified: string[]; // e.g. ["1G", "2G", "3G", "4G"]
  qualificationDate: string; // ISO YYYY-MM-DD
  interval: ProlongationInterval; // 6 months or annual
  currentExpiryDate: string; // ISO YYYY-MM-DD
  proofDocumentName: string;
  proofDocumentUrl: string; // data url or sample image
  prolongationHistory: ProlongationRecord[];
}

export interface Welder {
  id: string;
  firstName: string;
  surname: string;
  idNumber: string; // National ID or Employee ID
  stampNumber: string; // Unique Welder Stamp # (e.g. W-104)
  hireDate: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  qualifications: WelderQualification[];
}

export interface PassSequenceItem {
  passNo: string;
  process: string;
  fillerClass: string;
  diameter: string;
  currentType: string;
  amperage: string;
  voltage: string;
  travelSpeed: string;
  remarks: string;
}

export interface WPS {
  id: string;
  wpsNumber: string;
  revision: string;
  supportingPQR: string;
  standard: string; // e.g. "AWS D1.1:2025 Structural Steel"
  material: string; // e.g. "ASTM A36, A572 Gr. 50"
  materialGroup: string; // e.g. "P-No. 1 Group 1, 2"
  process: WeldingProcess;
  processDescription: string;
  thicknessRange: string;
  voltRange: string;
  ampRange: string;
  fillerWireDiameter: string;
  fillerWireClassification: string;
  powerSourceType: string;
  travelSpeed: string;
  currentPolarity: string;
  shieldingGas: string;
  gasFlowRate: string;
  preheatMin: string;
  interpassMax: string;
  pwht: string;
  jointTypes: JointType[];
  jointDiagramType: 'v_groove' | 'double_v' | 'fillet_t' | 'corner' | 'lap';
  positions: string[];
  progression: string; // e.g. "Vertical Up"
  transferMode?: string; // e.g. "Spray", "Globular", "Short-Circuit"
  jointDetails: {
    grooveAngle: string;
    rootOpening: string;
    rootFace: string;
    backing: string;
  };
  passSequence: PassSequenceItem[];
  technique: {
    stringerOrWeave: string;
    interpassCleaning: string;
    peening: string;
  };
  notes: string;
}

export interface WorkCardWelderAssignment {
  welderId: string;
  welderName: string;
  stampNumber: string;
  chosenWpsId?: string; // Welder can ONLY choose from workCard's assignedWpsIds that they are qualified for
  jointReference?: string;
  assignedPasses?: string;
  signOffDate?: string;
  inspectionPassed?: boolean;
}

export interface WorkCardSpecSheet {
  id: string;
  workCardNumber: string; // e.g. "WC-2026-088"
  jobTitle: string;
  clientProject: string;
  drawingNumber: string;
  material: string;
  process: WeldingProcess;
  jointType: JointType;
  assignedWpsIds: string[]; // Pool of allowable WPS for this work card
  assignedWelders: WorkCardWelderAssignment[];
  status: WorkCardStatus;
  createdAt: string;
  targetCompletionDate: string;
  qaSupervisor: string;
  qaSupervisorStamp: string;
  notes?: string;
}
