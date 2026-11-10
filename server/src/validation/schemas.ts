import { z } from 'zod';

export const HazardCategorySchema = z.enum([
  'broken-streetlight',
  'road-construction',
  'road-closure',
  'blocked-footpath',
  'stray-dog',
  'other',
]);

export const CreateHazardSchema = z.object({
  category: HazardCategorySchema,
  title: z.string().min(3, 'Title must be at least 3 characters').max(120, 'Title must be at most 120 characters').trim(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be at most 1000 characters').trim(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const ConfirmHazardSchema = z.object({
  sessionId: z.string().min(1).max(128),
});

export const IncidentCategorySchema = z.enum([
  'online-harassment',
  'physical-threat',
  'stalking',
  'phishing-scam',
  'coercion',
  'impersonation',
  'other',
]);

export const IncidentStatusSchema = z.enum(['open', 'in-progress', 'resolved', 'closed']);

export const CreateIncidentSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  category: IncidentCategorySchema,
  description: z.string().min(10).max(5000).trim(),
  incidentDate: z.string().optional(),
  sourceLabel: z.string().max(200).trim().optional(),
  status: IncidentStatusSchema.default('open'),
  evidenceExcerpts: z.array(z.string().max(2000).trim()).max(20).default([]),
});

export const UpdateIncidentSchema = CreateIncidentSchema.partial().extend({
  status: IncidentStatusSchema.optional(),
});

export const CreateIncidentNoteSchema = z.object({
  content: z.string().min(1).max(3000).trim(),
});

export const AnalyzeMessageSchema = z.object({
  message: z.string().min(1, 'Message is required').max(5000, 'Message too long').trim(),
  context: z.string().max(1000).trim().optional(),
});

export const CreateJourneySchema = z.object({
  destination: z.string().min(3).max(300).trim(),
  startLocation: z.string().min(3).max(300).trim(),
  plannedArrivalTime: z.string().datetime({ offset: true }),
  rideProvider: z.string().max(100).trim().optional(),
  driverName: z.string().max(100).trim().optional(),
  vehicleRegistration: z.string().max(50).trim().optional(),
  bookingReference: z.string().max(100).trim().optional(),
  checkInIntervalMinutes: z.number().int().min(5).max(240).default(30),
  locationSharingEnabled: z.boolean().default(false),
});

export const UpdateJourneyLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const ChecklistUpdateSchema = z.object({
  completed: z.boolean(),
  note: z.string().max(500).trim().optional(),
});
