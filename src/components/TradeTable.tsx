import React, { useState } from 'react';
import { Trade } from '../types/Trade';
import { TrendingUp, TrendingDown, Circle, CheckCircle2, Edit, Trash2, Target, Filter, SortAsc, IndianRupee, Clock, RefreshCw } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import MarkAsClosedModal from './MarkAsClosedModal';
import { stockCsvService } from '../services/stockCsvService';

interface TradeTableProps {
  trades: Trade[];
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string) => void;
  onUpdateTrade?: (tradeId: string, tradeData: Omit<Trade, 'id'>) => Promise<void>;
  showFilters?: boolean;
  onRefreshCMP?: () => void;
}

export default function TradeTable({ 
  trades, 
  onEditTrade, 
  onDeleteTrade, 
  onUpdateTrade,
  showFilters = false,
  onRefreshCMP
}: TradeTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; trade?: Trade }>({ isOpen: false });
  const [markAsClosed, setMarkAsClosed] = useState<{ isOpen: boolean; trade?: Trade }>({ isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'symbol' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
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
  const calculateAging = (entryDate: string, exitDate?: string) => {
    const startDate = new Date(entryDate);
    const endDate = exitDate ? new Date(exitDate) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateReturn = (trade: Trade) => {
    if (trade.status === 'ACTIVE' || !trade.exitPrice) return 0;
    return (trade.exitPrice - trade.entryPrice) * trade.quantity;
  };

  const getReturnColor = (returnValue: number) => {
    if (returnValue > 0) return 'text-green-600';
    if (returnValue < 0) return 'text-red-600';
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

  // Filter and sort trades
  const getFilteredAndSortedTrades = () => {
    let filtered = trades;

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(trade => trade.status === 'ACTIVE');
    } else if (statusFilter === 'closed') {
      filtered = filtered.filter(trade => trade.status === 'CLOSED');
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'date':
        default:
          comparison = new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  const displayTrades = showFilters ? getFilteredAndSortedTrades() : trades;

  const handleDeleteClick = (trade: Trade) => {
    setDeleteConfirm({ isOpen: true, trade });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.trade) return;
    
    setIsDeleting(true);
    try {
      await onDeleteTrade(deleteConfirm.trade.id);
      setDeleteConfirm({ isOpen: false });
    } catch (error) {
      console.error('Delete trade error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkAsClosedClick = (trade: Trade) => {
    setMarkAsClosed({ isOpen: true, trade });
  };

  const handleMarkAsClosedSave = async (exitPrice: number, exitDate: string) => {
    if (!markAsClosed.trade || !onUpdateTrade) return;

    const updatedTrade: Omit<Trade, 'id'> = {
      ...markAsClosed.trade,
      status: 'CLOSED',
      exitPrice,
      exitDate
    };

    await onUpdateTrade(markAsClosed.trade.id, updatedTrade);
    setMarkAsClosed({ isOpen: false });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Filters and Sorting */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Trading Journal</h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* CMP Refresh Button */}
                <button
                  onClick={handleRefreshCMP}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50 text-sm"
                  title="Refresh CMP from Google Sheet"
                >
                  <RefreshCw className={`w-4 h-4 text-green-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="text-green-700 font-medium">Refresh CMP</span>
                </button>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'closed')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <SortAsc className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'symbol' | 'status')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="symbol">Sort by Symbol</option>
                    <option value="status">Sort by Status</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Symbol</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">CMP</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Quantity</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Entry Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Exit Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Entry Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Aging</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Return</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayTrades.map((trade) => {
                const returnValue = calculateReturn(trade);
                const cmp = getCMP(trade.symbol);
                const aging = calculateAging(trade.entryDate, trade.exitDate);
                
                return (
                  <tr key={trade.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {trade.status === 'ACTIVE' ? (
                          <div className="flex items-center space-x-2">
                            <Circle className="w-4 h-4 text-blue-500 fill-current" />
                            <span className="text-sm font-medium text-blue-600">🔄 Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">✅ Closed</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{getStockLogo(trade.symbol)}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{trade.symbol}</span>
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
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        {trade.type === 'BUY' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          trade.type === 'BUY' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{trade.quantity}</td>
                    <td className="py-4 px-6 text-gray-900">{formatCurrency(trade.entryPrice)}</td>
                    <td className="py-4 px-6 text-gray-900">
                      {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{formatDate(trade.entryDate)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{aging} days</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${getReturnColor(returnValue)}`}>
                        {trade.status === 'CLOSED' ? formatCurrency(returnValue) : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {trade.status === 'ACTIVE' && onUpdateTrade && (
                          <button
                            onClick={() => handleMarkAsClosedClick(trade)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Mark as Closed"
                          >
                            <Target className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onEditTrade(trade)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit Trade"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(trade)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Trade"
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
        title="Delete Trade"
        message={`Are you sure you want to delete the ${deleteConfirm.trade?.symbol} trade? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Mark as Closed Modal */}
      {markAsClosed.trade && (
        <MarkAsClosedModal
          isOpen={markAsClosed.isOpen}
          onClose={() => setMarkAsClosed({ isOpen: false })}
          onSave={handleMarkAsClosedSave}
          stockSymbol={markAsClosed.trade.symbol}
          entryPrice={markAsClosed.trade.entryPrice}
          entryDate={markAsClosed.trade.entryDate}
          quantity={markAsClosed.trade.quantity}
        />
      )}
    </>
  );
}