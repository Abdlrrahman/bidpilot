import React from 'react';
import { Printer, X, ShieldCheck, FileText, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ProposalPrintDossierProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalPrintDossier: React.FC<ProposalPrintDossierProps> = ({ isOpen, onClose }) => {
  const {
    opportunity,
    activeScenario,
    complianceMetrics,
    pricingSummary,
    impactMetrics,
    goNoGoDecision,
    formatCurrency,
    currentUser
  } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const data = {
      meta: {
        system: 'BidPilot Executive Proposal Dossier',
        timestamp: new Date().toISOString(),
        author: currentUser.name,
        role: currentUser.role
      },
      tender: {
        rfqNumber: opportunity.rfqNumber,
        title: opportunity.title.en,
        buyer: opportunity.buyer.en,
        deadline: opportunity.deadline,
        ceilingBudget: opportunity.budgetEstimate
      },
      decision: goNoGoDecision,
      compliance: complianceMetrics,
      pricing: pricingSummary,
      modeledImpact: impactMetrics
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BIDPILOT_DOSSIER_' + opportunity.rfqNumber + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const items = opportunity.pricingItems[activeScenario] || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
        {/* Action Controls (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Board-Ready Commercial Tender Dossier
              </h3>
              <p className="text-xs text-slate-500">
                Official executive briefing memo formatted for institutional review and PDF export.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-press px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="btn-press px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Signed JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:border-0 print:p-0">
          {/* Institutional Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-blue-700">
                INSTITUTIONAL TENDER SUBMISSION MEMO • RESTRICTED COMMERCIAL
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {opportunity.title.en}
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Client / Buyer: <strong>{opportunity.buyer.en}</strong> | RFP Ref: <strong>{opportunity.rfqNumber}</strong> | Deadline: <strong>{opportunity.deadline}</strong>
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white rounded font-mono text-xs font-bold">
                {goNoGoDecision.recommendation.toUpperCase()} RECOMMENDATION
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Generated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Section 1: Executive KPI Matrix */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Ceiling Budget</span>
              <span className="text-base font-black font-mono text-slate-900">{formatCurrency(opportunity.budgetEstimate)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Proposed Price ({activeScenario})</span>
              <span className="text-base font-black font-mono text-blue-700">{formatCurrency(pricingSummary.totalRevenue)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Gross Margin</span>
              <span className="text-base font-black font-mono text-emerald-700">{pricingSummary.grossMarginPercentage}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Assessed Win Prob (PWin)</span>
              <span className="text-base font-black font-mono text-indigo-700">{Math.round(opportunity.pWin * 100)}%</span>
            </div>
          </div>

          {/* Section 2: Go/No-Go Decision Rationale */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1.5">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Investment Committee Deliberation & Strategy</span>
            </span>
            <p className="text-xs text-blue-950 leading-relaxed">
              {goNoGoDecision.rationale.en}
            </p>
          </div>

          {/* Section 3: Compliance Assessment */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-700 border-b border-slate-200 pb-1">
              RFP Compliance & Technical Eligibility Schedule
            </h4>
            <div className="flex items-center justify-between text-xs font-mono py-1">
              <span>Overall Compliance Score: <strong>{complianceMetrics.weightedCoverage}%</strong></span>
              <span>Fully Compliant Items: <strong>{complianceMetrics.complyCount} / {complianceMetrics.totalRequirements}</strong></span>
              <span>Identified Gaps: <strong>{complianceMetrics.gapCount}</strong></span>
            </div>
          </div>

          {/* Section 4: Bill of Materials & Cost Base */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-700 border-b border-slate-200 pb-1">
              Cost Base & Bill of Materials ({items.length} Line Items)
            </h4>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-mono text-[10px]">
                  <th className="py-1.5">CODE</th>
                  <th className="py-1.5">DESCRIPTION</th>
                  <th className="py-1.5">QTY</th>
                  <th className="py-1.5">UNIT COST</th>
                  <th className="py-1.5 text-right">TOTAL DIRECT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {items.slice(0, 8).map(item => (
                  <tr key={item.id}>
                    <td className="py-1 text-slate-500">{item.itemCode}</td>
                    <td className="py-1 font-medium font-sans text-slate-800">{item.description.en}</td>
                    <td className="py-1">{item.quantity}</td>
                    <td className="py-1">{formatCurrency(item.unitCost)}</td>
                    <td className="py-1 text-right font-bold">{formatCurrency(item.quantity * item.unitCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures & Certification Block */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Commercial Bid Director</span>
              <p className="font-bold text-slate-900 mt-1">Abdlrrahman Shibani</p>
              <p className="text-[10px] text-slate-500">Level 4 Sovereign Stack Architect</p>
              <div className="h-0.5 bg-slate-300 w-48 mt-4" />
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Reviewing Authority</span>
              <p className="font-bold text-slate-900 mt-1">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500">{currentUser.organization} • {currentUser.role}</p>
              <div className="h-0.5 bg-slate-300 w-48 mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
