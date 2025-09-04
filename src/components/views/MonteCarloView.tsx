import React, { useState, useMemo } from 'react';
import {
  Dice5,
  TrendingUp,
  RefreshCw,
  Sliders,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SimResult {
  iteration: number;
  simulatedPwin: number;
  simulatedGrossProfit: number;
  simulatedEv: number;
  competitorPrice: number;
  ourPrice: number;
  isWin: boolean;
}

export const MonteCarloView: React.FC = () => {
  const { opportunity, pricingSummary, formatCurrency } = useApp();

  // Simulation Parameters
  const [iterationsCount, setIterationsCount] = useState<number>(1000);
  const [competitorAggression, setCompetitorAggression] = useState<number>(0); // -10% to +10%
  const [logisticsVolatility, setLogisticsVolatility] = useState<number>(15); // % std dev
  const [simSeed, setSimSeed] = useState<number>(1);

  // Run Monte Carlo engine
  const simData = useMemo(() => {
    const results: SimResult[] = [];
    const baseDirect = pricingSummary.totalDirectCost;
    const baseLogistics = pricingSummary.totalLogistics;
    const baseRevenue = pricingSummary.totalRevenue;
    const pursuitCost = opportunity.pursuitCost;
    const budget = opportunity.budgetEstimate;

    // Pseudo-random Gaussian using Box-Muller transform
    const gaussian = (mean: number, stdev: number) => {
      const u1 = Math.max(1e-6, Math.random());
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      return mean + z0 * stdev;
    };

    for (let i = 0; i < iterationsCount; i++) {
      // 1. Logistics cost fluctuation
      const logNoise = gaussian(0, logisticsVolatility / 100);
      const actualLogistics = baseLogistics * (1 + logNoise);
      const actualCost = baseDirect + actualLogistics + (baseDirect * 0.05) + (baseDirect * 0.08);

      // 2. Competitor pricing fluctuation
      const compDiscountMean = -0.05 + (competitorAggression / 100);
      const compDiscount = gaussian(compDiscountMean, 0.08);
      const competitorPrice = budget * (1 + compDiscount);

      // 3. Win logic based on price delta & compliance
      const ourPrice = baseRevenue;
      const actualGrossProfit = ourPrice - actualCost;
      
      // Price ratio to competitor
      const priceDelta = (competitorPrice - ourPrice) / budget;
      let pwin = 0.50 + priceDelta * 1.5;
      pwin = Math.max(0.05, Math.min(0.95, pwin));

      const isWin = Math.random() < pwin;
      const ev = (pwin * actualGrossProfit) - pursuitCost;

      results.push({
        iteration: i + 1,
        simulatedPwin: pwin,
        simulatedGrossProfit: actualGrossProfit,
        simulatedEv: ev,
        competitorPrice,
        ourPrice,
        isWin
      });
    }

    return results;
  }, [pricingSummary, opportunity, iterationsCount, competitorAggression, logisticsVolatility, simSeed]);

  // Statistics
  const stats = useMemo(() => {
    const evs = simData.map(d => d.simulatedEv).sort((a, b) => a - b);
    const winCount = simData.filter(d => d.isWin).length;

    const meanEv = evs.reduce((a, b) => a + b, 0) / evs.length;
    const p10 = evs[Math.floor(evs.length * 0.10)];
    const p50 = evs[Math.floor(evs.length * 0.50)];
    const p90 = evs[Math.floor(evs.length * 0.90)];
    const winRate = (winCount / simData.length) * 100;

    // Build 10-bucket histogram
    const minEv = evs[0];
    const maxEv = evs[evs.length - 1];
    const bucketWidth = (maxEv - minEv) / 12 || 1;
    const histogram = Array.from({ length: 12 }, (_, idx) => {
      const start = minEv + idx * bucketWidth;
      const end = start + bucketWidth;
      const count = evs.filter(v => v >= start && (idx === 11 ? v <= end : v < end)).length;
      return {
        label: formatCurrency(start),
        count,
        pct: (count / simData.length) * 100
      };
    });

    return { meanEv, p10, p50, p90, winRate, histogram };
  }, [simData, formatCurrency]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Dice5 className="w-5 h-5 text-indigo-600" />
                <span>Monte Carlo Stochastic Price-to-Win Simulator</span>
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold uppercase font-mono">
                {iterationsCount.toLocaleString()} Trials
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Probabilistic quantitative engine running {iterationsCount.toLocaleString()} stochastic iterations over competitor aggressive pricing distributions, freight rate spikes, and tariff volatility.
            </p>
          </div>

          <button
            onClick={() => setSimSeed(prev => prev + 1)}
            className="btn-press px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Run Simulation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: P10, P50, P90, Win Rate */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">P10 Conservative EV</span>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {formatCurrency(stats.p10)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">90% chance of exceeding</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">P50 Expected Median EV</span>
          <div className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {formatCurrency(stats.p50)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">50th percentile baseline</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">P90 Optimistic EV</span>
          <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(stats.p90)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Top 10% market upside</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Simulated Win Rate</span>
          <div className="text-xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
            {stats.winRate.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Across all randomized trials</span>
        </div>
      </div>

      {/* Simulator Controls & Histogram Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Column */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Stochastic Engine Parameters</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Competitor Price Aggression:</span>
              <span className="font-mono font-bold text-indigo-600">{competitorAggression > 0 ? '+' : ''}{competitorAggression}%</span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="1"
              value={competitorAggression}
              onChange={e => setCompetitorAggression(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <span className="text-[10px] text-slate-400 block">Negative = rivals discounting aggressively</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Logistics & Freight Volatility:</span>
              <span className="font-mono font-bold text-amber-600">±{logisticsVolatility}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={logisticsVolatility}
              onChange={e => setLogisticsVolatility(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <span className="text-[10px] text-slate-400 block">Standard deviation of port & transport variance</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Iteration Sample Size:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{iterationsCount} Trials</span>
            </div>
            <div className="flex gap-2">
              {[500, 1000, 2500].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => setIterationsCount(cnt)}
                  className={'flex-1 py-1.5 rounded-lg text-xs font-bold transition ' + (
                    iterationsCount === cnt
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <span>
              Monte Carlo sampling provides executive confidence intervals for bid committee approval under high market uncertainty.
            </span>
          </div>
        </div>

        {/* Histogram Chart Column */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Expected Net Value (EV) Probability Distribution Histogram</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Frequency distribution of simulated commercial outcomes factoring in win probabilities and pursuit costs.
            </p>
          </div>

          {/* SVG Bar Histogram */}
          <div className="w-full h-56 flex items-end gap-1.5 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            {stats.histogram.map((bucket, idx) => {
              const maxPct = Math.max(...stats.histogram.map(b => b.pct), 1);
              const heightPct = (bucket.pct / maxPct) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                  <div
                    title={bucket.label + ': ' + bucket.pct.toFixed(1) + '% (' + bucket.count + ' trials)'}
                    style={{ height: heightPct + '%' }}
                    className="w-full rounded-t-md bg-indigo-500/80 group-hover:bg-indigo-600 transition-all cursor-pointer relative"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-10 pointer-events-none">
                      {bucket.pct.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono rotate-45 origin-left truncate max-w-[36px]">
                    {bucket.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
            <span>Mean Expected Value: <strong className="text-indigo-600 font-mono">{formatCurrency(stats.meanEv)}</strong></span>
            <span>Confidence Interval: <strong className="text-slate-800 dark:text-slate-200 font-mono">{formatCurrency(stats.p10)} — {formatCurrency(stats.p90)}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
