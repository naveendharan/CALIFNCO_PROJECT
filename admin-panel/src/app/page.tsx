'use client';

import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AnalyticsView } from '../components/AnalyticsView';
import { OrdersView } from '../components/OrdersView';
import { DealersView } from '../components/DealersView';
import { ServiceDeskView } from '../components/ServiceDeskView';
import { InventoryView } from '../components/InventoryView';
import { AdminDataStore } from '../services/adminDataStore';
import { Bell, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'dealers' | 'services' | 'inventory'>('analytics');
  const [lastRefreshed, setLastRefreshed] = useState<string>('Live Synced');

  React.useEffect(() => {
    setLastRefreshed(new Date().toLocaleTimeString());
  }, []);

  const analytics = AdminDataStore.getAnalytics();

  const handleManualRefresh = () => {
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={analytics.pendingOrders}
        pendingDealersCount={analytics.pendingDealers}
        pendingServicesCount={analytics.pendingTickets}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operational Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              CALIFNCO OPERATIONS CONSOLE
            </span>
            <span className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firebase Spark Synced</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleManualRefresh}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/80 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lastRefreshed}</span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-extrabold text-xs">
                OP
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-bold text-white block">Operations Head</span>
                <span className="text-[10px] text-slate-400 block">admin@califnco.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* View Switcher Container */}
        <div className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'orders' && <OrdersView />}
          {activeTab === 'dealers' && <DealersView />}
          {activeTab === 'services' && <ServiceDeskView />}
          {activeTab === 'inventory' && <InventoryView />}
        </div>
      </main>
    </div>
  );
}
