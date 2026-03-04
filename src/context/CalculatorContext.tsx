import { createContext, useContext, useState, ReactNode } from 'react';
import type { CalculatorInputs, CalculatorResults } from '../types/calculator';
import {
  calculateFIRENumber,
  calculateYearsToFIRE,
  calculateMonthlySavingsNeeded,
  generateGrowthProjection,
} from '../utils/fire-calculations';

interface CalculatorContextType {
  inputs: CalculatorInputs | null;
  results: CalculatorResults | null;
  updateInputs: (inputs: CalculatorInputs) => void;
  calculate: (inputs: CalculatorInputs) => void;
  reset: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const calculate = (newInputs: CalculatorInputs) => {
    setInputs(newInputs);

    // Calculate FIRE number
    const fireNumber = calculateFIRENumber(
      newInputs.annualExpenses,
      newInputs.safeWithdrawalRate
    );

    // Calculate years to FIRE
    const yearsToFIRE = calculateYearsToFIRE(
      newInputs.currentSavings,
      newInputs.monthlyContribution,
      fireNumber,
      newInputs.annualReturn
    );

    // Calculate fire age
    const fireAge = Math.round(newInputs.currentAge + yearsToFIRE);

    // Calculate monthly savings needed
    const monthlySavingsNeeded = calculateMonthlySavingsNeeded(
      newInputs.currentSavings,
      fireNumber,
      yearsToFIRE,
      newInputs.annualReturn
    );

    // Generate growth projection
    const projectedNetWorth = generateGrowthProjection(newInputs);

    // Calculate total contributions and growth
    const lastProjection =
      projectedNetWorth.length > 0
        ? projectedNetWorth[projectedNetWorth.length - 1]
        : null;

    const totalContributions = lastProjection ? lastProjection.contributions : 0;
    const investmentGrowth = lastProjection ? lastProjection.growth : 0;

    const calculatedResults: CalculatorResults = {
      fireNumber,
      yearsToFIRE,
      currentAge: newInputs.currentAge,
      fireAge,
      monthlySavingsNeeded,
      totalContributions,
      investmentGrowth,
      projectedNetWorth,
      mode: newInputs.mode,
    };

    setResults(calculatedResults);
  };

  const updateInputs = (newInputs: CalculatorInputs) => {
    setInputs(newInputs);
  };

  const reset = () => {
    setInputs(null);
    setResults(null);
  };

  return (
    <CalculatorContext.Provider
      value={{
        inputs,
        results,
        updateInputs,
        calculate,
        reset,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
