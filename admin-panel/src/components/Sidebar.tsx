'use client';

import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Wrench,
  Boxes,
  ExternalLink,
  ShieldCheck,
  Droplets
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'analytics' | 'orders' | 'dealers' | 'services' | 'inventory';
  setActiveTab: (tab: 'analytics' | 'orders' | 'dealers' | 'services' | 'inventory') => void;
  pendingOrdersCount: number;
  pendingDealersCount: number;
  pendingServicesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingOrdersCount,
  pendingDealersCount,
  pendingServicesCount
}) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 text-white select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Droplets className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-wider text-white">CALIFNCO</h1>
          <p className="text-[10px] font-semibold tracking-wider text-cyan-400 uppercase">
            Operations & Admin Suite
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'analytics'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <LayoutDashboard className="w-4 h-4" />
            <span>Live Analytics</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'orders'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-4 h-4" />
            <span>Manage Orders</span>
          </div>
          {pendingOrdersCount > 0 && (
            <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('dealers')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'dealers'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Users className="w-4 h-4" />
            <span>Dealer Approvals</span>
          </div>
          {pendingDealersCount > 0 && (
            <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingDealersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'services'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Wrench className="w-4 h-4" />
            <span>Service Desk</span>
          </div>
          {pendingServicesCount > 0 && (
            <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingServicesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'inventory'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Boxes className="w-4 h-4" />
            <span>50+ Item Inventory</span>
          </div>
        </button>
      </nav>

      {/* Deployment & Spark Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            Vercel Ready
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          Deploy to Vercel with zero config. Firebase Spark plan connected.
        </p>
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
          <span>Version 1.0.0</span>
          <span className="text-cyan-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3 h-3" /> Admin Auth
          </span>
        </div>
      </div>
    </aside>
  );
};
