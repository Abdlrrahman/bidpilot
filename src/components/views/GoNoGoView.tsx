
import React, { useState, useMemo } from 'react';
import {
  Compass,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Sparkles,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GoNoGoView: React.FC = () => {
  const {
    t,
    language,
    goNoGoDecision
  } = useApp();

  // Interactive Overrides State for the 6 Dimensions
  const [customScores, setCustomScores] = useState<Record<string, number>>({});

  const dimensions = useMemo(() => {
    return goNoGoDecision.dimensions.map(d => ({
      ...d,
      score: customScores[d.id] !== undefined ? customScores[d.id] : d.score
    }));
  }, [goNoGoDecision.dimensions, customScores]);

  // Recalculate composite score dynamically
  const simulatedCompositeScore = useMemo(() => {
    const totalWeighted = dimensions.reduce((sum, d) => sum + (d.score * d.weight), 0);
    return Number(totalWeighted.toFixed(1));
  }, [dimensions]);

  const simulatedRecommendation = useMemo(() => {
    if (goNoGoDecision.isBlocked) return 'NO_GO';
    if (simulatedCompositeScore >= 80) return 'GO';
    if (simulatedCompositeScore >= 65) return 'CONDITIONAL_GO';
    return 'NO_GO';
  }, [simulatedCompositeScore, goNoGoDecision.isBlocked]);

  const isBlocked = goNoGoDecision.isBlocked;
  const isGo = simulatedRecommendation === 'GO';

  const center = 150;
  const maxRadius = 100;

  const radarPoints = dimensions.map((d, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const r = (d.score / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, score: d.score, label: d.title[language] };
  });

  const benchmarkPoints = dimensions.map((_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const r = 0.80 * maxRadius; // 80% passing threshold
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return x + ',' + y;
  }).join(' ');

  const polygonPointsStr = radarPoints.map(p => p.x + ',' + p.y).join(' ');

  const handleScoreChange = (id: string, val: number) => {
    setCustomScores(prev => ({ ...prev, [id]: val }));
  };

  const handleResetScores = () => {
    setCustomScores({});
  };

  return (
    <div className="space-y-6">
      {/* Master Decision Gate Banner */}
      <div className={'border-2 rounded-2xl p-6 sm:p-8 shadow-sm transition-all ' + (
        isGo && !isBlocked
          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500'
          : isBlocked || simulatedRecommendation === 'NO_GO'
          ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-500'
          : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-500'
      )}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Compass className={'w-6 h-6 ' + (
                isGo && !isBlocked ? 'text-emerald-600' : isBlocked || simulatedRecommendation === 'NO_GO' ? 'text-rose-600' : 'text-amber-600'
              )} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.gonogo.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {simulatedRecommendation === 'GO' ? t.gonogo.goBadge : simulatedRecommendation === 'CONDITIONAL_GO' ? t.gonogo.conditionalGoBadge : t.gonogo.noGoBadge}
              </h2>
              {isGo && !isBlocked && <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
              {(isBlocked || simulatedRecommendation === 'NO_GO') && <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {goNoGoDecision.rationale[language]}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex-shrink-0 text-center min-w-[160px]">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {t.gonogo.compositeScore}
            </span>
            <div className={'text-4xl font-black my-1 ' + (
              simulatedCompositeScore >= 80 ? 'text-emerald-600' : simulatedCompositeScore >= 65 ? 'text-amber-600' : 'text-rose-600'
            )}>
              {simulatedCompositeScore}
              <span className="text-lg font-normal text-slate-400">/100</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500">
              Threshold: 80.0
            </span>
          </div>
        </div>

        {/* High-Severity Blocker Warning */}
        {isBlocked && (
          <div className="mt-6 p-4 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                {t.gonogo.blockerAlert}
              </h3>
              <ul className="list-disc list-inside text-xs text-rose-800 dark:text-rose-300 space-y-0.5">
                {goNoGoDecision.blockerReasons[language].map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 6-Dimension Spider / Radar Visualization & Interactive What-If Scorecards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Multi-Criteria Decision Radar</span>
              </h3>
              {Object.keys(customScores).length > 0 && (
                <button
                  onClick={handleResetScores}
                  className="btn-press text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Overrides</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Visual polygon comparing active scores against the 80% passing boundary. Adjust sliders to simulate mitigation.
            </p>
          </div>

          <div className="flex items-center justify-center p-2 relative">
            <svg className="w-64 h-64 overflow-visible" viewBox="0 0 300 300">
              {/* Concentric grid circles */}
              {[0.25, 0.5, 0.75, 1.0].map((frac, i) => (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={frac * maxRadius}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
              ))}

              {/* Axis lines */}
              {dimensions.map((_, i) => {
                const angle = (i * 60 - 90) * (Math.PI / 180);
                const x = center + maxRadius * Math.cos(angle);
                const y = center + maxRadius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                );
              })}

              {/* 80% Benchmark Polygon */}
              <polygon
                points={benchmarkPoints}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Actual Score Polygon */}
              <polygon
                points={polygonPointsStr}
                fill={isBlocked || simulatedRecommendation === 'NO_GO' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(59, 130, 246, 0.25)'}
                stroke={isBlocked || simulatedRecommendation === 'NO_GO' ? '#f43f5e' : '#2563eb'}
                strokeWidth="2.5"
                className="transition-all duration-300"
              />

              {/* Radar Nodes */}
              {radarPoints.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className={isBlocked || simulatedRecommendation === 'NO_GO' ? 'fill-rose-600 stroke-white stroke-2' : 'fill-blue-600 stroke-white stroke-2'}
                />
              ))}
            </svg>
          </div>

          <div className="flex justify-center gap-4 text-[11px] pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-3 h-0.5 bg-slate-400 border-dashed" /> 80% Threshold
            </span>
            <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
              <span className="w-3 h-3 rounded-full bg-blue-600" /> Active Radar
            </span>
          </div>
        </div>

        {/* 6 Dimension Scorecards Column with Interactive Sliders */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>What-If Dimension Scorecard Controls</span>
            </span>
            <span className="text-[11px] text-slate-400">Drag to test scenario</span>
          </div>

          {dimensions.map((dim) => {
            const isPassing = dim.score >= 80;
            return (
              <div
                key={dim.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2 transition hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {dim.title[language]}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {dim.explanation[language]}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={'text-sm font-black ' + (isPassing ? 'text-emerald-600' : 'text-amber-600')}>
                      {dim.score}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                    <span className="block text-[10px] text-slate-400">
                      Weight: {(dim.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="1"
                    value={dim.score}
                    onChange={(e) => handleScoreChange(dim.id, Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                    {dim.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
