import React, { useState } from 'react';
import { Welder, WelderQualification } from '../../types';
import { ProlongationBadge } from './ProlongationBadge';
import { ProofViewerModal } from './ProofViewerModal';
import { RecordProlongationModal } from './RecordProlongationModal';
import { AddQualificationModal } from './AddQualificationModal';
import { X, Award, FileText, Stamp, Plus, History, Clock, CheckCircle2 } from 'lucide-react';

interface WelderDetailModalProps {
  welder: Welder | null;
  onClose: () => void;
  onAddQualification: (welderId: string, qualification: WelderQualification) => void;
  onSaveProlongation: (
    welderId: string,
    qualId: string,
    newExpiryDate: string,
    interval: '6_MONTHS' | 'ANNUAL',
    confirmedBy: string,
    ndtReportNo: string,
    notes: string
  ) => void;
}

export const WelderDetailModal: React.FC<WelderDetailModalProps> = ({
  welder,
  onClose,
  onAddQualification,
  onSaveProlongation,
}) => {
  const [selectedProofQual, setSelectedProofQual] = useState<WelderQualification | null>(null);
  const [prolongQualTarget, setProlongQualTarget] = useState<WelderQualification | null>(null);
  const [isAddingQual, setIsAddingQual] = useState(false);

  if (!welder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
              {welder.firstName[0]}{welder.surname[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {welder.firstName} {welder.surname}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold border border-amber-400/30">
                  Stamp: {welder.stampNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ID: <span className="font-mono text-slate-300">{welder.idNumber}</span> · Employed: {welder.hireDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingQual(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-lg transition-colors font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Qualified Process</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Qualifications Summary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>AWS &amp; Standard Performance Qualifications ({welder.qualifications.length})</span>
              </h3>
            </div>

            {welder.qualifications.length === 0 ? (
              <div className="border border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
                <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No process qualifications recorded yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Click "Add Qualified Process" above to register SMAW, GMAW, GTAW, FCAW, or SAW certification.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {welder.qualifications.map((qual) => (
                  <div
                    key={qual.id}
                    className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition-colors shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                            {qual.process}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">{qual.standard}</span>
                          <span className="text-slate-400 font-medium">·</span>
                          <span className="text-xs text-slate-600">{qual.materialGroup}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                          <span>
                            Qualified: <strong className="font-mono text-slate-700">{qual.qualificationDate}</strong>
                          </span>
                          <span>
                            Thickness: <strong className="font-mono text-slate-700">{qual.thicknessRangeQualified}</strong>
                          </span>
                          <span>
                            Positions: <strong className="font-mono text-slate-700">{qual.positionsQualified.join(', ')}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Prolongation Badge & Fast Actions */}
                      <div className="flex items-center gap-2">
                        <ProlongationBadge expiryDate={qual.currentExpiryDate} interval={qual.interval} />
                        <button
                          onClick={() => setProlongQualTarget(qual)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors"
                        >
                          Prolong / Renew
                        </button>
                        <button
                          onClick={() => setSelectedProofQual(qual)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors flex items-center gap-1"
                          title="View Proof Document / Certificate"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Proof</span>
                        </button>
                      </div>
                    </div>

                    {/* Prolongation History Trail */}
                    <div className="mt-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                        <History className="w-3 h-3 text-slate-400" />
                        <span>Prolongation Logs &amp; Audit Trail ({qual.prolongationHistory.length})</span>
                      </span>
                      <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 space-y-1.5">
                        {qual.prolongationHistory.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-600 border-b border-slate-200/50 pb-1 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>
                                Extended on <strong className="font-mono text-slate-800">{item.prolongedDate}</strong> by{' '}
                                <span className="font-semibold text-slate-800">{item.confirmedBy}</span>
                              </span>
                              {item.ndtReportNo && (
                                <span className="text-[10px] font-mono bg-slate-200/60 px-1.5 py-0.2 rounded text-slate-700">
                                  {item.ndtReportNo}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 font-mono text-[10px] sm:text-right mt-0.5 sm:mt-0">
                              Valid thru: <strong className="text-slate-800">{item.expiryDate}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Close WPQR Dossier
          </button>
        </div>
      </div>

      {/* Proof Viewer Sub-modal */}
      {selectedProofQual && (
        <ProofViewerModal
          isOpen={true}
          onClose={() => setSelectedProofQual(null)}
          documentName={selectedProofQual.proofDocumentName}
          documentUrl={selectedProofQual.proofDocumentUrl}
          welderName={`${welder.firstName} ${welder.surname}`}
          stampNumber={welder.stampNumber}
          process={selectedProofQual.process}
        />
      )}

      {/* Record Prolongation Sub-modal */}
      {prolongQualTarget && (
        <RecordProlongationModal
          isOpen={true}
          onClose={() => setProlongQualTarget(null)}
          welder={welder}
          qualification={prolongQualTarget}
          onSaveProlongation={onSaveProlongation}
        />
      )}

      {/* Add Qualification Sub-modal */}
      {isAddingQual && (
        <AddQualificationModal
          isOpen={true}
          onClose={() => setIsAddingQual(false)}
          welder={welder}
          onAddQualification={onAddQualification}
        />
      )}
    </div>
  );
};
