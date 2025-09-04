# Architecture & Systems Design

## 1. High-Level Static Architecture

BidPilot is engineered as a static client-side application designed to deploy seamlessly to GitHub Pages. All state transformations and calculations execute in the user's browser.

```mermaid
graph TD
    subgraph BrowserClient["Client Browser Application"]
        App["App Component Shell"] --> Provider["AppProvider (React Context)"]
        Provider --> Store["State Manager (LocalStorage & Memory)"]
        
        Store --> Engine["Pure Calculation Engine (TypeScript)"]
        Engine --> CompCalc["calculateComplianceMetrics()"]
        Engine --> PriceCalc["calculatePricingSummary()"]
        Engine --> ImpactCalc["calculateModeledImpactMetrics()"]
        Engine --> DecisionCalc["evaluateGoNoGo()"]
        
        Provider --> Views["Interactive Views"]
        Views --> Overview["Overview Dashboard"]
        Views --> Requirements["Compliance Matrix"]
        Views --> Pricing["Pricing & Waterfall"]
        Views --> GoNoGo["Go/No-Go Decision Gate"]
        Views --> Timeline["Milestones Timeline"]
        Views --> Evidence["Evidence Registry"]
        Views --> Summary["Executive Brief (Print View)"]
        Views --> Methodology["Mathematical Methodology"]
        
        Provider --> I18n["Bilingual i18n Engine (EN / AR RTL)"]
    end
    
    subgraph Storage["Browser Local Storage"]
        Store <--> LS["localStorage ('bidpilot_opportunity_v1')"]
    end
```

---

## 2. Component Hierarchy

```
src/
├── main.tsx                # React DOM root entry
├── App.tsx                 # App layout shell with responsive container
├── context/
│   └── AppContext.tsx      # Central reactive store & localStorage synchronizer
├── engine/
│   └── scoring.ts          # Pure mathematical calculation functions
├── data/
│   └── seedOpportunity.ts  # Seeded procurement opportunity dataset
├── i18n/
│   └── translations.ts     # Centralized English and Arabic dictionaries
└── components/
    ├── layout/
    │   ├── Header.tsx      # Top bar, demo disclaimer, scenario picker, reset
    │   └── Navigation.tsx  # Tab router with live notification badges
    ├── common/
    │   ├── MetricCard.tsx  # Responsive analytics metric card
    │   └── Badge.tsx       # Color-coded status badge
    └── views/
        ├── OverviewView.tsx
        ├── RequirementsView.tsx
        ├── PricingView.tsx
        ├── GoNoGoView.tsx
        ├── TimelineView.tsx
        ├── EvidenceView.tsx
        ├── ExecutiveSummaryView.tsx
        └── MethodologyView.tsx
```

---

## 3. Future Production Backend Architecture (Roadmap)

In a future production enterprise deployment, BidPilot can be integrated with a secure cloud backend:

```mermaid
graph LR
    Client["BidPilot Web App"] <--> API["FastAPI / Node Backend"]
    API <--> Auth["Enterprise SSO / SAML"]
    API <--> DB[("PostgreSQL / Supabase (Encrypted DB)")]
    API <--> Vault["Document Vault (S3 / KMS Encrypted)"]
    API <--> OCR["Private OCR / Tender Parser Engine"]
```
