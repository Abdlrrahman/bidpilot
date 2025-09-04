import React from 'react';
import {
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RfpComparisonView: React.FC = () => {
  const { rfpPresets, setOpportunityPreset, opportunity, formatCurrency } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Multi-RFP Pipeline Comparison & Resource Allocation Matrix</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Side-by-side analytical comparison of institutional tender pursuits across budget sizes, expected value (EV), win probabilities, margin cushions, and deployment geography.
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold font-mono self-start md:self-auto">
            {rfpPresets.length} Active Pursuits in Pipeline
          </span>
        </div>
      </div>

      {/* 3 RFP Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rfpPresets.map((preset) => {
          const isActive = preset.id === opportunity.id;
          const grossRevenue = preset.budgetEstimate * 0.92;
          const grossProfit = grossRevenue * 0.22;
          const ev = (preset.pWin * grossProfit) - preset.pursuitCost;

          return (
            <div
              key={preset.id}
              className={'p-6 rounded-2xl border transition shadow-sm flex flex-col justify-between space-y-5 ' + (
                isActive
                  ? 'bg-blue-50/20 dark:bg-blue-950/20 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              )}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {preset.rfqNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-2">
                      {preset.title.en}
                    </h3>
                  </div>
                  {isActive && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold uppercase">
                      Active
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 line-clamp-1">
                  <strong>Buyer:</strong> {preset.buyer.en}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Budget Estimate</span>
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(preset.budgetEstimate)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Win Probability</span>
                    <span className="text-sm font-mono font-bold text-emerald-600">
                      {(preset.pWin * 100).toFixed(0)}% P(win)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Pursuit Cost</span>
                    <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                      {formatCurrency(preset.pursuitCost)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/40">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 block uppercase font-bold">Expected Net EV</span>
                    <span className="text-sm font-mono font-black text-blue-600 dark:text-blue-400">
                      {formatCurrency(ev)}
                    </span>
                  </div>
                </div>

                {/* Scope & Locations */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Locations:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{preset.city.en}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Requirements:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{preset.requirements.length} Clauses</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Deadline:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{preset.deadline.slice(0, 10)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpportunityPreset(preset.id)}
                className={'btn-press w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ' + (
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                )}
              >
                <span>{isActive ? 'Current Active Workspace' : 'Switch Workspace to this RFP'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
