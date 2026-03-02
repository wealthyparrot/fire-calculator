# FIRE Calculator - Technical Specification

**Version**: 1.0
**Status**: Planning
**Target Launch**: Month 1-2
**Repository**: `github.com/wealthyparrot/fire-calculator`

---

## Project Overview

### Mission
Build a modern, realistic FIRE (Financial Independence, Retire Early) calculator that accounts for real-world factors like state pensions, healthcare costs, and multiple income streams.

### Target Audience
- Global investors planning FIRE/early retirement
- Users wanting multi-currency support (EUR, USD, GBP, Nordic currencies)
- People modeling realistic retirement scenarios (not just simplified 4% rule)
- "Smart beginners" (25-45, educated, limited financial experience but ready to learn)

### Unique Value Proposition
- **State Pension Integration**: Reduce FIRE number by accounting for government pensions
- **Multiple Income Streams**: Model Coast FIRE, Barista FIRE, part-time work, rental income
- **Healthcare & Irregular Expenses**: Realistic cost modeling vs flat annual spending
- **Multi-currency**: EUR, USD, GBP, SEK, NOK, DKK support
- **Modern tech**: React + TypeScript (vs outdated PHP tools)
- **Embeddable**: Widget for blogs, not just standalone app

### Success Metrics
- GitHub stars: 100+ (Month 3)
- Blog referrals: 500+ visitors
- Email signups: 50+ new members
- Reddit engagement: 50+ upvotes on r/EuropeFIRE launch post
- Embedded by 2-3 other finance bloggers

---

## Features Breakdown

### MVP (Month 1-2) - Core Features

**Must Have**:
1. ✅ Basic FIRE number calculation (Annual Expenses / SWR)
2. ✅ Safe Withdrawal Rate selector (3%, 3.5%, 4%)
3. ✅ Multi-currency support (EUR, USD, GBP)
4. ✅ Years to FIRE calculation (current savings → FIRE number)
5. ✅ Monthly savings needed calculator
6. ✅ Traditional FIRE mode only (simplest)
7. ✅ Basic responsive UI (mobile + desktop)
8. ✅ Embeddable widget support (iframe or Web Component)

**Nice to Have** (if time permits):
- ✅ Coast FIRE mode (implemented)
- ✅ Barista FIRE mode (implemented)
- Inflation adjustment toggle
- ✅ Simple chart (line graph showing net worth growth over time)

### Version 1.5 (Current Phase) - Differentiating Features

**Core Differentiators** (Build before full public launch):

1. **State Pension Integration** ⭐ Priority 1
   - Problem: Users overestimate FIRE number by ignoring state pensions
   - Solution: Calculate adjusted FIRE number accounting for pension income
   - Implementation:
     - Add input fields: "Expected Annual Pension" and "Pension Start Age"
     - Formula: `Adjusted Expenses = Max(Annual Expenses - Pension Income, 0)`
     - Show comparison: "FIRE number without pension: €750k → with pension: €500k"
     - Display timeline showing pre-pension vs post-pension phases
   - Technical complexity: Low-Medium (3-4 hours)
   - Value: HIGH - Reduces FIRE number by 30-50% for most Europeans

2. **Multiple Income Streams (Coast/Barista FIRE Implementation)** ⭐ Priority 2
   - Problem: Modern FIRE isn't binary; users want to model part-time work
   - Solution: Full implementation of Coast and Barista FIRE modes
   - Implementation:
     - Coast FIRE: User reaches target savings early, stops contributing, lets it grow
       - Calculate: minimum savings needed today to reach FIRE number at target age
       - Formula: `Current Savings × (1 + return)^years = FIRE Number`
     - Barista FIRE: Part-time income covers expenses while portfolio grows
       - Add field: "Part-time Annual Income" with start/end ages
       - Formula: `Required Portfolio = Max(0, Annual Expenses - Part-time Income) / SWR`
     - Multiple income streams: rental income, dividends, freelance work
   - Technical complexity: Medium (4-5 hours)
   - Value: MEDIUM-HIGH - Addresses growing "flexible FIRE" trend

