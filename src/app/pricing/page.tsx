"use client";

import { useState } from "react";
import Link from "next/link";
import { mockPricingPlans } from "@/data/mockData";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'weekly'>('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-[#2F5EEA]">
              LinQ
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-[#2F5EEA] transition">
                Home
              </Link>
              <Link href="/pricing" className="text-[#2F5EEA] font-medium">
                Pricing
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-[#2F5EEA] transition">
                Profile
              </Link>
            </nav>
            <Link href="/connect/new">
              <button className="bg-[#2F5EEA] text-white px-6 py-2 rounded-full font-medium hover:bg-[#1E3FAE] transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Simple, Fair Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Choose the plan that works for your commute needs. 
          Unlock connections and start saving money today.
        </p>
        
        <div className="flex items-center justify-center gap-4 bg-gray-100 p-1 rounded-full w-fit mx-auto">
          <button
            onClick={() => setBillingCycle('weekly')}
            className={`px-6 py-2 rounded-full transition ${
              billingCycle === 'weekly' 
                ? 'bg-white text-[#2F5EEA] shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full transition ${
              billingCycle === 'monthly' 
                ? 'bg-white text-[#2F5EEA] shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {mockPricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.popular 
                  ? 'ring-2 ring-[#2F5EEA] scale-105' 
                  : 'hover:scale-102'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#2F5EEA] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-[#2F5EEA]">₹{plan.price}</span>
                  <span className="text-gray-500 ml-2">/{plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-full font-medium transition ${
                  plan.popular
                    ? 'bg-[#2F5EEA] text-white hover:bg-[#1E3FAE]'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.id === 'single' ? 'Unlock Profile' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 text-left shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">How does matching work?</h3>
              <p className="text-gray-600 text-sm">
                We find people traveling on overlapping routes. No exact same pickup needed - just smart matching for shared savings.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-left shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can cancel your subscription anytime. No hidden fees or long-term commitments.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-left shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Is my payment secure?</h3>
              <p className="text-gray-600 text-sm">
                We use industry-standard encryption and secure payment gateways. Your financial information is always protected.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-left shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">What if I don't find matches?</h3>
              <p className="text-gray-600 text-sm">
                Our growing community ensures high match rates. Plus, you can expand your search radius for more options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
