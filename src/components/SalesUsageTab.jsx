import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { extractSalesForDate } from '../services/posSyncService';
import { 
  ChefHat, 
  Utensils, 
  Save, 
  CheckCircle2, 
  Calculator, 
  ArrowRight, 
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Receipt,
  Plus,
  Minus,
  RefreshCw,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SalesUsageTab = () => {
  const { 
    items, 
    recipes, 
    dailyLogs, 
    selectedDate, 
    getLogForDate, 
    logDailySales, 
    posBills,
    posStatus,
    syncWithPos,
    currency 
  } = useInventory();

  const currentLog = getLogForDate(selectedDate);
  const existingSales = currentLog?.salesAndUsage;

  // Extract POS sales for the active date
  const posSalesData = extractSalesForDate(posBills, selectedDate);

  // Dish sales state
  const [dishSales, setDishSales] = useState(() => {
    if (existingSales?.dishSales && Object.keys(existingSales.dishSales).length > 0) {
      return existingSales.dishSales;
    }
    // If POS has bills for this date, prefill from POS
    if (posSalesData.dishSales && Object.keys(posSalesData.dishSales).length > 0) {
      return posSalesData.dishSales;
    }
    // Fallback default sample
    const init = {};
    recipes.slice(0, 10).forEach(r => {
      init[r.name] = r.category === 'Rice' || r.category === 'Rice with Gravy' ? 12 : 6;
    });
    return init;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
  const [isSyncingLive, setIsSyncingLive] = useState(false);

  // Sync state when date or posBills changes
  useEffect(() => {
    if (existingSales?.dishSales && Object.keys(existingSales.dishSales).length > 0) {
      setDishSales(existingSales.dishSales);
    } else if (posSalesData.dishSales && Object.keys(posSalesData.dishSales).length > 0) {
      setDishSales(posSalesData.dishSales);
    }
  }, [selectedDate, posBills]);

  // Handle Manual 1-Click Pull from POS
  const handlePullFromPos = async () => {
    setIsSyncingLive(true);
    await syncWithPos();
    const freshData = extractSalesForDate(posBills, selectedDate);
    if (freshData.dishSales && Object.keys(freshData.dishSales).length > 0) {
      setDishSales(freshData.dishSales);
      logDailySales(selectedDate, freshData.dishSales);
      setToastMessage(`✅ Pulled ${freshData.totalBillsCount} live bills from Indus Wok POS for ${selectedDate}!`);
    } else {
      setToastMessage(`ℹ️ Synced with Indus Wok POS (${posBills.length} total bills). No bills logged on ${selectedDate} yet.`);
    }
    setIsSyncingLive(false);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute theoretical raw meat consumption live
  const theoreticalUsage = {};
  items.forEach(it => { theoreticalUsage[it.id] = 0; });

  let totalDishesCount = 0;
  let totalRevenueEst = 0;

  Object.entries(dishSales).forEach(([dishKey, countNum]) => {
    const count = parseInt(countNum) || 0;
    const recipe = recipes.find(r => r.name === dishKey || r.id === dishKey);
    if (recipe && count > 0) {
      totalDishesCount += count;
      totalRevenueEst += (count * recipe.price);
      recipe.ingredients.forEach(ing => {
        theoreticalUsage[ing.itemId] = (theoreticalUsage[ing.itemId] || 0) + (ing.qtyKg * count);
      });
    }
  });

  const totalTheoreticalMeatKg = Number(Object.values(theoreticalUsage).reduce((a, b) => a + b, 0).toFixed(2));

  // Handle Save Sales & Usage
  const handleSave = () => {
    logDailySales(selectedDate, dishSales);
    setToastMessage('✅ Daily dish sales saved & raw chicken deducted from inventory!');
    confetti({ particleCount: 35, spread: 50 });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const adjustDish = (dishKey, delta) => {
    const cur = parseInt(dishSales[dishKey]) || 0;
    const nextVal = Math.max(0, cur + delta);
    setDishSales({ ...dishSales, [dishKey]: nextVal });
  };

  // Filter recipes
  const categories = ['All', ...new Set(recipes.map(r => r.category).filter(Boolean))];
  const filteredRecipes = recipes.filter(r => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* POS Real-Time Sync Status Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-xl shrink-0">
            🥢
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Indus Wok POS Live Integration
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync ({posStatus.totalBills} Bills · {recipes.length} Menu Dishes)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Pull live billing transactions directly from <a href={posStatus.posUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-semibold underline">{posStatus.posUrl}</a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePullFromPos}
            disabled={isSyncingLive}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-700/30 transition-all w-full sm:w-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin' : ''}`} />
            <span>{isSyncingLive ? 'Syncing POS...' : `Sync ${selectedDate} Bills`}</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xl sm:text-2xl shadow-lg shrink-0">
            🍳
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white">Daily Kitchen Sales & Recipe Deductions</h2>
              <span className="text-[11px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {selectedDate}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Dishes sold are automatically converted into exact raw chicken weights (boneless, wings, tandoori).
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Sales Deductions</span>
        </button>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Indus Wok Dishes Sold</span>
          <span className="text-base sm:text-2xl font-extrabold text-white mt-0.5 block">{totalDishesCount} Portions</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Raw Meat Consumed</span>
          <span className="text-base sm:text-2xl font-extrabold text-orange-400 mt-0.5 block">{totalTheoreticalMeatKg} <span className="text-xs">KG</span></span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">POS Food Revenue</span>
          <span className="text-base sm:text-2xl font-extrabold text-emerald-400 mt-0.5 block truncate">{currency}{totalRevenueEst.toLocaleString()}</span>
        </div>
      </div>

      {/* Main 2-Column: Dish Sales Input vs Raw Meat Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column (7 Cols): Menu Dishes Sales Counter */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Indus Wok Menu Dishes ({recipes.length} available)
            </h3>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search chicken dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 ios-scroll">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-slate-950 font-extrabold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dishes List */}
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 ios-scroll">
            {filteredRecipes.map((dish) => {
              const currentCount = dishSales[dish.name] || dishSales[dish.id] || 0;
              const recipeFormula = dish.ingredients.map(ing => {
                const itemObj = items.find(i => i.id === ing.itemId);
                return `${(ing.qtyKg * 1000)}g ${itemObj?.name || ing.itemId}`;
              }).join(' + ');

              return (
                <div
                  key={dish.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    currentCount > 0 
                      ? 'bg-orange-950/20 border-orange-500/40' 
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-white truncate">{dish.name}</h4>
                      <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                        {currency}{dish.price}
                      </span>
                      <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 rounded">
                        {dish.category}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-mono truncate">
                      {recipeFormula} / plate
                    </p>
                  </div>

                  {/* Stepper with thumb buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => adjustDish(dish.name, -5)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-[10px] flex items-center justify-center border border-slate-700"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustDish(dish.name, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={currentCount}
                      onChange={(e) => setDishSales({
                        ...dishSales,
                        [dish.name]: Math.max(0, parseInt(e.target.value) || 0)
                      })}
                      className="w-12 bg-slate-900 border border-slate-700 rounded-lg px-1 py-1 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-orange-500"
                    />

                    <button
                      type="button"
                      onClick={() => adjustDish(dish.name, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustDish(dish.name, 5)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-[10px] flex items-center justify-center border border-slate-700"
                    >
                      +5
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 Cols): Real-time Raw Chicken Cuts Required */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Raw Meat Yield Needed
                </h3>
              </div>
              <span className="text-[9px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                Auto
              </span>
            </div>

            <div className="space-y-2">
              {items.map((item) => {
                const theoKg = Number((theoreticalUsage[item.id] || 0).toFixed(2));
                if (theoKg === 0) return null;
                const trimLossKg = Number((theoKg * (1 - item.prepYield)).toFixed(2));
                const grossMeatNeededKg = Number((theoKg + trimLossKg).toFixed(2));

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span>{item.icon}</span>
                        <span className="text-xs font-bold text-white truncate">{item.name}</span>
                      </div>
                      <span className="font-mono text-xs font-extrabold text-orange-400">
                        {theoKg} {item.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                      <span>Trim Loss: +{trimLossKg} kg</span>
                      <span className="text-slate-300 font-semibold">Gross Raw Needed: {grossMeatNeededKg} kg</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Indus Wok Real Recipe Yields:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Every plate of Chicken Fried Rice automatically deducts 140g boneless, Chicken Crispy deducts 180g, and Lolipop portions deduct 300g wings. This feeds directly into tonight's AI purchase forecast.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
