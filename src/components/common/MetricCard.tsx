import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  highlight?: 'none' | 'success' | 'warning' | 'danger' | 'brand';
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  highlight = 'none',
  tooltip
}) => {
  const highlightStyles = {
    none: 'border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700',
    success: 'border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-300',
    warning: 'border-amber-200/80 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 hover:border-amber-300',
    danger: 'border-rose-200/80 dark:border-rose-800/60 bg-rose-50/40 dark:bg-rose-950/20 hover:border-rose-300',
    brand: 'border-blue-200/80 dark:border-blue-800/60 bg-blue-50/40 dark:bg-blue-950/20 hover:border-blue-300'
  };

  const iconStyles = {
    none: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    success: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300',
    warning: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300',
    danger: 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300',
    brand: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
  };

  return (
    <div
      className={`btn-press relative p-4 rounded-2xl border backdrop-blur-md shadow-xs transition-all duration-200 hover:shadow-md ${highlightStyles[highlight]}`}
      title={tooltip}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl flex-shrink-0 transition-transform duration-200 ${iconStyles[highlight]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-xs">
          <span className={`font-semibold ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
};
