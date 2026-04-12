/**
 * ============================================
 * AI Personal Finance Tracker & Advisor
 * Google Apps Script — Main Code
 * ============================================
 * 
 * HOW TO USE:
 * 1. Open a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete everything in Code.gs
 * 4. Paste this entire file
 * 5. Save (Ctrl+S)
 * 6. Refresh the Google Sheet
 * 7. You'll see a new menu "💰 Finance Tracker"
 * 8. Click "💰 Finance Tracker" → "🚀 Setup Everything"
 * 9. Grant permissions when asked
 * 10. Done! Your entire tracker is set up.
 */

// ===== CONFIGURATION =====
const BUDGET = 15000; // Monthly budget in ₹
const CATEGORIES = {
  'Food':          { threshold: 35, icon: '🍕' },
  'Transport':     { threshold: 15, icon: '🚗' },
  'Entertainment': { threshold: 10, icon: '🎬' },
  'Utilities':     { threshold: 10, icon: '💡' },
  'Education':     { threshold: 10, icon: '📚' },
  'Shopping':      { threshold: 10, icon: '🛍️' },
  'Health':        { threshold: 5,  icon: '💊' },
  'Personal Care': { threshold: 5,  icon: '💇' },
  'Rent/Housing':  { threshold: 0,  icon: '🏠' },
  'Miscellaneous': { threshold: 5,  icon: '📦' },
};

// ===== AI CATEGORIZATION RULES =====
const AI_RULES = [
  // Food
  { keywords: ['zomato', 'swiggy', 'food delivery', 'delivery'], category: 'Food', sub: 'Delivery' },
  { keywords: ['grocery', 'groceries', 'bigbasket', 'blinkit', 'zepto', 'vegetables', 'fruits'], category: 'Food', sub: 'Groceries' },
  { keywords: ['restaurant', 'dining', 'dominos', 'pizza', 'burger', 'mcdonald', 'kfc', 'biryani'], category: 'Food', sub: 'Dining Out' },
  { keywords: ['chai', 'tea', 'coffee', 'starbucks', 'ccd', 'cafe'], category: 'Food', sub: 'Coffee/Tea' },
  { keywords: ['snack', 'biscuit', 'chips', 'samosa', 'maggi', 'juice', 'canteen'], category: 'Food', sub: 'Snacks' },
  { keywords: ['lunch', 'dinner', 'breakfast', 'meal', 'food', 'eat', 'tiffin', 'mess'], category: 'Food', sub: 'Dining Out' },
  
  // Transport
  { keywords: ['uber', 'ola', 'rapido', 'indrive', 'cab', 'taxi'], category: 'Transport', sub: 'Cab' },
  { keywords: ['metro', 'bus', 'train', 'public transport'], category: 'Transport', sub: 'Metro/Bus' },
  { keywords: ['auto', 'rickshaw'], category: 'Transport', sub: 'Auto' },
  { keywords: ['petrol', 'fuel', 'diesel', 'cng'], category: 'Transport', sub: 'Fuel' },
  { keywords: ['parking'], category: 'Transport', sub: 'Parking' },
  
  // Entertainment
  { keywords: ['netflix', 'prime', 'hotstar', 'disney', 'streaming', 'jiocinema'], category: 'Entertainment', sub: 'Streaming' },
  { keywords: ['spotify', 'music', 'apple music', 'youtube premium'], category: 'Entertainment', sub: 'Streaming' },
  { keywords: ['movie', 'pvr', 'inox', 'cinema', 'theatre'], category: 'Entertainment', sub: 'Movies' },
  { keywords: ['game', 'gaming', 'playstation', 'xbox'], category: 'Entertainment', sub: 'Gaming' },
  { keywords: ['outing', 'trip', 'picnic', 'party', 'club'], category: 'Entertainment', sub: 'Outings' },
  
  // Utilities
  { keywords: ['electricity', 'electric bill', 'power bill'], category: 'Utilities', sub: 'Electricity' },
  { keywords: ['water bill'], category: 'Utilities', sub: 'Water' },
  { keywords: ['internet', 'wifi', 'broadband'], category: 'Utilities', sub: 'Internet' },
  { keywords: ['recharge', 'jio', 'airtel', 'vi ', 'vodafone', 'mobile'], category: 'Utilities', sub: 'Mobile Recharge' },
  
  // Education
  { keywords: ['book', 'textbook', 'notebook', 'stationery'], category: 'Education', sub: 'Books' },
  { keywords: ['coursera', 'udemy', 'course', 'class', 'tuition', 'coaching'], category: 'Education', sub: 'Courses' },
  { keywords: ['exam', 'registration'], category: 'Education', sub: 'Exam Fees' },
  
  // Shopping
  { keywords: ['myntra', 'ajio', 'shirt', 't-shirt', 'clothing', 'clothes', 'jeans'], category: 'Shopping', sub: 'Clothing' },
  { keywords: ['shoes', 'sneakers', 'footwear'], category: 'Shopping', sub: 'Footwear' },
  { keywords: ['earphone', 'headphone', 'charger', 'gadget', 'electronics'], category: 'Shopping', sub: 'Electronics' },
  { keywords: ['amazon', 'flipkart', 'shopping'], category: 'Shopping', sub: 'Online Shopping' },
  
  // Health
  { keywords: ['medicine', 'pharmacy', 'medical', 'paracetamol', 'tablet'], category: 'Health', sub: 'Medicines' },
  { keywords: ['doctor', 'hospital', 'clinic'], category: 'Health', sub: 'Doctor Visit' },
  { keywords: ['gym', 'fitness', 'yoga'], category: 'Health', sub: 'Gym/Fitness' },
  
  // Personal Care
  { keywords: ['haircut', 'salon', 'spa', 'parlour'], category: 'Personal Care', sub: 'Salon' },
  { keywords: ['grooming', 'skincare'], category: 'Personal Care', sub: 'Grooming' },
  
  // Rent
  { keywords: ['rent', 'room rent', 'flat rent', 'pg', 'hostel fee'], category: 'Rent/Housing', sub: 'Rent' },
  { keywords: ['maintenance', 'society'], category: 'Rent/Housing', sub: 'Maintenance' },
  
  // Misc
  { keywords: ['gift', 'birthday', 'present'], category: 'Miscellaneous', sub: 'Gifts' },
  { keywords: ['donation', 'charity'], category: 'Miscellaneous', sub: 'Donations' },
];

