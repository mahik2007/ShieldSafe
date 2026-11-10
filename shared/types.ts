// Shared types between client and server

export type SafetyMode = 'everyday' | 'womens' | 'child-teen';

export type HazardCategory =
  | 'broken-streetlight'
  | 'road-construction'
  | 'road-closure'
  | 'blocked-footpath'
  | 'stray-dog'
  | 'other';

export type HazardStatus = 'unverified' | 'community-confirmed' | 'resolved' | 'expired';

export interface Hazard {
  id: number;
  category: HazardCategory;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: HazardStatus;
  confirmationCount: number;
  isDemoData: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IncidentCategory =
  | 'online-harassment'
  | 'physical-threat'
  | 'stalking'
  | 'phishing-scam'
  | 'coercion'
  | 'impersonation'
  | 'other';

export type IncidentStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export interface IncidentNote {
  id: number;
  incidentId: number;
  content: string;
  createdAt: string;
}

export interface Incident {
  id: number;
  title: string;
  category: IncidentCategory;
  description: string;
  incidentDate?: string;
  sourceLabel?: string;
  status: IncidentStatus;
  evidenceExcerpts: string[];
  notes: IncidentNote[];
  isDemoData: boolean;
  createdAt: string;
  updatedAt: string;
}

export type JourneyStatus = 'active' | 'completed' | 'cancelled' | 'overdue';

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
  status: JourneyStatus;
  shareToken?: string;
  shareTokenExpiresAt?: string;
  locationSharingEnabled: boolean;
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
  safetyMode: SafetyMode | 'all';
  completed: boolean;
  note?: string;
  completedAt?: string;
  orderIndex: number;
}

export interface AnalysisResult {
  severity: 'none' | 'context-needed' | 'concerning' | 'urgent';
  flags: AnalysisFlag[];
  summary: string;
  nextSteps: string[];
  disclaimer: string;
}

export interface AnalysisFlag {
  type: string;
  label: string;
  excerpt: string;
  explanation: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
