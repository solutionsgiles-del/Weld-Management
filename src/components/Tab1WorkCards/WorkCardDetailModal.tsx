import React, { useState } from 'react';
import { WorkCardSpecSheet, Welder, WPS, WorkCardStatus } from '../../types';
import { getEligibleWpsForWelderOnWorkCard, isWelderQualifiedForWps } from '../../utils/qualificationMatcher';
import { JointDiagram } from '../JointDiagram';
import {
  X,
  Printer,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Zap,
  Gauge,
  Eye,
  PlusCircle,
} from 'lucide-react';

interface WorkCardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workCard: WorkCardSpecSheet;
  allWelders: Welder[];
  allWps: WPS[];
  onUpdateWorkCard: (updatedCard: WorkCardSpecSheet) => void;
  onOpenFullWps: (wps: WPS) => void;
}

export const WorkCardDetailModal: React.FC<WorkCardDetailModalProps> = ({
  isOpen,
  onClose,
  workCard,
  allWelders,
  allWps,
  onUpdateWorkCard,
  onOpenFullWps,
}) => {
  const [selectedWelderToAdd, setSelectedWelderToAdd] = useState<string>('');
  const [isAddingWpsToCard, setIsAddingWpsToCard] = useState<boolean>(false);
  const [selectedWpsToAdd, setSelectedWpsToAdd] = useState<string>('');

  if (!isOpen) return null;

  // Retrieve full WPS objects assigned to this work card
  const assignedWpsList: WPS[] = workCard.assignedWpsIds
    .map((id) => allWps.find((w) => w.id === id))
    .filter((w): w is WPS => Boolean(w));

  // Add welder to work card
  const handleAddWelder = () => {
    if (!selectedWelderToAdd) return;
    const welder = allWelders.find((w) => w.id === selectedWelderToAdd);
    if (!welder) return;

    // Check if already assigned
    if (workCard.assignedWelders.some((aw) => aw.welderId === welder.id)) {
      alert(`Welder ${welder.firstName} ${welder.surname} (Stamp #${welder.stampNumber}) is already assigned to this spec sheet.`);
      return;
    }

    // Determine initial WPS selection: find first eligible WPS from assignedWpsList
    const { eligibleWps } = getEligibleWpsForWelderOnWorkCard(welder, assignedWpsList);
    const defaultChosenWpsId = eligibleWps.length > 0 ? eligibleWps[0].id : undefined;

    const newAssignment = {
      welderId: welder.id,
      welderName: `${welder.firstName} ${welder.surname}`,
      stampNumber: welder.stampNumber,
      chosenWpsId: defaultChosenWpsId,
      jointReference: `Joint #0${workCard.assignedWelders.length + 1}`,
      assignedPasses: 'Full Joint Penetration',
      signOffDate: new Date().toISOString().split('T')[0],
      inspectionPassed: false,
    };

    const updated = {
      ...workCard,
      assignedWelders: [...workCard.assignedWelders, newAssignment],
      status: workCard.status === 'draft' ? ('active' as WorkCardStatus) : workCard.status,
    };
    onUpdateWorkCard(updated);
    setSelectedWelderToAdd('');
  };

  // Remove welder from work card
  const handleRemoveWelder = (welderId: string) => {
    const updated = {
      ...workCard,
      assignedWelders: workCard.assignedWelders.filter((w) => w.welderId !== welderId),
    };
    onUpdateWorkCard(updated);
  };

  // Welder changes chosen WPS
  const handleWelderWpsChange = (welderId: string, chosenWpsId: string) => {
    const welder = allWelders.find((w) => w.id === welderId);
    if (welder) {
      const targetWps = allWps.find((w) => w.id === chosenWpsId);
      if (targetWps) {
        // Enforce qualification check
        const qualCheck = isWelderQualifiedForWps(welder, targetWps);
        if (!qualCheck.isQualified) {
          alert(`Qualification restriction: ${qualCheck.reason}`);
          return;
        }
      }
    }

    const updated = {
      ...workCard,
      assignedWelders: workCard.assignedWelders.map((aw) =>
        aw.welderId === welderId ? { ...aw, chosenWpsId } : aw
      ),
    };
    onUpdateWorkCard(updated);
  };

  // Update welder joint reference
  const handleUpdateWelderField = (welderId: string, field: string, value: any) => {
    const updated = {
      ...workCard,
      assignedWelders: workCard.assignedWelders.map((aw) =>
        aw.welderId === welderId ? { ...aw, [field]: value } : aw
      ),
    };
    onUpdateWorkCard(updated);
  };

  // Add allowable WPS to work card pool
  const handleAddWpsToPool = () => {
    if (!selectedWpsToAdd || workCard.assignedWpsIds.includes(selectedWpsToAdd)) return;
    const updated = {
      ...workCard,
      assignedWpsIds: [...workCard.assignedWpsIds, selectedWpsToAdd],
    };
    onUpdateWorkCard(updated);
    setSelectedWpsToAdd('');
    setIsAddingWpsToCard(false);
  };

  // Remove allowable WPS from work card pool
  const handleRemoveWpsFromPool = (wpsId: string) => {
    if (workCard.assignedWpsIds.length <= 1) {
      alert('A work card spec sheet must have at least one allowable WPS assigned.');
      return;
    }
    const updated = {
      ...workCard,
      assignedWpsIds: workCard.assignedWpsIds.filter((id) => id !== wpsId),
      assignedWelders: workCard.assignedWelders.map((aw) =>
        aw.chosenWpsId === wpsId ? { ...aw, chosenWpsId: undefined } : aw
      ),
    };
    onUpdateWorkCard(updated);
  };

  // Status Change
  const handleStatusChange = (status: WorkCardStatus) => {
    onUpdateWorkCard({ ...workCard, status });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Toolbar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0 no-print">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-mono tracking-tight">{workCard.workCardNumber}</h2>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded capitalize ${
                    workCard.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : workCard.status === 'in_progress'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {workCard.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">{workCard.jobTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Print Job Spec Sheet & Traveler"
            >
              <Printer className="w-4 h-4" />
              <span>Print Spec Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs bg-white flex-1">
          {/* Header Card / Job Spec Summary */}
          <div className="border-2 border-slate-900 rounded-lg p-5 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-slate-300 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Work Card Number</span>
                <span className="text-xl font-bold font-mono text-slate-900">{workCard.workCardNumber}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Job / Component Title</span>
                <span className="text-sm font-bold text-slate-900">{workCard.jobTitle}</span>
                <span className="text-xs text-slate-500 block mt-0.5">Project: {workCard.clientProject}</span>
              </div>
              <div className="md:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Drawing Reference</span>
                <span className="text-sm font-mono font-bold text-slate-900">{workCard.drawingNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 font-medium block">Base Material:</span>
                <span className="font-bold text-slate-900">{workCard.material}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Welding Process:</span>
                <span className="font-bold text-amber-700">{workCard.process}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Joint Configuration:</span>
                <span className="font-semibold text-slate-800">{workCard.jointType}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">QA Supervisor &amp; Stamp:</span>
                <span className="font-semibold text-slate-800">
                  {workCard.qaSupervisor} ({workCard.qaSupervisorStamp})
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Allowable WPS Pool Assigned to Work Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Approved WPS Assigned to this Work Card ({assignedWpsList.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Welders assigned to this job can ONLY select from this approved procedure pool.
                </p>
              </div>

              <div className="no-print">
                {!isAddingWpsToCard ? (
                  <button
                    onClick={() => setIsAddingWpsToCard(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Allowable WPS</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedWpsToAdd}
                      onChange={(e) => setSelectedWpsToAdd(e.target.value)}
                      className="px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="">Select WPS from library...</option>
                      {allWps
                        .filter((w) => !workCard.assignedWpsIds.includes(w.id))
                        .map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.wpsNumber} ({w.process} - {w.material.split(',')[0]})
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={handleAddWpsToPool}
                      disabled={!selectedWpsToAdd}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded disabled:opacity-50"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => setIsAddingWpsToCard(false)}
                      className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* WPS Quick Parameter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assignedWpsList.map((wps) => (
                <div
                  key={wps.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{wps.wpsNumber}</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          {wps.process}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 no-print">
                        <button
                          onClick={() => onOpenFullWps(wps)}
                          className="px-2 py-0.5 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Spec Sheet</span>
                        </button>
                        {assignedWpsList.length > 1 && (
                          <button
                            onClick={() => handleRemoveWpsFromPool(wps.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Remove from Work Card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-200/80 text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Volts</span>
                        <strong className="font-mono text-slate-800">{wps.voltRange}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Amps</span>
                        <strong className="font-mono text-slate-800">{wps.ampRange}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Wire Ø</span>
                        <strong className="font-mono text-slate-800 truncate block" title={wps.fillerWireDiameter}>
                          {wps.fillerWireDiameter}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Travel</span>
                        <strong className="font-mono text-slate-800 truncate block" title={wps.travelSpeed}>
                          {wps.travelSpeed.split(' ')[0]} {wps.travelSpeed.split(' ')[1]}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Welder Assignment Table (Multiple welders & stamps + strict qualification check) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    Assigned Welders &amp; Stamps ({workCard.assignedWelders.length}) · Qualification Enforced
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Welders can only select a WPS that is BOTH in this work card AND for which they hold an active AWS qualification.
                </p>
              </div>

              {/* Add Welder to Job control (hidden on print) */}
              <div className="flex items-center gap-2 no-print self-start sm:self-auto">
                <select
                  value={selectedWelderToAdd}
                  onChange={(e) => setSelectedWelderToAdd(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="">Select Welder to Assign...</option>
                  {allWelders
                    .filter((w) => !workCard.assignedWelders.some((aw) => aw.welderId === w.id))
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.firstName} {w.surname} (Stamp #{w.stampNumber})
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleAddWelder}
                  disabled={!selectedWelderToAdd}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Assign Welder</span>
                </button>
              </div>
            </div>

            {/* Welder Spec Sheet Table */}
            {workCard.assignedWelders.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-300 rounded-lg text-center bg-slate-50">
                <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">No welders assigned to this Spec Sheet yet</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Assign one or multiple welders above to verify qualifications and allocate welding procedure specifications.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Welder Name</th>
                      <th className="py-2.5 px-3">Stamp #</th>
                      <th className="py-2.5 px-3">WPS to Use (Qualified Only)</th>
                      <th className="py-2.5 px-3">Joint Reference / Passes</th>
                      <th className="py-2.5 px-3">Sign-off Date</th>
                      <th className="py-2.5 px-3 text-center">QC Pass</th>
                      <th className="py-2.5 px-3 text-right no-print">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {workCard.assignedWelders.map((aw) => {
                      const welderObj = allWelders.find((w) => w.id === aw.welderId);
                      const eligibleResult = welderObj
                        ? getEligibleWpsForWelderOnWorkCard(welderObj, assignedWpsList)
                        : { eligibleWps: [], ineligibleWps: [] };

                      const isQualifiedForCurrentChosen = aw.chosenWpsId
                        ? eligibleResult.eligibleWps.some((w) => w.id === aw.chosenWpsId)
                        : false;

                      return (
                        <tr key={aw.welderId} className="hover:bg-slate-50/80">
                          {/* Welder Name */}
                          <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                            {aw.welderName}
                          </td>

                          {/* Stamp Number */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-[11px] border border-amber-300">
                              #{aw.stampNumber}
                            </span>
                          </td>

                          {/* WPS Selection: Strictly Restricted to What Welder is Qualified For & Assigned to Work Card */}
                          <td className="py-2.5 px-3 min-w-[240px]">
                            {eligibleResult.eligibleWps.length === 0 ? (
                              <div className="p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-start gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold block">No Qualified WPS Available</span>
                                  <span className="text-[10px] text-rose-600 block">
                                    {eligibleResult.ineligibleWps[0]?.reason || 'Welder is not qualified for assigned work card WPS'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <select
                                  value={aw.chosenWpsId || ''}
                                  onChange={(e) => handleWelderWpsChange(aw.welderId, e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                >
                                  <option value="">Select Qualified WPS...</option>
                                  {eligibleResult.eligibleWps.map((ew) => (
                                    <option key={ew.id} value={ew.id}>
                                      {ew.wpsNumber} ({ew.process} - {ew.materialGroup.split(' ')[0]})
                                    </option>
                                  ))}
                                </select>

                                {/* Welder WPS Parameter Indicator */}
                                {aw.chosenWpsId && (
                                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                                    {(() => {
                                      const w = allWps.find((item) => item.id === aw.chosenWpsId);
                                      if (!w) return null;
                                      return (
                                        <span>
                                          Volts: <strong>{w.voltRange}</strong> | Amps: <strong>{w.ampRange}</strong> | Wire: <strong>{w.fillerWireDiameter.split(' ')[0]}</strong>
                                        </span>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Joint Reference / Passes */}
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={aw.jointReference || ''}
                              onChange={(e) => handleUpdateWelderField(aw.welderId, 'jointReference', e.target.value)}
                              placeholder="e.g. Joint #GL-4D-Top"
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-medium"
                            />
                          </td>

                          {/* Sign-off Date */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <input
                              type="date"
                              value={aw.signOffDate || ''}
                              onChange={(e) => handleUpdateWelderField(aw.welderId, 'signOffDate', e.target.value)}
                              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                            />
                          </td>

                          {/* QC Pass */}
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={Boolean(aw.inspectionPassed)}
                              onChange={(e) => handleUpdateWelderField(aw.welderId, 'inspectionPassed', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                              title="QC Inspection Passed"
                            />
                          </td>

                          {/* Remove button */}
                          <td className="py-2.5 px-3 text-right no-print">
                            <button
                              onClick={() => handleRemoveWelder(aw.welderId)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Remove welder from card"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 3: Joint Blueprint Schematic */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
            <div className="md:col-span-6 bg-slate-900 rounded-lg p-3 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Specified Joint Weldment Detail
              </span>
              <JointDiagram
                type={assignedWpsList[0]?.jointDiagramType || 'v_groove'}
                grooveAngle={assignedWpsList[0]?.jointDetails?.grooveAngle}
                rootOpening={assignedWpsList[0]?.jointDetails?.rootOpening}
                rootFace={assignedWpsList[0]?.jointDetails?.rootFace}
                backing={assignedWpsList[0]?.jointDetails?.backing}
                className="w-full h-36"
              />
            </div>

            <div className="md:col-span-6 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Quality Inspection Checkpoints &amp; Hold Notes
              </span>
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-950 text-xs">
                <p className="font-medium">{workCard.notes}</p>
                <div className="mt-2 text-[11px] text-amber-800 border-t border-amber-200/60 pt-2 flex items-center justify-between">
                  <span>Authorized QC Inspector:</span>
                  <span className="font-bold">{workCard.qaSupervisor} ({workCard.qaSupervisorStamp})</span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 no-print">
                <span className="font-bold text-slate-700">Update Work Card Status:</span>
                <select
                  value={workCard.status}
                  onChange={(e) => handleStatusChange(e.target.value as WorkCardStatus)}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="in_progress">In Progress</option>
                  <option value="inspection_pending">Inspection Pending</option>
                  <option value="completed">Completed / Inspected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shop Signatures Strip for Print */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-xs text-slate-600 print-only hidden">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Welding Foreman</span>
              <div className="h-10 border-b border-slate-400 flex items-end font-semibold text-slate-800">
                Fit-up Approved
              </div>
              <span className="text-[10px] text-slate-400">Date: ____________</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Welder Signatures</span>
              <div className="h-10 border-b border-slate-400 flex items-end font-mono text-slate-800">
                {workCard.assignedWelders.map((w) => `#${w.stampNumber}`).join(', ') || 'Stamps'}
              </div>
              <span className="text-[10px] text-slate-400">Visual Verification</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">QC CWI Final Acceptance</span>
              <div className="h-10 border-b border-slate-400 flex items-end font-semibold text-slate-800">
                {workCard.qaSupervisorStamp}
              </div>
              <span className="text-[10px] text-slate-400">NDT Report Cleared</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Close Work Card
          </button>
        </div>
      </div>
    </div>
  );
};
