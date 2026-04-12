# Google Sheets Dashboard Formulas

## AI Personal Finance Tracker & Advisor

Copy these formulas into your Google Sheets "Monthly Summary" tab. Adjust cell references based on your actual data layout.

---

## Assumptions

- **Raw Data tab** is named `Form Responses 1` (default from Google Forms)
- Column B = Amount (₹)
- Column C = Date of Expense  
- Column H = Final Category
- Monthly budget = ₹15,000 (stored in a cell, e.g., Summary!B1)

---

## 1. Total Monthly Spending

```
=SUMPRODUCT((MONTH('Form Responses 1'!C:C)=MONTH(TODAY()))*('Form Responses 1'!B:B))
```

**Simplified version** (if you filter by month manually):
```
=SUM('Form Responses 1'!B2:B)
```

---

## 2. Category-Wise Spending

For each category, use SUMIF:

```
Food Total:          =SUMIF('Form Responses 1'!H:H, "Food", 'Form Responses 1'!B:B)
Transport Total:     =SUMIF('Form Responses 1'!H:H, "Transport", 'Form Responses 1'!B:B)
Entertainment Total: =SUMIF('Form Responses 1'!H:H, "Entertainment", 'Form Responses 1'!B:B)
Utilities Total:     =SUMIF('Form Responses 1'!H:H, "Utilities", 'Form Responses 1'!B:B)
Education Total:     =SUMIF('Form Responses 1'!H:H, "Education", 'Form Responses 1'!B:B)
Shopping Total:      =SUMIF('Form Responses 1'!H:H, "Shopping", 'Form Responses 1'!B:B)
Health Total:        =SUMIF('Form Responses 1'!H:H, "Health", 'Form Responses 1'!B:B)
Personal Care Total: =SUMIF('Form Responses 1'!H:H, "Personal Care", 'Form Responses 1'!B:B)
Rent/Housing Total:  =SUMIF('Form Responses 1'!H:H, "Rent/Housing", 'Form Responses 1'!B:B)
Miscellaneous Total: =SUMIF('Form Responses 1'!H:H, "Miscellaneous", 'Form Responses 1'!B:B)
```

---

## 3. Category Percentage of Total

```
Food %:          =ROUND(Food_Total / Total_Spending * 100, 1)
Transport %:     =ROUND(Transport_Total / Total_Spending * 100, 1)
Entertainment %: =ROUND(Entertainment_Total / Total_Spending * 100, 1)
```
*(Replace `Food_Total` and `Total_Spending` with actual cell references)*

---

## 4. Budget Status (Over/Under)

```
=IF(Food_Percentage > 35, "🔴 OVER BUDGET", IF(Food_Percentage > 30, "🟡 NEAR LIMIT", "🟢 OK"))
```

Example with cell references (assuming Food% is in cell C5 and threshold is 35):
```
=IF(C5>35, "🔴 OVER BUDGET", IF(C5>30, "🟡 NEAR LIMIT", "🟢 OK"))
```

---

## 5. Weekly Spending Breakdown

```
Week 1 (Day 1-7):   =SUMPRODUCT((DAY('Form Responses 1'!C:C)>=1)*(DAY('Form Responses 1'!C:C)<=7)*('Form Responses 1'!B:B))
Week 2 (Day 8-14):  =SUMPRODUCT((DAY('Form Responses 1'!C:C)>=8)*(DAY('Form Responses 1'!C:C)<=14)*('Form Responses 1'!B:B))
Week 3 (Day 15-21): =SUMPRODUCT((DAY('Form Responses 1'!C:C)>=15)*(DAY('Form Responses 1'!C:C)<=21)*('Form Responses 1'!B:B))
Week 4 (Day 22-31): =SUMPRODUCT((DAY('Form Responses 1'!C:C)>=22)*(DAY('Form Responses 1'!C:C)<=31)*('Form Responses 1'!B:B))
```

---

## 6. Week-over-Week Change (%)

```
Week 2 vs Week 1: =ROUND((Week2_Total - Week1_Total) / Week1_Total * 100, 1)
```

With cell references (Week1 in D2, Week2 in D3):
```
=IF(D2=0, "N/A", ROUND((D3-D2)/D2*100, 1))
```

---

## 7. Weekly Spike Detection

```
=IF(Week_Change > 20, "⚠️ SPIKE DETECTED", "✅ Normal")
```

