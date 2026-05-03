"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError('Authentication failed. Please try again.');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        if (data.session) {
          // Successfully authenticated
          router.push('/profile');
        } else {
          // No session, redirect to home
          router.push('/');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An error occurred during authentication.');
        setTimeout(() => router.push('/'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
      <div className="text-center">
        {loading ? (
          <>
            <div className="w-16 h-16 border-4 border-[#2F5EEA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Completing Sign In...</h2>
            <p className="text-gray-600">Please wait while we set up your account</p>
          </>
        ) : error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
