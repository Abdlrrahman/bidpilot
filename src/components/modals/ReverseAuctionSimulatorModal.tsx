import React, { useState, useMemo } from 'react';
import {
  Gavel,
  Download,
  Copy,
  Check,
  X,
  Play,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { broadcastMeshEvent } from '../../utils/meshBus';

interface ReverseAuctionSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BidderRound {
  bidderName: string;
  type: string;
  bid: number;
  status: 'active' | 'withdrawn' | 'winning';
}

export const ReverseAuctionSimulatorModal: React.FC<ReverseAuctionSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { opportunity, pricingSummary, formatCurrency, currentUser } = useApp();
  const [copied, setCopied] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [bidShadingPercent, setBidShadingPercent] = useState<number>(12); // Shading % below ceiling

  if (!isOpen) return null;

  const baselineCost = pricingSummary.totalCostBase || Math.round(opportunity.budgetEstimate * 0.76);
  const ceilingBudget = opportunity.budgetEstimate;

  // Bayesian Nash Equilibrium optimal bidding calculation
  // For N bidders with symmetric independent private costs U[C_min, C_max]:
  // Optimal bid b*(c) = c + (Ceiling - c) / N
  const numCompetitors = 4;
  const nashOptimalBid = Math.round(baselineCost + (ceilingBudget - baselineCost) / numCompetitors);
  const nashMarginPercent = Math.round(((nashOptimalBid - baselineCost) / nashOptimalBid) * 100);

  // User's configured bid
  const userBid = Math.round(ceilingBudget * (1 - (bidShadingPercent / 100)));
  const userMargin = Math.round(((userBid - baselineCost) / userBid) * 100);

  // Multi-round reverse auction state generator
  const roundsData: BidderRound[][] = useMemo(() => {
    const r1: BidderRound[] = [
      { bidderName: 'Sovereign Consortium (Our Proposal)', type: 'Self', bid: userBid, status: 'active' },
      { bidderName: 'Incumbent Prime Contractor', type: 'Incumbent', bid: Math.round(ceilingBudget * 0.96), status: 'active' },
      { bidderName: 'Aggressive Low-Cost Turkish-Libyan JV', type: 'Aggressive', bid: Math.round(ceilingBudget * 0.91), status: 'active' },
      { bidderName: 'State-Owned Infrastructure Enterprise', type: 'SOE', bid: Math.round(ceilingBudget * 0.98), status: 'active' },
      { bidderName: 'Regional Mediterranean Engineering Tier-1', type: 'Regional', bid: Math.round(ceilingBudget * 0.94), status: 'active' }
    ];

    const r2: BidderRound[] = [
      { bidderName: 'Sovereign Consortium (Our Proposal)', type: 'Self', bid: Math.round(userBid * 0.98), status: 'active' },
      { bidderName: 'Incumbent Prime Contractor', type: 'Incumbent', bid: Math.round(ceilingBudget * 0.93), status: 'active' },
      { bidderName: 'Aggressive Low-Cost Turkish-Libyan JV', type: 'Aggressive', bid: Math.round(ceilingBudget * 0.88), status: 'active' },
      { bidderName: 'State-Owned Infrastructure Enterprise', type: 'SOE', bid: Math.round(ceilingBudget * 0.97), status: 'withdrawn' },
      { bidderName: 'Regional Mediterranean Engineering Tier-1', type: 'Regional', bid: Math.round(ceilingBudget * 0.91), status: 'active' }
    ];

    const r3: BidderRound[] = [
      { bidderName: 'Sovereign Consortium (Our Proposal)', type: 'Self', bid: Math.round(userBid * 0.95), status: 'active' },
      { bidderName: 'Incumbent Prime Contractor', type: 'Incumbent', bid: Math.round(ceilingBudget * 0.89), status: 'active' },
      { bidderName: 'Aggressive Low-Cost Turkish-Libyan JV', type: 'Aggressive', bid: Math.round(ceilingBudget * 0.84), status: 'active' },
      { bidderName: 'State-Owned Infrastructure Enterprise', type: 'SOE', bid: Math.round(ceilingBudget * 0.97), status: 'withdrawn' },
      { bidderName: 'Regional Mediterranean Engineering Tier-1', type: 'Regional', bid: Math.round(ceilingBudget * 0.88), status: 'active' }
    ];

    const r4: BidderRound[] = [
      { bidderName: 'Sovereign Consortium (Our Proposal)', type: 'Self', bid: Math.round(userBid * 0.93), status: 'active' },
      { bidderName: 'Incumbent Prime Contractor', type: 'Incumbent', bid: Math.round(ceilingBudget * 0.87), status: 'withdrawn' },
      { bidderName: 'Aggressive Low-Cost Turkish-Libyan JV', type: 'Aggressive', bid: Math.round(ceilingBudget * 0.81), status: 'active' },
      { bidderName: 'State-Owned Infrastructure Enterprise', type: 'SOE', bid: Math.round(ceilingBudget * 0.97), status: 'withdrawn' },
      { bidderName: 'Regional Mediterranean Engineering Tier-1', type: 'Regional', bid: Math.round(ceilingBudget * 0.85), status: 'active' }
    ];

    const r5: BidderRound[] = [
      { bidderName: 'Sovereign Consortium (Our Proposal)', type: 'Self', bid: Math.round(userBid * 0.91), status: 'active' },
      { bidderName: 'Incumbent Prime Contractor', type: 'Incumbent', bid: Math.round(ceilingBudget * 0.87), status: 'withdrawn' },
      { bidderName: 'Aggressive Low-Cost Turkish-Libyan JV', type: 'Aggressive', bid: Math.round(ceilingBudget * 0.79), status: 'active' },
      { bidderName: 'State-Owned Infrastructure Enterprise', type: 'SOE', bid: Math.round(ceilingBudget * 0.97), status: 'withdrawn' },
      { bidderName: 'Regional Mediterranean Engineering Tier-1', type: 'Regional', bid: Math.round(ceilingBudget * 0.84), status: 'withdrawn' }
    ];

    return [r1, r2, r3, r4, r5];
  }, [ceilingBudget, userBid]);

  const activeRoundBids = roundsData[currentRound - 1] || roundsData[0];
  const activeBiddersSorted = [...activeRoundBids].filter(b => b.status !== 'withdrawn').sort((a, b) => a.bid - b.bid);
  const lowestBid = activeBiddersSorted[0]?.bid || 0;
  const isWinning = activeBiddersSorted[0]?.type === 'Self';

  // Winner's Curse Risk Analysis
  // If winning bid is less than 1.05x baseline cost, margin is critically thin
  const winnersCurseRatio = lowestBid / baselineCost;
  const isWinnersCurseRisk = winnersCurseRatio < 1.08;

  const handleNextRound = () => {
    if (currentRound < 5) {
      setCurrentRound(r => r + 1);
    }
  };

  const handleReset = () => {
    setCurrentRound(1);
  };

  const handleCopy = () => {
    const summary = JSON.stringify({
      tender: opportunity.rfqNumber,
      buyer: opportunity.buyer.en,
      ceilingBudget,
      baselineCost,
      nashEquilibriumRecommendation: {
        optimalBid: nashOptimalBid,
        expectedMarginPercent: `${nashMarginPercent}%`,
        formula: 'b*(c) = c + (Ceiling - c) / N'
      },
      reverseAuctionOutcome: {
        round: currentRound,
        lowestBidRecorded: lowestBid,
        isOurConsortiumWinning: isWinning,
        winnersCurseRatio: winnersCurseRatio.toFixed(2),
        verdict: isWinnersCurseRisk ? 'HIGH WINNER CURSE RISK (PREDATORY)' : 'SUSTAINABLE MARGIN'
      }
    }, null, 2);

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    broadcastMeshEvent({
      appId: 'bidpilot',
      appName: 'BidPilot',
      type: isWinning ? 'nominal' : 'metric',
      message: `Reverse auction round ${currentRound} simulated: Lowest bid $${lowestBid.toLocaleString()} (${isWinning ? 'OUR BID WINNING' : 'RIVAL WINNING'})`,
      metric: `Round ${currentRound}`
    });
  };

  const handleDownload = () => {
    const data = {
      meta: {
        system: 'BidPilot Commercial Procurement Reverse Auction Engine',
        timestamp: new Date().toISOString(),
        auditor: currentUser.name,
        role: currentUser.role
      },
      tender: {
        rfq: opportunity.rfqNumber,
        buyer: opportunity.buyer.en,
        ceilingBudget,
        baselineCost
      },
      nashEquilibriumAnalysis: {
        optimalBid: nashOptimalBid,
        nashMarginPercent,
        userConfiguredBid: userBid,
        userMargin
      },
      allRoundsData: roundsData
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bidpilot-reverse-auction-${opportunity.rfqNumber}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    broadcastMeshEvent({
      appId: 'bidpilot',
      appName: 'BidPilot',
      type: 'nominal',
      message: `Reverse auction procurement simulation dossier exported: ${a.download}`,
      metric: 'Auction Dossier'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Reverse Auction & Bayesian Nash Equilibrium Bid Simulator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-bold">
                  GAME THEORY
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-round reverse auction clock and Winner's Curse protection for RFP {opportunity.rfqNumber}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-press px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Strategy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="btn-press px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Auction</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bayesian Nash Equilibrium Target Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase block">
              Bayesian Nash Optimal Bid
            </span>
            <div className="text-lg font-mono font-black text-indigo-900 dark:text-indigo-200">
              {formatCurrency(nashOptimalBid)}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Margin: ~{nashMarginPercent}% above baseline cost
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
              Configured Opening Bid
            </span>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
              {formatCurrency(userBid)}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Shading: {bidShadingPercent}% below ceiling budget
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
              Winner's Curse Risk Floor
            </span>
            <div className={`text-lg font-mono font-black flex items-center gap-1.5 ${
              isWinnersCurseRisk ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {isWinnersCurseRisk ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              <span>{Math.round(winnersCurseRatio * 100)}% Cost Ratio</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {isWinnersCurseRisk ? 'Warning: Predatory underbid trap' : 'Healthy operating buffer'}
            </span>
          </div>
        </div>

        {/* User Shading Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="flex justify-between items-center font-bold">
            <span className="text-slate-700 dark:text-slate-300">
              Opening Bid Shading Discount: <span className="font-mono text-indigo-600 dark:text-indigo-400">-{bidShadingPercent}%</span>
            </span>
            <span className="font-mono text-slate-500">
              Ceiling: {formatCurrency(ceilingBudget)}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="28"
            step="1"
            value={bidShadingPercent}
            onChange={e => setBidShadingPercent(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Round Progress Bar & Auction Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-2xl bg-slate-950 text-white text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Auction Clock:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(r => (
                <span
                  key={r}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                    currentRound === r
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : currentRound > r
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  R{r}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNextRound}
              disabled={currentRound >= 5}
              className="btn-press px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Next Round ({currentRound}/5)</span>
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bidders Round Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Bidder Consortium</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Round {currentRound} Bid</th>
                <th className="py-2.5 px-3 text-right">Discount vs Ceiling</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
              {activeRoundBids.map((bidder, idx) => {
                const discount = Math.round(((ceilingBudget - bidder.bid) / ceilingBudget) * 100);
                const isCurrentLowest = bidder.bid === lowestBid && bidder.status !== 'withdrawn';
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      bidder.type === 'Self'
                        ? 'bg-blue-50/60 dark:bg-blue-950/20 font-bold'
                        : isCurrentLowest
                        ? 'bg-amber-50/40 dark:bg-amber-950/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans">
                      <div className="flex items-center gap-2">
                        {bidder.type === 'Self' && <Target className="w-3.5 h-3.5 text-blue-600" />}
                        <span className={bidder.type === 'Self' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}>
                          {bidder.bidderName}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{bidder.type}</td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      {formatCurrency(bidder.bid)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      -{discount}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {bidder.status === 'withdrawn' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500">
                          WITHDRAWN
                        </span>
                      ) : isCurrentLowest ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          LOWEST BID
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          ACTIVE
                        </span>
                      )}
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

