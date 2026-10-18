import { Welder } from '../types';

// Helper to create clean industrial SVG test certificate previews
export function createSampleCertDataUrl(welderName: string, stampNo: string, process: string, standard: string, qualDate: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="100%" height="100%">
    <rect width="800" height="550" fill="#f8fafc" stroke="#334155" stroke-width="8"/>
    <rect x="20" y="20" width="760" height="510" fill="#ffffff" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6,4"/>
    <rect x="40" y="40" width="720" height="70" fill="#0f172a"/>
    <text x="400" y="82" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle" letter-spacing="2">WELDER PERFORMANCE QUALIFICATION RECORD (WPQR)</text>
    
    <text x="70" y="150" fill="#475569" font-family="sans-serif" font-size="12" font-weight="bold">CONFORMANCE STANDARD</text>
    <text x="70" y="175" fill="#0f172a" font-family="sans-serif" font-size="16" font-weight="bold">${standard}</text>
    
    <text x="450" y="150" fill="#475569" font-family="sans-serif" font-size="12" font-weight="bold">WELDER STAMP NUMBER</text>
    <text x="450" y="180" fill="#b45309" font-family="monospace" font-size="22" font-weight="bold">${stampNo}</text>
    
    <line x1="60" y1="205" x2="740" y2="205" stroke="#e2e8f0" stroke-width="1.5"/>
    
    <text x="70" y="235" fill="#475569" font-family="sans-serif" font-size="12" font-weight="bold">WELDER NAME</text>
    <text x="70" y="260" fill="#0f172a" font-family="sans-serif" font-size="16" font-weight="bold">${welderName}</text>
    
    <text x="450" y="235" fill="#475569" font-family="sans-serif" font-size="12" font-weight="bold">WELDING PROCESS QUALIFIED</text>
    <text x="450" y="260" fill="#0284c7" font-family="sans-serif" font-size="18" font-weight="bold">${process}</text>
    
    <text x="70" y="300" fill="#475569" font-family="sans-serif" font-size="12" font-weight="bold">TEST DATE / BASELINE</text>
    <text x="70" y="325" fill="#0f172a" font-family="monospace" font-size="15">${qualDate}</text>
    
    <text x="450" y="300" fill="#475569" font-family="sans-serif" font-size="12" font-weight="bold">NON-DESTRUCTIVE TESTING (NDT)</text>
    <text x="450" y="325" fill="#15803d" font-family="sans-serif" font-size="15" font-weight="bold">Visual &amp; Volumetric RT / UT - ACCEPTABLE</text>
    
    <rect x="60" y="355" width="680" height="90" fill="#f1f5f9" rx="4"/>
    <text x="80" y="380" fill="#334155" font-family="sans-serif" font-size="12" font-weight="bold">QUALIFICATION TEST VARIABLE RANGES</text>
    <text x="80" y="405" fill="#475569" font-family="sans-serif" font-size="11">Thickness Qualified: 3.0 mm to Unlimited  |  Position Qualified: All Positions (1G, 2G, 3G Up, 4G)</text>
    <text x="80" y="425" fill="#475569" font-family="sans-serif" font-size="11">Backing: With Backing / Back-gouged  |  Filler Metal F-No: F4 (E7018 / E71T-1M / ER70S-6)</text>
    
    <circle cx="680" cy="460" r="32" fill="#0f172a" opacity="0.9"/>
    <circle cx="680" cy="460" r="28" fill="none" stroke="#f59e0b" stroke-width="2"/>
    <text x="680" y="456" fill="#ffffff" font-family="sans-serif" font-size="8" font-weight="bold" text-anchor="middle">AUTHORIZED</text>
    <text x="680" y="468" fill="#f59e0b" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">AWS / QC</text>
    
    <text x="70" y="480" fill="#64748b" font-family="sans-serif" font-size="10">Certified by Level III Welding Examiner &amp; AWS QC1 Certified Welding Inspector (CWI)</text>
    <text x="70" y="496" fill="#94a3b8" font-family="monospace" font-size="10">DOC ID: WPQR-${stampNo}-${process}-CERT-2026</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_WELDERS_LIST: Welder[] = [
  {
    id: 'WLD-001',
    firstName: 'Marcus',
    surname: 'Vance',
    idNumber: 'ID-880314-5521',
    stampNumber: 'W-104',
    hireDate: '2021-04-12',
    phone: '+1 (555) 249-0198',
    email: 'm.vance@fabworks.industrial',
    qualifications: [
      {
        id: 'QUAL-MV-01',
        process: 'SMAW',
        standard: 'AWS D1.1',
        materialGroup: 'P-No. 1 Carbon Steel (A36, A572)',
        thicknessRangeQualified: '3.0 mm - Unlimited (Plate & Pipe >= 24")',
        positionsQualified: ['1G', '2G', '3G', '4G'],
        qualificationDate: '2023-08-10',
        interval: 'ANNUAL',
        currentExpiryDate: '2027-08-10',
        proofDocumentName: 'WPQR_Cert_Vance_SMAW_AWS_D1.1.pdf',
        proofDocumentUrl: createSampleCertDataUrl('Marcus Vance', 'W-104', 'SMAW', 'AWS D1.1', '2023-08-10'),
        prolongationHistory: [
          {
            id: 'PRO-101',
            prolongedDate: '2024-08-05',
            expiryDate: '2025-08-10',
            confirmedBy: 'R. Davis (CWI #14092)',
            ndtReportNo: 'RT-2024-912',
            notes: 'Production RT testing satisfactory.',
          },
          {
            id: 'PRO-102',
            prolongedDate: '2025-08-01',
            expiryDate: '2026-08-10',
            confirmedBy: 'R. Davis (CWI #14092)',
            ndtReportNo: 'UT-2025-410',
            notes: 'Annual audit pass.',
          },
          {
            id: 'PRO-103',
            prolongedDate: '2026-08-02',
            expiryDate: '2027-08-10',
            confirmedBy: 'K. Larson (QC Manager)',
            ndtReportNo: 'RT-2026-118',
            notes: 'Annual prolongation verified against structural beam splices.',
          },
        ],
      },
      {
        id: 'QUAL-MV-02',
        process: 'FCAW',
        standard: 'AWS D1.1',
        materialGroup: 'P-No. 1 Carbon Steel (A572 Gr. 50)',
        thicknessRangeQualified: '6.0 mm - Unlimited',
        positionsQualified: ['1G', '2G', '3G', '4G'],
        qualificationDate: '2024-04-29',
        interval: '6_MONTHS', // 6-month prolongation requirement
        // Current date is 2026-10-17. Expiry set to 2026-10-29 (in 12 days!) -> triggers 30-day notice!
        currentExpiryDate: '2026-10-29',
        proofDocumentName: 'WPQR_Cert_Vance_FCAW_SemiAuto.pdf',
        proofDocumentUrl: createSampleCertDataUrl('Marcus Vance', 'W-104', 'FCAW', 'AWS D1.1', '2024-04-29'),
        prolongationHistory: [
          {
            id: 'PRO-104',
            prolongedDate: '2026-04-25',
            expiryDate: '2026-10-29',
            confirmedBy: 'R. Davis (CWI #14092)',
            ndtReportNo: 'VT-2026-664',
            notes: '6-month production log check confirmed active employment and defect rate < 0.5%.',
          },
        ],
      },
    ],
  },
  {
    id: 'WLD-002',
    firstName: 'Elena',
    surname: 'Rostova',
    idNumber: 'ID-910902-8843',
    stampNumber: 'W-209',
    hireDate: '2022-01-15',
    phone: '+1 (555) 782-9901',
    email: 'e.rostova@fabworks.industrial',
    qualifications: [
      {
        id: 'QUAL-ER-01',
        process: 'GTAW',
        standard: 'AWS D1.6',
        materialGroup: 'P-No. 8 Austenitic Stainless (304L/316L)',
        thicknessRangeQualified: '1.5 mm - 12.0 mm (Pipe 6G all positions)',
        positionsQualified: ['1G', '2G', '3G', '4G', '5G', '6G'],
        qualificationDate: '2024-04-13',
        interval: '6_MONTHS',
        // Current date is 2026-10-17. Expiry set to 2026-10-13 (expired 4 days ago!) -> shows EXPIRED alert!
        currentExpiryDate: '2026-10-13',
        proofDocumentName: 'WPQR_Rostova_GTAW_Stainless_6G.pdf',
        proofDocumentUrl: createSampleCertDataUrl('Elena Rostova', 'W-209', 'GTAW', 'AWS D1.6', '2024-04-13'),
        prolongationHistory: [
          {
            id: 'PRO-201',
            prolongedDate: '2026-04-10',
            expiryDate: '2026-10-13',
            confirmedBy: 'M. Becker (Level III NDT)',
            ndtReportNo: 'PT-2026-091',
            notes: 'Dye penetrant inspection passed.',
          },
        ],
      },
      {
        id: 'QUAL-ER-02',
        process: 'GMAW',
        standard: 'AWS D1.2',
        materialGroup: 'P-No. 23 Aluminum (6061-T6 / 5083)',
        thicknessRangeQualified: '3.0 mm - 16.0 mm',
        positionsQualified: ['1G', '2G', '1F', '2F'],
        qualificationDate: '2025-02-18',
        interval: 'ANNUAL',
        currentExpiryDate: '2027-02-18',
        proofDocumentName: 'WPQR_Rostova_GMAW_Aluminum.pdf',
        proofDocumentUrl: createSampleCertDataUrl('Elena Rostova', 'W-209', 'GMAW', 'AWS D1.2', '2025-02-18'),
        prolongationHistory: [
          {
            id: 'PRO-202',
            prolongedDate: '2026-02-15',
            expiryDate: '2027-02-18',
            confirmedBy: 'K. Larson (QC Manager)',
            ndtReportNo: 'UT-2026-202',
            notes: 'Macro etch & bend test passed.',
          },
        ],
      },
    ],
  },
  {
    id: 'WLD-003',
    firstName: 'David',
    surname: 'Chen',
    idNumber: 'ID-850619-3312',
    stampNumber: 'W-312',
    hireDate: '2020-09-01',
    phone: '+1 (555) 438-2210',
    email: 'd.chen@fabworks.industrial',
    qualifications: [
      {
        id: 'QUAL-DC-01',
        process: 'GMAW',
        standard: 'AWS D1.1',
        materialGroup: 'P-No. 1 Carbon Steel',
        thicknessRangeQualified: '3.0 mm - 32.0 mm',
        positionsQualified: ['1G', '2G', '1F', '2F'],
        qualificationDate: '2023-11-05',
        interval: 'ANNUAL',
        currentExpiryDate: '2026-11-05', // Due in 19 days -> 30-day notice!
        proofDocumentName: 'WPQR_Chen_GMAW_MIG_Spray.pdf',
        proofDocumentUrl: createSampleCertDataUrl('David Chen', 'W-312', 'GMAW', 'AWS D1.1', '2023-11-05'),
        prolongationHistory: [
          {
            id: 'PRO-301',
            prolongedDate: '2025-11-01',
            expiryDate: '2026-11-05',
            confirmedBy: 'R. Davis (CWI #14092)',
            ndtReportNo: 'RT-2025-881',
            notes: 'Annual production verification RT on column splice.',
          },
        ],
      },
      {
        id: 'QUAL-DC-02',
        process: 'FCAW',
        standard: 'AWS D1.1',
        materialGroup: 'P-No. 1 Carbon Steel',
        thicknessRangeQualified: '6.0 mm - Unlimited',
        positionsQualified: ['1G', '2G', '3G', '4G'],
        qualificationDate: '2024-03-10',
        interval: 'ANNUAL',
        currentExpiryDate: '2027-03-10',
        proofDocumentName: 'WPQR_Chen_FCAW_Structural.pdf',
        proofDocumentUrl: createSampleCertDataUrl('David Chen', 'W-312', 'FCAW', 'AWS D1.1', '2024-03-10'),
        prolongationHistory: [
          {
            id: 'PRO-302',
            prolongedDate: '2026-03-05',
            expiryDate: '2027-03-10',
            confirmedBy: 'K. Larson (QC Manager)',
            ndtReportNo: 'UT-2026-319',
            notes: 'Satisfactory ultrasonic test results.',
          },
        ],
      },
    ],
  },
  {
    id: 'WLD-004',
    firstName: 'Sipho',
    surname: 'Khumalo',
    idNumber: 'ID-871204-7719',
    stampNumber: 'W-415',
    hireDate: '2019-11-10',
    phone: '+1 (555) 604-8391',
    email: 's.khumalo@fabworks.industrial',
    qualifications: [
      {
        id: 'QUAL-SK-01',
        process: 'SMAW',
        standard: 'AWS D1.1',
        materialGroup: 'P-No. 1 Carbon Steel (A36, A572)',
        thicknessRangeQualified: '3.0 mm - Unlimited',
        positionsQualified: ['1G', '2G', '3G', '4G', '6G'],
        qualificationDate: '2024-05-08',
        interval: '6_MONTHS',
        currentExpiryDate: '2026-11-08', // Due in 22 days -> 30-day notice!
        proofDocumentName: 'WPQR_Khumalo_SMAW_6G_Pipe.pdf',
        proofDocumentUrl: createSampleCertDataUrl('Sipho Khumalo', 'W-415', 'SMAW', 'AWS D1.1', '2024-05-08'),
        prolongationHistory: [
          {
            id: 'PRO-401',
            prolongedDate: '2026-05-05',
            expiryDate: '2026-11-08',
            confirmedBy: 'R. Davis (CWI #14092)',
            ndtReportNo: 'RT-2026-512',
            notes: 'Full penetration groove weld tested 100% sound.',
          },
        ],
      },
      {
        id: 'QUAL-SK-02',
        process: 'GTAW',
        standard: 'AWS D1.6',
        materialGroup: 'P-No. 8 Stainless Steel',
        thicknessRangeQualified: '2.0 mm - 12.0 mm',
        positionsQualified: ['1G', '2G', '3G'],
        qualificationDate: '2025-06-20',
        interval: 'ANNUAL',
        currentExpiryDate: '2027-06-20',
        proofDocumentName: 'WPQR_Khumalo_GTAW_Stainless.pdf',
        proofDocumentUrl: createSampleCertDataUrl('Sipho Khumalo', 'W-415', 'GTAW', 'AWS D1.6', '2025-06-20'),
        prolongationHistory: [
          {
            id: 'PRO-402',
            prolongedDate: '2026-06-18',
            expiryDate: '2027-06-20',
            confirmedBy: 'M. Becker (Level III)',
            ndtReportNo: 'VT-2026-789',
            notes: 'Visual acceptance standard met.',
          },
        ],
      },
    ],
  },
  {
    id: 'WLD-005',
    firstName: 'James',
    surname: 'Miller',
    idNumber: 'ID-820108-9904',
    stampNumber: 'W-518',
    hireDate: '2018-03-22',
    phone: '+1 (555) 912-3847',
    email: 'j.miller@fabworks.industrial',
    qualifications: [
      {
        id: 'QUAL-JM-01',
        process: 'SAW',
        standard: 'AWS D1.1',
        materialGroup: 'P-No. 1 Group 2 High Tensile Steel',
        thicknessRangeQualified: '12.0 mm - Unlimited',
        positionsQualified: ['1G', '1F'],
        qualificationDate: '2023-09-14',
        interval: 'ANNUAL',
        currentExpiryDate: '2027-09-14',
        proofDocumentName: 'WPQR_Miller_SAW_SubmergedArc.pdf',
        proofDocumentUrl: createSampleCertDataUrl('James Miller', 'W-518', 'SAW', 'AWS D1.1', '2023-09-14'),
        prolongationHistory: [
          {
            id: 'PRO-501',
            prolongedDate: '2026-09-10',
            expiryDate: '2027-09-14',
            confirmedBy: 'R. Davis (CWI #14092)',
            ndtReportNo: 'UT-2026-904',
            notes: 'Heavy plate box girder longitudinal seam NDT 100% pass.',
          },
        ],
      },
      {
        id: 'QUAL-JM-02',
        process: 'GMAW',
        standard: 'AWS D1.1',
        materialGroup: 'P-No. 1 Carbon Steel',
        thicknessRangeQualified: '3.0 mm - 25.0 mm',
        positionsQualified: ['1G', '2G'],
        qualificationDate: '2024-01-20',
        interval: 'ANNUAL',
        currentExpiryDate: '2027-01-20',
        proofDocumentName: 'WPQR_Miller_GMAW_MIG.pdf',
        proofDocumentUrl: createSampleCertDataUrl('James Miller', 'W-518', 'GMAW', 'AWS D1.1', '2024-01-20'),
        prolongationHistory: [
          {
            id: 'PRO-502',
            prolongedDate: '2026-01-18',
            expiryDate: '2027-01-20',
            confirmedBy: 'K. Larson (QC Manager)',
            ndtReportNo: 'VT-2026-114',
            notes: 'Satisfactory visual fillet quality.',
          },
        ],
      },
    ],
  },
];
