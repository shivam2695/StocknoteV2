import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, RefreshCw, AlertCircle, CheckCircle, DollarSign, Target, Shield } from 'lucide-react';
import { stockCsvService, StockData } from '../services/stockCsvService';

interface SuperFastStockInputProps {
  onSubmit?: (tradeData: {
    symbol: string;
    cmp: number;
    quantity: number;
    sl: number;
    target: number;
  }) => void;
  className?: string;
}

export default function SuperFastStockInput({ onSubmit, className = '' }: SuperFastStockInputProps) {
  // Stock search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Form states
  const [quantity, setQuantity] = useState<string>('');
  const [sl, setSl] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [loadingStatus, setLoadingStatus] = useState('');
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load stock data on component mount
  useEffect(() => {
    loadStockData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadStockData = async () => {
    if (stockCsvService.isDataLoaded()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setLoadingStatus('Fetching stock data from Google Sheet...');

    try {
      await stockCsvService.loadStocks();
      setLoadingStatus(`✅ Loaded ${stockCsvService.getStockCount()} stocks successfully`);
      
      // Clear status after 2 seconds
      setTimeout(() => setLoadingStatus(''), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load stock data';
      setError(errorMessage);
      setLoadingStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshPrices = async () => {
    setIsRefreshing(true);
    setError('');
    setLoadingStatus('Refreshing stock prices...');

    try {
      await stockCsvService.refreshData();
      setLoadingStatus(`✅ Refreshed ${stockCsvService.getStockCount()} stocks`);
      
      // Update selected stock if it exists
      if (selectedStock) {
        const updatedStock = stockCsvService.getStockBySymbol(selectedStock.symbol);
        if (updatedStock) {
          setSelectedStock(updatedStock);
        }
      }
      
      // Clear status after 2 seconds
      setTimeout(() => setLoadingStatus(''), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
      setError(errorMessage);
      setLoadingStatus('');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setError('');

    if (!stockCsvService.isDataLoaded()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Ultra-fast fuzzy search using Fuse.js
    const results = stockCsvService.searchStocks(query, 8);
    setSearchResults(results);
    setShowDropdown(results.length > 0);
  };

  const handleStockSelect = (stock: StockData) => {
    setSelectedStock(stock);
    setSearchQuery(stock.symbol);
    setSearchResults([]);
    setShowDropdown(false);
    setError('');
    
    // Focus on quantity input
    setTimeout(() => {
      const quantityInput = document.getElementById('quantity-input');
      quantityInput?.focus();
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStock) {
      setError('Please select a stock first');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (!sl || parseFloat(sl) <= 0) {
      setError('Please enter a valid stop loss');
      return;
    }

    if (!target || parseFloat(target) <= 0) {
      setError('Please enter a valid target');
      return;
    }

    const tradeData = {
      symbol: selectedStock.symbol,
      cmp: selectedStock.cmp,
      quantity: parseFloat(quantity),
      sl: parseFloat(sl),
      target: parseFloat(target)
    };

    console.log('🚀 Submitting trade:', tradeData);
    
    if (onSubmit) {
      onSubmit(tradeData);
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setSearchQuery('');
    setSelectedStock(null);
    setQuantity('');
    setSl('');
    setTarget('');
    setSearchResults([]);
    setShowDropdown(false);
    setError('');
    
    // Focus back on search input
    searchInputRef.current?.focus();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculatePotentialPnL = () => {
    if (!selectedStock || !quantity || !target || !sl) return null;

    const qty = parseFloat(quantity);
    const targetPrice = parseFloat(target);
    const slPrice = parseFloat(sl);
    const cmp = selectedStock.cmp;

    const targetPnL = (targetPrice - cmp) * qty;
    const slPnL = (slPrice - cmp) * qty;
    const riskReward = Math.abs(targetPnL / slPnL);

    return {
      targetPnL,
      slPnL,
      riskReward
    };
  };

  const pnlData = calculatePotentialPnL();

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">⚡ SuperFast Stock Input</h2>
            <p className="text-sm text-gray-600">Lightning-fast stock search with live CMP</p>
          </div>
        </div>
        
        <button
          onClick={handleRefreshPrices}
          disabled={isRefreshing || isLoading}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh stock prices"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh Prices</span>
        </button>
      </div>

      {/* Loading Status */}
      {loadingStatus && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            {isLoading || isRefreshing ? (
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 text-blue-600" />
            )}
            <span className="text-sm text-blue-800">{loadingStatus}</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stock Search */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Search Stock *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Type stock name or symbol (e.g., RELIANCE, TCS, HDFC)"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {searchResults.map((stock, index) => (
                <button
                  key={`${stock.symbol}-${index}`}
                  type="button"
                  onClick={() => handleStockSelect(stock)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{stock.label}</div>
                      <div className="text-sm text-gray-600">NSE • Indian Stock</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold text-green-600">{formatCurrency(stock.cmp)}</div>
                      <div className="text-xs text-gray-500">Live CMP</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Stock CMP Display */}
        {selectedStock && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-bold text-gray-900">{selectedStock.symbol}</div>
                  <div className="text-sm text-gray-600">{selectedStock.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  CMP: {formatCurrency(selectedStock.cmp)}
                </div>
                <div className="text-xs text-gray-500">Live CMP via Google Sheet (delayed by 2–5 mins)</div>
              </div>
            </div>
          </div>
        )}

        {/* Trade Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="quantity-input" className="block text-sm font-medium text-gray-700 mb-2">
              📊 Quantity *
            </label>
            <input
              id="quantity-input"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="100"
              min="1"
              step="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🛡️ Stop Loss (SL) *
            </label>
            <input
              type="number"
              value={sl}
              onChange={(e) => setSl(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="₹ 2400"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 Target *
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="₹ 2800"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* P&L Preview */}
        {pnlData && selectedStock && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">📈 P&L Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-green-600 font-bold text-lg">
                  {formatCurrency(pnlData.targetPnL)}
                </div>
                <div className="text-gray-600">Target P&L</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-bold text-lg">
                  {formatCurrency(pnlData.slPnL)}
                </div>
                <div className="text-gray-600">Stop Loss P&L</div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-bold text-lg">
                  {pnlData.riskReward.toFixed(2)}:1
                </div>
                <div className="text-gray-600">Risk:Reward</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={!selectedStock || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Target className="w-5 h-5" />
            <span>✅ Submit Trade</span>
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ♻️ Reset
          </button>
        </div>
      </form>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>⚡ Ultra-fast fuzzy search</span>
            <span>📊 {stockCsvService.getStockCount()} stocks loaded</span>
            <span>🔄 Live CMP from Google Sheet</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Powered by Fuse.js</span>
          </div>
        </div>
      </div>
    </div>
  );
}