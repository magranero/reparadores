export type DiagnosisStatus = 'pending' | 'completed' | 'archived';

export interface Diagnosis {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  status: DiagnosisStatus;
  result?: DiagnosisResult;
}

export interface DiagnosisResult {
  issue: string;
  severity: 'low' | 'medium' | 'high';
  recommendedActions: string[];
  requiredParts: Part[];
}

export interface Part {
  id: string;
  name: string;
  estimatedCost: string;
  availabilityStatus: 'in-stock' | 'limited' | 'out-of-stock';
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface MaintenanceTip {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Professional {
  id: string;
  name: string;
  profileImageUrl: string;
  specialties: string[];
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  availability: {
    status: 'available' | 'limited' | 'unavailable';
    nextAvailable?: string;
  };
  hourlyRate: string;
  bio: string;
}

export interface Quote {
  id: string;
  professionalId: string;
  professional: {
    name: string;
    profileImageUrl: string;
    rating: number;
  };
  diagnosisId: string;
  diagnosisTitle: string;
  amount: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  serviceDetails: string[];
  estimatedDuration: string;
  aiAnalysis?: {
    fairnessRating: 'below_market' | 'market_rate' | 'above_market';
    confidenceScore: number;
    notes: string[];
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  address?: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}