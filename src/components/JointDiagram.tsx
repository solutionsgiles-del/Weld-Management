import React from 'react';

interface JointDiagramProps {
  type: 'v_groove' | 'double_v' | 'fillet_t' | 'corner' | 'lap' | string;
  title?: string;
  grooveAngle?: string;
  rootOpening?: string;
  rootFace?: string;
  backing?: string;
  className?: string;
}

export const JointDiagram: React.FC<JointDiagramProps> = ({
  type,
  title,
  grooveAngle = '60°',
  rootOpening = '2.5 mm',
  rootFace = '1.5 mm',
  backing = 'Backing Strip / Open',
  className = 'w-full h-44',
}) => {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes('double')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900 rounded-lg p-3 border border-slate-700 text-slate-100 ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-full max-h-36">
          {/* Base plate left */}
          <path d="M 20 20 L 120 20 L 140 70 L 140 90 L 120 140 L 20 140 Z" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          {/* Base plate right */}
          <path d="M 300 20 L 200 20 L 180 70 L 180 90 L 200 140 L 300 140 Z" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          {/* Top Weld Deposit */}
          <path d="M 120 20 Q 160 12 200 20 L 180 70 L 140 70 Z" fill="#f59e0b" fillOpacity="0.85" stroke="#d97706" strokeWidth="1.5" />
          {/* Bottom Weld Deposit */}
          <path d="M 120 140 Q 160 148 200 140 L 180 90 L 140 90 Z" fill="#f59e0b" fillOpacity="0.85" stroke="#d97706" strokeWidth="1.5" />
          {/* Root Face Zone */}
          <rect x="140" y="70" width="40" height="20" fill="#f59e0b" fillOpacity="0.9" />
          {/* Dimension Lines */}
          <line x1="140" y1="100" x2="180" y2="100" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="160" y="84" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">RF {rootFace}</text>
          {/* Angle indicator */}
          <path d="M 125 35 A 30 30 0 0 0 195 35" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
          <text x="160" y="52" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="middle">{grooveAngle}</text>
          {/* Dimension arrows */}
          <text x="160" y="115" fill="#38bdf8" fontSize="8" textAnchor="middle">Gap: {rootOpening}</text>
        </svg>
        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
          <span className="font-medium text-slate-200">Double-V Butt Joint</span>
          <span>Symmetrical Double Groove</span>
        </div>
      </div>
    );
  }

  if (normalizedType.includes('fillet') || normalizedType.includes('t_joint') || normalizedType.includes('t-joint')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900 rounded-lg p-3 border border-slate-700 text-slate-100 ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-full max-h-36">
          {/* Bottom Horizontal Flange */}
          <rect x="30" y="110" width="260" height="35" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          {/* Vertical Stem / Web */}
          <rect x="140" y="20" width="40" height="90" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          {/* Left Fillet Weld */}
          <path d="M 140 70 Q 105 105 105 110 L 140 110 Z" fill="#f59e0b" fillOpacity="0.85" stroke="#d97706" strokeWidth="1.5" />
          {/* Right Fillet Weld */}
          <path d="M 180 70 Q 215 105 215 110 L 180 110 Z" fill="#f59e0b" fillOpacity="0.85" stroke="#d97706" strokeWidth="1.5" />
          {/* Leg dimension markings */}
          <line x1="95" y1="110" x2="95" y2="70" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="90" y1="70" x2="100" y2="70" stroke="#38bdf8" strokeWidth="1" />
          <text x="82" y="93" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="end">Leg z</text>
          {/* Throat thickness ray */}
          <line x1="140" y1="110" x2="120" y2="90" stroke="#f43f5e" strokeWidth="1.5" />
          <text x="120" y="80" fill="#f43f5e" fontSize="9" fontWeight="bold">Throat a</text>
          {/* Right Leg Callout */}
          <text x="225" y="105" fill="#38bdf8" fontSize="9">Fillet Weld</text>
        </svg>
        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
          <span className="font-medium text-slate-200">T-Joint Fillet Weld</span>
          <span>Double Fillet (Web to Flange)</span>
        </div>
      </div>
    );
  }

  if (normalizedType.includes('corner')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900 rounded-lg p-3 border border-slate-700 text-slate-100 ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-full max-h-36">
          {/* Horizontal Bottom Member */}
          <rect x="50" y="95" width="200" height="35" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          {/* Vertical Member */}
          <path d="M 50 20 L 85 20 L 85 95 L 50 95 Z" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          {/* Exterior Corner Weld Bead */}
          <path d="M 50 20 Q 25 25 30 50 L 30 95 L 50 95 Z" fill="#f59e0b" fillOpacity="0.85" stroke="#d97706" strokeWidth="1.5" />
          {/* Interior Fillet Weld */}
          <path d="M 85 70 Q 110 85 110 95 L 85 95 Z" fill="#f59e0b" fillOpacity="0.85" stroke="#d97706" strokeWidth="1.5" />
          {/* Annotations */}
          <text x="175" y="45" fill="#38bdf8" fontSize="9" fontWeight="bold">Flush Outside Corner</text>
          <text x="175" y="62" fill="#94a3b8" fontSize="8">Full Penetration Groove / Fillet</text>
          <line x1="85" y1="95" x2="165" y2="55" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,2" />
        </svg>
        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
          <span className="font-medium text-slate-200">Corner Joint Design</span>
          <span>Inside Fillet + Outside Bevel</span>
        </div>
      </div>
    );
  }

  if (normalizedType.includes('lap')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900 rounded-lg p-3 border border-slate-700 text-slate-100 ${className}`}>
        <svg viewBox="0 0 320 160" className="w-full h-full max-h-36">
          {/* Bottom Plate */}
          <rect x="40" y="85" width="220" height="30" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          {/* Top Overlapping Plate */}
          <rect x="110" y="55" width="170" height="30" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          {/* Left Lap Weld */}
          <path d="M 110 55 Q 85 70 85 85 L 110 85 Z" fill="#f59e0b" fillOpacity="0.85" stroke="#d97706" strokeWidth="1.5" />
          {/* Overlap Dimension */}
          <line x1="110" y1="40" x2="260" y2="40" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="110" y1="35" x2="110" y2="45" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="260" y1="35" x2="260" y2="45" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="185" y="32" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">Overlap ≥ 4t</text>
          {/* Weld callout */}
          <text x="60" y="135" fill="#f59e0b" fontSize="9" fontWeight="bold">Continuous Lap Fillet</text>
        </svg>
        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
          <span className="font-medium text-slate-200">Lap Joint</span>
          <span>Parallel Plate Overlap Fillet</span>
        </div>
      </div>
    );
  }

  // Default: Single-V Groove Butt Joint
  return (
    <div className={`flex flex-col items-center justify-center bg-slate-900 rounded-lg p-3 border border-slate-700 text-slate-100 ${className}`}>
      <svg viewBox="0 0 320 160" className="w-full h-full max-h-36">
        {/* Left Plate */}
        <path d="M 20 30 L 120 30 L 140 100 L 140 115 L 20 115 Z" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
        {/* Right Plate */}
        <path d="M 300 30 L 200 30 L 180 100 L 180 115 L 300 115 Z" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
        {/* Backing Bar underneath */}
        <rect x="120" y="117" width="80" height="15" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="160" y="128" fill="#cbd5e1" fontSize="7" fontWeight="bold" textAnchor="middle">BACKING BAR</text>
        {/* Weld Bead Multi-pass Fill */}
        <path d="M 120 30 Q 160 20 200 30 L 180 100 L 180 115 L 140 115 L 140 100 Z" fill="#f59e0b" fillOpacity="0.85" stroke="#d97706" strokeWidth="1.5" />
        {/* Angle Arch */}
        <path d="M 130 50 A 40 40 0 0 0 190 50" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
        <text x="160" y="68" fill="#fda4af" fontSize="11" fontWeight="bold" textAnchor="middle">{grooveAngle}</text>
        {/* Root Opening */}
        <line x1="140" y1="108" x2="180" y2="108" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="160" y="104" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">R = {rootOpening}</text>
        {/* Root Face indicator */}
        <text x="195" y="108" fill="#a78bfa" fontSize="8" textAnchor="start">RF: {rootFace}</text>
      </svg>
      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
        <span className="font-medium text-slate-200">Single-V Groove Butt Joint</span>
        <span>{backing}</span>
      </div>
    </div>
  );
};
