import React, { useState, useMemo } from 'react';
import { WPS, WeldingProcess } from '../../types';
import { WpsCard } from './WpsCard';
import { FullWpsModal } from './FullWpsModal';
import { Search, Filter, Sparkles, BookOpen, Layers } from 'lucide-react';

interface WpsDirectoryProps {
  wpsLibrary: WPS[];
}

export const WpsDirectory: React.FC<WpsDirectoryProps> = ({ wpsLibrary }) => {
  const [selectedProcess, setSelectedProcess] = useState<string>('ALL');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalWps, setActiveModalWps] = useState<WPS | null>(null);

  // Extract distinct material groups from library for clean dropdown
  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    wpsLibrary.forEach((w) => {
      if (w.materialGroup.includes('Carbon Steel')) set.add('Carbon Steel');
      else if (w.materialGroup.includes('Stainless')) set.add('Stainless Steel');
      else if (w.materialGroup.includes('Aluminum')) set.add('Aluminum');
      else set.add('Alloy & Bridge Steel');
    });
    return Array.from(set);
  }, [wpsLibrary]);

  // Filter WPS according to Material and Process inputs as specified in prompt
  const filteredWps = useMemo(() => {
    return wpsLibrary.filter((w) => {
      // Process filter
      if (selectedProcess !== 'ALL' && w.process !== selectedProcess) {
        return false;
      }
      // Material filter
      if (selectedMaterial !== 'ALL') {
        const mat = w.material.toLowerCase() + ' ' + w.materialGroup.toLowerCase();
        if (selectedMaterial === 'Carbon Steel' && !mat.includes('carbon') && !mat.includes('a36') && !mat.includes('a572')) {
          return false;
        }
        if (selectedMaterial === 'Stainless Steel' && !mat.includes('stainless') && !mat.includes('304') && !mat.includes('316')) {
          return false;
        }
        if (selectedMaterial === 'Aluminum' && !mat.includes('aluminum') && !mat.includes('6061')) {
          return false;
        }
        if (selectedMaterial === 'Alloy & Bridge Steel' && !mat.includes('bridge') && !mat.includes('a709') && !mat.includes('saw')) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = w.wpsNumber.toLowerCase().includes(q);
        const matchMat = w.material.toLowerCase().includes(q);
        const matchPQR = w.supportingPQR.toLowerCase().includes(q);
        const matchStandard = w.standard.toLowerCase().includes(q);
        const matchProcess = w.process.toLowerCase().includes(q);
        return matchNumber || matchMat || matchPQR || matchStandard || matchProcess;
      }
      return true;
    });
  }, [wpsLibrary, selectedProcess, selectedMaterial, searchQuery]);

  const processesList: (WeldingProcess | 'ALL')[] = ['ALL', 'SMAW', 'GMAW', 'GTAW', 'FCAW', 'SAW'];

  const handleResetFilters = () => {
    setSelectedProcess('ALL');
    setSelectedMaterial('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Interactive Smart Matcher Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-slate-100 text-slate-800 rounded-lg">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  AWS Welding Procedure Specifications (WPS)
                </h1>
                <p className="text-xs text-slate-500">
                  Select Base Material and Process to retrieve pre-qualified AWS parameters and technical specifications
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>Library:</span>
            <strong className="text-slate-800">{wpsLibrary.length} Qualified WPS</strong>
          </div>
        </div>

        {/* Input Selector Form: Material & Process (Prompt Requirement) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-5 items-end">
          {/* Material Input */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Base Material</span>
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-colors"
            >
              <option value="ALL">All Materials (Carbon, Stainless, Aluminum, Alloy)</option>
              {availableMaterials.map((mat) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
          </div>

          {/* Process Input */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Welding Process</span>
            </label>
            <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              {processesList.map((proc) => {
                const isActive = selectedProcess === proc;
                return (
                  <button
                    key={proc}
                    onClick={() => setSelectedProcess(proc)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {proc === 'ALL' ? 'All' : proc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Box */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Keyword / WPS ID
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search standard, PQR..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Active Filter Helper Bar */}
        {(selectedProcess !== 'ALL' || selectedMaterial !== 'ALL' || searchQuery) && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                Matching: <strong className="text-slate-800">{filteredWps.length} procedure(s)</strong> found for{' '}
                <span className="font-semibold text-slate-700">{selectedMaterial !== 'ALL' ? selectedMaterial : 'All Materials'}</span> +{' '}
                <span className="font-semibold text-slate-700">{selectedProcess !== 'ALL' ? selectedProcess : 'All Processes'}</span>
              </span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Grid of WPS Cards */}
      {filteredWps.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No WPS matches your current selection</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your Material or Process filter, or clear your search query to see available qualified specifications.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWps.map((wps) => (
            <WpsCard
              key={wps.id}
              wps={wps}
              onSelect={(item) => setActiveModalWps(item)}
            />
          ))}
        </div>
      )}

      {/* Full WPS Detailed Modal */}
      <FullWpsModal
        wps={activeModalWps}
        onClose={() => setActiveModalWps(null)}
      />
    </div>
  );
};
