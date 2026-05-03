"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminService } from "@/lib/services";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminService.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2F5EEA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-2xl font-bold text-[#2F5EEA]">
                LinQ Admin
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/admin" className="text-[#2F5EEA] font-medium">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-[#2F5EEA] transition">
                  Users
                </Link>
                <Link href="/admin/reports" className="text-gray-600 hover:text-[#2F5EEA] transition">
                  Reports
                </Link>
              </nav>
            </div>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Monitor your platform performance and user activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-medium">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.totalUsers?.toLocaleString() || '34,567'}
            </div>
            <div className="text-gray-600 text-sm">Total Users</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-medium">+8%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.activeUsers?.toLocaleString() || '8,234'}
            </div>
            <div className="text-gray-600 text-sm">Active Users</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-medium">+15%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.totalSearches?.toLocaleString() || '125,432'}
            </div>
            <div className="text-gray-600 text-sm">Total Searches</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-medium">+23%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ₹{stats?.revenue?.toLocaleString() || '234,567'}
            </div>
            <div className="text-gray-600 text-sm">Revenue</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
              <p className="text-gray-500">Chart placeholder - User growth over time</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
              <p className="text-gray-500">Chart placeholder - Revenue breakdown</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { user: 'Priya Sharma', action: 'Completed ride with', target: 'Rahul Kumar', time: '2 hours ago' },
              { user: 'Anjali Reddy', action: 'Unlocked profile of', target: 'Vikram Singh', time: '3 hours ago' },
              { user: 'Mohammed Ali', action: 'Updated route to', target: 'Hitech City', time: '5 hours ago' },
              { user: 'Sneha Patel', action: 'Subscribed to', target: 'Monthly Pass', time: '6 hours ago' },
            ].map((activity: any, index: number) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
