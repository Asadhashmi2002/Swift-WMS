import React, { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { Badge } from '../../ui/Badge';
import { WizardLayout } from '../WizardLayout';
import { useWizardStore } from '../../../stores/wizardStore';
import { useBusinessManagers, useCreateBusinessManager } from '../../../hooks/useMetaQuery';
import toast from 'react-hot-toast';

export const Step2BusinessAccount: React.FC = () => {
  const { data, setData, nextStep, prevStep } = useWizardStore();
  const [selectedBusiness, setSelectedBusiness] = useState(data.selectedBusinessId || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBusinessData, setNewBusinessData] = useState({
    name: '',
    gst: '',
    pan: '',
  });

  const { data: businesses, isLoading } = useBusinessManagers();
  const createBusiness = useCreateBusinessManager();

  const handleNext = () => {
    if (selectedBusiness) {
      setData({ selectedBusinessId: selectedBusiness });
      nextStep();
    }
  };

  const handleCreateBusiness = async () => {
    if (!newBusinessData.name) {
      toast.error('Business name is required');
      return;
    }

    try {
      const result = await createBusiness.mutateAsync(newBusinessData);
      setSelectedBusiness(result.id);
      setShowCreateModal(false);
      setNewBusinessData({ name: '', gst: '', pan: '' });
      toast.success('Business account created successfully');
    } catch (error) {
      toast.error('Failed to create business account');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">✅ Verified</Badge>;
      case 'pending':
        return <Badge variant="warning">⏳ Pending</Badge>;
      case 'rejected':
        return <Badge variant="error">❌ Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <WizardLayout
      onNext={handleNext}
      onPrev={prevStep}
      nextDisabled={!selectedBusiness}
    >
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">
            Select Business Account
          </h2>
          <p className="text-gray-600">
            Choose an existing business account or create a new one to manage your WhatsApp Business API.
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
              {businesses?.map((business) => (
                <Card
                  key={business.id}
                  className={`cursor-pointer transition-all ${
                    selectedBusiness === business.id
                      ? 'ring-2 ring-[#003CFF] border-[#003CFF]'
                      : 'hover:border-[#003CFF]/50'
                  }`}
                  onClick={() => setSelectedBusiness(business.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-[#003CFF]/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-[#003CFF]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1E1E1E]">{business.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created {new Date(business.created_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(business.verification_status)}
                      <input
                        type="radio"
                        checked={selectedBusiness === business.id}
                        onChange={() => setSelectedBusiness(business.id)}
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
                  <span>Create New Business Account</span>
                </button>
              </Card>
            </>
          )}
        </div>

        {/* Create Business Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Business Account"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Business Name *"
              value={newBusinessData.name}
              onChange={(e) => setNewBusinessData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your business name"
            />

            <Input
              label="GST Number (Optional)"
              value={newBusinessData.gst}
              onChange={(e) => setNewBusinessData(prev => ({ ...prev, gst: e.target.value }))}
              placeholder="Enter GST number"
            />

            <Input
              label="PAN Number (Optional)"
              value={newBusinessData.pan}
              onChange={(e) => setNewBusinessData(prev => ({ ...prev, pan: e.target.value }))}
              placeholder="Enter PAN number"
            />

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBusiness}
                loading={createBusiness.isPending}
                disabled={!newBusinessData.name}
                className="flex-1"
              >
                Create Business
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </WizardLayout>
  );
};