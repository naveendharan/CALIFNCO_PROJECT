'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, Product } from '../data/products';

export const InventoryView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filtered = PRODUCTS.filter(p => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">50+ SKU Inventory & Pricing Master</h2>
          <p className="text-xs text-slate-400 mt-1">
            Certified water purifier models, booster pumps, membrane elements, and precision spares with retail vs wholesale price controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
            {PRODUCTS.length} Total SKUs Active
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search SKU code, product title, or specs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">SKU / Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Retail MRP</th>
                <th className="py-3 px-4 text-right">Wholesale Rate</th>
                <th className="py-3 px-4 text-center">Dealer MOQ</th>
                <th className="py-3 px-4 text-center">Margin %</th>
                <th className="py-3 px-4 text-right">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map(item => {
                const margin = Math.round(((item.retailPrice - item.wholesalePrice) / item.retailPrice) * 100);
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* SKU & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-800"
                        />
                        <div>
                          <span className="font-mono text-[10px] text-cyan-400 font-bold block">{item.id}</span>
                          <span className="font-semibold text-slate-200 line-clamp-1 max-w-[220px]">{item.name}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-400">
                      <span className="bg-slate-800/70 px-2 py-0.5 rounded text-[10px] font-medium text-slate-300">
                        {item.category}
                      </span>
                    </td>

                    {/* Retail MRP */}
                    <td className="py-3 px-4 text-right font-bold text-slate-300">
                      ₹{item.retailPrice.toLocaleString('en-IN')}
                    </td>

                    {/* Wholesale */}
                    <td className="py-3 px-4 text-right font-black text-emerald-400">
                      ₹{item.wholesalePrice.toLocaleString('en-IN')}
                    </td>

                    {/* MOQ */}
                    <td className="py-3 px-4 text-center font-bold text-amber-300">
                      {item.dealerMoq} units
                    </td>

                    {/* Margin */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-black border border-emerald-500/20">
                        {margin}%
                      </span>
                    </td>

                    {/* Stock Status */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-bold text-slate-200">{item.stockCount}</span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.stockCount > 30 ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
