import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  FileSpreadsheet, 
  Download, 
  FileText, 
  Calendar, 
  TrendingDown, 
  CheckCircle2, 
  Camera, 
  Eye, 
  X, 
  DollarSign, 
  Sparkles, 
  Award,
  Filter
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import confetti from 'canvas-confetti';

export const MonthlyReportTab = () => {
  const { dailyLogs, items, currency } = useInventory();

  const [filterRange, setFilterRange] = useState('all'); // 'all' | '7days' | '14days' | 'weekends'
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter logs based on selection
  let filteredLogs = [...dailyLogs];
  if (filterRange === '7days') {
    filteredLogs = dailyLogs.slice(0, 7);
  } else if (filterRange === '14days') {
    filteredLogs = dailyLogs.slice(0, 14);
  } else if (filterRange === 'weekends') {
    filteredLogs = dailyLogs.filter(l => l.dayOfWeek === 'Friday' || l.dayOfWeek === 'Saturday' || l.dayOfWeek === 'Sunday');
  }

  // Monthly Aggregate Totals
  const totalProcuredKg = Number(filteredLogs.reduce((acc, l) => acc + (l.deliveryReceived?.totalKg || 0), 0).toFixed(1));
  const totalProcuredCost = Math.round(filteredLogs.reduce((acc, l) => acc + (l.deliveryReceived?.totalCost || 0), 0));
  
  const totalSoldKg = Number(filteredLogs.reduce((acc, l) => acc + (l.salesAndUsage?.totalChickenSoldKg || 0), 0).toFixed(1));
  const totalKitchenDrawnKg = Number(filteredLogs.reduce((acc, l) => acc + (l.salesAndUsage?.totalKitchenDrawnKg || 0), 0).toFixed(1));

  const totalWastageKg = Number(filteredLogs.reduce((acc, l) => acc + (l.wastageSummary?.totalWastageKg || 0), 0).toFixed(1));
  const totalWastageCost = Math.round(filteredLogs.reduce((acc, l) => acc + (l.wastageSummary?.totalWastageCost || 0), 0));

  const shrinkagePercent = totalProcuredKg > 0 ? Number(((totalWastageKg / totalProcuredKg) * 100).toFixed(1)) : 0;
  const kitchenEfficiency = (100 - shrinkagePercent).toFixed(1);

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Tab 1: Executive Summary
    const summaryData = [
      ['POULTRYPULSE AI - RESTAURANT MONTH-END INVENTORY & WASTAGE REPORT'],
      ['Report Period:', '30-Day Operational Audit', 'Generated On:', new Date().toLocaleString()],
      [],
      ['Metric', 'Value', 'Unit / Note'],
      ['Total Chicken Procured', totalProcuredKg, 'Kilograms (KG)'],
      ['Total Procurement Cost', `${currency}${totalProcuredCost.toLocaleString()}`, 'Total Invoiced'],
      ['Total Chicken Sold in Dishes', totalSoldKg, 'Theoretical Recipe Yield (KG)'],
      ['Total Kitchen Drawn Meat', totalKitchenDrawnKg, 'Gross Raw Withdrawn (KG)'],
      ['Total Wastage & Shrinkage', totalWastageKg, 'Kilograms (KG)'],
      ['Total Wastage Financial Loss', `${currency}${totalWastageCost.toLocaleString()}`, 'Direct Food Cost Loss'],
      ['Shrinkage Rate', `${shrinkagePercent}%`, 'Benchmark: 5-8%'],
      ['Kitchen Efficiency Score', `${kitchenEfficiency}%`, 'Yield Performance']
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

    // Tab 2: Daily Log Data
    const dailyHeaders = [
      ['Date', 'Day', 'Night Closing (kg)', 'Morning Opening (kg)', 'Overnight Drip (kg)', 'Delivery Recvd (kg)', 'Supplier', 'Invoice #', 'Delivery Cost', 'Chicken Sold (kg)', 'Total Waste (kg)', 'Waste Cost', 'Night Supervisor', 'Morning Receiver']
    ];
    filteredLogs.forEach(l => {
      const nightKg = l.nightClosing?.items ? Object.values(l.nightClosing.items).reduce((a, b) => a + (Number(b.weight) || 0), 0) : 0;
      const morningKg = l.morningOpening?.items ? Object.values(l.morningOpening.items).reduce((a, b) => a + (Number(b.weight) || 0), 0) : 0;
      
      dailyHeaders.push([
        l.date,
        l.dayOfWeek,
        Number(nightKg.toFixed(2)),
        Number(morningKg.toFixed(2)),
        l.morningOpening?.overnightDripLossKg || 0,
        l.deliveryReceived?.totalKg || 0,
        l.deliveryReceived?.vendor || 'N/A',
        l.deliveryReceived?.invoiceNo || 'N/A',
        l.deliveryReceived?.totalCost || 0,
        l.salesAndUsage?.totalChickenSoldKg || 0,
        l.wastageSummary?.totalWastageKg || 0,
        l.wastageSummary?.totalWastageCost || 0,
        l.nightClosing?.staff || 'N/A',
        l.morningOpening?.staff || 'N/A'
      ]);
    });
    const wsDaily = XLSX.utils.aoa_to_sheet(dailyHeaders);
    XLSX.utils.book_append_sheet(wb, wsDaily, 'Daily Logs 30 Days');

    XLSX.writeFile(wb, `Restaurant_Chicken_Inventory_Monthly_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    setToastMessage('📥 End-of-month Excel report downloaded!');
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Export to PDF
  const handleExportPdf = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(234, 88, 12);
    doc.text('PoultryPulse AI - Restaurant Inventory & Wastage Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated for: The Tandoor & Grill Kitchen | Date: ${new Date().toLocaleDateString()}`, 14, 28);

    // Summary Table
    const summaryRows = [
      ['Total Chicken Procured', `${totalProcuredKg} kg`, 'Total Procurement Cost', `${currency}${totalProcuredCost.toLocaleString()}`],
      ['Total Chicken Sold', `${totalSoldKg} kg`, 'Kitchen Drawn Meat', `${totalKitchenDrawnKg} kg`],
      ['Total Wastage & Shrinkage', `${totalWastageKg} kg`, 'Total Wastage Loss', `${currency}${totalWastageCost.toLocaleString()}`],
      ['Shrinkage Rate', `${shrinkagePercent}%`, 'Kitchen Efficiency Score', `${kitchenEfficiency}%`]
    ];

    doc.autoTable({
      startY: 34,
      head: [['Metric', 'Value', 'Metric', 'Value']],
      body: summaryRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59] },
      styles: { fontSize: 9 }
    });

    // Daily Timeline Table
    const dailyRows = filteredLogs.slice(0, 20).map(l => [
      l.date,
      l.dayOfWeek.substring(0, 3),
      `${l.deliveryReceived?.totalKg || 0} kg`,
      `${currency}${l.deliveryReceived?.totalCost?.toLocaleString() || 0}`,
      `${l.salesAndUsage?.totalChickenSoldKg || 0} kg`,
      `${l.wastageSummary?.totalWastageKg || 0} kg`,
      `${currency}${l.wastageSummary?.totalWastageCost?.toLocaleString() || 0}`
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Date', 'Day', 'Delivered', 'Bill Cost', 'Sold (kg)', 'Waste (kg)', 'Waste Cost']],
      body: dailyRows,
      theme: 'striped',
      headStyles: { fillColor: [234, 88, 12] },
      styles: { fontSize: 8 }
    });

    doc.save(`Restaurant_Inventory_Audit_${new Date().toISOString().slice(0, 10)}.pdf`);
    setToastMessage('📥 Executive PDF Report downloaded!');
    confetti({ particleCount: 30, spread: 50 });
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
            📑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">End-of-Month Analysis & Audit Reconciliation</h2>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full border border-slate-700">
                30 Days Completed
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Audit the complete historical cycle of WhatsApp night closing photos, morning opening scale weights, deliveries, and wastage costs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Range */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterRange('all')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                filterRange === 'all' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All 30 Days
            </button>
            <button
              onClick={() => setFilterRange('7days')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                filterRange === '7days' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setFilterRange('weekends')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                filterRange === 'weekends' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekends
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/30 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Monthly KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Month Procurement</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalProcuredKg}</span>
            <span className="text-sm font-bold text-slate-400">KG</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span>Total Spend</span>
            <span className="text-white font-bold">{currency}{totalProcuredCost.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Chicken Sold</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">{totalSoldKg}</span>
            <span className="text-sm font-bold text-slate-400">KG</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span>Recipe Yield</span>
            <span className="text-emerald-400 font-bold">{kitchenEfficiency}% Clean Meat</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Month Wastage & Shrinkage</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-400">{totalWastageKg}</span>
            <span className="text-sm font-bold text-slate-400">KG</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span>Wastage Cost</span>
            <span className="text-red-400 font-bold">{currency}{totalWastageCost.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Kitchen Yield Efficiency</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{kitchenEfficiency}%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span>Shrinkage Rate</span>
            <span className="text-amber-400 font-bold">{shrinkagePercent}% of Inbound</span>
          </div>
        </div>
      </div>

      {/* 30-Day Daily Log Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Day-by-Day Historical Log & Scale Photos Audit ({filteredLogs.length} days)
            </h3>
            <p className="text-[11px] text-slate-400">Click any row to inspect night WhatsApp scale photo and supplier challan</p>
          </div>
          <span className="text-[11px] text-orange-400 font-bold">Showing {filteredLogs.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <th className="pb-3 px-3">Date / Day</th>
                <th className="pb-3 px-3">Night Closing</th>
                <th className="pb-3 px-3">Morning Audit</th>
                <th className="pb-3 px-3">Delivery Inbound</th>
                <th className="pb-3 px-3">Meat Sold</th>
                <th className="pb-3 px-3">Day Wastage</th>
                <th className="pb-3 px-3">Waste Cost</th>
                <th className="pb-3 px-3 text-right">Photo Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => {
                const nightKg = log.nightClosing?.items ? Object.values(log.nightClosing.items).reduce((a, b) => a + (Number(b.weight) || 0), 0) : 0;
                const morningKg = log.morningOpening?.items ? Object.values(log.morningOpening.items).reduce((a, b) => a + (Number(b.weight) || 0), 0) : 0;
                const isHighWaste = (log.wastageSummary?.totalWastageKg || 0) > 5.5;

                return (
                  <tr
                    key={log.date}
                    onClick={() => setSelectedDayDetail(log)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{log.date}</div>
                      <span className="text-[10px] text-slate-400">{log.dayOfWeek}</span>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {nightKg > 0 ? `${Number(nightKg.toFixed(1))} kg` : '—'}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {morningKg > 0 ? (
                        <div>
                          <span>{Number(morningKg.toFixed(1))} kg</span>
                          <span className="text-[10px] text-amber-400 block">(-{log.morningOpening.overnightDripLossKg} kg drip)</span>
                        </div>
                      ) : '—'}
                    </td>

                    <td className="py-3.5 px-3">
                      {log.deliveryReceived ? (
                        <div>
                          <span className="font-mono font-bold text-white">{log.deliveryReceived.totalKg} kg</span>
                          <span className="text-[10px] text-slate-400 block">{currency}{log.deliveryReceived.totalCost.toLocaleString()}</span>
                        </div>
                      ) : '—'}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {log.salesAndUsage?.totalChickenSoldKg ? `${log.salesAndUsage.totalChickenSoldKg} kg` : '—'}
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold">
                      <span className={isHighWaste ? 'text-red-400' : 'text-slate-300'}>
                        {log.wastageSummary?.totalWastageKg || 0} kg
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-red-400 font-bold">
                      {currency}{log.wastageSummary?.totalWastageCost?.toLocaleString() || 0}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 ml-auto">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Day Detail Inspector Modal */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Day Audit Inspector: {selectedDayDetail.date} ({selectedDayDetail.dayOfWeek})</span>
                </h3>
                <p className="text-xs text-slate-400">{selectedDayDetail.notes}</p>
              </div>
              <button
                onClick={() => setSelectedDayDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Photos Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Night Photo */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-400">🌙 Night Closing Scale Photo</span>
                  <span className="text-[10px] text-slate-400">{selectedDayDetail.nightClosing?.staff || 'Night Shift'}</span>
                </div>
                <div className="rounded-xl overflow-hidden max-h-48 flex items-center justify-center bg-slate-900">
                  <img
                    src={selectedDayDetail.nightClosing?.photoUrl || ''}
                    alt="Night scale"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Chiller Temp: {selectedDayDetail.nightClosing?.chillerTemp || '2.4°C'}</p>
              </div>

              {/* Delivery Challan */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">🚚 Fresh Delivery Challan</span>
                  <span className="text-[10px] text-slate-400">Inv #{selectedDayDetail.deliveryReceived?.invoiceNo}</span>
                </div>
                <div className="rounded-xl overflow-hidden max-h-48 flex items-center justify-center bg-slate-900">
                  <img
                    src={selectedDayDetail.deliveryReceived?.challanPhoto || ''}
                    alt="Delivery Challan"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Delivered: {selectedDayDetail.deliveryReceived?.totalKg} kg • {currency}{selectedDayDetail.deliveryReceived?.totalCost?.toLocaleString()}</p>
              </div>
            </div>

            {/* WhatsApp Text Log */}
            <div className="bg-[#0b141a] p-4 rounded-xl border border-[#222e35] space-y-2">
              <span className="text-xs font-bold text-emerald-400">WhatsApp Raw Message Ingested:</span>
              <p className="text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                {selectedDayDetail.nightClosing?.whatsAppMessage || 'Standard night closing report submitted.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
