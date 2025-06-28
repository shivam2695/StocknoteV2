import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
  title: string;
  description: string;
  path: string;
  highlights: string[];
  cta: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to MyStockNote",
    description: "Let's take a quick tour of your new trading companion",
    path: "/",
    highlights: [
      "Complete portfolio management",
      "Trade journaling",
      "Performance analytics",
    ],
    cta: "Start Tour",
  },
  {
    title: "Portfolio Dashboard",
    description: "Get a comprehensive view of your investments at a glance",
    path: "/dashboard",
    highlights: [
      "Real-time portfolio value",
      "Performance metrics",
      "Recent trades",
    ],
    cta: "View Dashboard",
  },
  {
    title: "Trade Journal",
    description: "Log and track all your trades with detailed analysis",
    path: "/journal",
    highlights: ["Entry/exit tracking", "P&L calculations", "Trade filtering"],
    cta: "Open Journal",
  },
  {
    title: "Analytics & Insights",
    description:
      "Deep dive into your trading performance with advanced analytics",
    path: "/analytics",
    highlights: ["Performance charts", "Risk analysis", "Sector allocation"],
    cta: "View Analytics",
  },
  {
    title: "Learning Resources",
    description: "Enhance your trading knowledge with curated content",
    path: "/learn",
    highlights: ["Market insights", "Trading books", "Educational blogs"],
    cta: "Start Learning",
  },
];

interface QuickTourProps {
  onClose?: () => void;
  autoStart?: boolean;
}

const QuickTour = ({ onClose, autoStart = false }: QuickTourProps) => {
  const [isOpen, setIsOpen] = useState(autoStart);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    const step = tourSteps[currentStep];
    navigate(step.path);

    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = tourSteps[currentStep - 1];
      navigate(prevStep.path);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    navigate(tourSteps[stepIndex].path);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 shadow-lg"
      >
        Quick Tour
      </Button>
    );
  }

  const step = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-2xl border-0">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Step {currentStep + 1} of {tourSteps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
              }}
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 mb-4">{step.description}</p>

            <div className="space-y-2">
              {step.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center gap-2 mb-6">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentStep ? "bg-blue-600" : "bg-gray-300",
                )}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-gray-600"
              >
                Skip Tour
              </Button>
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {step.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickTour;
