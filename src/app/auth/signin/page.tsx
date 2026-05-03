"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

export default function SignInPage() {
  const { loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2F5EEA] mb-2">LinQ</h1>
            <p className="text-gray-600">Link your commute, split your costs</p>
          </div>

          {/* Sign In Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-center">
                Sign in to find your commute matches
              </p>
            </div>

            {/* Google Sign In */}
            <div className="space-y-4">
              <GoogleSignInButton />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with email</span>
                </div>
              </div>
            </div>

            {/* Email Sign In (placeholder) */}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5EEA] focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading || isSigningIn}
                className="w-full bg-[#2F5EEA] text-white font-semibold py-3 rounded-xl hover:bg-[#1E3FAE] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-[#2F5EEA] font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-[#2F5EEA] transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