3. **Healthcare & Irregular Expenses** ⭐ Priority 3
   - Problem: Flat annual spending assumption is unrealistic
   - Solution: Layer in age-based healthcare costs and one-time expenses
   - Implementation:
     - Add "Monthly Healthcare Cost" input (increases with age)
     - Add "Irregular Expenses" section:
       - Fields: Description, Amount, Year
       - Examples: car replacement (€25k every 10 years), home repairs
     - Calculate adjusted FIRE number accounting for all expenses
     - Show breakdown: "Base FIRE: €750k + Healthcare: €60k + Irregular: €50k = €860k"
   - Technical complexity: Low-Medium (3-4 hours)
   - Value: MEDIUM-HIGH - Adds realism, prevents undersaving

**Total Time Estimate**: 10-15 hours for all 3 features

**Why These 3?**:
- No free FIRE calculator offers all three
- Technically feasible (all frontend, no backend/APIs)
- European audience natural fit (state pensions vary by country)
- Positions as "realistic FIRE calculator" vs simplified competitors

### Version 2 (Month 3-4) - After Launch Feedback

**Based on user requests**:
- Coast FIRE calculator (stop saving, let current investments grow)
- Barista FIRE calculator (part-time income covers expenses)
- Inflation-adjusted projections (ECB data for EUR)
- Historical simulation (Monte Carlo using past market returns)
- Tax-advantaged account tracking (UK ISA £20K/year, SIPP £60K/year)
- Multiple scenarios side-by-side comparison
- Export results (PDF, CSV)
- Save/share results (via URL params)

### Future Enhancements (Month 6+)

**If GitHub strategy succeeds**:
- User accounts (save multiple scenarios)
- Advanced charts (asset allocation over time, withdrawal strategies)
- Geographic FIRE comparison (Portugal vs UK vs Germany cost of living)
- Integration with Portfolio Tracker (separate GitHub app)
- API for other developers to use

---

## Technical Architecture

### Tech Stack

**Frontend**:
- **Framework**: React 18+ (functional components, hooks)
- **Language**: TypeScript 5+ (type safety, better DX)
- **Build Tool**: Vite (fast dev server, optimized builds)
- **Styling**: Tailwind CSS (utility-first, responsive)
- **Charts**: Chart.js (lightweight, popular)
- **State Management**: React Context API (no Redux needed for MVP)

**Deployment**:
- **Hosting**: GitHub Pages (free, automatic via Actions)
- **Domain**: `fire-calculator.wealthyparrot.com` (CNAME)
- **CI/CD**: GitHub Actions (auto-deploy on push to main)

**Testing**:
- **Unit Tests**: Vitest (Vite-native, Jest-compatible)
- **E2E Tests**: Not MVP (add if project scales)

**Why These Choices**:
- React + TypeScript = industry standard, easy contributors
- Vite = faster than Create React App, smaller bundle
- Tailwind = rapid UI development, consistent design
- Chart.js = simple for basic charts, can upgrade to Recharts later
- GitHub Pages = $0 hosting, easy setup

### Project Structure

