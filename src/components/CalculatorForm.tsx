import { useState } from 'react';
import type { CalculatorInputs, FIREMode } from '../types/calculator';
import type { Currency } from '../types/currency';
import { CurrencySelector } from './CurrencySelector';
import { SWRSelector } from './SWRSelector';

interface CalculatorFormProps {
  onCalculate: (inputs: CalculatorInputs) => void;
}

export function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const [currentAge, setCurrentAge] = useState<string>('30');
  const [retirementAge, setRetirementAge] = useState<string>('65');
  const [annualExpenses, setAnnualExpenses] = useState<string>('30000');
  const [currentSavings, setCurrentSavings] = useState<string>('100000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('2000');
  const [annualReturn, setAnnualReturn] = useState<string>('7');
  const [expectedInflation, setExpectedInflation] = useState<string>('3');
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState<number>(0.04);
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [mode, setMode] = useState<FIREMode>('traditional');
  const [expectedPension, setExpectedPension] = useState<string>('0');
  const [pensionStartAge, setPensionStartAge] = useState<string>('67');
  const [baristaIncome, setBaristaIncome] = useState<string>('0');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const currentAgeNum = parseFloat(currentAge);
    const retirementAgeNum = parseFloat(retirementAge);
    const annualExpensesNum = parseFloat(annualExpenses);
    const currentSavingsNum = parseFloat(currentSavings);
    const monthlyContributionNum = parseFloat(monthlyContribution);
    const annualReturnNum = parseFloat(annualReturn);
    const expectedInflationNum = parseFloat(expectedInflation);

    if (isNaN(currentAgeNum) || currentAgeNum < 18 || currentAgeNum > 100) {
      newErrors.currentAge = 'Age must be between 18 and 100';
    }

    if (isNaN(retirementAgeNum) || retirementAgeNum <= currentAgeNum) {
      newErrors.retirementAge = 'Retirement age must be greater than current age';
    }

    if (retirementAgeNum > 100) {
      newErrors.retirementAge = 'Retirement age must be 100 or less';
    }

    if (isNaN(annualExpensesNum) || annualExpensesNum < 0) {
      newErrors.annualExpenses = 'Annual expenses cannot be negative';
    }

    if (isNaN(currentSavingsNum) || currentSavingsNum < 0) {
      newErrors.currentSavings = 'Current savings cannot be negative';
    }

    if (isNaN(monthlyContributionNum) || monthlyContributionNum < 0) {
      newErrors.monthlyContribution = 'Monthly contribution cannot be negative';
    }

    if (isNaN(annualReturnNum) || annualReturnNum < 0 || annualReturnNum > 100) {
      newErrors.annualReturn = 'Expected return must be between 0% and 100%';
    }

    if (isNaN(expectedInflationNum) || expectedInflationNum < 0 || expectedInflationNum > 20) {
      newErrors.expectedInflation = 'Inflation must be between 0% and 20%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const inputs: CalculatorInputs = {
      currentAge: parseFloat(currentAge),
      retirementAge: parseFloat(retirementAge),
      annualExpenses: parseFloat(annualExpenses),
      currentSavings: parseFloat(currentSavings),
      monthlyContribution: parseFloat(monthlyContribution),
      annualReturn: parseFloat(annualReturn) / 100, // Convert percentage to decimal
      expectedInflation: parseFloat(expectedInflation) / 100, // Convert percentage to decimal
      safeWithdrawalRate,
      currency,
      mode,
      expectedPension: parseFloat(expectedPension) || 0,
      pensionStartAge: parseFloat(pensionStartAge) || 67,
      baristaIncome: parseFloat(baristaIncome) || 0,
    };

    onCalculate(inputs);
  };

  const handleReset = () => {
    setCurrentAge('30');
    setRetirementAge('65');
    setAnnualExpenses('30000');
    setCurrentSavings('100000');
    setMonthlyContribution('2000');
    setAnnualReturn('7');
    setExpectedInflation('3');
    setSafeWithdrawalRate(0.04);
    setCurrency('EUR');
    setMode('traditional');
    setExpectedPension('0');
    setPensionStartAge('67');
    setBaristaIncome('0');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Current Age */}
        <div>
          <label htmlFor="currentAge" className="block text-sm font-medium text-gray-700 mb-1">
            Current Age
          </label>
          <input
            type="number"
            id="currentAge"
            value={currentAge}
            onChange={(e) => setCurrentAge(e.target.value)}
            min="18"
            max="100"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.currentAge ? 'border-error' : 'border-gray-300'
            }`}
          />
          {errors.currentAge && (
            <p className="mt-1 text-xs text-error">{errors.currentAge}</p>
          )}
        </div>

        {/* Retirement Age */}
        <div>
          <label htmlFor="retirementAge" className="block text-sm font-medium text-gray-700 mb-1">
            Target Retirement Age
          </label>
          <input
            type="number"
            id="retirementAge"
            value={retirementAge}
            onChange={(e) => setRetirementAge(e.target.value)}
            min={parseFloat(currentAge || '0') + 1}
            max="100"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.retirementAge ? 'border-error' : 'border-gray-300'
            }`}
          />
          {errors.retirementAge && (
            <p className="mt-1 text-xs text-error">{errors.retirementAge}</p>
          )}
        </div>

        {/* Annual Expenses */}
        <div>
          <label htmlFor="annualExpenses" className="block text-sm font-medium text-gray-700 mb-1">
            Annual Expenses
          </label>
          <input
            type="number"
            id="annualExpenses"
            value={annualExpenses}
            onChange={(e) => setAnnualExpenses(e.target.value)}
            min="0"
            step="1000"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.annualExpenses ? 'border-error' : 'border-gray-300'
            }`}
          />
          {errors.annualExpenses && (
            <p className="mt-1 text-xs text-error">{errors.annualExpenses}</p>
          )}
        </div>

        {/* Current Savings */}
        <div>
          <label htmlFor="currentSavings" className="block text-sm font-medium text-gray-700 mb-1">
            Current Savings
          </label>
          <input
            type="number"
            id="currentSavings"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            min="0"
            step="1000"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.currentSavings ? 'border-error' : 'border-gray-300'
            }`}
          />
          {errors.currentSavings && (
            <p className="mt-1 text-xs text-error">{errors.currentSavings}</p>
          )}
        </div>

        {/* Monthly Contribution */}
        <div>
          <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Contribution
          </label>
          <input
            type="number"
            id="monthlyContribution"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            min="0"
            step="100"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.monthlyContribution ? 'border-error' : 'border-gray-300'
            }`}
          />
          {errors.monthlyContribution && (
            <p className="mt-1 text-xs text-error">{errors.monthlyContribution}</p>
          )}
        </div>

        {/* Expected Annual Return */}
        <div>
          <label htmlFor="annualReturn" className="block text-sm font-medium text-gray-700 mb-1">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            id="annualReturn"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
            min="0"
            max="100"
            step="0.1"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.annualReturn ? 'border-error' : 'border-gray-300'
            }`}
          />
          {errors.annualReturn && (
            <p className="mt-1 text-xs text-error">{errors.annualReturn}</p>
          )}
        </div>

        {/* Expected Inflation */}
        <div>
          <label htmlFor="expectedInflation" className="block text-sm font-medium text-gray-700 mb-1">
            Expected Inflation (%)
          </label>
          <input
            type="number"
            id="expectedInflation"
            value={expectedInflation}
            onChange={(e) => setExpectedInflation(e.target.value)}
            min="0"
            max="20"
            step="0.1"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.expectedInflation ? 'border-error' : 'border-gray-300'
            }`}
          />
          <p className="mt-1 text-xs text-gray-500">
            Used to adjust returns to today's purchasing power. Real return: {(parseFloat(annualReturn || '0') - parseFloat(expectedInflation || '0')).toFixed(1)}%
          </p>
          {errors.expectedInflation && (
            <p className="mt-1 text-xs text-error">{errors.expectedInflation}</p>
          )}
        </div>

        {/* Currency Selector */}
        <div>
          <CurrencySelector value={currency} onChange={setCurrency} />
        </div>

        {/* SWR Selector */}
        <div>
          <SWRSelector value={safeWithdrawalRate} onChange={setSafeWithdrawalRate} />
        </div>
      </div>

      {/* FIRE Mode Selector */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          FIRE Strategy
        </h3>
        <div className="space-y-3">
          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="fireMode"
              value="traditional"
              checked={mode === 'traditional'}
              onChange={(e) => setMode(e.target.value as FIREMode)}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">Traditional FIRE</p>
              <p className="text-sm text-gray-600">Save until your portfolio reaches your FIRE number, then retire completely</p>
            </div>
          </label>

          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="fireMode"
              value="coast"
              checked={mode === 'coast'}
              onChange={(e) => setMode(e.target.value as FIREMode)}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">Coast FIRE</p>
              <p className="text-sm text-gray-600">Save aggressively until you reach a target amount, then reduce work hours to just cover living expenses while your savings grow to your FIRE number by retirement age</p>
            </div>
          </label>

          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="fireMode"
              value="barista"
              checked={mode === 'barista'}
              onChange={(e) => setMode(e.target.value as FIREMode)}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">Barista FIRE</p>
              <p className="text-sm text-gray-600">Build a smaller portfolio, then work part-time to cover living expenses while your portfolio grows</p>
            </div>
          </label>
        </div>

        {/* Barista FIRE Income Field (conditional) */}
        {mode === 'barista' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <label htmlFor="baristaIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Part-Time Annual Income
            </label>
            <input
              type="number"
              id="baristaIncome"
              value={baristaIncome}
              onChange={(e) => setBaristaIncome(e.target.value)}
              min="0"
              step="1000"
              placeholder="15000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-gray-600">
              Annual income from part-time work that will cover expenses while your portfolio grows
            </p>
          </div>
        )}
      </div>

      {/* State Pension Section */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          State Pension (Optional)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Include expected government pension to reduce your FIRE number. Your pension typically starts at age 65-67 depending on your country.
        </p>

        <div className="space-y-4">
          {/* Expected Annual Pension */}
          <div>
            <label htmlFor="expectedPension" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Annual Pension (Net)
            </label>
            <input
              type="number"
              id="expectedPension"
              value={expectedPension}
              onChange={(e) => setExpectedPension(e.target.value)}
              min="0"
              step="any"
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-gray-500">
              Annual amount you expect to receive from state pension after taxes
            </p>
          </div>

          {/* Pension Start Age */}
          <div>
            <label htmlFor="pensionStartAge" className="block text-sm font-medium text-gray-700 mb-1">
              Pension Start Age
            </label>
            <input
              type="number"
              id="pensionStartAge"
              value={pensionStartAge}
              onChange={(e) => setPensionStartAge(e.target.value)}
              min="55"
              max="75"
              placeholder="67"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-gray-500">
              Age when pension payments begin (UK: 67, varies by country)
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Calculate FIRE Number
        </button>
      </div>
    </form>
  );
}