With cell references (Change% in E3):
```
=IF(E3>20, "⚠️ SPIKE DETECTED", "✅ Normal")
```

---

## 8. Savings Calculation

```
Monthly Budget:      ₹15,000  (enter in a cell)
Total Spent:         =SUM formula from above
Amount Saved:        =Budget - Total_Spent
Savings Rate (%):    =ROUND(Amount_Saved / Budget * 100, 1)
Savings Status:      =IF(Savings_Rate >= 15, "🌟 EXCELLENT", IF(Savings_Rate >= 10, "✅ ON TARGET", "⚠️ BELOW TARGET"))
```

---

## 9. Conditional Formatting Rules

Apply these rules to make the dashboard visually informative:

### For Category Percentage Cells:
1. Select the cells containing category percentages
2. Go to **Format → Conditional formatting**
3. Add these rules:

| Rule | Condition | Format |
|------|-----------|--------|
| Rule 1 | Custom formula: `=C5>35` (for Food) | Background: Red (#FF6B6B) |
| Rule 2 | Custom formula: `=AND(C5>30, C5<=35)` | Background: Yellow (#FFE066) |
| Rule 3 | Custom formula: `=C5<=30` | Background: Green (#51CF66) |

*(Adjust the threshold numbers for each category)*

### For Savings Rate:
| Rule | Condition | Format |
|------|-----------|--------|
| ≥ 15% | Custom formula: `=SavingsRate>=15` | Background: Green |
| 10-15% | Custom formula: `=AND(SavingsRate>=10, SavingsRate<15)` | Background: Light Green |
| < 10% | Custom formula: `=SavingsRate<10` | Background: Red |

---

## 10. Charts to Create (Milestone 3)

### Pie Chart: Category Distribution
1. Select Category names and their totals
2. Insert → Chart → Pie chart
3. Title: "Expense Distribution by Category"

### Line Chart: Monthly Trend
1. Select dates and daily totals
2. Insert → Chart → Line chart
3. Title: "Daily Spending Trend"

### Bar Chart: Weekly Comparison
1. Select Week labels and totals
2. Insert → Chart → Bar chart
3. Title: "Week-over-Week Spending"

---

## Summary Tab Layout

Here's the recommended layout for your "Monthly Summary" tab:

```
Row 1:  | Monthly Budget:    | ₹15,000          |                    |
Row 2:  | Total Spent:       | =SUM formula       |                    |
Row 3:  | Amount Saved:      | =Budget - Spent    |                    |
Row 4:  | Savings Rate:      | =Saved/Budget*100  |                    |
Row 5:  |                    |                    |                    |
Row 6:  | Category           | Amount (₹)         | % of Total         | Status
Row 7:  | Food               | =SUMIF(...)        | =Amount/Total*100  | =IF(>35,...)
Row 8:  | Transport          | =SUMIF(...)        | =Amount/Total*100  | =IF(>15,...)
Row 9:  | Entertainment      | =SUMIF(...)        | =Amount/Total*100  | =IF(>10,...)
Row 10: | Utilities          | =SUMIF(...)        | =Amount/Total*100  | =IF(>10,...)
Row 11: | Education          | =SUMIF(...)        | =Amount/Total*100  | =IF(>10,...)
Row 12: | Shopping           | =SUMIF(...)        | =Amount/Total*100  | =IF(>10,...)
Row 13: | Health             | =SUMIF(...)        | =Amount/Total*100  | =IF(>5,...)
Row 14: | Personal Care      | =SUMIF(...)        | =Amount/Total*100  | =IF(>5,...)
Row 15: | Rent/Housing       | =SUMIF(...)        | =Amount/Total*100  | —
Row 16: | Miscellaneous      | =SUMIF(...)        | =Amount/Total*100  | =IF(>5,...)
Row 17: |                    |                    |                    |
Row 18: | Weekly Breakdown   | Amount (₹)         | vs Previous Week   | Spike?
Row 19: | Week 1             | =SUMPRODUCT(...)   | —                  | —
Row 20: | Week 2             | =SUMPRODUCT(...)   | =change%           | =IF(>20%,...)
Row 21: | Week 3             | =SUMPRODUCT(...)   | =change%           | =IF(>20%,...)
Row 22: | Week 4             | =SUMPRODUCT(...)   | =change%           | =IF(>20%,...)
```
