import React from 'react';
import { useInventory } from '../context/InventoryContext';
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
  Calendar
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
    generateAiOrderForecast 
  } = useInventory();

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
      {/* Welcome Banner with Operations Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 border border-slate-800 p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Restaurant Meat & Wastage Ops
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400">
                Night WhatsApp Photos & Morning Reconcile
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
              Central Kitchen Inventory Hub
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl hidden sm:block">
              Track raw chicken from WhatsApp night closing photos, verify morning scale weights, and detect wastage automatically.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>WhatsApp Msg</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-ordering')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI PO</span>
            </button>
          </div>
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
            <span>8 Cuts</span>
            <span className="text-emerald-400 font-medium">2.4°C ✓</span>
          </div>
        </div>

        {/* Card 2: Today's Received */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Today Recvd</span>
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
            <span className="truncate max-w-[70px]">Apex Poultry</span>
            <span className="text-blue-400 font-medium">
              {currency}{currentLog?.deliveryReceived?.totalCost?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Card 3: Month Wastage Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">30D Wastage</span>
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
            <span>Shrinkage</span>
            <span className="text-amber-400 font-bold">{monthWastagePercentage}%</span>
          </div>
        </div>

        {/* Card 4: AI Suggested Order */}
        <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Order
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
            <span>Est. Cost</span>
            <span className="text-amber-400 font-bold">{currency}{aiForecast.totalOrderCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Daily Audit Workflow Status Stepper */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Today's Audit Cycle ({selectedDate})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Live trail</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Step 1 */}
          <div 
            onClick={() => setActiveTab('night-closing')}
            className={`cursor-pointer p-3 sm:p-4 rounded-xl border active:scale-95 transition-all ${
              currentLog?.nightClosing
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-amber-950/20 border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400">1. Night Closing</span>
              {currentLog?.nightClosing ? (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  ✓ Logged
                </span>
              ) : (
                <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30 animate-pulse">
                  Pending
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-white">Staff WhatsApp Closing Stock</p>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => setActiveTab('morning-receiving')}
            className={`cursor-pointer p-3 sm:p-4 rounded-xl border active:scale-95 transition-all ${
              currentLog?.morningOpening
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-slate-800/40 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400">2. Morning Audit</span>
              {currentLog?.morningOpening ? (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  ✓ Reconciled
                </span>
              ) : (
                <span className="text-[9px] text-slate-500 font-medium">Pending</span>
              )}
            </div>
            <p className="text-xs font-semibold text-white">Morning Physical Check</p>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => setActiveTab('morning-receiving')}
            className={`cursor-pointer p-3 sm:p-4 rounded-xl border active:scale-95 transition-all ${
              currentLog?.deliveryReceived
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-slate-800/40 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400">3. Fresh Delivery</span>
              {currentLog?.deliveryReceived ? (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  ✓ {currentLog.deliveryReceived.totalKg} kg
                </span>
              ) : (
                <span className="text-[9px] text-slate-500 font-medium">Pending</span>
              )}
            </div>
            <p className="text-xs font-semibold text-white">Poultry Delivery Check-in</p>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => setActiveTab('ai-ordering')}
            className="cursor-pointer p-3 sm:p-4 rounded-xl border bg-orange-950/20 border-orange-500/40 active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-amber-400">4. AI Tomorrow PO</span>
              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                Ready
              </span>
            </div>
            <p className="text-xs font-semibold text-white">Smart PO to WhatsApp</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Inventory Cuts Status & 7-Day Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Raw Meat Stock by Cut
              </h3>
              <p className="text-[10px] text-slate-400">Live status based on night closing & morning audit</p>
            </div>
            <button
              onClick={() => setActiveTab('night-closing')}
              className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              Update <ChevronRight className="w-3.5 h-3.5" />
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

        {/* Right 1 Col: Last 7 Days Wastage & Recent WhatsApp Ingest */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              7-Day Sales vs Wastage (KG)
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

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquareCode className="w-3.5 h-3.5 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Latest WhatsApp Post
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className="text-[10px] text-emerald-400 font-bold"
              >
                Open Hub →
              </button>
            </div>

            <div className="bg-[#efeae2]/10 border border-emerald-900/40 rounded-xl p-2.5 text-[10px] text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-28 overflow-y-auto">
              {currentLog?.nightClosing?.whatsAppMessage || `*NIGHT CLOSING STOCK REPORT*\n🍗 Boneless: 14.5 kg\n🍗 Curry Cut: 21.0 kg\n🍗 Wings: 8.5 kg`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