// ===== CUSTOM MENU =====
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('💰 Finance Tracker')
    .addItem('🚀 Setup Everything', 'setupEverything')
    .addSeparator()
    .addItem('➕ Add Expense', 'showAddExpenseDialog')
    .addItem('🤖 AI Categorize All', 'categorizeAllExpenses')
    .addItem('📊 Refresh Dashboard', 'refreshDashboard')
    .addItem('📋 Add Sample Data', 'addSampleData')
    .addSeparator()
    .addItem('ℹ️ About', 'showAbout')
    .addToUi();
}

// ===== SETUP =====
function setupEverything() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  ui.alert('🚀 Setting Up', 'This will create all sheets, formulas, and formatting. Click OK to proceed.', ui.ButtonSet.OK);
  
  setupRawDataSheet(ss);
  setupCategoriesSheet(ss);
  setupMonthlySummarySheet(ss);
  setupWeeklyAnalysisSheet(ss);
  
  // Delete default Sheet1 if it exists and is empty
  try {
    const sheet1 = ss.getSheetByName('Sheet1');
    if (sheet1 && sheet1.getLastRow() <= 1) {
      ss.deleteSheet(sheet1);
    }
  } catch(e) {}
  
  ss.setActiveSheet(ss.getSheetByName('📝 Raw Data'));
  
  ui.alert('✅ Setup Complete!', 
    'Your expense tracker is ready!\n\n' +
    '• Use "💰 Finance Tracker → ➕ Add Expense" to log expenses\n' +
    '• Use "💰 Finance Tracker → 📋 Add Sample Data" to load test data\n' +
    '• Use "💰 Finance Tracker → 🤖 AI Categorize All" to auto-categorize\n' +
    '• Use "💰 Finance Tracker → 📊 Refresh Dashboard" to update charts\n\n' +
    'Or connect a Google Form for easier input!',
    ui.ButtonSet.OK
  );
}

