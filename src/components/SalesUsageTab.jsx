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
  Receipt
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
    setToastMessage('✅ Daily dish sales & recipe consumption logged to inventory!');
    confetti({ particleCount: 35, spread: 50 });
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
            🍳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Daily Kitchen Sales & Recipe Deductions</h2>
              <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {selectedDate}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Input dishes sold from your POS / Billing register to calculate exact theoretical raw chicken consumption based on standard recipes.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Sales & Recipe Deductions</span>
        </button>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Chicken Dishes Sold</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{totalDishesCount} Portions</span>
          <span className="text-[10px] text-slate-400">Across {recipes.length} menu items</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Theoretical Chicken Consumed</span>
          <span className="text-2xl font-extrabold text-orange-400 mt-1 block">{totalTheoreticalMeatKg} KG</span>
          <span className="text-[10px] text-slate-400">Raw weight portion requirement</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Food Revenue</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{currency}{totalRevenueEst.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400">From chicken menu items</span>
        </div>
      </div>

      {/* Main 2-Column: Dish Sales Input vs Raw Meat Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Menu Dishes Sales Counter */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Menu Dishes Sold (POS Counts)
              </h3>
              <p className="text-[11px] text-slate-400">Enter portion counts served during lunch and dinner</p>
            </div>
            <span className="text-[11px] text-orange-400 font-bold">{totalDishesCount} orders</span>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {recipes.map((dish) => {
              const currentCount = dishSales[dish.id] || 0;
              const recipeFormula = dish.ingredients.map(ing => {
                const itemObj = items.find(i => i.id === ing.itemId);
                return `${(ing.qtyKg * 1000)}g ${itemObj?.name || ing.itemId}`;
              }).join(' + ');

              return (
                <div
                  key={dish.id}
                  className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl hover:border-slate-600 transition-all flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{dish.name}</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                        {currency}{dish.price}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      Recipe: {recipeFormula} / portion
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDishSales({
                        ...dishSales,
                        [dish.id]: Math.max(0, (parseInt(currentCount) || 0) - 5)
                      })}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
                    >
                      -5
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={currentCount}
                      onChange={(e) => setDishSales({
                        ...dishSales,
                        [dish.id]: Math.max(0, parseInt(e.target.value) || 0)
                      })}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={() => setDishSales({
                        ...dishSales,
                        [dish.id]: (parseInt(currentCount) || 0) + 5
                      })}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700"
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
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Raw Meat Yield Requirement
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                Auto-Calculated
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
                    className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span className="text-xs font-bold text-white">{item.name}</span>
                      </div>
                      <span className="font-mono text-xs font-extrabold text-orange-400">
                        {theoKg} {item.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                      <span>Inherent Prep Trim (~{Math.round((1 - item.prepYield) * 100)}%): +{trimLossKg} kg</span>
                      <span className="text-slate-300 font-semibold">Gross Raw Needed: {grossMeatNeededKg} kg</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 bg-orange-950/20 border border-orange-500/30 rounded-xl text-xs text-orange-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Yield & Portion Control Logic:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                When raw chicken is butchered and marinated, standard prep trimming loses 5-12%. The AI automatically compensates for this in tomorrow's purchase order recommendations so your kitchen never runs short.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
