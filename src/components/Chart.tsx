import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { GrowthProjection } from '../types/calculator';
import type { Currency } from '../types/currency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: GrowthProjection[];
  fireNumber: number;
  currency: Currency;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
};

export function Chart({ data, fireNumber, currency }: ChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const currencySymbol = CURRENCY_SYMBOLS[currency];

  const formatCurrency = (amount: number): string => {
    return `${currencySymbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const chartData = {
    labels: data.map((d) => d.age.toString()),
    datasets: [
      {
        label: 'Portfolio Value',
        data: data.map((d) => d.netWorth),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'FIRE Number Target',
        data: data.map(() => fireNumber),
        borderColor: '#10B981',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [10, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Age',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Portfolio Value',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        ticks: {
          callback: (value: any) => {
            return formatCurrency(value);
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Portfolio Growth Projection
      </h3>
      <div className="h-96">
        <Line data={chartData} options={options} />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        <span className="font-medium">Portfolio Value</span> represents your total investment balance, including current savings plus all future contributions and investment growth over time.
      </p>
    </div>
  );
}
