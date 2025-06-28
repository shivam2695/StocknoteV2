import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  BarChart3,
  BookOpen,
  User,
  Settings,
  PieChart,
  Activity,
  LogOut,
  Home,
  DollarSign,
} from "lucide-react";

interface AppNavigationProps {
  variant?: "header" | "sidebar" | "mobile";
  showBranding?: boolean;
  className?: string;
}

const navigationItems = [
  {
    path: "/",
    label: "Home",
    icon: Home,
    description: "Landing Page",
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
    description: "Overview & Summary",
  },
  {
    path: "/journal",
    label: "Journal",
    icon: TrendingUp,
    description: "Trade Logs & Notes",
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: PieChart,
    description: "Performance Insights",
  },
  {
    path: "/learn",
    label: "Learn",
    icon: BookOpen,
    description: "Books & Blogs",
  },
  {
    path: "/pricing",
    label: "Pricing",
    icon: DollarSign,
    description: "Plans & Pricing",
  },
  {
    path: "/profile",
    label: "Profile",
    icon: User,
    description: "Account Settings",
  },
];

const AppNavigation = ({
  variant = "header",
  showBranding = true,
  className,
}: AppNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  if (variant === "header") {
    return (
      <nav
        className={cn(
          "bg-gradient-to-r from-white via-slate-50 to-blue-50 border-b border-slate-100 sticky top-0 z-50 backdrop-blur-md",
          className,
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {showBranding && (
              <div className="flex items-center">
                <div
                  className="flex-shrink-0 flex items-center cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-2 text-xl font-bold text-slate-900">
                    MyStockNote
                  </span>
                </div>
              </div>
            )}

            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.slice(1, 6).map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "font-medium transition-colors px-3 py-2 rounded-md",
                    isActive(item.path)
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
              >
                Get Started →
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (variant === "sidebar") {
    return (
      <div
        className={cn(
          "h-full bg-white shadow-2xl border-r border-gray-200 flex flex-col",
          className,
        )}
      >
        {/* Header */}
        {showBranding && (
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">MyStockNote</h2>
                <p className="text-sm text-gray-600">Trading Dashboard</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group text-left",
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    active
                      ? "text-white"
                      : "text-gray-500 group-hover:text-blue-600",
                  )}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div
                    className={cn(
                      "text-xs transition-colors",
                      active
                        ? "text-blue-100"
                        : "text-gray-500 group-hover:text-blue-500",
                    )}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-6 right-4">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 border-green-200"
          >
            <Activity className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>
    );
  }

  // Mobile variant
  return (
    <div className={cn("bg-white border-t border-gray-200", className)}>
      <div className="grid grid-cols-5 gap-1 p-2">
        {navigationItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                active
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AppNavigation;
