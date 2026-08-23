import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Truck, X, Save, Plus, Phone, Clock, DollarSign, Tag, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AddVendorModal = ({ isOpen, onClose, initialData = null }) => {
  const { suppliers, setSuppliers, currency } = useInventory();

  const [vendorName, setVendorName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Meat & Poultry');
  const [contactPerson, setContactPerson] = useState(initialData?.contactPerson || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [whatsappNumber, setWhatsappNumber] = useState(initialData?.whatsappNumber || '');
  const [deliveryTime, setDeliveryTime] = useState(initialData?.deliveryTime || '08:00 AM - 09:30 AM');
  const [leadTimeHours, setLeadTimeHours] = useState(initialData?.leadTimeHours || 12);
  const [outstandingDues, setOutstandingDues] = useState(initialData?.outstandingDues || 0);
  const [paymentTerms, setPaymentTerms] = useState(initialData?.paymentTerms || 'Weekly Credit');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendorName.trim()) {
      alert('Please enter a vendor name');
      return;
    }

    const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '') || phone.replace(/[^0-9]/g, '');

    if (initialData?.id) {
      // Update existing vendor
      setSuppliers(suppliers.map(s => s.id === initialData.id ? {
        ...s,
        name: vendorName,
        category,
        contactPerson,
        phone,
        whatsappNumber: cleanWhatsapp,
        deliveryTime,
        leadTimeHours: parseInt(leadTimeHours) || 12,
        outstandingDues: parseFloat(outstandingDues) || 0,
        paymentTerms
      } : s));
    } else {
      // Create new vendor
      const newVendor = {
        id: `sup-${Date.now()}`,
        name: vendorName,
        category,
        contactPerson,
        phone,
        whatsappNumber: cleanWhatsapp,
        deliveryTime,
        leadTimeHours: parseInt(leadTimeHours) || 12,
        outstandingDues: parseFloat(outstandingDues) || 0,
        paymentTerms,
        rating: 4.8
      };
      setSuppliers([...suppliers, newVendor]);
    }

    confetti({ particleCount: 35, spread: 60 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xl">
              🚚
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {initialData?.id ? 'Edit Supplier / Vendor' : '+ Add New Supplier / Vendor'}
              </h3>
              <p className="text-xs text-slate-400">Poultry, Meat, Veg & Raw Material Suppliers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto ios-scroll">
          {/* Vendor Name */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Supplier / Vendor Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Al-Madina Chicken & Seafood"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category & Contact Person */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-orange-500"
              >
                <option value="Meat & Poultry">🍗 Meat & Poultry</option>
                <option value="Seafood">🦐 Seafood / Prawns</option>
                <option value="Vegetables">🥦 Vegetables & Herbs</option>
                <option value="Dairy">🧀 Dairy & Paneer</option>
                <option value="Gas & Utilities">🔥 Commercial Gas</option>
                <option value="Packaging">📦 Packaging / Containers</option>
                <option value="General Grocery">🥫 Asian Sauces & Spices</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Contact Person / Dispatch Lead
              </label>
              <input
                type="text"
                placeholder="e.g. Imran Bhai"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98201 44552"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                WhatsApp Number (for PO dispatch)
              </label>
              <input
                type="tel"
                placeholder="919820144552"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Delivery Window & Lead Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Standard Delivery Window
              </label>
              <input
                type="text"
                placeholder="08:00 AM - 09:30 AM"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Order Lead Time (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="72"
                value={leadTimeHours}
                onChange={(e) => setLeadTimeHours(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Payment Terms & Outstanding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Payment Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-orange-500"
              >
                <option value="Weekly Credit">Weekly Credit (Pay Every Mon)</option>
                <option value="Cash On Delivery">Cash On Delivery (COD)</option>
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Monthly Account">Monthly Account</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Opening Outstanding Dues ({currency})
              </label>
              <input
                type="number"
                min="0"
                value={outstandingDues}
                onChange={(e) => setOutstandingDues(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{initialData?.id ? 'Update Supplier' : 'Save Supplier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
