import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  Moon, 
  Sun, 
  TrendingDown, 
  Sparkles, 
  FileSpreadsheet, 
  UtensilsCrossed, 
  Settings, 
  RotateCcw,
  Scale,
  ChefHat,
  BellRing
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedDate, 
    setSelectedDate, 
    currency, 
    setCurrency, 
    resetToDemoData,
    dailyLogs 
  } = useInventory();

  // Find latest log for pending status indicators
  const latestLog = dailyLogs[0];
  const hasNightClosing = !!latestLog?.nightClosing;
  const hasMorningOpening = !!latestLog?.morningOpening;
  const hasDelivery = !!latestLog?.deliveryReceived;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'whatsapp', label: 'WhatsApp Hub & OCR', icon: MessageSquareCode, badge: 'Live AI' },
    { id: 'night-closing', label: 'Night Closing Stock', icon: Moon, badge: hasNightClosing ? 'Done' : 'Pending' },
    { id: 'morning-receiving', label: 'Morning & Delivery', icon: Sun, badge: (hasMorningOpening && hasDelivery) ? 'Done' : 'Pending' },
    { id: 'sales-usage', label: 'Kitchen Sales & Recipes', icon: ChefHat, badge: null },
    { id: 'wastage', label: 'Wastage Analytics', icon: TrendingDown, badge: 'Insights' },
    { id: 'ai-ordering', label: 'AI Smart Ordering', icon: Sparkles, badge: 'Smart PO' },
    { id: 'monthly-report', label: 'End-of-Month Report', icon: FileSpreadsheet, badge: '30 Days' },
    { id: 'catalog', label: 'Items & Recipes', icon: UtensilsCrossed, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-extrabold text-xl">
              🐔
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">PoultryPulse</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950">AI</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Restaurant Meat & Wastage Ops</p>
            </div>
          </div>

          {/* Date Selector & Branch Quick Switcher */}
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">Audit Date</span>
              <span className="text-amber-400 font-mono text-[11px]">Today: Aug 24</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/20'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-black/30 text-white'
                          : item.badge === 'Done'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.badge === 'Pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-slate-800 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Demo Reset */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] text-slate-400 font-medium">Currency:</span>
            <div className="flex bg-slate-800 rounded-md p-0.5 border border-slate-700">
              {['₹', '$', '£', '€', 'AED'].map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    currency === cur ? 'bg-orange-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset to 30-day realistic demo dataset?')) {
                resetToDemoData();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] border border-slate-700/60 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reload 30-Day Demo Data</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>The Tandoor & Grill Central Kitchen</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                Live Ops: {selectedDate}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* WhatsApp Integration Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-600/40 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>WhatsApp Group Sync Active</span>
            </div>

            {/* Quick Action Button to WhatsApp Tab */}
            <button
              onClick={() => setActiveTab('whatsapp')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all"
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>+ Ingest WhatsApp Stock Msg</span>
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};
