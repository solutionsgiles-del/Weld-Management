import React, { useState, useMemo } from 'react';
import { WorkCardSpecSheet, Welder, WPS, WorkCardStatus } from '../../types';
import { NewJobModal } from './NewJobModal';
import { WorkCardDetailModal } from './WorkCardDetailModal';
import { FileSpreadsheet, Plus, Search, Filter, Stamp, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

interface WorkCardListProps {
  workCards: WorkCardSpecSheet[];
  weldersList: Welder[];
  wpsLibrary: WPS[];
  onSaveJob: (newCard: WorkCardSpecSheet) => void;
  onUpdateWorkCard: (updatedCard: WorkCardSpecSheet) => void;
  onOpenFullWps: (wps: WPS) => void;
}

export const WorkCardList: React.FC<WorkCardListProps> = ({
  workCards,
  weldersList,
  wpsLibrary,
  onSaveJob,
  onUpdateWorkCard,
  onOpenFullWps,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [activeCardDetail, setActiveCardDetail] = useState<WorkCardSpecSheet | null>(null);

  const filteredCards = useMemo(() => {
    return workCards.filter((card) => {
      if (statusFilter !== 'ALL' && card.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = card.workCardNumber.toLowerCase().includes(q);
        const matchTitle = card.jobTitle.toLowerCase().includes(q);
        const matchProject = card.clientProject.toLowerCase().includes(q);
        const matchDwg = card.drawingNumber.toLowerCase().includes(q);
        const matchWelder = card.assignedWelders.some(
          (w) => w.welderName.toLowerCase().includes(q) || w.stampNumber.toLowerCase().includes(q)
        );
        const matchWps = card.assignedWpsIds.some((id) => id.toLowerCase().includes(q));
        if (!matchNum && !matchTitle && !matchProject && !matchDwg && !matchWelder && !matchWps) {
          return false;
        }
      }
      return true;
    });
  }, [workCards, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Controls Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-slate-100 text-slate-800 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-amber-600" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Job Selection &amp; Work Card Spec Sheets
              </h1>
              <p className="text-xs text-slate-500">
                Create new job spec sheets, assign multiple welders &amp; stamps, and enforce AWS qualification compliance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsNewJobOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Job Spec Sheet</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-5 items-end">
          <div className="md:col-span-8">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Search Work Card / Project / Welder Stamp / Drawing #
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search WC-2026-0881, Marcus Vance, W-104, DWG-STR-104..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="ALL">All Statuses ({workCards.length})</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="in_progress">In Progress</option>
              <option value="inspection_pending">Inspection Pending</option>
              <option value="completed">Completed / Inspected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Work Cards */}
      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No work cards found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create a new job spec sheet using the button above to begin tracking work card numbers, welders, and stamps.
          </p>
          <button
            onClick={() => setIsNewJobOpen(true)}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Create First Work Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-slate-900">
                      {card.workCardNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {card.process}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1" title={card.jobTitle}>
                    {card.jobTitle}
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize font-mono shrink-0 ${
                    card.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : card.status === 'in_progress'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {card.status.replace('_', ' ')}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3.5 flex-1 text-xs">
                {/* Project & Drawing */}
                <div>
                  <span className="text-slate-400 font-medium">Project: </span>
                  <span className="font-semibold text-slate-800">{card.clientProject}</span>
                  <div className="text-slate-500 mt-0.5 flex items-center justify-between">
                    <span>Drawing: <strong className="font-mono text-slate-700">{card.drawingNumber}</strong></span>
                    <span>{card.jointType.split('(')[0]}</span>
                  </div>
                </div>

                {/* Assigned Allowable WPS */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-1">
                    <Layers className="w-3 h-3 text-slate-500" />
                    <span>Assigned WPS Pool ({card.assignedWpsIds.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.assignedWpsIds.map((id) => (
                      <span
                        key={id}
                        className="font-mono text-[10px] font-bold bg-white text-slate-800 border border-slate-200 px-2 py-0.5 rounded"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned Welders (Multiple welders & stamps requirement) */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between mb-1">
                    <span>Assigned Welders ({card.assignedWelders.length})</span>
                    <span className="text-slate-500">Stamps</span>
                  </span>

                  {card.assignedWelders.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">No welders assigned yet</span>
                  ) : (
                    <div className="space-y-1.5">
                      {card.assignedWelders.map((w) => (
                        <div
                          key={w.welderId}
                          className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-200 text-slate-800 text-[11px]"
                        >
                          <span className="font-semibold truncate max-w-[140px]">{w.welderName}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[10px] text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                              #{w.stampNumber}
                            </span>
                            {w.chosenWpsId ? (
                              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1 rounded">
                                {w.chosenWpsId.split('-').slice(-2).join('-')}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No WPS chosen</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Target: <span className="font-mono text-slate-700">{card.targetCompletionDate}</span>
                </span>
                <button
                  onClick={() => setActiveCardDetail(card)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-sm font-medium"
                >
                  Manage Spec Sheet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Job Modal */}
      <NewJobModal
        isOpen={isNewJobOpen}
        onClose={() => setIsNewJobOpen(false)}
        wpsLibrary={wpsLibrary}
        weldersList={weldersList}
        onSaveJob={onSaveJob}
      />

      {/* Work Card Detail & Spec Sheet Modal */}
      {activeCardDetail && (
        <WorkCardDetailModal
          isOpen={true}
          onClose={() => setActiveCardDetail(null)}
          workCard={activeCardDetail}
          allWelders={weldersList}
          allWps={wpsLibrary}
          onUpdateWorkCard={(updated) => {
            onUpdateWorkCard(updated);
            setActiveCardDetail(updated);
          }}
          onOpenFullWps={onOpenFullWps}
        />
      )}
    </div>
  );
};
