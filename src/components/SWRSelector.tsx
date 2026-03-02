interface SWRSelectorProps {
  value: number;
  onChange: (swr: number) => void;
}

interface SWROption {
  value: number;
  label: string;
  description: string;
}

const SWR_OPTIONS: SWROption[] = [
  {
    value: 0.03,
    label: '3%',
    description: 'Conservative - FIRE at age 35-45'
  },
  {
    value: 0.035,
    label: '3.5%',
    description: 'Moderate - FIRE at age 50-55'
  },
  {
    value: 0.04,
    label: '4%',
    description: 'Traditional - Retire at age 65'
  },
];

export function SWRSelector({ value, onChange }: SWRSelectorProps) {
  return (
    <div className="w-full">
      <label htmlFor="swr" className="block text-sm font-medium text-gray-700 mb-1">
        Safe Withdrawal Rate (SWR)
      </label>
      <select
        id="swr"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900"
      >
        {SWR_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} - {option.description}
          </option>
        ))}
      </select>
      <p className="mt-2 text-sm text-gray-600">
        The annual percentage you can safely withdraw from your portfolio without running out of money. A 4% rate supports a 30-year retirement (retiring at 65). Longer retirements require lower rates. Example: To cover €30,000/year at 4% requires €750,000.
      </p>
    </div>
  );
}
