import {
  Requirement,
  RequirementCategory,
  ComplianceState,
  ComplianceMetrics,
  CategoryCompliance,
  PricingItem,
  PricingSummary,
  Opportunity,
  ModeledImpactMetrics,
  GoNoGoDimension,
  GoNoGoDecision
} from '../types/procurement';

export const COMPLIANCE_STATE_WEIGHTS: Record<ComplianceState, number> = {
  comply: 1.0,
  partial: 0.5,
  gap: 0.0,
  not_assessed: 0.0
};

export const CATEGORIES: RequirementCategory[] = [
  'technical',
  'administrative',
  'commercial',
  'delivery',
  'warranty',
  'submission'
];

/**
 * Calculates weighted compliance coverage, category breakdowns, and mandatory gaps.
 * Formula: Coverage = (Sum of (weight * state_multiplier) / Sum of weights) * 100
 */
export function calculateComplianceMetrics(requirements: Requirement[]): ComplianceMetrics {
  const categoryBreakdown = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = {
      category: cat,
      totalWeight: 0,
      satisfiedWeight: 0,
      percentage: 0,
      totalCount: 0,
      mandatoryCount: 0,
      mandatoryGaps: 0
    };
    return acc;
  }, {} as Record<RequirementCategory, CategoryCompliance>);

  let totalWeight = 0;
  let satisfiedWeight = 0;
  let mandatoryCount = 0;
  let mandatoryGaps = 0;
  let complyCount = 0;
  let partialCount = 0;
  let gapCount = 0;
  let notAssessedCount = 0;

  for (const req of requirements) {
    const weight = req.weight || 1;
    const multiplier = COMPLIANCE_STATE_WEIGHTS[req.state] ?? 0;
    const satisfied = weight * multiplier;

    totalWeight += weight;
    satisfiedWeight += satisfied;

    if (req.state === 'comply') complyCount++;
    else if (req.state === 'partial') partialCount++;
    else if (req.state === 'gap') gapCount++;
    else notAssessedCount++;

    if (req.isMandatory) {
      mandatoryCount++;
      if (req.state === 'gap') {
        mandatoryGaps++;
      }
    }

    const catData = categoryBreakdown[req.category];
    if (catData) {
      catData.totalCount++;
      catData.totalWeight += weight;
      catData.satisfiedWeight += satisfied;
      if (req.isMandatory) {
        catData.mandatoryCount++;
        if (req.state === 'gap') {
          catData.mandatoryGaps++;
        }
      }
    }
  }

  // Calculate percentages per category
  for (const cat of CATEGORIES) {
    const c = categoryBreakdown[cat];
    c.percentage = c.totalWeight > 0 ? Number(((c.satisfiedWeight / c.totalWeight) * 100).toFixed(1)) : 0;
  }

  const weightedCoverage = totalWeight > 0 ? Number(((satisfiedWeight / totalWeight) * 100).toFixed(1)) : 0;

  return {
    totalRequirements: requirements.length,
    weightedCoverage,
    mandatoryCount,
    mandatoryGaps,
    complyCount,
    partialCount,
    gapCount,
    notAssessedCount,
    categoryBreakdown
  };
}

/**
 * Calculates complete Bill of Quantities economics, margin waterfall, and budget headroom.
 */
export function calculatePricingSummary(
  items: PricingItem[],
  benchmark: number = 485000,
  taxRate: number = 0.05
): PricingSummary {
  let totalDirectCost = 0;
  let totalLogistics = 0;
  let totalContingency = 0;
  let totalOverhead = 0;
  let totalRevenue = 0;

  for (const item of items) {
    const qty = Math.max(0, item.quantity);
    const unitDirect = Math.max(0, item.unitCost);
    const unitLogistics = Math.max(0, item.logisticsPerUnit);

    const directCost = qty * unitDirect;
    const logistics = qty * unitLogistics;
    const subtotal = directCost + logistics;

    const contingency = subtotal * (item.contingencyRate || 0);
    const overhead = (subtotal + contingency) * (item.overheadRate || 0);
    const costBase = subtotal + contingency + overhead;

    const markup = costBase * (item.markupRate || 0);
    const grossPrice = costBase + markup;
    const discount = grossPrice * (item.discountRate || 0);
    const lineRevenue = grossPrice - discount;

    totalDirectCost += directCost;
    totalLogistics += logistics;
    totalContingency += contingency;
    totalOverhead += overhead;
    totalRevenue += lineRevenue;
  }

  const totalCostBase = totalDirectCost + totalLogistics + totalContingency + totalOverhead;
  const totalGrossMargin = totalRevenue - totalCostBase;
  const grossMarginPercentage = totalRevenue > 0 ? Number(((totalGrossMargin / totalRevenue) * 100).toFixed(2)) : 0;
  const priceHeadroom = benchmark - totalRevenue;
  const taxAmount = totalRevenue * (taxRate || 0);
  const totalWithTax = totalRevenue + taxAmount;

  return {
    totalDirectCost: Math.round(totalDirectCost),
    totalLogistics: Math.round(totalLogistics),
    totalContingency: Math.round(totalContingency),
    totalOverhead: Math.round(totalOverhead),
    totalCostBase: Math.round(totalCostBase),
    totalGrossMargin: Math.round(totalGrossMargin),
    totalRevenue: Math.round(totalRevenue),
    grossMarginPercentage,
    fictionalBenchmark: benchmark,
    priceHeadroom: Math.round(priceHeadroom),
    taxAmount: Math.round(taxAmount),
    totalWithTax: Math.round(totalWithTax)
  };
}

