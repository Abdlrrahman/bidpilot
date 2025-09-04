import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Navigation, ActiveTab } from './components/layout/Navigation';
import { OverviewView } from './components/views/OverviewView';
import { RequirementsView } from './components/views/RequirementsView';
import { PricingView } from './components/views/PricingView';
import { GoNoGoView } from './components/views/GoNoGoView';
import { MonteCarloView } from './components/views/MonteCarloView';
import { RfpComparisonView } from './components/views/RfpComparisonView';
import { TimelineView } from './components/views/TimelineView';
import { EvidenceView } from './components/views/EvidenceView';
import { ExecutiveSummaryView } from './components/views/ExecutiveSummaryView';
import { MethodologyView } from './components/views/MethodologyView';
import { AuthLockModal } from './components/auth/AuthLockModal';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const { isRtl } = useApp();

  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'requirements' && <RequirementsView />}
        {activeTab === 'pricing' && <PricingView />}
        {activeTab === 'gonogo' && <GoNoGoView />}
        {activeTab === 'montecarlo' && <MonteCarloView />}
        {activeTab === 'comparison' && <RfpComparisonView />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'evidence' && <EvidenceView />}
        {activeTab === 'summary' && <ExecutiveSummaryView />}
        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>BidPilot</strong> — Developed by <strong>Abdlrrahman Shibani</strong>.
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            Static GitHub Pages Architecture | Deterministic Synthetic Data | WCAG 2.2 AA Compliant
          </div>
        </div>
      </footer>

      {/* Security Clearance Lock Screen Modal */}
      <AuthLockModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
