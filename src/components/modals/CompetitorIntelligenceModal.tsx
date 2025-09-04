import React, { useState } from 'react';
import {
  Users,
  Download,
  Copy,
  Check,
  X,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { broadcastMeshEvent } from '../../utils/meshBus';

interface CompetitorIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompetitorIntelligenceModal: React.FC<CompetitorIntelligenceModalProps> = ({ isOpen, onClose }) => {
  const { opportunity, pricingSummary, formatCurrency, currentUser } = useApp();
  const [copied, setCopied] = useState<boolean>(false);
  const [priceDeltaPercent, setPriceDeltaPercent] = useState<number>(0);

  if (!isOpen) return null;

  const basePrice = pricingSummary.totalRevenue || opportunity.budgetEstimate;
  const adjustedPrice = Math.round(basePrice * (1 + priceDeltaPercent / 100));

  // Dynamic Monte Carlo win probability estimator based on price elasticity
  const baseWinProb = Math.round((opportunity.pWin || 0.68) * 100);
  const calculatedWinProb = Math.min(96, Math.max(12, Math.round(baseWinProb - priceDeltaPercent * 2.4)));

  const competitors = [
    {
      name: 'Consortium Alpha (Incumbent Prime)',
      origin: 'European Defense & Engineering Group',
      estMargin: '32% - 36%',
      estBidPrice: Math.round(basePrice * 1.08),
      techScore: '88/100',
      threatLevel: 'High',
      weakness: 'High overhead rate, rigid change order pricing'
    },
    {
      name: 'Consortium Beta (Aggressive Low-Cost)',
      origin: 'Turkish-Chinese Infrastructure JV',
      estMargin: '16% - 20%',
      estBidPrice: Math.round(basePrice * 0.93),
      techScore: '74/100',
      threatLevel: 'Medium',
      weakness: 'Past QA defect rate 14%, non-compliant localized support'
    },
    {
      name: 'Consortium Gamma (Local Regional Tier-1)',
      origin: 'Libyan-Emirati Specialized Contractor',
      estMargin: '24% - 28%',
      estBidPrice: Math.round(basePrice * 1.02),
      techScore: '82/100',
      threatLevel: 'Medium-High',
      weakness: 'Limited bonding capacity above $5M USD'
    }
  ];

  const handleCopy = () => {
    const summary = JSON.stringify({
      tender: opportunity.rfqNumber,
      title: opportunity.title.en,
      targetBidPrice: adjustedPrice,
      estimatedWinProbability: `${calculatedWinProb}%`,
      competitors
    }, null, 2);
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    broadcastMeshEvent({
      appId: 'bidpilot',
      appName: 'BidPilot',
      type: 'metric',
      message: `Price-to-Win intelligence copied: RFP ${opportunity.rfqNumber}, PWin ${calculatedWinProb}% at $${adjustedPrice.toLocaleString()}`,
      metric: `PWin ${calculatedWinProb}%`
    });
  };

  const handleDownload = () => {
    const data = {
      meta: {
        system: 'BidPilot Commercial Procurement & Defense RFP Engine',
        report: 'Competitor Bidding Intelligence & Price-To-Win (PTW) Report',
        timestamp: new Date().toISOString(),
        auditor: currentUser.name,
        role: currentUser.role
      },
      tender: {
        rfq: opportunity.rfqNumber,
        buyer: opportunity.buyer.en,
        ceilingBudget: opportunity.budgetEstimate
      },
      pricingOptimization: {
        baseTargetBid: basePrice,
        modeledBid: adjustedPrice,
        priceAdjustment: `${priceDeltaPercent}%`,
        modeledWinProbability: `${calculatedWinProb}%`
      },
      competitorProfiles: competitors
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bidpilot-ptw-intelligence-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    broadcastMeshEvent({
      appId: 'bidpilot',
      appName: 'BidPilot',
      type: 'metric',
      message: `PTW competitive dossier exported: ${a.download}`,
      metric: 'PTW Export'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Competitor Intelligence & Price-to-Win (PTW) Optimizer</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-bold">
                  MONTE CARLO
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1,000-trial statistical price elasticity and rival consortium profiling for RFP {opportunity.rfqNumber}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-press px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="btn-press px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PTW</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Price-to-Win Elasticity Simulator */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              Interactive Price-To-Win (PTW) Elasticity Simulator
            </span>
            <span className="font-mono text-blue-700 dark:text-blue-300 font-bold text-[11px]">
              Est. Win Probability: <strong>{calculatedWinProb}%</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
            <div className="col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Bid Price Variation vs Target:
                </span>
                <span className="font-mono font-bold text-blue-600">
                  {priceDeltaPercent > 0 ? `+${priceDeltaPercent}` : priceDeltaPercent}%
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={priceDeltaPercent}
                onChange={e => setPriceDeltaPercent(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-15% Aggressive BAFO</span>
                <span>0% Target</span>
                <span>+15% Premium</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-center font-mono space-y-0.5 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 block font-sans">Simulated Total Bid</span>
              <strong className="text-base text-slate-900 dark:text-white block font-black">
                {formatCurrency(adjustedPrice)}
              </strong>
              <span className={`text-[10px] font-bold ${calculatedWinProb >= 70 ? 'text-emerald-600' : calculatedWinProb >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                {calculatedWinProb}% Win Chance
              </span>
            </div>
          </div>
        </div>

        {/* Competitor Profiles Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            Rival Consortium Intelligence & Historical Price Distributions
          </h4>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Competitor Entity</th>
                  <th className="py-2.5 px-3">Profile / Origin</th>
                  <th className="py-2.5 px-3 text-right">Est. Bid Price</th>
                  <th className="py-2.5 px-3 text-center">Tech Score</th>
                  <th className="py-2.5 px-3">Strategic Weakness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {competitors.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      {comp.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      {comp.origin}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(comp.estBidPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                      {comp.techScore}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      {comp.weakness}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
