import React from 'react';
import { Menu, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';
import { socketService } from '../../lib/socket';

interface HeaderProps {
  title: string;
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onSettingsClick }) => {
  const { setSidebarOpen } = useAppStore();
  const { logout } = useAuthStore();
  const { isConnected } = useChatStore();

  return (
    <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-gray)] transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConnected ? (socketService.isMockMode ? 'Demo Mode' : 'Connected') : 'Disconnected'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onSettingsClick && (
            <Button variant="ghost" size="sm" onClick={onSettingsClick}>
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};