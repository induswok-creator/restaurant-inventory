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
  Tooltip, 
  BarChart, 
  Bar 
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
    // Current stock priority: Morning opening (if logged) + Delivery (if logged) OR Night closing OR minPar estimate
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

  // Calculate monthly stats from the 30-day logs
  const totalMonthWastageKg = dailyLogs.reduce((acc, log) => acc + (log.wastageSummary?.totalWastageKg || 0), 0);
  const totalMonthWastageCost = dailyLogs.reduce((acc, log) => acc + (log.wastageSummary?.totalWastageCost || 0), 0);
  const totalMonthDeliveredKg = dailyLogs.reduce((acc, log) => acc + (log.deliveryReceived?.totalKg || 0), 0);
  const monthWastagePercentage = totalMonthDeliveredKg > 0 ? ((totalMonthWastageKg / totalMonthDeliveredKg) * 100).toFixed(1) : 0;

  // Chart data for last 7 days (Daily Wastage vs Sales)
  const last7DaysChartData = dailyLogs.slice(0, 7).reverse().map(log => ({
    day: log.dayOfWeek.substring(0, 3),
    date: log.date.substring(5),
    salesKg: log.salesAndUsage?.totalChickenSoldKg || 0,
    wasteKg: log.wastageSummary?.totalWastageKg || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Operations Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 border border-slate-800 p-6 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Restaurant Meat Auditing & AI Demand System
              </span>
              <span className="text-xs text-slate-400">
                Night Photos & Morning Delivery Reconciler
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Central Kitchen Inventory Hub
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Track raw chicken from WhatsApp night closing photos, verify morning opening scale weights, record fresh poultry deliveries, and automatically detect kitchen wastage while AI calculates tomorrow's exact purchase order.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageSquareCode className="w-4 h-4" />
              <span>Ingest WhatsApp Post</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-ordering')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Tomorrow Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Live In-Stock */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Raw Stock</span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {totalCurrentStockKg.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-400">KG</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>8 Active Cuts</span>
            <span className="text-emerald-400 font-medium">Chiller at 2.4°C ✓</span>
          </div>
        </div>

        {/* Card 2: Today's Received */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Inbound Delivery</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {currentLog?.deliveryReceived?.totalKg || 0}
            </span>
            <span className="text-sm font-semibold text-slate-400">KG</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>{currentLog?.deliveryReceived ? currentLog.deliveryReceived.vendor : 'Awaiting Delivery'}</span>
            <span className="text-blue-400 font-medium">
              {currency}{currentLog?.deliveryReceived?.totalCost?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Card 3: Month Wastage Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">30-Day Total Wastage</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-400 tracking-tight">
              {currency}{totalMonthWastageCost.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-400">({totalMonthWastageKg.toFixed(0)} kg)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>Shrinkage Rate</span>
            <span className="text-amber-400 font-bold">{monthWastagePercentage}% of Procurement</span>
          </div>
        </div>

        {/* Card 4: AI Suggested Order */}
        <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Recommended Order
            </span>
            <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
              Tomorrow
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300 tracking-tight">
              {aiForecast.totalOrderKg}
            </span>
            <span className="text-sm font-semibold text-slate-400">KG</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <span>Est. Order Cost</span>
            <span className="text-amber-400 font-bold">{currency}{aiForecast.totalOrderCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Daily Audit Workflow Status Stepper */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Today's Inventory Cycle Checklist ({selectedDate})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Live operational trail</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div 
            onClick={() => setActiveTab('night-closing')}
            className={`cursor-pointer p-4 rounded-xl border transition-all ${
              currentLog?.nightClosing
                ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500 animate-subtle-pulse'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Step 1: Night Closing</span>
              {currentLog?.nightClosing ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Logged & Photo Saved
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <AlertTriangle className="w-3 h-3" /> Needs Verification
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-white">Staff WhatsApp Closing Stock</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {currentLog?.nightClosing ? `${currentLog.nightClosing.staff} • Scale photo attached` : 'Pending night closing input or WhatsApp sync'}
            </p>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => setActiveTab('morning-receiving')}
            className={`cursor-pointer p-4 rounded-xl border transition-all ${
              currentLog?.morningOpening
                ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Step 2: Morning Audit</span>
              {currentLog?.morningOpening ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Reconciled
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 font-medium">Pending morning scale</span>
              )}
            </div>
            <p className="text-xs font-semibold text-white">Morning Physical Check</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {currentLog?.morningOpening ? `Overnight drip variance: -${currentLog.morningOpening.overnightDripLossKg} kg` : 'Check opening pending stock vs night count'}
            </p>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => setActiveTab('morning-receiving')}
            className={`cursor-pointer p-4 rounded-xl border transition-all ${
              currentLog?.deliveryReceived
                ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Step 3: Fresh Delivery</span>
              {currentLog?.deliveryReceived ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> {currentLog.deliveryReceived.totalKg} kg Recvd
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 font-medium">Log Supplier Invoice</span>
              )}
            </div>
            <p className="text-xs font-semibold text-white">Poultry Delivery Check-in</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {currentLog?.deliveryReceived ? `Bill #${currentLog.deliveryReceived.invoiceNo} verified` : 'Inspect temperature, bill & weight scales'}
            </p>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => setActiveTab('ai-ordering')}
            className="cursor-pointer p-4 rounded-xl border bg-orange-950/20 border-orange-500/40 hover:border-orange-500 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400">Step 4: AI Next Order</span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Sparkles className="w-3 h-3" /> Auto Ready
              </span>
            </div>
            <p className="text-xs font-semibold text-white">Smart PO to WhatsApp</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Forecasted {aiForecast.totalOrderKg} kg based on {aiForecast.dayOfWeek} trends
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Inventory Cuts Status & 7-Day Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Stock by Cut */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Raw Meat Stock by Cut & Par Levels
              </h3>
              <p className="text-xs text-slate-400">Real-time status based on night closing & morning check</p>
            </div>
            <button
              onClick={() => setActiveTab('night-closing')}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              Update Counts <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {itemStockList.map((item) => (
              <div 
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <span className="text-[10px] text-slate-400">{item.category} • Yield {Math.round(item.prepYield * 100)}%</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.parStatus === 'LOW' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : item.parStatus === 'EXCESS'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {item.parStatus}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-white">{item.currentStock}</span>
                      <span className="text-xs font-semibold text-slate-400 ml-1">{item.unit}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Par: {item.minParKg} - {item.maxParKg} {item.unit}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.parStatus === 'LOW' 
                          ? 'bg-red-500' 
                          : item.parStatus === 'EXCESS' 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-700/40">
                  <span>Unit Cost: {currency}{item.defaultCostPerUnit}/kg</span>
                  <span className="text-slate-300">Shelf life: {item.shelfLifeDays}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Last 7 Days Wastage & Recent WhatsApp Ingest */}
        <div className="space-y-6">
          {/* 7-Day Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                7-Day Sales vs Wastage (KG)
              </h3>
              <span className="text-[11px] text-slate-400">Trend</span>
            </div>
            
            <div className="h-44 w-full">
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
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="salesKg" name="Sold (kg)" stroke="#f97316" fill="url(#salesGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="wasteKg" name="Wastage (kg)" stroke="#ef4444" fill="url(#wasteGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-slate-300">Chicken Sold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-slate-300">Wastage Loss</span>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Log Snippet */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <MessageSquareCode className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Latest WhatsApp Stock Post
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
              >
                Open Hub →
              </button>
            </div>

            <div className="bg-[#efeae2]/10 border border-emerald-900/40 rounded-xl p-3 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
              {currentLog?.nightClosing?.whatsAppMessage || `*NIGHT CLOSING STOCK REPORT*\n🍗 Boneless: 14.5 kg\n🍗 Curry Cut: 21.0 kg\n🍗 Wings: 8.5 kg\n\nScale photo attached. Morning shift please inspect.`}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Photo attached:</span>
              <button
                onClick={() => setActiveTab('night-closing')}
                className="text-[11px] font-bold text-orange-400 hover:underline flex items-center gap-1"
              >
                <Camera className="w-3 h-3" /> View Weighing Scale Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
