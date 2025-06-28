import Fuse from 'fuse.js';

export interface StockData {
  name: string;
  symbol: string;
  cmp: number;
  label: string;
}

class StockCsvService {
  private allStocks: StockData[] = [];
  private fuse: Fuse<StockData> | null = null;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;
  private lastRefreshTime = 0;

  private readonly CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3cKGO_dFfNhEC09M0M7VoeDSXmNOxC51VTOj4Aty6SYJ6TNZ9Faoo20bT8dgQpJ6q1Zcpx0Zx7jER/pub?output=csv';

  private readonly fuseOptions = {
    keys: [
      { name: 'symbol', weight: 0.7 },
      { name: 'name', weight: 0.3 }
    ],
    threshold: 0.3, // Lower = more strict matching
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
    findAllMatches: false
  };

  // Parse CSV text into array of objects
  private parseCSV(csvText: string): StockData[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    console.log('📊 CSV Headers found:', headers);
    
    // Find column indices
    const nameIndex = headers.findIndex(h => h.includes('name') || h.includes('company'));
    const symbolIndex = headers.findIndex(h => h.includes('symbol') || h.includes('ticker'));
    const cmpIndex = headers.findIndex(h => h.includes('cmp') || h.includes('price') || h.includes('ltp'));
    
    if (nameIndex === -1 || symbolIndex === -1 || cmpIndex === -1) {
      console.error('❌ Required columns not found in CSV');
      console.log('Available headers:', headers);
      throw new Error('CSV format invalid: Missing required columns (name, symbol, cmp)');
    }
    
    console.log(`📍 Column mapping: name=${nameIndex}, symbol=${symbolIndex}, cmp=${cmpIndex}`);
    
    const stocks: StockData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      
      if (row.length < Math.max(nameIndex, symbolIndex, cmpIndex) + 1) {
        continue; // Skip incomplete rows
      }
      
      const name = row[nameIndex]?.trim().replace(/"/g, '');
      const symbol = row[symbolIndex]?.trim().replace(/"/g, '').toUpperCase();
      const cmpStr = row[cmpIndex]?.trim().replace(/"/g, '');
      
      if (!name || !symbol || !cmpStr) {
        continue; // Skip rows with missing data
      }
      
      const cmp = parseFloat(cmpStr);
      if (isNaN(cmp) || cmp <= 0) {
        continue; // Skip invalid prices
      }
      
      stocks.push({
        name,
        symbol,
        cmp,
        label: `${symbol} - ${name}`
      });
    }
    
    console.log(`✅ Parsed ${stocks.length} stocks from CSV`);
    return stocks;
  }

  // Fetch and parse CSV data
  async loadStocks(): Promise<void> {
    // If data is already loaded and it's been less than 5 minutes, use cached data
    const now = Date.now();
    if (this.isLoaded && (now - this.lastRefreshTime < 5 * 60 * 1000)) {
      return;
    }
    
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }
    
    this.isLoading = true;
    this.loadPromise = this.fetchAndParseCSV();
    
    try {
      await this.loadPromise;
      this.lastRefreshTime = now;
    } finally {
      this.isLoading = false;
    }
  }

  private async fetchAndParseCSV(): Promise<void> {
    try {
      console.log('🌐 Fetching stock data from Google Sheet...');
      console.log('📍 CSV URL:', this.CSV_URL);
      
      // Add a cache-busting parameter to avoid browser caching
      const cacheBuster = `?_=${Date.now()}`;
      const url = this.CSV_URL.includes('?') 
        ? `${this.CSV_URL}&_=${Date.now()}`
        : `${this.CSV_URL}${cacheBuster}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv,text/plain,*/*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        // Add timeout
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      console.log(`📄 CSV data received: ${csvText.length} characters`);
      
      if (!csvText.trim()) {
        throw new Error('CSV data is empty');
      }
      
      // Parse CSV into stock objects
      this.allStocks = this.parseCSV(csvText);
      
      if (this.allStocks.length === 0) {
        throw new Error('No valid stock data found in CSV');
      }
      
      // Initialize Fuse.js for fuzzy search
      this.fuse = new Fuse(this.allStocks, this.fuseOptions);
      this.isLoaded = true;
      
      console.log(`🚀 Stock data loaded successfully: ${this.allStocks.length} stocks`);
      console.log('📊 Sample stocks:', this.allStocks.slice(0, 3));
      
    } catch (error) {
      console.error('💥 Failed to load stock data:', error);
      this.allStocks = [];
      this.fuse = null;
      this.isLoaded = false;
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection and try again.');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to Google Sheets. Please check your internet connection.');
        }
      }
      
      throw error;
    }
  }

  // Search stocks using Fuse.js fuzzy search
  searchStocks(query: string, limit: number = 10): StockData[] {
    if (!this.fuse || !query.trim()) {
      return [];
    }
    
    const results = this.fuse.search(query.trim(), { limit });
    return results.map(result => result.item);
  }

  // Get stock by exact symbol match
  getStockBySymbol(symbol: string): StockData | null {
    const upperSymbol = symbol.toUpperCase().trim();
    return this.allStocks.find(stock => stock.symbol === upperSymbol) || null;
  }

  // Get all stocks (for debugging)
  getAllStocks(): StockData[] {
    return [...this.allStocks];
  }

  // Check if data is loaded
  isDataLoaded(): boolean {
    return this.isLoaded;
  }

  // Check if currently loading
  isDataLoading(): boolean {
    return this.isLoading;
  }

  // Get total stock count
  getStockCount(): number {
    return this.allStocks.length;
  }

  // Refresh data (re-fetch CSV)
  async refreshData(): Promise<void> {
    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
    this.allStocks = [];
    this.fuse = null;
    
    await this.loadStocks();
  }
}

// Export singleton instance
export const stockCsvService = new StockCsvService();
export default stockCsvService;