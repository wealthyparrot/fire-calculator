import type { Currency } from './currency';

export type FIREMode = 'traditional' | 'coast' | 'barista';

export interface CalculatorInputs {
  currentAge: number;
  retirementAge: number;
  annualExpenses: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number; // As decimal (0.07 for 7%)
  expectedInflation: number; // As decimal (0.03 for 3%)
  safeWithdrawalRate: number; // As decimal (0.04 for 4%)
  currency: Currency;
  mode: FIREMode;
  // State pension integration
  expectedPension?: number; // Annual pension amount
  pensionStartAge?: number; // Age when pension starts (e.g., 67)
  // Barista FIRE
  baristaIncome?: number; // Annual part-time income for Barista FIRE
}

export interface CalculatorResults {
  fireNumber: number;
  fireNumberWithoutPension?: number; // Original FIRE number before pension adjustment
  yearsToFIRE: number;
  currentAge: number;
  fireAge: number;
  monthlySavingsNeeded: number;
  totalContributions: number;
  investmentGrowth: number;
  projectedNetWorth: GrowthProjection[];
  expectedPension?: number; // For display purposes
  pensionStartAge?: number; // For display purposes
  recommendedSWR?: number; // Recommended SWR based on retirement duration
  currentSWR?: number; // User's selected SWR for comparison
  mode: FIREMode; // FIRE strategy mode
  coastNumber?: number; // Minimum savings needed today for Coast FIRE
  baristaIncome?: number; // Part-time income for Barista FIRE
}

export interface GrowthProjection {
  age: number;
  year: number;
  netWorth: number;
  contributions: number;
  growth: number;
}
