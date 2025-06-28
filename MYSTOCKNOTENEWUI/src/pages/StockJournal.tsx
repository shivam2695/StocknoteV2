import { useState } from "react";
import DynamicSidebar from "@/components/DynamicSidebar";
import PageHeader from "@/components/PageHeader";
import { StockTable } from "@/components/StockTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  TrendingUp,
  Activity,
  CheckCircle,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { mockStocks, calculateStats } from "@/lib/mockData";
import { Stock } from "@/types/stock";
import { useNavigate } from "react-router-dom";

const StockJournal = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"none" | "status" | "return">("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const stats = calculateStats(stocks);

  // Get unique months and years from the data
  const getMonthsAndYears = () => {
    const months = new Set<string>();
    const years = new Set<string>();
    stocks.forEach((stock) => {
      const date = new Date(stock.entryDate);
      months.add(
        date.toLocaleString("default", { month: "long", year: "numeric" }),
      );
      years.add(date.getFullYear().toString());
    });
    return {
      months: Array.from(months).sort(),
      years: Array.from(years).sort().reverse(),
    };
  };

  const { months, years } = getMonthsAndYears();

  // Filter and sort stocks
  const filteredStocks = stocks
    .filter((stock) => {
      // Status filter
      if (filter === "active" && stock.status !== "Active") return false;
      if (filter === "closed" && stock.status !== "Closed") return false;

      // Month filter
      if (monthFilter !== "all") {
        const stockMonth = new Date(stock.entryDate).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        if (stockMonth !== monthFilter) return false;
      }

      // Year filter
      if (yearFilter !== "all") {
        const stockYear = new Date(stock.entryDate).getFullYear().toString();
        if (stockYear !== yearFilter) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          stock.symbol.toLowerCase().includes(query) ||
          stock.companyName.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "status") {
        const statusOrder = { Active: 1, Closed: 2 };
        const result = statusOrder[a.status] - statusOrder[b.status];
        return sortOrder === "asc" ? result : -result;
      }
      if (sortBy === "return") {
        const result = a.return - b.return;
        return sortOrder === "asc" ? result : -result;
      }
      return 0;
    });

  const handleEdit = (stock: Stock) => {
    console.log("Edit stock:", stock);
    // TODO: Implement edit functionality
  };

  const handleDelete = (stockId: string) => {
    setStocks((prev) => prev.filter((stock) => stock.id !== stockId));
  };

  const handleClose = (stockId: string) => {
    setStocks((prev) =>
      prev.map((stock) =>
        stock.id === stockId
          ? {
              ...stock,
              status: "Closed" as const,
              exitPrice: stock.entryPrice * 1.05, // Mock 5% gain
              exitDate: new Date().toISOString().split("T")[0],
              return: stock.entryPrice * stock.quantity * 0.05, // Mock 5% return
              returnPercentage: 5.0,
            }
          : stock,
      ),
    );
  };

  const handleSort = (column: "status" | "return") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleAddNew = () => {
    console.log("Add new stock entry");
    // TODO: Implement add new functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
      <DynamicSidebar />
      <PageHeader
        title="Stock Journal"
        subtitle="One place for all your trading moves"
      />

      <main className="container mx-auto px-6 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEntries}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Trades</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeEntries}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Return</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats.totalReturn.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                size="sm"
              >
                All ({stocks.length})
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                onClick={() => setFilter("active")}
                size="sm"
              >
                Active ({stats.activeEntries})
              </Button>
              <Button
                variant={filter === "closed" ? "default" : "outline"}
                onClick={() => setFilter("closed")}
                size="sm"
              >
                Closed ({stats.closedEntries})
              </Button>
            </div>

            <div className="flex gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-lg border">
          <StockTable
            stocks={filteredStocks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={handleClose}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>
      </main>
    </div>
  );
};

export default StockJournal;
