'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  ExternalLink,
  MapPin,
  CreditCard,
  Building,
  User
} from 'lucide-react';
import { AdminDataStore, Order } from '../services/adminDataStore';

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => AdminDataStore.getOrders());
  const [filter, setFilter] = useState<'All' | Order['status']>('All');

  const refresh = () => setOrders([...AdminDataStore.getOrders()]);

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    let tracking: string | undefined = undefined;
    if (status === 'Shipped') {
      tracking = `BLR-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    AdminDataStore.updateOrderStatus(orderId, status, tracking);
    refresh();
  };

  const filteredOrders = orders.filter(o => (filter === 'All' ? true : o.status === filter));

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Shipped':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Confirmed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Order Management Desk</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track, fulfill, dispatch, and manage retail and wholesale orders across India.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f} ({f === 'All' ? orders.length : orders.filter(o => o.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No orders match this status</h3>
            <p className="text-xs text-slate-500 mt-1">Select another filter tab above.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    {order.role === 'dealer' ? <Building className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">{order.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          order.role === 'dealer'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        }`}
                      >
                        {order.role === 'dealer' ? 'Dealer Wholesale' : 'Customer Retail'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="text-lg font-black text-white">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 py-4">
                {/* Customer / Dealer Details */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Buyer Information
                  </span>
                  <p className="font-bold text-slate-200">{order.customerName}</p>
                  {order.businessName && (
                    <p className="text-amber-400 font-semibold">{order.businessName}</p>
                  )}
                  {order.gstNumber && (
                    <p className="text-slate-400">GSTIN: <span className="font-mono text-slate-300">{order.gstNumber}</span></p>
                  )}
                  <p className="text-slate-400">Email: {order.customerEmail}</p>
                  <p className="text-slate-400">Phone: {order.customerPhone}</p>
                </div>

                {/* Shipping & Payment */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Delivery & Settlement
                  </span>
                  <p className="text-slate-300 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{order.shippingAddress}</span>
                  </p>
                  <p className="text-slate-400 flex items-center gap-1.5 pt-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Razorpay ID: <span className="font-mono text-slate-200">{order.paymentId}</span></span>
                  </p>
                  {order.trackingNumber && (
                    <p className="text-cyan-400 font-semibold">
                      Courier Docket: {order.trackingNumber}
                    </p>
                  )}
                </div>

                {/* Items Summary */}
                <div className="space-y-2 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Items in Batch ({order.items.length})
                  </span>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-slate-200 truncate pr-2 max-w-[180px]">
                          {it.product.name}
                        </span>
                        <span className="text-slate-400 font-medium shrink-0">
                          {it.quantity}x @ ₹{it.unitPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Action Controls */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Update Order Pipeline Status:
                </span>
                <div className="flex items-center gap-2">
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Confirmed')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                    >
                      Confirm Order
                    </button>
                  )}

                  {(order.status === 'Pending' || order.status === 'Confirmed') && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Shipped')}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch & Ship</span>
                    </button>
                  )}

                  {order.status === 'Shipped' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Delivered</span>
                    </button>
                  )}

                  {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs font-semibold border border-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
