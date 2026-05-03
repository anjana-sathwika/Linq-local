# Supabase Setup Guide for LinQ

## 1. Create Supabase Project
1. Go to https://supabase.com
2. Sign up/login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project name: `linq-commute`
6. Set database password (save it securely)
7. Choose region closest to your users (likely Mumbai or Singapore)
8. Click "Create new project"

## 2. Get Project Credentials
Once project is created:
1. Go to Project Settings → API
2. Copy the Project URL
3. Copy the anon public key

## 3. Set Environment Variables
Create/update `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Razorpay Configuration (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Google OAuth (for Google Sign-In)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 4. Configure Google OAuth in Supabase
1. Go to Supabase Project → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID from Google Cloud Console
   - Client Secret from Google Cloud Console
4. Add authorized redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`

## 5. Google Cloud Console Setup
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Go to APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Add authorized redirect: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret

## 6. Database Schema Setup
Run these SQL commands in Supabase SQL Editor:

```sql
-- Users table (extends auth.users)
CREATE TABLE public.profiles (
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
CREATE TABLE public.routes (
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
CREATE TABLE public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT,
  seats INTEGER,
  has_vehicle BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table
CREATE TABLE public.matches (
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
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  plan_type TEXT, -- 'single', 'weekly', 'monthly'
  unlocks_remaining INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id),
  receiver_id UUID REFERENCES public.profiles(id),
  content TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
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

-- Create indexes for better performance
CREATE INDEX ON profiles(college_office);
CREATE INDEX ON routes(from_lat, from_lng);
CREATE INDEX ON routes(to_lat, to_lng);
CREATE INDEX ON routes(user_id);
CREATE INDEX ON matches(user_id);
CREATE INDEX ON matches(matched_user_id);
CREATE INDEX ON payments(user_id);
CREATE INDEX ON messages(sender_id);
CREATE INDEX ON messages(receiver_id);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_routes_updated_at
  BEFORE UPDATE ON public.routes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## 7. Test the Connection
After setting up environment variables, restart your dev server and test the authentication flow.

## Next Steps
Once Supabase is set up, I'll help you:
1. Implement Google Sign-In component
2. Create authentication context
3. Update existing services to use Supabase
4. Integrate Razorpay payments
5. Connect all components to the database
