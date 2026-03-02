import { useState } from 'react';
import type { CalculatorInputs, CalculatorResults } from './types/calculator';
import type { Currency } from './types/currency';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Chart } from './components/Chart';
import {
  calculateFIRENumber,
  calculateYearsToFIRE,
  calculateMonthlySavingsNeeded,
  generateGrowthProjection,
} from './utils/fire-calculations';

function App() {
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(2000);

  const handleCalculate = (inputs: CalculatorInputs) => {
    // Update state from inputs
    setCurrency(inputs.currency);
    setRetirementAge(inputs.retirementAge);
    setMonthlyContribution(inputs.monthlyContribution);

    // Calculate real return (nominal return minus inflation)
    const realReturn = Math.max(0, inputs.annualReturn - inputs.expectedInflation);

    // Calculate FIRE number based on mode
    let baseExpenses = inputs.annualExpenses;

    // Barista FIRE: Reduce expenses by expected part-time income
    if (inputs.mode === 'barista' && inputs.baristaIncome && inputs.baristaIncome > 0) {
      baseExpenses = Math.max(0, inputs.annualExpenses - inputs.baristaIncome);
    }

    // Calculate FIRE number (base, without pension)
    const fireNumberWithoutPension = calculateFIRENumber(
      baseExpenses,
      inputs.safeWithdrawalRate
    );

    // Adjust for state pension if provided
    const hasPension = inputs.expectedPension && inputs.expectedPension > 0;
    const adjustedExpenses = hasPension
      ? Math.max(0, baseExpenses - (inputs.expectedPension || 0))
      : baseExpenses;

    const fireNumber = hasPension
      ? calculateFIRENumber(adjustedExpenses, inputs.safeWithdrawalRate)
      : fireNumberWithoutPension;

    // Calculate years to FIRE based on mode
    let yearsToFIRE: number;
    let coastNumber: number | undefined;

    if (inputs.mode === 'coast') {
      // Coast FIRE: Calculate minimum needed today to reach FIRE number by retirement age
      const yearsUntilRetirement = inputs.retirementAge - inputs.currentAge;
      coastNumber = fireNumber / Math.pow(1 + realReturn, yearsUntilRetirement);

      if (inputs.currentSavings >= coastNumber) {
        // Already coasting - just need to wait until retirement age
        yearsToFIRE = yearsUntilRetirement;
      } else {
        // Calculate years to reach coast number with current contributions
        yearsToFIRE = calculateYearsToFIRE(
          inputs.currentSavings,
          inputs.monthlyContribution,
          coastNumber,
          realReturn
        );
      }
    } else {
      // Traditional or Barista FIRE: Calculate years to reach full FIRE number
      yearsToFIRE = calculateYearsToFIRE(
        inputs.currentSavings,
        inputs.monthlyContribution,
        fireNumber,
        realReturn
      );
    }

    // Calculate fire age
    const fireAge = Math.round(inputs.currentAge + yearsToFIRE);

    // Calculate recommended SWR based on retirement duration
    const assumedLifeExpectancy = 95;
    // For Coast FIRE, actual retirement starts at retirementAge, not fireAge
    const actualRetirementAge = inputs.mode === 'coast' ? inputs.retirementAge : fireAge;
    const retirementDuration = assumedLifeExpectancy - actualRetirementAge;
    let recommendedSWR: number;

    if (retirementDuration >= 50) {
      recommendedSWR = 0.03; // 50+ years
    } else if (retirementDuration >= 40) {
      recommendedSWR = 0.035; // 40-50 years
    } else {
      recommendedSWR = 0.04; // 30-40 years
    }

    // Calculate monthly savings needed
    // For Coast FIRE, target is the coast number, not the full FIRE number
    const savingsTarget = inputs.mode === 'coast' && coastNumber ? coastNumber : fireNumber;
    const monthlySavingsNeeded = calculateMonthlySavingsNeeded(
      inputs.currentSavings,
      savingsTarget,
      yearsToFIRE,
      realReturn
    );

    // Generate growth projection
    const projectedNetWorth = generateGrowthProjection(inputs);

    // Calculate total contributions and growth
    const lastProjection =
      projectedNetWorth.length > 0
        ? projectedNetWorth[projectedNetWorth.length - 1]
        : null;

    const totalContributions = lastProjection ? lastProjection.contributions : 0;
    const investmentGrowth = lastProjection ? lastProjection.growth : 0;

    const calculatedResults: CalculatorResults = {
      fireNumber,
      fireNumberWithoutPension: hasPension ? fireNumberWithoutPension : undefined,
      yearsToFIRE,
      currentAge: inputs.currentAge,
      fireAge,
      monthlySavingsNeeded,
      totalContributions,
      investmentGrowth,
      projectedNetWorth,
      expectedPension: inputs.expectedPension,
      pensionStartAge: inputs.pensionStartAge,
      recommendedSWR,
      currentSWR: inputs.safeWithdrawalRate,
      mode: inputs.mode,
      coastNumber,
      baristaIncome: inputs.baristaIncome,
    };

    setResults(calculatedResults);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            FIRE Calculator
          </h1>
          <p className="text-gray-600">
            Calculate your Financial Independence, Retire Early number
          </p>
        </header>

        <main className="mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
            {/* Left Panel - Input Form */}
            <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Your Details
              </h2>
              <CalculatorForm onCalculate={handleCalculate} />
            </div>

            {/* Right Panel - Results */}
            <div className="flex-1 space-y-6">
              <ResultsDisplay results={results} currency={currency} retirementAge={retirementAge} monthlyContribution={monthlyContribution} />
              {results && (
                <Chart
                  data={results.projectedNetWorth}
                  fireNumber={results.fireNumber}
                  currency={currency}
                />
              )}
            </div>
          </div>
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Made with data by{' '}
            <a
              href="https://www.wealthyparrot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Wealthy Parrot
            </a>
            {' · '}
            <a
              href="https://github.com/wealthyparrot/fire-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
