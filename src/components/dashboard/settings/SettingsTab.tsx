import React, { useState } from 'react';
import { Settings as SettingsIcon, Palette, Shield, Bell } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { UserManagement } from './UserManagement';
import { useTheme } from '../../layout/ThemeProvider';
import { themes } from '../../../lib/themes';

type SettingsSection = 'users' | 'theme' | 'security' | 'notifications';

export const SettingsTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('users');
  const { theme, setTheme } = useTheme();

  const sections = [
    { id: 'users', icon: SettingsIcon, label: 'User Management' },
    { id: 'theme', icon: Palette, label: 'Theme Settings' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      
      case 'theme':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Theme Settings</h2>
            
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Choose Theme
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {Object.values(themes).map((themeOption) => (
                  <div
                    key={themeOption.name}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      theme.name === themeOption.name
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                    }`}
                    onClick={() => setTheme(themeOption)}
                  >
                    <div className="flex space-x-2 mb-3">
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: themeOption.colors.primary }}
                      />
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: themeOption.colors.accent }}
                      />
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: themeOption.colors.gray }}
                      />
                    </div>
                    <h4 className="font-medium text-[var(--color-text)]">
                      {themeOption.name}
                    </h4>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Security Settings</h2>
            
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Two-Factor Authentication
              </h3>
              <p className="text-gray-500 mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                API Keys
              </h3>
              <p className="text-gray-500 mb-4">
                Manage API keys for external integrations
              </p>
              <Button variant="outline">Generate New Key</Button>
            </Card>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Notification Settings</h2>
            
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Email Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-[var(--color-text)]">New message alerts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-[var(--color-text)]">Broadcast reports</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-[var(--color-text)]">Weekly analytics</span>
                </label>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Push Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-[var(--color-text)]">Urgent messages</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-[var(--color-text)]">Assignment notifications</span>
                </label>
              </div>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* Settings Navigation */}
      <div className="w-64 border-r border-[var(--color-border)] p-4">
        <h2 className="font-semibold text-[var(--color-text)] mb-4">Settings</h2>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SettingsSection)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-gray)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};