// ===== SHEET 1: RAW DATA =====
function setupRawDataSheet(ss) {
  let sheet = ss.getSheetByName('📝 Raw Data');
  if (!sheet) {
    sheet = ss.insertSheet('📝 Raw Data');
  }
  
  // Clear and set up headers
  sheet.clear();
  const headers = ['Timestamp', 'Amount (₹)', 'Date', 'Description', 'Category (Override)', 'Category (AI)', 'Subcategory (AI)', 'Final Category'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#1a1a2e');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment('center');
  headerRange.setWrap(true);
  
  // Set column widths
  sheet.setColumnWidth(1, 160); // Timestamp
  sheet.setColumnWidth(2, 100); // Amount
  sheet.setColumnWidth(3, 110); // Date
  sheet.setColumnWidth(4, 250); // Description
  sheet.setColumnWidth(5, 140); // Override
  sheet.setColumnWidth(6, 130); // AI Category
  sheet.setColumnWidth(7, 130); // AI Subcategory
  sheet.setColumnWidth(8, 130); // Final Category
  
  // Add data validation for Category Override (Column E)
  const categoryList = Object.keys(CATEGORIES);
  const validationRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(categoryList, true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange('E2:E1000').setDataValidation(validationRule);
  
  // Add Final Category formula for first 200 rows
  for (let i = 2; i <= 200; i++) {
    sheet.getRange(i, 8).setFormula(`=IF(E${i}<>"", E${i}, IF(F${i}<>"", F${i}, ""))`);
  }
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Alternating colors
  sheet.getRange('A2:H1000').setBackground('#f8f9fa');
  for (let i = 2; i <= 50; i += 2) {
    sheet.getRange(i, 1, 1, 8).setBackground('#ffffff');
  }
  for (let i = 3; i <= 50; i += 2) {
    sheet.getRange(i, 1, 1, 8).setBackground('#f0f4ff');
  }
  
  // Format Amount column as currency
  sheet.getRange('B2:B1000').setNumberFormat('₹#,##0');
  
  // Format Date column
  sheet.getRange('C2:C1000').setNumberFormat('dd-MMM-yyyy');
}

// ===== SHEET 2: CATEGORIES =====
function setupCategoriesSheet(ss) {
  let sheet = ss.getSheetByName('📂 Categories');
  if (!sheet) {
    sheet = ss.insertSheet('📂 Categories');
  }
  
  sheet.clear();
  
  // Headers
  const headers = ['Category', 'Icon', 'Budget Threshold (%)', 'Monthly Limit (₹)', 'Subcategories'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#16213e');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  
  // Data
  const data = [];
  const subcategories = {
    'Food': 'Groceries, Dining Out, Delivery, Snacks, Coffee/Tea',
    'Transport': 'Fuel, Cab (Ola/Uber), Metro/Bus, Auto, Parking',
    'Entertainment': 'Movies, Streaming, Gaming, Outings',
    'Utilities': 'Electricity, Water, Internet, Mobile Recharge, DTH',
    'Education': 'Books, Courses, Exam Fees',
    'Shopping': 'Clothing, Footwear, Electronics, Accessories',
    'Health': 'Medicines, Doctor Visit, Gym/Fitness',
    'Personal Care': 'Salon, Grooming, Cosmetics',
    'Rent/Housing': 'Rent, Maintenance, Repairs',
    'Miscellaneous': 'Gifts, Donations, Uncategorized',
  };
  
  Object.entries(CATEGORIES).forEach(([name, cat]) => {
    data.push([name, cat.icon, cat.threshold, Math.round(BUDGET * cat.threshold / 100), subcategories[name] || '']);
  });
  
  sheet.getRange(2, 1, data.length, 5).setValues(data);
  
  // Format
  sheet.getRange('D2:D20').setNumberFormat('₹#,##0');
  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 50);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 350);
  
  // Color rows
  data.forEach((row, i) => {
    const rowRange = sheet.getRange(i + 2, 1, 1, 5);
    rowRange.setBackground(i % 2 === 0 ? '#ffffff' : '#f0f4ff');
  });
  
  sheet.setFrozenRows(1);
}

// ===== SHEET 3: MONTHLY SUMMARY =====
function setupMonthlySummarySheet(ss) {
  let sheet = ss.getSheetByName('📊 Monthly Summary');
  if (!sheet) {
    sheet = ss.insertSheet('📊 Monthly Summary');
  }
  
  sheet.clear();
  
  // ---- TOP SECTION: Budget Overview ----
  sheet.getRange('A1').setValue('📊 MONTHLY SUMMARY DASHBOARD');
  sheet.getRange('A1').setFontSize(14).setFontWeight('bold').setFontColor('#1a1a2e');
  sheet.getRange('A1:E1').merge().setBackground('#e8eaf6');
  
  // Budget overview
  sheet.getRange('A3').setValue('Monthly Budget:');
  sheet.getRange('B3').setValue(BUDGET).setNumberFormat('₹#,##0').setFontWeight('bold').setFontSize(12);
  
  sheet.getRange('A4').setValue('Total Spent:');
  sheet.getRange('B4').setFormula("=SUM('📝 Raw Data'!B2:B)").setNumberFormat('₹#,##0').setFontWeight('bold').setFontSize(12);
  
  sheet.getRange('A5').setValue('Amount Saved:');
  sheet.getRange('B5').setFormula('=B3-B4').setNumberFormat('₹#,##0').setFontWeight('bold').setFontSize(12).setFontColor('#10b981');
  
  sheet.getRange('A6').setValue('Savings Rate (%):');
  sheet.getRange('B6').setFormula('=IF(B3>0, ROUND(B5/B3*100, 1), 0)').setFontWeight('bold').setFontSize(12);
  
  sheet.getRange('A7').setValue('Savings Status:');
  sheet.getRange('B7').setFormula('=IF(B6>=15, "🌟 EXCELLENT", IF(B6>=10, "✅ ON TARGET", "⚠️ BELOW TARGET"))').setFontWeight('bold');
  
  // Format labels
  sheet.getRange('A3:A7').setFontWeight('bold').setFontColor('#4a4a6a');
  
  // Conditional formatting for savings
  const savingsRule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(15)
    .setBackground('#d1fae5')
    .setRanges([sheet.getRange('B6')])
    .build();
  const savingsRule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(10)
    .setBackground('#fee2e2')
    .setRanges([sheet.getRange('B6')])
    .build();
  sheet.setConditionalFormatRules([savingsRule1, savingsRule2]);
  
  // ---- CATEGORY BREAKDOWN ----
  sheet.getRange('A9').setValue('💳 CATEGORY-WISE BREAKDOWN');
  sheet.getRange('A9').setFontSize(12).setFontWeight('bold').setFontColor('#1a1a2e');
  sheet.getRange('A9:E9').merge().setBackground('#e8eaf6');
  
  const catHeaders = ['Category', 'Amount (₹)', '% of Total', 'Budget Limit (%)', 'Status'];
  sheet.getRange(10, 1, 1, 5).setValues([catHeaders]);
  sheet.getRange(10, 1, 1, 5).setBackground('#1a1a2e').setFontColor('#ffffff').setFontWeight('bold');
  
  let row = 11;
  Object.entries(CATEGORIES).forEach(([name, cat]) => {
    sheet.getRange(row, 1).setValue(`${cat.icon} ${name}`);
    sheet.getRange(row, 2).setFormula(`=SUMIF('📝 Raw Data'!H:H, "${name}", '📝 Raw Data'!B:B)`).setNumberFormat('₹#,##0');
    sheet.getRange(row, 3).setFormula(`=IF(B4>0, ROUND(B${row}/B4*100, 1), 0)`);
    sheet.getRange(row, 4).setValue(cat.threshold === 0 ? '—' : cat.threshold + '%');
    
    if (cat.threshold > 0) {
      sheet.getRange(row, 5).setFormula(
        `=IF(C${row}>${cat.threshold}, "🔴 OVER BUDGET", IF(C${row}>${cat.threshold - 5}, "🟡 NEAR LIMIT", "🟢 OK"))`
      );
    } else {
      sheet.getRange(row, 5).setValue('—');
    }
    
    // Alternating row colors
    sheet.getRange(row, 1, 1, 5).setBackground(row % 2 === 0 ? '#ffffff' : '#f8f9ff');
    row++;
  });
  
  // Conditional formatting for over-budget categories
  for (let r = 11; r < row; r++) {
    const statusRange = sheet.getRange(r, 5);
    const overRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('OVER')
      .setBackground('#fee2e2')
      .setFontColor('#dc2626')
      .setRanges([statusRange])
      .build();
    const nearRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('NEAR')
      .setBackground('#fef3c7')
      .setFontColor('#d97706')
      .setRanges([statusRange])
      .build();
    const okRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('OK')
      .setBackground('#d1fae5')
      .setFontColor('#059669')
      .setRanges([statusRange])
      .build();
    
    const existingRules = sheet.getConditionalFormatRules();
    existingRules.push(overRule, nearRule, okRule);
    sheet.setConditionalFormatRules(existingRules);
  }
  
  // Column widths
  sheet.setColumnWidth(1, 170);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 150);
  
  sheet.setFrozenRows(10);
}

