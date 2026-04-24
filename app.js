/* ==========================================
   AI Personal Finance Tracker - App Logic
   ========================================== */

// ===== CONFIGURATION =====
const CONFIG = {
    monthlyBudget: parseInt(localStorage.getItem('financeai_budget')) || 15000,
    savingsTargetMin: 10,
    savingsTargetMax: 15,
    spikeThreshold: 20,

    // ⬇️ GOOGLE SHEETS CONFIGURATION ⬇️
    sheetCsvUrl: 'https://docs.google.com/spreadsheets/d/18_kS3zuA3mkE87lxPZkBXra4kjJk4esB7RkDpzVCWBc/gviz/tq?tqx=out:csv&gid=1488467775',
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScYU-Iz4EYuGzhTB17QlA1KJc0YIz6QJkFVqdodrrlD9hspqw/viewform?embedded=true',

    categories: {
        'Food':          { threshold: 35, icon: '🍕', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f97316)', description: 'Groceries, dining out, and food delivery apps' },
        'Transport':     { threshold: 15, icon: '🚗', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)', description: 'Cabs, metro, bus, fuel, and parking' },
        'Entertainment': { threshold: 10, icon: '🎬', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #a855f7)', description: 'Movies, streaming, outings, and hobbies' },
        'Utilities':     { threshold: 10, icon: '💡', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #eab308)', description: 'Bills, recharge, internet, and subscriptions' },
        'Education':     { threshold: 10, icon: '📚', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)', description: 'Books, courses, and educational tools' },
        'Shopping':      { threshold: 10, icon: '🛍️', color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)', description: 'Clothes, electronics, and online shopping' },
        'Health':        { threshold: 5,  icon: '💊', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', description: 'Medicine, gym, and medical visits' },
        'Personal Care': { threshold: 5,  icon: '💇', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ef4444)', description: 'Salon, grooming, and cosmetics' },
        'Rent/Housing':  { threshold: 0,  icon: '🏠', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)', description: 'Monthly rent, PG fees, and maintenance' },
        'Miscellaneous': { threshold: 5,  icon: '📦', color: '#1e3a8a', gradient: 'linear-gradient(135deg, #1e40af, #1e3a8a)', description: 'Gifts, donations, and other random expenses' },
        'Academics':     { threshold: 10, icon: '🎓', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)', description: 'School/College fees and related expenses' },
    }
};

// ===== AI CATEGORIZATION ENGINE =====
const AI_RULES = [
    // Food
    { keywords: ['zomato', 'swiggy', 'food delivery', 'delivery'], category: 'Food', subcategory: 'Delivery' },
    { keywords: ['grocery', 'groceries', 'bigbasket', 'blinkit', 'zepto', 'vegetables', 'fruits', 'dairy'], category: 'Food', subcategory: 'Groceries' },
    { keywords: ['restaurant', 'dining', 'dine', 'dominos', 'pizza', 'burger', 'mcdonald', 'kfc', 'biryani'], category: 'Food', subcategory: 'Dining Out' },
    { keywords: ['chai', 'tea', 'coffee', 'starbucks', 'ccd', 'cafe'], category: 'Food', subcategory: 'Coffee/Tea' },
    { keywords: ['snack', 'biscuit', 'chips', 'samosa', 'maggi', 'juice', 'canteen'], category: 'Food', subcategory: 'Snacks' },
    { keywords: ['lunch', 'dinner', 'breakfast', 'meal', 'food', 'eat', 'tiffin', 'mess'], category: 'Food', subcategory: 'Dining Out' },

    // Transport
    { keywords: ['uber', 'ola', 'rapido', 'indrive', 'cab', 'taxi'], category: 'Transport', subcategory: 'Cab' },
    { keywords: ['metro', 'bus', 'train', 'public transport'], category: 'Transport', subcategory: 'Metro/Bus' },
    { keywords: ['auto', 'rickshaw', 'auto rickshaw'], category: 'Transport', subcategory: 'Auto' },
    { keywords: ['petrol', 'fuel', 'diesel', 'cng', 'gas station'], category: 'Transport', subcategory: 'Fuel' },
    { keywords: ['parking'], category: 'Transport', subcategory: 'Parking' },

    // Entertainment
    { keywords: ['netflix', 'prime', 'hotstar', 'disney', 'streaming', 'jiocinema'], category: 'Entertainment', subcategory: 'Streaming' },
    { keywords: ['spotify', 'music', 'apple music', 'youtube premium'], category: 'Entertainment', subcategory: 'Streaming' },
    { keywords: ['movie', 'pvr', 'inox', 'cinema', 'theatre', 'theater'], category: 'Entertainment', subcategory: 'Movies' },
    { keywords: ['game', 'gaming', 'playstation', 'xbox', 'steam'], category: 'Entertainment', subcategory: 'Gaming' },
    { keywords: ['outing', 'trip', 'picnic', 'party', 'club'], category: 'Entertainment', subcategory: 'Outings' },

    // Utilities
    { keywords: ['electricity', 'electric bill', 'power bill'], category: 'Utilities', subcategory: 'Electricity' },
    { keywords: ['water bill', 'water'], category: 'Utilities', subcategory: 'Water' },
    { keywords: ['internet', 'wifi', 'broadband', 'fiber'], category: 'Utilities', subcategory: 'Internet' },
    { keywords: ['recharge', 'jio', 'airtel', 'vi ', 'vodafone', 'mobile'], category: 'Utilities', subcategory: 'Mobile Recharge' },
    { keywords: ['dth', 'tata sky', 'dish tv'], category: 'Utilities', subcategory: 'DTH' },

    // Education
    { keywords: ['book', 'textbook', 'notebook', 'stationery'], category: 'Education', subcategory: 'Books' },
    { keywords: ['coursera', 'udemy', 'course', 'class', 'tuition', 'coaching'], category: 'Education', subcategory: 'Courses' },
    { keywords: ['exam', 'registration', 'test fee'], category: 'Education', subcategory: 'Exam Fees' },

    // Shopping
    { keywords: ['myntra', 'ajio', 'shirt', 't-shirt', 'tshirt', 'clothing', 'clothes', 'jeans', 'kurta'], category: 'Shopping', subcategory: 'Clothing' },
    { keywords: ['shoes', 'sneakers', 'footwear', 'sandals', 'slippers'], category: 'Shopping', subcategory: 'Footwear' },
    { keywords: ['earphone', 'headphone', 'charger', 'cable', 'gadget', 'electronics'], category: 'Shopping', subcategory: 'Electronics' },
    { keywords: ['amazon', 'flipkart', 'shopping', 'online order'], category: 'Shopping', subcategory: 'Online Shopping' },

    // Health
    { keywords: ['medicine', 'pharmacy', 'medical', 'paracetamol', 'tablet', 'pills', 'drug store'], category: 'Health', subcategory: 'Medicines' },
    { keywords: ['doctor', 'hospital', 'clinic', 'consultation', 'checkup'], category: 'Health', subcategory: 'Doctor Visit' },
    { keywords: ['gym', 'fitness', 'yoga', 'workout'], category: 'Health', subcategory: 'Gym/Fitness' },

    // Personal Care
    { keywords: ['haircut', 'salon', 'spa', 'parlour', 'parlor'], category: 'Personal Care', subcategory: 'Salon' },
    { keywords: ['grooming', 'shaving', 'skincare', 'face wash'], category: 'Personal Care', subcategory: 'Grooming' },
    { keywords: ['cosmetic', 'makeup', 'beauty'], category: 'Personal Care', subcategory: 'Cosmetics' },

    // Rent/Housing
    { keywords: ['rent', 'room rent', 'flat rent', 'pg rent', 'hostel fee'], category: 'Rent/Housing', subcategory: 'Rent' },
    { keywords: ['maintenance', 'society'], category: 'Rent/Housing', subcategory: 'Maintenance' },

    // Miscellaneous
    { keywords: ['gift', 'birthday', 'present'], category: 'Miscellaneous', subcategory: 'Gifts' },
    { keywords: ['donation', 'charity', 'temple'], category: 'Miscellaneous', subcategory: 'Donations' },
];

function aiCategorize(description) {
    const desc = description.toLowerCase().trim();
    for (const rule of AI_RULES) {
        for (const keyword of rule.keywords) {
            if (desc.includes(keyword)) {
                return { category: rule.category, subcategory: rule.subcategory };
            }
        }
    }
    return { category: 'Miscellaneous', subcategory: 'Uncategorized' };
}

// ===== DATA MANAGEMENT =====
const STORAGE_KEY = 'financeai_expenses_cache';
const OVERRIDE_KEY = 'financeai_amount_overrides';

let cachedExpenses = [];

async function loadExpenses(forceRefresh = false) {
    // If cleared in this session and not forcing refresh, return empty
    if (sessionStorage.getItem('financeai_cleared') === 'true' && !forceRefresh) {
        return [];
    }

    if (cachedExpenses.length > 0 && !forceRefresh) {
        return applyLocalOverrides(cachedExpenses);
    }

    try {
        updateSyncStatus('syncing');
        const response = await fetch(CONFIG.sheetCsvUrl);
        const csvText = await response.text();
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        
        // Skip header
        const dataRows = rows.slice(1);
        
        // Get clear timestamp for permanent filtering
        const clearTimestampStr = localStorage.getItem('financeai_clear_timestamp');
        const clearTimestamp = clearTimestampStr ? new Date(clearTimestampStr).getTime() : 0;

        const expenses = dataRows.map((row, index) => {
            const cols = parseCsvRow(row);
            const dateStr = cols[0] || '';
            const timestamp = new Date(dateStr).getTime();
            
            // Skip if older than clear timestamp
            if (timestamp <= clearTimestamp) return null;

            const amount = parseFloat(cols[1]) || 0;
            const description = cols[2] || '';
            const categoryOverride = cols[3] || '';
            
            // Get AI category from column 4, fallback to local logic if needed
            let aiCategoryFull = cols[4] || '';
            let aiCategory, aiSubcategory;

            if (!aiCategoryFull || aiCategoryFull === 'Miscellaneous' || aiCategoryFull === 'Uncategorized') {
                const localAI = aiCategorize(description);
                aiCategory = localAI.category;
                aiSubcategory = localAI.subcategory;
            } else {
                const parts = aiCategoryFull.split(' - ');
                aiCategory = parts[0].trim();
                aiSubcategory = parts[1] || 'Uncategorized';
            }

            const dateObj = new Date(dateStr);
            const date = isNaN(dateObj.getTime()) ? new Date().toISOString().split('T')[0] : dateObj.toISOString().split('T')[0];

            return {
                id: `sheet-${index}`,
                amount,
                date,
                description,
                categoryOverride,
                aiCategory,
                aiSubcategory,
                finalCategory: categoryOverride || aiCategory,
                timestamp: dateStr,
                rawTimestamp: timestamp
            };
        }).filter(e => e !== null);

        cachedExpenses = expenses.reverse(); // Newest first
        updateSyncStatus('synced');
        return applyLocalOverrides(cachedExpenses);
    } catch (err) {
        console.error('❌ Failed to fetch from Google Sheets:', err);
        updateSyncStatus('error');
        // Fallback to local storage cache if available
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            cachedExpenses = JSON.parse(localData);
            return applyLocalOverrides(cachedExpenses);
        }
        return [];
    }
}

function parseCsvRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

function applyLocalOverrides(expenses) {
    const overrides = getAmountOverrides();
    return expenses.map(e => {
        if (overrides[e.id]) {
            return { ...e, amount: overrides[e.id], isEdited: true };
        }
        return e;
    });
}

function getAmountOverrides() {
    const data = localStorage.getItem(OVERRIDE_KEY);
    return data ? JSON.parse(data) : {};
}

function saveAmountOverride(id, amount) {
    const overrides = getAmountOverrides();
    overrides[id] = parseFloat(amount);
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
}

async function handleClearAll() {
    if (!confirm('Are you sure? This will hide all existing data and start a fresh record. (Your actual Google Sheet will keep its history)')) return;
    
    console.log('🧹 Permanently clearing local view...');
    
    // Save current time as clear timestamp
    localStorage.setItem('financeai_clear_timestamp', new Date().toISOString());
    
    cachedExpenses = [];
    localStorage.removeItem('financeai_expenses_cache');
    localStorage.removeItem('financeai_amount_overrides');
    
    // Immediate UI reset
    await updateDashboard();
    updateExpensesTable();
    await updateInsights();
    
    // Show feedback
    const toast = document.getElementById('toast');
    if (toast) {
        toast.querySelector('span').textContent = '✨ Starting fresh! Old entries hidden.';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function checkMonthlyReset() {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const lastMonthKey = localStorage.getItem('financeai_last_active_month');

    if (lastMonthKey && lastMonthKey !== currentMonthKey) {
        if (confirm(`Welcome to a new month! 📅\n\nWould you like to clear your previous data and start fresh for ${now.toLocaleString('default', { month: 'long' })}?`)) {
            handleClearAll();
        }
    }
    
    localStorage.setItem('financeai_last_active_month', currentMonthKey);
}

function addExpense(expense) {
    const expenses = loadExpenses();
    expense.id = Date.now();
    expense.timestamp = new Date().toISOString();
    expenses.unshift(expense);
    saveExpenses(expenses);

    // Also send to Google Sheets if connected
    sendToGoogleSheets(expense);

    return expense;
}

// ===== GOOGLE SHEETS SYNC =====
function sendToGoogleSheets(expense) {
    if (!CONFIG.googleSheetsUrl) {
        updateSyncStatus('not-connected');
        return;
    }

    updateSyncStatus('syncing');

    fetch(CONFIG.googleSheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: expense.amount,
            date: expense.date,
            description: expense.description,
            categoryOverride: expense.categoryOverride || '',
        }),
    })
    .then(() => {
        // no-cors means we can't read the response, but if it didn't throw, it was sent
        updateSyncStatus('synced');
        console.log('✅ Sent to Google Sheets:', expense.description);
    })
    .catch(err => {
        updateSyncStatus('error');
        console.error('❌ Google Sheets sync failed:', err);
    });
}

function updateSyncStatus(status) {
    const indicator = document.getElementById('syncStatus');
    if (!indicator) return;

    const states = {
        'not-connected': { text: '⚪ Sheets: Not Connected', class: 'sync-off' },
        'syncing':       { text: '🔄 Fetching from Sheets...', class: 'sync-pending' },
        'synced':        { text: '🟢 Connected to Google Sheets', class: 'sync-ok' },
        'error':         { text: '🔴 Sheets Fetch Failed', class: 'sync-error' },
    };

    const s = states[status] || states['not-connected'];
    indicator.textContent = s.text;
    indicator.className = 'sync-indicator ' + s.class;
}

function deleteExpense(id) {
    let expenses = loadExpenses();
    expenses = expenses.filter(e => e.id !== id);
    saveExpenses(expenses);
}

function clearAllExpenses() {
    saveExpenses([]);
}

// ===== SAMPLE DATA (Disabled for Sheet Integration) =====
function loadSampleData() {
    // No longer needed as we fetch from Google Sheets
}

// ===== UI CONTROLLERS =====

// Particles
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (8 + Math.random() * 15) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        const colors = ['#6c5ce7', '#3b82f6', '#06b6d4', '#10b981', '#ec4899'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
    }
}

