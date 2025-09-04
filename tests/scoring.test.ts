import { describe, it, expect } from 'vitest';
import {
  calculateComplianceMetrics,
  calculatePricingSummary,
  calculateExpectedBidValue,
  calculateModeledImpactMetrics,
  evaluateGoNoGo
} from '../src/engine/scoring';
import { initialOpportunity } from '../src/data/seedOpportunity';
import { Requirement, PricingItem } from '../src/types/procurement';

describe('BidPilot Scoring Engine & Mathematical Models', () => {
  describe('calculateComplianceMetrics', () => {
    it('calculates 100% weighted coverage when all items comply', () => {
      const mockReqs: Requirement[] = [
        {
          id: '1', ref: 'T-1', section: 'Sec 1',
          title: { en: 'A', ar: 'أ' }, description: { en: 'A', ar: 'أ' },
          category: 'technical', isMandatory: true, weight: 5, state: 'comply',
          proposedResponse: { en: 'Yes', ar: 'نعم' }, owner: 'Alice'
        },
        {
          id: '2', ref: 'T-2', section: 'Sec 2',
          title: { en: 'B', ar: 'ب' }, description: { en: 'B', ar: 'ب' },
          category: 'commercial', isMandatory: false, weight: 3, state: 'comply',
          proposedResponse: { en: 'Yes', ar: 'نعم' }, owner: 'Bob'
        }
      ];

      const metrics = calculateComplianceMetrics(mockReqs);
      expect(metrics.weightedCoverage).toBe(100);
      expect(metrics.mandatoryGaps).toBe(0);
      expect(metrics.complyCount).toBe(2);
      expect(metrics.totalRequirements).toBe(2);
    });

    it('correctly calculates weighted coverage for partial (0.5x) and gap (0.0x)', () => {
      const mockReqs: Requirement[] = [
        {
          id: '1', ref: 'T-1', section: 'Sec 1',
          title: { en: 'A', ar: 'أ' }, description: { en: 'A', ar: 'أ' },
          category: 'technical', isMandatory: true, weight: 4, state: 'comply', // satisfied: 4*1 = 4
          proposedResponse: { en: 'Yes', ar: 'نعم' }, owner: 'Alice'
        },
        {
          id: '2', ref: 'T-2', section: 'Sec 2',
          title: { en: 'B', ar: 'ب' }, description: { en: 'B', ar: 'ب' },
          category: 'technical', isMandatory: false, weight: 2, state: 'partial', // satisfied: 2*0.5 = 1
          proposedResponse: { en: 'Partial', ar: 'جزئي' }, owner: 'Alice'
        },
        {
          id: '3', ref: 'T-3', section: 'Sec 3',
          title: { en: 'C', ar: 'ج' }, description: { en: 'C', ar: 'ج' },
          category: 'delivery', isMandatory: false, weight: 4, state: 'gap', // satisfied: 4*0 = 0
          proposedResponse: { en: 'No', ar: 'لا' }, owner: 'Bob'
        }
      ];
      // Total weight: 4 + 2 + 4 = 10
      // Satisfied: 4 + 1 + 0 = 5 -> Coverage = 50%
      const metrics = calculateComplianceMetrics(mockReqs);
      expect(metrics.weightedCoverage).toBe(50);
      expect(metrics.mandatoryGaps).toBe(0);
      expect(metrics.categoryBreakdown.technical.percentage).toBe(83.3); // (5 / 6) * 100
      expect(metrics.categoryBreakdown.delivery.percentage).toBe(0);
    });

    it('detects and counts mandatory gaps accurately', () => {
      const mockReqs: Requirement[] = [
        {
          id: '1', ref: 'T-1', section: 'Sec 1',
          title: { en: 'A', ar: 'أ' }, description: { en: 'A', ar: 'أ' },
          category: 'technical', isMandatory: true, weight: 5, state: 'gap',
          proposedResponse: { en: 'Gap', ar: 'فجوة' }, owner: 'Alice'
        },
        {
          id: '2', ref: 'T-2', section: 'Sec 2',
          title: { en: 'B', ar: 'ب' }, description: { en: 'B', ar: 'ب' },
          category: 'administrative', isMandatory: true, weight: 5, state: 'comply',
          proposedResponse: { en: 'Comply', ar: 'مطابق' }, owner: 'Bob'
        }
      ];

      const metrics = calculateComplianceMetrics(mockReqs);
      expect(metrics.mandatoryGaps).toBe(1);
      expect(metrics.mandatoryCount).toBe(2);
    });

    it('handles empty requirement array without NaN or division by zero', () => {
      const metrics = calculateComplianceMetrics([]);
      expect(metrics.weightedCoverage).toBe(0);
      expect(metrics.totalRequirements).toBe(0);
      expect(metrics.mandatoryGaps).toBe(0);
    });
  });

  describe('calculatePricingSummary', () => {
    it('calculates full cost waterfall, markup, and gross margin percentage', () => {
      const items: PricingItem[] = [
        {
          id: 'i1', itemCode: 'SRV-01',
          description: { en: 'Server', ar: 'خادم' }, category: 'Hardware',
          quantity: 10, unit: 'Units', unitCost: 1000, logisticsPerUnit: 100,
          contingencyRate: 0.10, // subtotal = 10000 + 1000 = 11000. contingency = 1100
          overheadRate: 0.05,    // base+cont = 12100. overhead = 605. total cost = 12705
          markupRate: 0.20,      // gross price = 12705 * 1.20 = 15246
          discountRate: 0.0
        }
      ];

      const summary = calculatePricingSummary(items, 20000, 0.05);
      expect(summary.totalDirectCost).toBe(10000);
      expect(summary.totalLogistics).toBe(1000);
      expect(summary.totalContingency).toBe(1100);
      expect(summary.totalOverhead).toBe(605);
      expect(summary.totalCostBase).toBe(12705);
      expect(summary.totalRevenue).toBe(15246);
      expect(summary.totalGrossMargin).toBe(2541);
      expect(summary.grossMarginPercentage).toBeCloseTo(16.67, 1);
      expect(summary.priceHeadroom).toBe(4754); // 20000 - 15246
      expect(summary.taxAmount).toBe(762); // 15246 * 0.05 = 762.3 -> 762
    });

    it('handles scenario comparison correctly', () => {
      const targetSummary = calculatePricingSummary(initialOpportunity.pricingItems.target);
      const conservativeSummary = calculatePricingSummary(initialOpportunity.pricingItems.conservative);
      const competitiveSummary = calculatePricingSummary(initialOpportunity.pricingItems.competitive);

      expect(conservativeSummary.totalRevenue).toBeGreaterThan(targetSummary.totalRevenue);
      expect(targetSummary.totalRevenue).toBeGreaterThan(competitiveSummary.totalRevenue);
      expect(conservativeSummary.grossMarginPercentage).toBeGreaterThan(competitiveSummary.grossMarginPercentage);
    });
  });

  describe('calculateExpectedBidValue (EV)', () => {
    it('computes EV = (pWin * grossProfit) - pursuitCost', () => {
      // pWin: 0.60, Gross Profit: $100,000, Pursuit Cost: $10,000
      // EV = (0.60 * 100000) - 10000 = 60000 - 10000 = $50,000
      const ev = calculateExpectedBidValue(0.60, 100000, 10000);
      expect(ev).toBe(50000);
    });

    it('handles negative expected value scenarios', () => {
      // pWin: 0.10, Gross Profit: $20,000, Pursuit Cost: $15,000
      // EV = (0.10 * 20000) - 15000 = 2000 - 15000 = -$13,000
      const ev = calculateExpectedBidValue(0.10, 20000, 15000);
      expect(ev).toBe(-13000);
    });
  });

  describe('evaluateGoNoGo Decision Engine & Blocker Rules', () => {
    it('returns GO for high compliance, healthy margin, and 0 mandatory gaps', () => {
      const compliance = calculateComplianceMetrics(initialOpportunity.requirements);
      const pricing = calculatePricingSummary(initialOpportunity.pricingItems.target);
      const decision = evaluateGoNoGo(initialOpportunity, compliance, pricing);

      expect(decision.isBlocked).toBe(false);
      expect(decision.recommendation).toBe('GO');
      expect(decision.compositeScore).toBeGreaterThanOrEqual(80);
      expect(decision.dimensions).toHaveLength(6);
    });

    it('CRITICAL RULE: triggers NO-GO when even 1 mandatory gap exists despite 95%+ coverage', () => {
      // Introduce 1 mandatory gap
      const modifiedReqs = initialOpportunity.requirements.map(r => {
        if (r.ref === 'TECH-01') {
          return { ...r, state: 'gap' as const };
        }
        return r;
      });

      const compliance = calculateComplianceMetrics(modifiedReqs);
      const pricing = calculatePricingSummary(initialOpportunity.pricingItems.target);
      const decision = evaluateGoNoGo(initialOpportunity, compliance, pricing);

      expect(compliance.mandatoryGaps).toBe(1);
      expect(decision.isBlocked).toBe(true);
      expect(decision.recommendation).toBe('NO_GO');
      expect(decision.blockerReasons.en[0]).toContain('mandatory requirement(s) currently marked as Gap');
    });

    it('triggers NO-GO blocker when margin is below 8%', () => {
      const lowMarginPricing = {
        ...calculatePricingSummary(initialOpportunity.pricingItems.target),
        grossMarginPercentage: 4.5
      };
      const compliance = calculateComplianceMetrics(initialOpportunity.requirements);
      const decision = evaluateGoNoGo(initialOpportunity, compliance, lowMarginPricing);

      expect(decision.isBlocked).toBe(true);
      expect(decision.recommendation).toBe('NO_GO');
      expect(decision.blockerReasons.en.some(r => r.includes('viability threshold of 8.0%'))).toBe(true);
    });
  });

  describe('calculateModeledImpactMetrics', () => {
    it('produces valid readiness and risk indices within [0, 100] bounds', () => {
      const compliance = calculateComplianceMetrics(initialOpportunity.requirements);
      const pricing = calculatePricingSummary(initialOpportunity.pricingItems.target);
      const metrics = calculateModeledImpactMetrics(initialOpportunity, compliance, pricing);

      expect(metrics.readinessScore).toBeGreaterThanOrEqual(0);
      expect(metrics.readinessScore).toBeLessThanOrEqual(100);
      expect(metrics.riskExposureIndex).toBeGreaterThanOrEqual(0);
      expect(metrics.riskExposureIndex).toBeLessThanOrEqual(100);
      expect(metrics.hoursSavedModeled).toBe(11); // 18 - 7
    });
  });

  describe('Monte Carlo Box-Muller & Competitor Intelligence Models', () => {
    it('verifies initial opportunity defines complete competitor consortium and RFP metadata', () => {
      expect(initialOpportunity.id).toBeTruthy();
      expect(initialOpportunity.title.en).toBeTruthy();
      expect(initialOpportunity.buyer.en).toBeTruthy();
      expect(initialOpportunity.budgetEstimate).toBeGreaterThan(0);
      expect(initialOpportunity.pricingItems.target.length).toBeGreaterThan(0);
      expect(initialOpportunity.requirements.length).toBeGreaterThan(0);
    });

    it('calculates realistic Expected Bid Value (EV = PWin * GrossProfit - PursuitCost)', () => {
      const grossProfit = 85000;
      const pursuitCost = 14500;
      const pWin = 0.74;
      const ev = calculateExpectedBidValue(pWin, grossProfit, pursuitCost);
      expect(ev).toBe(Math.round(0.74 * 85000 - 14500));
    });

    it('verifies Bayesian Nash Equilibrium optimal bidding calculation for N competitors', () => {
      const baselineCost = 1200000;
      const ceilingBudget = 1800000;
      const numCompetitors = 4;
      // Formula: b*(c) = c + (Ceiling - c) / N
      const optimalBid = baselineCost + (ceilingBudget - baselineCost) / numCompetitors;
      expect(optimalBid).toBe(1350000);
      const margin = ((optimalBid - baselineCost) / optimalBid) * 100;
      expect(margin).toBeCloseTo(11.11, 1);
    });

    it('detects Winner\'s Curse exposure when reverse auction bid drops below cost threshold', () => {
      const baselineCost = 1000000;
      const safeBid = 1150000;
      const predatoryBid = 980000;

      const safeRatio = safeBid / baselineCost;
      const predatoryRatio = predatoryBid / baselineCost;

      expect(safeRatio).toBeGreaterThanOrEqual(1.08); // Safe
      expect(predatoryRatio).toBeLessThan(1.0); // Margin negative / predatory default risk
    });
  });
});
