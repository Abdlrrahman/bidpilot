# Data Dictionary & Schema Specification

## 1. Requirement Entity
| Field Name | Type | Description | Allowed Values / Units | Synthetic Source |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | Unique requirement identifier | e.g. `req-tech-01` | Synthetic |
| `ref` | String | Document reference code | e.g. `TECH-01`, `ADM-02` | Synthetic |
| `section` | String | Tender document clause locator | e.g. `Section 3.1.1` | Synthetic |
| `title` | LocalizedString | Bilingual requirement title | English & Arabic text | Synthetic |
| `description` | LocalizedString | Technical specification text | English & Arabic text | Synthetic |
| `category` | Enum | Procurement domain | `technical`, `administrative`, `commercial`, `delivery`, `warranty`, `submission` | Synthetic |
| `isMandatory` | Boolean | Flag indicating mandatory clause | `true` or `false` | Synthetic |
| `weight` | Integer | Evaluation weight | 1 to 5 | Synthetic |
| `state` | Enum | Active compliance state | `comply`, `partial`, `gap`, `not_assessed` | User-editable |
| `proposedResponse` | LocalizedString | Proposed supplier response | English & Arabic text | Synthetic |
| `evidenceId` | String (optional) | Foreign key to EvidenceDocument | e.g. `doc-datasheet-srv` | Synthetic |
| `owner` | String | Responsible team member | e.g. `Lead Systems Architect` | Synthetic |
| `reviewerNotes` | String (optional) | Auditor and verification comments | Free text | User-editable |

---

## 2. Pricing Item Entity
| Field Name | Type | Description | Allowed Values / Units | Synthetic Source |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | Unique line item ID | e.g. `item-01` | Synthetic |
| `itemCode` | String | Supplier SKU or item code | e.g. `SRV-R750-2U` | Synthetic |
| `description` | LocalizedString | Equipment / service description | English & Arabic text | Synthetic |
| `category` | String | Item category | Hardware, Networking, Services, etc. | Synthetic |
| `quantity` | Integer | Number of units | Positive integer | User-editable |
| `unit` | String | Unit of measure | `Units`, `Lot`, `Cohorts` | Synthetic |
| `unitCost` | Number | Unit direct purchase cost | USD ($) | User-editable |
| `logisticsPerUnit`| Number | Freight & port clearing cost | USD ($) | User-editable |
| `contingencyRate` | Number | Contingency buffer rate | Percentage (e.g. 0.04 = 4%) | Synthetic |
| `overheadRate` | Number | Operational overhead rate | Percentage (e.g. 0.07 = 7%) | Synthetic |
| `markupRate` | Number | Gross profit markup rate | Percentage (e.g. 0.16 = 16%) | Synthetic |
| `discountRate` | Number | Applied discount rate | Percentage (e.g. 0.0) | Synthetic |

---

## 3. Evidence Document Entity
| Field Name | Type | Description | Allowed Values / Units | Synthetic Source |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | Unique document ID | e.g. `doc-legal-registry` | Synthetic |
| `docCode` | String | Filing reference code | e.g. `DOC-LEG-01` | Synthetic |
| `title` | LocalizedString | Document description | English & Arabic text | Synthetic |
| `filename` | String | Synthetic file name | e.g. `SYNTH_REGISTRY_2026.pdf` | Synthetic |
| `category` | String | Document category | Legal, Technical, Financial, etc. | Synthetic |
| `status` | Enum | Verification state | `verified`, `draft`, `missing`, `expired` | Synthetic |
| `lastUpdated` | String | ISO date of last verification | YYYY-MM-DD | Synthetic |
| `validUntil` | String (optional) | ISO date of document expiry | YYYY-MM-DD | Synthetic |
| `sizeKb` | Integer | Simulated document size | Kilobytes | Synthetic |
