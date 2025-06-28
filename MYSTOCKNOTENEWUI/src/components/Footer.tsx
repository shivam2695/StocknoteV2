import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Globe,
  Users,
  BookOpen,
  Mail,
  Shield,
  FileText,
} from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">MyStockNote</span>
            </div>
            <p className="text-slate-400 max-w-md mb-6">
              The complete investment management platform for tracking,
              analyzing, and optimizing your portfolio performance.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-colors">
                <Globe className="h-5 w-5" />
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-colors">
                <Mail className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/journal")}
                  className="hover:text-white transition-colors"
                >
                  Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/analytics")}
                  className="hover:text-white transition-colors"
                >
                  Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/learn")}
                  className="hover:text-white transition-colors"
                >
                  Learn
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/pricing")}
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button className="hover:text-white transition-colors">
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/profile")}
                  className="hover:text-white transition-colors"
                >
                  Profile
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              &copy; 2025 MyStockNote. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="h-4 w-4 text-green-500" />
                <span>SEBI Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>BSE/NSE Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
