# 🚀 Google Sheets Setup — Step-by-Step Guide

## AI Personal Finance Tracker & Advisor

Follow these steps **exactly** — your entire tracker will be set up in 5 minutes!

---

## Step 1: Create a New Google Sheet

1. Go to **[sheets.google.com](https://sheets.google.com)**
2. Click **"+ Blank"** to create a new spreadsheet
3. Name it: **"AI Expense Tracker — Dashboard"**

---

## Step 2: Open Apps Script Editor

1. In your new Google Sheet, go to **Extensions → Apps Script**
2. This opens the script editor in a new tab
3. You'll see a file called `Code.gs` with a default `myFunction()` — **delete everything** in it

---

## Step 3: Paste the Script

1. Open the file `google-sheets/Code.gs` from your project folder
2. **Copy the ENTIRE content** (Ctrl+A, then Ctrl+C)
3. **Paste it** into the Apps Script editor (Ctrl+V)
4. Click **💾 Save** (or Ctrl+S)
5. Name the project: **"Finance Tracker Script"**

---

## Step 4: Run the Setup

1. **Go back to your Google Sheet** (the tab in your browser)
2. **Refresh the page** (F5 or Ctrl+R)
3. Wait a few seconds — you'll see a new menu appear: **"💰 Finance Tracker"**
4. Click **💰 Finance Tracker → 🚀 Setup Everything**
5. **Google will ask for permissions** — click:
   - "Continue"
   - Choose your Google account
   - "Advanced" → "Go to Finance Tracker Script (unsafe)"
   - "Allow"
6. Wait for the setup to complete — it takes about 10-15 seconds

### ✅ After setup, you'll have 4 sheets:
| Sheet | Purpose |
|-------|---------|
| 📝 Raw Data | Where all expenses are stored |
| 📂 Categories | Master list of categories & thresholds |
| 📊 Monthly Summary | Dashboard with totals & budget status |
| 📅 Weekly Analysis | Week-by-week spending & spike detection |

---

## Step 5: Load Sample Data

1. Click **💰 Finance Tracker → 📋 Add Sample Data**
2. This adds 20 sample expenses and auto-categorizes them
3. Check the **📊 Monthly Summary** tab — you'll see budget status for each category!

---

## Step 6: Add Your Own Expenses

### Method 1: Via the Menu (Recommended)
1. Click **💰 Finance Tracker → ➕ Add Expense**
2. A dialog box pops up
3. Enter Amount, Date, Description
4. Optionally select a category override
5. Click **"Add Expense →"**
6. The AI auto-categorizes it and adds it to the sheet!

### Method 2: Directly in the Sheet
1. Go to the **📝 Raw Data** tab
2. Type in a new row: Amount (Col B), Date (Col C), Description (Col D)
3. Click **💰 Finance Tracker → 🤖 AI Categorize All**
4. The AI fills in columns F (Category) and G (Subcategory)

### Method 3: Via Google Form (Optional)
1. Create a Google Form with fields: Amount, Date, Description, Category Override
2. Link it to this Google Sheet (Form → Responses → Spreadsheet icon)
3. The `onFormSubmit` trigger in the script auto-categorizes new entries!

---

## Step 7: Create Charts (Optional)

1. Click **💰 Finance Tracker → 📊 Refresh Dashboard**
2. This creates a pie chart on the Monthly Summary tab
3. You can also manually create charts:
   - Select data → **Insert → Chart**
   - Choose Pie/Line/Bar chart
   - Customize colors and labels

---

## Step 8: Connect a Google Form (Optional)

To make expense logging even easier:

1. Go to **[forms.google.com](https://forms.google.com)** → create a new form
2. Add fields:
   - **Amount (₹)** — Short answer, number validation
   - **Date** — Date picker
   - **Description** — Short answer
   - **Category Override** — Dropdown with all 10 categories
3. In the Form, click **Responses** tab → **Link to Sheets** icon
4. Choose **"Select existing spreadsheet"** → pick your Tracker sheet
5. Now every form submission auto-appears in the Raw Data tab!

### Set up auto-categorization trigger:
1. In Apps Script, go to **Triggers** (⏰ clock icon on left sidebar)
2. Click **"+ Add Trigger"**
3. Set:
   - Function: `onFormSubmit`
   - Event source: From spreadsheet
   - Event type: On form submit
4. Click **Save**
5. Now every form submission is automatically AI-categorized! 🤖

---

## Step 9: Connect the Web App to Google Sheets 🔗

This makes it so expenses logged on the **web app (index.html)** automatically appear in **Google Sheets**.

### Deploy as Web App:
1. In the Apps Script editor, click **Deploy → New Deployment**
2. Click the ⚙️ gear icon → Select **"Web app"**
3. Set:
   - **Description**: "Finance Tracker API"
   - **Execute as**: Me
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL** (it looks like: `https://script.google.com/macros/s/xxxxx/exec`)

### Paste into Web App:
1. Open `app.js` in your project folder
2. Find this line near the top:
   ```js
   googleSheetsUrl: '',
   ```
3. Paste your URL between the quotes:
   ```js
   googleSheetsUrl: 'https://script.google.com/macros/s/YOUR_ID_HERE/exec',
   ```
4. Save the file

### Test it:
1. Open `index.html` in your browser
2. Go to **"Log Expense"** tab
3. Add a test expense (e.g., ₹100, "test chai")
4. The header will show **"🟢 Synced to Google Sheets"**
5. Check your Google Sheet — the expense should appear in the **📝 Raw Data** tab!

---

## Quick Reference — Menu Options

| Menu Item | What It Does |
|-----------|-------------|
| 🚀 Setup Everything | Creates all sheets, formulas, and formatting |
| ➕ Add Expense | Opens a popup form to add an expense |
| 🤖 AI Categorize All | Auto-categorizes all uncategorized expenses |
| 📊 Refresh Dashboard | Updates charts and recalculates all formulas |
| 📋 Add Sample Data | Loads 20 test expenses for demo |
| ℹ️ About | Shows app info |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Menu not showing | Refresh the Google Sheet page |
| Permission errors | Click "Advanced" → "Go to script (unsafe)" → "Allow" |
| Formulas show #REF | Run "🚀 Setup Everything" again |
| Categories not filling | Click "🤖 AI Categorize All" |
| Chart not showing | Click "📊 Refresh Dashboard" |
| Web app shows "Not Connected" | Make sure you pasted the URL in `app.js` |
| Sync failed error | Re-deploy the web app and use the new URL |

