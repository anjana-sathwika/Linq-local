// Service placeholders for future backend integration

import { ApiResponse, Profile, SearchFilters, MatchResult, PricingPlan, AdminStats, CreateProfileRequest } from '@/types';

// Auth Service
export const authService = {
  async login(phone: string): Promise<ApiResponse<{ token: string; user: any }>> {
    // TODO: Implement actual authentication
    return {
      data: { token: 'mock-token', user: { id: '1', phone } },
      success: true
    };
  },

  async verifyOtp(phone: string, otp: string): Promise<ApiResponse<{ token: string; user: any }>> {
    // TODO: Implement OTP verification
    return {
      data: { token: 'mock-token', user: { id: '1', phone } },
      success: true
    };
  },

  async logout(): Promise<ApiResponse<null>> {
    // TODO: Implement logout
    return { data: null, success: true };
  }
};

// Profile Service
export const profileService = {
  async createProfile(data: CreateProfileRequest): Promise<ApiResponse<Profile>> {
    // TODO: Implement profile creation with backend
    const mockProfile: Profile = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender as any,
      college_office: data.college_office,
      verified: false,
      rating: 0,
      totalRides: 0,
      createdAt: new Date().toISOString(),
      route: {
        id: Date.now().toString(),
        userId: Date.now().toString(),
        from: data.from,
        to: data.to,
        from_lat: 0,
        from_lng: 0,
        to_lat: 0,
        to_lng: 0,
        morning_time: data.time,
        evening_connect: data.willing_return as any,
        evening_time: data.return_time,
        travel_frequency: data.travel_frequency,
        travel_days: data.travel_days,
        active: true
      },
      vehicle: {
        type: data.vehicle_type as any,
        seats: data.seats ? parseInt(data.seats) : undefined,
        hasVehicle: data.has_vehicle as any
      },
      message: data.message_to_partner
    };

    return { data: mockProfile, success: true };
  },

  async getProfile(userId: string): Promise<ApiResponse<Profile>> {
    // TODO: Implement profile retrieval
    throw new Error('Not implemented');
  },

  async updateProfile(userId: string, data: Partial<Profile>): Promise<ApiResponse<Profile>> {
    // TODO: Implement profile update
    throw new Error('Not implemented');
  }
};

// Match Service
export const matchService = {
  async searchProfiles(filters: SearchFilters): Promise<ApiResponse<MatchResult[]>> {
    // TODO: Implement actual search with backend
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string);
      const profiles = await response.json();
      
      // Transform and score profiles
      const matchResults: MatchResult[] = profiles.map((profile: any) => ({
        profile: {
          id: profile.id,
          name: profile.name,
          email: profile.email || '',
          phone: profile.phone,
          gender: profile.gender as any,
          college_office: profile.college_office,
          verified: false,
          rating: 4.5,
          totalRides: Math.floor(Math.random() * 100),
          createdAt: profile.created_at || new Date().toISOString(),
          route: {
            id: profile.id,
            userId: profile.id,
            from: profile.from,
            to: profile.to,
            from_lat: profile.from_lat || 0,
            from_lng: profile.from_lng || 0,
            to_lat: profile.to_lat || 0,
            to_lng: profile.to_lng || 0,
            morning_time: profile.morning_time,
            evening_connect: profile.evening_connect as any,
            evening_time: profile.evening_time,
            travel_frequency: profile.travel_frequency || 'Daily',
            travel_days: profile.travel_days ? profile.travel_days.split(',') : [],
            active: true
          },
          vehicle: {
            type: profile.vehicle_type as any,
            seats: profile.seats ? parseInt(profile.seats) : undefined,
            hasVehicle: profile.has_vehicle as any
          },
          message: profile.message
        },
        score: profile.score || 0,
        matchType: profile.matchType || 'Other',
        matchPercentage: Math.min(95, Math.max(60, (profile.score || 0) * 0.8 + Math.random() * 20))
      }));

      return { data: matchResults, success: true };
    } catch (error) {
      return { data: [], success: false, message: 'Search failed' };
    }
  },

  async calculateMatchScore(userProfile: Profile, otherProfile: Profile): Promise<number> {
    // TODO: Implement sophisticated matching algorithm
    return Math.floor(Math.random() * 100);
  }
};

// Payment Service
export const paymentService = {
  async createPaymentIntent(planId: string): Promise<ApiResponse<{ clientSecret: string }>> {
    // TODO: Implement payment with Stripe/Razorpay
    return {
      data: { clientSecret: 'mock-client-secret' },
      success: true
    };
  },

  async confirmPayment(paymentId: string): Promise<ApiResponse<{ success: boolean }>> {
    // TODO: Implement payment confirmation
    return {
      data: { success: true },
      success: true
    };
  },

  async getUserCredits(userId: string): Promise<ApiResponse<{ credits: number; plan: string }>> {
    // TODO: Implement credit system
    return {
      data: { credits: 5, plan: 'free' },
      success: true
    };
  }
};

// Admin Service
export const adminService = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    // TODO: Implement admin dashboard stats
    return {
      data: {
        totalUsers: 34567,
        activeUsers: 8234,
        totalSearches: 125432,
        totalMatches: 45678,
        revenue: 234567,
        unlockedProfiles: 12345,
        reports: 23
      },
      success: true
    };
  },

  async getReports(): Promise<ApiResponse<any[]>> {
    // TODO: Implement reports retrieval
    return { data: [], success: true };
  }
};
