import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Layout } from './components/Layout';
import { OverviewTab } from './components/OverviewTab';
import { PurchaseLedgerTab } from './components/PurchaseLedgerTab';
import { WhatsAppHubTab } from './components/WhatsAppHubTab';
import { NightClosingTab } from './components/NightClosingTab';
import { MorningReceivingTab } from './components/MorningReceivingTab';
import { SalesUsageTab } from './components/SalesUsageTab';
import { WastageAnalyticsTab } from './components/WastageAnalyticsTab';
import { AiOrderPlannerTab } from './components/AiOrderPlannerTab';
import { MonthlyReportTab } from './components/MonthlyReportTab';
import { ItemCatalogTab } from './components/ItemCatalogTab';
import { SettingsTab } from './components/SettingsTab';

const AppContent = () => {
  const { activeTab } = useInventory();

  return (
    <Layout>
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'purchase-ledger' && <PurchaseLedgerTab />}
      {activeTab === 'whatsapp' && <WhatsAppHubTab />}
      {activeTab === 'night-closing' && <NightClosingTab />}
      {activeTab === 'morning-receiving' && <MorningReceivingTab />}
      {activeTab === 'sales-usage' && <SalesUsageTab />}
      {activeTab === 'wastage' && <WastageAnalyticsTab />}
      {activeTab === 'ai-ordering' && <AiOrderPlannerTab />}
      {activeTab === 'monthly-report' && <MonthlyReportTab />}
      {activeTab === 'catalog' && <ItemCatalogTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </Layout>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}
