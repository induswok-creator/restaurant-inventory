import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Moon, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Sparkles, 
  Copy, 
  ThermometerSnowflake, 
  User, 
  FileText,
  Upload,
  RefreshCw,
  Scale,
  Plus,
  Minus
} from 'lucide-react';
import { createScalePhotoSvg } from '../utils/mockImages';
import confetti from 'canvas-confetti';

export const NightClosingTab = () => {
  const { 
    items, 
    dailyLogs, 
    selectedDate, 
    getLogForDate, 
    logNightClosing, 
    currency,
    setActiveTab
  } = useInventory();

  const currentLog = getLogForDate(selectedDate);
  const existingClosing = currentLog?.nightClosing;

  // Form State
  const [staffName, setStaffName] = useState(existingClosing?.staff || 'Sunil Sharma (Night Head)');
  const [chillerTemp, setChillerTemp] = useState(existingClosing?.chillerTemp || '2.2°C');
  const [stockCounts, setStockCounts] = useState(() => {
    const init = {};
    items.forEach(it => {
      init[it.id] = existingClosing?.items?.[it.id]?.weight !== undefined 
        ? existingClosing.items[it.id].weight 
        : (it.minParKg * 0.85).toFixed(1);
    });
    return init;
  });

  const [notes, setNotes] = useState(() => {
    const init = {};
    items.forEach(it => {
      init[it.id] = existingClosing?.items?.[it.id]?.notes || 'Covered in chiller tray';
    });
    return init;
  });

  const [photoUrl, setPhotoUrl] = useState(existingClosing?.photoUrl || null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Sync state if existing closing updates
  useEffect(() => {
    if (existingClosing) {
      setStaffName(existingClosing.staff || 'Sunil Sharma (Night Head)');
      setChillerTemp(existingClosing.chillerTemp || '2.2°C');
      const updatedCounts = {};
      const updatedNotes = {};
      items.forEach(it => {
        updatedCounts[it.id] = existingClosing.items?.[it.id]?.weight !== undefined 
          ? existingClosing.items[it.id].weight 
          : (it.minParKg * 0.85).toFixed(1);
        updatedNotes[it.id] = existingClosing.items?.[it.id]?.notes || 'Covered in chiller tray';
      });
      setStockCounts(updatedCounts);
      setNotes(updatedNotes);
      setPhotoUrl(existingClosing.photoUrl);
    }
  }, [selectedDate, existingClosing]);

  // Total weight
  const totalWeightKg = Number(Object.values(stockCounts).reduce((a, b) => Number(a) + (Number(b) || 0), 0).toFixed(2));
  const totalEstimatedCost = Math.round(items.reduce((acc, it) => acc + ((Number(stockCounts[it.id]) || 0) * it.defaultCostPerUnit), 0));

  // Handle Photo Generation / Upload
  const handleGenerateScalePhoto = () => {
    const newSvg = createScalePhotoSvg('Night Pending Chicken Stock', totalWeightKg, `${selectedDate} 23:45`, chillerTemp);
    setPhotoUrl(newSvg);
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Adjust weight helper for mobile thumb buttons
  const adjustWeight = (itemId, delta) => {
    const current = parseFloat(stockCounts[itemId]) || 0;
    const nextVal = Math.max(0, Number((current + delta).toFixed(1)));
    setStockCounts({ ...stockCounts, [itemId]: nextVal });
  };

  // Format WhatsApp message
  const generatedWhatsAppMsg = `*NIGHT CLOSING PENDING STOCK REPORT - ${selectedDate}*\n` +
    `🏢 The Tandoor & Grill Kitchen\n` +
    `📅 Time: 23:45 PM | Supervisor: ${staffName}\n` +
    `❄️ Chiller Temp: ${chillerTemp} (Verified HACCP)\n\n` +
    `🍗 *Pending Chicken Counts:*\n` +
    items.map(it => `• ${it.name}: *${stockCounts[it.id] || 0} ${it.unit}* (${notes[it.id] || 'Chilled'})`).join('\n') +
    `\n\n📊 *Total Pending Meat: ${totalWeightKg} kg* (Est. Value: ${currency}${totalEstimatedCost.toLocaleString()})\n` +
    `📸 Photo of digital scale attached. Morning crew please inspect during morning opening.`;

  // Save closing log
  const handleSave = () => {
    const structuredItems = {};
    items.forEach(it => {
      structuredItems[it.id] = {
        weight: parseFloat(stockCounts[it.id]) || 0,
        unit: it.unit,
        notes: notes[it.id] || ''
      };
    });

    const finalPhoto = photoUrl || createScalePhotoSvg('Pending Night Stock', totalWeightKg, `${selectedDate} 23:45`, chillerTemp);

    logNightClosing(selectedDate, {
      staff: staffName,
      items: structuredItems,
      photoUrl: finalPhoto,
      whatsAppMessage: generatedWhatsAppMsg,
      chillerTemp: chillerTemp
    });

    setSavedSuccess(true);
    confetti({ particleCount: 40, spread: 60 });
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(generatedWhatsAppMsg);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xl sm:text-2xl shadow-lg shrink-0">
            🌙
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white">Night Closing Stock Audit</h2>
              <span className="text-[11px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {selectedDate} (23:30 PM)
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Weigh pending chicken tubs, snap a photo of the scale, and log closing numbers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyWhatsApp}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 active:scale-95 transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
            <span>{copyFeedback ? 'Copied!' : 'Copy Msg'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Closing</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Night closing stock saved! Morning opening team can now cross-verify.</span>
        </div>
      )}

      {/* Meta Bar: Supervisor & Chiller Temperature */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
          <User className="w-4 h-4 text-orange-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="text-[9px] uppercase font-bold text-slate-400 block">Supervisor</label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none w-full truncate border-b border-transparent focus:border-orange-500"
            />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
          <ThermometerSnowflake className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="text-[9px] uppercase font-bold text-slate-400 block">Chiller Temp</label>
            <input
              type="text"
              value={chillerTemp}
              onChange={(e) => setChillerTemp(e.target.value)}
              className="bg-transparent text-xs font-bold text-blue-300 focus:outline-none w-full border-b border-transparent focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
          <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <label className="text-[9px] uppercase font-bold text-slate-400 block">Total Meat</label>
            <span className="text-xs sm:text-sm font-extrabold text-white">{totalWeightKg} KG</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <label className="text-[9px] uppercase font-bold text-slate-400 block">Stock Value</label>
            <span className="text-xs sm:text-sm font-extrabold text-amber-400">{currency}{totalEstimatedCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Form: Itemized Weight Grid & Scale Photo Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left (7 Cols): Itemized Input Cards */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Pending Meat Stock by Cut
            </h3>
            <span className="text-[10px] text-slate-400">Values in KG</span>
          </div>

          <div className="space-y-2.5">
            {items.map((item) => (
              <div 
                key={item.id}
                className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl hover:border-slate-600 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <span className="text-[10px] text-slate-400">Par: {item.minParKg} - {item.maxParKg} kg</span>
                    </div>
                  </div>

                  {/* Stepper & Input for Mobile */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustWeight(item.id, -0.5)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={stockCounts[item.id] || ''}
                        onChange={(e) => setStockCounts({ ...stockCounts, [item.id]: e.target.value })}
                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-orange-500"
                        placeholder="0.0"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => adjustWeight(item.id, 0.5)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Storage note */}
                <input
                  type="text"
                  value={notes[item.id] || ''}
                  onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
                  className="w-full bg-slate-900/70 border border-slate-700/60 rounded-lg px-2.5 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Chiller tub #2, Marinated for tomorrow"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300">Total Closing Stock:</span>
            <span className="text-sm font-extrabold text-orange-400 font-mono">{totalWeightKg} KG</span>
          </div>
        </div>

        {/* Right (5 Cols): Scale Photo & WhatsApp Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          {/* Visual Weighing Scale Photo Container */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Scale & Chiller Photo
                </h3>
              </div>
              <button
                onClick={handleGenerateScalePhoto}
                className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Scale
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-700/70 bg-slate-950 flex items-center justify-center min-h-[160px] max-h-[220px]">
              <img
                src={photoUrl || createScalePhotoSvg('Pending Night Chicken Stock', totalWeightKg, `${selectedDate} 23:45`, chillerTemp)}
                alt="Night Closing Scale View"
                className="w-full h-full object-contain max-h-[200px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="cursor-pointer text-xs bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all">
                <Upload className="w-3.5 h-3.5 text-orange-400" />
                <span>📷 Snap / Upload Photo</span>
                {/* Mobile Camera Support */}
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  onChange={handleCustomUpload} 
                  className="hidden" 
                />
              </label>

              <span className="text-[10px] text-slate-400 font-mono">23:45 PM</span>
            </div>
          </div>

          {/* Formatted WhatsApp Output Preview */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                💬 WhatsApp Broadcast Draft
              </h3>
              <button
                onClick={handleCopyWhatsApp}
                className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-emerald-900/60"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <div className="bg-[#0b141a] p-3 rounded-xl border border-[#222e35] text-[10px] sm:text-[11px] text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
              {generatedWhatsAppMsg}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
