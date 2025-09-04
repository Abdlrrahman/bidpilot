import React, { useState } from 'react';
import {
  Lock,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, DEMO_PERSONAS } from '../../types/auth';

export const AuthLockModal: React.FC = () => {
  const { isLocked, unlockSession, switchRole } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockSession(pin);
    if (!success) {
      setError(true);
    } else {
      setError(false);
      setPin('');
    }
  };

  const handleQuickPersonaUnlock = (role: UserRole) => {
    switchRole(role);
    unlockSession('2026');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        {/* Security Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-200 dark:border-blue-800/60 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Security Clearance & Session Lock
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Procurement Decision Intelligence System is currently locked.
          </p>
        </div>

        {/* PIN Entry Form */}
        <form onSubmit={handleUnlock} className="space-y-3">
          <div className="space-y-1">
            <input
              type="password"
              maxLength={8}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="Enter PIN (e.g. 2026)"
              className="w-full text-center text-lg font-mono tracking-widest py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {error && (
              <p className="text-xs text-rose-600 font-semibold">
                Invalid Security PIN. (Tip: Use 2026 or pick a demo persona below)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-press w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Unlock Session</span>
          </button>
        </form>

        {/* 1-Click Demo Persona Instant Logins */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Or 1-Click Instant Persona Sign-In
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(DEMO_PERSONAS) as UserRole[]).map((role) => {
              const p = DEMO_PERSONAS[role];
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleQuickPersonaUnlock(role)}
                  className="btn-press p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-left rtl:text-right flex items-center gap-2 text-xs"
                >
                  <div className={'w-6 h-6 rounded-md text-[10px] text-white font-bold flex items-center justify-center flex-shrink-0 ' + p.avatarColor}>
                    {p.avatarInitials}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-slate-900 dark:text-white block truncate text-[11px] leading-tight">
                      {p.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 capitalize truncate block">
                      {role}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
