import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  ShieldCheck,
  Layers,
  Activity,
  Truck,
  Coins,
  Lock,
  Sparkles
} from 'lucide-react';

interface AppItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  color: string;
  metric: string;
}

const APPS: AppItem[] = [
  {
    id: 'bidpilot',
    name: 'BidPilot',
    category: 'Commercial Intelligence',
    tagline: 'Commercial Bid Strategy & Price-to-Win Intelligence',
    color: 'bg-blue-600',
    metric: '$485k Target RFP'
  },
  {
    id: 'impact-ledger',
    name: 'ImpactLedger',
    category: 'Outcome Economics',
    tagline: 'Value-for-Money (VfM) & Social ROI Modeling',
    color: 'bg-emerald-600',
    metric: '3.18x SROI'
  },
  {
    id: 'netpulse',
    name: 'NetPulse',
    category: 'Telecom Operations',
    tagline: 'Explainable Telecom NOC Telemetry & RCA Playbooks',
    color: 'bg-sky-600',
    metric: '99.98% SLA'
  },
  {
    id: 'aidroute',
    name: 'AidRoute',
    category: 'Humanitarian Logistics',
    tagline: 'Last-Mile Relief Dispatch & Carbon Accounting',
    color: 'bg-amber-600',
    metric: '5 Live Convoys'
  },
  {
    id: 'cashshield',
    name: 'CashShield',
    category: 'Corporate Finance',
    tagline: 'SME Direct Cash-Flow Stress Lab & Bank Solvency',
    color: 'bg-teal-600',
    metric: '18.4 Wks Runway'
  },
  {
    id: 'ciphervault',
    name: 'CipherVault',
    category: 'Applied Cryptography',
    tagline: 'Zero-Knowledge Crypto & Threat Modeling Lab',
    color: 'bg-indigo-600',
    metric: '256-bit AES-GCM'
  }
];

export const AppSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (id: string) => {
    switch (id) {
      case 'bidpilot': return <ShieldCheck className="w-4 h-4 text-white" />;
      case 'impact-ledger': return <Layers className="w-4 h-4 text-white" />;
      case 'netpulse': return <Activity className="w-4 h-4 text-white" />;
      case 'aidroute': return <Truck className="w-4 h-4 text-white" />;
      case 'cashshield': return <Coins className="w-4 h-4 text-white" />;
      case 'ciphervault': return <Lock className="w-4 h-4 text-white" />;
      default: return <ShieldCheck className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        title="Enterprise Suite Omni-Launcher"
        className="btn-press p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 rtl:right-0 rtl:left-auto mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Executive Platform Suite</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Created by Abdlrrahman Shibani
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              6 Systems
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {APPS.map((app) => {
              const isCurrent = app.id === 'bidpilot';
              return (
                <div
                  key={app.id}
                  className={'p-2.5 rounded-xl border transition flex items-center justify-between ' + (
                    isCurrent
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-sm'
                      : 'border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ' + app.color}>
                      {getIcon(app.id)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {app.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-blue-600 text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {app.tagline}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap pl-2">
                    {app.metric}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