/**
 * Calculates Expected Bid Value (EV)
 * EV = (pWin * grossProfit) - pursuitCost
 */
export function calculateExpectedBidValue(pWin: number, grossProfit: number, pursuitCost: number): number {
  const safePwin = Math.max(0, Math.min(1, pWin));
  return Math.round((safePwin * grossProfit) - pursuitCost);
}

/**
 * Calculates Risk Exposure Index (0-100, lower is better) and Overall Readiness Score (0-100, higher is better).
 */
export function calculateModeledImpactMetrics(
  opportunity: Opportunity,
  compliance: ComplianceMetrics,
  pricing: PricingSummary
): ModeledImpactMetrics {
  const expectedBidValue = calculateExpectedBidValue(
    opportunity.pWin,
    pricing.totalGrossMargin,
    opportunity.pursuitCost
  );

  // Modeled preparation efficiency
  const baselinePreparationHours = 18.0;
  const assistedPreparationHours = 7.0;
  const hoursSavedModeled = baselinePreparationHours - assistedPreparationHours;

  // Risk Exposure calculation (0-100)
  let riskScore = 0;
  // Mandatory gaps risk (up to 50 points)
  riskScore += Math.min(50, compliance.mandatoryGaps * 25);
  // Overall compliance deficiency risk (up to 20 points)
  riskScore += Math.round((100 - compliance.weightedCoverage) * 0.2);
  // Margin risk (up to 15 points)
  if (pricing.grossMarginPercentage < 10) riskScore += 15;
  else if (pricing.grossMarginPercentage < 14) riskScore += 8;
  // Missing evidence risk (up to 15 points)
  const unverifiedDocs = opportunity.evidence.filter(e => e.status !== 'verified').length;
  riskScore += Math.min(15, unverifiedDocs * 5);

  const riskExposureIndex = Math.max(0, Math.min(100, riskScore));

  // Readiness calculation (0-100)
  let readiness = (
    (compliance.weightedCoverage * 0.45) +
    (Math.min(100, (pricing.grossMarginPercentage / 20) * 100) * 0.25) +
    (((opportunity.evidence.length - unverifiedDocs) / Math.max(1, opportunity.evidence.length) * 100) * 0.15) +
    (75 * 0.15) // milestone progress factor
  );

  // Mandatory gap blocker penalty on readiness
  if (compliance.mandatoryGaps > 0) {
    readiness = Math.max(15, readiness - (compliance.mandatoryGaps * 25));
  }

  const readinessScore = Math.max(0, Math.min(100, Math.round(readiness)));

  return {
    expectedBidValue,
    hoursSavedModeled,
    baselinePreparationHours,
    assistedPreparationHours,
    riskExposureIndex,
    readinessScore
  };
}

/**
 * Evaluates the multi-factor explainable Go/No-Go decision scorecard.
 * Includes hard blocker override for any mandatory compliance gap.
 */
