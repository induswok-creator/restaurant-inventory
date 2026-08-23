import fallbackPosData from '../data/indusWokPosData.json';

const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/indus-wok-pos-2026/databases/(default)/documents/pos/induswok-default';

export const mapDishToMeatCut = (dishName, category = '', sub = '') => {
  const nameLower = dishName.toLowerCase();
  const catLower = category.toLowerCase();
  const subLower = sub.toLowerCase();

  let cutId = 'chk-boneless';
  let qtyKg = 0.16; // 160g standard

  if (nameLower.includes('lolipop') || nameLower.includes('wings')) {
    cutId = 'chk-wings';
    qtyKg = 0.30; // 300g wings
  } else if (nameLower.includes('soup') || nameLower.includes('manchow') || nameLower.includes('sweet corn') || nameLower.includes('lung fung') || nameLower.includes('clear soup')) {
    cutId = 'chk-boneless';
    qtyKg = 0.08; // 80g in soup
  } else if (nameLower.includes('tandoori full') || nameLower.includes('whole bird')) {
    cutId = 'chk-whole';
    qtyKg = 1.10;
  } else if (nameLower.includes('tandoori half') || nameLower.includes('afgani tandoori')) {
    cutId = 'chk-whole';
    qtyKg = 0.55;
  } else if (nameLower.includes('tikka') || nameLower.includes('kebab') || catLower.includes('tandoor')) {
    if (nameLower.includes('seekh') || nameLower.includes('momo') || nameLower.includes('keema')) {
      cutId = 'chk-keema';
      qtyKg = 0.20;
    } else {
      cutId = 'chk-marinated';
      qtyKg = 0.24;
    }
  } else if (nameLower.includes('biryani') || nameLower.includes('curry') || nameLower.includes('handi')) {
    cutId = 'chk-currycut';
    qtyKg = 0.26;
  } else if (nameLower.includes('fried rice') || nameLower.includes('noodles') || nameLower.includes('rice') || nameLower.includes('claypot') || nameLower.includes('pot rice')) {
    cutId = 'chk-boneless';
    qtyKg = 0.14;
  } else if (nameLower.includes('crispy') || nameLower.includes('chilli') || nameLower.includes('manchurian') || nameLower.includes('teriyaki') || nameLower.includes('kung pao') || nameLower.includes('sushi') || nameLower.includes('ramen') || catLower.includes('starter')) {
    cutId = 'chk-boneless';
    qtyKg = 0.18;
  }

  return { cutId, qtyKg };
};

export const fetchLivePosData = async () => {
  try {
    const res = await fetch(FIRESTORE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    const dataString = raw?.fields?.data?.stringValue;
    if (!dataString) throw new Error('No data string in Firestore');

    const posData = JSON.parse(dataString);
    const rawMenu = posData.menu || [];
    const bills = posData.bills || [];
    const settings = posData.settings || {};

    // Filter chicken/non-veg dishes
    const processedMenu = [];
    rawMenu.forEach(m => {
      const name = m.name || '';
      const cat = m.cat || '';
      const veg = String(m.veg || '').toLowerCase();
      const sub = String(m.sub || '').toLowerCase();
      const fullPrice = m.full || 0;
      const halfPrice = m.half || 0;

      const isChicken = name.toLowerCase().includes('chicken') ||
        sub.includes('chicken') ||
        name.toLowerCase().includes('lolipop') ||
        name.toLowerCase().includes('tandoori') ||
        name.toLowerCase().includes('tikka') ||
        name.toLowerCase().includes('kebab') ||
        (veg === 'non' && !['veg', 'paneer', 'mushroom'].some(k => name.toLowerCase().includes(k)));

      if (isChicken && fullPrice > 0) {
        const { cutId, qtyKg } = mapDishToMeatCut(name, cat, sub);
        processedMenu.push({
          id: m.id || `dish-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: name,
          price: fullPrice,
          halfPrice: halfPrice,
          category: cat || 'Main Course',
          sub: sub,
          ingredients: [{ itemId: cutId, qtyKg }]
        });
      }
    });

    return {
      success: true,
      source: 'live_firestore',
      restaurantName: settings.name || 'Indus Wok',
      tagline: settings.tagline || 'Asian · Chinese · Pan-Asian Kitchen',
      phone: settings.phone || '8850241377',
      totalBills: bills.length,
      menu: processedMenu,
      bills: bills
    };
  } catch (err) {
    console.warn('POS live sync failed, using cached Indus Wok snapshot:', err);
    return {
      success: true,
      source: 'cached_snapshot',
      restaurantName: fallbackPosData.restaurant?.name || 'Indus Wok',
      tagline: fallbackPosData.restaurant?.tagline || 'Asian · Chinese · Pan-Asian Kitchen',
      phone: fallbackPosData.restaurant?.phone || '8850241377',
      totalBills: fallbackPosData.bills?.length || 338,
      menu: fallbackPosData.menu,
      bills: fallbackPosData.bills
    };
  }
};

// Helper to extract dish counts for any date from POS bills
export const extractSalesForDate = (bills, dateStr) => {
  const dishSales = {};
  const matchingBills = bills.filter(b => b.date === dateStr);

  matchingBills.forEach(b => {
    (b.items || []).forEach(it => {
      const name = it.name;
      const qty = parseInt(it.qty) || 1;
      if (name) {
        dishSales[name] = (dishSales[name] || 0) + qty;
      }
    });
  });

  return {
    date: dateStr,
    totalBillsCount: matchingBills.length,
    dishSales,
    matchingBills
  };
};
