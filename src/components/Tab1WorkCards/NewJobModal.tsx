import React, { useState } from 'react';
import { WorkCardSpecSheet, WeldingProcess, JointType, WPS, Welder } from '../../types';
import { X, Plus, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  wpsLibrary: WPS[];
  weldersList: Welder[];
  onSaveJob: (newCard: WorkCardSpecSheet) => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({
  isOpen,
  onClose,
  wpsLibrary,
  weldersList,
  onSaveJob,
}) => {
  const [workCardNumber, setWorkCardNumber] = useState(
    `WC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [jobTitle, setJobTitle] = useState('');
  const [clientProject, setClientProject] = useState('');
  const [drawingNumber, setDrawingNumber] = useState('');
  const [material, setMaterial] = useState('ASTM A572 Gr. 50 Structural Steel');
  const [process, setProcess] = useState<WeldingProcess>('FCAW');
  const [jointType, setJointType] = useState<JointType>('Butt Joint (Single-V Groove)');
  const [targetCompletionDate, setTargetCompletionDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [qaSupervisor, setQaSupervisor] = useState('Robert Davis, AWS CWI');
  const [qaSupervisorStamp, setQaSupervisorStamp] = useState('CWI-14092');
  const [notes, setNotes] = useState('');

  // Selected WPS for this work card (multiple allowable WPS)
  const [selectedWpsIds, setSelectedWpsIds] = useState<string[]>([]);

  // Selected Welder IDs for this work card
  const [selectedWelderIds, setSelectedWelderIds] = useState<string[]>([]);

  if (!isOpen) return null;

  // Toggle WPS in work card spec sheet
  const handleToggleWps = (wpsId: string) => {
    if (selectedWpsIds.includes(wpsId)) {
      setSelectedWpsIds(selectedWpsIds.filter((id) => id !== wpsId));
    } else {
      setSelectedWpsIds([...selectedWpsIds, wpsId]);
    }
  };

  // Toggle Welder assignment
  const handleToggleWelder = (welderId: string) => {
    if (selectedWelderIds.includes(welderId)) {
      setSelectedWelderIds(selectedWelderIds.filter((id) => id !== welderId));
    } else {
      setSelectedWelderIds([...selectedWelderIds, welderId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!workCardNumber.trim() || !jobTitle.trim() || !clientProject.trim()) {
      alert('Please complete Work Card number, Job title, and Client/Project fields.');
      return;
    }

    if (selectedWpsIds.length === 0) {
      alert('Please assign at least one allowable WPS to this Work Card spec sheet.');
      return;
    }

    // Build welder assignments
    const assignedWelders = selectedWelderIds.map((welderId) => {
      const welder = weldersList.find((w) => w.id === welderId);
      return {
        welderId,
        welderName: welder ? `${welder.firstName} ${welder.surname}` : 'Unknown',
        stampNumber: welder?.stampNumber || 'N/A',
        chosenWpsId: undefined, // Welder chooses their specific WPS on the spec sheet from allowable qualified list!
        jointReference: '',
        assignedPasses: 'Full Joint Penetration',
        signOffDate: '',
        inspectionPassed: false,
      };
    });

    const newWorkCard: WorkCardSpecSheet = {
      id: `WC-${Date.now()}`,
      workCardNumber: workCardNumber.trim(),
      jobTitle: jobTitle.trim(),
      clientProject: clientProject.trim(),
      drawingNumber: drawingNumber.trim() || 'DWG-REF-PENDING',
      material: material.trim(),
      process,
      jointType,
      assignedWpsIds: selectedWpsIds,
      assignedWelders,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      targetCompletionDate,
      qaSupervisor: qaSupervisor.trim(),
      qaSupervisorStamp: qaSupervisorStamp.trim(),
      notes: notes.trim() || 'Adhere strictly to WPS welding variables and preheat requirements.',
    };

    onSaveJob(newWorkCard);
    onClose();
  };

  const jointTypeOptions: JointType[] = [
    'Butt Joint (Single-V Groove)',
    'Butt Joint (Double-V Groove)',
    'T-Joint (Fillet Weld)',
    'Corner Joint',
    'Lap Joint',
  ];

  const processes: WeldingProcess[] = ['SMAW', 'GMAW', 'GTAW', 'FCAW', 'SAW'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">Create Job Spec Sheet (New Work Card)</h2>
              <p className="text-xs text-slate-400">
                Setup Work Card #, project parameters, allowable WPS pool, and assign initial welders
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
          {/* Work Card & Drawing Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Card Number *
              </label>
              <input
                type="text"
                value={workCardNumber}
                onChange={(e) => setWorkCardNumber(e.target.value)}
                placeholder="WC-2026-0881"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job / Component Title *
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Heavy Crane Runway Girder Splice Joint"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Client / Project Name *
              </label>
              <input
                type="text"
                value={clientProject}
                onChange={(e) => setClientProject(e.target.value)}
                placeholder="e.g. Metro West Rail Terminal Expansion"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Engineering Drawing #
              </label>
              <input
                type="text"
                value={drawingNumber}
                onChange={(e) => setDrawingNumber(e.target.value)}
                placeholder="DWG-STR-502-REV-B"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Material & Process & Joint Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Base Material Specification
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. ASTM A36 / A572 Gr. 50"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Process
              </label>
              <select
                value={process}
                onChange={(e) => setProcess(e.target.value as WeldingProcess)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold"
              >
                {processes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Joint Type Configuration
              </label>
              <select
                value={jointType}
                onChange={(e) => setJointType(e.target.value as JointType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {jointTypeOptions.map((jt) => (
                  <option key={jt} value={jt}>{jt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assigned WPS Pool (Prompt: WPS used selected from list) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-xs">
                Allowable WPS Pool for this Work Card ({selectedWpsIds.length} selected) *
              </label>
              <span className="text-[11px] text-slate-500">
                Welders can only choose from this approved list
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
              {wpsLibrary.map((wps) => {
                const isSelected = selectedWpsIds.includes(wps.id);
                return (
                  <div
                    key={wps.id}
                    onClick={() => handleToggleWps(wps.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent div
                      className="mt-0.5 text-amber-600 focus:ring-amber-500 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-mono text-xs">{wps.wpsNumber}</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {wps.process} · {wps.materialGroup.split(' ')[0]} {wps.materialGroup.split(' ')[1] || ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Welder Assignment: Multiple welders & stamps can be assigned */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-xs">
                Assign Welders to Spec Sheet (Multiple Welders &amp; Stamps)
              </label>
              <span className="text-[11px] text-slate-500">
                Can also add or modify welders on the active card
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-44 overflow-y-auto p-1">
              {weldersList.map((welder) => {
                const isSelected = selectedWelderIds.includes(welder.id);
                return (
                  <div
                    key={welder.id}
                    onClick={() => handleToggleWelder(welder.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{welder.firstName} {welder.surname}</div>
                      <div className="text-[10px] text-slate-500">
                        {welder.qualifications.map((q) => q.process).join(', ') || 'No Quals'}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                      #{welder.stampNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QA Supervisor & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                QA Supervisor / CWI
              </label>
              <input
                type="text"
                value={qaSupervisor}
                onChange={(e) => setQaSupervisor(e.target.value)}
                placeholder="Robert Davis, CWI"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                QA Stamp #
              </label>
              <input
                type="text"
                value={qaSupervisorStamp}
                onChange={(e) => setQaSupervisorStamp(e.target.value)}
                placeholder="CWI-14092"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Completion Date
              </label>
              <input
                type="date"
                value={targetCompletionDate}
                onChange={(e) => setTargetCompletionDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Workshop Inspection Notes &amp; Hold Points
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Visual inspection of fit-up and root gap mandatory prior to root pass. Preheat 75°C verified."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
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
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Create Work Card Spec Sheet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
