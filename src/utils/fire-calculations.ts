import type { CalculatorInputs, GrowthProjection } from '../types/calculator';

/**
 * Calculate the FIRE number (portfolio size needed for financial independence)
 * Formula: Annual Expenses / Safe Withdrawal Rate
 */
export function calculateFIRENumber(
  annualExpenses: number,
  safeWithdrawalRate: number
): number {
  return annualExpenses / safeWithdrawalRate;
}

/**
 * Calculate years to reach FIRE using iterative simulation
 * Simulates monthly contributions and compound growth until FIRE number is reached
 */
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

/**
 * Calculate monthly savings needed to reach FIRE number in target years
 * Rearranged future value formula solving for monthly payment
 */
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

  if (remainingNeeded <= 0) {
    return 0;
  }

  const monthlyPayment =
    (remainingNeeded / ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn));

  return Math.max(0, monthlyPayment);
}

/**
 * Generate year-by-year projection of net worth growth until FIRE
 * Returns array of growth data points for charting
 */
export function generateGrowthProjection(inputs: CalculatorInputs): GrowthProjection[] {
  const projections: GrowthProjection[] = [];
  const currentYear = new Date().getFullYear();
  const fireNumber = calculateFIRENumber(inputs.annualExpenses, inputs.safeWithdrawalRate);

  // Use real return (nominal minus inflation) for projections in today's purchasing power
  const realReturn = Math.max(0, inputs.annualReturn - inputs.expectedInflation);

  let balance = inputs.currentSavings;
  let totalContributions = 0;
  let age = inputs.currentAge;
  let year = 0;

  // Generate projection for each year until FIRE or retirement age
  while (balance < fireNumber && age <= inputs.retirementAge && year < 100) {
    const annualContribution = inputs.monthlyContribution * 12;

    // Apply annual contributions and growth
    balance += annualContribution;
    totalContributions += annualContribution;
    const growth = balance * realReturn;
    balance += growth;

    projections.push({
      age: Math.round(age),
      year: currentYear + year,
      netWorth: Math.round(balance),
      contributions: Math.round(totalContributions),
      growth: Math.round(balance - inputs.currentSavings - totalContributions),
    });

    age += 1;
    year += 1;
  }

  return projections;
}