// Tabs
function initTabs() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Overlay Flow
    const budgetOverlay = document.getElementById('budgetOverlay');
    const formOverlay = document.getElementById('formOverlay');
    const budgetInput = document.getElementById('initialBudgetInput');

    // Step 1: Set Budget
    document.getElementById('setBudgetBtn').addEventListener('click', () => {
        const val = parseInt(budgetInput.value);
        if (val && val >= 100) {
            CONFIG.monthlyBudget = val;
            localStorage.setItem('financeai_budget', val);
            budgetOverlay.classList.add('hidden');
            updateDashboard();
            updateInsights();
        } else {
            alert('Please enter a valid monthly budget (min ₹100)');
        }
    });

    // Close Form Overlay
    const closeFormBtn = document.getElementById('closeFormOverlay');
    if (closeFormBtn) {
        closeFormBtn.addEventListener('click', () => {
            formOverlay.classList.add('hidden');
            refreshAllData();
        });
    }

    // Header Budget Edit
    document.getElementById('editBudgetIcon').addEventListener('click', () => {
        budgetInput.value = CONFIG.monthlyBudget;
        budgetOverlay.classList.remove('hidden');
    });
}

// ===== DASHBOARD =====
let pieChart, lineChart;

async function refreshAllData() {
    sessionStorage.removeItem('financeai_cleared');
    await loadExpenses(true);
    updateDashboard();
    updateExpensesTable();
    updateInsights();
}

