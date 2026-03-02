import type { Currency, CurrencyInfo } from '../types/currency';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

const CURRENCIES: CurrencyInfo[] = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
];

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="w-full">
      <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
        Currency
      </label>
      <select
        id="currency"
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900"
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
}
