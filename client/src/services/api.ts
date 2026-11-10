import { Hazard, Incident, Journey, ChecklistItem, AnalysisResult } from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Network response was not ok' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Hazards
  async getHazards(params?: { category?: string; status?: string }): Promise<{ hazards: Hazard[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    const res = await fetch(`${API_BASE}/hazards?${query.toString()}`);
    return handleResponse<{ hazards: Hazard[] }>(res);
  },

  async getHazard(id: number): Promise<{ hazard: Hazard }> {
    const res = await fetch(`${API_BASE}/hazards/${id}`);
    return handleResponse<{ hazard: Hazard }>(res);
  },

  async createHazard(data: {
    category: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
  }): Promise<{ message: string; hazard: Hazard }> {
    const res = await fetch(`${API_BASE}/hazards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async confirmHazard(id: number, sessionId: string): Promise<{ confirmationCount: number; status: string }> {
    const res = await fetch(`${API_BASE}/hazards/${id}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    return handleResponse(res);
  },

  // Incidents
  async getIncidents(params?: { category?: string; status?: string; search?: string }): Promise<{ incidents: Incident[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const res = await fetch(`${API_BASE}/incidents?${query.toString()}`);
    return handleResponse<{ incidents: Incident[] }>(res);
  },

  async getIncident(id: number): Promise<{ incident: Incident }> {
    const res = await fetch(`${API_BASE}/incidents/${id}`);
    return handleResponse<{ incident: Incident }>(res);
  },

  async createIncident(data: Partial<Incident>): Promise<{ message: string; incident: Incident }> {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateIncident(id: number, data: Partial<Incident>): Promise<{ message: string; incident: Incident }> {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteIncident(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  async addIncidentNote(id: number, content: string): Promise<{ note: any }> {
    const res = await fetch(`${API_BASE}/incidents/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return handleResponse(res);
  },

  async clearDemoIncidents(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/incidents/demo/clear`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Analyzer
  async analyzeMessage(message: string, context?: string): Promise<{ result: AnalysisResult }> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });
    return handleResponse(res);
  },

  async getSampleMessages(): Promise<{ samples: { id: string; label: string; message: string; context: string }[] }> {
    const res = await fetch(`${API_BASE}/analyze/samples`);
    return handleResponse(res);
  },

  // Journeys
  async getJourneys(): Promise<{ journeys: Journey[] }> {
    const res = await fetch(`${API_BASE}/journeys`);
    return handleResponse(res);
  },

  async getActiveJourney(): Promise<{ journey: Journey | null }> {
    const res = await fetch(`${API_BASE}/journeys/active`);
    return handleResponse(res);
  },

  async startJourney(data: any): Promise<{ journey: Journey }> {
    const res = await fetch(`${API_BASE}/journeys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async checkInJourney(id: number): Promise<{ message: string; lastCheckIn: string }> {
    const res = await fetch(`${API_BASE}/journeys/${id}/checkin`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  async shareJourney(id: number): Promise<{ message: string; token: string; expiresAt: string; warning: string }> {
    const res = await fetch(`${API_BASE}/journeys/${id}/share`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  async revokeJourneyShare(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/journeys/${id}/revoke-share`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  async completeJourney(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/journeys/${id}/complete`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  async cancelJourney(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/journeys/${id}/cancel`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  async getSharedJourney(token: string): Promise<{ sharedJourney: any }> {
    const res = await fetch(`${API_BASE}/journeys/shared/${token}`);
    return handleResponse(res);
  },

  // Checklist
  async getChecklist(mode?: string): Promise<{ items: ChecklistItem[] }> {
    const res = await fetch(`${API_BASE}/checklist?mode=${mode || 'all'}`);
    return handleResponse(res);
  },

  async updateChecklistItem(id: number, data: { completed: boolean; note?: string }): Promise<{ item: ChecklistItem }> {
    const res = await fetch(`${API_BASE}/checklist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async resetChecklist(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/checklist/reset`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  // Stats
  async getStats(): Promise<{
    totalHazards: number;
    totalIncidents: number;
    activeJourneys: number;
    checklistProgress: { completed: number; total: number; percentage: number };
  }> {
    const res = await fetch(`${API_BASE}/stats/summary`);
    return handleResponse(res);
  },
};
