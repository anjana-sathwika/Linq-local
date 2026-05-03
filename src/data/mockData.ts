// Mock data for development and testing

import { PricingPlan, Profile, MatchResult } from '@/types';

export const mockPricingPlans: PricingPlan[] = [
  {
    id: 'single',
    name: 'Single Unlock',
    price: 2,
    duration: 'One-time',
    features: [
      'Unlock 1 profile',
      'View contact details',
      'Send message',
      'Valid for 24 hours'
    ],
    unlocks: 1
  },
  {
    id: 'weekly',
    name: 'Weekly Pass',
    price: 12,
    duration: '7 days',
    features: [
      '10 unlocks per day',
      'Unlimited messaging',
      'Priority support',
      'Advanced filters'
    ],
    popular: true,
    unlocks: 70
  },
  {
    id: 'monthly',
    name: 'Monthly Pass',
    price: 29,
    duration: '30 days',
    features: [
      'Unlimited unlocks',
      'Premium badge',
      'Verified profile',
      'Early access to features'
    ],
    unlocks: 'unlimited'
  }
];

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543210',
    gender: 'Female',
    college_office: 'IIIT Hyderabad',
    verified: true,
    rating: 4.8,
    totalRides: 47,
    createdAt: '2024-01-15T10:30:00Z',
    route: {
      id: '1',
      userId: '1',
      from: 'Nagole',
      to: 'Ghatkesar',
      from_lat: 17.3952,
      from_lng: 78.5432,
      to_lat: 17.3897,
      to_lng: 78.5623,
      morning_time: '08:30',
      evening_connect: 'Yes',
      evening_time: '18:00',
      travel_frequency: 'Monday to Friday',
      travel_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      active: true
    },
    vehicle: {
      type: 'Car',
      seats: 3,
      hasVehicle: 'Yes'
    },
    message: 'Looking for reliable ride partners for daily commute. Punctual and friendly!'
  },
  {
    id: '2',
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    phone: '9876543211',
    gender: 'Male',
    college_office: 'TCS Gachibowli',
    verified: true,
    rating: 4.6,
    totalRides: 32,
    createdAt: '2024-02-20T14:15:00Z',
    route: {
      id: '2',
      userId: '2',
      from: 'Uppal',
      to: 'Yamnampet',
      from_lat: 17.4052,
      from_lng: 78.5532,
      to_lat: 17.3997,
      to_lng: 78.5723,
      morning_time: '09:00',
      evening_connect: 'Yes',
      evening_time: '19:30',
      travel_frequency: 'Monday to Friday',
      travel_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      active: true
    },
    vehicle: {
      type: 'Bike',
      seats: 1,
      hasVehicle: 'Yes'
    },
    message: 'Daily commuter, prefer consistent timing. Safe driver with 5 years experience.'
  },
  {
    id: '3',
    name: 'Anjali Reddy',
    email: 'anjali@example.com',
    phone: '9876543212',
    gender: 'Female',
    college_office: 'University of Hyderabad',
    verified: false,
    rating: 4.9,
    totalRides: 28,
    createdAt: '2024-03-10T09:45:00Z',
    route: {
      id: '3',
      userId: '3',
      from: 'Kukatpally',
      to: 'Hitech City',
      from_lat: 17.4852,
      from_lng: 78.4232,
      to_lat: 17.4497,
      to_lng: 78.3823,
      morning_time: '08:45',
      evening_connect: 'No',
      evening_time: '',
      travel_frequency: 'Daily',
      travel_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      active: true
    },
    vehicle: {
      type: '',
      seats: undefined,
      hasVehicle: 'No'
    },
    message: 'Student looking for cost-effective commute options. Flexible with timing.'
  }
];

export const mockMatchResults: MatchResult[] = mockProfiles.map(profile => ({
  profile,
  score: Math.floor(Math.random() * 50) + 50,
  matchType: ['Great Match', 'Good Match', 'Partial Match'][Math.floor(Math.random() * 3)],
  matchPercentage: Math.floor(Math.random() * 30) + 70
}));
