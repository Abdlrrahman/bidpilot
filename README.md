# BidPilot — Procurement Decision Intelligence & Bid-Readiness Control Tower

> **Tagline:** From RFQ requirements to an explainable bid decision.  
> **Author:** Abdlrrahman Shibani  
> **Live Demo:** [https://abdlrrahman.github.io/bidpilot/](https://abdlrrahman.github.io/bidpilot/)  
[![CI Status](https://github.com/Abdlrrahman/bidpilot/actions/workflows/ci.yml/badge.svg)](https://github.com/Abdlrrahman/bidpilot/actions/workflows/ci.yml)
[![Pages Deployment](https://github.com/Abdlrrahman/bidpilot/actions/workflows/deploy.yml/badge.svg)](https://github.com/Abdlrrahman/bidpilot/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WCAG 2.2 AA](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-emerald.svg)](docs/case-study.md)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%205.7-blue.svg)](tsconfig.json)

---

## Executive Overview

**BidPilot** is a bilingual procurement decision intelligence application that helps enterprise suppliers convert complex Request for Quotation (RFQ) and tender packages into structured compliance tracking, multi-scenario landed cost economics, risk exposure analysis, and an explainable Go/No-Go decision engine.

Built for suppliers responding to institutional donors, multilateral development agencies (e.g. UNDP-style tenders), and public sector entities, BidPilot eliminates missed mandatory clauses, calculates statistical Expected Bid Value ($EV$), and prevents expensive bid pursuit on disqualified tenders.

> ### ⚠️ Demonstration & Privacy Disclaimer
> **This public application runs 100% client-side with deterministic synthetic procurement data.**  
> No confidential donor documents, proprietary client pricing, supplier bank guarantees, or actual contract records are uploaded or parsed. All projected cost savings, readiness indices, and workflow efficiency improvements are **modeled outcomes** for demonstration purposes only.

---

## Core Features & Workflow

| Capability | Engineering & Analytics Implementation | Value Delivered |
| :--- | :--- | :--- |
| **Bilingual Control Tower** | Instant toggle between English (LTR) and Arabic (RTL) with localized terminology and typography (Inter & Cairo). | Seamless collaboration between international bidding leads and local regional operations teams. |
| **Interactive Compliance Matrix** | Live filterable table of 26 criteria across 6 domains (Technical, Administrative, Commercial, Delivery, Warranty, Submission). | Immediate real-time recalculation of weighted coverage and mandatory gap counts. |
| **Hard Mandatory Blocker Rule** | Scoring engine enforces a hard blocker: if even 1 mandatory clause has a `Gap`, the decision forces **NO-GO** regardless of aggregate score. | Eliminates immediate formal disqualification at technical opening sessions. |
| **3-Scenario Pricing Waterfall** | BOQ calculator comparing **Conservative**, **Target**, and **Competitive** models with landed cost decomposition and buyer headroom. | Protects gross margins while ensuring proposed prices remain within donor budget ceilings. |
| **Expected Bid Value ($EV$)** | Pure mathematical formulation: $EV = (P_{	ext{win}} 	imes 	ext{Gross Profit}) - 	ext{Pursuit Cost}$. | Prevents negative expected ROI pursuit on low-probability high-cost tenders. |
| **Critical Path & Evidence Register** | Milestone schedule tracking clarification cutoffs and digital encryption along with verified document registry. | Complete audit trail ensuring timely bank bond issuance and two-envelope submission compliance. |
| **One-Page Executive Brief** | Print-optimized executive decision package and JSON/CSV import/export utilities. | Enables leadership review in under 3 minutes with full offline portability. |

---

## The Decision-Support Value Model

BidPilot is built on transparent, deterministic mathematical formulas rather than opaque AI claims:

1. **Weighted Compliance Coverage:**
   $$	ext{Coverage} = left( rac{sum w_i 	imes s_i}{sum w_i} ight) 	imes 100%$$
   where $s_i in {1.0 	ext{ (Comply)}, 0.5 	ext{ (Partial)}, 0.0 	ext{ (Gap)}, 0.0 	ext{ (Not Assessed)}}$.

2. **Hard Blocker Rule:**
   $$	ext{Decision} = 	ext{NO-GO} quad 	ext{if} quad 	ext{Mandatory Gaps} > 0 quad lor quad 	ext{Gross Margin} < 8.0%$$

3. **Expected Bid Value ($EV$):**
   $$EV = (P_{	ext{win}} 	imes 	ext{Gross Profit}) - 	ext{Pursuit Cost}$$

4. **Price Headroom:**
   $$	ext{Headroom} = 	ext{Buyer Budget Benchmark} - 	ext{Proposed Selling Price}$$

5. **Modeled Workflow Impact (Illustrative Baseline vs Assisted):**
   - **Preparation Time:** Modeled reduction from 18.0 hours manual baseline to 7.0 hours assisted control tower flow.
   - **Missed Mandatory Clauses:** 3 unforced omissions on baseline manual checklists $	o$ 0 missed in structured matrix.
   - **Executive Decision Cycle:** 6 review handoffs $	o$ 3 coordinated gate sessions.

---

## Repository Architecture & Technology Stack

- **Framework:** React 18 with TypeScript 5.7 (Strict Mode)
- **Build Tool:** Vite 6 with configurable base path for static GitHub Pages hosting
- **Styling & Motion:** Tailwind CSS 3.4 with custom design engineering tokens following Emil Kowalski's UI polish principles (transitions $<250	ext{ms}$, active scaling, reduced-motion support)
- **Icons & Typography:** Lucide React, Google Fonts (Inter + Cairo)
- **Test Suite:** Vitest 3 with 100% calculation engine unit test coverage
- **State & Storage:** React Context with automated `localStorage` persistence and a "Reset Demo" button
- **CI/CD:** Automated GitHub Actions workflows for linting, type-checking, Vitest tests, and official Pages deployment

```
bidpilot/
├── .github/
│   └── workflows/          # CI and GitHub Pages deployment workflows
├── docs/
│   ├── architecture.md     # Mermaid diagrams and future production backend design
│   ├── case-study.md       # Full procurement engineering case study
│   ├── data-dictionary.md  # Detailed schema of all synthetic data models
│   ├── demo-script.md      # 90-second structured walkthrough script
│   └── methodology.md      # Mathematical formulations and scoring rubrics
├── src/
│   ├── components/         # Modular layout, common UI, and view components
│   ├── context/            # Reactive AppContext with persistence
│   ├── data/               # Seeded deterministic synthetic procurement datasets
│   ├── engine/             # Pure TypeScript mathematical calculation functions
│   ├── i18n/               # Complete English and Arabic dictionaries
│   └── types/              # Domain TypeScript interfaces and types
└── tests/                  # Vitest unit test suite covering scoring engine
```

---

## Local Development Setup

### Prerequisites
- Node.js `>= 20.0.0`
- npm `>= 10.0.0`

### Installation & Run
```bash
# 1. Clone the repository
git clone https://github.com/Abdlrrahman/bidpilot.git
cd bidpilot

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run unit tests
npm run test

# 5. Build for production
npm run build
```

---

## Accessibility (WCAG 2.2 AA)

BidPilot is engineered for high accessibility:
- Semantic HTML tables, headings, and dialogs.
- Full keyboard navigation with distinct high-contrast focus rings (`focus-visible:ring-2`).
- Bidirectional styling (`dir="ltr"` and `dir="rtl"`) with correct visual alignment and icon handling.
- Screen-reader accessible ARIA labels and color contrast ratios exceeding 4.5:1.
- Complete support for `prefers-reduced-motion`.

---

## Documentation Suite

- 📖 [Case Study](docs/case-study.md): Context, technical decisions, and modeled outcomes.
- 📐 [Methodology & Mathematics](docs/methodology.md): Detailed mathematical definitions.
- 🗂️ [Data Dictionary](docs/data-dictionary.md): Data schemas and synthetic data classification.
- 🏗️ [Architecture & Systems](docs/architecture.md): Component diagrams and production roadmap.
- ⏱️ [90-Second Demo Script](docs/demo-script.md): Step-by-step evaluator walkthrough.

---

## License

This project is licensed under the [MIT License](LICENSE).
