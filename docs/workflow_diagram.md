# System Workflow Diagram

## AI Personal Finance Tracker & Advisor

---

## High-Level Workflow

```mermaid
flowchart TD
    A["📝 Student Logs Expense\n(Google Form)"] --> B["📊 Data Stored\n(Google Sheets - Raw Data)"]
    B --> C["🤖 AI Categorization\n(ChatGPT / Gemini)"]
    C --> D{"Manual Override\nNeeded?"}
    D -->|Yes| E["✏️ Student Corrects\nCategory in Sheet"]
    D -->|No| F["✅ Final Category\nAssigned"]
    E --> F
    F --> G["📈 Dashboard Updates\n(Charts & Trends)"]
    G --> H{"Budget Threshold\nExceeded?"}
    H -->|Yes| I["🔴 Budget Alert\nTriggered"]
    H -->|No| J["🟢 Within Budget"]
    I --> K["💡 AI Savings\nSuggestions"]
    J --> L["📄 Monthly Report\n(Canva)"]
    K --> L
```

---

## Detailed Data Flow

```mermaid
flowchart LR
    subgraph INPUT ["📝 INPUT LAYER"]
        F1["Google Form"]
        F1 --> |"Amount, Date,\nDescription"| S1
    end

    subgraph STORAGE ["📊 STORAGE & PROCESSING"]
        S1["Raw Data Tab"]
        S2["Categories Tab"]
        S3["Monthly Summary Tab"]
        S4["Weekly Analysis Tab"]
        S1 --> S3
        S1 --> S4
        S2 --> S3
    end

    subgraph AI ["🤖 AI LAYER"]
        A1["ChatGPT/Gemini\nStructured Prompt"]
        A2["Category Assignment"]
        A3["Savings Recommendations"]
        S1 --> A1
        A1 --> A2
        A2 --> S1
        S3 --> A3
    end

    subgraph OUTPUT ["📈 OUTPUT LAYER"]
        D1["Dashboard\n(Pie/Line/Bar Charts)"]
        D2["Budget Alerts\n(Conditional Formatting)"]
        D3["Monthly Report\n(Canva PDF)"]
        S3 --> D1
        S3 --> D2
        A3 --> D3
        D1 --> D3
    end
```

---

## Step-by-Step Process

### Step 1: Expense Input
```
Student opens Google Form → Enters:
  • Amount: ₹250
  • Date: 2025-04-12
  • Description: "Zomato lunch"
  • Category Override: (optional, left blank)
```

### Step 2: Data Storage
```
Google Form auto-submits to Google Sheets:
  → Row added to "Raw Data" tab
  → Timestamp auto-generated
  → Category (Auto) column is empty (pending AI)
```

### Step 3: AI Categorization
```
Copy expense descriptions → Paste into ChatGPT/Gemini
  → Use structured prompt from docs/chatgpt_prompts.md
  → AI returns: "Food — Delivery"
  → Paste category back into Sheet
```

### Step 4: Pattern Analysis
```
Google Sheets formulas auto-calculate:
  → Total monthly spending
  → Category-wise percentages
  → Weekly comparisons
  → Budget alerts (conditional formatting)
```

### Step 5: Dashboard & Reporting
```
Charts auto-update:
  → Pie chart: category distribution
  → Line chart: monthly trend
  → Bar chart: week-over-week comparison
  
Monthly → Create Canva report with insights
```

---

## Milestone Progression Map

```mermaid
gantt
    title Project Milestones
    dateFormat  YYYY-MM-DD
    section Milestone 1 (25%)
    Problem Statement & Design     :done, m1a, 2025-04-01, 7d
    Categories & Thresholds        :done, m1b, after m1a, 3d
    Workflow Diagram                :done, m1c, after m1b, 2d
    Sheets Template                 :done, m1d, after m1c, 3d
    
    section Milestone 2 (50%)
    Google Form Setup              :done, m2a, after m1d, 2d
    ChatGPT Prompts                :done, m2b, after m2a, 3d
    Auto-Categorization            :done, m2c, after m2b, 3d
    Data Organization              :done, m2d, after m2c, 2d
    
    section Milestone 3 (75%)
    Dashboard Charts               :m3a, after m2d, 5d
    Budget Alerts                  :m3b, after m3a, 3d
    Conditional Formatting         :m3c, after m3b, 2d
    
    section Milestone 4 (100%)
    AI Savings Suggestions         :m4a, after m3c, 5d
    Canva Report                   :m4b, after m4a, 3d
    Testing & Documentation        :m4c, after m4b, 4d
```
