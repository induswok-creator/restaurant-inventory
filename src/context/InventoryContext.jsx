import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ITEMS, DEFAULT_RECIPES, DEFAULT_SUPPLIERS, generateRealisticHistory } from '../data/initialData';
import { format, addDays, parseISO, subDays } from 'date-fns';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('poultry_items');
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
  });

  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('poultry_recipes');
    return saved ? JSON.parse(saved) : DEFAULT_RECIPES;
  });

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('poultry_suppliers');
    return saved ? JSON.parse(saved) : DEFAULT_SUPPLIERS;
  });

  const [dailyLogs, setDailyLogs] = useState(() => {
    const saved = localStorage.getItem('poultry_daily_logs');
    return saved ? JSON.parse(saved) : generateRealisticHistory();
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('poultry_currency') || '₹';
  });

  const [selectedDate, setSelectedDate] = useState('2026-08-24');
  const [activeTab, setActiveTab] = useState('overview');

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('poultry_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('poultry_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('poultry_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('poultry_daily_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('poultry_currency', currency);
  }, [currency]);

  // Current day log getter
  const getLogForDate = (dateStr) => {
    return dailyLogs.find(log => log.date === dateStr);
  };

  // Ensure log exists for date
  const ensureLogForDate = (dateStr) => {
    const existing = dailyLogs.find(log => log.date === dateStr);
    if (existing) return existing;

    const parsedDate = parseISO(dateStr);
    const dayOfWeek = format(parsedDate, 'EEEE');
    
    // Create skeleton
    const newLog = {
      date: dateStr,
      dayOfWeek,
      timestampNight: `${dateStr} 23:45`,
      timestampMorning: `${dateStr} 08:30`,
      nightClosing: null,
      morningOpening: null,
      deliveryReceived: null,
      salesAndUsage: null,
      wastageSummary: null,
      notes: ''
    };

    setDailyLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  // 1. Log Night Closing Stock
  const logNightClosing = (dateStr, payload) => {
    setDailyLogs(prev => {
      const idx = prev.findIndex(l => l.date === dateStr);
      const dayOfWeek = format(parseISO(dateStr), 'EEEE');
      
      const newEntry = {
        staff: payload.staff || 'Night Duty Supervisor',
        items: payload.items || {}, // { [itemId]: { weight, unit, notes } }
        photoUrl: payload.photoUrl || null,
        whatsAppMessage: payload.whatsAppMessage || '',
        chillerTemp: payload.chillerTemp || '2.4°C',
        timestamp: payload.timestamp || `${dateStr} 23:30`,
        verified: true
      };

      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          nightClosing: newEntry
        };
        return updated;
      } else {
        return [{
          date: dateStr,
          dayOfWeek,
          nightClosing: newEntry,
          morningOpening: null,
          deliveryReceived: null,
          salesAndUsage: null,
          wastageSummary: null
        }, ...prev];
      }
    });
  };

  // 2. Log Morning Opening Stock
  const logMorningOpening = (dateStr, payload) => {
    setDailyLogs(prev => {
      const idx = prev.findIndex(l => l.date === dateStr);
      const log = idx >= 0 ? prev[idx] : null;
      
      // Calculate variance against night closing if exists
      let overnightDripLossKg = 0;
      if (log && log.nightClosing && log.nightClosing.items) {
        Object.entries(payload.items || {}).forEach(([itemId, val]) => {
          const nightWeight = log.nightClosing.items[itemId]?.weight || 0;
          const morningWeight = Number(val.weight) || 0;
          if (nightWeight > morningWeight) {
            overnightDripLossKg += (nightWeight - morningWeight);
          }
        });
      }

      const newEntry = {
        staff: payload.staff || 'Morning Kitchen Receiver',
        items: payload.items || {},
        photoUrl: payload.photoUrl || null,
        overnightDripLossKg: Number(overnightDripLossKg.toFixed(2)),
        timestamp: payload.timestamp || `${dateStr} 08:30`,
        notes: payload.notes || '',
        verified: true
      };

      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          morningOpening: newEntry
        };
        return updated;
      } else {
        return [{
          date: dateStr,
          dayOfWeek: format(parseISO(dateStr), 'EEEE'),
          nightClosing: null,
          morningOpening: newEntry,
          deliveryReceived: null,
          salesAndUsage: null,
          wastageSummary: null
        }, ...prev];
      }
    });
  };

  // 3. Log Morning Delivery Received
  const logDeliveryReceived = (dateStr, payload) => {
    setDailyLogs(prev => {
      const idx = prev.findIndex(l => l.date === dateStr);
      let totalKg = 0;
      let totalCost = 0;

      Object.entries(payload.items || {}).forEach(([itemId, val]) => {
        const w = Number(val.weight) || 0;
        const itemObj = items.find(i => i.id === itemId);
        const price = Number(val.unitPrice) || itemObj?.defaultCostPerUnit || 200;
        totalKg += w;
        totalCost += (w * price);
      });

      const newEntry = {
        invoiceNo: payload.invoiceNo || `APX-${Math.floor(1000 + Math.random() * 9000)}`,
        vendor: payload.vendor || 'Apex Fresh Poultry Farms',
        deliveryTime: payload.deliveryTime || '08:45 AM',
        vehicleTemp: payload.vehicleTemp || '+1.8°C',
        items: payload.items || {},
        totalKg: Number(totalKg.toFixed(2)),
        totalCost: Math.round(totalCost),
        challanPhoto: payload.challanPhoto || null,
        whatsAppMessage: payload.whatsAppMessage || '',
        verified: true
      };

      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          deliveryReceived: newEntry
        };
        return updated;
      } else {
        return [{
          date: dateStr,
          dayOfWeek: format(parseISO(dateStr), 'EEEE'),
          nightClosing: null,
          morningOpening: null,
          deliveryReceived: newEntry,
          salesAndUsage: null,
          wastageSummary: null
        }, ...prev];
      }
    });
  };

  // 4. Log Sales and Recipe Deductions
  const logDailySales = (dateStr, dishSalesObj) => {
    // Calculate theoretical raw meat consumption
    const theoreticalUsage = {};
    items.forEach(it => { theoreticalUsage[it.id] = 0; });

    Object.entries(dishSalesObj).forEach(([dishId, count]) => {
      const recipe = recipes.find(r => r.id === dishId);
      if (recipe && count > 0) {
        recipe.ingredients.forEach(ing => {
          theoreticalUsage[ing.itemId] = (theoreticalUsage[ing.itemId] || 0) + (ing.qtyKg * count);
        });
      }
    });

    const actualKitchenUsage = {};
    const trimmingWaste = {};
    const spoilageWaste = {};
    const kitchenMistakeWaste = {};
    let totalWasteKg = 0;
    let totalWasteCost = 0;

    items.forEach(it => {
      const theo = Number((theoreticalUsage[it.id] || 0).toFixed(2));
      const trim = Number((theo * (1 - it.prepYield)).toFixed(2));
      trimmingWaste[it.id] = trim;
      spoilageWaste[it.id] = 0;
      kitchenMistakeWaste[it.id] = 0;
      actualKitchenUsage[it.id] = Number((theo + trim).toFixed(2));

      totalWasteKg += trim;
      totalWasteCost += trim * it.defaultCostPerUnit;
    });

    setDailyLogs(prev => {
      const idx = prev.findIndex(l => l.date === dateStr);
      const dayOfWeek = format(parseISO(dateStr), 'EEEE');
      
      const salesEntry = {
        dishSales: dishSalesObj,
        theoreticalUsage,
        actualKitchenUsage,
        totalChickenSoldKg: Number(Object.values(theoreticalUsage).reduce((a, b) => a + b, 0).toFixed(2)),
        totalKitchenDrawnKg: Number(Object.values(actualKitchenUsage).reduce((a, b) => a + b, 0).toFixed(2))
      };

      const wastageEntry = {
        trimmingWasteKg: Number(totalWasteKg.toFixed(2)),
        spoilageWasteKg: 0,
        overnightDripLossKg: 0,
        kitchenMistakeKg: 0,
        totalWastageKg: Number(totalWasteKg.toFixed(2)),
        totalWastageCost: Math.round(totalWasteCost),
        wastagePercentage: Number(((totalWasteKg / Math.max(1, salesEntry.totalKitchenDrawnKg)) * 100).toFixed(1))
      };

      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          salesAndUsage: salesEntry,
          wastageSummary: wastageEntry
        };
        return updated;
      } else {
        return [{
          date: dateStr,
          dayOfWeek,
          nightClosing: null,
          morningOpening: null,
          deliveryReceived: null,
          salesAndUsage: salesEntry,
          wastageSummary: wastageEntry
        }, ...prev];
      }
    });
  };

  // WhatsApp Smart Text Parser with Regex / Entity Extraction
  const parseWhatsAppMessage = (text) => {
    if (!text || typeof text !== 'string') return null;

    const lower = text.toLowerCase();
    const result = {
      type: 'unknown',
      extractedDate: null,
      staff: null,
      temp: null,
      invoiceNo: null,
      vendor: null,
      items: {},
      rawText: text
    };

    // Detect type
    if (lower.includes('night') || lower.includes('closing') || lower.includes('pending stock') || lower.includes('chiller')) {
      result.type = 'night_closing';
    } else if (lower.includes('morning') || lower.includes('delivery') || lower.includes('received') || lower.includes('arrived') || lower.includes('challan') || lower.includes('invoice')) {
      result.type = 'morning_delivery';
    } else {
      result.type = 'general_stock';
    }

    // Extract temperature (e.g. 2.4C, 2.4°C, temp: 3)
    const tempMatch = text.match(/(?:temp|chiller|temperature|celsius)[\s:]*([0-9.]+)\s*°?c?/i);
    if (tempMatch) {
      result.temp = `${tempMatch[1]}°C`;
    }

    // Extract staff name (e.g. Sunil, Rajesh, Imran, logged by: Farhan)
    const staffMatch = text.match(/(?:by|from|staff|lead|receiver)[\s:]*([A-Za-z\s]+)/i);
    if (staffMatch) {
      result.staff = staffMatch[1].trim();
    }

    // Extract Invoice No (e.g. Inv #8492, APX-4421, Challan: 104)
    const invMatch = text.match(/(?:inv(?:oice)?|challan|bill)[\s#:]*([A-Za-z0-9-]+)/i);
    if (invMatch) {
      result.invoiceNo = invMatch[1].trim();
    }

    // Search for items and weights
    // Examples:
    // "Boneless: 14.5 kg" or "Boneless 14.5kg" or "Curry cut - 22 kg" or "Wings: 8 kg"
    items.forEach(it => {
      // Create aliases to match
      const aliases = [
        it.name.toLowerCase(),
        it.id.replace('chk-', ''),
        it.category.toLowerCase()
      ];
      if (it.id === 'chk-boneless') aliases.push('boneless', 'breast', 'chicken boneless', 'breast meat');
      if (it.id === 'chk-currycut') aliases.push('curry cut', 'bone in', 'bone-in', 'curry');
      if (it.id === 'chk-wings') aliases.push('wings', 'chicken wings', 'hot wings');
      if (it.id === 'chk-drumstick') aliases.push('drumstick', 'drumsticks', 'tangdi', 'leg piece', 'legs');
      if (it.id === 'chk-whole') aliases.push('whole', 'whole chicken', 'broiler', 'full bird');
      if (it.id === 'chk-keema') aliases.push('keema', 'mince', 'minced chicken', 'kheema');
      if (it.id === 'chk-marinated') aliases.push('marinated', 'tandoori batch', 'tikka marinated');
      if (it.id === 'chk-liver') aliases.push('liver', 'gizzard', 'kaleji');

      for (const alias of aliases) {
        // Regex pattern e.g. "boneless[: -]*([0-9.]+)\s*(kg|kilo|pcs|g)?"
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`${escaped}[\\s:=-]+([0-9.]+)\\s*(kg|kilo|pcs|grams|gm)?`, 'i');
        const match = text.match(pattern);
        if (match && match[1]) {
          const val = parseFloat(match[1]);
          if (!isNaN(val) && val > 0) {
            result.items[it.id] = {
              weight: val,
              unit: match[2]?.toLowerCase() || 'kg'
            };
            break;
          }
        }
      }
    });

    return result;
  };

  // AI Demand Forecasting Engine
  const generateAiOrderForecast = (targetDateStr = '2026-08-25', options = {}) => {
    const { weatherMultiplier = 1.0, isSpecialEvent = false, targetSafetyDays = 1.2 } = options;
    const targetDate = parseISO(targetDateStr);
    const dayOfWeek = format(targetDate, 'EEEE');

    // Find historical average for this day of week across the 30-day logs
    const matchingDayLogs = dailyLogs.filter(l => l.dayOfWeek === dayOfWeek && l.salesAndUsage);
    
    // Average consumption per item on this day of week
    const recommendations = [];

    items.forEach(it => {
      let historicalSalesKgTotal = 0;
      let count = 0;

      matchingDayLogs.forEach(l => {
        const usage = l.salesAndUsage?.actualKitchenUsage?.[it.id] || 0;
        if (usage > 0) {
          historicalSalesKgTotal += usage;
          count++;
        }
      });

      // Fallback to general average or default
      const avgDailyUsage = count > 0 ? (historicalSalesKgTotal / count) : (it.minParKg * 0.8);
      
      // Multipliers
      let demandMultiplier = 1.0;
      if (dayOfWeek === 'Friday') demandMultiplier = 1.45;
      if (dayOfWeek === 'Saturday') demandMultiplier = 1.70;
      if (dayOfWeek === 'Sunday') demandMultiplier = 1.55;
      if (dayOfWeek === 'Monday') demandMultiplier = 0.80;

      demandMultiplier *= weatherMultiplier;
      if (isSpecialEvent) demandMultiplier *= 1.35; // +35% catering / holiday surge

      const forecastedDemandKg = Number((avgDailyUsage * demandMultiplier).toFixed(1));
      
      // Get latest available stock (from latest night closing or morning opening)
      const latestLog = dailyLogs[0];
      const currentStockKg = latestLog?.nightClosing?.items?.[it.id]?.weight || latestLog?.morningOpening?.items?.[it.id]?.weight || (it.minParKg * 0.5);

      // Safety buffer based on lead time and shelf life
      const safetyBufferKg = Number((forecastedDemandKg * 0.25).toFixed(1));
      
      // Inherent trim loss compensation (e.g., you need 10kg clean breast -> order 10.8kg)
      const trimCompensationMultiplier = (1 / it.prepYield);
      const grossNeededKg = forecastedDemandKg * trimCompensationMultiplier;

      // Recommended Order = (Gross Needed + Safety Buffer) - Current Stock
      let rawOrderKg = (grossNeededKg + safetyBufferKg) - currentStockKg;
      if (rawOrderKg < 0) rawOrderKg = 0;

      // Round to nearest 0.5kg or 1kg
      const recommendedOrderKg = Number((Math.ceil(rawOrderKg * 2) / 2).toFixed(1));
      const estimatedCost = Math.round(recommendedOrderKg * it.defaultCostPerUnit);

      // AI Reasoning insight
      let reason = '';
      if (dayOfWeek === 'Friday' || dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
        reason = `Weekend footfall spike expected (+${Math.round((demandMultiplier-1)*100)}%). Buffer factored for peak dinner rush.`;
      } else if (dayOfWeek === 'Monday') {
        reason = `Post-weekend slowdown. Kept buffer lean to prevent shelf-life expiration (max 3 days).`;
      } else {
        reason = `Based on average ${dayOfWeek} velocity with 8% prep trimming compensation.`;
      }

      recommendations.push({
        item: it,
        currentStockKg,
        avgDailyUsage: Number(avgDailyUsage.toFixed(1)),
        forecastedDemandKg,
        safetyBufferKg,
        recommendedOrderKg,
        estimatedCost,
        urgency: (currentStockKg < it.minParKg) ? 'HIGH' : (recommendedOrderKg > 0 ? 'NORMAL' : 'SURPLUS'),
        reason
      });
    });

    const totalOrderKg = Number(recommendations.reduce((a, b) => a + b.recommendedOrderKg, 0).toFixed(1));
    const totalOrderCost = Math.round(recommendations.reduce((a, b) => a + b.estimatedCost, 0));

    // Formatted WhatsApp text ready to send to vendor
    const whatsAppSupplierMessage = `*PURCHASE ORDER FOR ${format(targetDate, 'dd-MMM-yyyy').toUpperCase()} (${dayOfWeek.toUpperCase()})*\n` +
      `🏢 Restaurant: The Tandoor & Grill Kitchen\n` +
      `🚚 Supplier: Apex Fresh Poultry Farms\n` +
      `⏰ Delivery Requested: By 08:30 AM Tomorrow\n\n` +
      `📦 *Items Required:*\n` +
      recommendations.filter(r => r.recommendedOrderKg > 0).map((r, i) => `${i + 1}. ${r.item.name}: *${r.recommendedOrderKg} ${r.item.unit}*`).join('\n') +
      `\n\n📊 Total Volume: *${totalOrderKg} kg* | Est. Value: *${currency}${totalOrderCost.toLocaleString()}*\n` +
      `⚠️ Note: Please ensure delivery temperature is below 4°C with fresh slaughter batch tags.`;

    return {
      targetDate: targetDateStr,
      dayOfWeek,
      totalOrderKg,
      totalOrderCost,
      recommendations,
      whatsAppSupplierMessage
    };
  };

  // Reset to rich demo data
  const resetToDemoData = () => {
    const freshHistory = generateRealisticHistory();
    setDailyLogs(freshHistory);
    setItems(DEFAULT_ITEMS);
    setRecipes(DEFAULT_RECIPES);
    setSuppliers(DEFAULT_SUPPLIERS);
    localStorage.removeItem('poultry_daily_logs');
    localStorage.removeItem('poultry_items');
    localStorage.removeItem('poultry_recipes');
    localStorage.removeItem('poultry_suppliers');
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        setItems,
        recipes,
        setRecipes,
        suppliers,
        setSuppliers,
        dailyLogs,
        currency,
        setCurrency,
        selectedDate,
        setSelectedDate,
        activeTab,
        setActiveTab,
        getLogForDate,
        ensureLogForDate,
        logNightClosing,
        logMorningOpening,
        logDeliveryReceived,
        logDailySales,
        parseWhatsAppMessage,
        generateAiOrderForecast,
        resetToDemoData
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
