import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
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
  ShieldCheck
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
    suppliers 
  } = useInventory();

  const [restaurantName, setRestaurantName] = useState('The Tandoor & Grill Central Kitchen');
  const [managerPhone, setManagerPhone] = useState('+91 98201 55667');
  const [toastMessage, setToastMessage] = useState(null);

  // Export JSON Backup
  const handleExportBackup = () => {
    const backup = {
      restaurantName,
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
    downloadAnchor.setAttribute('download', `PoultryPulse_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToastMessage('📦 Full system backup exported as JSON!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-2xl shadow-lg">
            ⚙️
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">System Settings & Data Management</h2>
            <p className="text-xs text-slate-400">
              Configure restaurant operational parameters, currencies, WhatsApp notifications, and dataset backups.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Profile */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Restaurant Outlet Profile</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Restaurant Branch Name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Owner / Manager WhatsApp Number</label>
              <input
                type="text"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Currency Symbol</label>
              <div className="flex gap-2">
                {['₹', '$', '£', '€', 'AED'].map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
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

        {/* Backup & Demo Data */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Data Backups & Reset</h3>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Download your 30-day chicken log, recipe yields, and supplier directory as a portable JSON file.
            </p>

            <button
              onClick={handleExportBackup}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Export Full JSON System Backup</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset entire system to the 30-day realistic historical dataset? Any unsaved edits will be restored to realistic sample data.')) {
                  resetToDemoData();
                  setToastMessage('🔄 30-Day demo data restored successfully!');
                  confetti({ particleCount: 40, spread: 60 });
                  setTimeout(() => setToastMessage(null), 3000);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-orange-950/40 hover:bg-orange-900/50 text-orange-300 text-xs font-bold border border-orange-500/40 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-orange-400" />
              <span>Reset & Reload 30-Day Realistic History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
