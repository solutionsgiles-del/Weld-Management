import React, { useState, useEffect } from 'react';
import { Welder, WPS, WorkCardSpecSheet, WelderQualification } from './types';
import { INITIAL_WPS_LIBRARY } from './data/mockWpsData';
import { INITIAL_WELDERS_LIST } from './data/mockWeldersData';
import { INITIAL_WORK_CARDS } from './data/mockWorkCardsData';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { ProlongationAlertBanner } from './components/ProlongationAlertBanner';
import { WorkCardList } from './components/Tab1WorkCards/WorkCardList';
import { WpsDirectory } from './components/Tab2WpsDirectory/WpsDirectory';
import { WeldersList } from './components/Tab3WelderQualifications/WeldersList';
import { FullWpsModal } from './components/Tab2WpsDirectory/FullWpsModal';
import { pythonApi } from './api/client';

const STORAGE_KEYS = {
  WPS: 'weldtrack_wps_library_v3',
  WELDERS: 'weldtrack_welders_list_v1',
  WORK_CARDS: 'weldtrack_work_cards_v1',
};

export default function App() {
  // Load initial state with localStorage fallback
  const [wpsLibrary, setWpsLibrary] = useState<WPS[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WPS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_WPS_LIBRARY.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WPS_LIBRARY;
  });

  const [weldersList, setWeldersList] = useState<Welder[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WELDERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WELDERS_LIST;
  });

  const [workCards, setWorkCards] = useState<WorkCardSpecSheet[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WORK_CARDS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WORK_CARDS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('jobs');
  const [welderInitialFilter, setWelderInitialFilter] = useState<'ALL' | 'EXPIRING' | 'EXPIRED'>('ALL');
  const [globalModalWps, setGlobalModalWps] = useState<WPS | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WPS, JSON.stringify(wpsLibrary));
    } catch (e) {
      console.error(e);
    }
  }, [wpsLibrary]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WELDERS, JSON.stringify(weldersList));
    } catch (e) {
      console.error(e);
    }
  }, [weldersList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORK_CARDS, JSON.stringify(workCards));
    } catch (e) {
      console.error(e);
    }
  }, [workCards]);

  // Initial sync with Python Backend
  useEffect(() => {
    pythonApi.checkHealth().then((health) => {
      if (health) {
        console.log('[App] Connected to Python Engine:', health);
        pythonApi.seedInitialData(wpsLibrary, weldersList, workCards);
      }
    });
  }, []);

  // Handler: Save new Work Card / Job Spec Sheet
  const handleSaveJob = (newCard: WorkCardSpecSheet) => {
    setWorkCards((prev) => [newCard, ...prev]);
    pythonApi.saveWorkCard(newCard);
  };

  // Handler: Update existing Work Card
  const handleUpdateWorkCard = (updatedCard: WorkCardSpecSheet) => {
    setWorkCards((prev) => prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)));
    pythonApi.saveWorkCard(updatedCard);
  };

  // Handler: Add new welder
  const handleAddWelder = (newWelder: Welder) => {
    setWeldersList((prev) => [...prev, newWelder]);
    pythonApi.saveWelder(newWelder);
  };

  // Handler: Add qualification to welder
  const handleAddQualification = (welderId: string, qual: WelderQualification) => {
    setWeldersList((prev) =>
      prev.map((w) => {
        if (w.id === welderId) {
          return {
            ...w,
            qualifications: [...w.qualifications, qual],
          };
        }
        return w;
      })
    );
    pythonApi.addQualification(welderId, qual);
  };

  // Handler: Save prolongation renewal
  const handleSaveProlongation = (
    welderId: string,
    qualId: string,
    newExpiryDate: string,
    interval: '6_MONTHS' | 'ANNUAL',
    confirmedBy: string,
    ndtReportNo: string,
    notes: string
  ) => {
    setWeldersList((prev) =>
      prev.map((w) => {
        if (w.id === welderId) {
          const updatedQuals = w.qualifications.map((q) => {
            if (q.id === qualId) {
              const newRecord = {
                id: `PRO-${Date.now()}`,
                prolongedDate: new Date().toISOString().split('T')[0],
                expiryDate: newExpiryDate,
                confirmedBy,
                ndtReportNo,
                notes,
              };
              return {
                ...q,
                interval,
                currentExpiryDate: newExpiryDate,
                prolongationHistory: [newRecord, ...q.prolongationHistory],
              };
            }
            return q;
          });
          return { ...w, qualifications: updatedQuals };
        }
        return w;
      })
    );
    pythonApi.recordProlongation(
      welderId,
      qualId,
      newExpiryDate,
      interval,
      confirmedBy,
      ndtReportNo,
      notes
    );
  };

  // Quick navigation from 30-day notice alert banner
  const handleNavigateToWelders = (filter: 'EXPIRING' | 'EXPIRED') => {
    setWelderInitialFilter(filter);
    setActiveTab('welders');
  };

  // Reset demo data to defaults
  const handleResetData = () => {
    if (confirm('Reset demo data to initial factory AWS standards dataset?')) {
      localStorage.removeItem(STORAGE_KEYS.WPS);
      localStorage.removeItem(STORAGE_KEYS.WELDERS);
      localStorage.removeItem(STORAGE_KEYS.WORK_CARDS);
      setWpsLibrary(INITIAL_WPS_LIBRARY);
      setWeldersList(INITIAL_WELDERS_LIST);
      setWorkCards(INITIAL_WORK_CARDS);
      setActiveTab('jobs');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 antialiased font-sans">
      {/* Left Sidebar containing the three tabs stacked vertically above each other */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'welders') setWelderInitialFilter('ALL');
        }}
        welders={weldersList}
        workCards={workCards}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Screen 30-Day Prolongation Notification Banner (Prompt Requirement) */}
        <ProlongationAlertBanner
          welders={weldersList}
          onNavigateToWelders={handleNavigateToWelders}
        />

        {/* Workspace Content Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-8">
          {/* Tab 1: New Job selection & Spec sheet tracking for each work card */}
          {activeTab === 'jobs' && (
            <WorkCardList
              workCards={workCards}
              weldersList={weldersList}
              wpsLibrary={wpsLibrary}
              onSaveJob={handleSaveJob}
              onUpdateWorkCard={handleUpdateWorkCard}
              onOpenFullWps={(wps) => setGlobalModalWps(wps)}
            />
          )}

          {/* Tab 2: AWS WPS Directory & Parameter Matcher */}
          {activeTab === 'wps' && (
            <WpsDirectory wpsLibrary={wpsLibrary} />
          )}

          {/* Tab 3: Welder Qualifications & Prolongations (6-months / annual) */}
          {activeTab === 'welders' && (
            <WeldersList
              welders={weldersList}
              onAddWelder={handleAddWelder}
              onAddQualification={handleAddQualification}
              onSaveProlongation={handleSaveProlongation}
              initialFilter={welderInitialFilter}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-4 md:px-8 text-center text-xs text-slate-500 no-print">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>WeldTrack Pro · Industrial Welding Quality Control Suite</span>
            <span className="font-mono text-slate-400">AWS D1.1 / AWS D1.6 / ISO 9606 Compliance Standards</span>
          </div>
        </footer>
      </div>

      {/* Global Full WPS Modal */}
      <FullWpsModal
        wps={globalModalWps}
        onClose={() => setGlobalModalWps(null)}
      />
    </div>
  );
}
