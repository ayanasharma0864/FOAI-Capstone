# System Design Document

## AI Personal Finance Tracker & Advisor

---

## 1. Expense Categories & Subcategories

The system uses the following predefined categories. Each expense logged via Google Form is classified into one of these by ChatGPT/Gemini.

| # | Category | Subcategories | Budget Threshold |
|---|----------|--------------|-----------------|
| 1 | **Food** | Groceries, Dining Out, Zomato/Swiggy, Snacks, Coffee/Tea | ≤ 35% of total |
| 2 | **Transport** | Fuel, Auto/Cab (Ola/Uber), Metro/Bus, Parking | ≤ 15% of total |
| 3 | **Entertainment** | Movies, Streaming (Netflix/Spotify), Gaming, Outings | ≤ 10% of total |
| 4 | **Utilities** | Electricity, Water, Internet, Mobile Recharge, DTH | ≤ 10% of total |
| 5 | **Education** | Books, Courses, Online Subscriptions, Exam Fees | ≤ 10% of total |
| 6 | **Shopping** | Clothing, Footwear, Electronics, Accessories | ≤ 10% of total |
| 7 | **Health** | Medicines, Doctor Visit, Gym/Fitness, Insurance | ≤ 5% of total |
| 8 | **Personal Care** | Salon, Grooming, Cosmetics | ≤ 5% of total |
| 9 | **Rent/Housing** | Rent, Maintenance, Repairs | Variable |
| 10 | **Miscellaneous** | Gifts, Donations, Uncategorized | ≤ 5% of total |

---

## 2. Budget Thresholds & Alert Rules

### Category-Level Alerts
When spending in any category **exceeds its predefined percentage threshold**, the system highlights it with conditional formatting in Google Sheets.

| Rule | Trigger | Alert Color |
|------|---------|-------------|
| Category Overspend | Category % > threshold | 🔴 Red background |
| Near Limit | Category % > (threshold - 5%) | 🟡 Yellow background |
| Within Budget | Category % ≤ (threshold - 5%) | 🟢 Green background |

### Monthly Budget Alert
- If **total monthly spending exceeds ₹15,000** (configurable), trigger a budget warning
- The ₹15,000 default is based on average Indian student monthly spending

### Weekly Spike Detection
- If spending in the **current week is > 20% higher** than the previous week → flag as a spike
- Formula: `(This Week Total - Last Week Total) / Last Week Total > 0.20`

---

## 3. Savings Target Logic

### Monthly Savings Goal
- **Target**: Save 10–15% of monthly income/allowance
- **Default assumption**: Monthly budget = ₹15,000
- **Savings target**: ₹1,500 – ₹2,250 per month

### How Savings Recommendations Work

Budget recommendations are based on:
- Historical monthly average spending
- Category-wise spending proportion
- Defined saving target (10–15% of monthly income)

**Logic**: If spending in a category exceeds its defined limit, the system suggests reduction strategies.

### Example Rules:

| Condition | Recommendation |
|-----------|---------------|
| Food > 40% of total | "Reduce food delivery frequency to 2x/week. Potential savings: ~₹2,000/month" |
| Entertainment > 15% of total | "Review streaming subscriptions. Consider sharing plans. Potential savings: ~₹500/month" |
| Transport > 20% of total | "Use public transport 3x/week instead of cabs. Potential savings: ~₹1,500/month" |
| Shopping > 15% of total | "Implement a 48-hour wait rule before non-essential purchases" |
| Weekly spike > 20% | "Your spending spiked this week. Review recent transactions for unnecessary expenses" |

> **Important**: These are rule-based estimations, NOT statistical probability forecasting.

---

## 4. Spending Pattern Detection (Rule-Based)

Google Sheets calculates the following metrics automatically:

### Metrics Calculated:
1. **Total monthly spending** — `=SUMIFS(Amount, Month, CurrentMonth)`
2. **Category-wise spending percentage** — `=SUMIF(Category, "Food", Amount) / TotalSpending * 100`
3. **Weekly spending distribution** — Sum of amounts grouped by week number
4. **Last 7-day vs previous 7-day comparison** — Detect spending acceleration

### Pattern Identification Rules:
| Pattern | Detection Rule |
|---------|---------------|
| Category overspending | Category % > predefined threshold (e.g., Food > 35%) |
| Weekly spike | Week-over-week increase > 20% |
| Consistent overspending | Same category exceeds threshold for 2+ consecutive weeks |
| Low spending alert | Total monthly spending < 50% of budget by mid-month |

---

## 5. Knowledge Mapping for Financial Advice

A predefined mapping links expense categories to general financial advice. ChatGPT uses this mapping to generate personalized suggestions.

| Category | Financial Advice Domain |
|----------|----------------------|
| Food | Meal planning tips, reducing delivery frequency, cooking at home |
| Entertainment | Subscription review, free alternatives, sharing plans |
| Transport | Public transport optimization, carpooling, walking for short distances |
| Shopping | 48-hour rule, wish-list approach, seasonal sale shopping |
| Utilities | Energy-saving tips, comparing mobile/internet plans |
| Health | Preventive care, insurance optimization, home workouts |

---

## 6. Google Sheets Structure

The Google Sheet has the following tabs:

### Tab 1: `Raw Data` (Form Responses)
| Column | Description | Source |
|--------|-------------|--------|
| A: Timestamp | Auto-generated | Google Forms |
| B: Amount (₹) | Expense amount | User input |
| C: Date | Expense date | User input |
| D: Description | What was the expense | User input |
| E: Category (Auto) | AI-assigned category | ChatGPT/Gemini |
| F: Category (Override) | Manual correction | User input (optional) |
| G: Final Category | =IF(F2<>"", F2, E2) | Formula |

### Tab 2: `Categories`
- Master list of all categories and subcategories
- Budget threshold percentages
- Used as data validation source for dropdowns

### Tab 3: `Monthly Summary`
| Metric | Formula |
|--------|---------|
| Total Spending | `=SUM(RawData!B:B)` |
| Food Total | `=SUMIF(RawData!G:G, "Food", RawData!B:B)` |
| Food % | `=Food Total / Total Spending * 100` |
| Over Budget? | `=IF(Food% > 35, "⚠️ OVER", "✅ OK")` |
| ... | (repeated for each category) |

### Tab 4: `Dashboard` (Charts)
- Pie chart: Category distribution
- Line chart: Monthly spending trend
- Bar chart: Weekly comparison
- Budget utilization indicators (Milestone 3)

### Tab 5: `Weekly Analysis`
| Week | Total | vs Previous Week | Spike? |
|------|-------|-------------------|--------|
| Week 1 | ₹3,200 | — | — |
| Week 2 | ₹4,100 | +28.1% | ⚠️ YES |
| Week 3 | ₹3,500 | -14.6% | ✅ NO |

---

## 7. Limitations & Ethical Considerations

- Budget suggestions are based on **historical averages and predefined rules**, not AI predictions
- The system does **NOT** perform statistical financial forecasting or investment planning
- AI-generated suggestions depend on **prompt design and input quality**
- The project demonstrates structured financial tracking using **no-code tools**
- User data stays in their own Google account — no third-party data sharing
