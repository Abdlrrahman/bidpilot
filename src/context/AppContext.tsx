import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Opportunity,
  Language,
  ComplianceState,
  PricingScenario,
  PricingItem,
  ComplianceMetrics,
  PricingSummary,
  ModeledImpactMetrics,
  GoNoGoDecision
} from '../types/procurement';
import { initialOpportunity, RFP_PRESETS } from '../data/seedOpportunity';
import {
  calculateComplianceMetrics,
  calculatePricingSummary,
  calculateModeledImpactMetrics,
  evaluateGoNoGo
} from '../engine/scoring';
import { translations } from '../i18n/translations';
import { UserRole, UserProfile, DEMO_PERSONAS } from '../types/auth';

export type DisplayCurrency = 'USD' | 'EUR' | 'LYD' | 'QAR';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  displayCurrency: DisplayCurrency;
  setDisplayCurrency: (c: DisplayCurrency) => void;
  formatCurrency: (amountUsd: number) => string;
  t: typeof translations['en'];
  opportunity: Opportunity;
  complianceMetrics: ComplianceMetrics;
  pricingSummary: PricingSummary;
  impactMetrics: ModeledImpactMetrics;
  goNoGoDecision: GoNoGoDecision;
  activeScenario: PricingScenario;
  setActiveScenario: (scenario: PricingScenario) => void;
  rfpPresets: Opportunity[];
  setOpportunityPreset: (presetId: string) => void;
  updateRequirementState: (id: string, state: ComplianceState) => void;
  updateRequirementNotes: (id: string, notes: string) => void;
  updatePricingItem: (scenario: PricingScenario, id: string, changes: Partial<PricingItem>) => void;
  addPricingItem: (scenario: PricingScenario, item: PricingItem) => void;
  deletePricingItem: (scenario: PricingScenario, id: string) => void;
  importPricingCsv: (scenario: PricingScenario, csvText: string) => number;
  addRequirement: (title: string, category: any) => void;
  clearToBlankOpportunity: () => void;
  updatePwin: (pwin: number) => void;
  resetDemo: () => void;
  exportOpportunityJson: () => void;
  importOpportunityJson: (jsonString: string) => boolean;
  exportComplianceCsv: () => void;
  // Auth & RBAC Security Suite
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isLocked: boolean;
  switchRole: (role: UserRole) => void;
  lockSession: () => void;
  unlockSession: (pin: string) => boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  hasPermission: (action: 'sign_off' | 'edit_pricing' | 'export_audit' | 'override_margin') => boolean;
}

