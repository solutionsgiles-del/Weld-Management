import { Welder, WPS, WorkCardSpecSheet, WelderQualification } from '../types';

const API_BASE = '/api';

/**
 * WeldTrack Pro - API Client for Python Backend
 * Communicates with the Python 3.10 REST Engine and SQLite persistence.
 */
export const pythonApi = {
  // Check backend health
  async checkHealth(): Promise<{ status: string; backend: string } | null> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[Python API] Health check warning:', e);
    }
    return null;
  },

  // Seed backend with initial factory dataset
  async seedInitialData(wpsList: WPS[], weldersList: Welder[], workCards: WorkCardSpecSheet[]): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wpsLibrary: wpsList, weldersList, workCards }),
      });
      return res.ok;
    } catch (e) {
      console.warn('[Python API] Seed fallback:', e);
      return false;
    }
  },

  // Save/Update Welder
  async saveWelder(welder: Welder): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/welders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(welder),
      });
      return res.ok;
    } catch (e) {
      console.warn('[Python API] Save welder fallback:', e);
      return false;
    }
  },

  // Add Qualification
  async addQualification(welderId: string, qual: WelderQualification): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/welders/${welderId}/qualifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qual),
      });
      return res.ok;
    } catch (e) {
      console.warn('[Python API] Add qualification fallback:', e);
      return false;
    }
  },

  // Record Prolongation
  async recordProlongation(
    welderId: string,
    qualId: string,
    newExpiryDate: string,
    interval: string,
    confirmedBy: string,
    ndtReportNo: string,
    notes: string
  ): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/welders/${welderId}/prolongations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qualId,
          newExpiryDate,
          interval,
          confirmedBy,
          ndtReportNo,
          notes,
          prolongedDate: new Date().toISOString().split('T')[0],
          timestamp: Date.now(),
        }),
      });
      return res.ok;
    } catch (e) {
      console.warn('[Python API] Prolongation record fallback:', e);
      return false;
    }
  },

  // Save / Update Work Card
  async saveWorkCard(card: WorkCardSpecSheet): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/work-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card),
      });
      return res.ok;
    } catch (e) {
      console.warn('[Python API] Save work card fallback:', e);
      return false;
    }
  },

  // Call Python engine to validate Welder against WPS
  async validateWelderAgainstWps(
    welder: Welder,
    wps: WPS
  ): Promise<{ isQualified: boolean; reason: string } | null> {
    try {
      const res = await fetch(`${API_BASE}/validate-welder-wps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ welder, wps }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[Python API] Validate welder fallback:', e);
    }
    return null;
  },
};
