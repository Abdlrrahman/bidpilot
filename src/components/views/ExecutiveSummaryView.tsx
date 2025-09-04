import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Printer,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const ExecutiveSummaryView: React.FC = () => {
  const {
    t,
    opportunity,
    language,
    complianceMetrics,
    pricingSummary,
    impactMetrics,
    goNoGoDecision
  } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            {t.summary.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.summary.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-press inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>{t.app.printReport}</span>
        </button>
      </div>

      {/* Print-Ready Container Card */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-6 print-card">
        {/* Document Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                BIDPILOT EXECUTIVE BRIEF
              </span>
              <span className="font-mono text-xs text-slate-500">
                REF: {opportunity.rfqNumber}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              {opportunity.title[language]}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Procuring Entity: <strong>{opportunity.buyer[language]}</strong> | Deployment: <strong>{opportunity.city[language]}</strong>
            </p>
          </div>

          <div className="text-right shrink-0">
            <Badge variant={goNoGoDecision.isBlocked ? 'danger' : 'success'} size="md">
              {goNoGoDecision.recommendation} (Score: {goNoGoDecision.compositeScore}/100)
            </Badge>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Date: 24 August 2026
            </p>
          </div>
        </div>

        {/* 4-Box Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Weighted Compliance</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {complianceMetrics.weightedCoverage}%
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">{complianceMetrics.mandatoryGaps} mandatory gaps</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Proposed Revenue</p>
            <p className="text-xl font-extrabold text-brand-600 font-mono mt-1">
              \${pricingSummary.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-600 mt-0.5">+\${pricingSummary.priceHeadroom.toLocaleString()} Headroom</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Projected Gross Margin</p>
            <p className="text-xl font-extrabold text-emerald-600 font-mono mt-1">
              {pricingSummary.grossMarginPercentage}%
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">\${pricingSummary.totalGrossMargin.toLocaleString()} GP</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Expected Bid Value (EV)</p>
            <p className="text-xl font-extrabold text-brand-700 font-mono mt-1">
              \${impactMetrics.expectedBidValue.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Pwin: {(opportunity.pWin * 100).toFixed(0)}%</p>
          </div>
        </div>

        {/* Modeled Workflow Impact (Illustrative) */}
        <div className="p-4 rounded-xl border border-brand-200 dark:border-brand-900/50 bg-brand-50/30 dark:bg-brand-950/20 space-y-2">
          <h3 className="text-xs font-bold text-brand-900 dark:text-brand-200 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-600" />
            {t.summary.modeledImpact}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-brand-100 dark:border-brand-900/50">
              <strong className="block text-slate-900 dark:text-white">{t.summary.modeledBaseline}</strong>
              <span className="text-[11px] text-slate-500">Manual spreadsheet tracking</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-brand-100 dark:border-brand-900/50">
              <strong className="block text-emerald-600 dark:text-emerald-400">{t.summary.modeledAssisted}</strong>
              <span className="text-[11px] text-slate-500">Structured control tower flow</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-brand-100 dark:border-brand-900/50">
              <strong className="block text-brand-600 dark:text-brand-400">{t.summary.modeledMissedGaps}</strong>
              <span className="text-[11px] text-slate-500">Zero mandatory gaps missed</span>
            </div>
          </div>
        </div>

        {/* Executive Decision Rationale */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t.summary.sectionDecision}
          </h3>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed">
            {goNoGoDecision.rationale[language]}
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t.summary.nextBestActions}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
            <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Finalize OEM vendor quotes and lock 90-day validity commitment.</span>
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Issue 2% unconditional tender bank guarantee (Bid Bond) via partner bank.</span>
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Run automated verification scan to verify Envelope A has zero commercial pricing mentions.</span>
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Package AES-256 encrypted submission dossiers and generate SHA-256 verification hash receipts.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
