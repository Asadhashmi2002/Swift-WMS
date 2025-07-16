import React, { useState } from 'react';
import { MessageSquare, Zap, AlertCircle, CheckCircle, Settings, Play } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { WhatsAppWizard } from './WhatsAppWizard';

export const IntegrationTab: React.FC = () => {
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  const handleConnect = async () => {
    setShowWizard(true);
  };

  const handleDisconnect = () => {
    setWhatsappConnected(false);
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
    setWhatsappConnected(true);
  };

  if (showWizard) {
    return <WhatsAppWizard onComplete={handleWizardComplete} onCancel={() => setShowWizard(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">Integrations</h2>
      </div>
      {/* WhatsApp Business API */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">
                WhatsApp Business API
              </h3>
              <p className="text-gray-500 mt-1">
                Connect your WhatsApp Business account to send and receive messages
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            {!whatsappConnected ? (
              <Button onClick={handleConnect} loading={connecting} className="w-full sm:w-auto">
                Connect
              </Button>
            ) : (
              <Button onClick={handleDisconnect} variant="outline" className="w-full sm:w-auto">
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </Card>
      {/* Other Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">Webhooks</h3>
              <p className="text-sm text-gray-500">Real-time event notifications</p>
            </div>
          </div>
          <Badge variant="warning" size="sm">Coming Soon</Badge>
        </Card>
        <Card>
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">SMS Gateway</h3>
              <p className="text-sm text-gray-500">Fallback SMS messaging</p>
            </div>
          </div>
          <Badge variant="warning" size="sm">Coming Soon</Badge>
        </Card>
        <Card>
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">CRM Integration</h3>
              <p className="text-sm text-gray-500">Sync with your CRM system</p>
            </div>
          </div>
          <Badge variant="warning" size="sm">Coming Soon</Badge>
        </Card>
      </div>

      {/* API Documentation */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">API Documentation</h3>
          <Button variant="outline" size="sm">
            View Docs
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
            <h4 className="font-medium text-[var(--color-text)] mb-2">Base URL</h4>
            <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              https://api.swiftams.com/v1
            </code>
          </div>
          
          <div className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
            <h4 className="font-medium text-[var(--color-text)] mb-2">Authentication</h4>
            <p className="text-sm text-gray-500">
              Include your API key in the Authorization header: <code>Bearer YOUR_API_KEY</code>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};