async function updateDashboard() {
    const allExpenses = await loadExpenses();
    
    // Filter for THIS month only
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const expenses = allExpenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const saved = CONFIG.monthlyBudget - totalSpent;
    const savingsRate = CONFIG.monthlyBudget > 0 ? (saved / CONFIG.monthlyBudget * 100) : 100;
    const budgetPct = Math.min((totalSpent / CONFIG.monthlyBudget) * 100, 100);

    // Header
    document.getElementById('headerTotal').textContent = `₹${totalSpent.toLocaleString('en-IN')}`;
    document.getElementById('headerBudget').textContent = `₹${CONFIG.monthlyBudget.toLocaleString('en-IN')}`;
    document.getElementById('headerSavings').textContent = `${Math.max(0, savingsRate).toFixed(0)}%`;
    document.getElementById('headerSavings').style.color = savingsRate >= 10 ? '#10b981' : '#ef4444';

    // Summary cards
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toLocaleString('en-IN')}`;
    document.getElementById('cardBudget').textContent = `₹${CONFIG.monthlyBudget.toLocaleString('en-IN')}`;
    document.getElementById('totalSaved').textContent = `₹${Math.max(0, saved).toLocaleString('en-IN')}`;
    document.getElementById('totalTransactions').textContent = expenses.length;

    const avg = expenses.length > 0 ? Math.round(totalSpent / expenses.length) : 0;
    document.getElementById('avgTransaction').textContent = `Avg: ₹${avg.toLocaleString('en-IN')}`;

    // Budget progress
    document.getElementById('budgetProgress').style.width = budgetPct + '%';
    document.getElementById('budgetProgress').style.background = 
        budgetPct > 90 ? 'linear-gradient(135deg, #ef4444, #ec4899)' :
        budgetPct > 70 ? 'linear-gradient(135deg, #f59e0b, #f97316)' :
        'var(--gradient-primary)';

    // Trends
    const spentTrend = document.getElementById('spentTrend');
    if (totalSpent > CONFIG.monthlyBudget) {
        spentTrend.textContent = '⚠️ Over budget!';
        spentTrend.className = 'card-trend negative';
    } else if (totalSpent > CONFIG.monthlyBudget * 0.8) {
        spentTrend.textContent = '⚡ Almost at limit';
        spentTrend.className = 'card-trend negative';
    } else {
        spentTrend.textContent = `${budgetPct.toFixed(0)}% used`;
        spentTrend.className = 'card-trend';
    }

    const savingsTrend = document.getElementById('savingsTrend');
    if (savingsRate >= 15) {
        savingsTrend.textContent = '🌟 Excellent!';
        savingsTrend.className = 'card-trend positive';
    } else if (savingsRate >= 10) {
        savingsTrend.textContent = '✅ On target';
        savingsTrend.className = 'card-trend positive';
    } else {
        savingsTrend.textContent = '⚠️ Below target';
        savingsTrend.className = 'card-trend negative';
    }

    // Category breakdown
    updateCategoryBars(expenses, totalSpent);
    updateCharts(expenses);
}

function updateCategoryBars(expenses, totalSpent) {
    const container = document.getElementById('categoryBars');
    container.innerHTML = '';

    Object.entries(CONFIG.categories).forEach(([name, cat]) => {
        const catTotal = expenses.filter(e => e.finalCategory === name).reduce((s, e) => s + e.amount, 0);
        const pct = totalSpent > 0 ? (catTotal / totalSpent * 100) : 0;

        let statusClass, statusText;
        if (cat.threshold === 0) {
            statusClass = 'status-ok';
            statusText = '—';
        } else if (pct > cat.threshold) {
            statusClass = 'status-over';
            statusText = '🔴 OVER';
        } else if (pct > cat.threshold - 5) {
            statusClass = 'status-near';
            statusText = '🟡 NEAR';
        } else {
            statusClass = 'status-ok';
            statusText = '🟢 OK';
        }

        const barWidth = cat.threshold > 0 ? Math.min((pct / cat.threshold) * 100, 100) : (pct > 0 ? 50 : 0);
        const barColor = pct > cat.threshold ? '#ef4444' : pct > cat.threshold - 5 ? '#f59e0b' : cat.color;

        container.innerHTML += `
            <div class="category-bar-item">
                <span class="cat-name">${cat.icon} ${name}</span>
                <div class="cat-bar-wrapper">
                    <div class="cat-bar-fill" style="width: ${barWidth}%; background: ${barColor};"></div>
                </div>
                <span class="cat-amount">₹${catTotal.toLocaleString('en-IN')}</span>
                <span class="cat-status ${statusClass}">${statusText}</span>
            </div>
        `;
    });
}

function updateCharts(expenses) {
    const categoryTotals = {};
    expenses.forEach(e => {
        const cat = e.finalCategory || 'Miscellaneous';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + e.amount;
    });

    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();

    const pieLabels = Object.keys(categoryTotals);
    const pieData = Object.values(categoryTotals);
    const pieColors = pieLabels.map(l => {
        return CONFIG.categories[l] ? CONFIG.categories[l].color : '#6b7280'; // Fallback to grey
    });

    pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: pieLabels,
            datasets: [{
                data: pieData,
                backgroundColor: pieColors,
                borderColor: '#1a1f35',
                borderWidth: 3,
                hoverBorderWidth: 0,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#9ca3bf',
                        font: { family: 'Inter', size: 11 },
                        padding: 12,
                        usePointStyle: true,
                        pointStyleWidth: 8,
                    }
                },
                tooltip: {
                    backgroundColor: '#1a1f35',
                    titleColor: '#f0f0f5',
                    bodyColor: '#9ca3bf',
                    borderColor: '#2a3050',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = ((ctx.raw / total) * 100).toFixed(1);
                            return ` ₹${ctx.raw.toLocaleString('en-IN')} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });

    // Line Chart - Cumulative Monthly Spending
    const dailyMap = {};
    expenses.forEach(e => {
        dailyMap[e.date] = (dailyMap[e.date] || 0) + e.amount;
    });
    
    const sortedDates = Object.keys(dailyMap).sort();
    
    // Calculate cumulative totals
    let runningTotal = 0;
    const cumulativeAmounts = sortedDates.map(d => {
        runningTotal += dailyMap[d];
        return runningTotal;
    });

    const dateLabels = sortedDates.map(d => {
        const dt = new Date(d);
        return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    });

    const lineCtx = document.getElementById('lineChart').getContext('2d');
    if (lineChart) lineChart.destroy();

    const gradient = lineCtx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(108, 92, 231, 0.3)');
    gradient.addColorStop(1, 'rgba(108, 92, 231, 0.0)');

    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [{
                label: 'Cumulative Spending (₹)',
                data: cumulativeAmounts,
                borderColor: '#6c5ce7',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                borderWidth: 2.5,
                pointBackgroundColor: '#6c5ce7',
                pointBorderColor: '#1a1f35',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#6b7280', font: { family: 'Inter', size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: {
                        color: '#6b7280',
                        font: { family: 'Inter', size: 10 },
                        callback: v => '₹' + v.toLocaleString('en-IN'),
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1f35',
                    titleColor: '#f0f0f5',
                    bodyColor: '#9ca3bf',
                    borderColor: '#2a3050',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => ` ₹${ctx.raw.toLocaleString('en-IN')}`
                    }
                }
            }
        }
    });
}

