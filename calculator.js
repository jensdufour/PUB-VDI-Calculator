/* ============================================================================
   Windows 365 Cost Calculator - Enterprise & Frontline (Dedicated & Shared)
   ============================================================================ */

// Pricing Data - 2025 Rates
const PRICING_DATA = {
    // Enterprise: Per-user licensing (all users need a license)
    enterprise: [
        { label: '2vCPU / 8GB / 128GB', monthlyPerUser: 41 },
        { label: '2vCPU / 8GB / 256GB', monthlyPerUser: 50 },
        { label: '4vCPU / 16GB / 128GB', monthlyPerUser: 66 },
        { label: '4vCPU / 16GB / 256GB', monthlyPerUser: 75 },
        { label: '4vCPU / 16GB / 512GB', monthlyPerUser: 101 },
        { label: '8vCPU / 32GB / 128GB', monthlyPerUser: 123 },
        { label: '8vCPU / 32GB / 256GB', monthlyPerUser: 132 },
        { label: '8vCPU / 32GB / 512GB', monthlyPerUser: 158 },
        { label: '16vCPU / 64GB / 512GB', monthlyPerUser: 277 },
        { label: '16vCPU / 64GB / 1TB', monthlyPerUser: 315 }
    ],
    // Frontline Dedicated: Per-license pricing, each license supports up to 3 users
    frontlineDedicated: [
        { label: '2vCPU / 8GB / 128GB', monthlyPerLicense: 62 },
        { label: '2vCPU / 8GB / 256GB', monthlyPerLicense: 75 },
        { label: '4vCPU / 16GB / 128GB', monthlyPerLicense: 99 },
        { label: '4vCPU / 16GB / 256GB', monthlyPerLicense: 113 },
        { label: '4vCPU / 16GB / 512GB', monthlyPerLicense: 152 },
        { label: '8vCPU / 32GB / 128GB', monthlyPerLicense: 185 },
        { label: '8vCPU / 32GB / 256GB', monthlyPerLicense: 198 },
        { label: '8vCPU / 32GB / 512GB', monthlyPerLicense: 237 },
        { label: '16vCPU / 64GB / 512GB', monthlyPerLicense: 416},
        { label: '16vCPU / 64GB / 1TB', monthlyPerLicense: 473 }
    ],
    // Frontline Shared: Per concurrent device per month (non-persistent, shared)
    // Price is per device in use at the same time, not per named user
    frontlineShared: [
        { label: '2vCPU / 8GB / 128GB', monthlyPerDevice: 62 },
        { label: '2vCPU / 8GB / 256GB', monthlyPerDevice: 75 },
        { label: '4vCPU / 16GB / 128GB', monthlyPerDevice: 99 },
        { label: '4vCPU / 16GB / 256GB', monthlyPerDevice: 113 },
        { label: '4vCPU / 16GB / 512GB', monthlyPerDevice: 152 },
        { label: '8vCPU / 32GB / 128GB', monthlyPerDevice: 185 },
        { label: '8vCPU / 32GB / 256GB', monthlyPerDevice: 198 },
        { label: '8vCPU / 32GB / 512GB', monthlyPerDevice: 237 },
        { label: '16vCPU / 64GB / 512GB', monthlyPerDevice: 416 },
        { label: '16vCPU / 64GB / 1TB', monthlyPerDevice: 473 }
    ]
};

// Application State
const state = {
    totalUsers: 1,
    peakConcurrent: 1,
    selectedSku: 0
};

// Helper: Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Helper: Format currency with decimals
function formatCurrencyDecimals(amount, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(amount);
}

// Calculate Enterprise Costs
// Model: All users need a license (user-assigned)
function calculateEnterprise() {
    const sku = PRICING_DATA.enterprise[state.selectedSku];
    const monthlyPerUser = sku.monthlyPerUser;
    
    // Enterprise: All named users need a license
    const yearlyTotal = state.totalUsers * monthlyPerUser * 12;
    const monthlyPerUserCost = monthlyPerUser;
    const annualPerUserCost = monthlyPerUser * 12;
    
    // For reference: if licensing only concurrent users
    const yearlyConcurrent = state.peakConcurrent * monthlyPerUser * 12;
    
    return {
        yearly: yearlyTotal,
        monthlyPerUser: monthlyPerUserCost,
        annualPerUser: annualPerUserCost,
        concurrentYearly: yearlyConcurrent
    };
}

// Calculate Frontline Dedicated Costs
// Model: Per-license pricing (minimum 1 license), 3 users per license with 1 concurrent connection per license
// Must have enough licenses for BOTH all users AND peak concurrent connections
function calculateFrontlineDedicated() {
    const sku = PRICING_DATA.frontlineDedicated[state.selectedSku];
    const monthlyPerLicense = sku.monthlyPerLicense;
    
    // Frontline Dedicated: Need enough licenses for both:
    // 1. All total users assigned to licenses (3 users per license)
    // 2. Peak concurrent connections (1 concurrent per license)
    const licensesForUsers = Math.ceil(state.totalUsers / 3);
    const licensesForConcurrent = Math.ceil(state.peakConcurrent / 1);
    
    // Need the maximum of both requirements, with minimum of 1
    const licensesNeeded = Math.max(1, licensesForUsers, licensesForConcurrent);
    const concurrentCapacity = licensesNeeded * 1; // 1 concurrent per license
    
    // Total cost: cost per license × number of licenses needed
    const monthlyLicenseCost = licensesNeeded * monthlyPerLicense;
    const yearlyTotal = monthlyLicenseCost * 12;
    
    // Per user cost calculation (for display purposes) - divide by total users to show cost spread across all users
    const monthlyPerUser = state.totalUsers > 0 ? monthlyLicenseCost / state.totalUsers : 0;
    const annualPerUser = monthlyPerUser * 12;
    
    return {
        yearly: yearlyTotal,
        monthly: monthlyLicenseCost,
        monthlyPerUser: monthlyPerUser,
        annualPerUser: annualPerUser,
        licensesNeeded: licensesNeeded,
        concurrentCapacity: concurrentCapacity
    };
}

