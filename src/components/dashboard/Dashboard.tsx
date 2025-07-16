import React, { useState, useEffect } from 'react';
import { Header } from '../layout/Header';
import { Sidebar } from '../layout/Sidebar';
import { InboxTab } from './inbox/InboxTab';
import { BroadcastTab } from './broadcast/BroadcastTab';
import { AnalyticsTab } from './analytics/AnalyticsTab';
import { IntegrationTab } from './integration/IntegrationTab';
import { SettingsTab } from './settings/SettingsTab';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const { user } = useAuthStore();
  const { loadUsers } = useAppStore();

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'inbox': return 'Inbox';
      case 'broadcast': return 'Broadcast';
      case 'analytics': return 'Analytics';
      case 'integration': return 'Integration';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inbox':
        return <InboxTab />;
      case 'broadcast':
        return <BroadcastTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'integration':
        return <IntegrationTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <InboxTab />;
    }
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  };

  // Check permissions for current tab
  const tabPermissions = {
    inbox: 'chat',
    broadcast: 'broadcast',
    analytics: 'view_analytics',
    integration: 'all',
    settings: 'manage_users',
  };

  const currentTabPermission = tabPermissions[activeTab as keyof typeof tabPermissions];
  
  if (currentTabPermission && !hasPermission(currentTabPermission)) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500">
            You don't have permission to access this section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[var(--color-background)] flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getTabTitle()} />
        
        <main className="flex-1 overflow-hidden">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};