export function evaluateGoNoGo(
  opportunity: Opportunity,
  compliance: ComplianceMetrics,
  pricing: PricingSummary
): GoNoGoDecision {
  const verifiedDocsCount = opportunity.evidence.filter(e => e.status === 'verified').length;
  const evidenceCompletenessPct = opportunity.evidence.length > 0
    ? Math.round((verifiedDocsCount / opportunity.evidence.length) * 100)
    : 100;

  // 1. Compliance Dimension (Weight: 30)
  const compScore = compliance.mandatoryGaps > 0
    ? Math.max(20, Math.round(compliance.weightedCoverage * 0.5))
    : Math.round(compliance.weightedCoverage);

  // 2. Delivery Feasibility (Weight: 20)
  const deliveryCat = compliance.categoryBreakdown['delivery'];
  const deliveryScore = deliveryCat ? deliveryCat.percentage : 85;

  // 3. Margin & Commercials (Weight: 20)
  let marginScore = 40;
  if (pricing.grossMarginPercentage >= 18) marginScore = 95;
  else if (pricing.grossMarginPercentage >= 15) marginScore = 88;
  else if (pricing.grossMarginPercentage >= 12) marginScore = 78;
  else if (pricing.grossMarginPercentage >= 8) marginScore = 60;

  // 4. Strategic Fit (Weight: 10)
  const strategicScore = 90; // High municipal modernization alignment

  // 5. Evidence Completeness (Weight: 10)
  const evidenceScore = evidenceCompletenessPct;

  // 6. Expected Value / ROI (Weight: 10)
  const ev = calculateExpectedBidValue(opportunity.pWin, pricing.totalGrossMargin, opportunity.pursuitCost);
  const roiRatio = ev / Math.max(1, opportunity.pursuitCost);
  let roiScore = 50;
  if (roiRatio > 3) roiScore = 95;
  else if (roiRatio > 1.5) roiScore = 80;
  else if (roiRatio > 0.5) roiScore = 65;

  const dimensions: GoNoGoDimension[] = [
    {
      id: 'dim-compliance',
      title: {
        en: 'RFP Specification & Legal Compliance',
        ar: 'المطابقة للمواصفات الفنية والقانونية'
      },
      weight: 30,
      score: compScore,
      contribution: Number(((compScore * 0.30)).toFixed(1)),
      status: compScore >= 85 ? 'pass' : compScore >= 65 ? 'warning' : 'fail',
      explanation: {
        en: `Weighted compliance coverage is ${compliance.weightedCoverage}%. ${compliance.mandatoryGaps > 0 ? `CRITICAL: ${compliance.mandatoryGaps} mandatory gaps detected.` : 'All mandatory requirements fulfilled.'}`,
        ar: `نسبة المطابقة الموزونة ${compliance.weightedCoverage}%. ${compliance.mandatoryGaps > 0 ? `تحذير حرج: تم رصد ${compliance.mandatoryGaps} ثغرات في البنود الإلزامية.` : 'جميع البنود الإلزامية مستوفاة بالكامل.'}`
      }
    },
    {
      id: 'dim-delivery',
      title: {
        en: 'Supply Chain & Delivery Feasibility',
        ar: 'سلاسل التوريد والجدوى اللوجستية'
      },
      weight: 20,
      score: Math.round(deliveryScore),
      contribution: Number(((deliveryScore * 0.20)).toFixed(1)),
      status: deliveryScore >= 80 ? 'pass' : deliveryScore >= 60 ? 'warning' : 'fail',
      explanation: {
        en: `Delivery category readiness is ${deliveryScore}%. Dual-hub regional transit and clearance partners secured.`,
        ar: `جاهزية محور التوريد والتسليم ${deliveryScore}%. تم تأمين الشركاء اللوجستيين في طرابلس وبنغازي.`
      }
    },
    {
      id: 'dim-margin',
      title: {
        en: 'Financial Profitability & Headroom',
        ar: 'الربحية المالية وهامش الأمان للميزانية'
      },
      weight: 20,
      score: marginScore,
      contribution: Number(((marginScore * 0.20)).toFixed(1)),
      status: marginScore >= 75 ? 'pass' : marginScore >= 55 ? 'warning' : 'fail',
      explanation: {
        en: `Modeled gross margin is ${pricing.grossMarginPercentage}% ($${pricing.totalGrossMargin.toLocaleString()}) with $${pricing.priceHeadroom.toLocaleString()} price headroom.`,
        ar: `هامش الربح الإجمالي المقدر ${pricing.grossMarginPercentage}% ($${pricing.totalGrossMargin.toLocaleString()}) مع فارق ميزانية $${pricing.priceHeadroom.toLocaleString()}.`
      }
    },
    {
      id: 'dim-strategic',
      title: {
        en: 'Strategic Alignment & Client Track Record',
        ar: 'التوافق الاستراتيجي وسجل الأعمال السابقة'
      },
      weight: 10,
      score: strategicScore,
      contribution: Number(((strategicScore * 0.10)).toFixed(1)),
      status: 'pass',
      explanation: {
        en: 'High domain alignment with public sector modernization and enterprise infrastructure footprint.',
        ar: 'توافق استراتيجي عالي مع مشاريع تحديث القطاع العام والبنية التحتية المؤسسية.'
      }
    },
    {
      id: 'dim-evidence',
      title: {
        en: 'Evidence & Dossier Completeness',
        ar: 'اكتمال الوثائق والشهادات المؤيدة'
      },
      weight: 10,
      score: evidenceScore,
      contribution: Number(((evidenceScore * 0.10)).toFixed(1)),
      status: evidenceScore >= 80 ? 'pass' : evidenceScore >= 50 ? 'warning' : 'fail',
      explanation: {
        en: `${verifiedDocsCount} of ${opportunity.evidence.length} required compliance documents verified in registry.`,
        ar: `تم التحقق من ${verifiedDocsCount} من أصل ${opportunity.evidence.length} وثائق إلزامية مسجلة.`
      }
    },
    {
      id: 'dim-roi',
      title: {
        en: 'Pursuit ROI & Expected Value Ratio',
        ar: 'العائد المتوقع مقارنة بتكلفة إعداد العطاء'
      },
      weight: 10,
      score: roiScore,
      contribution: Number(((roiScore * 0.10)).toFixed(1)),
      status: roiScore >= 75 ? 'pass' : roiScore >= 50 ? 'warning' : 'fail',
      explanation: {
        en: `Expected Bid Value (EV) is $${ev.toLocaleString()} against $${opportunity.pursuitCost.toLocaleString()} pursuit cost (ROI ratio ${roiRatio.toFixed(1)}x).`,
        ar: `القيمة المتوقعة للعطاء ($${ev.toLocaleString()}) مقابل تكلفة إعداد $${opportunity.pursuitCost.toLocaleString()} (عائد ${roiRatio.toFixed(1)}x).`
      }
    }
  ];

  const compositeScore = Number(dimensions.reduce((sum, d) => sum + d.contribution, 0).toFixed(1));

  const blockerReasonsEn: string[] = [];
  const blockerReasonsAr: string[] = [];
  let isBlocked = false;

  // HARD BLOCKER 1: Mandatory gaps
  if (compliance.mandatoryGaps > 0) {
    isBlocked = true;
    blockerReasonsEn.push(`${compliance.mandatoryGaps} mandatory requirement(s) currently marked as Gap. Institutional procurement rules disqualify non-compliant bids.`);
    blockerReasonsAr.push(`يوجد ${compliance.mandatoryGaps} بند إلزامي في حالة نقص/عدم مطابقة. قواعد التوريد المؤسسية تستبعد العطاءات غير المطابقة.`);
  }

  // HARD BLOCKER 2: Margin too low (< 8%)
  if (pricing.grossMarginPercentage < 8) {
    isBlocked = true;
    blockerReasonsEn.push(`Projected gross margin (${pricing.grossMarginPercentage}%) is below the commercial viability threshold of 8.0%.`);
    blockerReasonsAr.push(`هامش الربح الإجمالي المقدر (${pricing.grossMarginPercentage}%) يقل عن الحد الأدنى للجدوى التجارية البالغ 8.0%.`);
  }

  let recommendation: 'GO' | 'CONDITIONAL_GO' | 'NO_GO' = 'GO';
  let rationaleEn = '';
  let rationaleAr = '';

  if (isBlocked) {
    recommendation = 'NO_GO';
    rationaleEn = `BID DISQUALIFIED / NO-GO: Blocked by ${blockerReasonsEn.length} high-severity condition(s). Resolve mandatory blockers before reconsidering.`;
    rationaleAr = `قرار الامتناع (NO-GO): تم إيقاف التقدم بسبب ${blockerReasonsAr.length} شروط حرجة. يجب حل المشكلات الإلزامية قبل إعادة النظر.`;
  } else if (compositeScore >= 80) {
    recommendation = 'GO';
    rationaleEn = `RECOMMENDED GO: Opportunity demonstrates strong technical alignment (${compliance.weightedCoverage}%), healthy commercial margin (${pricing.grossMarginPercentage}%), and positive expected return ($${ev.toLocaleString()}).`;
    rationaleAr = `قرار التقدم (GO): تظهر الفرصة مطابقة فنية قوية (${compliance.weightedCoverage}%)، وهامش ربح صحي (${pricing.grossMarginPercentage}%)، وعائداً متوقعاً إيجابياً ($${ev.toLocaleString()}).`;
  } else if (compositeScore >= 60) {
    recommendation = 'CONDITIONAL_GO';
    rationaleEn = `CONDITIONAL GO: Opportunity is viable (Score ${compositeScore}/100) but requires executive mitigation on partial compliance items and delivery schedule.`;
    rationaleAr = `قرار مشروط (CONDITIONAL GO): الفرصة قابلة للتنفيذ (الدرجة ${compositeScore}/100) ولكن تتطلب تدابير لمعالجة البنود الجزئية وجدول التوريد.`;
  } else {
    recommendation = 'NO_GO';
    rationaleEn = `NO-GO: Opportunity score (${compositeScore}/100) falls below organizational pursuit threshold.`;
    rationaleAr = `قرار الامتناع (NO-GO): درجة تقييم الفرصة (${compositeScore}/100) أقل من الحد الأدنى المقبول مؤسسياً.`;
  }

  return {
    recommendation,
    compositeScore,
    isBlocked,
    blockerReasons: {
      en: blockerReasonsEn,
      ar: blockerReasonsAr
    },
    dimensions,
    rationale: {
      en: rationaleEn,
      ar: rationaleAr
    }
  };
}
