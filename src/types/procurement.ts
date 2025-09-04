export type Language = 'en' | 'ar';

export type ComplianceState = 'comply' | 'partial' | 'gap' | 'not_assessed';

export type RequirementCategory =
  | 'technical'
  | 'administrative'
  | 'commercial'
  | 'delivery'
  | 'warranty'
  | 'submission';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Requirement {
  id: string;
  ref: string;
  section: string;
  title: LocalizedString;
  description: LocalizedString;
  category: RequirementCategory;
  isMandatory: boolean;
  weight: number; // 1 to 5
  state: ComplianceState;
  proposedResponse: LocalizedString;
  evidenceId?: string;
  owner: string;
  reviewerNotes?: string;
}

export type PricingScenario = 'conservative' | 'target' | 'competitive';

export interface PricingItem {
  id: string;
  itemCode: string;
  description: LocalizedString;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  logisticsPerUnit: number;
  contingencyRate: number; // e.g. 0.05
  overheadRate: number;    // e.g. 0.08
  markupRate: number;      // e.g. 0.18
  discountRate: number;    // e.g. 0.0
}

export interface PricingSummary {
  totalDirectCost: number;
  totalLogistics: number;
  totalContingency: number;
  totalOverhead: number;
  totalCostBase: number;
  totalGrossMargin: number;
  totalRevenue: number;
  grossMarginPercentage: number;
  fictionalBenchmark: number;
  priceHeadroom: number;
  taxAmount: number;
  totalWithTax: number;
}

export interface GoNoGoDimension {
  id: string;
  title: LocalizedString;
  weight: number;
  score: number; // 0-100
  contribution: number;
  status: 'pass' | 'warning' | 'fail';
  explanation: LocalizedString;
}

export interface GoNoGoDecision {
  recommendation: 'GO' | 'CONDITIONAL_GO' | 'NO_GO';
  compositeScore: number;
  isBlocked: boolean;
  blockerReasons: {
    en: string[];
    ar: string[];
  };
  dimensions: GoNoGoDimension[];
  rationale: LocalizedString;
}

export type MilestoneStatus = 'completed' | 'in_progress' | 'upcoming' | 'overdue';

export interface Milestone {
  id: string;
  title: LocalizedString;
  date: string;
  owner: string;
  status: MilestoneStatus;
  isCritical: boolean;
}

export type EvidenceStatus = 'verified' | 'draft' | 'missing' | 'expired';

export interface EvidenceDocument {
  id: string;
  docCode: string;
  title: LocalizedString;
  filename: string;
  category: string;
  status: EvidenceStatus;
  lastUpdated: string;
  validUntil?: string;
  sizeKb: number;
}

export interface Opportunity {
  id: string;
  rfqNumber: string;
  title: LocalizedString;
  buyer: LocalizedString;
  buyerType: LocalizedString;
  city: LocalizedString;
  country: LocalizedString;
  currency: string;
  budgetEstimate: number;
  pursuitCost: number;
  pWin: number; // 0.0 to 1.0
  deadline: string;
  owner: string;
  stage: string;
  activeScenario: PricingScenario;
  taxRate: number;
  requirements: Requirement[];
  pricingItems: Record<PricingScenario, PricingItem[]>;
  milestones: Milestone[];
  evidence: EvidenceDocument[];
}

export interface CategoryCompliance {
  category: RequirementCategory;
  totalWeight: number;
  satisfiedWeight: number;
  percentage: number;
  totalCount: number;
  mandatoryCount: number;
  mandatoryGaps: number;
}

export interface ComplianceMetrics {
  totalRequirements: number;
  weightedCoverage: number;
  mandatoryCount: number;
  mandatoryGaps: number;
  complyCount: number;
  partialCount: number;
  gapCount: number;
  notAssessedCount: number;
  categoryBreakdown: Record<RequirementCategory, CategoryCompliance>;
}

export interface ModeledImpactMetrics {
  expectedBidValue: number;
  hoursSavedModeled: number;
  baselinePreparationHours: number;
  assistedPreparationHours: number;
  riskExposureIndex: number; // 0-100 (lower is better)
  readinessScore: number;    // 0-100 (higher is better)
}
