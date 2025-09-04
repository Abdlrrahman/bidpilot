import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';

export const OverviewView: React.FC = () => {
  const {
    t,
    language,
    opportunity,
    complianceMetrics,
    pricingSummary,
    impactMetrics,
    updatePwin,
    formatCurrency
  } = useApp();

  const isBlocked = complianceMetrics.mandatoryGaps > 0;

  const grossProfit = pricingSummary.totalGrossMargin;
  const pursuitCost = opportunity.pursuitCost;
  const sensitivityPoints = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map(p => ({
    pwin: p,
    ev: Math.round(p * grossProfit - pursuitCost)
  }));

  const breakEvenPwin = grossProfit > 0 ? (pursuitCost / grossProfit) : 0;

  return (
    <div className="space-y-6">
      {/* Hero Opportunity Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {opportunity.buyerType[language]}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {opportunity.stage}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {opportunity.title[language]}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{opportunity.city[language]}, {opportunity.country[language]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Buyer: {opportunity.buyer[language]}</span>
              </div>
            </div>
          </div>

          {/* Readiness Gauge */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start lg:self-auto flex-shrink-0">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {t.overview.kpis.readiness}
              </span>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {impactMetrics.readinessScore}%
              </div>
              <span className="text-[11px] text-slate-500">
                {isBlocked ? 'Blocked (Mandatory Gap)' : 'Decision-Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title={t.overview.kpis.compliance}
          value={complianceMetrics.weightedCoverage + '%'}
          subtitle={complianceMetrics.complyCount + '/' + complianceMetrics.totalRequirements + ' Clauses Met'}
          icon={ShieldCheck}
          highlight="brand"
        />

        <MetricCard
          title={t.overview.kpis.mandatoryGaps}
          value={complianceMetrics.mandatoryGaps}
          subtitle={complianceMetrics.mandatoryGaps > 0 ? 'CRITICAL: Blocks Go-Decision' : 'All Mandatory Passed'}
          icon={AlertTriangle}
          highlight={complianceMetrics.mandatoryGaps > 0 ? 'danger' : 'none'}
        />

        <MetricCard
          title={t.overview.kpis.expectedValue}
          value={formatCurrency(impactMetrics.expectedBidValue)}
          subtitle={'At ' + (opportunity.pWin * 100).toFixed(0) + '% Win Probability'}
          icon={TrendingUp}
          highlight="success"
        />

        <MetricCard
          title={t.overview.kpis.grossMargin}
          value={pricingSummary.grossMarginPercentage + '%'}
          subtitle={formatCurrency(pricingSummary.totalGrossMargin) + ' Profit'}
          icon={Percent}
          highlight="brand"
        />

        <MetricCard
          title="Price Headroom"
          value={formatCurrency(pricingSummary.priceHeadroom)}
          subtitle={'Vs ' + formatCurrency(opportunity.budgetEstimate) + ' Budget'}
          icon={DollarSign}
          highlight="warning"
        />

        <MetricCard
          title="Risk Index"
          value={impactMetrics.riskExposureIndex + '/100'}
          subtitle={impactMetrics.riskExposureIndex < 30 ? 'Low Pursuit Risk' : 'Moderate Exposure'}
          icon={Award}
          highlight="none"
        />
      </div>

      {/* Interactive Win Probability (Pwin) Slider & EV Sensitivity Curve */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Expected Bid Value (EV) Sensitivity Curve</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Model Expected Bid Value across win probabilities: EV = (Pwin × Gross Profit) - Pursuit Cost.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400">Current EV:</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(impactMetrics.expectedBidValue)}
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{t.overview.pwinAdjuster} (Estimated Win Probability):</span>
            <span className="font-mono text-blue-600 dark:text-blue-400">
              {(opportunity.pWin * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opportunity.pWin}
            onChange={(e) => updatePwin(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0% (Loss of Pursuit Cost: -{formatCurrency(pursuitCost)})</span>
            <span className="font-semibold text-amber-600">Break-even: {(breakEvenPwin * 100).toFixed(1)}%</span>
            <span>100% (Max EV: {formatCurrency(grossProfit - pursuitCost)})</span>
          </div>
        </div>

        {/* Visual SVG Curve */}
        <div className="space-y-2">
          <div className="h-40 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              {/* Zero line */}
              <line x1="0" y1="90" x2="500" y2="90" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1" />

              {/* Sensitivity line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points={sensitivityPoints.map((pt, i) => {
                  const x = (i / 10) * 500;
                  const y = 90 - ((pt.ev) / (grossProfit || 1)) * 80;
                  return x + ',' + Math.max(10, Math.min(115, y));
                }).join(' ')}
              />

              {/* Active Pwin point */}
              {(() => {
                const curX = opportunity.pWin * 500;
                const curY = 90 - (impactMetrics.expectedBidValue / (grossProfit || 1)) * 80;
                return (
                  <circle
                    cx={curX}
                    cy={Math.max(10, Math.min(115, curY))}
                    r="6"
                    className="fill-emerald-600 stroke-white stroke-2"
                  />
                );
              })()}
            </svg>
          </div>

          {/* Accessible Table Summary for Screen Readers */}
          <div className="sr-only">
            <table>
              <caption>Expected Bid Value Sensitivity Matrix</caption>
              <thead>
                <tr>
                  <th>Win Probability</th>
                  <th>Expected Bid Value (USD)</th>
                </tr>
              </thead>
              <tbody>
                {sensitivityPoints.map((p, idx) => (
                  <tr key={idx}>
                    <td>{(p.pwin * 100)}%</td>
                    <td>{'$' + p.ev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Breakdown Bars */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>{t.overview.categoryBreakdown}</span>
        </h3>

        <div className="space-y-3">
          {Object.entries(complianceMetrics.categoryBreakdown).map(([catKey, data]) => {
            return (
              <div key={catKey} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{catKey.replace(/_/g, ' ')}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{data.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={'h-2 rounded-full transition-all duration-300 ' + (
                      data.percentage >= 85 ? 'bg-emerald-500' : data.percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    )}
                    style={{ width: data.percentage + '%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
