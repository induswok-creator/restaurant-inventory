import React, { useState } from 'react';
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
  Menu,
  X,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Flame
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Desktop Sidebar (hidden on mobile, visible on lg screens) */}
      <aside className="hidden lg:flex w-72 bg-slate-900/95 border-r border-slate-800/80 flex-col justify-between shrink-0">
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
                  onClick={() => handleNavClick(item.id)}
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

      {/* Main Content & Mobile View Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Mobile & Desktop Header */}
        <header className="h-14 sm:h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 sm:px-6 flex items-center justify-between shrink-0 pt-safe z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 active:scale-95 transition-transform"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <span className="text-xl">🐔</span>
              <span className="font-extrabold text-sm tracking-tight text-white">PoultryPulse</span>
              <span className="text-[9px] bg-orange-500 text-slate-950 font-bold px-1 rounded">AI</span>
            </div>

            {/* Desktop Branch Title */}
            <h1 className="hidden lg:flex items-center gap-2 text-base font-bold text-white tracking-tight">
              <span>The Tandoor & Grill Central Kitchen</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                Live Ops: {selectedDate}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Quick Status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-600/40 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>WhatsApp Synced</span>
            </div>

            {/* Quick Ingest Button */}
            <button
              onClick={() => setActiveTab('whatsapp')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all"
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Ingest WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
          </div>
        </header>

        {/* Scrollable View Area (with bottom padding on mobile for iPhone navigation bar) */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 pb-24 sm:pb-20 lg:pb-6 bg-slate-950 ios-scroll">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* iPhone & Mobile Fixed Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 pb-safe flex items-center justify-around shadow-2xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'overview' ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'overview' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
              activeTab === 'whatsapp' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <MessageSquareCode className={`w-5 h-5 ${activeTab === 'whatsapp' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('night-closing')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'night-closing' ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className={`w-5 h-5 ${activeTab === 'night-closing' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">Night</span>
          </button>

          <button
            onClick={() => setActiveTab('morning-receiving')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'morning-receiving' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className={`w-5 h-5 ${activeTab === 'morning-receiving' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">Morning</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-ordering')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              activeTab === 'ai-ordering' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${activeTab === 'ai-ordering' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">AI Order</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-400 hover:text-slate-200"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">More</span>
          </button>
        </nav>
      </div>

      {/* Mobile Slide-in Drawer Sheet (Full Menu for iPhone/Mobile) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-sm bg-slate-900 h-full flex flex-col justify-between border-r border-slate-800 shadow-2xl z-10 pt-safe pb-safe">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-lg font-bold text-white shadow-md">
                    🐔
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">PoultryPulse AI</h3>
                    <p className="text-[10px] text-slate-400">Meat Inventory & Wastage Ops</p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Date Changer */}
              <div className="p-3 bg-slate-950/60 border-b border-slate-800">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Audit Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-semibold"
                />
              </div>

              {/* Navigation List */}
              <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] ios-scroll">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Currency:</span>
                <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                  {['₹', '$', '£', '€', 'AED'].map((cur) => (
                    <button
                      key={cur}
                      onClick={() => setCurrency(cur)}
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        currency === cur ? 'bg-orange-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Reload 30-day realistic demo data?')) {
                    resetToDemoData();
                    setMobileMenuOpen(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload 30-Day Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
