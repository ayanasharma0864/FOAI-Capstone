# Google Form Setup Guide

## AI Personal Finance Tracker & Advisor

Follow these steps to create your expense input form. This should take about 10-15 minutes.

---

## Step 1: Create a New Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Click **"+ Blank"** to create a new form
3. Title it: **"💰 AI Expense Tracker — Log Your Expense"**
4. Add a description:
   ```
   Log your daily expenses here. Each entry will be automatically stored 
   in Google Sheets for AI-powered analysis and budget tracking.
   ```

---

## Step 2: Add Form Fields

### Field 1: Amount (₹)
| Setting | Value |
|---------|-------|
| Question | `Amount (₹)` |
| Type | **Short answer** |
| Required | ✅ Yes |
| Validation | Number → Greater than → 0 |
| Error message | "Please enter a valid amount greater than 0" |

### Field 2: Date
| Setting | Value |
|---------|-------|
| Question | `Date of Expense` |
| Type | **Date** |
| Required | ✅ Yes |

### Field 3: Description
| Setting | Value |
|---------|-------|
| Question | `Description` |
| Type | **Short answer** |
| Required | ✅ Yes |
| Helper text | "What was this expense? Be specific. Example: Zomato lunch, Uber to college, Netflix subscription" |

### Field 4: Category Override (Optional)
| Setting | Value |
|---------|-------|
| Question | `Category (Optional Override)` |
| Type | **Dropdown** |
| Required | ❌ No |
| Options | See list below |

**Dropdown options for Category Override:**
```
Food
Transport
Entertainment
Utilities
Education
Shopping
Health
Personal Care
Rent/Housing
Miscellaneous
```

---

## Step 3: Form Settings

1. Click the **⚙️ Settings** (gear icon) at the top
2. Under **"Responses"** tab:
   - Toggle **"Collect email addresses"** → OFF (unless you want to)
   - Toggle **"Allow response editing"** → ON
   - Toggle **"Limit to 1 response"** → OFF (users need to submit multiple times)
3. Under **"Presentation"** tab:
   - Confirmation message: `"✅ Expense logged! Your data is being tracked."`
   - Toggle **"Show link to submit another response"** → ON

---

## Step 4: Link Form to Google Sheets

1. Click the **"Responses"** tab in your form
2. Click the **green Sheets icon** (📊) → "Create a new spreadsheet"
3. Name it: **"AI Expense Tracker — Data"**
4. Click **"Create"**

This automatically creates a Google Sheet where all form responses are stored.

---

## Step 5: Set Up Google Sheet Structure

After the sheet is created, you'll see columns auto-populated:
- Column A: **Timestamp** (auto)
- Column B: **Amount (₹)**
- Column C: **Date of Expense**
- Column D: **Description**
- Column E: **Category (Optional Override)**

### Add these additional columns manually:

| Column | Header | Purpose |
|--------|--------|---------|
| F | `Category (AI)` | Paste AI-categorized category here |
| G | `Subcategory (AI)` | Paste AI subcategory here |
| H | `Final Category` | Formula: `=IF(E2<>"", E2, F2)` |

### Add the Final Category formula:
1. Click cell **H2**
2. Enter: `=IF(E2<>"", E2, F2)`
3. This uses the manual override (E) if provided, otherwise uses AI category (F)
4. **Drag this formula down** for all rows

---

## Step 6: Create Additional Sheets (Tabs)

### Tab 2: "Categories"
Create a new sheet tab called **"Categories"** with this data:

| Category | Budget Threshold (%) | Monthly Limit (₹) |
|----------|--------------------|--------------------|
| Food | 35 | 5,250 |
| Transport | 15 | 2,250 |
| Entertainment | 10 | 1,500 |
| Utilities | 10 | 1,500 |
| Education | 10 | 1,500 |
| Shopping | 10 | 1,500 |
| Health | 5 | 750 |
| Personal Care | 5 | 750 |
| Rent/Housing | — | — |
| Miscellaneous | 5 | 750 |

*(Monthly limits based on ₹15,000 total budget — adjust as needed)*

### Tab 3: "Monthly Summary"
Create a new sheet tab called **"Monthly Summary"** — see `templates/dashboard_formulas.md` for all the formulas to use.

---

## Step 7: Test the Form

1. Open the form preview (👁️ eye icon)
2. Submit a test entry:
   - Amount: `250`
   - Date: Today's date
   - Description: `Zomato lunch`
   - Category Override: (leave blank)
3. Check Google Sheets — the entry should appear in the "Raw Data" tab
4. Use ChatGPT with the prompt from `docs/chatgpt_prompts.md` to categorize it
5. Paste the result in column F (Category AI): `Food`
6. Paste subcategory in column G: `Delivery`
7. Column H should auto-fill: `Food`

---

## Step 8: Make It Accessible

1. Click **"Send"** button in Google Forms
2. Copy the form link
3. Bookmark it or add it to your phone's home screen
4. Share with team members if needed

---

## Quick Reference: Form URL Pattern

Your form URL will look like:
```
https://docs.google.com/forms/d/e/{FORM_ID}/viewform
```

Your linked Sheet URL:
```
https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
```

Save both links in your project README and documentation.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Responses not showing in Sheet | Check the Responses tab → green Sheets icon is linked |
| Date format wrong | Go to Sheet → Format → Number → Date → pick your format |
| Formula not working | Make sure column references match (E2, F2 for row 2) |
| Drop-down not showing | Edit the form field → ensure type is "Dropdown" |
