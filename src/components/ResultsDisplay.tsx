import type { CalculatorResults } from '../types/calculator';
import type { Currency } from '../types/currency';

interface ResultsDisplayProps {
  results: CalculatorResults | null;
  currency: Currency;
  retirementAge?: number;
  monthlyContribution?: number;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
};

export function ResultsDisplay({ results, currency, retirementAge, monthlyContribution }: ResultsDisplayProps) {
  if (!results) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-lg">
          Enter your details and click "Calculate FIRE Number" to see your results
        </p>
      </div>
    );
  }

  const currencySymbol = CURRENCY_SYMBOLS[currency];

  const formatCurrency = (amount: number): string => {
    return `${currencySymbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const progressPercentage = (
    (results.currentAge / results.fireAge) * 100
  ).toFixed(0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Main FIRE Number */}
      <div className="text-center pb-6 border-b border-gray-200">
        <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">
          Your FIRE Number
        </p>
        <p className="text-5xl font-bold text-primary">
          {formatCurrency(results.fireNumber)}
        </p>
        {results.fireNumberWithoutPension && results.expectedPension && results.expectedPension > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            <p className="line-through">{formatCurrency(results.fireNumberWithoutPension)} without pension</p>
            <p className="text-success font-semibold mt-1">
              Reduced by {formatCurrency(results.fireNumberWithoutPension - results.fireNumber)} ({Math.round(((results.fireNumberWithoutPension - results.fireNumber) / results.fireNumberWithoutPension) * 100)}% savings)
            </p>
          </div>
        )}
      </div>

      {/* State Pension Impact */}
      {!!results.expectedPension && results.expectedPension > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-800 mb-2">
            State Pension Included
          </p>
          <p className="text-sm text-gray-700">
            With an expected pension of <span className="font-semibold">{formatCurrency(results.expectedPension)}/year</span> starting at age <span className="font-semibold">{results.pensionStartAge}</span>, your required portfolio is reduced from {formatCurrency(results.fireNumberWithoutPension || 0)} to {formatCurrency(results.fireNumber)}.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            The pension income covers part of your annual expenses, reducing the amount you need to withdraw from your portfolio.
          </p>
        </div>
      )}

      {/* Coast FIRE Mode */}
      {results.mode === 'coast' && results.coastNumber && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-800 mb-2">
            Coast FIRE Strategy
          </p>
          <p className="text-sm text-gray-700">
            Save aggressively to reach <span className="font-semibold">{formatCurrency(results.coastNumber)}</span> (your "coast number"), then reduce work hours to only cover living expenses without adding to savings. Compound growth will carry your portfolio to <span className="font-semibold">{formatCurrency(results.fireNumber)}</span> by age {retirementAge}.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            You keep working but at reduced hours, earning just enough to meet expenses while your investments grow toward full retirement.
          </p>
        </div>
      )}

      {/* Barista FIRE Mode */}
      {results.mode === 'barista' && results.baristaIncome && results.baristaIncome > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm font-medium text-purple-800 mb-2">
            Barista FIRE Strategy
          </p>
          <p className="text-sm text-gray-700">
            With <span className="font-semibold">{formatCurrency(results.baristaIncome)}/year</span> from part-time work covering your living expenses, you only need <span className="font-semibold">{formatCurrency(results.fireNumber)}</span> in your portfolio.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            This is significantly less than traditional FIRE because your part-time income reduces the amount you need to withdraw from your portfolio.
          </p>
        </div>
      )}

      {/* FIRE Age Explanation (hide for Coast FIRE since it has its own explanation) */}
      {retirementAge && results.mode !== 'coast' && (
        <div className={`rounded-lg p-4 ${
          results.fireAge <= retirementAge ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
        }`}>
          <p className={`text-sm font-medium mb-1 ${
            results.fireAge <= retirementAge ? 'text-green-800' : 'text-amber-800'
          }`}>
            {results.fireAge <= retirementAge
              ? `You could be financially independent ${retirementAge - results.fireAge} years before your target retirement age`
              : `At your current savings rate, you will reach FIRE ${results.fireAge - retirementAge} years after your target retirement age`
            }
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Your target retirement age is <span className="font-semibold">{retirementAge}</span>, but based on your savings and returns, you will reach your FIRE number at age <span className="font-semibold">{results.fireAge}</span>.
          </p>
        </div>
      )}

      {/* SWR Recommendation */}
      {results.recommendedSWR && results.currentSWR && results.recommendedSWR !== results.currentSWR && (
        <div className={`rounded-lg p-4 ${
          results.currentSWR > results.recommendedSWR
            ? 'bg-amber-50 border border-amber-200'
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-sm font-medium mb-1 ${
            results.currentSWR > results.recommendedSWR ? 'text-amber-800' : 'text-blue-800'
          }`}>
            {results.currentSWR > results.recommendedSWR
              ? '⚠️ Your withdrawal rate may be too aggressive'
              : 'ℹ️ You could use a higher withdrawal rate'
            }
          </p>
          <p className="text-sm text-gray-700">
            {results.mode === 'coast'
              ? `Based on your retirement age (${retirementAge}), you'll be retired for approximately ${95 - (retirementAge || results.fireAge)} years.`
              : `Based on your FIRE age (${results.fireAge}), you'll retire for approximately ${95 - results.fireAge} years.`
            }
            {' '}We recommend using a <span className="font-semibold">{(results.recommendedSWR * 100).toFixed(1)}% SWR</span> instead of {(results.currentSWR * 100).toFixed(1)}%
            to ensure your money lasts.
          </p>
          {results.currentSWR > results.recommendedSWR && (
            <p className="text-xs text-gray-600 mt-2">
              Using {(results.currentSWR * 100).toFixed(1)}% for a {95 - (results.mode === 'coast' ? (retirementAge || results.fireAge) : results.fireAge)}-year retirement increases the risk of running out of money.
            </p>
          )}
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Years to FIRE */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">
            {results.mode === 'coast' ? 'Years to Coast' : 'Years to FIRE'}
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {results.yearsToFIRE.toFixed(1)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {results.mode === 'coast'
              ? `Coast age: ${results.fireAge} · Full retirement: ${retirementAge}`
              : `FIRE age: ${results.fireAge}`
            }
          </p>
        </div>

        {/* Monthly Savings Needed */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Monthly Savings Needed</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(results.monthlySavingsNeeded)}
          </p>
          {monthlyContribution !== undefined && results.monthlySavingsNeeded > 0 && (
            monthlyContribution >= results.monthlySavingsNeeded ? (
              <p className="text-sm text-success mt-1">
                You're saving {formatCurrency(monthlyContribution)}/mo - on track
              </p>
            ) : (
              <p className="text-sm text-error mt-1">
                You're saving {formatCurrency(monthlyContribution)}/mo - {formatCurrency(results.monthlySavingsNeeded - monthlyContribution)} short
              </p>
            )
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Breakdown at FIRE
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Contributions</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(results.totalContributions)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Investment Growth</span>
            <span className="font-semibold text-success">
              {formatCurrency(results.investmentGrowth)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-gray-900 font-semibold">Portfolio Value at FIRE</span>
            <span className="font-bold text-primary text-xl">
              {formatCurrency(results.fireNumber)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress to FIRE Age</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary rounded-full h-3 transition-all duration-500"
            style={{ width: `${Math.min(100, Number(progressPercentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
