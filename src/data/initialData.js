import { createScalePhotoSvg, createDeliveryChallanSvg } from '../utils/mockImages';
import { format, subDays, addDays } from 'date-fns';

export const DEFAULT_ITEMS = [
  {
    id: 'chk-boneless',
    name: 'Chicken Boneless Breast',
    category: 'Boneless',
    unit: 'kg',
    defaultCostPerUnit: 280, // in INR
    minParKg: 15,
    maxParKg: 45,
    shelfLifeDays: 3,
    prepYield: 0.92, // 8% trimming loss standard
    icon: '🥩',
    description: 'Fresh skinless, boneless breast for Butter Chicken, Tikkas & Steaks'
  },
  {
    id: 'chk-currycut',
    name: 'Chicken Bone-in Curry Cut',
    category: 'Bone-in',
    unit: 'kg',
    defaultCostPerUnit: 190,
    minParKg: 20,
    maxParKg: 60,
    shelfLifeDays: 3,
    prepYield: 0.95,
    icon: '🍗',
    description: 'Curry cut pieces (75-80g) for Dum Biryani, Korma and Masalas'
  },
  {
    id: 'chk-wings',
    name: 'Chicken Wings (3-Joint)',
    category: 'Special Cuts',
    unit: 'kg',
    defaultCostPerUnit: 220,
    minParKg: 8,
    maxParKg: 25,
    shelfLifeDays: 4,
    prepYield: 0.98,
    icon: '🍖',
    description: 'Fresh chicken wings with tip for Crispy Fried Wings & BBQ'
  },
  {
    id: 'chk-drumstick',
    name: 'Chicken Drumsticks (Tangdi)',
    category: 'Bone-in',
    unit: 'kg',
    defaultCostPerUnit: 240,
    minParKg: 8,
    maxParKg: 20,
    shelfLifeDays: 3,
    prepYield: 0.96,
    icon: '🍗',
    description: 'Skin-off plump drumsticks for Tangdi Kabab & Fried Chicken'
  },
  {
    id: 'chk-whole',
    name: 'Whole Broiler Chicken (Cleaned)',
    category: 'Whole Birds',
    unit: 'kg',
    defaultCostPerUnit: 175,
    minParKg: 10,
    maxParKg: 35,
    shelfLifeDays: 3,
    prepYield: 0.88,
    icon: '🐔',
    description: '1.2-1.4kg whole cleaned birds for Tandoori Whole & Rotisserie'
  },
  {
    id: 'chk-keema',
    name: 'Chicken Keema (Minced)',
    category: 'Minced',
    unit: 'kg',
    defaultCostPerUnit: 260,
    minParKg: 5,
    maxParKg: 18,
    shelfLifeDays: 2,
    prepYield: 0.98,
    icon: '🥣',
    description: 'Double ground fresh minced meat for Seekh Kababs & Momos'
  },
  {
    id: 'chk-marinated',
    name: 'Marinated Tandoori Batches',
    category: 'Semi-Finished',
    unit: 'kg',
    defaultCostPerUnit: 235,
    minParKg: 10,
    maxParKg: 30,
    shelfLifeDays: 2,
    prepYield: 1.0,
    icon: '🌶️',
    description: 'Pre-marinated chicken cuts resting in yogurt & spices'
  },
  {
    id: 'chk-liver',
    name: 'Chicken Liver & Gizzard',
    category: 'Offal',
    unit: 'kg',
    defaultCostPerUnit: 130,
    minParKg: 3,
    maxParKg: 10,
    shelfLifeDays: 2,
    prepYield: 0.85,
    icon: '🥘',
    description: 'Fresh cleaned liver & gizzard for specialty pan frys'
  }
];

