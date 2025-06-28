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
  private fallbackMode = false;

  // Fallback data for when Google Sheets is unavailable
  private readonly FALLBACK_STOCKS: StockData[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', cmp: 2934.75, label: 'RELIANCE - Reliance Industries Ltd' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', cmp: 3456.80, label: 'TCS - Tata Consultancy Services Ltd' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', cmp: 1678.45, label: 'HDFCBANK - HDFC Bank Ltd' },
    { symbol: 'INFY', name: 'Infosys Ltd', cmp: 1432.60, label: 'INFY - Infosys Ltd' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', cmp: 987.25, label: 'ICICIBANK - ICICI Bank Ltd' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', cmp: 2567.30, label: 'HINDUNILVR - Hindustan Unilever Ltd' },
    { symbol: 'ITC', name: 'ITC Ltd', cmp: 432.15, label: 'ITC - ITC Ltd' },
    { symbol: 'SBIN', name: 'State Bank of India', cmp: 654.90, label: 'SBIN - State Bank of India' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', cmp: 876.50, label: 'BHARTIARTL - Bharti Airtel Ltd' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', cmp: 1765.40, label: 'KOTAKBANK - Kotak Mahindra Bank Ltd' },
    { symbol: 'LT', name: 'Larsen & Toubro Ltd', cmp: 2876.25, label: 'LT - Larsen & Toubro Ltd' },
    { symbol: 'AXISBANK', name: 'Axis Bank Ltd', cmp: 876.35, label: 'AXISBANK - Axis Bank Ltd' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', cmp: 6543.20, label: 'BAJFINANCE - Bajaj Finance Ltd' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', cmp: 3210.75, label: 'ASIANPAINT - Asian Paints Ltd' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', cmp: 9876.50, label: 'MARUTI - Maruti Suzuki India Ltd' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', cmp: 654.30, label: 'TATAMOTORS - Tata Motors Ltd' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', cmp: 987.65, label: 'SUNPHARMA - Sun Pharmaceutical Industries Ltd' },
    { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', cmp: 123.45, label: 'TATASTEEL - Tata Steel Ltd' },
    { symbol: 'WIPRO', name: 'Wipro Ltd', cmp: 432.10, label: 'WIPRO - Wipro Ltd' },
    { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', cmp: 1234.55, label: 'HCLTECH - HCL Technologies Ltd' },
    { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', cmp: 2345.65, label: 'ADANIENT - Adani Enterprises Ltd' },
    { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Ltd', cmp: 876.35, label: 'ADANIPORTS - Adani Ports and Special Economic Zone Ltd' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', cmp: 1543.25, label: 'BAJAJFINSV - Bajaj Finserv Ltd' },
    { symbol: 'TITAN', name: 'Titan Company Ltd', cmp: 2765.40, label: 'TITAN - Titan Company Ltd' },
    { symbol: 'NTPC', name: 'NTPC Ltd', cmp: 234.55, label: 'NTPC - NTPC Ltd' },
    { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd', cmp: 321.05, label: 'POWERGRID - Power Grid Corporation of India Ltd' },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', cmp: 8765.30, label: 'ULTRACEMCO - UltraTech Cement Ltd' },
    { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd', cmp: 765.40, label: 'JSWSTEEL - JSW Steel Ltd' },
    { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Ltd', cmp: 187.65, label: 'ONGC - Oil and Natural Gas Corporation Ltd' },
    { symbol: 'NESTLEIND', name: 'Nestle India Ltd', cmp: 21345.65, label: 'NESTLEIND - Nestle India Ltd' }
  ];

  // Direct link to the Google Sheet CSV
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

  constructor() {
    // Initialize with fallback data immediately
    this.useFallbackData();
  }

  // Parse CSV text into array of objects
  private parseCSV(csvText: string): StockData[] {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        console.error('CSV data has insufficient lines:', lines.length);
        throw new Error('Invalid CSV format: insufficient data');
      }
      
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      console.log('📊 CSV Headers found:', headers);
      
      // Find column indices - more flexible matching
      const nameIndex = headers.findIndex(h => 
        h.includes('name') || 
        h.includes('company') || 
        h.includes('stock')
      );
      
      const symbolIndex = headers.findIndex(h => 
        h.includes('symbol') || 
        h.includes('ticker') || 
        h.includes('code')
      );
      
      const cmpIndex = headers.findIndex(h => 
        h.includes('cmp') || 
        h.includes('price') || 
        h.includes('ltp') || 
        h.includes('value')
      );
      
      if (nameIndex === -1 || symbolIndex === -1 || cmpIndex === -1) {
        console.error('❌ Required columns not found in CSV');
        console.log('Available headers:', headers);
        throw new Error('CSV format invalid: Missing required columns (name, symbol, cmp)');
      }
      
      console.log(`📍 Column mapping: name=${nameIndex}, symbol=${symbolIndex}, cmp=${cmpIndex}`);
      
      const stocks: StockData[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        // Handle quoted CSV values properly
        let row: string[] = [];
        let inQuotes = false;
        let currentValue = '';
        let currentChar = '';
        
        for (let j = 0; j < lines[i].length; j++) {
          currentChar = lines[i][j];
          
          if (currentChar === '"' && (j === 0 || lines[i][j-1] !== '\\')) {
            inQuotes = !inQuotes;
          } else if (currentChar === ',' && !inQuotes) {
            row.push(currentValue);
            currentValue = '';
          } else {
            currentValue += currentChar;
          }
        }
        
        // Add the last value
        row.push(currentValue);
        
        // Clean up values
        row = row.map(val => val.trim().replace(/^"|"$/g, ''));
        
        if (row.length < Math.max(nameIndex, symbolIndex, cmpIndex) + 1) {
          continue; // Skip incomplete rows
        }
        
        const name = row[nameIndex]?.trim();
        const symbol = row[symbolIndex]?.trim().toUpperCase();
        const cmpStr = row[cmpIndex]?.trim().replace(/[^\d.-]/g, ''); // Remove non-numeric chars except decimal and negative
        
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
    } catch (error) {
      console.error('CSV parsing error:', error);
      throw error;
    }
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
    } catch (error) {
      console.error('Failed to load stocks from CSV, using fallback data:', error);
      this.useFallbackData();
    } finally {
      this.isLoading = false;
    }
  }

  private async fetchAndParseCSV(): Promise<void> {
    try {
      console.log('🌐 Fetching stock data from Google Sheet...');
      
      // Add a cache-busting parameter to avoid browser caching
      const cacheBuster = `&_=${Date.now()}`;
      const url = `${this.CSV_URL}${cacheBuster}`;
      
      console.log('📍 CSV URL with cache buster:', url);
      
      // Use a proxy service to bypass CORS
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      console.log('🔄 Using proxy URL:', proxyUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
      try {
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/csv,text/plain,*/*',
            'Cache-Control': 'no-cache'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
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
        this.fallbackMode = false;
        
        console.log(`🚀 Stock data loaded successfully: ${this.allStocks.length} stocks`);
        console.log('📊 Sample stocks:', this.allStocks.slice(0, 3));
        
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      console.error('💥 Failed to load stock data:', error);
      throw error;
    }
  }

  // Use fallback data when Google Sheets is unavailable
  private useFallbackData(): void {
    console.log('🔄 Using fallback stock data');
    this.allStocks = [...this.FALLBACK_STOCKS];
    this.fuse = new Fuse(this.allStocks, this.fuseOptions);
    this.isLoaded = true;
    this.fallbackMode = true;
    console.log(`📊 Loaded ${this.allStocks.length} fallback stocks`);
  }

  // Search stocks using Fuse.js fuzzy search
  searchStocks(query: string, limit: number = 10): StockData[] {
    // If not loaded yet, try to use fallback data
    if (!this.isLoaded && !this.fuse) {
      this.useFallbackData();
    }
    
    if (!this.fuse || !query.trim()) {
      return [];
    }
    
    const results = this.fuse.search(query.trim(), { limit });
    return results.map(result => result.item);
  }

  // Get stock by exact symbol match
  getStockBySymbol(symbol: string): StockData | null {
    // If not loaded yet, try to use fallback data
    if (!this.isLoaded) {
      this.useFallbackData();
    }
    
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

  // Check if using fallback data
  isUsingFallback(): boolean {
    return this.fallbackMode;
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
    this.fallbackMode = false;
    
    try {
      await this.loadStocks();
    } catch (error) {
      console.error('Failed to refresh data:', error);
      this.useFallbackData();
    }
  }
}

// Export singleton instance
export const stockCsvService = new StockCsvService();
export default stockCsvService;