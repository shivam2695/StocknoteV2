import React, { useState } from 'react';
import { FocusStock } from '../types/FocusStock';
import { Target, TrendingUp, CheckCircle, Circle, Edit, Trash2, Calendar, IndianRupee, Clock, RefreshCw } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import FocusStockTags, { FocusStockTag } from './FocusStockTags';
import { stockCsvService } from '../services/stockCsvService';

interface FocusStocksTableProps {
  stocks: FocusStock[];
  onEditStock: (stock: FocusStock) => void;
  onDeleteStock: (stockId: string) => void;
  onMarkTradeTaken: (stockId: string, tradeTaken: boolean, tradeDate?: string) => void;
  onUpdateStockTag?: (stockId: string, tag: FocusStockTag) => void;
  onRefreshCMP?: () => void;
}

export default function FocusStocksTable({ 
  stocks, 
  onEditStock, 
  onDeleteStock, 
  onMarkTradeTaken,
  onUpdateStockTag,
  onRefreshCMP
}: FocusStocksTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; stock?: FocusStock }>({ isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate aging in days
  const calculateAging = (dateAdded: string, tradeDate?: string) => {
    const startDate = new Date(dateAdded);
    const endDate = tradeDate ? new Date(tradeDate) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculatePotentialReturn = (currentPrice: number, targetPrice: number) => {
    return ((targetPrice - currentPrice) / currentPrice) * 100;
  };

  const getReturnColor = (returnPercentage: number) => {
    if (returnPercentage > 0) return 'text-green-600';
    if (returnPercentage < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getStockLogo = (symbol: string) => {
    return symbol.charAt(0).toUpperCase();
  };

  // Get CMP for a stock symbol
  const getCMP = (symbol: string) => {
    if (!stockCsvService.isDataLoaded()) return null;
    const stock = stockCsvService.getStockBySymbol(symbol);
    return stock ? stock.cmp : null;
  };

  // Handle CMP refresh
  const handleRefreshCMP = async () => {
    setIsRefreshing(true);
    try {
      await stockCsvService.refreshData();
      if (onRefreshCMP) {
        onRefreshCMP();
      }
    } catch (error) {
      console.error('Failed to refresh CMP:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTradeTakenToggle = (stock: FocusStock) => {
    if (!stock.tradeTaken) {
      const tradeDate = new Date().toISOString().split('T')[0];
      onMarkTradeTaken(stock.id, true, tradeDate);
    } else {
      onMarkTradeTaken(stock.id, false);
    }
  };

  const handleDeleteClick = (stock: FocusStock) => {
    setDeleteConfirm({ isOpen: true, stock });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.stock) return;
    
    setIsDeleting(true);
    try {
      await onDeleteStock(deleteConfirm.stock.id);
      setDeleteConfirm({ isOpen: false });
    } catch (error) {
      console.error('Delete focus stock error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTagChange = (stockId: string, tag: FocusStockTag) => {
    if (onUpdateStockTag) {
      onUpdateStockTag(stockId, tag);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Focus Stocks List</h3>
          <button
            onClick={handleRefreshCMP}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50 text-sm"
            title="Refresh CMP from Google Sheet"
          >
            <RefreshCw className={`w-4 h-4 text-green-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-green-700 font-medium">Refresh</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Symbol</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">CMP</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Current Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Target Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Potential Return</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Reason</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Tags</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Date Added</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Aging</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stocks.map((stock) => {
                const potentialReturn = calculatePotentialReturn(stock.currentPrice, stock.targetPrice);
                const cmp = getCMP(stock.symbol);
                const aging = calculateAging(stock.dateAdded, stock.tradeDate);
                
                return (
                  <tr key={stock.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTradeTakenToggle(stock)}
                          className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded transition-colors"
                        >
                          {stock.tradeTaken ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <span className={`text-sm font-medium ${
                            stock.tradeTaken ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {stock.tradeTaken ? 'Taken' : 'Pending'}
                          </span>
                        </button>
                      </div>
                      {stock.tradeTaken && stock.tradeDate && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatDate(stock.tradeDate)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{getStockLogo(stock.symbol)}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{stock.symbol}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {cmp ? (
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="w-3 h-3 text-green-500" />
                          <span className="text-sm font-medium text-green-600">{cmp.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-900">{formatCurrency(stock.currentPrice)}</td>
                    <td className="py-4 px-6 text-gray-900">{formatCurrency(stock.targetPrice)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className={`w-4 h-4 ${getReturnColor(potentialReturn)}`} />
                        <span className={`font-semibold ${getReturnColor(potentialReturn)}`}>
                          {potentialReturn.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700 text-sm">{stock.reason}</span>
                      {stock.notes && (
                        <div className="text-xs text-gray-500 mt-1">{stock.notes}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {stock.tag ? (
                        <FocusStockTags
                          selectedTag={stock.tag}
                          onTagChange={(tag) => handleTagChange(stock.id, tag)}
                          showSelectedOnly={true}
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No tag</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{formatDate(stock.dateAdded)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{aging} days</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEditStock(stock)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit Focus Stock"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(stock)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Focus Stock"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Focus Stock"
        message={`Are you sure you want to delete ${deleteConfirm.stock?.symbol} from your focus stocks? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  );
}