export const DEFAULT_RECIPES = [
  {
    id: 'dish-butter-chicken',
    name: 'Butter Chicken (Full)',
    price: 380,
    category: 'Curries',
    ingredients: [
      { itemId: 'chk-boneless', qtyKg: 0.24 }
    ]
  },
  {
    id: 'dish-biryani',
    name: 'Chicken Dum Biryani (Pot)',
    price: 320,
    category: 'Rice & Biryani',
    ingredients: [
      { itemId: 'chk-currycut', qtyKg: 0.28 }
    ]
  },
  {
    id: 'dish-tikka',
    name: 'Chicken Tikka Platter (8 pcs)',
    price: 340,
    category: 'Tandoor & Starters',
    ingredients: [
      { itemId: 'chk-boneless', qtyKg: 0.25 },
      { itemId: 'chk-marinated', qtyKg: 0.05 }
    ]
  },
  {
    id: 'dish-tandoori-half',
    name: 'Tandoori Chicken (Half)',
    price: 290,
    category: 'Tandoor & Starters',
    ingredients: [
      { itemId: 'chk-whole', qtyKg: 0.45 }
    ]
  },
  {
    id: 'dish-crispy-wings',
    name: 'Crispy Garlic Wings (6 pcs)',
    price: 260,
    category: 'Starters',
    ingredients: [
      { itemId: 'chk-wings', qtyKg: 0.35 }
    ]
  },
  {
    id: 'dish-tangdi-kebab',
    name: 'Tangdi Kebab (2 pcs)',
    price: 280,
    category: 'Tandoor & Starters',
    ingredients: [
      { itemId: 'chk-drumstick', qtyKg: 0.32 }
    ]
  },
  {
    id: 'dish-seekh-kebab',
    name: 'Chicken Seekh Kebab (4 pcs)',
    price: 310,
    category: 'Tandoor & Starters',
    ingredients: [
      { itemId: 'chk-keema', qtyKg: 0.22 }
    ]
  },
  {
    id: 'dish-chicken-fried-rice',
    name: 'Chicken Fried Rice / Hakka Noodles',
    price: 240,
    category: 'Indo-Chinese',
    ingredients: [
      { itemId: 'chk-boneless', qtyKg: 0.12 }
    ]
  },
  {
    id: 'dish-steamed-momos',
    name: 'Chicken Momos (6 pcs)',
    price: 180,
    category: 'Indo-Chinese',
    ingredients: [
      { itemId: 'chk-keema', qtyKg: 0.14 }
    ]
  }
];

export const DEFAULT_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'Apex Fresh Poultry Farms & Logistics',
    contactPerson: 'Imran Bhai / Dispatch Manager',
    phone: '+91 98201 44552',
    deliveryTime: '08:00 AM - 09:30 AM',
    leadTimeHours: 14,
    rating: 4.8,
    paymentTerms: 'Weekly Credit',
    whatsappNumber: '919820144552'
  },
  {
    id: 'sup-2',
    name: 'Royal Halal Broiler Hub',
    contactPerson: 'Suresh Kumar',
    phone: '+91 98330 11229',
    deliveryTime: '07:30 AM - 09:00 AM',
    leadTimeHours: 12,
    rating: 4.6,
    paymentTerms: 'Cash On Delivery',
    whatsappNumber: '919833011229'
  }
];

