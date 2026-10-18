import React from 'react';
import { WPS } from '../../types';
import { JointDiagram } from '../JointDiagram';
import { Zap, Eye, Gauge, Shield, Layers } from 'lucide-react';

interface WpsCardProps {
  wps: WPS;
  onSelect: (wps: WPS) => void;
  isSelected?: boolean;
}

export const WpsCard: React.FC<WpsCardProps> = ({ wps, onSelect, isSelected }) => {
  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isSelected
          ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20'
          : 'border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-slate-900">{wps.wpsNumber}</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-mono">
              {wps.revision}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
              {wps.process}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{wps.standard}</p>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-mono">{wps.supportingPQR}</span>
          <span className="text-xs font-semibold text-slate-700">{wps.materialGroup}</span>
        </div>
      </div>

      {/* Main Parameters Display */}
      <div className="p-4 space-y-4 flex-1">
        {/* Material & Thickness */}
        <div className="text-xs">
          <span className="text-slate-400 font-medium">Base Material: </span>
          <span className="font-semibold text-slate-800">{wps.material}</span>
          <div className="text-slate-500 mt-0.5">
            Thickness Range: <span className="font-mono font-medium text-slate-800">{wps.thicknessRange}</span>
          </div>
        </div>

        {/* 6 Essential Engineering Parameters required by prompt */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Volt Range
            </span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">{wps.voltRange}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Gauge className="w-3 h-3 text-sky-500" /> Amp Range
            </span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">{wps.ampRange}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-500" /> Wire Ø
            </span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block truncate" title={wps.fillerWireDiameter}>
              {wps.fillerWireDiameter}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Travel Speed
            </span>
            <span className="font-mono text-slate-800 mt-0.5 block text-[11px] truncate" title={wps.travelSpeed}>
              {wps.travelSpeed}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Polarity
            </span>
            <span className="font-semibold text-slate-800 mt-0.5 block text-[11px] truncate" title={wps.currentPolarity}>
              {wps.currentPolarity.split(' ')[0]}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Power Source
            </span>
            <span className="text-slate-800 mt-0.5 block text-[11px] truncate" title={wps.powerSourceType}>
              {wps.powerSourceType.split(' ')[0]} {wps.powerSourceType.split(' ')[1] || ''}
            </span>
          </div>
        </div>

        {/* Joint Type CAD Schematic Image */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-slate-500" /> Joint Type Schematic
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Root Gap: {wps.jointDetails.rootOpening}
            </span>
          </div>
          <JointDiagram
            type={wps.jointDiagramType}
            grooveAngle={wps.jointDetails.grooveAngle}
            rootOpening={wps.jointDetails.rootOpening}
            rootFace={wps.jointDetails.rootFace}
            backing={wps.jointDetails.backing}
            className="w-full h-36"
          />
        </div>

        {/* Approved Joint Types Tags */}
        <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
          {wps.jointTypes.map((jt) => (
            <span key={jt} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
              {jt}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500">
          Filler: <strong className="text-slate-700">{wps.fillerWireClassification.split(' ')[0]}</strong>
        </span>
        <button
          onClick={() => onSelect(wps)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Show Full WPS</span>
        </button>
      </div>
    </div>
  );
};
