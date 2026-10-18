import React, { useState } from 'react';
import { Welder } from '../types';
import { getProlongationAlerts } from '../utils/qualificationMatcher';
import { AlertTriangle, Clock, ArrowRight, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

interface ProlongationAlertBannerProps {
  welders: Welder[];
  onNavigateToWelders: (filter: 'EXPIRING' | 'EXPIRED') => void;
}

export const ProlongationAlertBanner: React.FC<ProlongationAlertBannerProps> = ({
  welders,
  onNavigateToWelders,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { expiringSoon, expired, totalAlerts } = getProlongationAlerts(welders);

  if (totalAlerts === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 border-b border-amber-300/80 px-4 md:px-8 py-3 text-xs shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-amber-500 text-slate-950 rounded-md font-bold shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-xs">
                  Welder Qualification Notice:
                </span>
                {expired.length > 0 && (
                  <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-100/90 border border-rose-300 px-2 py-0.5 rounded text-[11px]">
                    <ShieldAlert className="w-3 h-3 text-rose-600" />
                    <span>{expired.length} Overdue / Expired</span>
                  </span>
                )}
                {expiringSoon.length > 0 && (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-[11px]">
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>{expiringSoon.length} Due for Prolongation (&le;30 Days)</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                AWS D1.1 / ISO 9606 compliance mandates audit re-validation every 6 months or annually before expiry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded bg-white/70 border border-slate-300 transition-colors flex items-center gap-1"
            >
              <span>{isExpanded ? 'Hide Details' : 'View Impacted Welders'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onNavigateToWelders(expired.length > 0 ? 'EXPIRED' : 'EXPIRING')}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-md transition-colors shadow-sm"
            >
              <span>Manage WPQR Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded list of welders needing action */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {/* Expired list */}
            {expired.map(({ welder, qual, status }) => (
              <div
                key={`exp-${welder.id}-${qual.id}`}
                className="p-2 bg-white rounded border border-rose-300 flex items-center justify-between text-[11px]"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>{welder.firstName} {welder.surname}</span>
                    <span className="font-mono text-rose-700 font-bold bg-rose-50 px-1 rounded">
                      #{welder.stampNumber}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Process: <strong className="text-slate-700">{qual.process}</strong> ({qual.standard})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-rose-700 text-[10px] block">
                    {status.label}
                  </span>
                  <button
                    onClick={() => onNavigateToWelders('EXPIRED')}
                    className="text-[10px] text-rose-700 font-semibold underline hover:text-rose-900"
                  >
                    Prolong now
                  </button>
                </div>
              </div>
            ))}

            {/* Expiring soon list */}
            {expiringSoon.map(({ welder, qual, status }) => (
              <div
                key={`soon-${welder.id}-${qual.id}`}
                className="p-2 bg-white rounded border border-amber-300 flex items-center justify-between text-[11px]"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>{welder.firstName} {welder.surname}</span>
                    <span className="font-mono text-amber-800 font-bold bg-amber-50 px-1 rounded">
                      #{welder.stampNumber}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Process: <strong className="text-slate-700">{qual.process}</strong> ({qual.standard})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-amber-800 text-[10px] block">
                    {status.label}
                  </span>
                  <button
                    onClick={() => onNavigateToWelders('EXPIRING')}
                    className="text-[10px] text-amber-800 font-semibold underline hover:text-amber-950"
                  >
                    Prolong now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
