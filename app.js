/* ==========================================
   AI Personal Finance Tracker - App Logic
   ========================================== */

// ===== CONFIGURATION =====
const CONFIG = {
    monthlyBudget: 15000,
    savingsTargetMin: 10,
    savingsTargetMax: 15,
    spikeThreshold: 20,

    // ⬇️ PASTE YOUR GOOGLE SHEETS WEB APP URL HERE ⬇️
    // (See google-sheets/SETUP_GUIDE.md → "Deploy as Web App" section)
    googleSheetsUrl: '',

    categories: {
        'Food':          { threshold: 35, icon: '🍕', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f97316)' },
        'Transport':     { threshold: 15, icon: '🚗', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
        'Entertainment': { threshold: 10, icon: '🎬', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #a855f7)' },
        'Utilities':     { threshold: 10, icon: '💡', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #eab308)' },
        'Education':     { threshold: 10, icon: '📚', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
        'Shopping':      { threshold: 10, icon: '🛍️', color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)' },
        'Health':        { threshold: 5,  icon: '💊', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
        'Personal Care': { threshold: 5,  icon: '💇', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ef4444)' },
        'Rent/Housing':  { threshold: 0,  icon: '🏠', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)' },
        'Miscellaneous': { threshold: 5,  icon: '📦', color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280, #4b5563)' },
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
const STORAGE_KEY = 'financeai_expenses';

function loadExpenses() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
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
        'syncing':       { text: '🔄 Syncing to Sheets...', class: 'sync-pending' },
        'synced':        { text: '🟢 Synced to Google Sheets', class: 'sync-ok' },
        'error':         { text: '🔴 Sheets Sync Failed', class: 'sync-error' },
    };

    const s = states[status] || states['not-connected'];
    indicator.textContent = s.text;
    indicator.className = 'sync-indicator ' + s.class;

    // Auto-hide success after 3s
    if (status === 'synced') {
        setTimeout(() => {
            indicator.textContent = '🟢 Connected to Sheets';
        }, 3000);
    }
}

function deleteExpense(id) {
    let expenses = loadExpenses();
    expenses = expenses.filter(e => e.id !== id);
    saveExpenses(expenses);
}

function clearAllExpenses() {
    saveExpenses([]);
}

// ===== SAMPLE DATA =====
function loadSampleData() {
    const expenses = loadExpenses();
    if (expenses.length > 0) return;

    const sampleData = [
        { amount: 250, date: '2025-04-01', description: 'Zomato lunch', override: '' },
        { amount: 150, date: '2025-04-01', description: 'Metro card recharge', override: '' },
        { amount: 499, date: '2025-04-02', description: 'Netflix monthly subscription', override: '' },
        { amount: 80, date: '2025-04-02', description: 'Chai and samosa at canteen', override: '' },
        { amount: 1200, date: '2025-04-03', description: 'New t-shirt from Myntra', override: '' },
        { amount: 350, date: '2025-04-03', description: 'Uber to airport', override: '' },
        { amount: 200, date: '2025-04-04', description: 'Paracetamol from pharmacy', override: '' },
        { amount: 5000, date: '2025-04-04', description: 'Monthly room rent', override: 'Rent/Housing' },
        { amount: 120, date: '2025-04-05', description: 'Jio mobile recharge', override: '' },
        { amount: 450, date: '2025-04-05', description: 'Swiggy dinner', override: '' },
        { amount: 300, date: '2025-04-06', description: 'Haircut at salon', override: '' },
        { amount: 180, date: '2025-04-06', description: 'Auto rickshaw to market', override: '' },
        { amount: 850, date: '2025-04-07', description: 'Groceries from BigBasket', override: '' },
        { amount: 599, date: '2025-04-07', description: 'Coursera course subscription', override: '' },
        { amount: 60, date: '2025-04-08', description: 'Tea and biscuits', override: '' },
        { amount: 1500, date: '2025-04-08', description: 'Electricity bill payment', override: '' },
        { amount: 320, date: '2025-04-09', description: 'Dominos pizza with friends', override: '' },
        { amount: 250, date: '2025-04-09', description: 'Movie tickets PVR', override: '' },
        { amount: 400, date: '2025-04-10', description: 'Uber to office', override: '' },
        { amount: 180, date: '2025-04-10', description: 'Maggi and juice at hostel', override: '' },
    ];

    sampleData.forEach(item => {
        const ai = aiCategorize(item.description);
        addExpense({
            amount: item.amount,
            date: item.date,
            description: item.description,
            categoryOverride: item.override,
            aiCategory: ai.category,
            aiSubcategory: ai.subcategory,
            finalCategory: item.override || ai.category,
        });
    });
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
}

// ===== DASHBOARD =====
let pieChart, lineChart;

function updateDashboard() {
    const expenses = loadExpenses();
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const saved = CONFIG.monthlyBudget - totalSpent;
    const savingsRate = CONFIG.monthlyBudget > 0 ? (saved / CONFIG.monthlyBudget * 100) : 100;
    const budgetPct = Math.min((totalSpent / CONFIG.monthlyBudget) * 100, 100);

    // Header
    document.getElementById('headerTotal').textContent = `₹${totalSpent.toLocaleString('en-IN')}`;
    document.getElementById('headerBudgetLeft').textContent = `₹${Math.max(0, saved).toLocaleString('en-IN')}`;
    document.getElementById('headerSavings').textContent = `${Math.max(0, savingsRate).toFixed(0)}%`;
    document.getElementById('headerSavings').style.color = savingsRate >= 10 ? '#10b981' : '#ef4444';

    // Summary cards
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toLocaleString('en-IN')}`;
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
    Object.keys(CONFIG.categories).forEach(cat => {
        const total = expenses.filter(e => e.finalCategory === cat).reduce((s, e) => s + e.amount, 0);
        if (total > 0) categoryTotals[cat] = total;
    });

    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();

    const pieLabels = Object.keys(categoryTotals);
    const pieData = Object.values(categoryTotals);
    const pieColors = pieLabels.map(l => CONFIG.categories[l].color);

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

    // Line Chart - Daily spending
    const dailyMap = {};
    expenses.forEach(e => {
        dailyMap[e.date] = (dailyMap[e.date] || 0) + e.amount;
    });
    const sortedDates = Object.keys(dailyMap).sort();
    const dailyAmounts = sortedDates.map(d => dailyMap[d]);
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
                label: 'Daily Spending (₹)',
                data: dailyAmounts,
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

// ===== EXPENSE FORM =====
function initForm() {
    const form = document.getElementById('expenseForm');
    const descInput = document.getElementById('description');
    const dateInput = document.getElementById('date');

    // Set default date to today
    dateInput.value = new Date().toISOString().split('T')[0];

    // Live AI preview
    let previewTimeout;
    descInput.addEventListener('input', () => {
        clearTimeout(previewTimeout);
        previewTimeout = setTimeout(() => {
            const desc = descInput.value.trim();
            const preview = document.getElementById('aiPreview');
            if (desc.length >= 3) {
                const result = aiCategorize(desc);
                document.getElementById('aiCategory').textContent = `${CONFIG.categories[result.category]?.icon || '📦'} ${result.category}`;
                document.getElementById('aiSubcategory').textContent = result.subcategory;
                preview.style.display = 'flex';
            } else {
                preview.style.display = 'none';
            }
        }, 300);
    });

    // Form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const date = dateInput.value;
        const description = descInput.value.trim();
        const override = document.getElementById('categoryOverride').value;

        if (!amount || !date || !description) return;

        const ai = aiCategorize(description);

        addExpense({
            amount,
            date,
            description,
            categoryOverride: override,
            aiCategory: ai.category,
            aiSubcategory: ai.subcategory,
            finalCategory: override || ai.category,
        });

        // Show toast
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);

        // Reset form
        form.reset();
        dateInput.value = new Date().toISOString().split('T')[0];
        document.getElementById('aiPreview').style.display = 'none';

        // Update all views
        updateDashboard();
        updateExpensesTable();
        updateInsights();
    });
}

// ===== EXPENSES TABLE =====
function updateExpensesTable() {
    const expenses = loadExpenses();
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
        const catConfig = CONFIG.categories[e.finalCategory] || {};
        const dateFormatted = new Date(e.date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        return `
            <tr>
                <td>${dateFormatted}</td>
                <td>${e.description}</td>
                <td class="amount-cell">₹${e.amount.toLocaleString('en-IN')}</td>
                <td><span class="category-badge" style="background: ${catConfig.color}20; color: ${catConfig.color};">${catConfig.icon || '📦'} ${e.aiCategory}</span></td>
                <td><span class="category-badge">${catConfig.icon || '📦'} ${e.finalCategory}</span></td>
                <td><button class="delete-btn" onclick="handleDelete(${e.id})">🗑️</button></td>
            </tr>
        `;
    }).join('');
}

function handleDelete(id) {
    deleteExpense(id);
    updateDashboard();
    updateExpensesTable();
    updateInsights();
}

// ===== AI INSIGHTS =====
function updateInsights() {
    const expenses = loadExpenses();
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
}

function updateWeeklyComparison(expenses) {
    const container = document.getElementById('weeklyGrid');
    const weeks = [
        { label: 'Week 1', start: 1, end: 7 },
        { label: 'Week 2', start: 8, end: 14 },
        { label: 'Week 3', start: 15, end: 21 },
        { label: 'Week 4', start: 22, end: 31 },
    ];

    let prevTotal = 0;
    container.innerHTML = weeks.map((week, i) => {
        const weekTotal = expenses.filter(e => {
            const day = new Date(e.date).getDate();
            return day >= week.start && day <= week.end;
        }).reduce((s, e) => s + e.amount, 0);

        let changeText = '', changeClass = 'neutral';
        if (i > 0 && prevTotal > 0) {
            const change = ((weekTotal - prevTotal) / prevTotal * 100).toFixed(1);
            if (change > 0) {
                changeText = `↑ ${change}%`;
                changeClass = change > 20 ? 'up' : 'neutral';
            } else {
                changeText = `↓ ${Math.abs(change)}%`;
                changeClass = 'down';
            }
            if (change > 20) changeText += ' ⚠️';
        } else if (i === 0) {
            changeText = '—';
        }

        prevTotal = weekTotal;

        return `
            <div class="week-item">
                <span class="week-label">${week.label}</span>
                <span class="week-amount">₹${weekTotal.toLocaleString('en-IN')}</span>
                <span class="week-change ${changeClass}">${changeText}</span>
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

    // Clear all
    document.getElementById('clearAll').addEventListener('click', () => {
        if (confirm('Are you sure? This will delete ALL expenses.')) {
            clearAllExpenses();
            updateDashboard();
            updateExpensesTable();
            updateInsights();
        }
    });

    // Refresh insights
    document.getElementById('refreshInsights').addEventListener('click', () => {
        updateInsights();
        const btn = document.getElementById('refreshInsights');
        btn.textContent = '✅ Updated!';
        setTimeout(() => btn.textContent = '🔄 Refresh Analysis', 1500);
    });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initTabs();
    initForm();
    initEventListeners();
    loadSampleData();
    updateDashboard();
    updateExpensesTable();
    updateInsights();
});
