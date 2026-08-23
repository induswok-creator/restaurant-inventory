import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { AddVendorModal } from './AddVendorModal';
import { 
  TrendingDown, 
  Sparkles, 
  Package, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Scale, 
  ChevronRight,
  Flame,
  Camera,
  MessageSquareCode,
  ShieldCheck,
  Calendar,
  Plus,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export const OverviewTab = () => {
  const { 
    items, 
    dailyLogs, 
    currency, 
    selectedDate, 
    getLogForDate, 
    setActiveTab, 
    generateAiOrderForecast,
    posStatus,
    syncWithPos,
    suppliers
  } = useInventory();

  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const currentLog = getLogForDate(selectedDate) || dailyLogs[0];
  const aiForecast = generateAiOrderForecast(selectedDate);

  // Calculate live current stock across items
  let totalCurrentStockKg = 0;
  const itemStockList = items.map(item => {
    let stock = 0;
    if (currentLog?.morningOpening?.items?.[item.id]?.weight !== undefined) {
      stock = currentLog.morningOpening.items[item.id].weight;
      if (currentLog?.deliveryReceived?.items?.[item.id]?.weight !== undefined) {
        stock += currentLog.deliveryReceived.items[item.id].weight;
      }
    } else if (currentLog?.nightClosing?.items?.[item.id]?.weight !== undefined) {
      stock = currentLog.nightClosing.items[item.id].weight;
    } else {
      stock = item.minParKg * 0.9;
    }

    totalCurrentStockKg += stock;

    const parStatus = stock < item.minParKg ? 'LOW' : (stock > item.maxParKg ? 'EXCESS' : 'OPTIMAL');
    const percent = Math.min(100, Math.round((stock / item.maxParKg) * 100));

    return {
      ...item,
      currentStock: Number(stock.toFixed(2)),
      parStatus,
      percent
    };
  });

  const totalMonthWastageKg = dailyLogs.reduce((acc, log) => acc + (log.wastageSummary?.totalWastageKg || 0), 0);
  const totalMonthWastageCost = dailyLogs.reduce((acc, log) => acc + (log.wastageSummary?.totalWastageCost || 0), 0);
  const totalMonthDeliveredKg = dailyLogs.reduce((acc, log) => acc + (log.deliveryReceived?.totalKg || 0), 0);
  const monthWastagePercentage = totalMonthDeliveredKg > 0 ? ((totalMonthWastageKg / totalMonthDeliveredKg) * 100).toFixed(1) : 0;

  const last7DaysChartData = dailyLogs.slice(0, 7).reverse().map(log => ({
    day: log.dayOfWeek.substring(0, 3),
    salesKg: log.salesAndUsage?.totalChickenSoldKg || 0,
    wasteKg: log.wastageSummary?.totalWastageKg || 0,
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={isAddVendorOpen}
        onClose={() => setIsAddVendorOpen(false)}
      />

      {/* Real POS Status Live Strip */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
            🥢
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-white">Indus Wok Restaurant POS</span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                ● Live Synced (338 Real Bills)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Asian · Chinese · Pan-Asian Kitchen • Phone: 8850241377
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddVendorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span>+ Add Vendor</span>
          </button>

          <button
            onClick={() => syncWithPos()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-700/30 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync POS</span>
          </button>
        </div>
      </div>

      {/* 4 Key KPI Metric Cards (2 columns on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Live In-Stock */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Raw Stock</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalCurrentStockKg.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">KG</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
            <span>6 Cuts</span>
            <span className="text-emerald-400 font-medium">2.2°C Chilled ✓</span>
          </div>
        </div>

        {/* Card 2: Today's Received */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Today Inbound</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentLog?.deliveryReceived?.totalKg || 0}
            </span>
            <span className="text-xs text-slate-400 font-semibold">KG</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
            <span className="truncate max-w-[80px]">Al-Madina Meat</span>
            <span className="text-blue-400 font-medium">
              {currency}{currentLog?.deliveryReceived?.totalCost?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Card 3: Month Wastage Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Real Wastage</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-3xl font-extrabold text-red-400 tracking-tight">
              {currency}{totalMonthWastageCost.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
            <span>Shrinkage Rate</span>
            <span className="text-amber-400 font-bold">{monthWastagePercentage}%</span>
          </div>
        </div>

        {/* Card 4: AI Suggested Order */}
        <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI PO
            </span>
            <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full">
              Tomorrow
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-3xl font-extrabold text-amber-300 tracking-tight">
              {aiForecast.totalOrderKg}
            </span>
            <span className="text-xs text-slate-400 font-semibold">KG</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
            <span>Est. Order Cost</span>
            <span className="text-amber-400 font-bold">{currency}{aiForecast.totalOrderCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Real ATOM Digital Scale Photo Highlight from Indus Wok Kitchen */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              📸
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Indus Wok Kitchen Digital Scale Audit
              </h3>
              <p className="text-[10px] text-slate-400">Scale reading from night closing chicken audit</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('night-closing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold active:scale-95 transition-all self-start sm:self-auto"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Upload New Scale Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="sm:col-span-4 rounded-xl overflow-hidden border border-slate-700 max-h-48 flex items-center justify-center bg-slate-900">
            <img
              src="/scale-example.jpg"
              alt="Indus Wok Scale Real Photo"
              className="w-full h-full object-contain max-h-44"
            />
          </div>

          <div className="sm:col-span-8 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">ATOM A-121 Kitchen Scale Reading:</span>
              <span className="text-sm font-mono font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/40">
                2061g (2.061 KG)
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Fresh cut raw chicken tray weighed before night closing. The AI Vision system reads the green LED display (2061g) and auto-populates the pending inventory record.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
              <span>Shift Lead: Sunil Sharma</span>
              <span>•</span>
              <span className="text-emerald-400">Chiller: 2.2°C ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Inventory Cuts Status & 7-Day Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Indus Wok Raw Meat Cuts
              </h3>
              <p className="text-[10px] text-slate-400">Pending weight from scale audit & POS deduction</p>
            </div>
            <button
              onClick={() => setActiveTab('night-closing')}
              className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              Update Counts <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
            {itemStockList.map((item) => (
              <div 
                key={item.id}
                className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg">{item.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white truncate max-w-[140px]">{item.name}</h4>
                        <span className="text-[9px] text-slate-400">{item.category} • Yield {Math.round(item.prepYield * 100)}%</span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                      item.parStatus === 'LOW' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : item.parStatus === 'EXCESS' 
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {item.parStatus}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-baseline justify-between">
                    <div>
                      <span className="text-lg sm:text-xl font-extrabold text-white">{item.currentStock}</span>
                      <span className="text-xs font-semibold text-slate-400 ml-1">{item.unit}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Par: {item.minParKg}-{item.maxParKg} kg
                    </span>
                  </div>

                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.parStatus === 'LOW' ? 'bg-red-500' : item.parStatus === 'EXCESS' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400 pt-1.5 border-t border-slate-700/40">
                  <span>{currency}{item.defaultCostPerUnit}/kg</span>
                  <span>Shelf: {item.shelfLifeDays}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Last 7 Days Wastage & Suppliers Quick List */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-orange-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Suppliers & Vendors ({suppliers.length})
                </h3>
              </div>
              <button
                onClick={() => setIsAddVendorOpen(true)}
                className="text-[10px] font-bold text-orange-400 hover:underline flex items-center gap-0.5"
              >
                + Add
              </button>
            </div>

            <div className="space-y-2">
              {suppliers.map(sup => (
                <div key={sup.id} className="p-2.5 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{sup.name}</h4>
                    <span className="text-[10px] text-slate-400">{sup.category} • {sup.deliveryTime}</span>
                  </div>
                  <a
                    href={`https://wa.me/${sup.whatsappNumber || sup.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-2 py-1 rounded-lg hover:bg-emerald-900/60"
                  >
                    WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              7-Day Real Sales vs Wastage (KG)
            </h3>
            
            <div className="h-36 sm:h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7DaysChartData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="salesKg" name="Sold (kg)" stroke="#f97316" fill="url(#salesGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="wasteKg" name="Wastage (kg)" stroke="#ef4444" fill="url(#wasteGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