// Calculate Frontline Shared Costs
// Model: Pay per concurrent device only (shared, non-persistent device)
// You only pay for devices in actual use at the same time
function calculateFrontlineShared() {
    const sku = PRICING_DATA.frontlineShared[state.selectedSku];
    const monthlyPerDevice = sku.monthlyPerDevice;
    
    // Frontline Shared: Based on peak concurrent users only
    // Shared devices can be reused by many named users throughout the day
    const yearlyTotal = state.peakConcurrent * monthlyPerDevice * 12;
    
    // Cost metrics
    const monthlyTotal = state.peakConcurrent * monthlyPerDevice;
    
    return {
        yearly: yearlyTotal,
        monthly: monthlyTotal,
        monthlyPerDevice: monthlyPerDevice,
        annualPerDevice: monthlyPerDevice * 12,
        devicesNeeded: state.peakConcurrent
    };
}

// Event Listeners
function updateDisplay() {
    const enterprise = calculateEnterprise();
    const frontlineDedicated = calculateFrontlineDedicated();
    const frontlineShared = calculateFrontlineShared();
    
    // Update Enterprise display
    document.getElementById('enterprise-yearly').textContent = formatCurrency(enterprise.yearly);
    document.getElementById('enterprise-monthly-user').textContent = formatCurrency(enterprise.monthlyPerUser);
    document.getElementById('enterprise-annual-user').textContent = formatCurrency(enterprise.annualPerUser);
    document.getElementById('enterprise-concurrent-annual').textContent = formatCurrency(enterprise.concurrentYearly);
    
    // Update Frontline Dedicated display
    document.getElementById('frontline-dedicated-yearly').textContent = formatCurrency(frontlineDedicated.yearly);
    document.getElementById('frontline-dedicated-monthly-pool').textContent = formatCurrencyDecimals(frontlineDedicated.monthlyPerUser, 2);
    document.getElementById('frontline-dedicated-pools-needed').textContent = frontlineDedicated.licensesNeeded;
    
    // Calculate and display Frontline Dedicated savings
    const savingsDedicated = enterprise.yearly - frontlineDedicated.yearly;
    const savingsPercentageDedicated = ((savingsDedicated / enterprise.yearly) * 100).toFixed(1);
    const savingsTextDedicated = formatCurrency(Math.abs(savingsDedicated));
    const savingsElementDedicated = document.getElementById('frontline-dedicated-savings');
    
    if (savingsDedicated > 0) {
        savingsElementDedicated.textContent = `Save ${savingsTextDedicated} (${savingsPercentageDedicated}%)`;
        savingsElementDedicated.style.color = '#107c10';
    } else if (savingsDedicated < 0) {
        savingsElementDedicated.textContent = `${savingsTextDedicated} more (${Math.abs(savingsPercentageDedicated)}%)`;
        savingsElementDedicated.style.color = '#d13438';
    } else {
        savingsElementDedicated.textContent = 'Same cost';
        savingsElementDedicated.style.color = '#666666';
    }
    
    // Update Frontline Shared display
    document.getElementById('frontline-shared-yearly').textContent = formatCurrency(frontlineShared.yearly);
    const frontlineSharedMonthlyPerUser = frontlineShared.monthly / state.totalUsers;
    document.getElementById('frontline-shared-monthly-user').textContent = formatCurrencyDecimals(frontlineSharedMonthlyPerUser, 2);
    document.getElementById('frontline-shared-concurrent').textContent = frontlineShared.devicesNeeded;
    
    // Calculate and display Frontline Shared savings
    const savingsShared = enterprise.yearly - frontlineShared.yearly;
    const savingsPercentageShared = ((savingsShared / enterprise.yearly) * 100).toFixed(1);
    const savingsTextShared = formatCurrency(Math.abs(savingsShared));
    const savingsElementShared = document.getElementById('frontline-shared-savings');
    
    if (savingsShared > 0) {
        savingsElementShared.textContent = `Save ${savingsTextShared} (${savingsPercentageShared}%)`;
        savingsElementShared.style.color = '#ff8c00';
    } else if (savingsShared < 0) {
        savingsElementShared.textContent = `${savingsTextShared} more (${Math.abs(savingsPercentageShared)}%)`;
        savingsElementShared.style.color = '#d13438';
    } else {
        savingsElementShared.textContent = 'Same cost';
        savingsElementShared.style.color = '#666666';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Total Users input
    document.getElementById('total-users').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        state.totalUsers = (value > 0) ? value : 1;
        updateDisplay();
    });
    
    document.getElementById('total-users').addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        state.totalUsers = (value > 0) ? value : 1;
        updateDisplay();
    });
    
    // Peak Concurrent input
    document.getElementById('peak-concurrent').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        state.peakConcurrent = (value > 0) ? value : 1;
        updateDisplay();
    });
    
    document.getElementById('peak-concurrent').addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        state.peakConcurrent = (value > 0) ? value : 1;
        updateDisplay();
    });
    
    // SKU Selector
    document.getElementById('sku-selector').addEventListener('change', (e) => {
        state.selectedSku = parseInt(e.target.value);
        updateDisplay();
    });
    
    // Initial display
    updateDisplay();
});
