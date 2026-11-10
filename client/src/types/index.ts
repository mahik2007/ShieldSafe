export interface Hazard {
  id: number;
  category: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: 'unverified' | 'community-confirmed' | 'resolved' | 'expired';
  confirmationCount: number;
  isDemoData: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentNote {
  id: number;
  incidentId: number;
  content: string;
  createdAt: string;
}

export interface Incident {
  id: number;
  title: string;
  category: string;
  description: string;
  incidentDate?: string;
  sourceLabel?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  evidenceExcerpts: string[];
  notes: IncidentNote[];
  isDemoData: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Journey {
  id: number;
  destination: string;
  startLocation: string;
  plannedArrivalTime: string;
  rideProvider?: string;
  driverName?: string;
  vehicleRegistration?: string;
  bookingReference?: string;
  checkInIntervalMinutes: number;
  status: 'active' | 'completed' | 'cancelled' | 'overdue';
  shareToken?: string;
  shareTokenExpiresAt?: string;
  locationSharingEnabled: boolean;
  lastLatitude?: number;
  lastLongitude?: number;
  lastCheckIn?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: number;
  category: string;
  title: string;
  description: string;
  safetyMode: string;
  completed: boolean;
  note?: string;
  completedAt?: string;
  orderIndex: number;
}

export interface AnalysisResult {
  severity: 'none' | 'context-needed' | 'concerning' | 'urgent';
  flags: {
    type: string;
    label: string;
    excerpt: string;
    explanation: string;
  }[];
  summary: string;
  nextSteps: string[];
  disclaimer: string;
}

export type SafetyMode = 'everyday' | 'womens' | 'child-teen';
