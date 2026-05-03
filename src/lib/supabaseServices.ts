// Real services using Supabase database

import { supabase } from './supabase';
import { Profile, SearchFilters, MatchResult, PricingPlan, AdminStats, CreateProfileRequest } from '@/types';

export const supabaseProfileService = {
  async createProfile(data: CreateProfileRequest) {
    try {
      // First get the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      // Create profile
      const profileData = {
        id: userData.user.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        college_office: data.college_office,
        verified: false,
        rating: 0.0,
        total_rides: 0,
      };

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) throw profileError;

      // Create route
      const routeData = {
        user_id: userData.user.id,
        from_address: data.from,
        to_address: data.to,
        morning_time: data.time,
        evening_connect: data.willing_return === 'Yes',
        evening_time: data.return_time,
        travel_frequency: data.travel_frequency,
        travel_days: data.travel_days,
        active: true,
      };

      const { data: route, error: routeError } = await supabase
        .from('routes')
        .insert(routeData)
        .select()
        .single();

      if (routeError) throw routeError;

      // Create vehicle entry if has vehicle
      if (data.has_vehicle === 'Yes') {
        const vehicleData = {
          user_id: userData.user.id,
          type: data.vehicle_type,
          seats: data.seats ? parseInt(data.seats) : null,
          has_vehicle: true,
        };

        const { error: vehicleError } = await supabase
          .from('vehicles')
          .insert(vehicleData);

        if (vehicleError) throw vehicleError;
      }

      return { data: profile, success: true };
    } catch (error) {
      console.error('Error creating profile:', error);
      return { data: null, success: false, message: error instanceof Error ? error.message : 'Failed to create profile' };
    }
  },

  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, success: true };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { data: null, success: false, message: 'Failed to fetch profile' };
    }
  },

  async updateProfile(userId: string, data: Partial<Profile>) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data: profile, success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, success: false, message: 'Failed to update profile' };
    }
  },

  async getAllProfiles() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          routes!inner(
            from_address,
            to_address,
            from_lat,
            from_lng,
            to_lat,
            to_lng,
            morning_time,
            evening_connect,
            evening_time,
            travel_frequency,
            travel_days,
            active
          ),
          vehicles(
            type,
            seats,
            has_vehicle
          )
        `)
        .eq('routes.active', true);

      if (error) throw error;
      return { data, success: true };
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return { data: [], success: false, message: 'Failed to fetch profiles' };
    }
  }
};

export const supabaseSearchService = {
  async getAllProfiles() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          routes!inner(
            from_address,
            to_address,
            from_lat,
            from_lng,
            to_lat,
            to_lng,
            morning_time,
            evening_connect,
            evening_time,
            travel_frequency,
            travel_days,
            active
          ),
          vehicles(
            type,
            seats,
            has_vehicle
          )
        `)
        .eq('routes.active', true);

      if (error) throw error;
      
      // Transform to match Listing interface
      const transformedData = data.map((profile: any) => ({
        id: profile.id,
        name: profile.name,
        gender: profile.gender,
        from: profile.routes.from_address,
        to: profile.routes.to_address,
        from_lat: profile.routes.from_lat,
        from_lng: profile.routes.from_lng,
        to_lat: profile.routes.to_lat,
        to_lng: profile.routes.to_lng,
        has_vehicle: profile.vehicles?.has_vehicle ? 'Yes' : 'No',
        vehicle_type: profile.vehicles?.type,
        seats: profile.vehicles?.seats?.toString(),
        morning_time: profile.routes.morning_time,
        evening_connect: profile.routes.evening_connect ? 'Yes' : 'No',
        evening_time: profile.routes.evening_time,
        message: profile.message,
        travel_days: profile.routes.travel_days?.join(',') || '',
        college_office: profile.college_office,
        rating: profile.rating,
        totalRides: profile.total_rides,
        verified: profile.verified,
      }));

      return { data: transformedData, success: true };
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return { data: [], success: false, message: 'Failed to fetch profiles' };
    }
  },

  async searchProfiles(filters: SearchFilters) {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          routes!inner(
            from_address,
            to_address,
            from_lat,
            from_lng,
            to_lat,
            to_lng,
            morning_time,
            evening_connect,
            evening_time,
            travel_frequency,
            travel_days,
            active
          ),
          vehicles(
            type,
            seats,
            has_vehicle
          )
        `)
        .eq('routes.active', true);

      // Apply college/office filter if specified
      if (filters.wantCollegeMatch && filters.collegeOffice) {
        query = query.ilike('college_office', `%${filters.collegeOffice}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform and score profiles
      const matchResults: MatchResult[] = data.map((profile: any) => {
        let score = 0;
        let matchType = "Other";

        // Basic scoring logic (you can enhance this)
        if (filters.from && profile.routes.from_address.toLowerCase().includes(filters.from.toLowerCase())) {
          score += 30;
          matchType = "Route Match";
        }
        
        if (filters.to && profile.routes.to_address.toLowerCase().includes(filters.to.toLowerCase())) {
          score += 30;
        }

        if (filters.wantCollegeMatch && filters.collegeOffice && 
            profile.college_office && 
            profile.college_office.toLowerCase().includes(filters.collegeOffice.toLowerCase())) {
          score += 50;
          matchType = "🏢 Same college/office";
        }

        const matchPercentage = Math.min(95, Math.max(60, score));

        return {
          profile: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            gender: profile.gender,
            college_office: profile.college_office,
            verified: profile.verified,
            rating: profile.rating,
            totalRides: profile.total_rides,
            createdAt: profile.created_at,
            route: {
              id: profile.routes.id,
              userId: profile.user_id,
              from: profile.routes.from_address,
              to: profile.routes.to_address,
              from_lat: profile.routes.from_lat,
              from_lng: profile.routes.from_lng,
              to_lat: profile.routes.to_lat,
              to_lng: profile.routes.to_lng,
              morning_time: profile.routes.morning_time,
              evening_connect: profile.routes.evening_connect ? 'Yes' : 'No',
              evening_time: profile.routes.evening_time,
              travel_frequency: profile.routes.travel_frequency,
              travel_days: profile.routes.travel_days || [],
              active: profile.routes.active
            },
            vehicle: {
              type: profile.vehicles?.type || '',
              seats: profile.vehicles?.seats,
              hasVehicle: profile.vehicles?.has_vehicle ? 'Yes' : 'No'
            },
            message: profile.message
          },
          score,
          matchType,
          matchPercentage
        };
      });

      // Sort by score
      matchResults.sort((a, b) => b.score - a.score);

      return { data: matchResults, success: true };
    } catch (error) {
      console.error('Error searching profiles:', error);
      return { data: [], success: false, message: 'Search failed' };
    }
  }
};

