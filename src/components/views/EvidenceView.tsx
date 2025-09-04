import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Eye,
  ShieldCheck,
  X
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { EvidenceDocument } from '../../types/procurement';

export const EvidenceView: React.FC = () => {
  const { t, opportunity, language } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<EvidenceDocument | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-brand-600" />
          {t.evidence.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.evidence.subtitle}
        </p>
      </div>

      {/* Evidence Document Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left rtl:text-right border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3 px-3 w-28">{t.evidence.colCode}</th>
              <th className="py-3 px-4 min-w-[240px]">{t.evidence.colTitle}</th>
              <th className="py-3 px-3 w-32">{t.evidence.colCategory}</th>
              <th className="py-3 px-3 min-w-[140px]">{t.evidence.colStatus}</th>
              <th className="py-3 px-3 w-28">{t.evidence.colLastUpdated}</th>
              <th className="py-3 px-3 w-28">{t.evidence.colValidUntil}</th>
              <th className="py-3 px-3 text-center w-20">Preview</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {opportunity.evidence.map((doc) => {
              const isVerified = doc.status === 'verified';
              const isDraft = doc.status === 'draft';
              

              return (
                <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {doc.docCode}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {doc.title[language]}
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                      {doc.filename} ({doc.sizeKb} KB)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {doc.category}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={isVerified ? 'success' : isDraft ? 'info' : 'danger'}>
                      {isVerified ? t.evidence.statusVerified : isDraft ? t.evidence.statusDraft : t.evidence.statusMissing}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {doc.lastUpdated}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {doc.validUntil || 'N/A'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      className="btn-press p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-brand-600"
                      title="Preview Document Metadata"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Simulated File Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Verified Metadata Manifest
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p><strong>Title:</strong> {selectedDoc.title[language]}</p>
              <p><strong>File:</strong> <span className="font-mono text-brand-600">{selectedDoc.filename}</span></p>
              <p><strong>Code:</strong> {selectedDoc.docCode}</p>
              <p><strong>Category:</strong> {selectedDoc.category}</p>
              <p><strong>Status:</strong> <span className="text-emerald-600 font-bold uppercase">{selectedDoc.status}</span></p>
              <p><strong>SHA-256 Hash (Simulated):</strong> <span className="font-mono text-[10px] text-slate-500 break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span></p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 leading-relaxed border border-slate-200 dark:border-slate-700">
              {t.evidence.simulatedNotice}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="btn-press px-4 py-2 text-xs font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700"
              >
                {t.requirements.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
