import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Sun, 
  Truck, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Sparkles, 
  Copy, 
  Camera, 
  ThermometerSnowflake, 
  User, 
  FileText,
  Upload,
  ArrowRight,
  TrendingDown,
  ShieldAlert
} from 'lucide-react';
import { createScalePhotoSvg, createDeliveryChallanSvg } from '../utils/mockImages';
import confetti from 'canvas-confetti';

export const MorningReceivingTab = () => {
  const { 
    items, 
    suppliers,
    dailyLogs, 
    selectedDate, 
    getLogForDate, 
    logMorningOpening, 
    logDeliveryReceived, 
    currency 
  } = useInventory();

  const currentLog = getLogForDate(selectedDate);
  const nightClosing = currentLog?.nightClosing;
  const morningOpening = currentLog?.morningOpening;
  const deliveryReceived = currentLog?.deliveryReceived;

  // Active Sub-Tab: 'opening-audit' | 'delivery-intake'
  const [subTab, setSubTab] = useState('opening-audit');

  // Form State - Morning Opening Reconcile
  const [morningStaff, setMorningStaff] = useState(morningOpening?.staff || 'Rajesh Kumar (Morning Lead)');
  const [morningCounts, setMorningCounts] = useState(() => {
    const init = {};
    items.forEach(it => {
      // Default to night closing weight minus minor drip loss (0.2kg) or night closing
      const nightW = nightClosing?.items?.[it.id]?.weight;
      if (morningOpening?.items?.[it.id]?.weight !== undefined) {
        init[it.id] = morningOpening.items[it.id].weight;
      } else if (nightW !== undefined) {
        init[it.id] = Math.max(0, Number((nightW - 0.2).toFixed(1)));
      } else {
        init[it.id] = (it.minParKg * 0.8).toFixed(1);
      }
    });
    return init;
  });

  // Form State - Delivery Receiving
  const [selectedSupplier, setSelectedSupplier] = useState(deliveryReceived?.vendor || suppliers[0]?.name || 'Apex Fresh Poultry Farms');
  const [invoiceNo, setInvoiceNo] = useState(deliveryReceived?.invoiceNo || `APX-${Math.floor(8400 + Math.random() * 500)}`);
  const [vehicleTemp, setVehicleTemp] = useState(deliveryReceived?.vehicleTemp || '+1.8°C');
  const [deliveryCounts, setDeliveryCounts] = useState(() => {
    const init = {};
    items.forEach(it => {
      init[it.id] = {
        weight: deliveryReceived?.items?.[it.id]?.weight || (it.minParKg * 1.2).toFixed(1),
        unitPrice: deliveryReceived?.items?.[it.id]?.unitPrice || it.defaultCostPerUnit
      };
    });
    return init;
  });

  const [challanPhotoUrl, setChallanPhotoUrl] = useState(deliveryReceived?.challanPhoto || null);
  const [morningPhotoUrl, setMorningPhotoUrl] = useState(morningOpening?.photoUrl || null);
  const [toastMessage, setToastMessage] = useState(null);

  // Re-sync when selectedDate changes
  useEffect(() => {
    if (morningOpening) {
      setMorningStaff(morningOpening.staff || 'Rajesh Kumar (Morning Lead)');
      const counts = {};
      items.forEach(it => {
        counts[it.id] = morningOpening.items?.[it.id]?.weight || 0;
      });
      setMorningCounts(counts);
      setMorningPhotoUrl(morningOpening.photoUrl);
    }

    if (deliveryReceived) {
      setSelectedSupplier(deliveryReceived.vendor || suppliers[0]?.name);
      setInvoiceNo(deliveryReceived.invoiceNo);
      setVehicleTemp(deliveryReceived.vehicleTemp || '+1.8°C');
      const dCounts = {};
      items.forEach(it => {
        dCounts[it.id] = {
          weight: deliveryReceived.items?.[it.id]?.weight || 0,
          unitPrice: deliveryReceived.items?.[it.id]?.unitPrice || it.defaultCostPerUnit
        };
      });
      setDeliveryCounts(dCounts);
      setChallanPhotoUrl(deliveryReceived.challanPhoto);
    }
  }, [selectedDate, currentLog]);

  // Calculations for Morning Opening
  const totalMorningOpeningKg = Number(Object.values(morningCounts).reduce((a, b) => Number(a) + (Number(b) || 0), 0).toFixed(2));
  const totalNightClosingKg = nightClosing ? Number(Object.values(nightClosing.items || {}).reduce((a, b) => Number(a) + (Number(b.weight) || 0), 0).toFixed(2)) : 0;
  const overnightVarianceKg = nightClosing ? Number((totalNightClosingKg - totalMorningOpeningKg).toFixed(2)) : 0;

  // Calculations for Delivery Intake
  let totalDeliveryKg = 0;
  let totalDeliveryCost = 0;
  items.forEach(it => {
    const w = Number(deliveryCounts[it.id]?.weight) || 0;
    const p = Number(deliveryCounts[it.id]?.unitPrice) || it.defaultCostPerUnit;
    totalDeliveryKg += w;
    totalDeliveryCost += (w * p);
  });
  totalDeliveryKg = Number(totalDeliveryKg.toFixed(2));
  totalDeliveryCost = Math.round(totalDeliveryCost);

  // Total Available for Day
  const totalAvailableStockKg = Number((totalMorningOpeningKg + totalDeliveryKg).toFixed(2));

  // Handlers
  const handleSaveMorningOpening = () => {
    const structuredItems = {};
    items.forEach(it => {
      structuredItems[it.id] = {
        weight: parseFloat(morningCounts[it.id]) || 0,
        unit: it.unit
      };
    });

    const photo = morningPhotoUrl || createScalePhotoSvg('Morning Pending Reconcile', totalMorningOpeningKg, `${selectedDate} 08:30`);

    logMorningOpening(selectedDate, {
      staff: morningStaff,
      items: structuredItems,
      photoUrl: photo,
      notes: `Overnight drip variance: -${overnightVarianceKg} kg`
    });

    setToastMessage('✅ Morning Pending Stock verified & reconciled with night closing!');
    confetti({ particleCount: 35, spread: 50 });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveDeliveryReceived = () => {
    const structuredItems = {};
    items.forEach(it => {
      structuredItems[it.id] = {
        weight: parseFloat(deliveryCounts[it.id]?.weight) || 0,
        unitPrice: parseFloat(deliveryCounts[it.id]?.unitPrice) || it.defaultCostPerUnit,
        totalCost: (parseFloat(deliveryCounts[it.id]?.weight) || 0) * (parseFloat(deliveryCounts[it.id]?.unitPrice) || it.defaultCostPerUnit)
      };
    });

    const challanPhoto = challanPhotoUrl || createDeliveryChallanSvg(invoiceNo, selectedSupplier, totalDeliveryKg, `${currency}${totalDeliveryCost.toLocaleString()}`, `${selectedDate} 08:45 AM`);

    logDeliveryReceived(selectedDate, {
      invoiceNo,
      vendor: selectedSupplier,
      vehicleTemp,
      items: structuredItems,
      challanPhoto
    });

    setToastMessage(`✅ ${totalDeliveryKg} kg Fresh Chicken from ${selectedSupplier} successfully added to today's inventory!`);
    confetti({ particleCount: 45, spread: 60 });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // WhatsApp Recap Generator
  const generatedMorningWhatsAppMsg = `*MORNING OPENING & FRESH POULTRY DELIVERY REPORT - ${selectedDate}*\n` +
    `🏢 The Tandoor & Grill Kitchen\n` +
    `☀️ Shift Lead: ${morningStaff} | Time: 09:00 AM\n\n` +
    `📊 *1. Morning Reconciled Stock:* ${totalMorningOpeningKg} kg (Overnight Drip Variance: -${overnightVarianceKg} kg)\n` +
    `🚚 *2. Fresh Delivery Recvd:* ${totalDeliveryKg} kg (${selectedSupplier} | Inv #${invoiceNo})\n` +
    `💰 Delivery Bill: ${currency}${totalDeliveryCost.toLocaleString()} | Vehicle Temp: ${vehicleTemp} ✓\n\n` +
    `🍗 *Total Meat Available for Today's Service:* *${totalAvailableStockKg} kg*\n` +
    `Challan & Scale photos verified. Kitchen prep ready to commence.`;

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
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl shadow-lg">
            ☀️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Morning Opening & Delivery Intake</h2>
              <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {selectedDate} (Morning Shift)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cross-check morning pending stock against night closing photos, then log newly arrived poultry crates and invoice slips.
            </p>
          </div>
        </div>

        {/* Tab Switcher: Opening vs Delivery */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('opening-audit')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              subTab === 'opening-audit' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>1. Reconcile Morning Stock</span>
          </button>
          <button
            onClick={() => setSubTab('delivery-intake')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              subTab === 'delivery-intake' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>2. Log Fresh Delivery ({totalDeliveryKg} kg)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Night Closing (Recorded)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-extrabold text-slate-300">{totalNightClosingKg}</span>
            <span className="text-xs text-slate-400">KG</span>
          </div>
          <span className="text-[10px] text-slate-400">{nightClosing ? `By ${nightClosing.staff}` : 'Not logged yet'}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Morning Pending Count</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-extrabold text-amber-400">{totalMorningOpeningKg}</span>
            <span className="text-xs text-slate-400">KG</span>
          </div>
          <span className="text-[10px] text-emerald-400">Scale verified</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Overnight Drip / Thaw Loss</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-lg font-extrabold ${overnightVarianceKg > 1.5 ? 'text-red-400' : 'text-emerald-400'}`}>
              -{overnightVarianceKg}
            </span>
            <span className="text-xs text-slate-400">KG</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {overnightVarianceKg > 1.5 ? '⚠️ Unusually high loss!' : 'Normal refrigerator drip (<2%)'}
          </span>
        </div>

        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 p-3.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Kitchen Meat Ready Today</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-emerald-300">{totalAvailableStockKg}</span>
            <span className="text-xs text-slate-400">KG</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">(Morning Stock + New Delivery)</span>
        </div>
      </div>

      {/* View 1: Morning Opening Reconcile */}
      {subTab === 'opening-audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Morning Physical Count vs Night Closing Audit
                </h3>
                <p className="text-[11px] text-slate-400">Identify overnight shrinkage, thaw loss, or discrepancies</p>
              </div>
              <button
                onClick={handleSaveMorningOpening}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Morning Reconcile</span>
              </button>
            </div>

            {/* Shift Lead Input */}
            <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
              <User className="w-4 h-4 text-amber-400" />
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 font-bold block">Morning Shift Receiver:</span>
                <input
                  type="text"
                  value={morningStaff}
                  onChange={(e) => setMorningStaff(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Comparison Table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 px-3 uppercase">
                <span className="col-span-5">Raw Chicken Cut</span>
                <span className="col-span-2 text-right">Night Closing</span>
                <span className="col-span-3 text-right">Morning Scale</span>
                <span className="col-span-2 text-right">Variance</span>
              </div>

              {items.map((item) => {
                const nightWeight = nightClosing?.items?.[item.id]?.weight || 0;
                const morningWeight = Number(morningCounts[item.id]) || 0;
                const diff = Number((morningWeight - nightWeight).toFixed(2));
                const isLoss = diff < -0.6;

                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 items-center p-3 rounded-xl border transition-all ${
                      isLoss 
                        ? 'bg-red-950/20 border-red-500/40' 
                        : 'bg-slate-800/40 border-slate-700/60'
                    }`}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <span>{item.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <span className="text-[10px] text-slate-400">{item.category}</span>
                      </div>
                    </div>

                    <div className="col-span-2 text-right font-mono text-xs text-slate-300">
                      {nightWeight} <span className="text-[10px] text-slate-500">{item.unit}</span>
                    </div>

                    <div className="col-span-3 flex justify-end">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={morningCounts[item.id] || ''}
                        onChange={(e) => setMorningCounts({ ...morningCounts, [item.id]: e.target.value })}
                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold text-right focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="col-span-2 text-right font-mono text-xs font-bold">
                      <span className={diff < 0 ? (isLoss ? 'text-red-400 font-extrabold' : 'text-amber-400') : 'text-emerald-400'}>
                        {diff > 0 ? `+${diff}` : `${diff}`} {item.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Visual Comparison (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Night Closing Photo Reference */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-orange-400" />
                  <h4 className="text-xs font-bold text-white uppercase">Night Scale Photo Proof</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">23:45 PM Log</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-h-44 flex items-center justify-center">
                <img
                  src={nightClosing?.photoUrl || createScalePhotoSvg('Pending Night Stock', totalNightClosingKg, `${selectedDate} 23:45`)}
                  alt="Night closing audit"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Morning Scale Photo Container */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase">Morning Reconcile Photo</h4>
                </div>
                <label className="cursor-pointer text-[10px] text-amber-400 hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Upload Photo
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => setMorningPhotoUrl(evt.target.result);
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-h-44 flex items-center justify-center">
                <img
                  src={morningPhotoUrl || createScalePhotoSvg('Morning Reconcile Count', totalMorningOpeningKg, `${selectedDate} 08:30`)}
                  alt="Morning opening audit"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Fresh Stock Delivery Intake */}
      {subTab === 'delivery-intake' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Delivery Form (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Log Fresh Poultry Delivery (Arrived Today)
                </h3>
                <p className="text-[11px] text-slate-400">Record crates received, supplier rates, and verified weight</p>
              </div>
              <button
                onClick={handleSaveDeliveryReceived}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Delivery Check-in</span>
              </button>
            </div>

            {/* Delivery Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Supplier / Poultry Vendor</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full bg-slate-900 text-xs font-semibold text-white border border-slate-700 rounded-lg p-1.5 focus:outline-none focus:border-emerald-500"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Invoice / Challan #</label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full bg-slate-900 text-xs font-mono font-bold text-white border border-slate-700 rounded-lg p-1.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Vehicle Temp (HACCP)</label>
                <input
                  type="text"
                  value={vehicleTemp}
                  onChange={(e) => setVehicleTemp(e.target.value)}
                  className="w-full bg-slate-900 text-xs font-bold text-emerald-400 border border-slate-700 rounded-lg p-1.5 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Itemized Delivery Inputs */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 px-3 uppercase">
                <span className="col-span-5">Raw Chicken Cut</span>
                <span className="col-span-3 text-right">Received (KG)</span>
                <span className="col-span-2 text-right">Rate/KG</span>
                <span className="col-span-2 text-right">Amount</span>
              </div>

              {items.map((item) => {
                const w = Number(deliveryCounts[item.id]?.weight) || 0;
                const p = Number(deliveryCounts[item.id]?.unitPrice) || item.defaultCostPerUnit;
                const cost = Math.round(w * p);

                return (
                  <div 
                    key={item.id}
                    className="grid grid-cols-12 items-center p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all"
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <span className="text-[10px] text-slate-400">{item.category}</span>
                      </div>
                    </div>

                    <div className="col-span-3 flex justify-end">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={deliveryCounts[item.id]?.weight ?? ''}
                        onChange={(e) => setDeliveryCounts({
                          ...deliveryCounts,
                          [item.id]: {
                            ...deliveryCounts[item.id],
                            weight: e.target.value
                          }
                        })}
                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold text-right focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <input
                        type="number"
                        min="0"
                        value={deliveryCounts[item.id]?.unitPrice ?? item.defaultCostPerUnit}
                        onChange={(e) => setDeliveryCounts({
                          ...deliveryCounts,
                          [item.id]: {
                            ...deliveryCounts[item.id],
                            unitPrice: e.target.value
                          }
                        })}
                        className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-1 text-xs text-slate-300 font-mono text-right focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="col-span-2 text-right font-mono text-xs font-bold text-emerald-400">
                      {currency}{cost.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Delivery Summary */}
            <div className="mt-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300">Total Delivery Weight:</span>
                <span className="text-base font-extrabold text-emerald-400 ml-2">{totalDeliveryKg} KG</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-300">Total Invoiced:</span>
                <span className="text-base font-extrabold text-white ml-2">{currency}{totalDeliveryCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right Challan & WhatsApp Broadcast (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Challan Photo Preview */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase">Supplier Challan / Bill Photo</h4>
                </div>
                <label className="cursor-pointer text-[10px] text-emerald-400 hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Upload Bill
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => setChallanPhotoUrl(evt.target.result);
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-h-56 flex items-center justify-center">
                <img
                  src={challanPhotoUrl || createDeliveryChallanSvg(invoiceNo, selectedSupplier, totalDeliveryKg, `${currency}${totalDeliveryCost.toLocaleString()}`, `${selectedDate} 08:45 AM`)}
                  alt="Delivery Challan Proof"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Formatted Morning WhatsApp Message */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-white uppercase">💬 WhatsApp Morning Recap</h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedMorningWhatsAppMsg);
                    setToastMessage('📋 Morning report copied to clipboard!');
                    setTimeout(() => setToastMessage(null), 2500);
                  }}
                  className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-emerald-900/60"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div className="bg-[#0b141a] p-3 rounded-xl border border-[#222e35] text-[11px] text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                {generatedMorningWhatsAppMsg}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
