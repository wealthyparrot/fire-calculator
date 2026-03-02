export type Currency = 'EUR' | 'USD' | 'GBP' | 'SEK' | 'NOK' | 'DKK';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
}
