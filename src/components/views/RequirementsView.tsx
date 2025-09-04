import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplianceState } from '../../types/procurement';
import {
  Search,
  Download,
  MessageSquare,
  FileText
} from 'lucide-react';
import { CATEGORIES } from '../../engine/scoring';

export const RequirementsView: React.FC = () => {
  const {
    t,
    opportunity,
    language,
    updateRequirementState,
    updateRequirementNotes,
    exportComplianceCsv
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [mandatoryOnly, setMandatoryOnly] = useState(false);
  const [activeNotesReqId, setActiveNotesReqId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const filteredRequirements = useMemo(() => {
    return opportunity.requirements.filter((req) => {
      const searchLower = search.toLowerCase();
      const matchSearch =
        !search ||
        req.ref.toLowerCase().includes(searchLower) ||
        req.section.toLowerCase().includes(searchLower) ||
        (req.title[language] || '').toLowerCase().includes(searchLower) ||
        (req.description[language] || '').toLowerCase().includes(searchLower) ||
        req.owner.toLowerCase().includes(searchLower);

      const matchCategory = selectedCategory === 'all' || req.category === selectedCategory;
      const matchState = selectedState === 'all' || req.state === selectedState;
      const matchMandatory = !mandatoryOnly || req.isMandatory;

      return matchSearch && matchCategory && matchState && matchMandatory;
    });
  }, [opportunity.requirements, search, selectedCategory, selectedState, mandatoryOnly, language]);

  const openNotesModal = (reqId: string, currentNotes?: string) => {
    setActiveNotesReqId(reqId);
    setTempNotes(currentNotes || '');
  };

  const saveNotes = () => {
    if (activeNotesReqId) {
      updateRequirementNotes(activeNotesReqId, tempNotes);
      setActiveNotesReqId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.requirements.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.requirements.showingItems
                .replace('{count}', filteredRequirements.length.toString())
                .replace('{total}', opportunity.requirements.length.toString())}
            </p>
          </div>

          <button
            type="button"
            onClick={exportComplianceCsv}
            className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 w-fit"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.app.exportCsv}</span>
          </button>
        </div>

        {/* Search & Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              placeholder={t.requirements.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">{t.requirements.allCategories}</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">{t.requirements.allStates}</option>
              <option value="comply">{t.requirements.stateComply}</option>
              <option value="partial">{t.requirements.statePartial}</option>
              <option value="gap">{t.requirements.stateGap}</option>
              <option value="not_assessed">{t.requirements.stateNotAssessed}</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              checked={mandatoryOnly}
              onChange={(e) => setMandatoryOnly(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
            />
            <span>{t.requirements.mandatoryOnly}</span>
          </label>
        </div>
      </div>

      {/* Compliance Matrix Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left rtl:text-right border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3 px-3 w-28">{t.requirements.colRef}</th>
              <th className="py-3 px-4 min-w-[280px]">{t.requirements.colTitle}</th>
              <th className="py-3 px-3 w-24">{t.requirements.colCategory}</th>
              <th className="py-3 px-2 text-center w-16">{t.requirements.colWeight}</th>
              <th className="py-3 px-3 min-w-[170px]">{t.requirements.colState}</th>
              <th className="py-3 px-4 min-w-[260px]">{t.requirements.colResponse}</th>
              <th className="py-3 px-3 w-28">{t.requirements.colOwner}</th>
              <th className="py-3 px-3 text-center w-20">{t.requirements.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRequirements.map((req) => {
              const isGap = req.state === 'gap';
              const isPartial = req.state === 'partial';
              const isComply = req.state === 'comply';

              return (
                <tr
                  key={req.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition ${
                    req.isMandatory && isGap ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-3 align-top">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {req.ref}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1" title={req.section}>
                      {req.section}
                    </div>
                    {req.isMandatory ? (
                      <span className="mt-1 inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {t.requirements.mandatoryBadge}
                      </span>
                    ) : (
                      <span className="mt-1 inline-block text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {t.requirements.optionalBadge}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 align-top">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {req.title[language]}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      {req.description[language]}
                    </div>
                  </td>

                  <td className="py-3 px-3 align-top">
                    <span className="capitalize text-slate-600 dark:text-slate-300 font-medium">
                      {req.category}
                    </span>
                  </td>

                  <td className="py-3 px-2 align-top text-center">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {req.weight}x
                    </span>
                  </td>

                  <td className="py-3 px-3 align-top">
                    <select
                      value={req.state}
                      onChange={(e) => updateRequirementState(req.id, e.target.value as ComplianceState)}
                      className={`w-full text-xs font-semibold py-1 px-2 rounded-lg border transition ${
                        isComply
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : isPartial
                          ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                          : isGap
                          ? 'bg-rose-50 text-rose-800 border-rose-400 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700 font-bold'
                          : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <option value="comply">Comply (100%)</option>
                      <option value="partial">Partial (50%)</option>
                      <option value="gap">Gap (0%)</option>
                      <option value="not_assessed">Not Assessed</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 align-top">
                    <div className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      "{req.proposedResponse[language]}"
                    </div>
                  </td>

                  <td className="py-3 px-3 align-top">
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                      {req.owner}
                    </span>
                  </td>

                  <td className="py-3 px-3 align-top text-center">
                    <button
                      type="button"
                      onClick={() => openNotesModal(req.id, req.reviewerNotes)}
                      className={`btn-press p-1.5 rounded-lg border text-xs ${
                        req.reviewerNotes
                          ? 'bg-brand-50 text-brand-700 border-brand-300 dark:bg-brand-950 dark:text-brand-300 dark:border-brand-800'
                          : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-700'
                      }`}
                      title="Add/View Reviewer Notes"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Reviewer Notes Modal */}
      {activeNotesReqId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              {t.requirements.notesModalTitle}
            </h3>
            <textarea
              rows={4}
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              placeholder="Enter auditor findings, OEM quote references, or compliance justifications..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveNotesReqId(null)}
                className="btn-press px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                {t.requirements.close}
              </button>
              <button
                type="button"
                onClick={saveNotes}
                className="btn-press px-4 py-2 text-xs font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700"
              >
                {t.requirements.saveNotes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