// ===== SHEET 4: WEEKLY ANALYSIS =====
function setupWeeklyAnalysisSheet(ss) {
  let sheet = ss.getSheetByName('📅 Weekly Analysis');
  if (!sheet) {
    sheet = ss.insertSheet('📅 Weekly Analysis');
  }
  
  sheet.clear();
  
  sheet.getRange('A1').setValue('📅 WEEKLY SPENDING ANALYSIS');
  sheet.getRange('A1').setFontSize(14).setFontWeight('bold').setFontColor('#1a1a2e');
  sheet.getRange('A1:E1').merge().setBackground('#e8eaf6');
  
  const headers = ['Week', 'Total Spent (₹)', 'vs Previous Week', 'Change (%)', 'Spike?'];
  sheet.getRange(3, 1, 1, 5).setValues([headers]);
  sheet.getRange(3, 1, 1, 5).setBackground('#1a1a2e').setFontColor('#ffffff').setFontWeight('bold');
  
  const weeks = [
    { label: 'Week 1 (Day 1-7)', start: 1, end: 7 },
    { label: 'Week 2 (Day 8-14)', start: 8, end: 14 },
    { label: 'Week 3 (Day 15-21)', start: 15, end: 21 },
    { label: 'Week 4 (Day 22-31)', start: 22, end: 31 },
  ];
  
  weeks.forEach((week, i) => {
    const row = 4 + i;
    sheet.getRange(row, 1).setValue(week.label);
    
    // Sum for this week using SUMPRODUCT
    sheet.getRange(row, 2).setFormula(
      `=SUMPRODUCT((DAY('📝 Raw Data'!C2:C1000)>=${week.start})*(DAY('📝 Raw Data'!C2:C1000)<=${week.end})*('📝 Raw Data'!B2:B1000))`
    ).setNumberFormat('₹#,##0');
    
    if (i === 0) {
      sheet.getRange(row, 3).setValue('—');
      sheet.getRange(row, 4).setValue('—');
      sheet.getRange(row, 5).setValue('—');
    } else {
      const prevRow = row - 1;
      sheet.getRange(row, 3).setFormula(`=IF(B${prevRow}>0, B${row}-B${prevRow}, 0)`).setNumberFormat('₹#,##0');
      sheet.getRange(row, 4).setFormula(`=IF(B${prevRow}>0, ROUND((B${row}-B${prevRow})/B${prevRow}*100, 1), 0)`);
      sheet.getRange(row, 5).setFormula(`=IF(D${row}>20, "⚠️ SPIKE DETECTED", IF(D${row}<-20, "📉 Big Drop", "✅ Normal"))`);
    }
    
    sheet.getRange(row, 1, 1, 5).setBackground(i % 2 === 0 ? '#ffffff' : '#f0f4ff');
  });
  
  // Spike alert section
  sheet.getRange('A10').setValue('📌 SPIKE THRESHOLD: >20% week-over-week increase');
  sheet.getRange('A10').setFontColor('#6b7280').setFontStyle('italic');
  
  // Column widths
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 140);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 160);
}

