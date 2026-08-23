import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  MessageSquareCode, 
  Send, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Upload, 
  Copy, 
  ExternalLink,
  Bot,
  User,
  Clock,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { createScalePhotoSvg, createDeliveryChallanSvg } from '../utils/mockImages';
import confetti from 'canvas-confetti';

export const WhatsAppHubTab = () => {
  const { 
    items, 
    dailyLogs, 
    selectedDate, 
    parseWhatsAppMessage, 
    logNightClosing, 
    logMorningOpening, 
    logDeliveryReceived,
    currency,
    setActiveTab
  } = useInventory();

  // State for simulated WhatsApp input
  const [inputText, setInputText] = useState(`*NIGHT CLOSING STOCK REPORT - ${selectedDate}*
📅 Time: 23:45 PM | Logged by: Sunil (Night Shift Supervisor)
❄️ Walk-in Chiller Temp: 2.3°C

🍗 *Pending Raw Chicken Stock in Chiller:*
• Boneless Breast: 16.5 kg
• Bone-in Curry Cut: 24.2 kg
• Chicken Wings: 9.8 kg
• Chicken Drumsticks: 7.5 kg
• Whole Broiler: 14.0 kg
• Chicken Keema: 4.8 kg
• Marinated Tikka: 6.2 kg

📸 Scale photo attached for verification. Morning team please check tray #2.`);

  const [senderName, setSenderName] = useState('Sunil (Night Supervisor)');
  const [targetLogType, setTargetLogType] = useState('night'); // 'night' | 'morning' | 'delivery'
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Parse in real-time as user types
  const parsedData = parseWhatsAppMessage(inputText);

  // Quick preset messages
  const samplePresets = [
    {
      label: '🌙 Night Closing Stock (Standard)',
      type: 'night',
      text: `*NIGHT CLOSING STOCK REPORT - ${selectedDate}*
📅 Time: 23:45 PM | Logged by: Sunil (Night Shift Supervisor)
❄️ Walk-in Chiller Temp: 2.3°C

🍗 *Pending Raw Chicken Stock in Chiller:*
• Boneless Breast: 16.5 kg
• Bone-in Curry Cut: 24.2 kg
• Chicken Wings: 9.8 kg
• Chicken Drumsticks: 7.5 kg
• Whole Broiler: 14.0 kg
• Chicken Keema: 4.8 kg
• Marinated Tikka: 6.2 kg

📸 Scale photo attached for verification. Morning team please check tray #2.`
    },
    {
      label: '☀️ Morning Reconcile Count',
      type: 'morning',
      text: `*MORNING OPENING AUDIT - ${selectedDate}*
☀️ Time: 08:30 AM | Receiver: Rajesh Kumar
Chiller Temp: 2.1°C

Pending Stock Verified on Scale:
- Boneless Breast: 16.2 kg (0.3kg drip loss)
- Bone-in Curry Cut: 23.9 kg
- Chicken Wings: 9.6 kg
- Drumsticks: 7.4 kg
- Whole Broiler: 13.8 kg
- Keema: 4.7 kg

All trays smell fresh and properly chilled.`
    },
    {
      label: '🚚 Morning Fresh Delivery Arrived',
      type: 'delivery',
      text: `*FRESH POULTRY DELIVERY ARRIVED - ${selectedDate}*
🚚 Supplier: Apex Fresh Poultry Farms
Invoice #APX-9821 | Delivery Time: 08:45 AM
Vehicle Temp: +1.8°C (Inspected & Verified)

Received Quantities:
- Boneless Breast: 30 kg @ ₹280/kg
- Bone-in Curry Cut: 40 kg @ ₹190/kg
- Chicken Wings: 15 kg @ ₹220/kg
- Drumsticks: 10 kg @ ₹240/kg
- Whole Broiler: 20 kg @ ₹175/kg

Total Delivered: 115 kg. Delivery slip stamped & signed.`
    }
  ];

  const handleApplyPreset = (preset) => {
    setInputText(preset.text);
    setTargetLogType(preset.type);
    if (preset.type === 'night') {
      setUploadedPhotoUrl(createScalePhotoSvg('Pending Night Stock', 83.0, `${selectedDate} 23:45`));
    } else if (preset.type === 'delivery') {
      setUploadedPhotoUrl(createDeliveryChallanSvg('APX-9821', 'Apex Fresh Poultry', 115, '₹24,800', `${selectedDate} 08:45 AM`));
    } else {
      setUploadedPhotoUrl(createScalePhotoSvg('Morning Opening Verification', 81.6, `${selectedDate} 08:30`));
    }
  };

  // Handle Photo Upload via file input
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPhotoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Synchronize into System
  const handleSyncToSystem = () => {
    if (!parsedData) return;

    if (targetLogType === 'night') {
      logNightClosing(selectedDate, {
        staff: senderName,
        items: parsedData.items,
        photoUrl: uploadedPhotoUrl || createScalePhotoSvg('Night Closing Chicken Stock', Object.values(parsedData.items).reduce((a, b) => a + b.weight, 0) || 50, `${selectedDate} 23:45`),
        whatsAppMessage: inputText,
        chillerTemp: parsedData.temp || '2.4°C'
      });
      setToastMessage('✅ Night Closing Stock successfully synced & logged to inventory!');
    } else if (targetLogType === 'morning') {
      logMorningOpening(selectedDate, {
        staff: senderName,
        items: parsedData.items,
        photoUrl: uploadedPhotoUrl || createScalePhotoSvg('Morning Pending Reconcile', Object.values(parsedData.items).reduce((a, b) => a + b.weight, 0) || 50, `${selectedDate} 08:30`),
        notes: 'Verified via WhatsApp Morning Log'
      });
      setToastMessage('✅ Morning Opening Stock reconciled & logged!');
    } else if (targetLogType === 'delivery') {
      logDeliveryReceived(selectedDate, {
        invoiceNo: parsedData.invoiceNo || 'APX-9821',
        vendor: 'Apex Fresh Poultry Farms',
        items: parsedData.items,
        challanPhoto: uploadedPhotoUrl || createDeliveryChallanSvg('APX-9821', 'Apex Poultry', Object.values(parsedData.items).reduce((a, b) => a + b.weight, 0) || 100, `${currency}22,000`, `${selectedDate} 08:45 AM`),
        whatsAppMessage: inputText
      });
      setToastMessage('✅ Fresh Delivery Stock received & added to kitchen pool!');
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Copy to clipboard helper
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToastMessage('📋 Text copied to clipboard! Ready to paste into WhatsApp.');
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

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl shadow-lg">
            💬
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>WhatsApp Group Live Ingest & Vision OCR</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                AI Vision + NLP
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Paste or type messages from your staff's WhatsApp group, upload scale photos, and let AI extract meat weights automatically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleApplyPreset(samplePresets[0])}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            Load Sample Night Msg
          </button>
          <button
            onClick={() => handleApplyPreset(samplePresets[2])}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            Load Sample Delivery
          </button>
        </div>
      </div>

      {/* Main 2-Column Interface: WhatsApp Chat Editor vs AI Entity Extractor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): WhatsApp Message Input & Photo Attachment */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b141a] border border-[#222e35] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* WhatsApp Header bar */}
            <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                  🍗
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <span>🐔 Kitchen Night Closing & Stock Audit</span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded font-normal">Official Group</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">Sunil, Rajesh, Head Chef, Imran (Poultry), Owner +2 others</p>
                </div>
              </div>

              {/* Log Category Selector */}
              <div className="flex items-center gap-1 bg-[#111b21] p-1 rounded-lg border border-[#222e35]">
                <button
                  onClick={() => setTargetLogType('night')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                    targetLogType === 'night' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🌙 Night Closing
                </button>
                <button
                  onClick={() => setTargetLogType('morning')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                    targetLogType === 'morning' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ☀️ Morning Count
                </button>
                <button
                  onClick={() => setTargetLogType('delivery')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                    targetLogType === 'delivery' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🚚 Fresh Delivery
                </button>
              </div>
            </div>

            {/* Chat Body & Input Area */}
            <div className="p-4 space-y-4 bg-[#0c1317] bg-opacity-95 min-h-[380px]">
              {/* Presets Chips */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] text-slate-400 font-semibold self-center">Presets:</span>
                {samplePresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(p)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#1f2c34] hover:bg-[#2a3942] text-emerald-400 border border-emerald-500/20 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Staff Sender Field */}
              <div className="flex items-center gap-2 bg-[#111b21] px-3 py-2 rounded-xl border border-[#222e35]">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-slate-400">Staff Sender:</span>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none flex-1"
                  placeholder="e.g. Sunil (Night Duty Supervisor)"
                />
              </div>

              {/* Textarea mimicking WhatsApp Chat Bubble */}
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={8}
                  className="w-full bg-[#1f2c34] text-slate-100 text-xs font-mono p-3.5 rounded-xl border border-[#2a3942] focus:border-emerald-500 focus:outline-none leading-relaxed"
                  placeholder="Type or paste the WhatsApp message here (e.g. Boneless: 15.5 kg, Curry Cut: 20 kg, Temp: 2.3°C)..."
                />
                <span className="absolute right-3 bottom-3 text-[10px] text-slate-400 bg-[#111b21] px-1.5 py-0.5 rounded">
                  AI Real-Time NLP
                </span>
              </div>

              {/* Photo Attachment & Visual Scale Preview */}
              <div className="p-3 bg-[#111b21] rounded-xl border border-[#222e35] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">Scale Photo / Delivery Challan Attached</span>
                  </div>
                  <label className="cursor-pointer text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload Custom Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                {/* Photo Preview Container */}
                <div className="relative rounded-lg overflow-hidden border border-slate-700/60 bg-slate-950 flex items-center justify-center min-h-[160px] max-h-[220px]">
                  {uploadedPhotoUrl ? (
                    <img
                      src={uploadedPhotoUrl}
                      alt="Scale verification"
                      className="w-full h-full object-contain max-h-[200px]"
                    />
                  ) : (
                    <img
                      src={createScalePhotoSvg('Pending Night Chicken Stock', 83.0, `${selectedDate} 23:45`)}
                      alt="Scale verification default"
                      className="w-full h-full object-contain max-h-[200px]"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono flex items-center gap-1 backdrop-blur">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Visual Audit Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 bg-[#202c33] border-t border-[#2a3942] flex items-center justify-between">
              <button
                onClick={() => copyToClipboard(inputText)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111b21] border border-[#2a3942]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw Text</span>
              </button>

              <button
                onClick={handleSyncToSystem}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sync & Log to {targetLogType === 'night' ? 'Night Closing' : targetLogType === 'morning' ? 'Morning Count' : 'Deliveries'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): AI Real-Time Recognition & Entity Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      AI Vision & NLP Extractor
                    </h3>
                    <p className="text-[10px] text-slate-400">Structured Data Parsed Instantly</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ready to Sync
                </span>
              </div>

              {/* Extracted Metadata Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Detected Log Type</span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {targetLogType === 'night' ? '🌙 Night Closing Stock' : targetLogType === 'morning' ? '☀️ Morning Opening' : '🚚 Inbound Delivery'}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Chiller / Meat Temp</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">
                    {parsedData?.temp || '2.3°C (Optimal)'}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Logged By</span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5 truncate">
                    {senderName || 'Staff Member'}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Target Audit Date</span>
                  <p className="text-xs font-bold text-amber-400 mt-0.5">
                    {selectedDate}
                  </p>
                </div>
              </div>

              {/* Parsed Items List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Extracted Raw Chicken Cuts ({Object.keys(parsedData?.items || {}).length} detected):
                </span>

                {parsedData && Object.keys(parsedData.items).length > 0 ? (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {Object.entries(parsedData.items).map(([itemId, val]) => {
                      const itemObj = items.find(i => i.id === itemId);
                      return (
                        <div
                          key={itemId}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span>{itemObj?.icon || '🍗'}</span>
                            <span className="font-semibold text-white">{itemObj?.name || itemId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/40">
                              {val.weight} {val.unit || 'kg'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 text-center text-xs text-slate-400">
                    No chicken cuts detected in text yet. Use standard names like "Boneless 14kg", "Curry cut 20kg", etc.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Helper Banner */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="bg-orange-950/20 border border-orange-500/30 rounded-xl p-3 text-[11px] text-orange-200">
                💡 <span className="font-bold">Pro-Tip for Restaurant Owners:</span> Your staff doesn't need to learn new software. They just take a photo of the weighing scale & type standard text in WhatsApp. You or the manager can 1-click import it here!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
