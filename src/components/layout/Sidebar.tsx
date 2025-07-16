import React from 'react';
import { 
  MessageSquare, 
  Radio, 
  BarChart3, 
  Settings, 
  Users,
  Zap,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { user } = useAuthStore();

  const tabs = [
    { id: 'inbox', icon: MessageSquare, label: 'Inbox', permission: 'chat' },
    { id: 'broadcast', icon: Radio, label: 'Broadcast', permission: 'broadcast' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', permission: 'view_analytics' },
    { id: 'integration', icon: Zap, label: 'Integration', permission: 'all' },
    { id: 'settings', icon: Settings, label: 'Settings', permission: 'manage_users' },
  ];

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  };

  const filteredTabs = tabs.filter(tab => hasPermission(tab.permission));

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-transform lg:translate-x-0 lg:static lg:z-auto',
          'max-w-full', // allow full width on mobile
          'sm:w-64 w-full', // full width on mobile, fixed on sm+
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        onTouchStart={(e) => {
          // Start swipe gesture
          (window as any)._sidebarTouchStartX = e.touches[0].clientX;
        }}
        onTouchMove={(e) => {
          // Track swipe
          (window as any)._sidebarTouchMoveX = e.touches[0].clientX;
        }}
        onTouchEnd={() => {
          // If swipe left, close sidebar
          if (
            typeof (window as any)._sidebarTouchStartX === 'number' &&
            typeof (window as any)._sidebarTouchMoveX === 'number' &&
            (window as any)._sidebarTouchStartX - (window as any)._sidebarTouchMoveX > 50
          ) {
            setSidebarOpen(false);
          }
          (window as any)._sidebarTouchStartX = null;
          (window as any)._sidebarTouchMoveX = null;
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--color-text)]">
              SwiftAMS
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-[var(--color-gray)] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all',
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-lg'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-gray)]',
                  'sm:text-base text-sm' // smaller text on mobile
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border)]">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text)] truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};