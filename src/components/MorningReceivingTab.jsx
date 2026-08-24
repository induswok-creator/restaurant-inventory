import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { AddVendorModal } from './AddVendorModal';
import { ScalePhotoUploader } from './ScalePhotoUploader';
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
  ShieldAlert, 
  Plus, 
  Minus, 
  Clock 
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

  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const currentLog = getLogForDate(selectedDate);
  const nightClosing = currentLog?.nightClosing;
  const morningOpening = currentLog?.morningOpening;
  const deliveryReceived = currentLog?.deliveryReceived;

  // Active Sub-Tab: 'opening-audit' | 'delivery-intake'
  const [subTab, setSubTab] = useState('opening-audit');

  // Form State - Opening Reconcile at 03:30 PM
  const [morningStaff, setMorningStaff] = useState(morningOpening?.staff || 'Rajesh Kumar (Indus Wok Lead)');
  const [morningCounts, setMorningCounts] = useState(() => {
    const init = {};
    items.forEach(it => {
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

  // Form State - Delivery Receiving at 03:45 PM
  const [selectedSupplier, setSelectedSupplier] = useState(deliveryReceived?.vendor || suppliers[0]?.name || 'Al-Madina Chicken & Seafood');
  const [invoiceNo, setInvoiceNo] = useState(deliveryReceived?.invoiceNo || `ALM-${Math.floor(8200 + Math.random() * 500)}`);
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
      setMorningStaff(morningOpening.staff || 'Rajesh Kumar (Indus Wok Lead)');
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

  // Calculations
  const totalMorningOpeningKg = Number(Object.values(morningCounts).reduce((a, b) => Number(a) + (Number(b) || 0), 0).toFixed(2));
  const totalNightClosingKg = nightClosing ? Number(Object.values(nightClosing.items || {}).reduce((a, b) => Number(a) + (Number(b.weight) || 0), 0).toFixed(2)) : 0;
  const overnightVarianceKg = nightClosing ? Number((totalNightClosingKg - totalMorningOpeningKg).toFixed(2)) : 0;

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

  const totalAvailableStockKg = Number((totalMorningOpeningKg + totalDeliveryKg).toFixed(2));

  const adjustMorningCount = (itemId, delta) => {
    const cur = parseFloat(morningCounts[itemId]) || 0;
    const nextVal = Math.max(0, Number((cur + delta).toFixed(1)));
    setMorningCounts({ ...morningCounts, [itemId]: nextVal });
  };

  const adjustDeliveryWeight = (itemId, delta) => {
    const cur = parseFloat(deliveryCounts[itemId]?.weight) || 0;
    const nextVal = Math.max(0, Number((cur + delta).toFixed(1)));
    setDeliveryCounts({
      ...deliveryCounts,
      [itemId]: { ...deliveryCounts[itemId], weight: nextVal }
    });
  };

  // Handlers
  const handleSaveMorningOpening = () => {
    const structuredItems = {};
    items.forEach(it => {
      structuredItems[it.id] = {
        weight: parseFloat(morningCounts[it.id]) || 0,
        unit: it.unit
      };
    });

    const photo = morningPhotoUrl || createScalePhotoSvg('03:30 PM Opening Reconcile', totalMorningOpeningKg, `${selectedDate} 15:30`);

    logMorningOpening(selectedDate, {
      staff: morningStaff,
      items: structuredItems,
      photoUrl: photo,
      notes: `Overnight drip variance: -${overnightVarianceKg} kg`,
      timestamp: `${selectedDate} 03:30 PM`
    });

    setToastMessage('✅ 03:30 PM opening stock verified & reconciled!');
    confetti({ particleCount: 35, spread: 50 });
    setTimeout(() => setToastMessage(null), 3000);
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

    const challanPhoto = challanPhotoUrl || createDeliveryChallanSvg(invoiceNo, selectedSupplier, totalDeliveryKg, `${currency}${totalDeliveryCost.toLocaleString()}`, `${selectedDate} 03:45 PM`);

    logDeliveryReceived(selectedDate, {
      invoiceNo,
      vendor: selectedSupplier,
      vehicleTemp,
      items: structuredItems,
      deliveryTime: '03:45 PM',
      challanPhoto
    });

    setToastMessage(`✅ ${totalDeliveryKg} kg fresh chicken received before 4 PM opening!`);
    confetti({ particleCount: 45, spread: 60 });
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
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl sm:text-2xl shadow-lg shrink-0">
            ☀️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white">Opening Reconcile & Fresh Delivery Intake</h2>
              <span className="text-[11px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                03:30 PM (Opening for 4 PM – 4 AM Shift)
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Verify pending stock against 4:00 AM closing, then log newly arrived poultry crates before 4:00 PM opening.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setSubTab('opening-audit')}
            className={`flex-1 sm:flex-none px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'opening-audit' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>1. 03:30 PM Reconcile</span>
          </button>
          <button
            onClick={() => setSubTab('delivery-intake')}
            className={`flex-1 sm:flex-none px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'delivery-intake' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>2. Delivery Intake</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">4:00 AM Closing</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-lg font-extrabold text-slate-300">{totalNightClosingKg}</span>
            <span className="text-xs text-slate-400">KG</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">03:30 PM Opening</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-lg font-extrabold text-amber-400">{totalMorningOpeningKg}</span>
            <span className="text-xs text-slate-400">KG</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Overnight Drip</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-base sm:text-lg font-extrabold ${overnightVarianceKg > 1.5 ? 'text-red-400' : 'text-emerald-400'}`}>
              -{overnightVarianceKg}
            </span>
            <span className="text-xs text-slate-400">KG</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 p-3 rounded-xl">
          <span className="text-[9px] uppercase font-bold text-emerald-400 block">Total Ready (4 PM – 4 AM)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-xl font-extrabold text-emerald-300">{totalAvailableStockKg}</span>
            <span className="text-xs text-slate-400">KG</span>
          </div>
        </div>
      </div>

      {/* View 1: 03:30 PM Opening Reconcile */}
      {subTab === 'opening-audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                03:30 PM Physical Count vs 4:00 AM Closing
              </h3>
              <button
                onClick={handleSaveMorningOpening}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-amber-600/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Reconcile</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/60">
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] text-slate-400 font-bold block">Opening Shift Lead:</span>
                <input
                  type="text"
                  value={morningStaff}
                  onChange={(e) => setMorningStaff(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none w-full truncate"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {items.map((item) => {
                const nightWeight = nightClosing?.items?.[item.id]?.weight || 0;
                const morningWeight = Number(morningCounts[item.id]) || 0;
                const diff = Number((morningWeight - nightWeight).toFixed(2));
                const isLoss = diff < -0.6;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border transition-all space-y-2 ${
                      isLoss ? 'bg-red-950/20 border-red-500/40' : 'bg-slate-800/40 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">4 AM Close: {nightWeight} {item.unit}</span>
                        </div>
                      </div>

                      {/* Steppers */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustMorningCount(item.id, -0.5)}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={morningCounts[item.id] || ''}
                          onChange={(e) => setMorningCounts({ ...morningCounts, [item.id]: e.target.value })}
                          className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-amber-500"
                        />

                        <button
                          type="button"
                          onClick={() => adjustMorningCount(item.id, 0.5)}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-700/40">
                      <span className="text-slate-400">Overnight Thaw Variance:</span>
                      <span className={`font-mono font-bold ${diff < 0 ? (isLoss ? 'text-red-400' : 'text-amber-400') : 'text-emerald-400'}`}>
                        {diff > 0 ? `+${diff}` : `${diff}`} {item.unit} {diff < 0 ? '(thaw loss)' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase">📷 Scale Photo Proof</span>
                <label className="cursor-pointer text-[10px] text-amber-400 hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Snap Photo
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
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
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-h-52 flex items-center justify-center">
                <img
                  src={morningPhotoUrl || '/scale-example.jpg'}
                  alt="Morning opening audit"
                  className="w-full h-full object-contain max-h-48"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Fresh Stock Delivery Intake */}
      {subTab === 'delivery-intake' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Fresh Poultry Delivery (03:45 PM Check-in)
              </h3>
              <button
                onClick={handleSaveDeliveryReceived}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Delivery</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/60">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] text-slate-400 font-bold block">Supplier</label>
                  <button
                    onClick={() => setIsAddVendorOpen(true)}
                    className="text-[9px] text-orange-400 hover:underline font-bold"
                  >
                    + Add New
                  </button>
                </div>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full bg-slate-900 text-xs font-semibold text-white border border-slate-700 rounded-lg p-1.5"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/60">
                <label className="text-[9px] text-slate-400 font-bold block mb-1">Invoice / Challan #</label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full bg-slate-900 text-xs font-mono font-bold text-white border border-slate-700 rounded-lg p-1.5"
                />
              </div>

              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/60">
                <label className="text-[9px] text-slate-400 font-bold block mb-1">Vehicle Temp</label>
                <input
                  type="text"
                  value={vehicleTemp}
                  onChange={(e) => setVehicleTemp(e.target.value)}
                  className="w-full bg-slate-900 text-xs font-bold text-emerald-400 border border-slate-700 rounded-lg p-1.5"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {items.map((item) => {
                const w = Number(deliveryCounts[item.id]?.weight) || 0;
                const p = Number(deliveryCounts[item.id]?.unitPrice) || item.defaultCostPerUnit;
                const cost = Math.round(w * p);

                return (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">Rate: {currency}{p}/kg</span>
                        </div>
                      </div>

                      {/* Steppers */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustDeliveryWeight(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={deliveryCounts[item.id]?.weight ?? ''}
                          onChange={(e) => setDeliveryCounts({
                            ...deliveryCounts,
                            [item.id]: { ...deliveryCounts[item.id], weight: e.target.value }
                          })}
                          className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-emerald-500"
                        />

                        <button
                          type="button"
                          onClick={() => adjustDeliveryWeight(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-700/40 font-mono">
                      <span className="text-slate-400">Invoiced Amount:</span>
                      <span className="font-bold text-emerald-400">{currency}{cost.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase">📷 Challan Photo Proof</span>
                <label className="cursor-pointer text-[10px] text-emerald-400 hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Upload / Camera
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
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
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-h-52 flex items-center justify-center">
                <img
                  src={challanPhotoUrl || createDeliveryChallanSvg(invoiceNo, selectedSupplier, totalDeliveryKg, `${currency}${totalDeliveryCost.toLocaleString()}`, `${selectedDate} 03:45 PM`)}
                  alt="Delivery Challan Proof"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
