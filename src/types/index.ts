// Core types for LinQ platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  college_office?: string;
  avatar?: string;
  verified: boolean;
  rating: number;
  totalRides: number;
  createdAt: string;
}

export interface Route {
  id: string;
  userId: string;
  from: string;
  to: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  morning_time: string;
  evening_connect: 'Yes' | 'No';
  evening_time?: string;
  travel_frequency: string;
  travel_days: string[];
  active: boolean;
}

export interface Vehicle {
  type: 'Car' | 'Bike' | 'Scooter' | '';
  seats?: number;
  hasVehicle: 'Yes' | 'No';
}

export interface Profile extends User {
  route: Route;
  vehicle: Vehicle;
  message?: string;
  college_office?: string;
}

export interface MatchResult {
  profile: Profile;
  score: number;
  matchType: string;
  matchPercentage: number;
}

export interface SearchFilters {
  from?: string;
  to?: string;
  fromCoords?: { lat: number; lon: number };
  toCoords?: { lat: number; lon: number };
  collegeOffice?: string;
  wantCollegeMatch: boolean;
  travelDays: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  unlocks: number | 'unlimited';
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSearches: number;
  totalMatches: number;
  revenue: number;
  unlockedProfiles: number;
  reports: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface CreateProfileRequest {
  name: string;
  email: string;
  phone: string;
  gender: string;
  has_vehicle: string;
  vehicle_type: string;
  seats: string;
  from: string;
  to: string;
  time: string;
  willing_return: string;
  return_time: string;
  message_to_partner: string;
  travel_frequency: string;
  travel_days: string[];
  college_office: string;
}
