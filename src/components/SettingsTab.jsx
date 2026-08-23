import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { AddVendorModal } from './AddVendorModal';
import { 
  Settings, 
  RotateCcw, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle2, 
  Building2, 
  DollarSign, 
  Bell, 
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SettingsTab = () => {
  const { 
    currency, 
    setCurrency, 
    resetToDemoData, 
    dailyLogs, 
    items, 
    recipes, 
    suppliers,
    posStatus,
    syncWithPos
  } = useInventory();

  const [restaurantName, setRestaurantName] = useState('Indus Wok');
  const [managerPhone, setManagerPhone] = useState('8850241377');
  const [upiId, setUpiId] = useState('Q781941663@ybl');
  const [posUrl, setPosUrl] = useState('https://induswok-pos.induswok.workers.dev/');
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Export JSON Backup
  const handleExportBackup = () => {
    const backup = {
      restaurantName,
      managerPhone,
      currency,
      items,
      recipes,
      suppliers,
      dailyLogs,
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `IndusWok_Inventory_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToastMessage('📦 Full system backup exported as JSON!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSyncPosNow = async () => {
    await syncWithPos();
    setToastMessage('✅ Synchronized with Indus Wok live POS database!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={isAddVendorOpen}
        onClose={() => setIsAddVendorOpen(false)}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xl sm:text-2xl shadow-lg shrink-0">
            ⚙️
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Indus Wok Settings & POS Integration</h2>
            <p className="text-xs text-slate-400">
              Configure restaurant branding, vendors, currencies, and POS sync connections.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddVendorOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Supplier / Vendor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Restaurant Profile */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Building2 className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Restaurant Outlet Profile</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Restaurant Name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Owner / Manager WhatsApp Phone</label>
              <input
                type="text"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">UPI ID for Supplier / Bill Payments</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Currency Symbol</label>
              <div className="flex gap-2">
                {['₹', '$', '£', '€', 'AED'].map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                      currency === cur 
                        ? 'bg-orange-500 text-slate-950 border-orange-400 font-extrabold' 
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* POS Sync & Data Backups */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live POS Cloud Sync</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Connected Indus Wok POS URL</label>
              <input
                type="text"
                value={posUrl}
                onChange={(e) => setPosUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-mono text-[11px]"
              />
            </div>

            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-white font-bold block">Status: Connected to Firestore</span>
                <span className="text-[10px] text-slate-400">{posStatus.totalBills} Bills • {recipes.length} Active Recipes</span>
              </div>
              <button
                onClick={handleSyncPosNow}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Sync Now
              </button>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleExportBackup}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Export System JSON Backup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
