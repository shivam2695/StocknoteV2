import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  PieChart,
  BookOpen,
  Users,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Target,
  LineChart,
  Activity,
  Smartphone,
  Play,
  Star,
  Briefcase,
  Globe,
  TrendingDown,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
            <svg
              className="w-full h-full opacity-5"
              viewBox="0 0 800 800"
              fill="none"
            >
              <path
                d="M100 400 C 200 200, 600 200, 700 400 C 600 600, 200 600, 100 400 Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="400"
                cy="300"
                r="80"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
              <circle
                cx="300"
                cy="500"
                r="60"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
              <circle
                cx="500"
                cy="500"
                r="60"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px] py-20">
            <div className="text-white">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your Personal Trading Journal.{" "}
                <span className="text-blue-200">Reinvented.</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-lg">
                Log your trades, track performance, and master the markets — all
                in one clean dashboard.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-4 text-lg"
                >
                  Get Started →
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/analytics")}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold px-8 py-4 text-lg backdrop-blur-sm"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                {/* Main Dashboard Card */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300 border border-blue-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Portfolio Dashboard
                    </h3>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Live
                    </Badge>
                  </div>

                  {/* Portfolio Value */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                      ₹2,07,45,892.34
                    </div>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="font-medium">+12.8% (₹2,84,402)</span>
                    </div>
                  </div>

                  {/* Charts Area */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-600">
                          P&L This Month
                        </span>
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-xl font-bold text-blue-600">
                        +₹84,432
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-600">Win Rate</span>
                        <Target className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        87.3%
                      </div>
                    </div>
                  </div>

                  {/* Stock List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          T
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-slate-900">TCS</div>
                          <div className="text-xs text-slate-500">
                            Tata Consultancy Services
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">
                          ₹3,842.50
                        </div>
                        <div className="text-xs text-green-600">+2.3%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          I
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-slate-900">INFY</div>
                          <div className="text-xs text-slate-500">
                            Infosys Limited
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">
                          ₹1,542.65
                        </div>
                        <div className="text-xs text-green-600">+1.8%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 rounded-full p-3 shadow-lg animate-bounce">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 rounded-full p-3 shadow-lg animate-pulse">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute top-8 right-8 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 left-8 w-24 h-24 bg-blue-300/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center p-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                5,000+
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Active Traders
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-white via-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2 flex items-center justify-center">
                4.9
                <Star className="h-5 w-5 text-yellow-500 ml-1 fill-current" />
              </div>
              <div className="text-sm text-slate-600 font-medium">
                User Rating
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-white via-purple-50 to-purple-100 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                1 Lac+
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Stocks Recorded
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-white via-orange-50 to-orange-100 rounded-xl shadow-lg border border-orange-200 hover:shadow-xl transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">
                ₹500Cr+
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Assets Tracked
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                SEBI Compliant
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                99.9% Uptime
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Trusted by 5000+ Indian Traders
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <Zap className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Real-time NSE/BSE Data
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need to Trade Better
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for traders who want to
              track, analyze, and improve their performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trade Journal */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                📓 Trade Journal
              </h3>
              <p className="text-slate-600">
                Log entries with CMP, entry/exit, SL/Target, tags, remarks
              </p>
            </div>

            {/* Focus Stocks Tracker */}
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                🌟 Focus Stocks Tracker
              </h3>
              <p className="text-slate-600">
                Track shortlisted ideas with price ranges and mark them as
                trades taken
              </p>
            </div>

            {/* Performance Analytics */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                📈 Performance Analytics
              </h3>
              <p className="text-slate-600">
                Monthly P&L, win rate, average returns, and more
              </p>
            </div>

            {/* Team Collaboration */}
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                👥 Team Collaboration
              </h3>
              <p className="text-slate-600">
                Share ideas and sync trades with your team
              </p>
            </div>

            {/* Smart Notifications */}
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                🔔 Smart Notifications
              </h3>
              <p className="text-slate-600">
                Reminders, target hits, or review prompts
              </p>
            </div>

            {/* Custom Tags & Filters */}
            <div className="bg-gradient-to-br from-white to-pink-50 rounded-xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                🏷️ Custom Tags & Filters
              </h3>
              <p className="text-slate-600">
                Organize and filter trades however you want
              </p>
            </div>
          </div>

          {/* Private & Secure - Full Width */}
          <div className="mt-8 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-xl p-8 text-white text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">🔒 Private & Secure</h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Encrypted journal. Your data is yours. Always.
            </p>
          </div>
        </div>
      </section>

      {/* Why Traders Love MyStockNote Section */}
      <section className="py-20 bg-gradient-to-br from-white via-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why Traders Love MyStockNote
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join thousands of traders who trust MyStockNote for their trading
              journey
            </p>
          </div>

          {/* Trust Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-8 shadow-lg border border-blue-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Built by traders, for traders
              </h3>
              <p className="text-slate-600">
                Created by experienced traders who understand your needs
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-8 shadow-lg border border-blue-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Simple, powerful, and clutter-free
              </h3>
              <p className="text-slate-600">
                Clean interface that gets out of your way
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-8 shadow-lg border border-purple-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No spreadsheets. No clutter. Just insights.
              </h3>
              <p className="text-slate-600">
                Focus on trading, not on data management
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  ⏱️ Save 5+ hrs/week
                </span>
              </div>
              <p className="text-slate-600 text-sm">in tracking trades</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  💡 90% users
                </span>
              </div>
              <p className="text-slate-600 text-sm">
                say they take better trades
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  📊 Designed for
                </span>
              </div>
              <p className="text-slate-600 text-sm">
                swing & positional trading
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Books & Blogs Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-4">
              <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
                <BookOpen className="h-3 w-3 mr-1" />
                Learn & Grow
              </Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Curated Learning Resources
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Weekly blogs, book recommendations, and expert insights to enhance
              your trading knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-md border border-blue-100 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Weekly Blogs
              </h3>
              <p className="text-sm text-slate-600">Market insights</p>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-6 shadow-md border border-purple-100 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Monthly Books
              </h3>
              <p className="text-sm text-slate-600">Expert picks</p>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 shadow-md border border-green-100 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Summaries</h3>
              <p className="text-sm text-slate-600">Quick insights</p>
            </div>

            <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl p-6 shadow-md border border-orange-100 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Top Quotes</h3>
              <p className="text-sm text-slate-600">Daily wisdom</p>
            </div>
          </div>

          {/* Quote of the Day */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-blue-100 text-center">
            <blockquote className="text-lg font-semibold text-slate-900 mb-2">
              "Risk comes from not knowing what you're doing."
            </blockquote>
            <cite className="text-sm text-slate-600">— Warren Buffett</cite>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to elevate your investment game?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of traders and investors who use MyStockNote to
            track, analyze, and optimize their portfolios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
            >
              Get Started →
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