```
fire-calculator/
├── src/
│   ├── components/          # React components
│   │   ├── CalculatorForm.tsx
│   │   ├── ResultsDisplay.tsx
│   │   ├── CurrencySelector.tsx
│   │   ├── SWRSelector.tsx
│   │   └── Chart.tsx
│   │
│   ├── utils/               # Business logic (copied from ../shared/)
│   │   ├── fire-calculations.ts
│   │   ├── formatting.ts
│   │   └── currency.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── calculator.ts
│   │   └── currency.ts
│   │
│   ├── context/             # React Context for state
│   │   └── CalculatorContext.tsx
│   │
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind imports
│
├── public/
│   └── embed.html           # Embeddable widget demo
│
├── tests/
│   └── fire-calculations.test.ts
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # Auto-deploy to GitHub Pages
│
├── README.md                # GitHub landing page
├── LICENSE                  # MIT License
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## User Interface Design

### Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  European FIRE Calculator                    [EUR ▼] [4% ▼] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Input Panel                    │   Results Panel            │
│  ─────────────                  │   ─────────────            │
│                                 │                            │
│  Current Age: [__30__]          │   Your FIRE Number:        │
│  Retirement Age: [__50__]       │   €750,000                 │
│                                 │                            │
│  Annual Expenses: [€__30,000__] │   Years to FIRE:           │
│                                 │   15 years (age 45)        │
│  Current Savings: [€__50,000__] │                            │
│                                 │   Monthly Savings Needed:  │
│  Monthly Contribution:          │   €2,083                   │
│  [€__2,000__]                   │                            │
│                                 │   Net Worth at FIRE:       │
│  Expected Return: [_7_%_]       │   €750,000                 │
│                                 │                            │
│  [Calculate FIRE]               │   [Chart: Growth Over Time]│
│                                 │                            │
└─────────────────────────────────┴────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────────┐
│ European FIRE Calculator │
│ [EUR ▼]         [4% ▼]   │
├──────────────────────────┤
│                          │
│ Current Age: [_30_]      │
│ Retirement Age: [_50_]   │
│ Annual Expenses:         │
│ [€_30,000_]              │
│ Current Savings:         │
│ [€_50,000_]              │
│ Monthly Contribution:    │
│ [€_2,000_]               │
│ Expected Return: [7%]    │
│                          │
│ [Calculate FIRE]         │
│                          │
│ ─── Results ───          │
│ FIRE Number: €750,000    │
│ Years to FIRE: 15        │
│ Monthly Savings: €2,083  │
│                          │
│ [Chart]                  │
│                          │
└──────────────────────────┘
```

### Color Scheme (European Theme)

**Primary Colors**:
- Primary: `#2563EB` (Blue - trust, stability)
- Success: `#10B981` (Green - positive growth)
- Warning: `#F59E0B` (Amber - caution)
- Error: `#EF4444` (Red - alerts)

**Neutrals**:
- Background: `#F9FAFB` (Light gray)
- Card: `#FFFFFF` (White)
- Text: `#111827` (Dark gray)
- Muted: `#6B7280` (Medium gray)

**Currency Accents** (subtle):
- EUR: `#003399` (EU blue)
- GBP: `#C8102E` (UK red)
- USD: `#3C3B6E` (USA blue)

---

## Core Calculations & Formulas

### 1. FIRE Number

**Formula**:
```
FIRE Number = Annual Expenses / Safe Withdrawal Rate
```

**Example**:
```
Annual Expenses: €30,000
SWR: 4% (0.04)
FIRE Number = €30,000 / 0.04 = €750,000
```

**TypeScript Implementation**:
```typescript
export function calculateFIRENumber(
  annualExpenses: number,
  safeWithdrawalRate: number
): number {
  return annualExpenses / safeWithdrawalRate;
}
```

---

### 2. Years to FIRE (Simple)

**Formula**:
```
FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]

Where:
- FV = Future Value (FIRE Number)
- PV = Present Value (Current Savings)
- r = Annual Return Rate
- n = Number of Years
- PMT = Annual Contribution

Solve for n (years)
```

**Simplified Approximation** (MVP):
```typescript
export function calculateYearsToFIRE(
  currentSavings: number,
  monthlyContribution: number,
  fireNumber: number,
  annualReturn: number
): number {
  let balance = currentSavings;
  let years = 0;
  const monthlyReturn = annualReturn / 12;

  while (balance < fireNumber && years < 100) {
    balance = balance * (1 + monthlyReturn) + monthlyContribution;
    years += 1 / 12;
  }

  return Math.round(years * 10) / 10; // Round to 1 decimal
}
```

**Note**: For MVP, use iterative simulation. For V2, implement exact formula solving for n.

---

### 3. Monthly Savings Needed

**Goal**: Given FIRE number and target years, calculate required monthly savings.

**Formula** (Rearranged Future Value):
```
PMT = (FV - PV * (1 + r)^n) / [((1 + r)^n - 1) / r]
```

