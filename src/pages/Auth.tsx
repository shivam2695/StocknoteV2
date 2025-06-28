import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, TrendingUp, BarChart3, Shield, Zap, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== "/signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { login, signUp, isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to app");
      navigate("/app/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Update login/signup mode based on URL path
  useEffect(() => {
    setIsLogin(location.pathname !== "/signup");
  }, [location.pathname]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    
    if (!isLogin && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (!isLogin && !formData.fullName?.trim()) {
      setError("Full name is required");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        console.log("Attempting login with:", formData.email);
        await login(formData.email, formData.password);
        // The useEffect will handle the redirect when isAuthenticated changes
      } else {
        console.log("Attempting signup with:", formData.email);
        await signUp(formData.fullName || "", formData.email, formData.password);
        toast({
          title: "Account created successfully",
          description: "You can now log in with your credentials",
        });
        // After signup, switch to login view
        setIsLogin(true);
        navigate("/login", { replace: true });
        setFormData(prev => ({
          ...prev,
          password: "",
          confirmPassword: ""
        }));
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || (isLogin ? "Login failed" : "Signup failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Panel - Blue Gradient */}
      <div className="hidden lg:flex lg:w-1/2 stocknote-gradient relative overflow-hidden h-screen">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Decorative Blurs */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

          {/* Bouncing Financial Symbols */}
          <div className="absolute top-1/4 right-1/4 text-white/20 text-4xl font-bold animate-bounce">
            ₹
          </div>

          <div className="absolute bottom-1/3 right-1/3 text-white/25 text-3xl font-bold animate-bounce delay-300">
            $
          </div>

          <div className="absolute top-1/2 right-1/5 text-white/30 animate-bounce delay-700">
            <BarChart3 className="w-8 h-8" />
          </div>

          <div className="absolute top-1/3 right-1/2 text-white/20 animate-bounce delay-500">
            <TrendingUp className="w-6 h-6" />
          </div>

          <div className="absolute bottom-1/4 right-1/4 text-white/25 text-2xl font-bold animate-bounce delay-1000">
            %
          </div>

          <div className="absolute top-20 right-1/3 text-white/15 animate-bounce delay-200">
            <Shield className="w-5 h-5" />
          </div>

          <div className="absolute bottom-20 right-1/5 text-white/20 text-xl font-bold animate-bounce delay-800">
            +
          </div>

          {/* Abstract Grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-white/10"
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">MyStockNote</span>
          </div>

          {/* Main Content */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Your edge isn't luck. It's data. It's MyStockNote.
            </h1>

            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Just write down what happened. No pressure — just a space to see
              what's working and what's not. You'll thank yourself later.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-white/90">
                  Advanced Analytics Dashboard
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-white/90">
                  Performance & P&L Insights
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-white/90">Journal Sync with Teams</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - White Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 h-screen overflow-y-auto">
        <div className="w-full max-w-md bg-white shadow-xl border-0 rounded-lg p-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MyStockNote</span>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-8 p-1 bg-gray-100 rounded-xl">
            <Button
              onClick={() => {
                setIsLogin(true);
                navigate("/login", { replace: true });
              }}
              className={`flex-1 rounded-lg transition-all duration-300 text-sm font-medium ${
                isLogin
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              variant="ghost"
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                setIsLogin(false);
                navigate("/signup", { replace: true });
              }}
              className={`flex-1 rounded-lg transition-all duration-300 text-sm font-medium ${
                !isLogin
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              variant="ghost"
            >
              Sign Up
            </Button>
          </div>

          {/* Form */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isLogin
                ? "Sign in to access your trading dashboard"
                : "Start your personal trading journey today"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="min-h-0">
              {/* Full Name - Sign Up Only */}
              {!isLogin && (
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName || ""}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="h-11 border-gray-200"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-11 border-gray-200"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-gray-500" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="h-11 border-gray-200 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 bg-transparent hover:bg-gray-100 text-gray-500"
                    variant="ghost"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password - Sign Up Only */}
              {!isLogin && (
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-gray-500" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword || ""}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="h-11 border-gray-200 pr-10"
                      required={!isLogin}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 bg-transparent hover:bg-gray-100 text-gray-500"
                      variant="ghost"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Forgot Password - Login Only */}
              {isLogin && (
                <div className="text-right mb-4">
                  <Button
                    type="button"
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium text-sm"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-medium hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isLogin ? "Signing In..." : "Creating Account...") 
                  : (isLogin ? "Sign In" : "Create Account")}
              </Button>

              {/* Back to Home */}
              <div className="text-center mt-4">
                <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  ← Back to Home
                </Link>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-gray-200 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-gray-200 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              {/* Terms */}
              {!isLogin && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  By creating an account, you agree to our{" "}
                  <button className="text-blue-600 hover:underline">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button className="text-blue-600 hover:underline">
                    Privacy Policy
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;