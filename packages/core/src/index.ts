// sales-iq-core — shared types used by MCP server tools

export interface Config {
  hubspotApiKey?: string;
  mailchimpApiKey?: string;
  mailchimpServerPrefix?: string;
  twitterApiKey?: string;
  linkedinApiKey?: string;
  ga4MeasurementId?: string;
  semrushApiKey?: string;
  anthropicApiKey?: string;
}

// CRM Types
export type DealStage =
  | 'prospecting'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  name: string;
  stage: DealStage;
  amount: number;
  currency: string;
  contactId?: string;
  closeDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineSummary {
  totalDeals: number;
  totalValue: number;
  currency: string;
  byStage: Record<DealStage, { count: number; value: number }>;
}

// Email / Campaign Types
export type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'paused' | 'archived';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  subject?: string;
  fromName?: string;
  fromEmail?: string;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface CampaignMetrics {
  campaignId: string;
  sends: number;
  opens: number;
  clicks: number;
  bounces: number;
  unsubscribes: number;
  openRate: number;
  clickRate: number;
}

// Lead Scoring Types
export interface Lead {
  company: string;
  title: string;
  email: string;
  context?: string;
}

export interface LeadScore {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  rationale: string;
  suggestedActions: string[];
}

// Analytics Types
export interface TrafficData {
  startDate: string;
  endDate: string;
  sessions: number;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: { path: string; views: number }[];
}

export interface SeoRanking {
  keyword: string;
  position: number;
  url: string;
  searchVolume?: number;
  difficulty?: number;
}

// Content Calendar Types
export type CalendarEntryStatus = 'draft' | 'scheduled' | 'published' | 'cancelled';

export interface CalendarEntry {
  id: string;
  date: string;
  channel: string;
  content: string;
  status: CalendarEntryStatus;
  createdAt: string;
}
