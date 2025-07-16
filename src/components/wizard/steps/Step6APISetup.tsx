import React, { useState, useEffect } from 'react';
import { Copy, Check, Key, Webhook, ExternalLink } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { WizardLayout } from '../WizardLayout';
import { useWizardStore } from '../../../stores/wizardStore';
import { useSubscribeWebhook } from '../../../hooks/useMetaQuery';
import { copyToClipboard, generateToken } from '../../../lib/utils';
import toast from 'react-hot-toast';

export const Step6APISetup: React.FC = () => {
  const { data, setData, complete } = useWizardStore();
  const [webhookSubscribed, setWebhookSubscribed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const subscribeWebhook = useSubscribeWebhook();

  // Generate webhook URL and verify token
  useEffect(() => {
    if (!data.webhookUrl || !data.verifyToken) {
      const webhookUrl = 'https://api.wms.com/webhook/whatsapp';
      const verifyToken = generateToken();
      setData({ webhookUrl, verifyToken });
    }
  }, [data, setData]);

  const apiCredentials = {
    phoneNumberId: data.phoneNumberId || '',
    wabaId: data.selectedWabaId || '',
    accessToken: data.fbAccessToken || '',
    webhookUrl: data.webhookUrl || '',
    verifyToken: data.verifyToken || '',
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await copyToClipboard(text);
      setCopiedField(field);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleSubscribeWebhook = async () => {
    if (!data.selectedWabaId || !data.webhookUrl || !data.verifyToken) {
      toast.error('Missing webhook configuration');
      return;
    }

    try {
      await subscribeWebhook.mutateAsync({
        wabaId: data.selectedWabaId,
        webhookUrl: data.webhookUrl,
        verifyToken: data.verifyToken,
      });
      
      setWebhookSubscribed(true);
      toast.success('Webhook subscribed successfully!');
    } catch (error) {
      toast.error('Failed to subscribe webhook');
    }
  };

  const handleFinish = () => {
    complete();
  };

  const CopyButton: React.FC<{ text: string; field: string }> = ({ text, field }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleCopy(text, field)}
      className="p-2 sm:p-3 min-w-[44px] sm:min-w-[48px]"
    >
      {copiedField === field ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <WizardLayout
      onNext={handleFinish}
      nextLabel="Complete Setup"
      nextDisabled={!webhookSubscribed}
    >
      <div>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-2">
            API Credentials & Webhook
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Your WhatsApp Business API is almost ready! Copy these credentials to integrate with your application.
          </p>
        </div>

        {/* API Credentials */}
        <Card className="mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                <Key className="h-4 w-4 text-[#25D366]" />
              </div>
              <h3 className="font-medium text-[#1E1E1E] text-sm sm:text-base">API Credentials</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Phone Number ID
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={apiCredentials.phoneNumberId}
                    readOnly
                    className="flex-1 bg-gray-50 text-xs sm:text-sm"
                  />
                  <CopyButton text={apiCredentials.phoneNumberId} field="phoneNumberId" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  WhatsApp Business Account ID
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={apiCredentials.wabaId}
                    readOnly
                    className="flex-1 bg-gray-50 text-xs sm:text-sm"
                  />
                  <CopyButton text={apiCredentials.wabaId} field="wabaId" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Access Token
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="password"
                    value={apiCredentials.accessToken}
                    readOnly
                    className="flex-1 bg-gray-50 text-xs sm:text-sm"
                  />
                  <CopyButton text={apiCredentials.accessToken} field="accessToken" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Webhook Configuration */}
        <Card className="mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Webhook className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-medium text-[#1E1E1E] text-sm sm:text-base">Webhook Configuration</h3>
              </div>
              {webhookSubscribed && (
                <Badge variant="success" className="text-xs">✅ Subscribed</Badge>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Webhook URL
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={apiCredentials.webhookUrl}
                    readOnly
                    className="flex-1 bg-gray-50 text-xs sm:text-sm"
                  />
                  <CopyButton text={apiCredentials.webhookUrl} field="webhookUrl" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                  Verify Token
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={apiCredentials.verifyToken}
                    readOnly
                    className="flex-1 bg-gray-50 text-xs sm:text-sm"
                  />
                  <CopyButton text={apiCredentials.verifyToken} field="verifyToken" />
                </div>
              </div>

              {!webhookSubscribed && (
                <Button
                  onClick={handleSubscribeWebhook}
                  loading={subscribeWebhook.isPending}
                  className="w-full text-sm sm:text-base"
                >
                  Subscribe Webhook
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Integration Guide */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Next Steps</h3>
                <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                  <li>• Use these credentials in your application</li>
                  <li>• Configure your webhook endpoint to receive messages</li>
                  <li>• Test your integration with the WhatsApp Business API</li>
                  <li>• Create message templates for your business</li>
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm"
                >
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </WizardLayout>
  );
};