import React, { useState, useMemo } from 'react';
import { Welder, WelderQualification, WeldingProcess } from '../../types';
import { ProlongationBadge } from './ProlongationBadge';
import { WelderDetailModal } from './WelderDetailModal';
import { NewWelderModal } from './NewWelderModal';
import { getQualificationStatus } from '../../utils/qualificationMatcher';
import { Users, UserPlus, Search, Filter, Stamp, Award, Clock, AlertTriangle } from 'lucide-react';

interface WeldersListProps {
  welders: Welder[];
  onAddWelder: (welder: Welder) => void;
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
  initialFilter?: 'ALL' | 'EXPIRING' | 'EXPIRED';
}

export const WeldersList: React.FC<WeldersListProps> = ({
  welders,
  onAddWelder,
  onAddQualification,
  onSaveProlongation,
  initialFilter = 'ALL',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'EXPIRING' | 'EXPIRED'>(initialFilter);
  const [filterProcess, setFilterProcess] = useState<string>('ALL');
  const [activeWelderModal, setActiveWelderModal] = useState<Welder | null>(null);
  const [isNewWelderOpen, setIsNewWelderOpen] = useState(false);

  // Sync if initialFilter changes from parent banner click
  React.useEffect(() => {
    if (initialFilter) {
      setFilterStatus(initialFilter);
    }
  }, [initialFilter]);

  const filteredWelders = useMemo(() => {
    return welders.filter((welder) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = `${welder.firstName} ${welder.surname}`.toLowerCase().includes(q);
        const matchStamp = welder.stampNumber.toLowerCase().includes(q);
        const matchId = welder.idNumber.toLowerCase().includes(q);
        if (!matchName && !matchStamp && !matchId) return false;
      }

      // Process filter
      if (filterProcess !== 'ALL') {
        const hasProcess = welder.qualifications.some((q) => q.process === filterProcess);
        if (!hasProcess) return false;
      }

      // Prolongation status filter
      if (filterStatus === 'EXPIRING') {
        const hasExpiring = welder.qualifications.some(
          (q) => getQualificationStatus(q.currentExpiryDate).status === 'expiring_soon'
        );
        if (!hasExpiring) return false;
      } else if (filterStatus === 'EXPIRED') {
        const hasExpired = welder.qualifications.some(
          (q) => getQualificationStatus(q.currentExpiryDate).status === 'expired'
        );
        if (!hasExpired) return false;
      }

      return true;
    });
  }, [welders, searchQuery, filterProcess, filterStatus]);

  const existingStamps = useMemo(() => welders.map((w) => w.stampNumber), [welders]);

  return (
    <div className="space-y-6">
      {/* Control Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-slate-100 text-slate-800 rounded-lg">
              <Users className="w-5 h-5 text-amber-600" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Welder Performance Qualification Records (WPQR)
              </h1>
              <p className="text-xs text-slate-500">
                Register certified welders, stamp numbers, qualified AWS processes, and track 6-month &amp; annual prolongations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsNewWelderOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Load Welder &amp; Stamp</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-5 items-end">
          {/* Search */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Search Welder / Stamp # / ID
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, W-104, ID number..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prolongation Status (30d Notice)
            </label>
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterStatus === 'ALL'
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('EXPIRING')}
                className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
                  filterStatus === 'EXPIRING'
                    ? 'bg-amber-100 text-amber-900 font-bold shadow-sm'
                    : 'text-amber-700 hover:text-amber-900'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Due &le;30d</span>
              </button>
              <button
                onClick={() => setFilterStatus('EXPIRED')}
                className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
                  filterStatus === 'EXPIRED'
                    ? 'bg-rose-100 text-rose-900 font-bold shadow-sm'
                    : 'text-rose-700 hover:text-rose-900'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Expired</span>
              </button>
            </div>
          </div>

          {/* Process Filter */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Process Filter
            </label>
            <select
              value={filterProcess}
              onChange={(e) => setFilterProcess(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="ALL">All Qualified Processes</option>
              <option value="SMAW">SMAW (Stick)</option>
              <option value="GMAW">GMAW (MIG/MAG)</option>
              <option value="GTAW">GTAW (TIG)</option>
              <option value="FCAW">FCAW (Flux-Cored)</option>
              <option value="SAW">SAW (Submerged Arc)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Welders Grid */}
      {filteredWelders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No welders match the selected criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filters, or load a new welder and assign their stamp number.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('ALL');
              setFilterProcess('ALL');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWelders.map((welder) => {
            const hasExpiring = welder.qualifications.some(
              (q) => getQualificationStatus(q.currentExpiryDate).status === 'expiring_soon'
            );
            const hasExpired = welder.qualifications.some(
              (q) => getQualificationStatus(q.currentExpiryDate).status === 'expired'
            );

            return (
              <div
                key={welder.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col overflow-hidden"
              >
                {/* Welder Card Header */}
                <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-sm border border-slate-800">
                      {welder.firstName[0]}{welder.surname[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {welder.firstName} {welder.surname}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        {welder.idNumber}
                      </span>
                    </div>
                  </div>

                  {/* Stamp Number Badge */}
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded text-amber-900 font-mono font-bold text-xs">
                      <Stamp className="w-3.5 h-3.5 text-amber-600" />
                      <span>{welder.stampNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Body: Qualified Processes & Prolongation Tracking */}
                <div className="p-4 space-y-3 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>Qualified Processes ({welder.qualifications.length})</span>
                    </span>
                    {hasExpired ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Expired Qualification
                      </span>
                    ) : hasExpiring ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Prolongation Required &le;30d
                      </span>
                    ) : null}
                  </div>

                  {welder.qualifications.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-center text-xs text-slate-500">
                      No processes registered yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {welder.qualifications.map((q) => (
                        <div
                          key={q.id}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{q.process}</span>
                              <span className="text-[11px] text-slate-500 font-mono">({q.standard})</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[140px]" title={q.materialGroup}>
                              {q.materialGroup}
                            </span>
                          </div>
                          <div className="text-right">
                            <ProlongationBadge expiryDate={q.currentExpiryDate} interval={q.interval} compact />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Hired: <span className="font-mono text-slate-700">{welder.hireDate}</span>
                  </span>
                  <button
                    onClick={() => setActiveWelderModal(welder)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-sm font-medium"
                  >
                    View WPQR Dossier &amp; Renew
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Welder Detail Modal */}
      {activeWelderModal && (
        <WelderDetailModal
          welder={activeWelderModal}
          onClose={() => setActiveWelderModal(null)}
          onAddQualification={onAddQualification}
          onSaveProlongation={onSaveProlongation}
        />
      )}

      {/* New Welder Register Modal */}
      <NewWelderModal
        isOpen={isNewWelderOpen}
        onClose={() => setIsNewWelderOpen(false)}
        onAddWelder={onAddWelder}
        existingStamps={existingStamps}
      />
    </div>
  );
};
