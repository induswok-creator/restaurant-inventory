import { REAL_INDUS_WOK_LOGS } from './realPosLogs';

export const DEFAULT_ITEMS = [
  {
    id: 'chk-boneless',
    name: 'Chicken Boneless (Breast/Thigh)',
    category: 'Boneless',
    unit: 'kg',
    defaultCostPerUnit: 280,
    minParKg: 15,
    maxParKg: 45,
    shelfLifeDays: 3,
    prepYield: 0.92,
    icon: '🥩',
    description: 'Fresh boneless for Chicken Fried Rice, Chicken Crispy, Chilli Dry, Teriyaki & Soups'
  },
  {
    id: 'chk-wings',
    name: 'Chicken Lolipop / Wings',
    category: 'Special Cuts',
    unit: 'kg',
    defaultCostPerUnit: 220,
    minParKg: 8,
    maxParKg: 25,
    shelfLifeDays: 4,
    prepYield: 0.98,
    icon: '🍗',
    description: 'Fresh chicken wings & lolipop cuts for Chicken Lolipop Oil Fry & Masala Dry'
  },
  {
    id: 'chk-currycut',
    name: 'Chicken Curry Cut (Bone-in)',
    category: 'Bone-in',
    unit: 'kg',
    defaultCostPerUnit: 190,
    minParKg: 15,
    maxParKg: 50,
    shelfLifeDays: 3,
    prepYield: 0.95,
    icon: '🍗',
    description: 'Curry cut pieces (75-80g) for Handi, Masalas and Gravies'
  },
  {
    id: 'chk-whole',
    name: 'Whole Broiler Chicken (Cleaned)',
    category: 'Whole Birds',
    unit: 'kg',
    defaultCostPerUnit: 175,
    minParKg: 8,
    maxParKg: 30,
    shelfLifeDays: 3,
    prepYield: 0.88,
    icon: '🐔',
    description: '1.2-1.4kg whole cleaned broiler for Chicken Tandoori Full & Afgani Tandoori'
  },
  {
    id: 'chk-marinated',
    name: 'Marinated Tikka Batches',
    category: 'Semi-Finished',
    unit: 'kg',
    defaultCostPerUnit: 235,
    minParKg: 8,
    maxParKg: 25,
    shelfLifeDays: 2,
    prepYield: 1.0,
    icon: '🌶️',
    description: 'Pre-marinated tikka cuts (Pahadi, Angara, Malai, Reshmi) resting in chiller'
  },
  {
    id: 'chk-keema',
    name: 'Chicken Keema (Minced)',
    category: 'Minced',
    unit: 'kg',
    defaultCostPerUnit: 260,
    minParKg: 4,
    maxParKg: 15,
    shelfLifeDays: 2,
    prepYield: 0.98,
    icon: '🥣',
    description: 'Ground minced meat for Chicken Seekh Kebab & Momos'
  }
];

export const DEFAULT_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'Al-Madina Chicken & Seafood',
    category: 'Meat & Poultry',
    contactPerson: 'Bhaijaan / Dispatch Lead',
    phone: '+91 98201 44552',
    whatsappNumber: '919820144552',
    deliveryTime: '08:00 AM - 09:30 AM',
    leadTimeHours: 12,
    rating: 4.9,
    paymentTerms: 'Weekly Credit',
    outstandingDues: 0
  },
  {
    id: 'sup-2',
    name: 'Fresh Veg Mart',
    category: 'Vegetables',
    contactPerson: 'Suresh Bhai',
    phone: '+91 98330 11229',
    whatsappNumber: '919833011229',
    deliveryTime: '07:30 AM - 09:00 AM',
    leadTimeHours: 10,
    rating: 4.7,
    paymentTerms: 'Cash On Delivery',
    outstandingDues: 0
  },
  {
    id: 'sup-3',
    name: 'Apex Poultry Wholesale Farms',
    category: 'Meat & Poultry',
    contactPerson: 'Imran Malik',
    phone: '+91 98200 88771',
    whatsappNumber: '919820088771',
    deliveryTime: '08:30 AM - 10:00 AM',
    leadTimeHours: 14,
    rating: 4.8,
    paymentTerms: 'Weekly Credit',
    outstandingDues: 0
  }
];

export const generateRealisticHistory = () => {
  return REAL_INDUS_WOK_LOGS;
};
