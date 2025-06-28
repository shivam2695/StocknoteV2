import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Settings, 
  FileText, 
  Target,
  Home,
  PieChart,
  Bell,
  User,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Check for unread notifications
  useEffect(() => {
    const checkUnreadNotifications = () => {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return;
      
      const userEmail = JSON.parse(currentUser).email;
      const stored = localStorage.getItem(`notifications_${userEmail}`);
      
      if (stored) {
        const notifications = JSON.parse(stored);
        const unreadCount = notifications.filter((n: any) => !n.read).length;
        setUnreadNotifications(unreadCount);
      }
    };
    
    // Check on mount
    checkUnreadNotifications();
    
    // Set up interval to check periodically
    const interval = setInterval(checkUnreadNotifications, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'trades', label: 'Trading Journal', icon: FileText },
    { id: 'focus-stocks', label: 'Focus Stocks', icon: Target },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  const bottomMenuItems = [
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white border-r border-gray-200 h-screen w-64 fixed left-0 top-0 z-30 flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MyStockNote</h1>
            <p className="text-sm text-gray-500">Trading Journal</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="font-medium">{item.label}</span>
              {item.id === 'notifications' && item.badge > 0 && (
                <div className="ml-auto w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{item.badge > 9 ? '9+' : item.badge}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}