# Capstone Project — Milestone 1 Submission (25%)

## AI Personal Finance Tracker & Advisor

**Team Member:** Ayana Sharma  
**Date:** April 2025  
**Project Type:** AI-Assisted No-Code Application

---

## 1. Problem Statement

Students and young professionals in India often struggle to track their daily expenses, leading to unintentional overspending in categories like food delivery and entertainment. Without clear visibility into their spending patterns, they miss opportunities to save and struggle with budgeting.

**This project provides an AI-powered, no-code solution** that automates expense categorization, detects spending patterns, and generates actionable savings recommendations using Google Forms, Google Sheets, ChatGPT/Gemini, and Canva.

### Target Users:
- College students managing limited monthly allowances
- Young professionals (1–3 years of earning) building financial habits

### Key Problem Areas:
- No structured expense tracking across UPI apps, wallets, and cash
- Lack of awareness about category-wise spending breakdowns
- No actionable advice on how to reduce spending
- Complex budgeting tools are intimidating and often paid

---

## 2. System Scope

### In Scope:
- Expense logging via Google Forms
- AI-powered expense categorization using ChatGPT/Gemini
- Rule-based spending pattern detection via Google Sheets formulas
- Budget threshold alerts with conditional formatting
- Category-wise spending dashboard with charts
- Monthly financial report via Canva (PDF export)

### Out of Scope:
- Statistical financial forecasting or investment planning
- Real-time bank account integration
- Mobile app development
- Multi-currency support

---

## 3. Defined Expense Categories

The system uses 10 predefined categories:

| # | Category | Budget Threshold | Description |
|---|----------|-----------------|-------------|
| 1 | Food | ≤ 35% of total | Groceries, dining out, Zomato/Swiggy, snacks |
| 2 | Transport | ≤ 15% of total | Fuel, Ola/Uber, metro/bus, auto rickshaw |
| 3 | Entertainment | ≤ 10% of total | Movies, Netflix/Spotify, gaming, outings |
| 4 | Utilities | ≤ 10% of total | Electricity, water, internet, mobile recharge |
| 5 | Education | ≤ 10% of total | Books, courses, exam fees |
| 6 | Shopping | ≤ 10% of total | Clothing, electronics, accessories |
| 7 | Health | ≤ 5% of total | Medicines, doctor visits, gym |
| 8 | Personal Care | ≤ 5% of total | Salon, grooming, cosmetics |
| 9 | Rent/Housing | Variable | Rent, maintenance, repairs |
| 10 | Miscellaneous | ≤ 5% of total | Gifts, donations, uncategorized |

---

## 4. Budget Thresholds & Alert Rules

### Category-Level Alerts:
- **🔴 Over Budget**: Category spending exceeds its predefined threshold percentage
- **🟡 Near Limit**: Category spending is within 5% of its threshold
- **🟢 Within Budget**: Category spending is safely below threshold

### Monthly Budget:
- Default monthly budget: ₹15,000 (configurable)
- Alert triggered when total spending exceeds budget

### Weekly Spike Detection:
- If current week's spending is **>20% higher** than the previous week → flag as a spike
- Formula: `(This Week – Last Week) / Last Week > 0.20`

---

## 5. Savings Target Logic

- **Target**: Save 10–15% of monthly income/allowance
- **Default**: ₹1,500 – ₹2,250 per month (based on ₹15,000 budget)

### How It Works:
Budget recommendations are based on:
- Historical monthly average spending
- Category-wise spending proportion
- Defined saving target (10–15% of monthly income)

### Example Rules:

| Condition | Recommendation |
|-----------|---------------|
| Food > 40% of total | Reduce delivery frequency to 2x/week. Savings: ~₹2,000/month |
| Entertainment > 15% | Review streaming subscriptions. Share plans. Savings: ~₹500/month |
| Transport > 20% | Use public transport 3x/week. Savings: ~₹1,500/month |
| Weekly spike > 20% | Review recent transactions for unnecessary expenses |

> **Note:** These are rule-based estimations, NOT statistical forecasting.

---

## 6. Spending Pattern Detection Rules

| Pattern | Detection Rule |
|---------|---------------|
| Category overspending | Category % > predefined threshold |
| Weekly spike | Week-over-week increase > 20% |
| Consistent overspending | Same category exceeds threshold 2+ consecutive weeks |
| Underspending alert | Total spending < 50% of budget by mid-month |

---

## 7. Workflow Diagram

```
📝 Google Form (Student logs expense)
       ↓
📊 Google Sheets (Auto-stores in Raw Data tab)
       ↓
🤖 ChatGPT/Gemini (AI categorizes the expense)
       ↓
✏️ Manual Override (Student corrects if needed)
       ↓
📈 Dashboard (Auto-updates charts & alerts)
       ↓
📄 Canva Report (Monthly financial summary)
```

**Detailed Flow:**
1. Student opens Google Form → enters Amount, Date, Description
2. Data auto-stores in Google Sheets "Raw Data" tab
3. Descriptions are batch-processed via ChatGPT for categorization
4. Student can manually override the AI category if incorrect
5. Google Sheets formulas auto-calculate totals, percentages, and alerts
6. Dashboard tab shows pie charts, trend lines, and weekly comparisons
7. Monthly data is compiled into a Canva-designed report (PDF)

---

## 8. Google Sheets Template Structure

### Tab 1: Raw Data (Form Responses)
Columns: Timestamp | Amount | Date | Description | Category Override | Category (AI) | Subcategory (AI) | Final Category

### Tab 2: Categories
Master list with categories, subcategories, and budget thresholds

### Tab 3: Monthly Summary
Auto-calculated metrics: total spending, category breakdowns, budget status, weekly analysis

### Tab 4: Dashboard
Charts: pie chart (category distribution), line chart (monthly trend), bar chart (weekly comparison)

---

## 9. Tech Stack

| Tool | Purpose |
|------|---------|
| Google Forms | Expense data input |
| Google Sheets | Data storage, calculations, charts & dashboard |
| ChatGPT / Gemini | AI expense categorization & savings suggestions |
| Canva | Monthly financial report design |
| Notion | Documentation & workflow planning |

---

## 10. Idea Behind the Project

An AI-assisted personal finance management system designed for students to track expenses, analyze spending patterns, and receive structured savings suggestions.

The system collects expense data through Google Forms and stores it in Google Sheets. ChatGPT is used to categorize expenses into predefined categories using structured prompts. Spending trends and budget analysis are calculated using rule-based formulas in Google Sheets.

The system provides budget recommendations based on historical spending averages and predefined thresholds. It does **not** use statistical forecasting models or financial prediction algorithms. The project demonstrates **AI integration and rule-based financial analysis** using no-code tools.

---

## Milestone 1 Checklist ✅

- [x] Clear problem statement and system scope
- [x] Defined expense categories (Food, Transport, etc.)
- [x] Defined budget thresholds (e.g., Food ≤ 35% of total spending)
- [x] Defined savings target logic (10–15% monthly saving goal)
- [x] Defined spending pattern rules (e.g., 20% weekly spike detection)
- [x] Workflow diagram (Form → Sheets → AI → Dashboard → Report)
- [x] Structured Google Sheets template created
