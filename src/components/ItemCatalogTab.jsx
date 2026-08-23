import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  UtensilsCrossed, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Save, 
  ChefHat, 
  Truck, 
  Layers,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ItemCatalogTab = () => {
  const { 
    items, 
    setItems, 
    recipes, 
    setRecipes, 
    suppliers, 
    setSuppliers, 
    currency 
  } = useInventory();

  const [activeCatalogTab, setActiveCatalogTab] = useState('items'); // 'items' | 'recipes' | 'suppliers'
  const [editingItem, setEditingItem] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Handle Save Item
  const handleSaveItem = (itemData) => {
    if (itemData.id) {
      setItems(items.map(i => i.id === itemData.id ? itemData : i));
    } else {
      const newItem = {
        ...itemData,
        id: `chk-custom-${Date.now()}`
      };
      setItems([...items, newItem]);
    }
    setEditingItem(null);
    setToastMessage('✅ Meat cut item saved successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Save Recipe
  const handleSaveRecipe = (recipeData) => {
    if (recipeData.id) {
      setRecipes(recipes.map(r => r.id === recipeData.id ? recipeData : r));
    } else {
      const newRecipe = {
        ...recipeData,
        id: `dish-custom-${Date.now()}`
      };
      setRecipes([...recipes, newRecipe]);
    }
    setEditingRecipe(null);
    setToastMessage('✅ Menu dish recipe saved successfully!');
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
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl shadow-lg">
            🍗
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Item Master, Recipes & Supplier Directory</h2>
            <p className="text-xs text-slate-400">
              Customize your chicken cuts, kitchen prep yields, dish portion recipes, and supplier WhatsApp dispatch numbers.
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveCatalogTab('items')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCatalogTab === 'items' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Meat Cuts ({items.length})
          </button>
          <button
            onClick={() => setActiveCatalogTab('recipes')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCatalogTab === 'recipes' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Menu Recipes ({recipes.length})
          </button>
          <button
            onClick={() => setActiveCatalogTab('suppliers')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCatalogTab === 'suppliers' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Poultry Suppliers ({suppliers.length})
          </button>
        </div>
      </div>

      {/* View 1: Raw Meat Cuts */}
      {activeCatalogTab === 'items' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Raw Poultry Items & Yield Standards</h3>
            <button
              onClick={() => setEditingItem({
                name: '',
                category: 'Boneless',
                unit: 'kg',
                defaultCostPerUnit: 250,
                minParKg: 10,
                maxParKg: 30,
                shelfLifeDays: 3,
                prepYield: 0.92,
                icon: '🥩',
                description: ''
              })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Meat Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 relative group hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <span className="text-[10px] text-slate-400">{item.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cost / Unit:</span>
                    <span className="font-mono font-bold text-white">{currency}{item.defaultCostPerUnit} / {item.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Prep Yield:</span>
                    <span className="font-mono font-bold text-emerald-400">{Math.round(item.prepYield * 100)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Par Levels:</span>
                    <span className="font-mono text-slate-300">{item.minParKg} - {item.maxParKg} {item.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Shelf Life:</span>
                    <span className="font-mono text-slate-300">{item.shelfLifeDays} days max</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Menu Recipes */}
      {activeCatalogTab === 'recipes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Kitchen Recipes & Raw Portion Mapping</h3>
            <button
              onClick={() => setEditingRecipe({
                name: '',
                price: 300,
                category: 'Curries',
                ingredients: [{ itemId: items[0]?.id || 'chk-boneless', qtyKg: 0.22 }]
              })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Menu Recipe</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((dish) => (
              <div 
                key={dish.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{dish.name}</h4>
                    <span className="text-[10px] text-slate-400">{dish.category}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/40">
                    {currency}{dish.price}
                  </span>
                </div>

                <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Meat Ingredients per Portion:</span>
                  {dish.ingredients.map((ing, i) => {
                    const itemObj = items.find(it => it.id === ing.itemId);
                    return (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{itemObj?.name || ing.itemId}</span>
                        <span className="font-mono font-bold text-orange-400">{ing.qtyKg * 1000}g</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Suppliers */}
      {activeCatalogTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Poultry Suppliers & Dispatch Contacts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((sup) => (
              <div 
                key={sup.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{sup.name}</h4>
                    <span className="text-xs text-slate-400">Contact: {sup.contactPerson}</span>
                  </div>
                  <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                    ★ {sup.rating}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block text-[10px]">WhatsApp Phone:</span>
                    <span className="font-mono text-emerald-400 font-bold">{sup.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Delivery Window:</span>
                    <span className="text-slate-200">{sup.deliveryTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Order Lead Time:</span>
                    <span className="text-slate-200">{sup.leadTimeHours} Hours</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Payment Terms:</span>
                    <span className="text-slate-200">{sup.paymentTerms}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Edit Chicken Cut Details</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Item Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Cost Per KG ({currency})</label>
                  <input
                    type="number"
                    value={editingItem.defaultCostPerUnit}
                    onChange={(e) => setEditingItem({ ...editingItem, defaultCostPerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Prep Yield (0.8 - 1.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.prepYield}
                    onChange={(e) => setEditingItem({ ...editingItem, prepYield: parseFloat(e.target.value) || 0.9 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Min Par Level (kg)</label>
                  <input
                    type="number"
                    value={editingItem.minParKg}
                    onChange={(e) => setEditingItem({ ...editingItem, minParKg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Max Par Level (kg)</label>
                  <input
                    type="number"
                    value={editingItem.maxParKg}
                    onChange={(e) => setEditingItem({ ...editingItem, maxParKg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveItem(editingItem)}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