**TypeScript Implementation**:
```typescript
export function calculateMonthlySavingsNeeded(
  currentSavings: number,
  fireNumber: number,
  yearsToFIRE: number,
  annualReturn: number
): number {
  const monthlyReturn = annualReturn / 12;
  const months = yearsToFIRE * 12;

  const futureValueOfCurrentSavings =
    currentSavings * Math.pow(1 + monthlyReturn, months);

  const remainingNeeded = fireNumber - futureValueOfCurrentSavings;

  const monthlyPayment =
    remainingNeeded / (Math.pow(1 + monthlyReturn, months) - 1) * monthlyReturn;

  return Math.max(0, monthlyPayment);
}
```

---

### 4. Coast FIRE Number (Version 2)

**Formula**:
```
Coast FIRE = FIRE Number / (1 + r)^years

Where years = years until traditional retirement age (e.g., 65)
```

**Explanation**: Amount you need NOW to reach FIRE number at retirement if you never save another penny.

**Example**:
```
FIRE Number: €750,000
Current Age: 30
Retirement Age: 65
Years: 35
Annual Return: 7%

Coast FIRE = €750,000 / (1.07)^35 = €70,461
```

---

### 5. Barista FIRE Income Needed (Version 2)

**Formula**:
```
Part-time Income Needed = Annual Expenses - (Current Savings * SWR)
```

**Explanation**: If you have €300K saved and need €30K/year (4% SWR), your savings cover €12K/year. You need €18K/year from part-time work.

---

## Data Structures

### TypeScript Types

```typescript
// types/currency.ts
export type Currency = 'EUR' | 'USD' | 'GBP';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
}

// types/calculator.ts
export type FIREMode = 'traditional' | 'coast' | 'barista';

export interface CalculatorInputs {
  currentAge: number;
  retirementAge: number;
  annualExpenses: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number; // As decimal (0.07 for 7%)
  safeWithdrawalRate: number; // As decimal (0.04 for 4%)
  currency: Currency;
  mode: FIREMode;
}

export interface CalculatorResults {
  fireNumber: number;
  yearsToFIRE: number;
  currentAge: number;
  fireAge: number;
  monthlySavingsNeeded: number;
  totalContributions: number;
  investmentGrowth: number;
  projectedNetWorth: GrowthProjection[];
}

export interface GrowthProjection {
  age: number;
  year: number;
  netWorth: number;
  contributions: number;
  growth: number;
}
```

---

## Component Specifications

### CalculatorForm.tsx

**Purpose**: Collect user inputs

**Props**:
```typescript
interface CalculatorFormProps {
  onCalculate: (inputs: CalculatorInputs) => void;
}
```

**State**:
- Form field values (age, expenses, savings, etc.)
- Validation errors

**Behavior**:
- Input validation (age > 0, expenses > 0, etc.)
- Currency formatting as user types
- Submit triggers calculation
- Reset button clears form

---

### ResultsDisplay.tsx

**Purpose**: Show FIRE calculation results

**Props**:
```typescript
interface ResultsDisplayProps {
  results: CalculatorResults | null;
  currency: Currency;
}
```

**Features**:
- Large, clear FIRE number display
- Years to FIRE with target age
- Monthly savings needed (highlighted if > current contribution)
- Breakdown: total contributions vs investment growth
- "Share results" button (copies URL with params)

---

### CurrencySelector.tsx

**Purpose**: Dropdown to select EUR/USD/GBP

**Props**:
```typescript
interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}
```

**Behavior**:
- Show currency flag icons
- Display symbol next to code (€ EUR, $ USD, £ GBP)
- Default: EUR

---

### SWRSelector.tsx

**Purpose**: Select Safe Withdrawal Rate

**Props**:
```typescript
interface SWRSelectorProps {
  value: number;
  onChange: (swr: number) => void;
}
```

**Options**:
- 3% (conservative, early retirement)
- 3.5% (moderate)
- 4% (traditional, Trinity Study)

**Behavior**:
- Dropdown with explanations
- Tooltip: "Lower SWR = larger nest egg needed, but safer"

