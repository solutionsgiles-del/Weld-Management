import React, { useState } from 'react';
import { Flame, FileSpreadsheet, BookOpen, Users, RotateCcw, Menu, X, Shield, Clock } from 'lucide-react';
import { Welder, WorkCardSpecSheet } from '../types';
import { getProlongationAlerts } from '../utils/qualificationMatcher';

export type ActiveTab = 'jobs' | 'wps' | 'welders';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  welders: Welder[];
  workCards: WorkCardSpecSheet[];
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  welders,
  workCards,
  onResetData,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { totalAlerts, expired, expiringSoon } = getProlongationAlerts(welders);

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    setIsMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-5">
      <div className="space-y-6">
        {/* Brand Mark */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500 text-slate-950 rounded-lg font-black flex items-center justify-center shadow-sm">
              <Flame className="w-5 h-5 fill-slate-950" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white">WeldTrack</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono font-bold border border-amber-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Welding QC Module</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vertical Navigation - 3 Tabs Stacked Above Each Other */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
            Welding Management Tabs
          </span>

          <nav className="flex flex-col gap-2">
            {/* Tab 1: Job Spec Sheets */}
            <button
              onClick={() => handleSelectTab('jobs')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left group ${
                activeTab === 'jobs'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md ring-2 ring-amber-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-900/40 border border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`p-2 rounded-lg transition-colors ${
                    activeTab === 'jobs'
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-slate-800 text-amber-400 group-hover:bg-slate-700'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold leading-tight">Tab 1: Job Spec Sheets</div>
                  <div
                    className={`text-[10px] font-normal mt-0.5 leading-tight ${
                      activeTab === 'jobs' ? 'text-slate-900/80' : 'text-slate-400'
                    }`}
                  >
                    Work Cards &amp; Welder Stamps
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'jobs'
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {workCards.length}
              </span>
            </button>

            {/* Tab 2: WPS Directory */}
            <button
              onClick={() => handleSelectTab('wps')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left group ${
                activeTab === 'wps'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md ring-2 ring-amber-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-900/40 border border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`p-2 rounded-lg transition-colors ${
                    activeTab === 'wps'
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-slate-800 text-sky-400 group-hover:bg-slate-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold leading-tight">Tab 2: WPS Directory</div>
                  <div
                    className={`text-[10px] font-normal mt-0.5 leading-tight ${
                      activeTab === 'wps' ? 'text-slate-900/80' : 'text-slate-400'
                    }`}
                  >
                    AWS Procedures &amp; Parameters
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'wps'
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                AWS
              </span>
            </button>

            {/* Tab 3: Welder Qualifications (WPQR) */}
            <button
              onClick={() => handleSelectTab('welders')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left group ${
                activeTab === 'welders'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md ring-2 ring-amber-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-900/40 border border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`p-2 rounded-lg transition-colors ${
                    activeTab === 'welders'
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-slate-800 text-emerald-400 group-hover:bg-slate-700'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold leading-tight">Tab 3: Welder WPQR</div>
                  <div
                    className={`text-[10px] font-normal mt-0.5 leading-tight ${
                      activeTab === 'welders' ? 'text-slate-900/80' : 'text-slate-400'
                    }`}
                  >
                    Qualifications &amp; Prolongations
                  </div>
                </div>
              </div>

              {totalAlerts > 0 ? (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono flex items-center gap-1 ${
                    activeTab === 'welders'
                      ? 'bg-slate-950 text-amber-300'
                      : expired.length > 0
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                  title={`${totalAlerts} qualifications require prolongation attention`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{totalAlerts}</span>
                </span>
              ) : (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'welders'
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {welders.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Quick System Summary */}
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2 text-[11px]">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Compliance Scope</span>
          </div>
          <div className="text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Standard Code:</span>
              <strong className="text-white font-mono">AWS D1.1 / D1.6</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Core Engine:</span>
              <span className="font-mono font-bold text-amber-400">Python 3.10 / SQLite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Welders Loaded:</span>
              <span className="font-mono font-bold text-white">{welders.length} certified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Work Cards:</span>
              <span className="font-mono font-bold text-white">{workCards.length} spec sheets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer in Sidebar */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <button
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
          title="Reset sample welding demo data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Dataset</span>
        </button>

        <div className="text-[10px] text-slate-500 text-center">
          WeldTrack Pro · Quality Control
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-amber-500 text-slate-950 rounded-lg font-black flex items-center justify-center">
            <Flame className="w-4 h-4 fill-slate-950" />
          </span>
          <span className="text-sm font-bold tracking-tight text-white">WeldTrack PRO</span>
        </div>

        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 flex items-center gap-1.5 text-xs font-semibold"
        >
          <Menu className="w-5 h-5" />
          <span>Menu</span>
        </button>
      </header>

      {/* Desktop Left Sidebar: The 3 Tabs are on the left stacked vertically above each other */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-slate-900 border-r border-slate-800 text-white shrink-0 min-h-screen sticky top-0 h-screen z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer (When Opened) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/80 backdrop-blur-sm flex">
          <div className="w-72 bg-slate-900 text-white h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)} />
        </div>
      )}
    </>
  );
};
