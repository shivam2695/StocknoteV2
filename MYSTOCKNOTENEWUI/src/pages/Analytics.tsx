import { MetricCard } from "@/components/dashboard/MetricCard";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { HoldingAnalytics } from "@/components/dashboard/HoldingAnalytics";
import { AdvancedAnalytics } from "@/components/dashboard/AdvancedAnalytics";
import { TopPerformingStocks } from "@/components/dashboard/TopPerformingStocks";
import { StockList } from "@/components/dashboard/StockList";
import { TransactionsFeed } from "@/components/dashboard/TransactionsFeed";
import DynamicSidebar from "@/components/DynamicSidebar";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  portfolioMetrics,
  analyticsStocks,
  monthlyData,
  recentTransactions,
  sectorAllocation,
  performanceData,
  riskMetrics,
  stockHoldingData,
  holdingAnalyticsData,
} from "@/lib/analyticsData";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  AlertTriangle,
  Target,
  BarChart3,
  Wallet,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
      <DynamicSidebar />
      <PageHeader
        title="Analytics & Performance"
        subtitle="Your trading performance insights and analytics"
      />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Investment"
            value={`₹${portfolioMetrics.totalInvestment.toLocaleString()}`}
            icon={<Wallet className="h-5 w-5" />}
            className="transition-all duration-300"
          />
          <MetricCard
            title="Current Value"
            value={`₹${portfolioMetrics.currentValue.toLocaleString()}`}
            change={portfolioMetrics.dayChange}
            changePercent={portfolioMetrics.dayChangePercent}
            icon={<DollarSign className="h-5 w-5" />}
            valueColor={portfolioMetrics.totalReturn >= 0 ? "profit" : "loss"}
            className="transition-all duration-300"
          />
          <MetricCard
            title="Total Return"
            value={`₹${portfolioMetrics.totalReturn.toLocaleString()}`}
            changePercent={portfolioMetrics.totalReturnPercent}
            icon={
              portfolioMetrics.totalReturn >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )
            }
            valueColor={portfolioMetrics.totalReturn >= 0 ? "profit" : "loss"}
            className="transition-all duration-300"
          />
          <MetricCard
            title="Active Stocks"
            value={portfolioMetrics.activeStocks.toString()}
            icon={<BarChart3 className="h-5 w-5" />}
            className="transition-all duration-300"
          />
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Stop Loss Hits"
            value={portfolioMetrics.slHits.toString()}
            icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
            size="sm"
            className="transition-all duration-300"
          />
          <MetricCard
            title="Dividends Earned"
            value={`₹${portfolioMetrics.totalDividends.toLocaleString()}`}
            icon={<Target className="h-5 w-5" />}
            size="sm"
            valueColor="profit"
            className="transition-all duration-300"
          />
          <MetricCard
            title="Cash Balance"
            value={`₹${portfolioMetrics.cashBalance.toLocaleString()}`}
            icon={<Wallet className="h-5 w-5" />}
            size="sm"
            className="transition-all duration-300"
          />
          <MetricCard
            title="Beta Risk"
            value={riskMetrics.beta.toFixed(2)}
            icon={<Shield className="h-5 w-5" />}
            size="sm"
            className="transition-all duration-300"
          />
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            <PortfolioChart data={monthlyData} />

            {/* Performance Comparison - In the left blank space */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">
                  Performance vs Market
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {/* Column Headers */}
                <div className="flex items-center p-3 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3 min-w-[80px]">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Period
                    </div>
                  </div>

                  <div className="flex-1 mx-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <span className="w-16">Instrument</span>
                      <div className="flex-1"></div>
                      <span className="min-w-[45px] text-right">
                        Return (%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 min-w-[120px] justify-end">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Diff.
                    </div>
                  </div>
                </div>

                {performanceData.map((item, index) => {
                  const outperformance = item.portfolio - item.market;
                  const portfolioRelative =
                    (item.portfolio /
                      Math.max(...performanceData.map((d) => d.portfolio))) *
                    100;
                  const marketRelative =
                    (item.market /
                      Math.max(...performanceData.map((d) => d.market))) *
                    100;

                  return (
                    <div key={item.period}>
                      <div className="flex items-center p-3 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                        {/* Period with Icon */}
                        <div className="flex items-center gap-3 min-w-[80px]">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                            <span className="text-xs font-bold">
                              {item.period}
                            </span>
                          </div>
                          <div className="text-sm font-semibold">
                            {item.period}
                          </div>
                        </div>

                        {/* Progress Bars Section */}
                        <div className="flex-1 mx-6">
                          <div className="space-y-2">
                            {/* Portfolio Progress Bar */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-16">
                                Portfolio
                              </span>
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-600 rounded-full transition-all duration-500"
                                  style={{ width: `${portfolioRelative}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-green-600 min-w-[45px] text-right">
                                +{item.portfolio.toFixed(1)}%
                              </span>
                            </div>

                            {/* Market Progress Bar */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-16">
                                Nifty 50
                              </span>
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-muted-foreground rounded-full transition-all duration-500"
                                  style={{ width: `${marketRelative}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-muted-foreground min-w-[45px] text-right">
                                +{item.market.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Outperformance Badge */}
                        <div className="flex items-center gap-2 min-w-[120px] justify-end">
                          <div
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                              outperformance > 0
                                ? "bg-green-100 text-green-600 border border-green-200"
                                : "bg-red-100 text-red-600 border border-red-200",
                            )}
                          >
                            {outperformance > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>
                              {outperformance > 0 ? "+" : ""}
                              {outperformance.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < performanceData.length - 1 && (
                        <div className="border-b border-border/50" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Analytics Cards */}
          <div className="space-y-6">
            <HoldingAnalytics data={holdingAnalyticsData} />
            <TopPerformingStocks stocks={analyticsStocks} />
            <TransactionsFeed transactions={recentTransactions} maxItems={5} />
          </div>
        </div>

        {/* Stock List - Full Width */}
        <StockList stocks={analyticsStocks} />

        {/* Advanced Analytics - Collapsible */}
        <AdvancedAnalytics riskMetrics={riskMetrics} />
      </div>
    </div>
  );
};

export default Analytics;
