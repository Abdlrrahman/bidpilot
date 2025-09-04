import { Opportunity, Requirement, PricingScenario, PricingItem, Milestone, EvidenceDocument } from '../types/procurement';
import techReqs from './techReqs.json';
import admComReqs from './admComReqs.json';
import delWarSubReqs from './delWarSubReqs.json';
import pricingData from './pricingData.json';
import milestonesData from './milestonesData.json';
import evidenceData from './evidenceData.json';

export const RFP_PRESETS: Opportunity[] = [
  {
    id: 'opp-2026-libya-it-042',
    rfqNumber: 'RFQ-2026-UNDP-LY-042',
    title: {
      en: 'Supply, Configuration & Delivery of Digital Infrastructure for Municipal IT Centers',
      ar: 'توريد وتهيئة وتسليم البنية التحتية الرقمية لمراكز تقنية المعلومات البلدية'
    },
    buyer: {
      en: 'Municipal Modernization Taskforce (UNDP Supported)',
      ar: 'فريق تحديث الإدارة البلدية (بدعم برنامج الأمم المتحدة الإنمائي)'
    },
    buyerType: {
      en: 'Multilateral Agency / Institutional Donor',
      ar: 'وكالة متعددة الأطراف / مانح مؤسسي'
    },
    city: {
      en: 'Tripoli & Benghazi (Multi-hub deployment)',
      ar: 'طرابلس وبنغازي (تسليم متعدد المراكز)'
    },
    country: {
      en: 'Libya',
      ar: 'ليبيا'
    },
    currency: 'USD',
    budgetEstimate: 485000,
    pursuitCost: 14500,
    pWin: 0.65,
    deadline: '2026-09-18T16:00:00Z',
    owner: 'Abdlrrahman Shibani',
    stage: 'Tender Preparation & Go/No-Go Review',
    activeScenario: 'target' as PricingScenario,
    taxRate: 0.05,
    requirements: [...techReqs, ...admComReqs, ...delWarSubReqs] as Requirement[],
    pricingItems: pricingData as Record<PricingScenario, PricingItem[]>,
    milestones: milestonesData as Milestone[],
    evidence: evidenceData as EvidenceDocument[]
  },
  {
    id: 'opp-2026-solar-microgrid-108',
    rfqNumber: 'RFQ-2026-UNICEF-LY-108',
    title: {
      en: 'Hybrid Solar Photovoltaic & Battery Backup Microgrids for 12 Regional Primary Healthcare Centers',
      ar: 'محطات طاقة شمسية هجينة وبطاريات احتياطية لـ 12 مركز رعاية صحية أولية'
    },
    buyer: {
      en: 'UNICEF Regional Emergency Healthcare Program',
      ar: 'برنامج اليونيسف الإقليمي للرعاية الصحية الطارئة'
    },
    buyerType: {
      en: 'United Nations Specialized Agency',
      ar: 'وكالة متخصصة تابعة للأمم المتحدة'
    },
    city: {
      en: 'Sabha, Kufra, Ghat & Murzuq',
      ar: 'سبها، الكفرة، غات ومرزق'
    },
    country: {
      en: 'Libya',
      ar: 'ليبيا'
    },
    currency: 'USD',
    budgetEstimate: 820000,
    pursuitCost: 22000,
    pWin: 0.72,
    deadline: '2026-10-15T16:00:00Z',
    owner: 'Abdlrrahman Shibani',
    stage: 'Technical Envelope Clarifications',
    activeScenario: 'target' as PricingScenario,
    taxRate: 0.05,
    requirements: [
      ...techReqs.map(r => ({ ...r, id: 'solar-' + r.id })),
      ...admComReqs.map(r => ({ ...r, id: 'solar-' + r.id }))
    ] as Requirement[],
    pricingItems: {
      conservative: [
        { id: 'sol-01', itemCode: 'PV-550W', description: { en: 'Tier-1 550W Monocrystalline PV Panels (120 units)', ar: 'ألواح شمسية 550 واط أحادية البلورة' }, category: 'Equipment', quantity: 120, unit: 'pcs', unitCost: 180, logisticsPerUnit: 25, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.28, discountRate: 0 },
        { id: 'sol-02', itemCode: 'BAT-LFP-15K', description: { en: '15kWh LiFePO4 Lithium Battery Storage Systems', ar: 'منظومات بطاريات ليثيوم 15 ك.و.س' }, category: 'Equipment', quantity: 24, unit: 'units', unitCost: 4200, logisticsPerUnit: 350, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.25, discountRate: 0 },
        { id: 'sol-03', itemCode: 'INV-HYB-10K', description: { en: '10kW Hybrid MPPT Inverters with Remote Telemetry', ar: 'محولات هجينة 10 ك.و مع مراقبة عن بعد' }, category: 'Equipment', quantity: 12, unit: 'units', unitCost: 2800, logisticsPerUnit: 120, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.25, discountRate: 0 },
        { id: 'sol-04', itemCode: 'SRV-INST-CIV', description: { en: 'Turnkey Civil Foundation & Rooftop Mounting Works', ar: 'أعمال التركيب الإنشائي والقواعد المدنية' }, category: 'Services', quantity: 12, unit: 'sites', unitCost: 6500, logisticsPerUnit: 400, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.30, discountRate: 0 }
      ],
      target: [
        { id: 'sol-01', itemCode: 'PV-550W', description: { en: 'Tier-1 550W Monocrystalline PV Panels (120 units)', ar: 'ألواح شمسية 550 واط أحادية البلورة' }, category: 'Equipment', quantity: 120, unit: 'pcs', unitCost: 165, logisticsPerUnit: 22, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.22, discountRate: 0 },
        { id: 'sol-02', itemCode: 'BAT-LFP-15K', description: { en: '15kWh LiFePO4 Lithium Battery Storage Systems', ar: 'منظومات بطاريات ليثيوم 15 ك.و.س' }, category: 'Equipment', quantity: 24, unit: 'units', unitCost: 3900, logisticsPerUnit: 300, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.20, discountRate: 0 },
        { id: 'sol-03', itemCode: 'INV-HYB-10K', description: { en: '10kW Hybrid MPPT Inverters with Remote Telemetry', ar: 'محولات هجينة 10 ك.و مع مراقبة عن بعد' }, category: 'Equipment', quantity: 12, unit: 'units', unitCost: 2600, logisticsPerUnit: 100, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.20, discountRate: 0 },
        { id: 'sol-04', itemCode: 'SRV-INST-CIV', description: { en: 'Turnkey Civil Foundation & Rooftop Mounting Works', ar: 'أعمال التركيب الإنشائي والقواعد المدنية' }, category: 'Services', quantity: 12, unit: 'sites', unitCost: 5800, logisticsPerUnit: 350, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.25, discountRate: 0 }
      ],
      competitive: [
        { id: 'sol-01', itemCode: 'PV-550W', description: { en: 'Tier-1 550W Monocrystalline PV Panels (120 units)', ar: 'ألواح شمسية 550 واط أحادية البلورة' }, category: 'Equipment', quantity: 120, unit: 'pcs', unitCost: 155, logisticsPerUnit: 18, contingencyRate: 0.04, overheadRate: 0.06, markupRate: 0.16, discountRate: 0 },
        { id: 'sol-02', itemCode: 'BAT-LFP-15K', description: { en: '15kWh LiFePO4 Lithium Battery Storage Systems', ar: 'منظومات بطاريات ليثيوم 15 ك.و.س' }, category: 'Equipment', quantity: 24, unit: 'units', unitCost: 3650, logisticsPerUnit: 260, contingencyRate: 0.04, overheadRate: 0.06, markupRate: 0.15, discountRate: 0 },
        { id: 'sol-03', itemCode: 'INV-HYB-10K', description: { en: '10kW Hybrid MPPT Inverters with Remote Telemetry', ar: 'محولات هجينة 10 ك.و مع مراقبة عن بعد' }, category: 'Equipment', quantity: 12, unit: 'units', unitCost: 2450, logisticsPerUnit: 80, contingencyRate: 0.04, overheadRate: 0.06, markupRate: 0.15, discountRate: 0 },
        { id: 'sol-04', itemCode: 'SRV-INST-CIV', description: { en: 'Turnkey Civil Foundation & Rooftop Mounting Works', ar: 'أعمال التركيب الإنشائي والقواعد المدنية' }, category: 'Services', quantity: 12, unit: 'sites', unitCost: 5200, logisticsPerUnit: 300, contingencyRate: 0.04, overheadRate: 0.06, markupRate: 0.18, discountRate: 0 }
      ]
    },
    milestones: milestonesData as Milestone[],
    evidence: evidenceData as EvidenceDocument[]
  },
  {
    id: 'opp-2026-wfp-coldchain-055',
    rfqNumber: 'RFQ-2026-WFP-LOG-055',
    title: {
      en: 'Cold-Chain Mobile Telemetry & Temperature-Controlled Pharmaceutical Warehousing Logistics',
      ar: 'اللوجستيات المتنقلة للمستودعات المبردة وسلسلة التبريد الدوائي'
    },
    buyer: {
      en: 'World Food Programme (WFP) Logistics Cluster',
      ar: 'برنامج الأغذية العالمي (شعبة اللوجستيات)'
    },
    buyerType: {
      en: 'International Humanitarian Logistics Agency',
      ar: 'وكالة دولية للوجستيات العمل الإنساني'
    },
    city: {
      en: 'Misrata Free Zone & Sirte Corridor',
      ar: 'المنطقة الحرة بمصراتة وممر سرت'
    },
    country: {
      en: 'Libya',
      ar: 'ليبيا'
    },
    currency: 'USD',
    budgetEstimate: 640000,
    pursuitCost: 18500,
    pWin: 0.58,
    deadline: '2026-11-01T16:00:00Z',
    owner: 'Abdlrrahman Shibani',
    stage: 'Commercial Envelope Modeling',
    activeScenario: 'target' as PricingScenario,
    taxRate: 0.05,
    requirements: [
      ...techReqs.map(r => ({ ...r, id: 'cold-' + r.id })),
      ...delWarSubReqs.map(r => ({ ...r, id: 'cold-' + r.id }))
    ] as Requirement[],
    pricingItems: {
      conservative: [
        { id: 'cld-01', itemCode: 'REEFER-20FT', description: { en: '20ft Mobile Solar-Powered Cold Storage Reefers (-25C to +8C)', ar: 'حاويات مبردة 20 قدم بالطاقة الشمسية' }, category: 'Equipment', quantity: 6, unit: 'units', unitCost: 32000, logisticsPerUnit: 1800, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.26, discountRate: 0 },
        { id: 'cld-02', itemCode: 'IOT-LOGGER', description: { en: 'Cellular/Satellite Dual IoT Temperature Loggers', ar: 'أجهزة تسجيل حرارة لاسلكية متصلة بالأقمار' }, category: 'Equipment', quantity: 180, unit: 'pcs', unitCost: 140, logisticsPerUnit: 15, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.28, discountRate: 0 },
        { id: 'cld-03', itemCode: 'SRV-LOG-FLEET', description: { en: 'Refrigerated Transport Fleet Operations (12 Months)', ar: 'تشغيل أسطول النقل المبرد لمدة 12 شهراً' }, category: 'Services', quantity: 12, unit: 'months', unitCost: 16500, logisticsPerUnit: 0, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.24, discountRate: 0 }
      ],
      target: [
        { id: 'cld-01', itemCode: 'REEFER-20FT', description: { en: '20ft Mobile Solar-Powered Cold Storage Reefers (-25C to +8C)', ar: 'حاويات مبردة 20 قدم بالطاقة الشمسية' }, category: 'Equipment', quantity: 6, unit: 'units', unitCost: 29500, logisticsPerUnit: 1600, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.22, discountRate: 0 },
        { id: 'cld-02', itemCode: 'IOT-LOGGER', description: { en: 'Cellular/Satellite Dual IoT Temperature Loggers', ar: 'أجهزة تسجيل حرارة لاسلكية متصلة بالأقمار' }, category: 'Equipment', quantity: 180, unit: 'pcs', unitCost: 125, logisticsPerUnit: 12, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.22, discountRate: 0 },
        { id: 'cld-03', itemCode: 'SRV-LOG-FLEET', description: { en: 'Refrigerated Transport Fleet Operations (12 Months)', ar: 'تشغيل أسطول النقل المبرد لمدة 12 شهراً' }, category: 'Services', quantity: 12, unit: 'months', unitCost: 14800, logisticsPerUnit: 0, contingencyRate: 0.05, overheadRate: 0.08, markupRate: 0.20, discountRate: 0 }
      ],
      competitive: [
        { id: 'cld-01', itemCode: 'REEFER-20FT', description: { en: '20ft Mobile Solar-Powered Cold Storage Reefers (-25C to +8C)', ar: 'حاويات مبردة 20 قدم بالطاقة الشمسية' }, category: 'Equipment', quantity: 6, unit: 'units', unitCost: 27500, logisticsPerUnit: 1400, contingencyRate: 0.04, overheadRate: 0.06, markupRate: 0.16, discountRate: 0 },
        { id: 'cld-02', itemCode: 'IOT-LOGGER', description: { en: 'Cellular/Satellite Dual IoT Temperature Loggers', ar: 'أجهزة تسجيل حرارة لاسلكية متصلة بالأقمار' }, category: 'Equipment', quantity: 180, unit: 'pcs', unitCost: 110, logisticsPerUnit: 10, contingencyRate: 0.04, overheadRate: 0.06, markupRate: 0.18, discountRate: 0 },
        { id: 'cld-03', itemCode: 'SRV-LOG-FLEET', description: { en: 'Refrigerated Transport Fleet Operations (12 Months)', ar: 'تشغيل أسطول النقل المبرد لمدة 12 شهراً' }, category: 'Services', quantity: 12, unit: 'months', unitCost: 13500, logisticsPerUnit: 0, contingencyRate: 0.04, overheadRate: 0.06, markupRate: 0.16, discountRate: 0 }
      ]
    },
    milestones: milestonesData as Milestone[],
    evidence: evidenceData as EvidenceDocument[]
  }
];

export const initialOpportunity: Opportunity = RFP_PRESETS[0];
