import React, { useState } from 'react';
import SuperFastStockInput from './SuperFastStockInput';
import { CheckCircle, TrendingUp, DollarSign, Target, Shield } from 'lucide-react';

export default function SuperFastStockDemo() {
  const [submittedTrades, setSubmittedTrades] = useState<any[]>([]);

  const handleTradeSubmit = (tradeData: any) => {
    console.log('🚀 Trade submitted:', tradeData);
    
    // Add to submitted trades list
    const newTrade = {
      ...tradeData,
      id: Date.now(),
      timestamp: new Date().toLocaleString()
    };
    
    setSubmittedTrades(prev => [newTrade, ...prev]);
    
    // Show success message
    alert(`✅ Trade submitted successfully!\n\nStock: ${tradeData.symbol}\nCMP: ₹${tradeData.cmp}\nQuantity: ${tradeData.quantity}\nSL: ₹${tradeData.sl}\nTarget: ₹${tradeData.target}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ⚡ SuperFast Stock Input Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lightning-fast stock search with live CMP from Google Sheet CSV. 
            Ultra-fast fuzzy search powered by Fuse.js with instant autocomplete.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Live CMP</div>
            <div className="text-sm text-gray-600">Google Sheet CSV</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Fuzzy Search</div>
            <div className="text-sm text-gray-600">Powered by Fuse.js</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">P&L Preview</div>
            <div className="text-sm text-gray-600">Risk:Reward Ratio</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Ultra Fast</div>
            <div className="text-sm text-gray-600">In-memory Search</div>
          </div>
        </div>

        {/* Main Component */}
        <SuperFastStockInput onSubmit={handleTradeSubmit} />

        {/* Submitted Trades */}
        {submittedTrades.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span>Submitted Trades</span>
            </h3>
            
            <div className="space-y-4">
              {submittedTrades.map((trade) => (
                <div key={trade.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-lg text-gray-900">{trade.symbol}</div>
                    <div className="text-sm text-gray-500">{trade.timestamp}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">CMP</div>
                      <div className="font-semibold">{formatCurrency(trade.cmp)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Quantity</div>
                      <div className="font-semibold">{trade.quantity}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Stop Loss</div>
                      <div className="font-semibold text-red-600">{formatCurrency(trade.sl)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Target</div>
                      <div className="font-semibold text-green-600">{formatCurrency(trade.target)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Risk:Reward</div>
                      <div className="font-semibold text-blue-600">
                        {(Math.abs((trade.target - trade.cmp) / (trade.sl - trade.cmp))).toFixed(2)}:1
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">🚀 How to Use</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div>1. 🔍 <strong>Search:</strong> Type any stock name or symbol (e.g., "reliance", "tcs", "hdfc")</div>
            <div>2. ⚡ <strong>Select:</strong> Choose from ultra-fast fuzzy search results</div>
            <div>3. 💰 <strong>View CMP:</strong> See live current market price from Google Sheet</div>
            <div>4. 📊 <strong>Enter Details:</strong> Add quantity, stop loss, and target</div>
            <div>5. 📈 <strong>Preview P&L:</strong> See potential profit/loss and risk:reward ratio</div>
            <div>6. ✅ <strong>Submit:</strong> Submit your trade with all details</div>
          </div>
        </div>
      </div>
    </div>
  );
}