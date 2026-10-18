import React from 'react';
import { WPS } from '../../types';
import { JointDiagram } from '../JointDiagram';
import { X, Printer, Download, ShieldCheck, Zap, Layers, Activity } from 'lucide-react';

interface FullWpsModalProps {
  wps: WPS | null;
  onClose: () => void;
}

export const FullWpsModal: React.FC<FullWpsModalProps> = ({ wps, onClose }) => {
  if (!wps) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(wps, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${wps.wpsNumber}_Technical_Spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Toolbar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white shrink-0 no-print">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-mono tracking-tight">{wps.wpsNumber}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{wps.revision}</span>
              </div>
              <p className="text-xs text-slate-400">AWS Welding Procedure Specification · {wps.standard}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Print Specification"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Export Spec JSON"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm bg-white print:p-0">
          {/* Document Header Standard Form */}
          <div className="border-2 border-slate-900 rounded-lg p-5 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-300 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Procedure Specification</span>
                <span className="text-xl font-bold font-mono text-slate-900">{wps.wpsNumber}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Supporting PQR</span>
                <span className="text-sm font-semibold font-mono text-slate-800">{wps.supportingPQR}</span>
              </div>
              <div className="md:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Governing Code / Standard</span>
                <span className="text-sm font-semibold text-slate-900">{wps.standard}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Process:</span>
                <span className="font-bold text-slate-900">{wps.process} ({wps.processDescription})</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Base Material:</span>
                <span className="font-bold text-slate-900">{wps.material}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Material Group:</span>
                <span className="font-semibold text-slate-800">{wps.materialGroup}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Thickness Qualified:</span>
                <span className="font-semibold font-mono text-slate-800">{wps.thicknessRange}</span>
              </div>
            </div>
          </div>

          {/* Core Electrical & Welding Parameter Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>1. Electrical &amp; Operational Parameters</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] font-semibold text-slate-500 block">Voltage Range</span>
                <span className="text-base font-bold font-mono text-slate-900">{wps.voltRange}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] font-semibold text-slate-500 block">Amperage Range</span>
                <span className="text-base font-bold font-mono text-slate-900">{wps.ampRange}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] font-semibold text-slate-500 block">Wire / Electrode Ø</span>
                <span className="text-sm font-bold text-slate-900">{wps.fillerWireDiameter}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] font-semibold text-slate-500 block">Travel Speed</span>
                <span className="text-sm font-bold font-mono text-slate-900">{wps.travelSpeed}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] font-semibold text-slate-500 block">Current &amp; Polarity</span>
                <span className="text-sm font-bold text-slate-900">{wps.currentPolarity}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] font-semibold text-slate-500 block">Power Source</span>
                <span className="text-xs font-semibold text-slate-800 leading-tight block mt-0.5">{wps.powerSourceType}</span>
              </div>
            </div>
          </div>

          {/* Joint Design & Cross-Section CAD View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>2. Joint Configuration &amp; Details</span>
              </h3>
              
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-900">
                <JointDiagram
                  type={wps.jointDiagramType}
                  grooveAngle={wps.jointDetails.grooveAngle}
                  rootOpening={wps.jointDetails.rootOpening}
                  rootFace={wps.jointDetails.rootFace}
                  backing={wps.jointDetails.backing}
                  className="w-full h-48"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                  <span className="text-slate-500 font-medium block">Groove Angle:</span>
                  <span className="font-semibold text-slate-900">{wps.jointDetails.grooveAngle}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                  <span className="text-slate-500 font-medium block">Root Opening:</span>
                  <span className="font-semibold text-slate-900">{wps.jointDetails.rootOpening}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                  <span className="text-slate-500 font-medium block">Root Face:</span>
                  <span className="font-semibold text-slate-900">{wps.jointDetails.rootFace}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                  <span className="text-slate-500 font-medium block">Backing Method:</span>
                  <span className="font-semibold text-slate-900">{wps.jointDetails.backing}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>3. Filler Metals &amp; Thermal Variables</span>
              </h3>
              
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200 bg-white text-xs">
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500">Filler Metal Classification</span>
                  <span className="font-bold text-slate-900">{wps.fillerWireClassification}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500">Shielding Gas Mix</span>
                  <span className="font-semibold text-slate-900">{wps.shieldingGas}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500">Gas Flow Rate</span>
                  <span className="font-semibold text-slate-900">{wps.gasFlowRate}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500">Minimum Preheat Temp</span>
                  <span className="font-bold text-amber-700">{wps.preheatMin}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500">Maximum Interpass Temp</span>
                  <span className="font-bold text-rose-700">{wps.interpassMax}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500">Post-Weld Heat Treatment (PWHT)</span>
                  <span className="font-semibold text-slate-900">{wps.pwht}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500">Welding Progression</span>
                  <span className="font-semibold text-slate-900">{wps.progression}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Approved Positions</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {wps.positions.map((pos) => (
                    <span key={pos} className="px-2.5 py-1 bg-slate-100 border border-slate-300 font-semibold text-slate-700 rounded">
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Pass Welding Sequence Schedule */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              4. Pass Sequence &amp; Parameters Table
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Pass / Layer</th>
                    <th className="py-2.5 px-3">Process</th>
                    <th className="py-2.5 px-3">Filler Metal</th>
                    <th className="py-2.5 px-3">Diameter</th>
                    <th className="py-2.5 px-3">Current / Polarity</th>
                    <th className="py-2.5 px-3 text-right">Amps</th>
                    <th className="py-2.5 px-3 text-right">Volts</th>
                    <th className="py-2.5 px-3">Travel Speed</th>
                    <th className="py-2.5 px-3">Remarks / Technique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {wps.passSequence.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold font-mono text-slate-900">{item.passNo}</td>
                      <td className="py-2 px-3 font-semibold">{item.process}</td>
                      <td className="py-2 px-3 font-mono">{item.fillerClass}</td>
                      <td className="py-2 px-3">{item.diameter}</td>
                      <td className="py-2 px-3">{item.currentType}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">{item.amperage}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">{item.voltage}</td>
                      <td className="py-2 px-3 font-mono text-slate-600">{item.travelSpeed}</td>
                      <td className="py-2 px-3 text-slate-600 italic">{item.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technique and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="font-bold text-slate-700 block mb-1">Technique Guidelines</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li><strong className="text-slate-800">Bead Style:</strong> {wps.technique.stringerOrWeave}</li>
                <li><strong className="text-slate-800">Interpass Cleaning:</strong> {wps.technique.interpassCleaning}</li>
                <li><strong className="text-slate-800">Peening:</strong> {wps.technique.peening}</li>
              </ul>
            </div>
            <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3">
              <span className="font-bold text-amber-900 block mb-1">Engineering Notes &amp; Quality Mandate</span>
              <p className="text-amber-800 leading-relaxed">{wps.notes}</p>
            </div>
          </div>

          {/* Signatures footer for print */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-xs text-slate-600">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Prepared By</span>
              <div className="h-10 border-b border-slate-300 flex items-end font-semibold text-slate-800">Welding Engineer (IWE)</div>
              <span className="text-[10px] text-slate-400">Date: 2026-08-01</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Reviewed By</span>
              <div className="h-10 border-b border-slate-300 flex items-end font-semibold text-slate-800">QA / QC Manager</div>
              <span className="text-[10px] text-slate-400">Stamp: QC-ENG-08</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Authorized Sign-off</span>
              <div className="h-10 border-b border-slate-300 flex items-end font-semibold text-slate-800">AWS Certified Inspector (CWI)</div>
              <span className="text-[10px] text-slate-400">Cert #14092</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
