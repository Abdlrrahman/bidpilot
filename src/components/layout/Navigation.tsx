import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  DollarSign,
  Compass,
  Dice5,
  Layers,
  Calendar,
  FileCheck2,
  FileText,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'requirements'
  | 'pricing'
  | 'gonogo'
  | 'montecarlo'
  | 'comparison'
  | 'timeline'
  | 'evidence'
  | 'summary'
  | 'methodology';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { t, complianceMetrics, goNoGoDecision } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: React.ReactNode }[] = [
    {
      id: 'overview',
      label: t.nav.overview,
      icon: LayoutDashboard
    },
    {
      id: 'requirements',
      label: t.nav.requirements,
      icon: CheckSquare,
      badge: (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          complianceMetrics.mandatoryGaps > 0
            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
        }`}>
          {complianceMetrics.weightedCoverage}%
        </span>
      )
    },
    {
      id: 'pricing',
      label: t.nav.pricing,
      icon: DollarSign
    },
    {
      id: 'gonogo',
      label: t.nav.gonogo,
      icon: Compass,
      badge: goNoGoDecision.isBlocked ? (
        <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-rose-600 text-white">
          <AlertCircle className="w-2.5 h-2.5" /> BLOCK
        </span>
      ) : (
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-600 text-white font-mono">
          {goNoGoDecision.compositeScore}
        </span>
      )
    },
    {
      id: 'montecarlo',
      label: 'Monte Carlo',
      icon: Dice5
    },
    {
      id: 'comparison',
      label: 'Multi-RFP Matrix',
      icon: Layers
    },
    {
      id: 'timeline',
      label: t.nav.timeline,
      icon: Calendar
    },
    {
      id: 'evidence',
      label: t.nav.evidence,
      icon: FileCheck2
    },
    {
      id: 'summary',
      label: t.nav.summary,
      icon: FileText
    },
    {
      id: 'methodology',
      label: t.nav.methodology,
      icon: HelpCircle
    }
  ];

  return (
    <nav className="bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-[73px] z-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-1.5 overflow-x-auto py-2.5 scrollbar-none rtl:space-x-reverse">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`btn-press whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm ring-1 ring-blue-700/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
