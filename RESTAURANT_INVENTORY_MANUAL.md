# 🍗 PoultryPulse AI — Restaurant Meat Inventory & Wastage Management System

Welcome to **PoultryPulse AI**, a tailored inventory intelligence platform designed specifically for restaurant kitchen meat operations (chicken cuts, marinades, butchery yields, and supplier reconciliations).

---

## 🎯 The Real-World Restaurant Problem Solved

1. **Night WhatsApp Photo Ingestion**:
   - Staff traditionally takes photos of pending chicken tubs / weighing scales at night closing (23:30 PM) and sends them to a WhatsApp group.
   - **PoultryPulse Solution**: A dedicated **WhatsApp Hub & OCR Vision Ingestion tool** that parses raw WhatsApp messages and scale photos into structured numerical stock records with zero manual spreadsheet entry.

2. **Morning Opening Reconciliation & Overnight Variance Detection**:
   - Morning shift staff (08:30 AM) inspects the pending tubs before cooking.
   - **PoultryPulse Solution**: Automatically compares **Morning Opening vs Night Closing** to detect overnight drip loss, defrost shrinkage, or unrecorded late-night staff meal theft in red/amber alerts.

3. **Fresh Poultry Delivery Intake**:
   - Poultry suppliers (e.g. Apex Fresh Poultry Farms) deliver fresh meat crates with delivery challans/bills.
   - **PoultryPulse Solution**: Log crate weights, supplier invoice number, HACCP vehicle temperature (+1.8°C), and attach challan photos to calculate **Total Kitchen Usable Meat = Morning Stock + Fresh Delivery**.

4. **Recipe-Based Kitchen Sales Consumption**:
   - Syncs with POS dish sales (Butter Chicken, Chicken Dum Biryani, Chicken Tikka, Tangdi Kebab, Momos, etc.).
   - Computes **Theoretical Raw Meat Consumed** vs **Actual Meat Withdrawn** to calculate portion drift and butcher trim losses.

5. **End-of-Month Wastage & Financial P&L Diagnostics**:
   - Breaks down wastage by root cause:
     - 🔪 **Trimming & Butchery Loss** (Skin, bone cartilage, excess fat)
     - ❄️ **Overnight Drip & Moisture Loss** (Defrost evaporation)
     - ☣️ **Spoilage & Shelf-Life Expiry** (Meat exceeding 3 days)
     - 🔥 **Kitchen Mistakes & Burnt Batches**
   - Quantifies total wastage in **Kilograms (KG)** and **Direct Food Cost Loss (₹ / $)** with an automated **Kitchen Yield Efficiency Score (e.g. 94.2%)**.

6. **AI Demand Forecasting & Predictive Smart Purchase Orders**:
   - Machine Learning algorithm analyzes 30 days of historical demand patterns taking into account:
     - 📈 **Day-of-Week Velocity** (Friday/Saturday/Sunday weekend surge vs Monday slowdown)
     - 🌧️ **Weather Impact** (Monsoon/rain boosts delivery orders by +15%)
     - 🛡️ **Lead-Time Aware Safety Buffer** (20-30% buffer against 8 PM rush)
     - 🔪 **Prep Yield Compensation** (Factoring 8% trimming loss so kitchen never runs out)
   - **1-Click WhatsApp Purchase Order Generator**: Automatically generates formatted text with exact items, ready to copy or send directly to the supplier's WhatsApp number with one tap.

---

## 🚀 Key Modules Overview

| Tab | Feature | Description |
|---|---|---|
| **📊 Dashboard** | Executive Live Overview | Real-time stock levels across 8 cuts, today's delivery status, chiller temps, 7-day sales vs wastage trend, and workflow checklist. |
| **💬 WhatsApp Hub** | Live Parser & Vision OCR | Paste WhatsApp chat messages or upload scale photos to auto-extract items, weights, temperatures, and staff signatures. |
| **🌙 Night Closing** | End-of-Day Audit | Log closing pending chicken stock, digital scale LED photo verification, HACCP chiller temperature check, and WhatsApp broadcast draft. |
| **☀️ Morning & Delivery** | 2-Step Morning Protocol | **Step 1:** Reconcile morning scale against night closing (thaw loss). **Step 2:** Record fresh delivery invoice, vendor, and new stock kg. |
| **🍳 Sales & Recipes** | Kitchen Portion Control | Input dishes sold from billing POS to calculate theoretical meat requirement and detect portion over-serving. |
| **📉 Wastage Analytics** | Deep-Dive Shrinkage | 30-day timeline charts, day-of-week wastage spikes, root-cause categorization, and AI actionable loss reduction recommendations. |
| **🤖 AI Smart Ordering** | Predictive Purchase Orders | Interactive forecast engine with scenario tuning (weather, weekend surge, safety buffer), editable PO table, and 1-click WhatsApp supplier ordering. |
| **📑 End-of-Month Report**| 30-Day Audit & Exports | Full month reconciliation table, Day Inspector drawer with photo proofs, and 1-click **Excel (.xlsx)** and **PDF Executive Report** download. |
| **🍗 Items & Recipes** | Catalog Master | Customize raw chicken cuts (Boneless, Curry cut, Wings, Drumsticks, Keema, etc.), prep yield %, min/max par levels, and dish recipes. |
| **⚙️ Settings** | Configuration & Backup | Switch currencies (₹ INR, $ USD, £, €, AED), update restaurant details, and export/import full JSON system backups. |

---

## 🧮 The Mathematics Behind the System

### 1. Daily Variance & Wastage Formula
$$\text{Variance} = (\text{Opening Stock} + \text{Received Delivery}) - (\text{Theoretical Sales Usage} + \text{Closing Stock})$$

### 2. Theoretical Recipe Meat Consumption
$$\text{Theoretical Raw Meat (kg)} = \sum (\text{Dish Portions Sold} \times \text{Recipe Meat Grams per Portion})$$

### 3. AI Predictive Order Recommendation Formula
$$\text{Gross Order Quantity} = \left( \frac{\text{Historical Average Demand} \times \text{Day-of-Week Multiplier} \times \text{Weather Factor}}{\text{Prep Yield Rate}} \right) + \text{Safety Buffer} - \text{Pending Night Stock}$$

---

*PoultryPulse AI is running live on the local preview server.*
