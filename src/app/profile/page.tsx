"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseProfileService } from "@/lib/supabaseServices";

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      setSigningOut(false);
    }
  };
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    gender: '' | 'Male' | 'Female' | 'Other';
    college_office: string;
    message: string;
  }>({
    name: '',
    phone: '',
    gender: '',
    college_office: '',
    message: '',
  });
  const [routeData, setRouteData] = useState<{
    from: string;
    to: string;
    morning_time: string;
    evening_connect: boolean;
    evening_time: string;
    travel_days: string[];
    has_vehicle: boolean;
    vehicle_type: string;
    seats: string;
  }>({
    from: '',
    to: '',
    morning_time: '',
    evening_connect: false,
    evening_time: '',
    travel_days: [],
    has_vehicle: false,
    vehicle_type: '',
    seats: '',
  });
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        gender: profile.gender || '',
        college_office: profile.college_office || '',
        message: profile.message || '',
      });
      if (profile.route) {
        setRouteData({
          from: profile.route.from || '',
          to: profile.route.to || '',
          morning_time: profile.route.morning_time || '',
          evening_connect: profile.route.evening_connect === 'Yes',
          evening_time: profile.route.evening_time || '',
          travel_days: profile.route.travel_days || [],
          has_vehicle: profile.vehicle?.hasVehicle === 'Yes',
          vehicle_type: profile.vehicle?.type || '',
          seats: profile.vehicle?.seats?.toString() || '',
        });
      }
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    setSaveMessage('');
    
    try {
      // Update profile with proper typing
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender || undefined,
        college_office: formData.college_office,
        message: formData.message,
      };
      
      await updateProfile(profileData);
      
      setSaveMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTravelDayToggle = (day: string) => {
    setRouteData(prev => ({
      ...prev,
      travel_days: prev.travel_days.includes(day)
        ? prev.travel_days.filter(d => d !== day)
        : [...prev.travel_days, day]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header - Consistent with main site */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-[#2F5EEA]">
              LinQ
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-[#2F5EEA] transition">
                Home
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-[#2F5EEA] transition">
                Pricing
              </Link>
              <Link href="/profile" className="text-[#2F5EEA] font-medium">
                Profile
              </Link>
            </nav>
            <button 
              onClick={handleSignOut}
              disabled={signingOut}
              className="bg-[#2F5EEA] text-white px-6 py-2 rounded-full font-medium hover:bg-[#1E3FAE] transition disabled:opacity-50"
            >
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#2F5EEA] to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile?.name || 'Loading...'}</h1>
                <p className="text-gray-600 mt-1">{profile?.email || user?.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium">{profile?.rating || '0.0'}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{profile?.totalRides || 0} rides</span>
                  {profile?.verified && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        ✓ Verified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-[#2F5EEA] to-teal-600 text-white px-6 py-3 rounded-full font-medium hover:from-[#1E3FAE] hover:to-teal-700 transition shadow-lg"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Form */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value as '' | 'Male' | 'Female' | 'Other'})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent disabled:bg-gray-50"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College/Office</label>
              <input
                type="text"
                value={formData.college_office}
                onChange={(e) => setFormData({...formData, college_office: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter your college or office name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent disabled:bg-gray-50"
                placeholder="Tell others about yourself"
              />
            </div>
          </div>

          {saveMessage && (
            <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
              saveMessage.includes('success') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {saveMessage}
            </div>
          )}
        
          {isEditing && (
            <div className="mt-6 flex gap-4">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-[#2F5EEA] to-teal-600 text-white px-6 py-3 rounded-full font-medium hover:from-[#1E3FAE] hover:to-teal-700 transition shadow-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Route Information */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Commute Route</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                type="text"
                value={routeData.from}
                onChange={(e) => setRouteData({...routeData, from: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter pickup location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="text"
                value={routeData.to}
                onChange={(e) => setRouteData({...routeData, to: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter destination"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Morning Time</label>
              <input
                type="time"
                value={routeData.morning_time}
                onChange={(e) => setRouteData({...routeData, morning_time: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Evening Return</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={routeData.evening_connect}
                    onChange={(e) => setRouteData({...routeData, evening_connect: e.target.checked})}
                    disabled={!isEditing}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Available for return journey</span>
                </label>
                {routeData.evening_connect && (
                  <input
                    type="time"
                    value={routeData.evening_time}
                    onChange={(e) => setRouteData({...routeData, evening_time: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent disabled:bg-gray-50"
                  />
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel Days</label>
              <div className="flex gap-3 flex-wrap">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={routeData.travel_days.includes(day)}
                      onChange={() => handleTravelDayToggle(day)}
                      disabled={!isEditing}
                      className="mr-2 w-4 h-4 text-[#2F5EEA] focus:ring-[#2F5EEA]"
                    />
                    <span className="text-sm font-medium">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={routeData.has_vehicle}
                    onChange={(e) => setRouteData({...routeData, has_vehicle: e.target.checked})}
                    disabled={!isEditing}
                    className="mr-2 w-4 h-4 text-[#2F5EEA] focus:ring-[#2F5EEA]"
                  />
                  <span className="text-sm font-medium">I have a vehicle and can offer rides</span>
                </label>
                {routeData.has_vehicle && (
                  <div className="flex gap-4">
                    <select
                      value={routeData.vehicle_type}
                      onChange={(e) => setRouteData({...routeData, vehicle_type: e.target.value})}
                      disabled={!isEditing}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Auto">Auto Rickshaw</option>
                    </select>
                    <input
                      type="number"
                      value={routeData.seats}
                      onChange={(e) => setRouteData({...routeData, seats: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Seats"
                      min="1"
                      max="6"
                      className="w-24 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center shadow-sm border border-blue-200">
            <div className="text-3xl font-bold text-[#2F5EEA] mb-2">{profile?.totalRides || 0}</div>
            <div className="text-gray-700 text-sm font-medium">Total Rides</div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 text-center shadow-sm border border-teal-200">
            <div className="text-3xl font-bold text-teal-600 mb-2">{profile?.rating || '0.0'}</div>
            <div className="text-gray-700 text-sm font-medium">Average Rating</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center shadow-sm border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">₹{(profile?.totalRides || 0) * 50}</div>
            <div className="text-gray-700 text-sm font-medium">Money Saved</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center shadow-sm border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">{(profile?.totalRides || 0) * 15}</div>
            <div className="text-gray-700 text-sm font-medium">KM Shared</div>
          </div>
        </div>
      </div>
    </div>
  );
}
