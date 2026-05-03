# Quick Supabase Setup for LinQ

## Step 1: Create Supabase Project (2 minutes)
1. Go to https://supabase.com
2. Click "New Project"
3. Name: `linq-commute`
4. Database password: `Linq@2024` (save this)
5. Region: Mumbai (closest to India)
6. Click "Create new project"

## Step 2: Get Credentials (30 seconds)
1. After project creation, go to Project Settings → API
2. Copy these two values:
   - Project URL: `https://kxhzxjfiwtjcpfklomva.supabase.co`
   - Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4aHp4amZpd3RqY3Bma2xvbXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDExOTMsImV4cCI6MjA5MzI3NzE5M30.KQfEP-AKKeYfeow4qg8BB6ZbDnf9iuxmIXPHuSLOqME`

## Step 3: Set Up Google OAuth (3 minutes)
1. In Supabase: Authentication → Providers → Google
2. Enable Google provider
3. Go to https://console.cloud.google.com
4. Create new project or use existing
5. APIs & Services → Credentials → Create OAuth 2.0 Client ID
6. Application type: Web application
7. Authorized redirect URI: `https://kxhzxjfiwtjcpfklomva.supabase.co/auth/v1/callback`
8. Copy Client ID and Client Secret to Supabase

## Step 4: Run Database Schema (1 minute)
1. In Supabase: SQL Editor
2. Copy and paste this entire SQL script:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  gender TEXT,
  college_office TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routes table
CREATE TABLE IF NOT EXISTS public.routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  from_lat DECIMAL(10,8),
  from_lng DECIMAL(11,8),
  to_lat DECIMAL(10,8),
  to_lng DECIMAL(11,8),
  morning_time TIME,
  evening_connect BOOLEAN DEFAULT false,
  evening_time TIME,
  travel_frequency TEXT,
  travel_days TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT,
  seats INTEGER,
  has_vehicle BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  matched_user_id UUID REFERENCES public.profiles(id),
  score INTEGER,
  match_type TEXT,
  match_percentage INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  plan_type TEXT,
  unlocks_remaining INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id),
  receiver_id UUID REFERENCES public.profiles(id),
  content TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Routes RLS policies
CREATE POLICY "Users can view all routes" ON public.routes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own routes" ON public.routes
  FOR ALL USING (auth.uid() = user_id);

-- Payments RLS policies
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages RLS policies
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS ON profiles(college_office);
CREATE INDEX IF NOT EXISTS ON routes(from_lat, from_lng);
CREATE INDEX IF NOT EXISTS ON routes(to_lat, to_lng);
CREATE INDEX IF NOT EXISTS ON routes(user_id);
CREATE INDEX IF NOT EXISTS ON matches(user_id);
CREATE INDEX IF NOT EXISTS ON matches(matched_user_id);
CREATE INDEX IF NOT EXISTS ON payments(user_id);
CREATE INDEX IF NOT EXISTS ON messages(sender_id);
CREATE INDEX IF NOT EXISTS ON messages(receiver_id);
```

## Step 5: Test Google OAuth (2 minutes)
1. Click "Run" to execute the SQL
2. Go to Authentication → Providers → Google
3. Test the OAuth flow with your Google account

## That's it! Your Supabase is ready.

The app will automatically:
- Create user profiles on first sign-in
- Store routes and preferences
- Handle payments and messages
- Manage all data securely

## If you want me to help:
- Share your screen and I'll guide you step-by-step
- Or tell me which step you need help with
- I can also create a video walkthrough if needed

The entire setup takes less than 10 minutes!