// ===== AI CATEGORIZE FUNCTION =====
function categorizeExpense(description) {
  const desc = description.toLowerCase().trim();
  for (const rule of AI_RULES) {
    for (const keyword of rule.keywords) {
      if (desc.includes(keyword)) {
        return { category: rule.category, subcategory: rule.sub };
      }
    }
  }
  return { category: 'Miscellaneous', subcategory: 'Uncategorized' };
}

function categorizeAllExpenses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('📝 Raw Data');
  if (!sheet) return;
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('No expenses to categorize!');
    return;
  }
  
  let count = 0;
  for (let row = 2; row <= lastRow; row++) {
    const description = sheet.getRange(row, 4).getValue();
    const existingCat = sheet.getRange(row, 6).getValue();
    
    if (description && !existingCat) {
      const result = categorizeExpense(description.toString());
      sheet.getRange(row, 6).setValue(result.category);
      sheet.getRange(row, 7).setValue(result.subcategory);
      count++;
    }
  }
  
  SpreadsheetApp.getUi().alert(`🤖 AI Categorization Complete!\n\n${count} expense(s) categorized.`);
}

// ===== ADD EXPENSE DIALOG =====
function showAddExpenseDialog() {
  const html = HtmlService.createHtmlOutput(getAddExpenseHTML())
    .setWidth(420)
    .setHeight(520)
    .setTitle('➕ Add New Expense');
  SpreadsheetApp.getUi().showModalDialog(html, '➕ Add New Expense');
}

