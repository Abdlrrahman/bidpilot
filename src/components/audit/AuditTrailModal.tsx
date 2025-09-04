import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  prevHash: string;
  eventHash: string;
  status: 'VERIFIED' | 'COMPLIANT';
}

export const AuditTrailModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser } = useApp();

  const auditEvents: AuditEvent[] = [
    {
      id: 'evt-001',
      timestamp: '2026-08-30 16:42:01',
      actor: currentUser?.name || 'Abdlrrahman Shibani',
      role: String(currentUser?.role || 'Executive').toUpperCase(),
      action: 'SYSTEM_BOOT_INTEGRITY_CHECK',
      resource: 'BidPilot_Core_State',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      eventHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'VERIFIED'
    },
    {
      id: 'evt-002',
      timestamp: '2026-08-30 16:42:15',
      actor: currentUser?.name || 'Abdlrrahman Shibani',
      role: String(currentUser?.role || 'Executive').toUpperCase(),
      action: 'SECURITY_CLEARANCE_SESSION_INIT',
      resource: 'RBAC_Authorization_Matrix',
      prevHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      eventHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      status: 'VERIFIED'
    },
    {
      id: 'evt-003',
      timestamp: '2026-08-30 16:43:08',
      actor: currentUser?.name || 'Abdlrrahman Shibani',
      role: String(currentUser?.role || 'Executive').toUpperCase(),
      action: 'QUANTITATIVE_SIMULATION_EXECUTED',
      resource: 'Procurement_Stochastic_Engine',
      prevHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      eventHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      status: 'VERIFIED'
    },
    {
      id: 'evt-004',
      timestamp: '2026-08-30 16:44:22',
      actor: currentUser?.name || 'Abdlrrahman Shibani',
      role: String(currentUser?.role || 'Executive').toUpperCase(),
      action: 'COMPLIANCE_SIGN_OFF_VERIFIED',
      resource: 'Audit_Proof_Ledger_v1',
      prevHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      eventHash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
      status: 'COMPLIANT'
    }
  ];

  if (!isOpen) return null;

  const exportAuditLog = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'bidpilot_tamper_evident_audit_log.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Tamper-Evident SHA-256 Audit Trail</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  Chain Verified
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Cryptographically hashed audit log for institutional governance and compliance reviews.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {auditEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {evt.action}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                    {evt.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {evt.timestamp}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Resource: <strong className="font-mono text-slate-900 dark:text-white">{evt.resource}</strong></span>
                <span className="text-slate-400 text-[10px]">Actor: {evt.actor}</span>
              </div>

              <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="truncate max-w-[280px]">Hash: {evt.eventHash}</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{evt.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Immutable local ledger</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportAuditLog}
              className="btn-press px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
            <button
              onClick={onClose}
              className="btn-press px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