export const supabasePaymentService = {
  async createPaymentRecord(userId: string, amount: number, planType: string) {
    try {
      const unlocks = planType === 'single' ? 1 : planType === 'weekly' ? 70 : 'unlimited';
      
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          amount,
          currency: 'INR',
          status: 'pending',
          plan_type: planType,
          unlocks_remaining: unlocks,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, success: true };
    } catch (error) {
      console.error('Error creating payment record:', error);
      return { data: null, success: false, message: 'Failed to create payment record' };
    }
  },

  async updatePaymentStatus(paymentId: string, status: string, razorpayPaymentId?: string) {
    try {
      const updateData: any = { status };
      if (razorpayPaymentId) {
        updateData.razorpay_payment_id = razorpayPaymentId;
      }

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;
      return { data, success: true };
    } catch (error) {
      console.error('Error updating payment status:', error);
      return { data: null, success: false, message: 'Failed to update payment status' };
    }
  },

  async getUserCredits(userId: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('plan_type, unlocks_remaining, created_at')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        return {
          data: {
            credits: data.unlocks_remaining === 'unlimited' ? 'unlimited' : data.unlocks_remaining,
            plan: data.plan_type
          },
          success: true
        };
      }

      return { data: { credits: 0, plan: 'free' }, success: true };
    } catch (error) {
      console.error('Error fetching user credits:', error);
      return { data: { credits: 0, plan: 'free' }, success: false };
    }
  }
};
