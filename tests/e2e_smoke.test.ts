import { describe, it, expect } from 'vitest';
import { initialOpportunity } from '../src/data/seedOpportunity';
import {
  calculateComplianceMetrics,
  calculatePricingSummary,
  calculateExpectedBidValue,
  evaluateGoNoGo
} from '../src/engine/scoring';
import { translations } from '../src/i18n/translations';

describe('BidPilot End-to-End User Journey Smoke Tests', () => {
  it('loads the seeded opportunity with valid multilingual schemas', () => {
    expect(initialOpportunity.rfqNumber).toBe('RFQ-2026-UNDP-LY-042');
    expect(initialOpportunity.requirements.length).toBeGreaterThanOrEqual(24);
    expect(initialOpportunity.pricingItems.target.length).toBeGreaterThanOrEqual(5);

    // Verify translations dictionary keys
    expect(translations.en.app.title).toBe('BidPilot');
    expect(translations.ar.app.title).toBe('بيد بايلوت (BidPilot)');
  });

  it('executes full procurement workflow: compliance -> pricing -> blocker override', () => {
    // 1. Calculate baseline compliance
    const initialCompliance = calculateComplianceMetrics(initialOpportunity.requirements);
    expect(initialCompliance.weightedCoverage).toBeGreaterThan(85);
    expect(initialCompliance.mandatoryGaps).toBe(0);

    // 2. Calculate target scenario pricing
    const targetPricing = calculatePricingSummary(
      initialOpportunity.pricingItems.target,
      initialOpportunity.budgetEstimate,
      initialOpportunity.taxRate
    );
    expect(targetPricing.totalRevenue).toBeLessThan(initialOpportunity.budgetEstimate);
    expect(targetPricing.grossMarginPercentage).toBeGreaterThan(12);

    // 3. Baseline Decision must be GO
    const baselineDecision = evaluateGoNoGo(initialOpportunity, initialCompliance, targetPricing);
    expect(baselineDecision.isBlocked).toBe(false);
    expect(baselineDecision.recommendation).toBe('GO');

    // 4. User modifies 1 mandatory requirement to GAP
    const modifiedReqs = initialOpportunity.requirements.map(r => {
      if (r.ref === 'TECH-01') return { ...r, state: 'gap' as const };
      return r;
    });

    const modifiedCompliance = calculateComplianceMetrics(modifiedReqs);
    expect(modifiedCompliance.mandatoryGaps).toBe(1);

    // 5. Decision MUST immediately force NO-GO blocker override
    const blockedDecision = evaluateGoNoGo(initialOpportunity, modifiedCompliance, targetPricing);
    expect(blockedDecision.isBlocked).toBe(true);
    expect(blockedDecision.recommendation).toBe('NO_GO');
    expect(blockedDecision.blockerReasons.en.length).toBeGreaterThan(0);
  });

  it('verifies expected bid value calculation across scenarios', () => {
    const evTarget = calculateExpectedBidValue(0.65, 78870, 14500);
    expect(evTarget).toBe(36766);

    const evLoss = calculateExpectedBidValue(0.10, 50000, 14500);
    expect(evLoss).toBe(-9500);
  });
});