// ===== EXPENSE FORM (Replaced by Google Form) =====
function initForm() {
    const iframes = document.querySelectorAll('.iframe-container iframe');
    const pageLoadTime = Date.now();

    iframes.forEach(iframe => {
        iframe.addEventListener('load', () => {
            // Ignore loads that happen within 3 seconds of the initial page load
            if (Date.now() - pageLoadTime < 3000) return;

            console.log('🔄 Possible form submission detected. Syncing...');
            triggerAutoSync();
        });
    });
}

function triggerAutoSync() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.querySelector('span').textContent = '🔄 Syncing with Google Sheets...';
        toast.classList.add('show');
    }

    // Wait 3 seconds for Google Sheets to process the new entry
    setTimeout(async () => {
        await refreshAllData();
        if (toast) {
            toast.querySelector('span').textContent = '✅ Dashboard Updated!';
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
    }, 3000);
}

// ===== EXPENSES TABLE =====
async function updateExpensesTable() {
    const expenses = await loadExpenses();
    const filter = document.getElementById('filterCategory').value;
    const tbody = document.getElementById('expensesBody');
    const emptyState = document.getElementById('emptyState');

    const filtered = filter === 'all' ? expenses : expenses.filter(e => e.finalCategory === filter);

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    tbody.innerHTML = filtered.map(e => {
        const catConfig = CONFIG.categories[e.finalCategory] || CONFIG.categories['Miscellaneous'];
        const aiCatConfig = CONFIG.categories[e.aiCategory] || CONFIG.categories['Miscellaneous'];
        const dateFormatted = new Date(e.date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        return `
            <tr>
                <td>${dateFormatted}</td>
                <td>${e.description}</td>
                <td class="amount-cell" id="amount-${e.id}">
                    <span class="amount-val">₹${e.amount.toLocaleString('en-IN')}</span>
                    ${e.isEdited ? '<span class="edited-tag" title="Locally edited">*</span>' : ''}
                </td>
                <td>
                    <span class="category-badge ai-badge-hint" 
                          style="background: ${aiCatConfig.color}15; color: ${aiCatConfig.color}; border: 1px solid ${aiCatConfig.color}30;"
                          title="${aiCatConfig.description}">
                        ${aiCatConfig.icon || '📦'} ${e.aiCategory}
                    </span>
                </td>
                <td>
                    <span class="category-badge" 
                          style="background: ${catConfig.color}20; color: ${catConfig.color}; border: 1px solid ${catConfig.color}40;"
                          title="${catConfig.description}">
                        ${catConfig.icon || '📦'} ${e.finalCategory}
                    </span>
                </td>
                <td>
                    <div class="actions-cell">
                        <button class="edit-btn" onclick="startEditAmount('${e.id}', ${e.amount})" title="Edit Amount">✏️</button>
                        <button class="delete-btn" onclick="handleDelete('${e.id}')" title="Hide Expense">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function handleDelete(id) {
    // For sheet integration, we just filter it out locally
    cachedExpenses = cachedExpenses.filter(e => e.id !== id);
    updateDashboard();
    updateExpensesTable();
    updateInsights();
}

function startEditAmount(id, currentAmount) {
    const cell = document.getElementById(`amount-${id}`);
    if (!cell) return;
    
    cell.innerHTML = `
        <input type="number" class="amount-edit-input" value="${currentAmount}" 
               onblur="finishEditAmount('${id}', this.value)" 
               onkeydown="if(event.key==='Enter') this.blur()">
    `;
    cell.querySelector('input').focus();
}

function finishEditAmount(id, newAmount) {
    if (newAmount && !isNaN(newAmount)) {
        saveAmountOverride(id, newAmount);
        refreshAllData();
    } else {
        updateExpensesTable(); // Reset if invalid
    }
}

// ===== AI INSIGHTS =====
async function updateInsights() {
    const allExpenses = await loadExpenses();
    
    // Filter for THIS month only
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const expenses = allExpenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

    // Alerts
    const alertsSection = document.getElementById('alertsSection');
    let alertsHTML = '';
    let alertDelay = 0;

    if (expenses.length === 0) {
        alertsHTML = '<div class="alert-card alert-warning" style="animation-delay: 0s;"><span class="alert-icon">📭</span><span>No expenses logged yet. Add some expenses to see insights!</span></div>';
    } else {
        // Category alerts
        Object.entries(CONFIG.categories).forEach(([name, cat]) => {
            if (cat.threshold === 0) return;
            const catTotal = expenses.filter(e => e.finalCategory === name).reduce((s, e) => s + e.amount, 0);
            const pct = totalSpent > 0 ? (catTotal / totalSpent * 100) : 0;

            if (pct > cat.threshold) {
                alertsHTML += `
                    <div class="alert-card alert-danger" style="animation-delay: ${alertDelay * 0.1}s;">
                        <span class="alert-icon">🔴</span>
                        <span><strong>${name}</strong> spending is at ${pct.toFixed(1)}% (limit: ${cat.threshold}%). You've spent ₹${catTotal.toLocaleString('en-IN')} in this category.</span>
                    </div>`;
                alertDelay++;
            } else if (pct > cat.threshold - 5 && catTotal > 0) {
                alertsHTML += `
                    <div class="alert-card alert-warning" style="animation-delay: ${alertDelay * 0.1}s;">
                        <span class="alert-icon">🟡</span>
                        <span><strong>${name}</strong> spending is at ${pct.toFixed(1)}% — approaching the ${cat.threshold}% limit.</span>
                    </div>`;
                alertDelay++;
            }
        });

        // Budget alert
        if (totalSpent > CONFIG.monthlyBudget) {
            alertsHTML = `
                <div class="alert-card alert-danger" style="animation-delay: 0s;">
                    <span class="alert-icon">🚨</span>
                    <span><strong>Budget Exceeded!</strong> You've spent ₹${totalSpent.toLocaleString('en-IN')} against a budget of ₹${CONFIG.monthlyBudget.toLocaleString('en-IN')}.</span>
                </div>` + alertsHTML;
        }

        // Savings check
        const savingsRate = ((CONFIG.monthlyBudget - totalSpent) / CONFIG.monthlyBudget * 100);
        if (savingsRate >= 15) {
            alertsHTML += `
                <div class="alert-card alert-success" style="animation-delay: ${alertDelay * 0.1}s;">
                    <span class="alert-icon">🌟</span>
                    <span>Your savings rate is ${savingsRate.toFixed(0)}% — excellent! You're above the 15% ideal target.</span>
                </div>`;
        } else if (savingsRate >= 10) {
            alertsHTML += `
                <div class="alert-card alert-success" style="animation-delay: ${alertDelay * 0.1}s;">
                    <span class="alert-icon">✅</span>
                    <span>Your savings rate is ${savingsRate.toFixed(0)}% — you're meeting the minimum 10% target.</span>
                </div>`;
        }

        if (alertsHTML === '') {
            alertsHTML = `
                <div class="alert-card alert-success" style="animation-delay: 0s;">
                    <span class="alert-icon">🎉</span>
                    <span>All categories are within budget. Great financial discipline!</span>
                </div>`;
        }
    }

    alertsSection.innerHTML = alertsHTML;

    // Weekly comparison
    updateWeeklyComparison(expenses);

    // Recommendations
    updateRecommendations(expenses, totalSpent);

    // Knowledge tips
    updateTips();
    updateCategoryDefinitions();
}

function updateCategoryDefinitions() {
    const container = document.getElementById('categoryDefinitionGrid');
    if (!container) return;

    container.innerHTML = Object.entries(CONFIG.categories).map(([name, cat]) => `
        <div class="def-item">
            <div class="def-header">
                <span class="def-icon" style="background: ${cat.color}20; color: ${cat.color};">${cat.icon}</span>
                <span class="def-name">${name}</span>
            </div>
            <p class="def-text">${cat.description}</p>
        </div>
    `).join('');
}

function updateWeeklyComparison(expenses) {
    const container = document.getElementById('weeklyGrid');
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const weeks = [
        { label: 'Week 1', start: 1, end: 7 },
        { label: 'Week 2', start: 8, end: 14 },
        { label: 'Week 3', start: 15, end: 21 },
        { label: 'Week 4', start: 22, end: 31 },
    ];

    let cumulativeTotal = 0;
    container.innerHTML = weeks.map((week, i) => {
        const weekTotal = expenses.filter(e => {
            const [year, month, day] = e.date.split('-').map(Number);
            return day >= week.start && day <= week.end && (month - 1) === currentMonth && year === currentYear;
        }).reduce((s, e) => s + e.amount, 0);

        cumulativeTotal += weekTotal;

        let statusText = '', statusClass = 'neutral';
        if (cumulativeTotal > CONFIG.monthlyBudget) {
            statusText = '🚨 Over Budget';
            statusClass = 'down';
        } else if (cumulativeTotal > CONFIG.monthlyBudget * 0.8) {
            statusText = '⚠️ Near Limit';
            statusClass = 'neutral';
        } else if (cumulativeTotal > 0) {
            statusText = '✅ On Track';
            statusClass = 'positive';
        }

        return `
            <div class="week-item">
                <span class="week-label">${week.label} (Total)</span>
                <span class="week-amount">₹${cumulativeTotal.toLocaleString('en-IN')}</span>
                <span class="week-change ${statusClass}">${statusText}</span>
            </div>
        `;
    }).join('');
}

function updateRecommendations(expenses, totalSpent) {
    const container = document.getElementById('recommendationsList');
    let html = '';

    if (expenses.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Add expenses to see personalized recommendations.</p>';
        return;
    }

    const recs = [
        {
            cat: 'Food', threshold: 35,
            icon: '🍕',
            title: 'Reduce Food Delivery Spending',
            desc: 'Try cooking at home 3-4 times a week and limit Zomato/Swiggy to weekends only. Consider meal prepping on Sunday.',
            savings: '₹1,500–2,000/month'
        },
        {
            cat: 'Transport', threshold: 15,
            icon: '🚗',
            title: 'Optimize Transport Costs',
            desc: 'Use metro/bus for daily commute and save cabs for emergencies. Consider carpooling with classmates.',
            savings: '₹1,000–1,500/month'
        },
        {
            cat: 'Entertainment', threshold: 10,
            icon: '🎬',
            title: 'Review Subscriptions',
            desc: 'Share Netflix/Spotify family plans with friends. Use free alternatives like YouTube for music.',
            savings: '₹400–600/month'
        },
        {
            cat: 'Shopping', threshold: 10,
            icon: '🛍️',
            title: 'Apply the 48-Hour Rule',
            desc: 'Before any non-essential purchase, wait 48 hours. You\'ll find you skip most impulse buys. Shop during sales only.',
            savings: '₹500–1,000/month'
        },
        {
            cat: 'Utilities', threshold: 10,
            icon: '💡',
            title: 'Compare Utility Plans',
            desc: 'Check if there\'s a cheaper mobile or internet plan available. Turn off lights and ACs when not needed.',
            savings: '₹200–400/month'
        },
    ];

    recs.forEach(rec => {
        const catTotal = expenses.filter(e => e.finalCategory === rec.cat).reduce((s, e) => s + e.amount, 0);
        const pct = totalSpent > 0 ? (catTotal / totalSpent * 100) : 0;

        if (pct > rec.threshold - 5 && catTotal > 0) {
            const isOver = pct > rec.threshold;
            html += `
                <div class="recommendation-item">
                    <span class="rec-icon">${rec.icon}</span>
                    <div class="rec-text">
                        <span class="rec-title">${isOver ? '⚠️ ' : ''}${rec.title} ${isOver ? `(${pct.toFixed(0)}% → limit: ${rec.threshold}%)` : ''}</span>
                        <span class="rec-desc">${rec.desc}</span>
                        <span class="rec-savings">💰 Potential savings: ${rec.savings}</span>
                    </div>
                </div>
            `;
        }
    });

    if (!html) {
        html = `
            <div class="recommendation-item">
                <span class="rec-icon">🎉</span>
                <div class="rec-text">
                    <span class="rec-title">Great job! All categories within budget.</span>
                    <span class="rec-desc">Keep maintaining your current spending habits. Consider increasing your savings target to 15% if you're not already there.</span>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

function updateTips() {
    const container = document.getElementById('tipsGrid');
    const tips = [
        { category: '🍕 Food', text: 'Plan your meals weekly. Track Zomato/Swiggy spending separately. Set a ₹200/day food budget and stick to it.' },
        { category: '🚗 Transport', text: 'Use metro/bus for distances > 3km. Walk for short distances. Check Ola/Uber vs auto prices before booking.' },
        { category: '🎬 Entertainment', text: 'Keep max 2 streaming subscriptions. Use student discounts (Spotify, YouTube Premium). Prefer free outings.' },
        { category: '🛍️ Shopping', text: 'Create a wish list and wait for sales. Use price comparison tools. Avoid shopping when bored or emotional.' },
        { category: '💡 Utilities', text: 'Recharge during cashback offers. Use energy-saving mode on devices. Track which apps consume most data.' },
        { category: '📚 Education', text: 'Use free resources (NPTEL, Khan Academy, YouTube). Buy second-hand books. Share subscriptions with study groups.' },
    ];

    container.innerHTML = tips.map(tip => `
        <div class="tip-card">
            <div class="tip-category">${tip.category}</div>
            <div class="tip-text">${tip.text}</div>
        </div>
    `).join('');
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Filter
    document.getElementById('filterCategory').addEventListener('change', updateExpensesTable);

    // Refresh insights
    document.getElementById('refreshInsights').addEventListener('click', () => {
        updateInsights();
        const btn = document.getElementById('refreshInsights');
        btn.textContent = '✅ Updated!';
        setTimeout(() => btn.textContent = '🔄 Refresh Analysis', 1500);
    });

    // Download Report (Print to PDF)
    document.getElementById('downloadReport').addEventListener('click', async () => {
        const canvases = document.querySelectorAll('canvas');
        const images = [];
        const tabs = document.querySelectorAll('.tab-content');
        
        // 1. Briefly show all tabs to ensure charts render
        tabs.forEach(tab => {
            tab.style.display = 'block';
            tab.style.opacity = '1';
            tab.style.visibility = 'visible';
            tab.style.position = 'absolute'; // Keep it off-screen if possible
            tab.style.left = '-9999px';
        });

        // 2. Wait a split second for Chart.js to render
        await new Promise(r => setTimeout(r, 500));

        // 3. Convert canvases to images
        canvases.forEach(canvas => {
            try {
                const img = new Image();
                img.src = canvas.toDataURL('image/png');
                img.className = 'print-chart-image';
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.display = 'none';
                canvas.parentNode.appendChild(img);
                images.push({ canvas, img });
            } catch (e) {
                console.error('Canvas capture failed:', e);
            }
        });

        // 4. Reset tabs back to normal
        tabs.forEach(tab => {
            tab.style.display = '';
            tab.style.opacity = '';
            tab.style.visibility = '';
            tab.style.position = '';
            tab.style.left = '';
        });

        // 5. Trigger print
        document.body.classList.add('is-printing');
        window.print();

        // 6. Cleanup
        setTimeout(() => {
            document.body.classList.remove('is-printing');
            images.forEach(({ canvas, img }) => img.remove());
        }, 1000);
    });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', async () => {
    createParticles();
    initTabs();
    initForm();
    initEventListeners();
    
    // Check for monthly reset
    checkMonthlyReset();

    // Direct load
    await loadExpenses();
    
    updateDashboard();
    updateExpensesTable();
    updateInsights();
});
