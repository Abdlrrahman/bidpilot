import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Calculator,
  ShieldCheck
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-600" />
          {t.methodology.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.methodology.subtitle}
        </p>
      </div>

      {/* Formulas Breakdown */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-brand-600" />
          {t.methodology.sectionFormulas}
        </h3>

        <div className="space-y-4 text-xs">
          {/* Formula 1 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">
              1. Weighted Compliance Coverage
            </h4>
            <div className="font-mono bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-brand-700 dark:text-brand-300">
              Coverage = ( ∑ [ Weight_i × Multiplier_i ] / ∑ Weight_i ) × 100%
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Where multipliers are strictly defined: <strong>Comply = 1.0</strong>, <strong>Partial = 0.5</strong>, <strong>Gap = 0.0</strong>, <strong>Not Assessed = 0.0</strong>.
            </p>
          </div>

          {/* Formula 2 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">
              2. Expected Bid Value (EV)
            </h4>
            <div className="font-mono bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-brand-700 dark:text-brand-300">
              EV = ( Probability_of_Win × Expected_Gross_Profit ) − Pursuit_Cost
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Provides risk-adjusted financial decision support to ensure pursuit costs do not exceed expected statistical returns.
            </p>
          </div>

          {/* Formula 3 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">
              3. Hard Mandatory Blocker Override
            </h4>
            <div className="font-mono bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-rose-700 dark:text-rose-400 font-bold">
              IF Mandatory_Gaps &gt; 0 OR Gross_Margin &lt; 8.0% THEN Decision = NO_GO
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              In institutional procurement (e.g., UN, World Bank, Municipalities), aggregate weighted compliance cannot compensate for missing a single mandatory requirement. Any mandatory gap immediately forces a disqualification alert.
            </p>
          </div>

          {/* Formula 4 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">
              4. Full Landed Cost Base & Headroom
            </h4>
            <div className="font-mono bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-brand-700 dark:text-brand-300">
              Landed_Cost = Direct_Cost + Freight + Contingency + Overhead
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Price Headroom = Buyer_Budget_Benchmark − Proposed_Revenue.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          {t.methodology.sectionPrivacy}
        </h3>
        <p className="text-xs text-emerald-950 dark:text-emerald-300 leading-relaxed">
          {t.methodology.privacyText}
        </p>
      </div>
    </div>
  );
};
