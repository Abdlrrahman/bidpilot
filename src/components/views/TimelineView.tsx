import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertOctagon
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const TimelineView: React.FC = () => {
  const { t, opportunity, language } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-600" />
          {t.timeline.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.timeline.subtitle}
        </p>
      </div>

      {/* Milestones Vertical Sequence */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="relative border-l-2 rtl:border-r-2 rtl:border-l-0 border-slate-200 dark:border-slate-800 ml-4 rtl:mr-4 rtl:ml-0 space-y-8 py-2">
          {opportunity.milestones.map((ms, index) => {
            const isDone = ms.status === 'completed';
            const isProgress = ms.status === 'in_progress';
            
            const isOverdue = ms.status === 'overdue';

            return (
              <div key={ms.id} className="relative pl-6 rtl:pr-6 rtl:pl-0">
                {/* Node Icon Circle */}
                <div
                  className={`absolute -left-[17px] rtl:-right-[17px] rtl:left-auto top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white dark:bg-slate-900 ${
                    isDone
                      ? 'border-emerald-500 text-emerald-600'
                      : isProgress
                      ? 'border-brand-500 text-brand-600 animate-pulse'
                      : isOverdue
                      ? 'border-rose-500 text-rose-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isProgress ? (
                    <Clock className="w-4 h-4" />
                  ) : isOverdue ? (
                    <AlertOctagon className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Milestone Content Box */}
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {ms.title[language]}
                        </h3>
                        {ms.isCritical && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            {t.timeline.criticalBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <strong>{t.timeline.colOwner}:</strong> {ms.owner}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
                        {ms.date}
                      </span>
                      <Badge
                        variant={
                          isDone ? 'success' : isProgress ? 'info' : isOverdue ? 'danger' : 'default'
                        }
                      >
                        {isDone
                          ? t.timeline.statusCompleted
                          : isProgress
                          ? t.timeline.statusInProgress
                          : isOverdue
                          ? t.timeline.statusOverdue
                          : t.timeline.statusUpcoming}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
