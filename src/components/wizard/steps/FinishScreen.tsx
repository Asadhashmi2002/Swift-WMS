import React, { useState } from 'react';
import { CheckCircle, Plus, MessageSquare, Users, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Modal } from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { useCreateTemplate } from '../../../hooks/useMetaQuery';
import { useWizardStore } from '../../../stores/wizardStore';
import toast from 'react-hot-toast';

interface FinishScreenProps {
  onComplete?: () => void;
}

export const FinishScreen: React.FC<FinishScreenProps> = ({ onComplete }) => {
  const { data } = useWizardStore();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: '',
    category: 'utility' as const,
    language: 'en_US',
    bodyText: '',
  });

  const createTemplate = useCreateTemplate();

  const handleCreateTemplate = async () => {
    if (!templateData.name || !templateData.bodyText || !data.selectedWabaId) {
      toast.error('Template name and body text are required');
      return;
    }

    try {
      await createTemplate.mutateAsync({
        wabaId: data.selectedWabaId,
        template: {
          name: templateData.name,
          category: templateData.category,
          language: templateData.language,
          components: [
            {
              type: 'body',
              text: templateData.bodyText,
            },
          ],
        },
      });

      setShowTemplateModal(false);
      setTemplateData({
        name: '',
        category: 'utility',
        language: 'en_US',
        bodyText: '',
      });
      toast.success('Template created successfully!');
    } catch (error) {
      toast.error('Failed to create template');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce">
            <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-2">
            🎉 Congratulations!
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Your WhatsApp Business API is now ready to use
          </p>
        </div>

        {/* Setup Summary */}
        <Card className="mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1E1E1E] mb-4">Setup Complete</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">Facebook account connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">Business account configured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">Business verification submitted</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">WhatsApp account created</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">Phone number verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">API credentials generated</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
          <Card className="text-center">
            <div className="p-4 sm:p-6">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-[#25D366]" />
              </div>
              <h3 className="font-medium text-[#1E1E1E] mb-2 text-sm sm:text-base">Create First Template</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Create your first message template to start sending messages
              </p>
              <Button
                onClick={() => setShowTemplateModal(true)}
                size="sm"
                className="w-full text-xs sm:text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </Card>

          <Card className="text-center">
            <div className="p-4 sm:p-6">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#128C7E]/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#128C7E]" />
              </div>
              <h3 className="font-medium text-[#1E1E1E] mb-2 text-sm sm:text-base">Invite Team</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Add team members to manage your WhatsApp communications
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs sm:text-sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Invite Team
              </Button>
            </div>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mb-6 sm:mb-8">
          <div className="p-4 sm:p-6">
            <h3 className="font-medium text-[#1E1E1E] mb-4 text-sm sm:text-base">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="h-6 w-6 rounded-full bg-[#25D366] text-white text-xs flex items-center justify-center font-medium flex-shrink-0">
                    1
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">Test your API integration</span>
                </div>
                <Badge variant="warning" size="sm" className="flex-shrink-0 ml-2">Pending</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="h-6 w-6 rounded-full bg-[#25D366] text-white text-xs flex items-center justify-center font-medium flex-shrink-0">
                    2
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">Create message templates</span>
                </div>
                <Badge variant="warning" size="sm" className="flex-shrink-0 ml-2">Pending</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="h-6 w-6 rounded-full bg-[#25D366] text-white text-xs flex items-center justify-center font-medium flex-shrink-0">
                    3
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">Configure webhook endpoint</span>
                </div>
                <Badge variant="warning" size="sm" className="flex-shrink-0 ml-2">Pending</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Button */}
        <div className="text-center mt-6 sm:mt-8">
          <Button size="lg" className="px-6 sm:px-8 text-sm sm:text-base" onClick={onComplete}>
            Go to Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Template Creation Modal */}
        <Modal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          title="Create Message Template"
          size="md"
        >
          <div className="space-y-4 p-4 sm:p-6">
            <Input
              label="Template Name *"
              value={templateData.name}
              onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="welcome_message"
              hint="Use lowercase letters, numbers, and underscores only"
            />

            <div>
              <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                Category *
              </label>
              <select
                value={templateData.category}
                onChange={(e) => setTemplateData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full p-3 border border-[#D2D1D4] rounded-xl bg-white text-[#1E1E1E] text-sm"
              >
                <option value="utility">Utility</option>
                <option value="marketing">Marketing</option>
                <option value="authentication">Authentication</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                Language *
              </label>
              <select
                value={templateData.language}
                onChange={(e) => setTemplateData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full p-3 border border-[#D2D1D4] rounded-xl bg-white text-[#1E1E1E] text-sm"
              >
                <option value="en_US">English (US)</option>
                <option value="en_GB">English (UK)</option>
                <option value="es_ES">Spanish</option>
                <option value="fr_FR">French</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                Message Body *
              </label>
              <textarea
                value={templateData.bodyText}
                onChange={(e) => setTemplateData(prev => ({ ...prev, bodyText: e.target.value }))}
                placeholder="Hello {{1}}, welcome to our service!"
                className="w-full p-3 border border-[#D2D1D4] rounded-xl bg-white text-[#1E1E1E] resize-none text-sm"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {'{{1}}'}, {'{{2}}'}, etc. for variables
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowTemplateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                loading={createTemplate.isPending}
                className="flex-1"
              >
                Create Template
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};