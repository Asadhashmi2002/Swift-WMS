import React, { useState } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { Badge } from '../../ui/Badge';
import { WizardLayout } from '../WizardLayout';
import { useWizardStore } from '../../../stores/wizardStore';
import { useWABAs, useCreateWABA } from '../../../hooks/useMetaQuery';
import toast from 'react-hot-toast';

export const Step4WABA: React.FC = () => {
  const { data, setData, nextStep, prevStep } = useWizardStore();
  const [selectedWABA, setSelectedWABA] = useState(data.selectedWabaId || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wabaName, setWabaName] = useState('');

  const { data: wabas, isLoading } = useWABAs(data.selectedBusinessId);
  const createWABA = useCreateWABA();

  const handleNext = () => {
    if (selectedWABA) {
      setData({ selectedWabaId: selectedWABA });
      nextStep();
    }
  };

  const handleCreateWABA = async () => {
    if (!wabaName || !data.selectedBusinessId) {
      toast.error('WABA name is required');
      return;
    }

    try {
      const result = await createWABA.mutateAsync({
        businessId: data.selectedBusinessId,
        name: wabaName,
      });
      setSelectedWABA(result.id);
      setShowCreateModal(false);
      setWabaName('');
      toast.success('WhatsApp Business Account created successfully');
    } catch (error) {
      toast.error('Failed to create WABA');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">✅ Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">⏳ Pending</Badge>;
      case 'rejected':
        return <Badge variant="error">❌ Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success" size="sm">Verified</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'rejected':
        return <Badge variant="error" size="sm">Rejected</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <WizardLayout
      onNext={handleNext}
      onPrev={prevStep}
      nextDisabled={!selectedWABA}
    >
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">
            WhatsApp Business Account
          </h2>
          <p className="text-gray-600">
            Select an existing WhatsApp Business Account or create a new one for your business.
          </p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ) : (
            <>
              {wabas?.map((waba) => (
                <Card
                  key={waba.id}
                  className={`cursor-pointer transition-all ${
                    selectedWABA === waba.id
                      ? 'ring-2 ring-[#003CFF] border-[#003CFF]'
                      : 'hover:border-[#003CFF]/50'
                  }`}
                  onClick={() => setSelectedWABA(waba.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1E1E1E]">{waba.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">{waba.country}</span>
                          {getVerificationBadge(waba.business_verification_status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(waba.account_review_status)}
                      <input
                        type="radio"
                        checked={selectedWABA === waba.id}
                        onChange={() => setSelectedWABA(waba.id)}
                        className="h-4 w-4 text-[#003CFF]"
                      />
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="border-dashed border-2 border-gray-300 hover:border-[#003CFF] transition-colors">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-[#003CFF] transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create New WhatsApp Business Account</span>
                </button>
              </Card>
            </>
          )}
        </div>

        {/* Create WABA Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create WhatsApp Business Account"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Account Name *"
              value={wabaName}
              onChange={(e) => setWabaName(e.target.value)}
              placeholder="Enter WhatsApp Business Account name"
              hint="This will be the display name for your WhatsApp Business Account"
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Account creation may take a few minutes</li>
                <li>• You'll need to complete business verification</li>
                <li>• Account will be subject to Meta's review process</li>
              </ul>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateWABA}
                loading={createWABA.isPending}
                disabled={!wabaName}
                className="flex-1"
              >
                Create Account
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </WizardLayout>
  );
};