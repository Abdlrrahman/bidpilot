import React, { useState } from 'react';
import {
  ShieldCheck,
  Globe,
  RotateCcw,
  Download,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Coins
} from 'lucide-react';
import { useApp, DisplayCurrency } from '../../context/AppContext';
import { PricingScenario } from '../../types/procurement';
import { AuthUserMenu } from '../auth/AuthUserMenu';
import { AppSwitcher } from './AppSwitcher';
import { AuditTrailModal } from '../audit/AuditTrailModal';
import { TenderManagerModal } from '../modals/TenderManagerModal';
import { ProposalPrintDossier } from '../modals/ProposalPrintDossier';
import { CompetitorIntelligenceModal } from '../modals/CompetitorIntelligenceModal';
import { ReverseAuctionSimulatorModal } from '../modals/ReverseAuctionSimulatorModal';
import { FileCheck2, Plus, Printer, Users, Gavel } from 'lucide-react';

export const Header: React.FC = () => {
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isCompetitorModalOpen, setIsCompetitorModalOpen] = useState(false);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const {
    t,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    displayCurrency,
    setDisplayCurrency,
    opportunity,
    activeScenario,
    setActiveScenario,
    rfpPresets,
    setOpportunityPreset,
    resetDemo,
    exportOpportunityJson,
    importOpportunityJson
  } = useApp();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState(false);

  const handleImport = () => {
    const success = importOpportunityJson(importJsonText);
    if (success) {
      setIsImportModalOpen(false);
      setImportJsonText('');
      setImportError(false);
    } else {
      setImportError(true);
    }
  };

  const scenarios: { id: PricingScenario; label: string }[] = [
    { id: 'target', label: t.pricing.target.split(' ')[0] },
    { id: 'conservative', label: t.pricing.conservative.split(' ')[0] },
    { id: 'competitive', label: t.pricing.competitive.split(' ')[0] }
  ];

  const currencies: DisplayCurrency[] = ['USD', 'EUR', 'LYD', 'QAR'];

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      {/* Demo Disclaimer Notice */}
      <div className="bg-amber-500/10 dark:bg-amber-500/20 border-b border-amber-500/20 px-4 py-1 text-xs text-amber-800 dark:text-amber-200 text-center font-medium flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{t.app.demoNotice}: {t.app.demoNoticeDesc}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Brand & Opportunity Preset Selector */}
          <div className="flex items-center gap-3">
            <AppSwitcher />
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {t.app.title}
                </h1>
                {/* Active RFP Preset Dropdown */}
                <div className="relative inline-block">
                  <select
                    value={opportunity.id}
                    onChange={(e) => setOpportunityPreset(e.target.value)}
                    className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 cursor-pointer focus:ring-1 focus:ring-blue-500"
                  >
                    {rfpPresets.map(preset => (
                      <option key={preset.id} value={preset.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans font-medium">
                        {preset.rfqNumber} — {preset.title.en.split(' ')[0]} {preset.title.en.split(' ')[1]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {opportunity.title[language]}
              </p>
            </div>
          </div>

          {/* Controls: Scenarios, Currency, Theme, Language, Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Scenario Picker */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <Layers className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenario(sc.id)}
                  className={'btn-press px-2.5 py-1 text-xs font-semibold rounded-lg transition ' + (
                    activeScenario === sc.id
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Coins className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={displayCurrency}
                onChange={(e) => setDisplayCurrency(e.target.value as DisplayCurrency)}
                aria-label="Display Currency"
                className="bg-transparent border-0 text-slate-800 dark:text-slate-200 font-medium focus:ring-0 cursor-pointer text-xs p-0"
              >
                {currencies.map(c => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="btn-press p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'العربية (RTL)' : 'English (LTR)'}</span>
            </button>

            {/* Reset Demo */}
            <button
              onClick={resetDemo}
              title={t.app.resetDemo}
              className="btn-press inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.app.resetDemo}</span>
            </button>

            {/* Competitor Intelligence & PTW Optimizer */}
            <button
              onClick={() => setIsCompetitorModalOpen(true)}
              title="Competitor Intelligence & Price-to-Win (PTW) Monte Carlo Optimizer"
              className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60"
            >
              <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>PTW / Rivals</span>
            </button>

            {/* Reverse Auction & Nash Equilibrium Simulator */}
            <button
              onClick={() => setIsAuctionModalOpen(true)}
              title="Reverse Auction Clock & Bayesian Nash Equilibrium Simulator"
              className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
            >
              <Gavel className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Auction / Nash</span>
            </button>

            {/* Tender Manager & BOM CSV Button */}
            <button
              onClick={() => setIsTenderModalOpen(true)}
              className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Cost / BOM</span>
            </button>

            {/* Executive Dossier Trigger */}
            <button
              onClick={() => setIsDossierOpen(true)}
              title="Board-Ready Executive Proposal Dossier"
              className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Dossier / PDF</span>
            </button>

            {/* Export JSON */}
            <button
              onClick={exportOpportunityJson}
              title={t.app.exportJson}
              className="btn-press inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            {/* Audit Trail Trigger */}
            <button
              onClick={() => setIsAuditModalOpen(true)}
              title="Tamper-Evident SHA-256 Audit Trail"
              className="btn-press inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline">Audit</span>
            </button>

            {/* Auth User Menu */}
            <AuthUserMenu />
          </div>
        </div>
      </div>

      {/* Import JSON Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t.app.importJson}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Paste valid BidPilot JSON opportunity export data to load custom RFP scenarios into browser memory.
            </p>
            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{ "id": "custom-rfp", ... }'
              className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {importError && (
              <p className="text-xs text-rose-600 mt-2">
                Invalid JSON format or missing required opportunity fields.
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportError(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Load Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
      <AuditTrailModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
      <TenderManagerModal isOpen={isTenderModalOpen} onClose={() => setIsTenderModalOpen(false)} />
      <ProposalPrintDossier isOpen={isDossierOpen} onClose={() => setIsDossierOpen(false)} />
      <CompetitorIntelligenceModal isOpen={isCompetitorModalOpen} onClose={() => setIsCompetitorModalOpen(false)} />
      <ReverseAuctionSimulatorModal isOpen={isAuctionModalOpen} onClose={() => setIsAuctionModalOpen(false)} />
    </header>
  );
};
