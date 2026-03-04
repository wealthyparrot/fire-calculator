import { describe, it, expect } from 'vitest';
import {
  calculateFIRENumber,
  calculateYearsToFIRE,
  calculateMonthlySavingsNeeded,
  generateGrowthProjection,
} from '../src/utils/fire-calculations';
import type { CalculatorInputs } from '../src/types/calculator';

describe('calculateFIRENumber', () => {
  it('should calculate FIRE number with 4% SWR', () => {
    const result = calculateFIRENumber(30000, 0.04);
    expect(result).toBe(750000);
  });

  it('should calculate FIRE number with 3% SWR', () => {
    const result = calculateFIRENumber(30000, 0.03);
    expect(result).toBe(1000000);
  });

  it('should calculate FIRE number with 3.5% SWR', () => {
    const result = calculateFIRENumber(40000, 0.035);
    expect(result).toBeCloseTo(1142857.14, 2);
  });

  it('should handle edge case with zero expenses', () => {
    const result = calculateFIRENumber(0, 0.04);
    expect(result).toBe(0);
  });
});

describe('calculateYearsToFIRE', () => {
  it('should calculate years to FIRE with monthly contributions', () => {
    const result = calculateYearsToFIRE(
      100000, // current savings
      2000,   // monthly contribution
      750000, // FIRE number
      0.07    // 7% annual return
    );
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(30);
  });

  it('should return 0 when already reached FIRE', () => {
    const result = calculateYearsToFIRE(
      800000, // current savings (already above FIRE number)
      2000,
      750000, // FIRE number
      0.07
    );
    expect(result).toBe(0);
  });

  it('should handle no monthly contribution (only growth)', () => {
    const result = calculateYearsToFIRE(
      500000, // current savings
      0,      // no monthly contribution
      750000, // FIRE number
      0.07    // 7% annual return
    );
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(100);
  });

  it('should cap at 100 years for unrealistic scenarios', () => {
    const result = calculateYearsToFIRE(
      1000,      // very low current savings
      10,        // very low monthly contribution
      10000000,  // very high FIRE number
      0.01       // very low return
    );
    expect(result).toBeGreaterThanOrEqual(100);
    expect(result).toBeLessThanOrEqual(100.1);
  });
});

describe('calculateMonthlySavingsNeeded', () => {
  it('should calculate monthly savings needed for given timeframe', () => {
    const result = calculateMonthlySavingsNeeded(
      100000, // current savings
      750000, // FIRE number
      15,     // years to FIRE
      0.07    // 7% annual return
    );
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(5000); // Reasonable monthly amount
  });

  it('should return 0 when already have enough savings', () => {
    const result = calculateMonthlySavingsNeeded(
      800000, // already above FIRE number
      750000, // FIRE number
      10,
      0.07
    );
    expect(result).toBe(0);
  });

  it('should handle edge case with 0 current savings', () => {
    const result = calculateMonthlySavingsNeeded(
      0,      // no current savings
      750000, // FIRE number
      20,     // years to FIRE
      0.07    // 7% annual return
    );
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(10000);
  });

  it('should handle very short timeframe', () => {
    const result = calculateMonthlySavingsNeeded(
      500000,
      750000,
      2,      // only 2 years
      0.07
    );
    expect(result).toBeGreaterThan(0);
  });
});

describe('generateGrowthProjection', () => {
  const mockInputs: CalculatorInputs = {
    currentAge: 30,
    retirementAge: 65,
    annualExpenses: 30000,
    currentSavings: 100000,
    monthlyContribution: 2000,
    annualReturn: 0.07,
    expectedInflation: 0.02,
    safeWithdrawalRate: 0.04,
    currency: 'EUR',
    mode: 'traditional',
  };

  it('should generate projection array', () => {
    const result = generateGrowthProjection(mockInputs);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should have correct data structure for each projection', () => {
    const result = generateGrowthProjection(mockInputs);
    const firstProjection = result[0];

    expect(firstProjection).toHaveProperty('age');
    expect(firstProjection).toHaveProperty('year');
    expect(firstProjection).toHaveProperty('netWorth');
    expect(firstProjection).toHaveProperty('contributions');
    expect(firstProjection).toHaveProperty('growth');
  });

  it('should show increasing net worth over time', () => {
    const result = generateGrowthProjection(mockInputs);

    for (let i = 1; i < result.length; i++) {
      expect(result[i].netWorth).toBeGreaterThan(result[i - 1].netWorth);
    }
  });

  it('should show increasing age over time', () => {
    const result = generateGrowthProjection(mockInputs);

    for (let i = 1; i < result.length; i++) {
      expect(result[i].age).toBe(result[i - 1].age + 1);
    }
  });

  it('should stop at FIRE number or retirement age', () => {
    const result = generateGrowthProjection(mockInputs);
    const lastProjection = result[result.length - 1];

    const fireNumber = calculateFIRENumber(
      mockInputs.annualExpenses,
      mockInputs.safeWithdrawalRate
    );

    const reachedFIRE = lastProjection.netWorth >= fireNumber;
    const reachedRetirement = lastProjection.age >= mockInputs.retirementAge;

    expect(reachedFIRE || reachedRetirement).toBe(true);
  });

  it('should handle case with no contributions (only growth)', () => {
    const inputsNoContributions: CalculatorInputs = {
      ...mockInputs,
      monthlyContribution: 0,
    };

    const result = generateGrowthProjection(inputsNoContributions);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].contributions).toBe(0);
  });

  it('should include current year in first projection', () => {
    const result = generateGrowthProjection(mockInputs);
    const currentYear = new Date().getFullYear();

    expect(result[0].year).toBe(currentYear);
  });
});
