'use client';

import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Building,
  FileCheck,
  ShieldCheck,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { AdminDataStore, DealerApplication } from '../services/adminDataStore';

export const DealersView: React.FC = () => {
  const [dealers, setDealers] = useState<DealerApplication[]>(() => AdminDataStore.getDealers());
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const refresh = () => setDealers([...AdminDataStore.getDealers()]);

  const handleUpdate = (id: string, status: 'approved' | 'rejected') => {
    AdminDataStore.updateDealerStatus(id, status);
    refresh();
  };

  const filtered = dealers.filter(d => (filter === 'all' ? true : d.status === filter));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Dealer B2B Approvals & Network</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review wholesale dealer GST credentials, approve verified regional distributors, and manage credit tiers.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab} ({tab === 'all' ? dealers.length : dealers.filter(d => d.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Dealers Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(dealer => (
          <div
            key={dealer.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm space-y-4"
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">{dealer.businessName}</h3>
                  <p className="text-xs text-slate-400">Proprietor: {dealer.contactPerson}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                  dealer.status === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : dealer.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {dealer.status}
              </span>
            </div>

            {/* Credential Data Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">GSTIN Registration</span>
                <span className="font-mono text-cyan-400 font-bold">{dealer.gstNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Annual Turnover</span>
                <span className="text-white font-semibold">{dealer.annualTurnover || '₹30+ Lakhs'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Location Hub</span>
                <span className="text-slate-200">{dealer.city}, {dealer.state}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Application ID</span>
                <span className="text-slate-400 font-mono">{dealer.id}</span>
              </div>
            </div>

            {/* Contact details */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {dealer.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {dealer.phone}
              </span>
            </div>

            {/* Decision Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              {dealer.status !== 'approved' && (
                <button
                  onClick={() => handleUpdate(dealer.id, 'approved')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Approve Wholesale Access</span>
                </button>
              )}

              {dealer.status !== 'rejected' && (
                <button
                  onClick={() => handleUpdate(dealer.id, 'rejected')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Application</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