---

### Chart.tsx

**Purpose**: Visualize net worth growth over time

**Props**:
```typescript
interface ChartProps {
  data: GrowthProjection[];
  currency: Currency;
}
```

**Chart Type**: Line chart (Chart.js)

**Data**:
- X-axis: Age (current age → FIRE age)
- Y-axis: Net Worth (€0 → FIRE number)
- Line 1: Projected net worth (contributions + growth)
- Horizontal line: FIRE number (target)

**Interactions**:
- Hover: Show exact net worth at age
- Responsive (adjusts to mobile)

---

## Embeddable Widget

### Goal
Allow other bloggers to embed the calculator on their sites.

### Implementation Options

**Option 1: Iframe Embed** (Simplest for MVP)
```html
<iframe
  src="https://fire-calculator.wealthyparrot.com/embed"
  width="100%"
  height="600"
  frameborder="0">
</iframe>
```

**Option 2: Web Component** (Version 2)
```html
<script src="https://fire-calculator.wealthyparrot.com/widget.js"></script>
<fire-calculator currency="EUR" swr="0.04"></fire-calculator>
```

**MVP Decision**: Use iframe (simpler, works everywhere)

### Embed Page (`public/embed.html`)
- Minimal UI (no header/footer)
- Query params for defaults: `?currency=EUR&swr=0.04`
- Lightweight (fast load)

---

## Deployment Strategy

### GitHub Pages Setup

**Steps**:
1. Build production bundle: `npm run build`
2. Deploy `dist/` folder to `gh-pages` branch
3. Configure custom domain: `fire-calculator.wealthyparrot.com`

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Custom Domain**:
- Add `CNAME` file in `public/` with `fire-calculator.wealthyparrot.com`
- Configure DNS: CNAME record pointing to `wealthyparrot.github.io`

---

## Testing Strategy

### Unit Tests (Vitest)

**What to Test**:
1. `calculateFIRENumber()`
2. `calculateYearsToFIRE()`
3. `calculateMonthlySavingsNeeded()`
4. Currency formatting functions
5. Input validation logic

**Example Test** (`tests/fire-calculations.test.ts`):
```typescript
import { describe, it, expect } from 'vitest';
import { calculateFIRENumber } from '../src/utils/fire-calculations';

describe('calculateFIRENumber', () => {
  it('calculates FIRE number with 4% SWR', () => {
    const result = calculateFIRENumber(30000, 0.04);
    expect(result).toBe(750000);
  });

  it('calculates FIRE number with 3% SWR', () => {
    const result = calculateFIRENumber(30000, 0.03);
    expect(result).toBe(1000000);
  });
});
```

**Coverage Goal**: 80%+ for calculation functions

---

## Launch Checklist

### Pre-Launch (Week 1-2)

- [ ] Initialize Vite + React + TypeScript project
- [ ] Set up Tailwind CSS
- [ ] Implement core calculations (FIRE number, years to FIRE)
- [ ] Build CalculatorForm component
- [ ] Build ResultsDisplay component
- [ ] Add CurrencySelector and SWRSelector
- [ ] Write unit tests for calculations
- [ ] Deploy to GitHub Pages
- [ ] Test on mobile + desktop
- [ ] Write comprehensive README.md

### README.md Contents

**Must Include**:
1. Screenshot of calculator
2. Live demo link
3. Features list (EUR-first, multi-currency, embeddable)
4. How to embed (iframe code)
5. Installation instructions (for contributors)
6. License (MIT)
7. Link to Wealthy Parrot blog
8. Contributing guidelines

**Example README Structure**:
```markdown
# European FIRE Calculator 🔥

A modern FIRE calculator built for European investors.

[Live Demo](https://fire-calculator.wealthyparrot.com) |
[Embed on Your Site](#embed) |
[Blog](https://wealthyparrot.com)

## Why This Calculator?

Every FIRE calculator I found was US-centric (USD, US inflation, US tax rules).
This one defaults to EUR, uses ECB data, and includes UK ISA/SIPP awareness.

## Features

- ✅ Multi-currency (EUR/USD/GBP)
- ✅ 3 Safe Withdrawal Rates (3%, 3.5%, 4%)
- ✅ Coast FIRE & Barista FIRE modes
- ✅ Embeddable widget for blogs
- ✅ Open source (MIT license)

## Embed on Your Site

[Iframe code example]

## Development

[Installation, running locally, contributing]
```

