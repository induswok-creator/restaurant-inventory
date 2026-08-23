import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
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
  Minus
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
    currency 
  } = useInventory();

  const currentLog = getLogForDate(selectedDate);
  const existingSales = currentLog?.salesAndUsage;

  // Dish sales state
  const [dishSales, setDishSales] = useState(() => {
    const init = {};
    recipes.forEach(r => {
      init[r.id] = existingSales?.dishSales?.[r.id] || (r.category === 'Rice & Biryani' ? 40 : 25);
    });
    return init;
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (existingSales?.dishSales) {
      setDishSales(existingSales.dishSales);
    }
  }, [selectedDate, existingSales]);

  // Compute theoretical raw meat consumption live
  const theoreticalUsage = {};
  items.forEach(it => { theoreticalUsage[it.id] = 0; });

  let totalDishesCount = 0;
  let totalRevenueEst = 0;

  Object.entries(dishSales).forEach(([dishId, countNum]) => {
    const count = parseInt(countNum) || 0;
    const recipe = recipes.find(r => r.id === dishId);
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
    setToastMessage('✅ Daily dish sales logged & recipe meat deducted!');
    confetti({ particleCount: 35, spread: 50 });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const adjustDish = (dishId, delta) => {
    const cur = parseInt(dishSales[dishId]) || 0;
    const nextVal = Math.max(0, cur + delta);
    setDishSales({ ...dishSales, [dishId]: nextVal });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
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
            🍳
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white">Daily Kitchen Sales & Recipes</h2>
              <span className="text-[11px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {selectedDate}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Input dishes sold from your POS to calculate theoretical meat consumption.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Sales & Recipe Deductions</span>
        </button>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Dishes Sold</span>
          <span className="text-base sm:text-2xl font-extrabold text-white mt-0.5 block">{totalDishesCount}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Meat Consumed</span>
          <span className="text-base sm:text-2xl font-extrabold text-orange-400 mt-0.5 block">{totalTheoreticalMeatKg} <span className="text-xs">KG</span></span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Food Revenue</span>
          <span className="text-base sm:text-2xl font-extrabold text-emerald-400 mt-0.5 block truncate">{currency}{totalRevenueEst.toLocaleString()}</span>
        </div>
      </div>

      {/* Main 2-Column: Dish Sales Input vs Raw Meat Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Dishes Sold Counter (POS)
            </h3>
            <span className="text-[11px] text-orange-400 font-bold">{totalDishesCount} orders</span>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 ios-scroll">
            {recipes.map((dish) => {
              const currentCount = dishSales[dish.id] || 0;
              return (
                <div
                  key={dish.id}
                  className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl hover:border-slate-600 transition-all flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-white truncate">{dish.name}</h4>
                      <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                        {currency}{dish.price}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-mono truncate">
                      {dish.ingredients.map(ing => `${(ing.qtyKg * 1000)}g`).join(' + ')}
                    </p>
                  </div>

                  {/* Quantity Stepper with thumb buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => adjustDish(dish.id, -5)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-[10px] flex items-center justify-center border border-slate-700"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustDish(dish.id, -1)}
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
                        [dish.id]: Math.max(0, parseInt(e.target.value) || 0)
                      })}
                      className="w-12 bg-slate-900 border border-slate-700 rounded-lg px-1 py-1 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-orange-500"
                    />

                    <button
                      type="button"
                      onClick={() => adjustDish(dish.id, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustDish(dish.id, 5)}
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
                  Raw Meat Yield Requirement
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
                    className="p-2.5 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1"
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

                    <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-700/40">
                      <span>Trim Loss: +{trimLossKg} kg</span>
                      <span className="text-slate-300 font-semibold">Gross Raw: {grossMeatNeededKg} kg</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
