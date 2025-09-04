import React, { useState, useRef, useEffect } from 'react';
import {
  Lock,
  LogOut,
  ChevronDown,
  KeyRound,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, DEMO_PERSONAS } from '../../types/auth';

export const AuthUserMenu: React.FC = () => {
  const { currentUser, switchRole, lockSession, logout, login } = useApp();
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

  if (!currentUser) {
    return (
      <button
        onClick={() => login('executive')}
        className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
      >
        <KeyRound className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </button>
    );
  }

  const roleBadgeColors: Record<UserRole, string> = {
    executive: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    analyst: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    auditor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    guest: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="btn-press flex items-center gap-2 p-1 pl-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition"
      >
        <div className="flex flex-col text-left rtl:text-right">
          <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight">
            {currentUser.name}
          </span>
          <span className="text-[10px] text-slate-500 font-mono capitalize">
            {currentUser.role}
          </span>
        </div>

        <div className={'w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center shadow-sm ' + currentUser.avatarColor}>
          {currentUser.avatarInitials}
        </div>

        <ChevronDown className={'w-3 h-3 text-slate-400 transition-transform ' + (isOpen ? 'rotate-180' : '')} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Profile Card */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 mb-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </span>
              <span className={'text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ' + roleBadgeColors[currentUser.role]}>
                {currentUser.role}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono line-clamp-1">
              {currentUser.email}
            </div>
            <div className="text-[10px] text-slate-400 font-medium pt-1">
              {currentUser.clearanceLevel}
            </div>
          </div>

          {/* 1-Click Persona Switcher */}
          <div className="py-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1">
              Switch Demo Persona / Role
            </span>
            <div className="space-y-1">
              {(Object.keys(DEMO_PERSONAS) as UserRole[]).map((role) => {
                const persona = DEMO_PERSONAS[role];
                const isSelected = currentUser.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role);
                      setIsOpen(false);
                    }}
                    className={'w-full text-left rtl:text-right p-2 rounded-xl text-xs flex items-center justify-between transition ' + (
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={'w-5 h-5 rounded-md text-[10px] text-white font-bold flex items-center justify-center ' + persona.avatarColor}>
                        {persona.avatarInitials}
                      </div>
                      <div>
                        <span className="block leading-tight">{persona.name.split(' ')[0]} {persona.name.split(' ')[1]}</span>
                        <span className="text-[9px] text-slate-400 capitalize">{role} clearance</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Lock & Logout Actions */}
          <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => {
                lockSession();
                setIsOpen(false);
              }}
              className="btn-press flex-1 py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Lock Screen</span>
            </button>

            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="btn-press py-1.5 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
