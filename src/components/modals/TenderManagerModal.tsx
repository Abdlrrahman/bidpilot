import React, { useState } from 'react';
import {
  FileSpreadsheet,
  X,
  Trash2,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PricingItem } from '../../types/procurement';

interface TenderManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TenderManagerModal: React.FC<TenderManagerModalProps> = ({ isOpen, onClose }) => {
  const {
    opportunity,
    activeScenario,
    addPricingItem,
    deletePricingItem,
    importPricingCsv,
    addRequirement,
    clearToBlankOpportunity,
    resetDemo,
    formatCurrency
  } = useApp();

  const [activeTab, setActiveTab] = useState<'add_pricing' | 'import_csv' | 'add_req' | 'manage'>('add_pricing');

  // Pricing Item Form
  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState<number>(10);
  const [unitCost, setUnitCost] = useState<number>(1200);
  const [category, setCategory] = useState<string>('Hardware');

  // Requirement Form
  const [reqTitle, setReqTitle] = useState('');
  const [reqCategory, setReqCategory] = useState<string>('technical');

  // CSV Feedback
  const [csvFeedback, setCsvFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddPricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;

    const newItem: PricingItem = {
      id: 'pi_' + Date.now(),
      itemCode: 'BOM-' + Math.floor(100 + Math.random() * 900),
      description: { en: desc, ar: desc },
      category,
      quantity: Number(qty),
      unit: 'units',
      unitCost: Number(unitCost),
      logisticsPerUnit: Number(unitCost) * 0.05,
      contingencyRate: 0.05,
      overheadRate: 0.08,
      markupRate: 0.18,
      discountRate: 0.0
    };

    addPricingItem(activeScenario, newItem);
    setDesc('');
    setActiveTab('manage');
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    addRequirement(reqTitle, reqCategory as any);
    setReqTitle('');
    alert('Requirement added to compliance checklist.');
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        try {
          const count = importPricingCsv(activeScenario, text);
          setCsvFeedback('Successfully imported ' + count + ' Bill-of-Materials line items into ' + activeScenario + ' scenario.');
        } catch {
          setCsvFeedback('Failed to parse CSV format. Expected: Description,Quantity,UnitCost,Category');
        }
      };
      reader.readAsText(file);
    }
  };

  const currentItems = opportunity.pricingItems[activeScenario] || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tender Cost Breakdown & BOM Ingestion
              </h3>
              <p className="text-xs text-slate-500">
                Add line items, upload bill-of-materials CSV, or add compliance requirements.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('add_pricing')}
            className={'flex-1 py-1.5 rounded-xl text-xs font-bold transition ' + (activeTab === 'add_pricing' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}
          >
            + Cost Line Item
          </button>
          <button
            onClick={() => setActiveTab('import_csv')}
            className={'flex-1 py-1.5 rounded-xl text-xs font-bold transition ' + (activeTab === 'import_csv' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}
          >
            Import BOM CSV
          </button>
          <button
            onClick={() => setActiveTab('add_req')}
            className={'flex-1 py-1.5 rounded-xl text-xs font-bold transition ' + (activeTab === 'add_req' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}
          >
            + Requirement
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={'flex-1 py-1.5 rounded-xl text-xs font-bold transition ' + (activeTab === 'manage' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}
          >
            Items ({currentItems.length})
          </button>
        </div>

        {/* 1. Add Pricing Form */}
        {activeTab === 'add_pricing' && (
          <form onSubmit={handleAddPricing} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Item Description:</label>
                <input
                  type="text"
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Enterprise Tier-3 Server Rack"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Hardware">Hardware & Appliances</option>
                  <option value="Software">Software & Cloud Licenses</option>
                  <option value="Labor">Labor & Engineering</option>
                  <option value="Subcontract">Specialist Subcontracting</option>
                  <option value="Logistics">Freight & Deployment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity:</label>
                <input
                  type="number"
                  required
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Direct Unit Cost ($):</label>
                <input
                  type="number"
                  required
                  value={unitCost}
                  onChange={(e) => setUnitCost(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-press w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
            >
              Add Item to {activeScenario.toUpperCase()} Pricing Scenario
            </button>
          </form>
        )}

        {/* 2. CSV Import */}
        {activeTab === 'import_csv' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>Bill of Materials (BOM) CSV Specification</span>
              </span>
              <p className="text-[11px] text-slate-500 font-mono">
                Headers: Description,Quantity,UnitCost,Category<br />
                Example: Cisco Core Catalyst 9600,2,42000,Hardware
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Upload BOM CSV:
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300 cursor-pointer"
              />
            </div>

            {csvFeedback && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{csvFeedback}</span>
              </div>
            )}
          </div>
        )}

        {/* 3. Add Requirement */}
        {activeTab === 'add_req' && (
          <form onSubmit={handleAddRequirement} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Requirement Statement:</label>
              <input
                type="text"
                required
                value={reqTitle}
                onChange={(e) => setReqTitle(e.target.value)}
                placeholder="e.g. Must support 99.999% uptime with dual hot-standby power feeds"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">RFP Section Category:</label>
              <select
                value={reqCategory}
                onChange={(e) => setReqCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="technical">Technical Specification</option>
                <option value="administrative">Administrative & Governance</option>
                <option value="commercial">Commercial & Payment Terms</option>
                <option value="delivery">Delivery & Logistics Timelines</option>
                <option value="warranty">Warranty & Post-Deployment Support</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-press w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
            >
              Add to RFP Compliance Checklist
            </button>
          </form>
        )}

        {/* 4. Manage Items */}
        {activeTab === 'manage' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-slate-500">
                {activeScenario.toUpperCase()} Pricing Items ({currentItems.length})
              </span>
              <div className="flex gap-2">
                <button
                  onClick={clearToBlankOpportunity}
                  className="btn-press px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-[11px] font-bold border border-rose-200 dark:border-rose-800"
                >
                  Clear to Blank Tender
                </button>
                <button
                  onClick={resetDemo}
                  className="btn-press px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold"
                >
                  Restore Demo Tender
                </button>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{item.description.en}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.itemCode} • {item.quantity} {item.unit} @ {formatCurrency(item.unitCost)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">
                      {formatCurrency(item.quantity * item.unitCost)}
                    </span>
                    <button
                      onClick={() => deletePricingItem(activeScenario, item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
