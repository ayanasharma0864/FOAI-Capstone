# 💰 AI Personal Finance Tracker & Advisor

An AI-assisted personal finance management system designed for students and young professionals to **track expenses**, **analyze spending patterns**, and **receive structured savings suggestions** — all using no-code tools.

---

## 🎯 Problem Statement

Students and young professionals in India often struggle to track their daily expenses, leading to unintentional overspending in categories like food delivery and entertainment. Without clear visibility into their spending patterns, they miss opportunities to save and struggle with budgeting.

This project provides an **AI-powered, no-code solution** that automates expense categorization, detects spending patterns, and generates actionable savings recommendations.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| **Google Forms** | Expense data input |
| **Google Sheets** | Data storage, calculations, charts & dashboard |
| **ChatGPT / Gemini** | AI expense categorization & savings suggestions |
| **Canva** | Monthly financial report design |
| **Notion** | Documentation & workflow planning |

---

## 🔄 System Workflow

```
📝 Google Form (Input)
       ↓
📊 Google Sheets (Storage & Processing)
       ↓
🤖 ChatGPT/Gemini (AI Categorization)
       ↓
📈 Dashboard (Charts & Alerts)
       ↓
📄 Canva Report (Monthly Summary)
```

---

## 📁 Project Structure

```
Foai-CapStone/
├── README.md                           # Project overview
├── docs/
│   ├── problem_statement.md            # Detailed problem statement
│   ├── system_design.md                # System architecture & rules
│   ├── workflow_diagram.md             # Visual workflow diagram
│   ├── chatgpt_prompts.md              # AI prompts for categorization
│   ├── google_form_setup.md            # Form setup instructions
│   ├── milestone1_submission.md        # Milestone 1 document
│   └── milestone2_submission.md        # Milestone 2 document
├── templates/
│   ├── expenses_raw_data.csv           # Raw expense data template
│   ├── categories_master.csv           # Category master list
│   ├── budget_rules.csv                # Budget thresholds & rules
│   └── dashboard_formulas.md           # Google Sheets formulas
└── assets/
    └── (diagrams and images)
```

---

## 🚀 Getting Started

### 1. Set Up Google Form
Follow the guide in [`docs/google_form_setup.md`](docs/google_form_setup.md) to create your expense input form.

### 2. Set Up Google Sheets
Import the CSV templates from the `templates/` folder into Google Sheets.

### 3. Connect Form to Sheet
Link your Google Form responses to the Google Sheet (automatic via Google Forms settings).

### 4. Use ChatGPT Prompts
Use the prompts from [`docs/chatgpt_prompts.md`](docs/chatgpt_prompts.md) to categorize expenses.

---

## 📊 Features

- ✅ **Expense Input** — Log expenses via Google Forms (Amount, Date, Description)
- ✅ **AI Categorization** — ChatGPT/Gemini auto-categorizes into Food, Transport, Entertainment, etc.
- ✅ **Spending Pattern Detection** — Rule-based analysis using Google Sheets formulas
- ✅ **Budget Alerts** — Conditional formatting for overspending warnings
- ✅ **Dashboard** — Pie charts, trend lines, and weekly comparisons
- ✅ **Monthly Report** — Canva-designed financial summary (PDF export)

---

## 📋 Milestones

| Milestone | Progress | Description |
|-----------|----------|-------------|
| M1 (25%) | ✅ | Problem statement, categories, thresholds, workflow diagram, Sheets template |
| M2 (50%) | ✅ | Google Form, ChatGPT prompts, auto-categorization, data organization |
| M3 (75%) | 🔲 | Dashboard with charts, budget alerts, conditional formatting |
| M4 (100%) | 🔲 | AI savings suggestions, Canva report, PDF export, documentation |

---

## 👥 Team

- **Ayana Sharma** — Project Lead
- Built as part of the FOAI CapStone Project

---

## 📄 License

This project is for academic purposes as part of the FOAI CapStone curriculum.
