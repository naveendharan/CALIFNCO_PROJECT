'use client';

import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Wrench,
  PackageCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { AdminDataStore } from '../services/adminDataStore';

export const AnalyticsView: React.FC = () => {
  const analytics = AdminDataStore.getAnalytics();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-time Live Operation Metrics</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Califnco Enterprise Operations Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Monitor real-time retail customer sales, dealer bulk orders, technician field dispatches, and inventory flow across India.
          </p>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Gross Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ₹{analytics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center text-xs text-emerald-400 font-semibold gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% vs last month</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
            <span>Wholesale: ₹{analytics.dealerRevenue.toLocaleString('en-IN')}</span>
            <span>Retail: ₹{analytics.retailRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Orders</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {analytics.totalOrders}
          </div>
          <div className="mt-2 flex items-center text-xs text-amber-400 font-semibold gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{analytics.pendingOrders} Orders need fulfillment</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
            <span>Razorpay Test Verified</span>
            <span className="text-emerald-400">100% Paid</span>
          </div>
        </div>

        {/* Dealer Network */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wholesale Network</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {analytics.approvedDealers}
          </div>
          <div className="mt-2 flex items-center text-xs text-cyan-400 font-semibold gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{analytics.pendingDealers} applications pending review</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
            <span>Tier 1 Distributors</span>
            <span className="text-cyan-400">Gold Certified</span>
          </div>
        </div>

        {/* Service Desk */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Tickets</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {analytics.totalTickets}
          </div>
          <div className="mt-2 flex items-center text-xs text-rose-400 font-semibold gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{analytics.pendingTickets} unassigned ticket</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
            <span>Doorstep SLA</span>
            <span className="text-emerald-400">&lt; 24 Hours</span>
          </div>
        </div>
      </div>

      {/* Operational Highlights & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Mix Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-cyan-400" />
            Revenue Breakdown: Retail vs Wholesale Bulk
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Dealer Wholesale Orders (B2B Bulk)</span>
                <span className="text-emerald-400">
                  ₹{analytics.dealerRevenue.toLocaleString('en-IN')} (
                  {Math.round((analytics.dealerRevenue / (analytics.totalRevenue || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((analytics.dealerRevenue / (analytics.totalRevenue || 1)) * 100)}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Retail Customer Orders (Direct D2C)</span>
                <span className="text-cyan-400">
                  ₹{analytics.retailRevenue.toLocaleString('en-IN')} (
                  {Math.round((analytics.retailRevenue / (analytics.totalRevenue || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((analytics.retailRevenue / (analytics.totalRevenue || 1)) * 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Catalog & Inventory Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-cyan-400" />
            Catalog & Manufacturing Status
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400">SKU Count</span>
              <p className="text-lg font-black text-white mt-1">{analytics.totalCatalogItems} Products</p>
              <span className="text-[10px] text-cyan-400">7 Water Tech Categories</span>
            </div>
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400">Avg Wholesale Margin</span>
              <p className="text-lg font-black text-emerald-400 mt-1">38.4%</p>
              <span className="text-[10px] text-slate-400">Guaranteed Dealer Profit</span>
            </div>
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400">Payment Gateway</span>
              <p className="text-lg font-black text-white mt-1">Razorpay</p>
              <span className="text-[10px] text-amber-400">Test Mode (Zero KYC)</span>
            </div>
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400">Mapping API</span>
              <p className="text-lg font-black text-white mt-1">OpenStreetMap</p>
              <span className="text-[10px] text-emerald-400">Zero Cost / Free Tier</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
