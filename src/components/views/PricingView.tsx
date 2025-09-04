
import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Sparkles,
  Layers,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PricingScenario, PricingItem } from '../../types/procurement';
import { calculatePricingSummary, calculateExpectedBidValue } from '../../engine/scoring';

export const PricingView: React.FC = () => {
  const {
    t,
    language,
    opportunity,
    activeScenario,
    setActiveScenario,
    pricingSummary,
    updatePricingItem,
    formatCurrency
  } = useApp();

  const currentItems = opportunity.pricingItems[activeScenario] || [];

  // Interactive Sensitivity Optimizer State
  const [targetMarginOverride, setTargetMarginOverride] = useState<number>(25);
  const [freightInflationPct, setFreightInflationPct] = useState<number>(0);
  const [fxBufferPct, setFxBufferPct] = useState<number>(0);

  const conservativeSummary = calculatePricingSummary(opportunity.pricingItems.conservative, opportunity.budgetEstimate, opportunity.taxRate);
  const targetSummary = calculatePricingSummary(opportunity.pricingItems.target, opportunity.budgetEstimate, opportunity.taxRate);
  const competitiveSummary = calculatePricingSummary(opportunity.pricingItems.competitive, opportunity.budgetEstimate, opportunity.taxRate);

  const handleQuantityChange = (item: PricingItem, qty: number) => {
    const validQty = Math.max(1, qty);
    updatePricingItem(activeScenario, item.id, { quantity: validQty });
  };

  const handleUnitCostChange = (item: PricingItem, cost: number) => {
    const validCost = Math.max(0, cost);
    updatePricingItem(activeScenario, item.id, { unitCost: validCost });
  };

  const handleMarkupChange = (item: PricingItem, markupPct: number) => {
    const validMarkup = Math.max(0, markupPct / 100);
    updatePricingItem(activeScenario, item.id, { markupRate: validMarkup });
  };

  // Dynamic sensitivity calculations
  const simulatedCostBase = useMemo(() => {
    const baseDirect = pricingSummary.totalDirectCost;
    const adjustedLogistics = pricingSummary.totalLogistics * (1 + freightInflationPct / 100);
    const fxRiskBuffer = baseDirect * (fxBufferPct / 100);
    const subtotal = baseDirect + adjustedLogistics + fxRiskBuffer;
    const cont = subtotal * 0.05;
    const ovh = (subtotal + cont) * 0.08;
    return subtotal + cont + ovh;
  }, [pricingSummary, freightInflationPct, fxBufferPct]);

  const simulatedRevenue = useMemo(() => {
    return simulatedCostBase / (1 - targetMarginOverride / 100);
  }, [simulatedCostBase, targetMarginOverride]);

  const simulatedGrossMargin = simulatedRevenue - simulatedCostBase;
  const simulatedHeadroom = opportunity.budgetEstimate - simulatedRevenue;
  
  // Price elasticity logistic P_win model
  const simulatedPwin = useMemo(() => {
    const priceRatio = simulatedRevenue / opportunity.budgetEstimate;
    if (priceRatio > 1.0) return Math.max(0.05, 0.40 - (priceRatio - 1.0) * 1.5);
    return Math.min(0.85, 0.40 + (1.0 - priceRatio) * 1.2);
  }, [simulatedRevenue, opportunity.budgetEstimate]);

  const simulatedEv = calculateExpectedBidValue(simulatedPwin, simulatedGrossMargin, opportunity.pursuitCost);

  // Landed Cost Waterfall breakdown percentages
  const directPct = ((pricingSummary.totalDirectCost / (pricingSummary.totalRevenue || 1)) * 100).toFixed(1);
  const logisticsPct = ((pricingSummary.totalLogistics / (pricingSummary.totalRevenue || 1)) * 100).toFixed(1);
  const contingencyPct = ((pricingSummary.totalContingency / (pricingSummary.totalRevenue || 1)) * 100).toFixed(1);
  const overheadPct = ((pricingSummary.totalOverhead / (pricingSummary.totalRevenue || 1)) * 100).toFixed(1);
  const marginPct = pricingSummary.grossMarginPercentage;

  return (
    <div className="space-y-6">
      {/* Header & Scenario Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>{t.pricing.title}</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold uppercase">
              {activeScenario} Scenario
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multi-tier Landed Cost Waterfall: Direct FOB + International Freight + Contingency Reserve + Overhead + Profit Margin.
          </p>
        </div>

        {/* 3 Scenario Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start sm:self-auto">
          {(['conservative', 'target', 'competitive'] as PricingScenario[]).map((sc) => (
            <button
              key={sc}
              onClick={() => setActiveScenario(sc)}
              className={'btn-press px-3 py-1.5 text-xs font-bold rounded-lg transition ' + (
                activeScenario === sc
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {t.pricing[sc]}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Landed Cost Stacked Waterfall Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Landed Cost Composition & Margin Waterfall</span>
          </span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">
            Total Selling Price: {formatCurrency(pricingSummary.totalRevenue)}
          </span>
        </div>

        {/* Multi-segment bar */}
        <div className="w-full h-7 rounded-xl overflow-hidden flex shadow-inner">
          <div
            title={'Direct Cost: ' + formatCurrency(pricingSummary.totalDirectCost) + ' (' + directPct + '%)'}
            style={{ width: directPct + '%' }}
            className="bg-blue-600 text-[10px] text-white flex items-center justify-center font-bold truncate px-1 transition-all"
          >
            FOB {directPct}%
          </div>
          <div
            title={'Logistics & Clearing: ' + formatCurrency(pricingSummary.totalLogistics) + ' (' + logisticsPct + '%)'}
            style={{ width: logisticsPct + '%' }}
            className="bg-sky-500 text-[10px] text-white flex items-center justify-center font-bold truncate px-1 transition-all"
          >
            Log {logisticsPct}%
          </div>
          <div
            title={'Contingency Reserve: ' + formatCurrency(pricingSummary.totalContingency) + ' (' + contingencyPct + '%)'}
            style={{ width: contingencyPct + '%' }}
            className="bg-amber-500 text-[10px] text-white flex items-center justify-center font-bold truncate px-1 transition-all"
          >
            Cont {contingencyPct}%
          </div>
          <div
            title={'Overhead Allocation: ' + formatCurrency(pricingSummary.totalOverhead) + ' (' + overheadPct + '%)'}
            style={{ width: overheadPct + '%' }}
            className="bg-purple-600 text-[10px] text-white flex items-center justify-center font-bold truncate px-1 transition-all"
          >
            Ovh {overheadPct}%
          </div>
          <div
            title={'Gross Margin: ' + formatCurrency(pricingSummary.totalGrossMargin) + ' (' + marginPct + '%)'}
            style={{ width: marginPct + '%' }}
            className="bg-emerald-500 text-[10px] text-white flex items-center justify-center font-bold truncate px-1 transition-all"
          >
            Profit {marginPct}%
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Direct Cost: <strong>{formatCurrency(pricingSummary.totalDirectCost)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sky-500 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Logistics: <strong>{formatCurrency(pricingSummary.totalLogistics)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Contingency: <strong>{formatCurrency(pricingSummary.totalContingency)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-purple-600 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Overhead: <strong>{formatCurrency(pricingSummary.totalOverhead)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Gross Margin: <strong>{formatCurrency(pricingSummary.totalGrossMargin)}</strong></span>
          </div>
        </div>
      </div>

      {/* NEW: Interactive Tender Sensitivity & Price-to-Win Optimizer */}
      <div className="bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Interactive Price-to-Win (P_win) & Sensitivity Simulator</span>
            </h3>
            <span className="text-xs text-slate-500">
              Test how margin targets, freight inflation, and FX cushion shift expected commercial value vs client budget.
            </span>
          </div>
          <button
            onClick={() => {
              setTargetMarginOverride(25);
              setFreightInflationPct(0);
              setFxBufferPct(0);
            }}
            className="btn-press text-xs font-semibold px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Sliders</span>
          </button>
        </div>

        {/* 3 Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Target Margin Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Target Margin:</span>
              <span className="font-mono font-bold text-emerald-600">{targetMarginOverride}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={targetMarginOverride}
              onChange={e => setTargetMarginOverride(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400 block">Baseline target: 25.0%</span>
          </div>

          {/* Freight Inflation Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Freight & Logistics Inflation:</span>
              <span className={'font-mono font-bold ' + (freightInflationPct > 0 ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300')}>
                +{freightInflationPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={freightInflationPct}
              onChange={e => setFreightInflationPct(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <span className="text-[10px] text-slate-400 block">Simulate port congestion surcharge</span>
          </div>

          {/* FX Buffer Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Currency FX Cushion:</span>
              <span className={'font-mono font-bold ' + (fxBufferPct > 0 ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-300')}>
                +{fxBufferPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={fxBufferPct}
              onChange={e => setFxBufferPct(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <span className="text-[10px] text-slate-400 block">Parallel market spread hedge</span>
          </div>
        </div>

        {/* Dynamic Simulation Output KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Simulated Price</span>
            <div className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
              {formatCurrency(simulatedRevenue)}
            </div>
            <span className={'text-[10px] font-semibold block mt-0.5 ' + (simulatedHeadroom >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
              {simulatedHeadroom >= 0 ? '+' : ''}{formatCurrency(simulatedHeadroom)} Headroom
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Gross Margin</span>
            <div className="text-base font-black font-mono text-emerald-600 mt-1">
              {formatCurrency(simulatedGrossMargin)}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {targetMarginOverride}% of revenue
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Win Prob (P_win)</span>
            <div className="text-base font-black font-mono text-indigo-600 mt-1">
              {(simulatedPwin * 100).toFixed(0)}%
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Elasticity curve model
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Expected Value (EV)</span>
            <div className={'text-base font-black font-mono mt-1 ' + (simulatedEv >= 0 ? 'text-blue-600' : 'text-rose-600')}>
              {formatCurrency(simulatedEv)}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              After -$18.5k pursuit cost
            </span>
          </div>
        </div>
      </div>

      {/* 3-Scenario Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { sc: 'conservative' as PricingScenario, data: conservativeSummary, color: 'border-slate-200 dark:border-slate-800' },
          { sc: 'target' as PricingScenario, data: targetSummary, color: 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/10' },
          { sc: 'competitive' as PricingScenario, data: competitiveSummary, color: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10' }
        ].map(({ sc, data, color }) => {
          const ev = calculateExpectedBidValue(opportunity.pWin, data.totalGrossMargin, opportunity.pursuitCost);
          return (
            <div
              key={sc}
              onClick={() => setActiveScenario(sc)}
              className={'btn-press p-5 rounded-2xl border cursor-pointer transition hover:shadow-md ' + color + (
                activeScenario === sc ? ' ring-2 ring-blue-500' : ''
              )}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.pricing[sc]}
                </span>
                {activeScenario === sc && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {formatCurrency(data.totalRevenue)}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Margin:</span>
                  <span className="font-bold text-emerald-600">{data.grossMarginPercentage}% ({formatCurrency(data.totalGrossMargin)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Price Headroom:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(data.priceHeadroom)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Value:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(ev)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Bill of Quantities (BOQ) Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Bill of Quantities (BOQ) Line-Item Economics</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {currentItems.length} Equipment & Service Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left rtl:text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">{t.pricing.colItem}</th>
                <th className="px-4 py-3">{t.pricing.colCategory}</th>
                <th className="px-4 py-3">{t.pricing.colQty}</th>
                <th className="px-4 py-3">Unit FOB ($)</th>
                <th className="px-4 py-3">Logistics/Unit</th>
                <th className="px-4 py-3">Markup (%)</th>
                <th className="px-4 py-3">Unit Selling Price</th>
                <th className="px-4 py-3">{t.pricing.colLineRevenue}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {currentItems.map((item) => {
                const subtotalBase = (item.unitCost + item.logisticsPerUnit) * item.quantity;
                const cont = subtotalBase * item.contingencyRate;
                const ovh = (subtotalBase + cont) * item.overheadRate;
                const totalCostBase = subtotalBase + cont + ovh;
                const totalRevenue = totalCostBase * (1 + item.markupRate) * (1 - item.discountRate);
                const unitSellingPrice = item.quantity > 0 ? (totalRevenue / item.quantity) : 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {item.itemCode}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-xs">
                      {item.description[language]}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Category: {item.category} • Unit: {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 text-xs border rounded bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-mono text-center focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={item.unitCost}
                        onChange={(e) => handleUnitCostChange(item, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-xs border rounded bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                      {'$' + item.logisticsPerUnit}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={(item.markupRate * 100).toFixed(0)}
                        onChange={(e) => handleMarkupChange(item, parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-xs border rounded bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-mono text-center focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {formatCurrency(unitSellingPrice)}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(totalRevenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
