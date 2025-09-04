export type UserRole = 'executive' | 'analyst' | 'auditor' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: {
    en: string;
    ar: string;
  };
  clearanceLevel: string;
  organization: string;
  avatarInitials: string;
  avatarColor: string;
  sessionStartedAt: string;
  token: string;
}

export const DEMO_PERSONAS: Record<UserRole, UserProfile> = {
  executive: {
    id: 'usr-exec-01',
    name: 'Abdlrrahman Shibani',
    email: 'abdlrrahman.shibani@gmail.com',
    role: 'executive',
    roleTitle: {
      en: 'Executive Director & Bid Committee Chair',
      ar: 'المدير التنفيذي ورئيس لجنة العطاءات'
    },
    clearanceLevel: 'Level 4 — Full Sovereign Clearance',
    organization: 'Arriada Strategic Advisory',
    avatarInitials: 'AS',
    avatarColor: 'bg-blue-600',
    sessionStartedAt: new Date().toISOString(),
    token: 'jwt-sec-exec-8942-auth-token'
  },
  analyst: {
    id: 'usr-analyst-02',
    name: 'Sarah Al-Mansouri',
    email: 's.almansouri@arriadagroup.com',
    role: 'analyst',
    roleTitle: {
      en: 'Senior Commercial Pricing & Risk Analyst',
      ar: 'كبير محللي التسعير التجاري والمخاطر'
    },
    clearanceLevel: 'Level 3 — Commercial & Simulation Clearance',
    organization: 'Arriada Analytics Unit',
    avatarInitials: 'SM',
    avatarColor: 'bg-indigo-600',
    sessionStartedAt: new Date().toISOString(),
    token: 'jwt-sec-analyst-4412-auth-token'
  },
  auditor: {
    id: 'usr-audit-03',
    name: 'David Vance (PwC / UN Observer)',
    email: 'd.vance@audit-advisor.org',
    role: 'auditor',
    roleTitle: {
      en: 'Independent Institutional Procurement Auditor',
      ar: 'مدقق المشتريات المؤسسية المستقل'
    },
    clearanceLevel: 'Level 2 — Read-Only Compliance Clearance',
    organization: 'International Audit Advisory',
    avatarInitials: 'DV',
    avatarColor: 'bg-emerald-600',
    sessionStartedAt: new Date().toISOString(),
    token: 'jwt-sec-audit-1092-auth-token'
  },
  guest: {
    id: 'usr-guest-04',
    name: 'External Reviewer',
    email: 'evaluator@un-partner.org',
    role: 'guest',
    roleTitle: {
      en: 'External Reviewer (Guest Access)',
      ar: 'مراجع خارجي (وصول ضيف)'
    },
    clearanceLevel: 'Level 1 — Restricted View',
    organization: 'Partner Evaluation Board',
    avatarInitials: 'ER',
    avatarColor: 'bg-slate-600',
    sessionStartedAt: new Date().toISOString(),
    token: 'jwt-sec-guest-0012-auth-token'
  }
};
