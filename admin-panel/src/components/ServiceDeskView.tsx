'use client';

import React, { useState } from 'react';
import {
  Wrench,
  UserCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Droplet,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AdminDataStore, ServiceTicket } from '../services/adminDataStore';

export const ServiceDeskView: React.FC = () => {
  const [tickets, setTickets] = useState<ServiceTicket[]>(() => AdminDataStore.getServices());
  const [filter, setFilter] = useState<'all' | ServiceTicket['status']>('all');
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [techName, setTechName] = useState('Suresh Kumar (Senior Water Tech)');
  const [techPhone, setTechPhone] = useState('+91 98111 22334');

  const refresh = () => setTickets([...AdminDataStore.getServices()]);

  const handleAssign = (ticketId: string) => {
    AdminDataStore.assignTechnician(ticketId, techName, techPhone);
    setAssigningId(null);
    refresh();
  };

  const handleUpdateStatus = (ticketId: string, status: ServiceTicket['status']) => {
    AdminDataStore.updateServiceStatus(ticketId, status);
    refresh();
  };

  const filtered = tickets.filter(t => (filter === 'all' ? true : t.status === filter));

  const getStatusBadge = (status: ServiceTicket['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'In Progress':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Assigned':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Service Desk & Field Technician Dispatch</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch certified service technicians for domestic RO installations, filter replacements, and breakdown repairs.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'Pending', 'Assigned', 'In Progress', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === tab
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab} ({tab === 'all' ? tickets.length : tickets.filter(t => t.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(ticket => (
          <div
            key={ticket.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm">{ticket.id}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <h3 className="font-bold text-cyan-400 text-sm mt-1">{ticket.serviceType}</h3>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  {ticket.preferredDate}
                </span>
                <span className="text-slate-500">{ticket.preferredTimeSlot.split(' ')[0]}</span>
              </div>
            </div>

            {/* Customer & Technical Details */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Customer</span>
                <span className="text-white font-bold">{ticket.customerName}</span>
                <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> {ticket.phone}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Water Profile</span>
                <span className="text-slate-200">{ticket.waterSource}</span>
                <p className="text-amber-400 font-semibold mt-0.5">
                  Raw TDS: {ticket.currentTds || 500} PPM
                </p>
              </div>

              <div className="col-span-2 pt-1 border-t border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase">Purifier Model</span>
                <span className="text-slate-200">{ticket.purifierModel}</span>
              </div>

              {ticket.notes && (
                <div className="col-span-2 text-[11px] text-amber-200/80 italic">
                  Note: "{ticket.notes}"
                </div>
              )}
            </div>

            {/* Address */}
            <p className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>{ticket.address}</span>
            </p>

            {/* Technician Info */}
            {ticket.technicianName && (
              <div className="flex items-center justify-between bg-cyan-950/30 border border-cyan-800/40 p-2.5 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-bold text-white block">{ticket.technicianName}</span>
                    <span className="text-[11px] text-cyan-300">Contact: {ticket.technicianPhone}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-md">
                  DISPATCHED
                </span>
              </div>
            )}

            {/* Technician Assignment Form Drawer */}
            {assigningId === ticket.id && (
              <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/30 space-y-2 text-xs">
                <span className="font-bold text-white block">Assign Certified Technician</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={techName}
                    onChange={e => setTechName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    placeholder="Technician Name"
                  />
                  <input
                    type="text"
                    value={techPhone}
                    onChange={e => setTechPhone(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    placeholder="Phone"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setAssigningId(null)}
                    className="px-2.5 py-1 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAssign(ticket.id)}
                    className="px-3 py-1 bg-cyan-500 text-white rounded-lg font-bold"
                  >
                    Confirm Dispatch
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-800">
              {ticket.status === 'Pending' && assigningId !== ticket.id && (
                <button
                  onClick={() => setAssigningId(ticket.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Assign Technician</span>
                </button>
              )}

              {ticket.status === 'Assigned' && (
                <button
                  onClick={() => handleUpdateStatus(ticket.id, 'In Progress')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                >
                  Mark In Progress
                </button>
              )}

              {ticket.status === 'In Progress' && (
                <button
                  onClick={() => handleUpdateStatus(ticket.id, 'Completed')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve & Complete</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