function addExpenseFromForm(amount, date, description, categoryOverride) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('📝 Raw Data');
  if (!sheet) return 'Error: Sheet not found. Run Setup first.';
  
  const ai = categorizeExpense(description);
  const finalCategory = categoryOverride || ai.category;
  const timestamp = new Date().toLocaleString('en-IN');
  
  const nextRow = sheet.getLastRow() + 1;
  sheet.getRange(nextRow, 1).setValue(timestamp);
  sheet.getRange(nextRow, 2).setValue(parseFloat(amount));
  sheet.getRange(nextRow, 3).setValue(new Date(date));
  sheet.getRange(nextRow, 4).setValue(description);
  sheet.getRange(nextRow, 5).setValue(categoryOverride || '');
  sheet.getRange(nextRow, 6).setValue(ai.category);
  sheet.getRange(nextRow, 7).setValue(ai.subcategory);
  // Column H has the formula already
  
  // Set alternating color
  const bgColor = nextRow % 2 === 0 ? '#ffffff' : '#f0f4ff';
  sheet.getRange(nextRow, 1, 1, 8).setBackground(bgColor);
  
  return `✅ Expense added!\n\n₹${amount} — ${description}\nAI Category: ${ai.category} → ${ai.subcategory}\nFinal: ${finalCategory}`;
}

