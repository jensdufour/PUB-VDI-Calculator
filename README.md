# Windows 365 Cost Calculator - Simplified

A quick and simple tool to compare Windows 365 Enterprise vs. Frontline licensing costs.

## 🚀 Quick Start

Enter just three things:
1. **Total Users** - How many users need Cloud PCs (10-10,000)
2. **Peak Concurrent** - Maximum simultaneous connections expected
3. **Configuration** - Choose from 10 Cloud PC SKU options

The calculator instantly shows:
- **Enterprise Cost** - Per-user licensing model
- **Frontline Cost** - 3-user license pool model  
- **Savings** - How much you'd save with Frontline vs Enterprise

## 📊 Example

```
Input:
- 100 total users
- 60 peak concurrent connections
- 4vCPU / 16GB / 256GB configuration

Results:
Enterprise: $90,000/year ($75/user/month)
Frontline: $45,200/year ($37.67/user/month)
Savings:   $44,800/year with Frontline
```

## 💰 Pricing Data (2025)

### Windows 365 Enterprise (Per User/Month)
- 2vCPU / 8GB / 128GB - $41
- 2vCPU / 8GB / 256GB - $50
- 4vCPU / 16GB / 128GB - $66
- 4vCPU / 16GB / 256GB - $75
- 4vCPU / 16GB / 512GB - $101
- 8vCPU / 32GB / 128GB - $123
- 8vCPU / 32GB / 256GB - $132
- 8vCPU / 32GB / 512GB - $158
- 16vCPU / 64GB / 512GB - $277
- 16vCPU / 64GB / 1TB - $315

### Windows 365 Frontline (Per 3-User Pool/Month)
- 2vCPU / 8GB / 128GB - $62
- 2vCPU / 8GB / 256GB - $75
- 4vCPU / 16GB / 128GB - $99
- 4vCPU / 16GB / 256GB - $113
- 4vCPU / 16GB / 512GB - $152
- 8vCPU / 32GB / 128GB - $185
- 8vCPU / 32GB / 256GB - $198
- 8vCPU / 32GB / 512GB - $237
- 16vCPU / 64GB / 512GB - $416
- 16vCPU / 64GB / 1TB - $473

## 🧮 How It Works

### Enterprise Licensing
```
Yearly Cost = Total Users × Monthly SKU Price × 12 months
Cost Per User/Month = Selected SKU Price
```

### Frontline Licensing
```
Licenses Needed = CEIL(Total Users ÷ 3)
Yearly Cost = Licenses × Monthly Pool Price × 12 months
Cost Per User/Month = Monthly Pool Price ÷ 3
```

### Displayed Metrics
- **Yearly Cost** - Total annual expenditure for all users
- **Monthly per User** - Individual user monthly cost
- **Annual per User** - Individual user annual cost
- **Peak Concurrent Annual** - Cost based on peak simultaneous connections
- **Savings** - Frontline cost difference vs Enterprise

## 🌐 Deployment

### Local Testing
```powershell
# Just open in any modern browser
Invoke-Item index.html
```

### GitHub Pages
```powershell
cd c:\Users\jensdufour\Git\PUB-Scripts
git add 02_Intune/04_VDI_Calculator/
git commit -m "Add Windows 365 Cost Calculator"
git push origin main
```

Then:
1. Repository Settings → Pages
2. Select "main" branch
3. Wait 1-2 minutes
4. Access at: `https://yourusername.github.io/PUB-Scripts/02_Intune/04_VDI_Calculator/`

### Any Web Server
Copy all files - no build process or special configuration needed!

## 📱 Device Support

✅ Desktop (Chrome, Firefox, Safari, Edge)  
✅ Tablets (Full responsive design)  
✅ Mobile (iOS and Android)  
✅ Offline capable (100% client-side)

## 📄 Files

- `index.html` - Main calculator UI
- `styles.css` - Responsive styling
- `calculator.js` - Cost calculations
- `README.md` - This file

## 🔄 Updating Pricing

Edit `calculator.js` lines 6-36:

```javascript
const PRICING_DATA = {
    enterprise: [
        { label: '2vCPU / 8GB / 128GB', monthlyUSD: 41 },
        // Update prices here when rates change
    ],
    frontline: [
        { label: '2vCPU / 8GB / 128GB', pricePerThree: 62 },
        // Update prices here when rates change
    ]
};
```

## ❓ FAQ

**Q: Can I add more SKUs?**  
A: Yes, edit the `PRICING_DATA` object in calculator.js and add options to the dropdown in index.html.

**Q: Can I include support costs?**  
A: The current version focuses on licensing. Edit calculator.js to add support tier pricing.

**Q: Does it save my scenarios?**  
A: The simplified version doesn't save scenarios. Open the full version if you need that feature.

**Q: What about non-persistent storage?**  
A: Frontline is typically non-persistent. Enterprise supports both. Pricing is the same regardless.

## 🎯 When to Use Each Model

### Enterprise (Per-User)
- Best for: Knowledge workers, power users, general workforce
- Advantage: Full flexibility, works for any use case
- Cost: Higher per-user

### Frontline (3-User Pools)
- Best for: Shift workers, task-based roles, retail/manufacturing
- Advantage: Significant cost savings (often 40-50% less)
- Consideration: Pool-based licensing requires planning

## 📊 Real-World Examples

### Manufacturing Plant (500 shift workers)
- Enterprise: $371,250/year
- Frontline: $113,200/year
- **Savings: $258,050/year (70% less!)**

### Corporate Office (250 knowledge workers)
- Enterprise: $225,000/year
- Frontline: $113,200/year
- **Savings: $111,800/year (50% less)**

### Service Desk (50 agents, 40 concurrent)
- Enterprise: $45,000/year
- Frontline: $22,560/year
- **Savings: $22,440/year (50% less)**

## 🔒 Privacy & Security

- ✅ 100% client-side calculations
- ✅ No data sent to servers
- ✅ No external API calls
- ✅ No tracking or analytics
- ✅ Works completely offline

## 📝 Notes

- All prices in USD as of Q4 2025
- Prices subject to change - check Microsoft pricing regularly
- Does not include additional services (support, management, networking)
- Per-user costs shown are monthly unless noted
- Frontline pool calculations use standard 3-user pools

## 🚀 Ready to Use!

Simply open `index.html` in your browser or deploy to GitHub Pages.
No installation, no dependencies, instant calculations!
