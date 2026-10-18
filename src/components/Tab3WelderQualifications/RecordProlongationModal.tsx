import React, { useState } from 'react';
import { Welder, WelderQualification, ProlongationInterval } from '../../types';
import { calculateNextExpiryDate } from '../../utils/qualificationMatcher';
import { X, Calendar, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

interface RecordProlongationModalProps {
  isOpen: boolean;
  onClose: () => void;
  welder: Welder;
  qualification: WelderQualification;
  onSaveProlongation: (
    welderId: string,
    qualId: string,
    newExpiryDate: string,
    interval: ProlongationInterval,
    confirmedBy: string,
    ndtReportNo: string,
    notes: string
  ) => void;
}

export const RecordProlongationModal: React.FC<RecordProlongationModalProps> = ({
  isOpen,
  onClose,
  welder,
  qualification,
  onSaveProlongation,
}) => {
  const [prolongedDate, setProlongedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [interval, setInterval] = useState<ProlongationInterval>(qualification.interval);
  const [confirmedBy, setConfirmedBy] = useState<string>('Robert Davis, AWS CWI #14092');
  const [ndtReportNo, setNdtReportNo] = useState<string>(`RT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [notes, setNotes] = useState<string>('Satisfactory volumetric NDT test and continuous production verification record.');

  if (!isOpen) return null;

  const calculatedNewExpiry = calculateNextExpiryDate(prolongedDate, interval);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedBy.trim()) {
      alert('Please enter the QC Examiner name and stamp number.');
      return;
    }
    onSaveProlongation(
      welder.id,
      qualification.id,
      calculatedNewExpiry,
      interval,
      confirmedBy,
      ndtReportNo,
      notes
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Record Welder Prolongation</h3>
              <p className="text-xs text-slate-400">
                {welder.firstName} {welder.surname} · Stamp #{welder.stampNumber} · {qualification.process}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Current Expiry vs New Expiry comparison */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Current Expiry</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{qualification.currentExpiryDate}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="text-right">
              <span className="text-[11px] text-emerald-600 font-medium block">New Prolonged Expiry</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">{calculatedNewExpiry}</span>
            </div>
          </div>

          {/* Prolongation Standard Interval Requirement */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prolongation Interval (Per AWS D1.1 / ISO 9606 / ASME IX)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setInterval('6_MONTHS')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  interval === '6_MONTHS'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">6 Months Extension</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Continuous production confirmation</div>
              </button>
              <button
                type="button"
                onClick={() => setInterval('ANNUAL')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  interval === 'ANNUAL'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">Annual Extension (1 Year)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Volumetric test / retest audit</div>
              </button>
            </div>
          </div>

          {/* Verification Date */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prolongation Audit Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                value={prolongedDate}
                onChange={(e) => setProlongedDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Examiner & Stamp # */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Examiner / Welding Coordinator &amp; Stamp #
            </label>
            <input
              type="text"
              value={confirmedBy}
              onChange={(e) => setConfirmedBy(e.target.value)}
              placeholder="e.g. Robert Davis, AWS CWI #14092"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* NDT Report Reference */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              NDT / Production Report #
            </label>
            <input
              type="text"
              value={ndtReportNo}
              onChange={(e) => setNdtReportNo(e.target.value)}
              placeholder="e.g. RT-2026-881 or VT Log #2026-W1"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
            />
          </div>

          {/* Verification Notes */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prolongation Notes / Quality Assessment
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Confirm Prolongation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