---

### Launch Day (Week 3)

**Morning (9-10am PT)**:
- [ ] Final test on production URL
- [ ] Prepare Reddit posts (draft titles/descriptions)
- [ ] Prepare Hacker News "Show HN" post

**Reddit Posts** (11am-12pm PT):
1. r/EuropeFIRE (primary audience)
2. r/financialindependence (broader FIRE community)
3. r/EUpersonalfinance (European focus)

**Hacker News** (12pm PT):
- Submit "Show HN" post
- Monitor comments, respond quickly

**Evening**:
- [ ] Share in Wealthy Parrot newsletter (28 members)
- [ ] Cross-post to relevant forums (Bogleheads, etc.)
- [ ] Monitor GitHub stars, traffic, issues

---

### Post-Launch (Week 4)

- [ ] Collect feedback from GitHub issues
- [ ] Respond to Reddit comments
- [ ] Track metrics (stars, traffic, signups)
- [ ] Fix critical bugs within 24 hours
- [ ] Plan Version 2 features based on requests

---

## Success Criteria

### Week 1 Post-Launch
- ✅ 20+ GitHub stars
- ✅ 100+ visitors from Reddit/HN
- ✅ 10+ email signups from GitHub traffic
- ✅ No critical bugs reported

### Month 3
- ✅ 100+ GitHub stars
- ✅ 500+ total visitors from GitHub
- ✅ 50+ email signups
- ✅ 2-3 other bloggers embedded the widget
- ✅ Featured in r/EuropeFIRE sidebar or wiki

**If Achieved**: Build Portfolio Tracker (Month 4-5)
**If Not Achieved**: Focus on Etsy templates, pause GitHub strategy

---

## Risk Mitigation

### Risk: Low GitHub Engagement

**Mitigation**:
- Launch timing: Tuesday-Thursday 9-11am PT (peak HN traffic)
- Quality README: Screenshot, clear value prop, embed instructions
- Cross-post to 5+ subreddits (not just one)
- Email r/EuropeFIRE mods for sidebar link

### Risk: Calculation Errors

**Mitigation**:
- Unit test all formulas (80%+ coverage)
- Compare results to cFIREsim, other calculators
- Add disclaimer: "Educational purposes, not financial advice"
- GitHub issues for bug reports

### Risk: Poor Mobile UX

**Mitigation**:
- Test on real devices (iPhone, Android)
- Use Tailwind responsive utilities
- Touch-friendly inputs (large tap targets)
- Avoid horizontal scroll

---

## Version History

**v1.0 (MVP)** - Month 1-2:
- Traditional FIRE mode only
- Basic inputs (age, expenses, savings, return)
- Multi-currency (EUR/USD/GBP)
- SWR selector (3%, 3.5%, 4%)
- Embeddable iframe

**v1.1** - Month 3:
- Coast FIRE mode
- Barista FIRE mode
- Improved chart (tooltips, interactions)

**v2.0** - Month 4-6:
- Inflation adjustment (ECB data)
- UK ISA/SIPP tracking
- Monte Carlo simulation
- Multiple scenarios comparison
- Export results (PDF, CSV)

---

## License

MIT License - Open source, free to use, modify, and embed.

---

## Next Steps

1. Initialize project: `npx create-vite@latest fire-calculator --template react-ts`
2. Install dependencies: `npm install tailwindcss chart.js`
3. Set up folder structure (as specified above)
4. Start with calculation functions (`utils/fire-calculations.ts`)
5. Build UI components (form → results → chart)
6. Deploy to GitHub Pages
7. Launch on Reddit + HN

---

**Ready to build?** See implementation guide in main `README.md`.

Last updated: 2026-03-02
