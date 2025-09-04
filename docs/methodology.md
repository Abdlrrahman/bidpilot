# Mathematical Methodology & Scoring Architecture

## 1. Compliance Scoring Model

The Compliance Scoring Engine calculates weighted adherence across all evaluation domains (Technical, Administrative, Commercial, Delivery, Warranty, Submission).

### State Multipliers
Each requirement is evaluated into one of four mutually exclusive states:
$$\mu(\text{state}) = \begin{cases}
1.0 & \text{if state} = \text{Comply (Full compliance)} \\
0.5 & \text{if state} = \text{Partial (Compliant with minor deviations)} \\
0.0 & \text{if state} = \text{Gap (Non-compliant or missing)} \\
0.0 & \text{if state} = \text{Not Assessed}
\end{cases}$$

### Weighted Coverage Formula
Given a set of requirements $R$ where each requirement $r_i$ has a weight $w_i \in [1, 5]$:
$$\text{Weighted Compliance Coverage} = \left( \frac{\sum_{i \in R} w_i \cdot \mu(r_i.\text{state})}{\sum_{i \in R} w_i} \right) \times 100\%$$

### Category Breakdown
For each category $c \in \{\text{technical, administrative, commercial, delivery, warranty, submission}\}$:
$$\text{Category Coverage}_c = \left( \frac{\sum_{i \in R_c} w_i \cdot \mu(r_i.\text{state})}{\sum_{i \in R_c} w_i} \right) \times 100\%$$

---

## 2. Landed Cost Economics & Margin Waterfall

For each Bill of Quantities line item $j$:
1. **Direct Cost:** $C_{\text{direct}, j} = Q_j \cdot U_{\text{cost}, j}$
2. **Logistics & Clearing:** $C_{\text{logistics}, j} = Q_j \cdot U_{\text{logistics}, j}$
3. **Subtotal Base:** $C_{\text{sub}, j} = C_{\text{direct}, j} + C_{\text{logistics}, j}$
4. **Contingency Reserve:** $C_{\text{cont}, j} = C_{\text{sub}, j} \cdot r_{\text{cont}, j}$
5. **Overhead Allocation:** $C_{\text{ovh}, j} = (C_{\text{sub}, j} + C_{\text{cont}, j}) \cdot r_{\text{ovh}, j}$
6. **Total Landed Cost Base:** $C_{\text{base}, j} = C_{\text{sub}, j} + C_{\text{cont}, j} + C_{\text{ovh}, j}$
7. **Gross Revenue:** $R_j = C_{\text{base}, j} \cdot (1 + r_{\text{markup}, j}) \cdot (1 - r_{\text{discount}, j})$

### Aggregate Totals
- **Total Revenue:** $R_{\text{total}} = \sum R_j$
- **Total Landed Cost Base:** $C_{\text{base, total}} = \sum C_{\text{base}, j}$
- **Gross Profit Margin:** $\text{GP} = R_{\text{total}} - C_{\text{base, total}}$
- **Gross Margin Percentage:** $\text{GM}\% = \left( \frac{\text{GP}}{R_{\text{total}}} \right) \times 100\%$
- **Buyer Price Headroom:** $\text{Headroom} = B_{\text{benchmark}} - R_{\text{total}}$

---

## 3. Statistical Expected Bid Value ($EV$)

Pursuing complex tenders carries tangible overhead costs (engineering hours, legal notarization, tender bond issuance fees). BidPilot evaluates whether the statistical expected value justifies pursuit:
$$EV = (P_{\text{win}} \cdot \text{GP}) - C_{\text{pursuit}}$$

Where:
- $P_{\text{win}} \in [0.0, 1.0]$ is the estimated win probability.
- $\text{GP}$ is the total projected gross profit under the active scenario.
- $C_{\text{pursuit}}$ is the modeled pursuit investment (e.g. $14,500).

---

## 4. Multi-Factor Go/No-Go Decision Engine

The decision engine synthesizes 6 weighted dimensions into a composite score:

| Dimension | Weight | Metric Source | Passing Threshold |
| :--- | :--- | :--- | :--- |
| **1. Specification & Legal Compliance** | 30% | Weighted coverage & mandatory gap penalty | Score $\ge 85$ |
| **2. Supply Chain & Delivery Feasibility** | 20% | Delivery domain coverage & lead-time buffer | Score $\ge 80$ |
| **3. Financial Profitability & Headroom** | 20% | Gross margin % and budget headroom | Score $\ge 75$ |
| **4. Strategic Alignment** | 10% | Municipal & institutional track record | Score $\ge 70$ |
| **5. Evidence & Dossier Completeness** | 10% | Verified document registry ratio | Score $\ge 80$ |
| **6. Pursuit ROI & Expected Return** | 10% | $EV / C_{\text{pursuit}}$ multiple | Score $\ge 75$ |

### Hard Blocker Rules (Overrides)
Regardless of composite score:
$$\text{Recommendation} = \text{NO-GO} \quad \text{if} \quad \begin{cases}
\text{Mandatory Gaps} > 0 \\
\text{or} \\
\text{Gross Margin } < 8.0\%
\end{cases}$$