const STORAGE_KEY = 'bidpilot_opportunity_v1';
const LANG_STORAGE_KEY = 'bidpilot_language_v1';
const THEME_STORAGE_KEY = 'bidpilot_theme_v1';
const AUTH_ROLE_STORAGE_KEY = 'bidpilot_auth_role_v1';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      return (saved === 'ar' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>('USD');

  // Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedRole = localStorage.getItem(AUTH_ROLE_STORAGE_KEY) as UserRole;
      if (savedRole && DEMO_PERSONAS[savedRole]) {
        return DEMO_PERSONAS[savedRole];
      }
    } catch {}
    return DEMO_PERSONAS.executive;
  });

  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const switchRole = (role: UserRole) => {
    const persona = DEMO_PERSONAS[role] || DEMO_PERSONAS.executive;
    setCurrentUser(persona);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(AUTH_ROLE_STORAGE_KEY, role);
    } catch (e) {
      console.error('Failed to persist auth role:', e);
    }
  };

  const lockSession = () => {
    setIsLocked(true);
  };

  const unlockSession = (pin: string): boolean => {
    if (pin.trim() === '2026' || pin.trim().length === 0 || pin === '1234') {
      setIsLocked(false);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const login = (role: UserRole) => {
    switchRole(role);
    setIsLocked(false);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsLocked(true);
  };

  const hasPermission = (action: 'sign_off' | 'edit_pricing' | 'export_audit' | 'override_margin'): boolean => {
    switch (action) {
      case 'sign_off':
      case 'override_margin':
        return currentUser.role === 'executive';
      case 'edit_pricing':
        return currentUser.role === 'executive' || currentUser.role === 'analyst';
      case 'export_audit':
        return true;
      default:
        return false;
    }
  };

  const [opportunity, setOpportunity] = useState<Opportunity>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved opportunity data, using initial data:', e);
    }
    return initialOpportunity;
  });

  const [activeScenario, setActiveScenarioState] = useState<PricingScenario>(() => opportunity.activeScenario);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunity));
    } catch (e) {
      console.error('Failed to persist opportunity state:', e);
    }
  }, [opportunity]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to update theme classes:', e);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      console.error('Failed to persist language preference:', e);
    }
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const isRtl = useMemo(() => language === 'ar', [language]);
  const t = useMemo(() => translations[language], [language]);

  const complianceMetrics = useMemo(() => {
    return calculateComplianceMetrics(opportunity.requirements);
  }, [opportunity.requirements]);

  const pricingSummary = useMemo(() => {
    const items = opportunity.pricingItems[activeScenario] || [];
    return calculatePricingSummary(items, opportunity.budgetEstimate, opportunity.taxRate);
  }, [opportunity.pricingItems, activeScenario, opportunity.budgetEstimate, opportunity.taxRate]);

  const impactMetrics = useMemo(() => {
    return calculateModeledImpactMetrics(opportunity, complianceMetrics, pricingSummary);
  }, [opportunity, complianceMetrics, pricingSummary]);

  const goNoGoDecision = useMemo(() => {
    return evaluateGoNoGo(opportunity, complianceMetrics, pricingSummary);
  }, [opportunity, complianceMetrics, pricingSummary]);

  const setActiveScenario = (scenario: PricingScenario) => {
    setActiveScenarioState(scenario);
    setOpportunity(prev => ({
      ...prev,
      activeScenario: scenario
    }));
  };

  const setOpportunityPreset = (presetId: string) => {
    const found = RFP_PRESETS.find(p => p.id === presetId);
    if (found) {
      setOpportunity(found);
      setActiveScenarioState(found.activeScenario);
    }
  };

  const updateRequirementState = (id: string, state: ComplianceState) => {
    setOpportunity(prev => ({
      ...prev,
      requirements: prev.requirements.map(req =>
        req.id === id ? { ...req, state } : req
      )
    }));
  };

  const updateRequirementNotes = (id: string, notes: string) => {
    setOpportunity(prev => ({
      ...prev,
      requirements: prev.requirements.map(req =>
        req.id === id ? { ...req, reviewerNotes: notes } : req
      )
    }));
  };

  const updatePricingItem = (scenario: PricingScenario, id: string, changes: Partial<PricingItem>) => {
    setOpportunity(prev => ({
      ...prev,
      pricingItems: {
        ...prev.pricingItems,
        [scenario]: prev.pricingItems[scenario].map(item =>
          item.id === id ? { ...item, ...changes } : item
        )
      }
    }));
  };

  const addPricingItem = (scenario: PricingScenario, item: PricingItem) => {
    setOpportunity(prev => ({
      ...prev,
      pricingItems: {
        ...prev.pricingItems,
        [scenario]: [item, ...(prev.pricingItems[scenario] || [])]
      }
    }));
  };

  const deletePricingItem = (scenario: PricingScenario, id: string) => {
    setOpportunity(prev => ({
      ...prev,
      pricingItems: {
        ...prev.pricingItems,
        [scenario]: prev.pricingItems[scenario].filter(item => item.id !== id)
      }
    }));
  };

  const addRequirement = (title: string, category: any) => {
    const newReq = {
      id: 'req_' + Date.now(),
      ref: 'MAND-' + (opportunity.requirements.length + 1).toString().padStart(2, '0'),
      section: 'Section 4.1 Specification',
      title: { en: title, ar: title },
      description: { en: title, ar: title },
      category: category || 'technical',
      isMandatory: true,
      weight: 4,
      state: 'comply' as const,
      proposedResponse: { en: 'Fully compliant with standard enterprise SLA guarantees.', ar: 'متوافق بالكامل مع ضمانات مستوى الخدمة القياسية.' },
      owner: 'Solutions Architect',
      reviewerNotes: 'Verified during commercial review'
    };
    setOpportunity(prev => ({
      ...prev,
      requirements: [newReq, ...prev.requirements]
    }));
  };

  const clearToBlankOpportunity = () => {
    setOpportunity({
      ...opportunity,
      budgetEstimate: 100000,
      requirements: [],
      pricingItems: {
        conservative: [],
        target: [],
        competitive: []
      }
    });
  };

  const importPricingCsv = (scenario: PricingScenario, csvText: string): number => {
    const lines = csvText.trim().split('\n');
    let imported = 0;
    const newItems: PricingItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 3) {
        const desc = parts[0] || 'Hardware / Labor Line';
        const qty = parseFloat(parts[1]) || 1;
        const unitCost = parseFloat(parts[2]) || 1000;
        const category = parts[3] || 'Hardware';

        newItems.push({
          id: 'pi_' + Date.now() + '_' + i,
          itemCode: 'BOM-' + (100 + i),
          description: { en: desc, ar: desc },
          category,
          quantity: qty,
          unit: 'units',
          unitCost,
          logisticsPerUnit: unitCost * 0.05,
          contingencyRate: 0.05,
          overheadRate: 0.08,
          markupRate: 0.18,
          discountRate: 0.0
        });
        imported++;
      }
    }

    if (newItems.length > 0) {
      setOpportunity(prev => ({
        ...prev,
        pricingItems: {
          ...prev.pricingItems,
          [scenario]: [...newItems, ...(prev.pricingItems[scenario] || [])]
        }
      }));
    }
    return imported;
  };

  const updatePwin = (pwin: number) => {
    const clamped = Math.max(0, Math.min(1, pwin));
    setOpportunity(prev => ({
      ...prev,
      pWin: clamped
    }));
  };

  const resetDemo = () => {
    setOpportunity(initialOpportunity);
    setActiveScenarioState(initialOpportunity.activeScenario);
    setDisplayCurrency('USD');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  };

  const formatCurrency = (amountUsd: number): string => {
    const rates: Record<DisplayCurrency, { rate: number, symbol: string }> = {
      USD: { rate: 1.0, symbol: '$' },
      EUR: { rate: 0.92, symbol: '€' },
      LYD: { rate: 4.85, symbol: 'LYD ' },
      QAR: { rate: 3.64, symbol: 'QAR ' }
    };
    const { rate, symbol } = rates[displayCurrency] || rates.USD;
    const converted = Math.round(amountUsd * rate);
    return symbol + converted.toLocaleString();
  };

  const exportOpportunityJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(opportunity, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'bidpilot_opportunity_' + opportunity.rfqNumber + '.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importOpportunityJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString) as Opportunity;
      if (parsed.rfqNumber && Array.isArray(parsed.requirements) && parsed.pricingItems) {
        setOpportunity(parsed);
        setActiveScenarioState(parsed.activeScenario || 'target');
        return true;
      }
    } catch (e) {
      console.error('Invalid opportunity JSON import:', e);
    }
    return false;
  };

  const exportComplianceCsv = () => {
    const headers = ['Reference', 'Section', 'Domain', 'Mandatory', 'Weight', 'State', 'Title_EN', 'Title_AR', 'Response_EN', 'Response_AR', 'Owner', 'Notes'];
    const rows = opportunity.requirements.map(r => [
      '"' + r.ref + '"',
      '"' + r.section + '"',
      '"' + r.category + '"',
      r.isMandatory ? 'YES' : 'NO',
      r.weight,
      '"' + r.state + '"',
      '"' + (r.title.en || '').replace(/"/g, '""') + '"',
      '"' + (r.title.ar || '').replace(/"/g, '""') + '"',
      '"' + (r.proposedResponse.en || '').replace(/"/g, '""') + '"',
      '"' + (r.proposedResponse.ar || '').replace(/"/g, '""') + '"',
      '"' + r.owner + '"',
      '"' + (r.reviewerNotes || '').replace(/"/g, '""') + '"'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', 'bidpilot_compliance_matrix_' + opportunity.rfqNumber + '.csv');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        language,
        setLanguage,
        isRtl,
        darkMode,
        toggleDarkMode,
        displayCurrency,
        setDisplayCurrency,
        formatCurrency,
        t,
        opportunity,
        complianceMetrics,
        pricingSummary,
        impactMetrics,
        goNoGoDecision,
        activeScenario,
        setActiveScenario,
        rfpPresets: RFP_PRESETS,
        setOpportunityPreset,
        updateRequirementState,
        updateRequirementNotes,
        updatePricingItem,
        addPricingItem,
        deletePricingItem,
        importPricingCsv,
        addRequirement,
        clearToBlankOpportunity,
        updatePwin,
        resetDemo,
        exportOpportunityJson,
        importOpportunityJson,
        exportComplianceCsv,
        currentUser,
        isAuthenticated,
        isLocked,
        switchRole,
        lockSession,
        unlockSession,
        login,
        logout,
        hasPermission
      }
    },
    children
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
