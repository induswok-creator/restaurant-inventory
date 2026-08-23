import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { AddVendorModal } from './AddVendorModal';
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
  X,
  Phone,
  Search
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
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [editingSupplierData, setEditingSupplierData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleEditVendor = (sup) => {
    setEditingSupplierData(sup);
    setVendorModalOpen(true);
  };

  const handleAddVendor = () => {
    setEditingSupplierData(null);
    setVendorModalOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Vendor Add/Edit Modal */}
      <AddVendorModal
        isOpen={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
        initialData={editingSupplierData}
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
            🍗
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Indus Wok Items, Recipes & Suppliers</h2>
            <p className="text-xs text-slate-400">
              Manage raw chicken cuts, Indus Wok recipes, and supplier WhatsApp dispatch numbers.
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveCatalogTab('items')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeCatalogTab === 'items' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Cuts ({items.length})
          </button>
          <button
            onClick={() => setActiveCatalogTab('recipes')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeCatalogTab === 'recipes' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            POS Menu ({recipes.length})
          </button>
          <button
            onClick={() => setActiveCatalogTab('suppliers')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeCatalogTab === 'suppliers' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vendors ({suppliers.length})
          </button>
        </div>
      </div>

      {/* View 1: Raw Meat Cuts */}
      {activeCatalogTab === 'items' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Raw Poultry Items & Yields</h3>
            <button
              onClick={() => setEditingItem({
                name: '',
                category: 'Boneless',
                unit: 'kg',
                defaultCostPerUnit: 280,
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
              <span>+ Add Meat Cut</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                    <span className="font-mono text-slate-300">{item.shelfLifeDays} days</span>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Indus Wok Menu Dishes ({recipes.length} dishes from POS)
            </h3>

            <input
              type="text"
              placeholder="Search recipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 text-xs text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-orange-500 w-full sm:w-56"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1 ios-scroll">
            {recipes.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase())).map((dish) => (
              <div 
                key={dish.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{dish.name}</h4>
                    <span className="text-[10px] text-slate-400">{dish.category}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/40 shrink-0 ml-2">
                    {currency}{dish.price}
                  </span>
                </div>

                <div className="bg-slate-800/40 p-2 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Meat Used per Portion:</span>
                  {dish.ingredients.map((ing, i) => {
                    const itemObj = items.find(it => it.id === ing.itemId);
                    return (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 truncate max-w-[160px]">{itemObj?.name || ing.itemId}</span>
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

      {/* View 3: Suppliers & Vendors */}
      {activeCatalogTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Poultry & Kitchen Vendors ({suppliers.length})
            </h3>
            <button
              onClick={handleAddVendor}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/30 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Supplier / Vendor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((sup) => (
              <div 
                key={sup.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 relative group hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-white">{sup.name}</h4>
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.2 rounded border border-orange-500/30">
                        {sup.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 mt-0.5 block">Contact: {sup.contactPerson || 'Dispatch Lead'}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditVendor(sup)}
                      className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block text-[10px]">WhatsApp:</span>
                    <span className="font-mono text-emerald-400 font-bold">{sup.phone || sup.whatsappNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Delivery Window:</span>
                    <span className="text-slate-200">{sup.deliveryTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lead Time:</span>
                    <span className="text-slate-200">{sup.leadTimeHours} Hours</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Payment Terms:</span>
                    <span className="text-slate-200">{sup.paymentTerms}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`https://wa.me/${sup.whatsappNumber || sup.phone?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Send WhatsApp Message</span>
                  </a>

                  <span className="text-xs text-amber-400 font-bold">
                    Dues: {currency}{sup.outstandingDues || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4">
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
