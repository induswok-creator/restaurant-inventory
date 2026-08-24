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
    currency 
  } = useInventory();

  // State for simulated WhatsApp input
  const [inputText, setInputText] = useState(`*INDUS WOK LATE-NIGHT CLOSING STOCK AUDIT*\n📅 Shift Date: ${selectedDate} | Logged: 04:00 AM (Kitchen Close)\n👤 Lead: Sunil Sharma\n❄️ Walk-in Chiller Temp: 2.2°C\n\n🍗 *Pending Chicken on ATOM Scale:*\n• Chicken Boneless (Breast/Thigh): 2.06 kg\n• Chicken Lollipop / Wings: 2.25 kg\n• Chicken Curry Cut: 2.25 kg\n• Whole Broiler Chicken: 2.25 kg\n• Marinated Tikka Batches: 2.25 kg\n• Chicken Keema: 2.25 kg\n\n📸 ATOM Scale photo attached. 03:30 PM crew please verify.`);

  const [senderName, setSenderName] = useState('Sunil Sharma (Shift Lead)');
  const [targetLogType, setTargetLogType] = useState('night');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const parsedData = parseWhatsAppMessage(inputText);

  const samplePresets = [
    {
      label: '🌙 04:00 AM Late-Night Close',
      type: 'night',
      text: `*INDUS WOK LATE-NIGHT CLOSING STOCK AUDIT*\n📅 Shift Date: ${selectedDate} | Logged: 04:00 AM (Kitchen Close)\n👤 Lead: Sunil Sharma\n❄️ Walk-in Chiller Temp: 2.2°C\n\n🍗 *Pending Chicken on ATOM Scale:*\n• Chicken Boneless (Breast/Thigh): 2.06 kg\n• Chicken Lollipop / Wings: 2.25 kg\n• Chicken Curry Cut: 2.25 kg\n• Whole Broiler Chicken: 2.25 kg\n• Marinated Tikka Batches: 2.25 kg\n• Chicken Keema: 2.25 kg\n\n📸 ATOM Scale photo attached. 03:30 PM crew please verify.`
    },
    {
      label: '☀️ 03:30 PM Opening Reconcile',
      type: 'morning',
      text: `*INDUS WOK 03:30 PM OPENING AUDIT*\n☀️ Shift Date: ${selectedDate} | Time: 03:30 PM (Before 4 PM Open)\n👤 Receiver: Rajesh Kumar\n❄️ Chiller Temp: 2.1°C\n\nPending Stock Verified on Scale:\n- Boneless Breast: 1.95 kg (0.11kg drip loss)\n- Lollipop / Wings: 2.15 kg\n- Curry Cut: 2.15 kg\n- Whole Broiler: 2.15 kg\n\nAll meat chilled and ready for 4:00 PM opening.`
    },
    {
      label: '🚚 03:45 PM Fresh Delivery Check-in',
      type: 'delivery',
      text: `*AL-MADINA POULTRY DELIVERY ARRIVED*\n🚚 Supplier: Al-Madina Chicken & Seafood\nInvoice #ALM-8241 | Delivery Time: 03:45 PM\nVehicle Temp: +1.8°C (Verified)\n\nReceived Fresh Stock:\n- Boneless Breast: 20 kg @ ₹248/kg\n- Chicken Lollipop: 10 kg @ ₹186/kg\n- Curry Cut: 15 kg @ ₹190/kg\n\nTotal Delivered: 45 kg. Checked before 4:00 PM opening.`
    }
  ];

  const handleApplyPreset = (preset) => {
    setInputText(preset.text);
    setTargetLogType(preset.type);
    if (preset.type === 'night') {
      setUploadedPhotoUrl('/scale-example.jpg');
    } else if (preset.type === 'delivery') {
      setUploadedPhotoUrl(createDeliveryChallanSvg('ALM-8241', 'Al-Madina Chicken', 45, '₹10,500', `${selectedDate} 03:45 PM`));
    } else {
      setUploadedPhotoUrl(createScalePhotoSvg('03:30 PM Opening Reconcile', 10.6, `${selectedDate} 15:30`));
    }
  };

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

  const handleSyncToSystem = () => {
    if (!parsedData) return;

    if (targetLogType === 'night') {
      logNightClosing(selectedDate, {
        staff: senderName,
        items: parsedData.items,
        photoUrl: uploadedPhotoUrl || '/scale-example.jpg',
        whatsAppMessage: inputText,
        chillerTemp: parsedData.temp || '2.2°C',
        timestamp: `${selectedDate} 04:00 AM`
      });
      setToastMessage('✅ 04:00 AM Night Closing Stock synced & logged!');
    } else if (targetLogType === 'morning') {
      logMorningOpening(selectedDate, {
        staff: senderName,
        items: parsedData.items,
        photoUrl: uploadedPhotoUrl || createScalePhotoSvg('03:30 PM Opening Reconcile', Object.values(parsedData.items).reduce((a, b) => a + b.weight, 0) || 12, `${selectedDate} 15:30`),
        notes: 'Verified via WhatsApp 03:30 PM Log',
        timestamp: `${selectedDate} 03:30 PM`
      });
      setToastMessage('✅ 03:30 PM Opening Stock reconciled & logged!');
    } else if (targetLogType === 'delivery') {
      logDeliveryReceived(selectedDate, {
        invoiceNo: parsedData.invoiceNo || 'ALM-8241',
        vendor: 'Al-Madina Chicken & Seafood',
        items: parsedData.items,
        deliveryTime: '03:45 PM',
        challanPhoto: uploadedPhotoUrl || createDeliveryChallanSvg('ALM-8241', 'Al-Madina Chicken', Object.values(parsedData.items).reduce((a, b) => a + b.weight, 0) || 45, `${currency}10,500`, `${selectedDate} 03:45 PM`),
        whatsAppMessage: inputText
      });
      setToastMessage('✅ Fresh Delivery received before 4:00 PM opening!');
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToastMessage('📋 Text copied to clipboard! Ready to paste into WhatsApp.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl sm:text-2xl shadow-lg shrink-0">
            💬
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 flex-wrap">
              <span>WhatsApp Group Ingest & Vision OCR</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                4 PM – 4 AM Timings
              </span>
            </h2>
            <p className="text-xs text-slate-400 hidden sm:block">
              Paste or type messages from your staff's WhatsApp group or snap ATOM scale photos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 ios-scroll">
          <button
            onClick={() => handleApplyPreset(samplePresets[0])}
            className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap active:scale-95 transition-all"
          >
            4 AM Close Msg
          </button>
          <button
            onClick={() => handleApplyPreset(samplePresets[2])}
            className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap active:scale-95 transition-all"
          >
            Delivery Msg
          </button>
        </div>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b141a] border border-[#222e35] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-[#202c33] px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2a3942]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                  🍗
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    <span>🐔 Indus Wok Kitchen Audit Group</span>
                  </h4>
                  <p className="text-[9px] text-slate-400">Sunil, Rajesh, Head Chef, Imran +2</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#111b21] p-1 rounded-lg border border-[#222e35] self-start sm:self-auto">
                <button
                  onClick={() => setTargetLogType('night')}
                  className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${
                    targetLogType === 'night' ? 'bg-orange-600 text-white' : 'text-slate-400'
                  }`}
                >
                  🌙 04:00 AM Close
                </button>
                <button
                  onClick={() => setTargetLogType('morning')}
                  className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${
                    targetLogType === 'morning' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  ☀️ 03:30 PM Open
                </button>
                <button
                  onClick={() => setTargetLogType('delivery')}
                  className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${
                    targetLogType === 'delivery' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  🚚 Delivery
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 space-y-3 bg-[#0c1317] bg-opacity-95">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 ios-scroll">
                {samplePresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(p)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-[#1f2c34] hover:bg-[#2a3942] text-emerald-400 border border-emerald-500/20 whitespace-nowrap"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-[#111b21] px-3 py-1.5 rounded-xl border border-[#222e35]">
                <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] text-slate-400">Sender:</span>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none flex-1 min-w-0"
                />
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={7}
                className="w-full bg-[#1f2c34] text-slate-100 text-xs font-mono p-3 rounded-xl border border-[#2a3942] focus:border-emerald-500 focus:outline-none leading-relaxed"
                placeholder="Type or paste WhatsApp message (e.g. Boneless: 2.06 kg, Wings: 2.25 kg)..."
              />

              <div className="p-3 bg-[#111b21] rounded-xl border border-[#222e35] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">Scale Photo Attached</span>
                  </div>
                  <label className="cursor-pointer text-[10px] bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Snap / Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-slate-700/60 bg-slate-950 flex items-center justify-center min-h-[140px] max-h-[180px]">
                  <img
                    src={uploadedPhotoUrl || '/scale-example.jpg'}
                    alt="Scale verification"
                    className="w-full h-full object-contain max-h-[170px]"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#202c33] border-t border-[#2a3942] flex items-center justify-between gap-2">
              <button
                onClick={() => copyToClipboard(inputText)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#111b21] border border-[#2a3942]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Text</span>
              </button>

              <button
                onClick={handleSyncToSystem}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-700/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sync to {targetLogType === 'night' ? '04:00 AM Close' : targetLogType === 'morning' ? '03:30 PM Reconcile' : 'Delivery'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Extractor */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      AI Extractor
                    </h3>
                    <p className="text-[9px] text-slate-400">Parsed from chat</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/60">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Shift Timing</span>
                  <p className="text-xs font-bold text-white mt-0.5 truncate">
                    {targetLogType === 'night' ? '🌙 04:00 AM Close' : targetLogType === 'morning' ? '☀️ 03:30 PM Open' : '🚚 03:45 PM Delivery'}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/60">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Chiller Temp</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">
                    {parsedData?.temp || '2.2°C ✓'}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                  Extracted Cuts ({Object.keys(parsedData?.items || {}).length}):
                </span>

                {parsedData && Object.keys(parsedData.items).length > 0 ? (
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1 ios-scroll">
                    {Object.entries(parsedData.items).map(([itemId, val]) => {
                      const itemObj = items.find(i => i.id === itemId);
                      return (
                        <div
                          key={itemId}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{itemObj?.icon || '🍗'}</span>
                            <span className="font-semibold text-white truncate max-w-[120px]">{itemObj?.name || itemId}</span>
                          </div>
                          <span className="font-mono font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/40">
                            {val.weight} {val.unit || 'kg'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-800/30 text-center text-xs text-slate-400">
                    No cuts recognized in text yet.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-orange-950/20 border border-orange-500/30 rounded-xl p-2.5 text-[10px] text-orange-200">
              💡 Calibrated for Indus Wok 4:00 PM – 4:00 AM operating hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
