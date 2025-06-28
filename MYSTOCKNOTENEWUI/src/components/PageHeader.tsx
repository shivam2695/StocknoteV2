import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, Settings, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showActions?: boolean;
  actions?: React.ReactNode;
  className?: string;
  variant?: "default" | "compact";
}

const PageHeader = ({
  title,
  subtitle,
  showBackButton = false,
  showActions = true,
  actions,
  className,
  variant = "default",
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-border/50",
        className,
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}

            <div>
              <h1
                className={cn(
                  "font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
                  variant === "compact" ? "text-xl" : "text-2xl",
                )}
              >
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {showActions && !actions && (
              <>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-600 border-green-200"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-900 hover:bg-blue-50 border-border"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-900 hover:bg-blue-50 border-border"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </>
            )}
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