// Helper to generate 30 days of realistic history leading up to today
export const generateRealisticHistory = () => {
  const history = [];
  const today = new Date('2026-08-24T12:00:00');

  // Baseline demand profile
  const baseSalesMultiplier = {
    Sunday: 1.55,
    Monday: 0.75,
    Tuesday: 0.85,
    Wednesday: 1.05,
    Thursday: 1.0,
    Friday: 1.45,
    Saturday: 1.70,
  };

  for (let i = 29; i >= 0; i--) {
    const targetDate = subDays(today, i);
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    const dayOfWeek = format(targetDate, 'EEEE');
    const multiplier = baseSalesMultiplier[dayOfWeek] || 1.0;

    // Daily dish sales volume
    const dishSales = {
      'dish-butter-chicken': Math.round((35 + (Math.sin(i) * 5)) * multiplier),
      'dish-biryani': Math.round((45 + (Math.cos(i) * 8)) * multiplier),
      'dish-tikka': Math.round((25 + (Math.sin(i * 2) * 4)) * multiplier),
      'dish-tandoori-half': Math.round((20 + (Math.cos(i) * 3)) * multiplier),
      'dish-crispy-wings': Math.round((18 + (Math.sin(i) * 3)) * multiplier),
      'dish-tangdi-kebab': Math.round((14 + (Math.cos(i) * 2)) * multiplier),
      'dish-seekh-kebab': Math.round((15 + (Math.sin(i) * 2)) * multiplier),
      'dish-chicken-fried-rice': Math.round((22 + (Math.cos(i) * 4)) * multiplier),
      'dish-steamed-momos': Math.round((20 + (Math.sin(i * 1.5) * 3)) * multiplier),
    };

    // Calculate theoretical raw meat consumed based on recipes
    const theoreticalUsage = {};
    DEFAULT_ITEMS.forEach(it => { theoreticalUsage[it.id] = 0; });

    Object.entries(dishSales).forEach(([dishId, count]) => {
      const recipe = DEFAULT_RECIPES.find(r => r.id === dishId);
      if (recipe) {
        recipe.ingredients.forEach(ing => {
          theoreticalUsage[ing.itemId] = (theoreticalUsage[ing.itemId] || 0) + (ing.qtyKg * count);
        });
      }
    });

    // Incur some realistic kitchen trim & prep loss (e.g. 5-8%)
    const actualKitchenUsage = {};
    const trimmingWaste = {};
    const spoilageWaste = {};
    const overnightDripLoss = {};
    const kitchenMistakeWaste = {};

    let dayTotalWastageKg = 0;
    let dayTotalWastageCost = 0;

    DEFAULT_ITEMS.forEach(it => {
      const theo = Number((theoreticalUsage[it.id] || 0).toFixed(2));
      // Trimming loss is roughly (1 - yield)
      const trim = Number((theo * (1 - it.prepYield) * (0.9 + Math.random() * 0.2)).toFixed(2));
      // Occasional spoilage or mistakes
      const mistake = Math.random() > 0.65 ? Number((0.2 + Math.random() * 0.4).toFixed(2)) : 0;
      const spoil = (dayOfWeek === 'Monday' && Math.random() > 0.4) ? Number((0.4 + Math.random() * 0.8).toFixed(2)) : 0;
      const drip = Number((0.15 + Math.random() * 0.25).toFixed(2));

      trimmingWaste[it.id] = trim;
      spoilageWaste[it.id] = spoil;
      overnightDripLoss[it.id] = drip;
      kitchenMistakeWaste[it.id] = mistake;

      actualKitchenUsage[it.id] = Number((theo + trim + mistake).toFixed(2));

      const itemTotalWaste = trim + spoil + drip + mistake;
      dayTotalWastageKg += itemTotalWaste;
      dayTotalWastageCost += itemTotalWaste * it.defaultCostPerUnit;
    });

    // Daily Inbound Delivery to maintain par levels
    const deliveryItems = {};
    let totalDeliveryKg = 0;
    let totalDeliveryCost = 0;

    DEFAULT_ITEMS.forEach(it => {
      // Order enough for next day target + buffer
      const targetDailyOrder = Math.round((actualKitchenUsage[it.id] * 1.08 + (Math.random() * 2)));
      const costPerKg = it.defaultCostPerUnit;
      deliveryItems[it.id] = {
        weight: targetDailyOrder,
        unitPrice: costPerKg,
        totalCost: targetDailyOrder * costPerKg
      };
      totalDeliveryKg += targetDailyOrder;
      totalDeliveryCost += targetDailyOrder * costPerKg;
    });

    // Night closing stock calculation (realistic pending chicken in tubs)
    const nightClosingItems = {};
    const morningOpeningItems = {};

    DEFAULT_ITEMS.forEach(it => {
      const closingWeight = Number((it.minParKg * 0.8 + (Math.sin(i + it.name.length) * 4) + 6).toFixed(2));
      nightClosingItems[it.id] = {
        weight: Math.max(2.5, closingWeight),
        unit: 'kg',
        notes: Math.random() > 0.5 ? 'Covered & labeled in chiller #2' : 'Separated breast & curry cut'
      };

      // Morning opening has minor drip/thaw variance
      const drip = overnightDripLoss[it.id] || 0.2;
      morningOpeningItems[it.id] = {
        weight: Number(Math.max(2.2, closingWeight - drip).toFixed(2)),
        unit: 'kg'
      };
    });

    // Build raw staff WhatsApp message representation
    const whatsAppSample = `*NIGHT CLOSING STOCK REPORT - ${dateStr}*\n` +
      `📅 Time: 23:45 PM | Logged by: Sunil (Night Lead)\n` +
      `❄️ Walk-in Chiller Temp: 2.3°C\n\n` +
      `🍗 *Pending Chicken Counts:*\n` +
      DEFAULT_ITEMS.slice(0, 5).map(it => `• ${it.name}: *${nightClosingItems[it.id].weight} kg*`).join('\n') +
      `\n\n📸 Photo of scale attached for audit. Morning team please check tray 3.`;

    const morningWhatsAppSample = `*MORNING OPENING & DELIVERY RECEIVED - ${dateStr}*\n` +
      `☀️ Time: 09:15 AM | Receiver: Rajesh Kumar\n` +
      `🚚 Supplier: Apex Fresh Poultry Farms (Inv #${8400 + i})\n` +
      `📦 Received Fresh Stock: *${totalDeliveryKg} kg* (Verified on scale)\n` +
      `Challan & Scale photos uploaded.`;

    history.push({
      date: dateStr,
      dayOfWeek,
      timestampNight: `${dateStr} 23:45`,
      timestampMorning: `${dateStr} 08:30`,
      nightClosing: {
        staff: i % 2 === 0 ? 'Sunil Sharma (Night Head)' : 'Farhan Ali (Tandoor Master)',
        items: nightClosingItems,
        photoUrl: createScalePhotoSvg('Pending Night Chicken Stock', Object.values(nightClosingItems).reduce((a, b) => a + b.weight, 0), `${dateStr} 23:45`),
        whatsAppMessage: whatsAppSample,
        chillerTemp: (2.1 + (i % 5) * 0.2).toFixed(1) + '°C',
        verified: true
      },
      morningOpening: {
        staff: 'Rajesh Kumar (Morning Kitchen Lead)',
        items: morningOpeningItems,
        photoUrl: createScalePhotoSvg('Morning Pending Reconcile', Object.values(morningOpeningItems).reduce((a, b) => a + b.weight, 0), `${dateStr} 08:30`),
        overnightDripLossKg: Number(Object.values(overnightDripLoss).reduce((a, b) => a + b, 0).toFixed(2)),
        verified: true
      },
      deliveryReceived: {
        invoiceNo: `APX-${8400 + i}`,
        vendor: 'Apex Fresh Poultry Farms',
        deliveryTime: '08:45 AM',
        vehicleTemp: '+1.9°C',
        items: deliveryItems,
        totalKg: totalDeliveryKg,
        totalCost: totalDeliveryCost,
        challanPhoto: createDeliveryChallanSvg(`APX-${8400 + i}`, 'Apex Fresh Poultry', totalDeliveryKg, `₹${totalDeliveryCost.toLocaleString()}`, `${dateStr} 08:45 AM`),
        whatsAppMessage: morningWhatsAppSample,
        verified: true
      },
      salesAndUsage: {
        dishSales,
        theoreticalUsage,
        actualKitchenUsage,
        totalChickenSoldKg: Number(Object.values(theoreticalUsage).reduce((a, b) => a + b, 0).toFixed(2)),
        totalKitchenDrawnKg: Number(Object.values(actualKitchenUsage).reduce((a, b) => a + b, 0).toFixed(2))
      },
      wastageSummary: {
        trimmingWasteKg: Number(Object.values(trimmingWaste).reduce((a, b) => a + b, 0).toFixed(2)),
        spoilageWasteKg: Number(Object.values(spoilageWaste).reduce((a, b) => a + b, 0).toFixed(2)),
        overnightDripLossKg: Number(Object.values(overnightDripLoss).reduce((a, b) => a + b, 0).toFixed(2)),
        kitchenMistakeKg: Number(Object.values(kitchenMistakeWaste).reduce((a, b) => a + b, 0).toFixed(2)),
        totalWastageKg: Number(dayTotalWastageKg.toFixed(2)),
        totalWastageCost: Math.round(dayTotalWastageCost),
        wastagePercentage: Number(((dayTotalWastageKg / totalDeliveryKg) * 100).toFixed(1))
      },
      notes: i === 0 ? "Today's live logs active. WhatsApp night photo audit incoming." : (multiplier > 1.4 ? 'Heavy weekend footfall; catering rush' : 'Standard weekday operations')
    });
  }

  return history;
};
