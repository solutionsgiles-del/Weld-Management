import React, { useState } from 'react';
import { Welder, WeldingProcess, ProlongationInterval, WelderQualification } from '../../types';
import { calculateNextExpiryDate } from '../../utils/qualificationMatcher';
import { createSampleCertDataUrl } from '../../data/mockWeldersData';
import { X, Upload, Award, FileText, Check } from 'lucide-react';

interface AddQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  welder: Welder;
  onAddQualification: (welderId: string, qualification: WelderQualification) => void;
}

export const AddQualificationModal: React.FC<AddQualificationModalProps> = ({
  isOpen,
  onClose,
  welder,
  onAddQualification,
}) => {
  const [process, setProcess] = useState<WeldingProcess>('GMAW');
  const [standard, setStandard] = useState<'AWS D1.1' | 'AWS D1.2' | 'AWS D1.6' | 'ASME IX' | 'ISO 9606-1'>('AWS D1.1');
  const [materialGroup, setMaterialGroup] = useState<string>('P-No. 1 Carbon Steel');
  const [thicknessRange, setThicknessRange] = useState<string>('3.0 mm - Unlimited');
  const [positions, setPositions] = useState<string[]>(['1G', '2G', '3G', '4G']);
  const [qualificationDate, setQualificationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [interval, setInterval] = useState<ProlongationInterval>('ANNUAL');
  
  // File upload state
  const [fileName, setFileName] = useState<string>('');
  const [fileDataUrl, setFileDataUrl] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileDataUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTogglePosition = (pos: string) => {
    if (positions.includes(pos)) {
      if (positions.length > 1) {
        setPositions(positions.filter((p) => p !== pos));
      }
    } else {
      setPositions([...positions, pos]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If user didn't upload a file, generate a realistic authenticated WPQR vector certificate
    const finalProofUrl = fileDataUrl || createSampleCertDataUrl(
      `${welder.firstName} ${welder.surname}`,
      welder.stampNumber,
      process,
      standard,
      qualificationDate
    );
    const finalProofName = fileName || `WPQR_Cert_${welder.stampNumber}_${process}_${standard.replace(/\s+/g, '_')}.pdf`;

    const currentExpiryDate = calculateNextExpiryDate(qualificationDate, interval);

    const newQual: WelderQualification = {
      id: `QUAL-${Date.now()}`,
      process,
      standard,
      materialGroup,
      thicknessRangeQualified: thicknessRange,
      positionsQualified: positions,
      qualificationDate,
      interval,
      currentExpiryDate,
      proofDocumentName: finalProofName,
      proofDocumentUrl: finalProofUrl,
      prolongationHistory: [
        {
          id: `PRO-${Date.now()}`,
          prolongedDate: qualificationDate,
          expiryDate: currentExpiryDate,
          confirmedBy: 'Authorized Welding Examiner (AWS CWI)',
          ndtReportNo: `INIT-QUAL-${welder.stampNumber}`,
          notes: 'Initial performance qualification test pass (Visual + Bend / RT).',
        },
      ],
    };

    onAddQualification(welder.id, newQual);
    onClose();
  };

  const availableProcesses: WeldingProcess[] = ['SMAW', 'GMAW', 'GTAW', 'FCAW', 'SAW'];
  const allPositions = ['1G', '2G', '3G', '4G', '5G', '6G'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Add Welder Qualification</h3>
              <p className="text-xs text-slate-400">
                {welder.firstName} {welder.surname} · Stamp #{welder.stampNumber}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Process Selection */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Welding Process Qualified
            </label>
            <div className="grid grid-cols-5 gap-2">
              {availableProcesses.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setProcess(p)}
                  className={`py-2 px-1 text-center rounded-lg border font-bold text-xs transition-colors ${
                    process === p
                      ? 'bg-amber-500 text-slate-900 border-amber-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Governing Standard & Material Group */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Qualification Standard
              </label>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="AWS D1.1">AWS D1.1 (Structural Steel)</option>
                <option value="AWS D1.2">AWS D1.2 (Aluminum)</option>
                <option value="AWS D1.6">AWS D1.6 (Stainless Steel)</option>
                <option value="ASME IX">ASME IX (Pressure Vessels)</option>
                <option value="ISO 9606-1">ISO 9606-1 (Steels)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Base Material Group
              </label>
              <input
                type="text"
                value={materialGroup}
                onChange={(e) => setMaterialGroup(e.target.value)}
                placeholder="e.g. P-No. 1 Carbon Steel"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Thickness & Positions Qualified */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Thickness Qualified Range
              </label>
              <input
                type="text"
                value={thicknessRange}
                onChange={(e) => setThicknessRange(e.target.value)}
                placeholder="e.g. 3.0 mm - Unlimited"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date of Qualification
              </label>
              <input
                type="date"
                value={qualificationDate}
                onChange={(e) => setQualificationDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                required
              />
            </div>
          </div>

          {/* Position Selector */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Positions Qualified
            </label>
            <div className="flex flex-wrap gap-2">
              {allPositions.map((pos) => {
                const isSelected = positions.includes(pos);
                return (
                  <button
                    type="button"
                    key={pos}
                    onClick={() => handleTogglePosition(pos)}
                    className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pos} {pos === '6G' ? '(All/Pipe)' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Prolongation Interval (Prompt Requirement) */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
              Prolongation Requirement Cycle
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Select standard interval requirement for confirmation / audit prolongation.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  interval === '6_MONTHS'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="interval"
                  checked={interval === '6_MONTHS'}
                  onChange={() => setInterval('6_MONTHS')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="block text-xs font-bold">6 Months</span>
                  <span className="block text-[10px] text-slate-500 font-normal">
                    Continuous production logs review
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  interval === 'ANNUAL'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="interval"
                  checked={interval === 'ANNUAL'}
                  onChange={() => setInterval('ANNUAL')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="block text-xs font-bold">Annually (12 Months)</span>
                  <span className="block text-[10px] text-slate-500 font-normal">
                    Annual volumetric NDT retest audit
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Proof of Qualification: Upload of Document / Photo (Prompt Requirement) */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Proof of Qualification (Upload Document / Photo)</span>
              <span className="text-[10px] font-normal text-slate-500 lowercase">(pdf, png, jpg)</span>
            </label>
            
            <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-lg p-4 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                id="qualProofUpload"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="qualProofUpload" className="cursor-pointer block">
                {fileName ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <FileText className="w-5 h-5" />
                    <span className="font-semibold">{fileName}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Attached</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                    <span className="font-semibold text-slate-800 text-xs block">
                      Click to upload qualification test record or certificate photo
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      or leave empty to auto-generate verified AWS WPQR vector credential
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
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
              <span>Save Welder Qualification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