// ===== ADD SAMPLE DATA =====
function addSampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('📝 Raw Data');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Run Setup first!');
    return;
  }
  
  const samples = [
    [250, '2025-04-01', 'Zomato lunch', ''],
    [150, '2025-04-01', 'Metro card recharge', ''],
    [499, '2025-04-02', 'Netflix monthly subscription', ''],
    [80,  '2025-04-02', 'Chai and samosa at canteen', ''],
    [1200,'2025-04-03', 'New t-shirt from Myntra', ''],
    [350, '2025-04-03', 'Uber to airport', ''],
    [200, '2025-04-04', 'Paracetamol from pharmacy', ''],
    [5000,'2025-04-04', 'Monthly room rent', 'Rent/Housing'],
    [120, '2025-04-05', 'Jio mobile recharge', ''],
    [450, '2025-04-05', 'Swiggy dinner', ''],
    [300, '2025-04-06', 'Haircut at salon', ''],
    [180, '2025-04-06', 'Auto rickshaw to market', ''],
    [850, '2025-04-07', 'Groceries from BigBasket', ''],
    [599, '2025-04-08', 'Coursera course subscription', ''],
    [60,  '2025-04-09', 'Tea and biscuits', ''],
    [1500,'2025-04-10', 'Electricity bill payment', ''],
    [320, '2025-04-11', 'Dominos pizza with friends', ''],
    [250, '2025-04-12', 'Movie tickets PVR', ''],
    [400, '2025-04-15', 'Uber to office', ''],
    [180, '2025-04-18', 'Maggi and juice at hostel', ''],
  ];
  
  samples.forEach(sample => {
    addExpenseFromForm(sample[0], sample[1], sample[2], sample[3]);
  });
  
  // Auto-categorize
  categorizeAllExpenses();
  
  SpreadsheetApp.getUi().alert('📋 Sample data loaded!\n\n20 expenses added and auto-categorized.\n\nCheck the "📊 Monthly Summary" tab to see your dashboard!');
}

// ===== REFRESH DASHBOARD =====
function refreshDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Force recalculation
  SpreadsheetApp.flush();
  
  // Create/update chart on Monthly Summary
  const summarySheet = ss.getSheetByName('📊 Monthly Summary');
  if (!summarySheet) return;
  
  // Remove existing charts
  summarySheet.getCharts().forEach(chart => summarySheet.removeChart(chart));
  
  // Create Pie Chart
  const pieChartBuilder = summarySheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(summarySheet.getRange('A11:A20'))  // Category names
    .addRange(summarySheet.getRange('B11:B20'))  // Amounts
    .setPosition(11, 7, 0, 0)
    .setOption('title', '📊 Expense Distribution by Category')
    .setOption('pieHole', 0.4)
    .setOption('width', 450)
    .setOption('height', 350)
    .setOption('backgroundColor', '#ffffff')
    .setOption('legend', { position: 'right' });
  
  summarySheet.insertChart(pieChartBuilder.build());
  
  SpreadsheetApp.getUi().alert('📊 Dashboard refreshed!\n\nCharts and formulas updated.');
}

