import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import purchasePdfData from '../data/indusWokPurchasePdfData.json';
import { 
  FileSpreadsheet, 
  Receipt, 
  TrendingUp, 
  Download, 
  Filter, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Truck,
  Layers,
  Scale
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const PurchaseLedgerTab = () => {
  const { currency } = useInventory();
  const [activeSubTab, setActiveSubTab] = useState('chicken'); // 'chicken' | 'stock' | 'vegetables' | 'summary'
  const [searchQuery, setSearchQuery] = useState('');

  const { summary, categories, chickenPurchases, vegetablePurchases } = purchasePdfData;

  // Export Excel of Verified PDF Bills
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const wsSummary = XLSX.utils.json_to_sheet(categories);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Consolidated Categories');

    // Chicken Sheet
    const wsChicken = XLSX.utils.json_to_sheet(chickenPurchases);
    XLSX.utils.book_append_sheet(wb, wsChicken, 'Chicken Purchases Log');

    // Veg Sheet
    const wsVeg = XLSX.utils.json_to_sheet(vegetablePurchases);
    XLSX.utils.book_append_sheet(wb, wsVeg, 'Vegetable Purchases Log');

    XLSX.writeFile(wb, `Indus_Wok_Verified_Purchase_Statement.xlsx`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xl sm:text-2xl shadow-lg shrink-0">
            📑
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white">Indus Wok Verified Purchase & Bill Ledger</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                July – August 2026 Audit
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Parsed from official billing statement (BILL SINDUS WOK): Chicken, Groceries, Oils, Sauces & Produce.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/30 transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Ledger Excel</span>
        </button>
      </div>

      {/* 5 KPI Metric Cards from Verified Bill Statement */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {/* Total Chicken */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4">
          <span className="text-[9px] uppercase font-bold text-orange-400 block">Total Chicken Outlay</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-2xl font-extrabold text-white">₹{summary.totalChickenExpenses.toLocaleString()}</span>
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">Jul: ₹60,597 · Aug: ₹30,826</span>
        </div>

        {/* Total Stock & Provisions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4">
          <span className="text-[9px] uppercase font-bold text-blue-400 block">Stock & Provisions</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-2xl font-extrabold text-white">₹{summary.totalStockAndProvisions.toLocaleString()}</span>
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">Oil, Rice, Garlic, Sauces</span>
        </div>

        {/* Total Veg */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4">
          <span className="text-[9px] uppercase font-bold text-emerald-400 block">Fresh Vegetables</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-2xl font-extrabold text-white">₹{summary.vegetablesTotal.toLocaleString()}</span>
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">Produce & Herbs</span>
        </div>

        {/* Eggs & Specialties */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4">
          <span className="text-[9px] uppercase font-bold text-amber-400 block">Eggs & Specialties</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-2xl font-extrabold text-white">₹{summary.eggsAndSpecialties.toLocaleString()}</span>
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">1,400+ Eggs & Ramen</span>
        </div>

        {/* Grand Total */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-slate-900 to-orange-950/40 border border-orange-500/40 rounded-2xl p-3 sm:p-4">
          <span className="text-[9px] uppercase font-bold text-orange-400 block">Total Procurement</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-2xl font-extrabold text-white">₹{summary.grandTotalOutlay.toLocaleString()}</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold block mt-1">100% Verified Ledger</span>
        </div>
      </div>

      {/* Sub-tab Switcher */}
      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto ios-scroll">
        <button
          onClick={() => setActiveSubTab('chicken')}
          className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'chicken' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🍗 Chicken Purchases ({chickenPurchases.length} days)
        </button>
        <button
          onClick={() => setActiveSubTab('summary')}
          className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'summary' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📊 Category Item Breakdown ({categories.length})
        </button>
        <button
          onClick={() => setActiveSubTab('vegetables')}
          className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'vegetables' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🥦 Vegetables Log ({vegetablePurchases.length} days)
        </button>
      </div>

      {/* View 1: Chicken Purchases */}
      {activeSubTab === 'chicken' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Itemized Chicken Purchases Log (July – August 2026)
            </h3>
            <span className="text-[10px] text-orange-400 font-bold font-mono">Total: ₹91,423</span>
          </div>

          <div className="overflow-x-auto ios-scroll">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                  <th className="pb-2.5 px-2.5">Date</th>
                  <th className="pb-2.5 px-2.5">Bill Total</th>
                  <th className="pb-2.5 px-2.5">Leg Boneless</th>
                  <th className="pb-2.5 px-2.5">Breast Boneless</th>
                  <th className="pb-2.5 px-2.5">Lollipop</th>
                  <th className="pb-2.5 px-2.5">Wings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {chickenPurchases.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-2.5 font-sans font-bold text-white whitespace-nowrap">{r.date}</td>
                    <td className="py-2.5 px-2.5 font-bold text-orange-400">{r.billTotal}</td>
                    <td className="py-2.5 px-2.5">
                      {r.legBoneless && r.legBoneless !== '-' ? (
                        <div>
                          <span className="text-white">{r.legBoneless}</span>
                          <span className="text-[9px] text-slate-400 block">{r.legRateQty}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="py-2.5 px-2.5">
                      {r.breastBoneless && r.breastBoneless !== '-' ? (
                        <div>
                          <span className="text-white">{r.breastBoneless}</span>
                          <span className="text-[9px] text-slate-400 block">{r.breastRateQty}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="py-2.5 px-2.5">
                      {r.lollipop && r.lollipop !== '-' ? (
                        <div>
                          <span className="text-white">{r.lollipop}</span>
                          <span className="text-[9px] text-slate-400 block">{r.lollipopRateQty}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="py-2.5 px-2.5">
                      {r.wings && r.wings !== '-' ? (
                        <div>
                          <span className="text-white">{r.wings}</span>
                          <span className="text-[9px] text-slate-400 block">{r.wingsRateQty}</span>
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Categories Summary */}
      {activeSubTab === 'summary' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Consolidated Category Breakdown & Unit Rates
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold font-mono">Grand Total: ₹1,95,311</span>
          </div>

          <div className="space-y-2">
            {categories.map((c, idx) => (
              <div key={idx} className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white">{c.category}</h4>
                  <p className="text-[10px] text-slate-400">{c.remarks}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Base Rate:</span>
                    <span className="text-slate-300 font-semibold">{c.rateBase || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Total Spend:</span>
                    <span className="font-bold text-orange-400">{c.recordedSpend}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Share:</span>
                    <span className="font-bold text-emerald-400">{c.share}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Vegetables Log */}
      {activeSubTab === 'vegetables' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Daily Fresh Vegetable Procurement Log (August 2026)
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold font-mono">Aug Total: ₹17,915</span>
          </div>

          <div className="overflow-x-auto ios-scroll">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                  <th className="pb-2.5 px-2">Date</th>
                  <th className="pb-2.5 px-2">Total</th>
                  <th className="pb-2.5 px-2">Capsicum</th>
                  <th className="pb-2.5 px-2">Spring Onion</th>
                  <th className="pb-2.5 px-2">Broccoli</th>
                  <th className="pb-2.5 px-2">Onion</th>
                  <th className="pb-2.5 px-2">Ginger/Adrak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {vegetablePurchases.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-2 font-sans font-bold text-white whitespace-nowrap">{r.date}</td>
                    <td className="py-2 px-2 font-bold text-emerald-400">{r.total}</td>
                    <td className="py-2 px-2">{r.capsicum || '—'}</td>
                    <td className="py-2 px-2">{r.springOnion || '—'}</td>
                    <td className="py-2 px-2">{r.broccoli || '—'}</td>
                    <td className="py-2 px-2">{r.onion || '—'}</td>
                    <td className="py-2 px-2">{r.adrak || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
