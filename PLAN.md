# BidPilot: Implementation Plan & Acceptance Checklist

## Target Scope
Build **BidPilot** (Project 1 of the 5-system portfolio playbook) as an enterprise-grade, bilingual, static GitHub Pages application that transforms RFQ requirements into an explainable bid-readiness decision.

---

## Implementation Checklist

### Phase 1: Workspace & Toolchain
- [x] Scaffold Vite + React + TypeScript in strict mode.
- [x] Configure Tailwind CSS with direction-aware tokens and motion micro-interactions.
- [x] Configure Vitest unit test runner.
- [x] Configure dynamic base path for GitHub Pages deployment.

### Phase 2: Domain Modeling & Synthetic Datasets
- [x] Define TypeScript models for `Opportunity`, `Requirement`, `ComplianceState`, `PricingItem`, `GoNoGoDecision`, `Milestone`, and `EvidenceDocument`.
- [x] Seed 26 realistic, deterministic synthetic requirements across Technical, Administrative, Commercial, Delivery, Warranty, and Submission domains.
- [x] Seed Bill of Quantities (BOQ) with 7 equipment and service items across 3 scenarios.
- [x] Seed 8 critical path milestones and 8 evidence verification documents.

### Phase 3: Pure Calculation Engine & Test Suite
- [x] Implement `calculateComplianceMetrics` with weighted multipliers (Comply: 1.0, Partial: 0.5, Gap: 0, Not Assessed: 0).
- [x] Implement `getMandatoryGapCount` and strict mandatory blocker trigger.
- [x] Implement `calculatePricingSummary` with landed cost waterfall, markup, and buyer headroom.
- [x] Implement `calculateExpectedBidValue` ($EV = P_{\text{win}} \times \text{Gross Profit} - \text{Pursuit Cost}$).
- [x] Implement `evaluateGoNoGo` with 6 weighted evaluation dimensions and plain-language explanations.
- [x] Implement `calculateModeledImpactMetrics` for risk index and readiness score.
- [x] Write 12 Vitest unit tests covering all edge cases (100% passing).

### Phase 4: Bilingual Localization (EN / AR RTL)
- [x] Build comprehensive centralized dictionaries in English and Arabic.
- [x] Configure direction-aware typography (Inter + Cairo) and layout switching.

### Phase 5: Interactive UI & Core Views
- [x] Header with Demo Banner, Language toggle, Scenario switcher, Reset Demo button, and Export/Import options.
- [x] Overview View with live countdown, metric cards, Pwin slider, category breakdown, and risk analysis.
- [x] Requirements Matrix with live state dropdowns, category filter, search, mandatory toggle, reviewer notes modal, and CSV export.
- [x] Pricing & Waterfall View with BOQ table, stacked cost bar, buyer headroom, and 3-scenario side-by-side matrix.
- [x] Go/No-Go Decision Gate with recommendation badge, composite score, blocker alerts, and 6 dimension scorecards.
- [x] Milestones & Timeline View with status nodes and critical path badges.
- [x] Evidence Register with simulated metadata verification modal.
- [x] Executive Summary Brief with print-ready CSS stylesheet.
- [x] Methodology Page detailing all mathematical formulas.

### Phase 6: Documentation & Repository Standards
- [x] Complete `README.md` with value model, architecture, and setup instructions.
- [x] Complete `docs/case-study.md`.
- [x] Complete `docs/methodology.md`.
- [x] Complete `docs/data-dictionary.md`.
- [x] Complete `docs/architecture.md` with Mermaid diagrams.
- [x] Complete `docs/demo-script.md`.
- [x] `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE` (MIT), `CHANGELOG.md`.
- [x] GitHub Actions CI workflow (`.github/workflows/ci.yml`).
- [x] GitHub Pages deployment workflow (`.github/workflows/deploy.yml`).
- [x] GitHub issue templates & PR template.