// ===== ABOUT =====
function showAbout() {
  SpreadsheetApp.getUi().alert(
    'ℹ️ AI Personal Finance Tracker',
    '💰 AI Personal Finance Tracker & Advisor\n\n' +
    '📌 Version: 1.0\n' +
    '👤 Built for: FOAI CapStone Project\n' +
    '🛠️ Tech: Google Sheets + Apps Script\n' +
    '🤖 AI: Rule-based categorization engine\n\n' +
    'Features:\n' +
    '• Expense logging with AI categorization\n' +
    '• Budget threshold monitoring\n' +
    '• Weekly spike detection\n' +
    '• Category-wise breakdown\n' +
    '• Savings rate tracking\n' +
    '• Conditional formatting alerts',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ===== FORM RESPONSE TRIGGER =====
// This function runs automatically when a Google Form submits a response
function onFormSubmit(e) {
  if (!e) return;
  
  const sheet = e.range.getSheet();
  const row = e.range.getRow();
  
  // Get the description (Column D)
  const description = sheet.getRange(row, 4).getValue();
  if (!description) return;
  
  // AI categorize
  const result = categorizeExpense(description.toString());
  sheet.getRange(row, 6).setValue(result.category);
  sheet.getRange(row, 7).setValue(result.subcategory);
  
  // Alternating color
  const bgColor = row % 2 === 0 ? '#ffffff' : '#f0f4ff';
  sheet.getRange(row, 1, 1, 8).setBackground(bgColor);
}

// ===== HTML FOR ADD EXPENSE DIALOG =====
function getAddExpenseHTML() {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f7ff; padding: 20px; }
    h2 { color: #1a1a2e; margin-bottom: 16px; font-size: 18px; }
    .form-group { margin-bottom: 14px; }
    label { display: block; font-size: 12px; font-weight: 600; color: #4a4a6a; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    input, select { width: 100%; padding: 10px 12px; border: 2px solid #e0e4f0; border-radius: 8px; font-size: 14px; outline: none; transition: border 0.3s; background: white; }
    input:focus, select:focus { border-color: #6c5ce7; }
    .required { color: #ef4444; }
    .btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #6c5ce7, #3b82f6); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 10px; transition: transform 0.2s; }
    .btn:hover { transform: translateY(-2px); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    #result { margin-top: 12px; padding: 12px; border-radius: 8px; font-size: 13px; display: none; white-space: pre-line; }
    .success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
    .error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .hint { font-size: 11px; color: #9ca3af; margin-top: 2px; }
  </style>
</head>
<body>
  <h2>💰 Log New Expense</h2>
  <div class="form-group">
    <label>Amount (₹) <span class="required">*</span></label>
    <input type="number" id="amount" placeholder="250" min="1" required>
  </div>
  <div class="form-group">
    <label>Date <span class="required">*</span></label>
    <input type="date" id="date" required>
  </div>
  <div class="form-group">
    <label>Description <span class="required">*</span></label>
    <input type="text" id="description" placeholder="e.g., Zomato lunch, Uber to college">
    <div class="hint">Be specific for better AI categorization</div>
  </div>
  <div class="form-group">
    <label>Category Override (optional)</label>
    <select id="override">
      <option value="">🤖 Let AI decide</option>
      <option value="Food">🍕 Food</option>
      <option value="Transport">🚗 Transport</option>
      <option value="Entertainment">🎬 Entertainment</option>
      <option value="Utilities">💡 Utilities</option>
      <option value="Education">📚 Education</option>
      <option value="Shopping">🛍️ Shopping</option>
      <option value="Health">💊 Health</option>
      <option value="Personal Care">💇 Personal Care</option>
      <option value="Rent/Housing">🏠 Rent/Housing</option>
      <option value="Miscellaneous">📦 Miscellaneous</option>
    </select>
  </div>
  <button class="btn" id="submitBtn" onclick="submitExpense()">Add Expense →</button>
  <div id="result"></div>
  
  <script>
    // Set today's date
    document.getElementById('date').valueAsDate = new Date();
    
    function submitExpense() {
      const amount = document.getElementById('amount').value;
      const date = document.getElementById('date').value;
      const description = document.getElementById('description').value;
      const override = document.getElementById('override').value;
      
      if (!amount || !date || !description) {
        showResult('Please fill all required fields!', 'error');
        return;
      }
      
      document.getElementById('submitBtn').disabled = true;
      document.getElementById('submitBtn').textContent = 'Adding...';
      
      google.script.run
        .withSuccessHandler(function(msg) {
          showResult(msg, 'success');
          document.getElementById('amount').value = '';
          document.getElementById('description').value = '';
          document.getElementById('override').value = '';
          document.getElementById('submitBtn').disabled = false;
          document.getElementById('submitBtn').textContent = 'Add Expense →';
        })
        .withFailureHandler(function(err) {
          showResult('Error: ' + err.message, 'error');
          document.getElementById('submitBtn').disabled = false;
          document.getElementById('submitBtn').textContent = 'Add Expense →';
        })
        .addExpenseFromForm(amount, date, description, override);
    }
    
    function showResult(msg, type) {
      const el = document.getElementById('result');
      el.textContent = msg;
      el.className = type;
      el.style.display = 'block';
      setTimeout(() => { el.style.display = 'none'; }, 4000);
    }
  </script>
</body>
</html>`;
}
