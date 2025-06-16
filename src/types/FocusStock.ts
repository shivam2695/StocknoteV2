export interface FocusStock {
  id: string;
  symbol: string;
  targetPrice: number;
  currentPrice: number;
  reason: string;
  dateAdded: string;
  tradeTaken: boolean;
  tradeDate?: string;
  notes?: string;
  tag?: 'worked' | 'missed' | 'failed' | 'watch';
}