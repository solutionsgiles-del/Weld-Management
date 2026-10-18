import React from 'react';
import { getQualificationStatus } from '../../utils/qualificationMatcher';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ProlongationBadgeProps {
  expiryDate: string;
  interval?: '6_MONTHS' | 'ANNUAL';
  compact?: boolean;
}

export const ProlongationBadge: React.FC<ProlongationBadgeProps> = ({
  expiryDate,
  interval,
  compact = false,
}) => {
  const result = getQualificationStatus(expiryDate);

  if (result.status === 'expired') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold text-rose-700 bg-rose-50 border border-rose-300 rounded px-2 py-0.5`}
        title={`Expired on ${expiryDate}. Prolongation overdue.`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        <span>{result.label}</span>
        {interval && <span className="text-[10px] text-rose-500 font-normal">({interval === '6_MONTHS' ? '6m' : '1y'})</span>}
      </div>
    );
  }

  if (result.status === 'expiring_soon') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded px-2 py-0.5`}
        title={`Action required: Prolongation due by ${expiryDate} (< 30 days notice)`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>{result.label}</span>
        {interval && <span className="text-[10px] text-amber-700 font-normal">({interval === '6_MONTHS' ? '6m' : '1y'})</span>}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5`}
      title={`Valid until ${expiryDate}`}
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <span>{compact ? `${result.daysRemaining}d` : `Valid (${result.daysRemaining}d)`}</span>
      {interval && <span className="text-[10px] text-emerald-600 font-normal">({interval === '6_MONTHS' ? '6m' : '1y'})</span>}
    </div>
  );
};
