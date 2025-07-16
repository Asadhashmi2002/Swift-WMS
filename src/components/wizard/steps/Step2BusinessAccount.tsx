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
        return <Badge variant="success" className="text-xs">✅ Verified</Badge>;
      case 'pending':
        return <Badge variant="warning" className="text-xs">⏳ Pending</Badge>;
      case 'rejected':
        return <Badge variant="error" className="text-xs">❌ Rejected</Badge>;
      default:
        return <Badge variant="default" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <WizardLayout
      onNext={handleNext}
      onPrev={prevStep}
      nextDisabled={!selectedBusiness}
    >
      <div>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-2">
            Select Business Account
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Choose an existing business account or create a new one to manage your WhatsApp Business API.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {isLoading ? (
            <Card>
              <div className="p-4 sm:p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {businesses?.map((business) => (
                <div
                  key={business.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedBusiness(business.id);
                    setData({ selectedBusinessId: business.id });
                  }}
                >
                  <Card
                    className={`transition-all ${
                      selectedBusiness === business.id
                        ? 'ring-2 ring-[#25D366] border-[#25D366]'
                        : 'hover:border-[#25D366]/50'
                    }`}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#25D366]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-[#1E1E1E] text-sm sm:text-base truncate">{business.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Created {new Date(business.created_time).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                          {getStatusBadge(business.verification_status)}
                          <input
                            type="radio"
                            checked={selectedBusiness === business.id}
                            onChange={e => {
                              e.stopPropagation();
                              setSelectedBusiness(business.id);
                              setData({ selectedBusinessId: business.id });
                            }}
                            className="h-4 w-4 text-[#25D366]"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}

              <Card className="border-dashed border-2 border-gray-300 hover:border-[#25D366] transition-colors">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-[#25D366] transition-colors p-4 sm:p-6"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Create New Business Account</span>
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
          <div className="space-y-4 p-4 sm:p-6">
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
                className="flex-1 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBusiness}
                loading={createBusiness.isPending}
                disabled={!newBusinessData.name}
                className="flex-1 text-sm sm:text-base"
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