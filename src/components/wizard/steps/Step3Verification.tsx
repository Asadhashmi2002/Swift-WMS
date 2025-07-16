import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { WizardLayout } from '../WizardLayout';
import { useWizardStore } from '../../../stores/wizardStore';
import { useUploadBusinessDocs } from '../../../hooks/useMetaQuery';
import toast from 'react-hot-toast';

export const Step3Verification: React.FC = () => {
  const { nextStep, prevStep } = useWizardStore();
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'pending' | 'needs_docs'>('needs_docs');
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  
  const uploadDocs = useUploadBusinessDocs();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      await uploadDocs.mutateAsync(files);
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedDocs(prev => [...prev, ...fileNames]);
      setVerificationStatus('pending');
      toast.success('Documents uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload documents');
    }
  };

  const handleNext = () => {
    if (verificationStatus === 'verified' || verificationStatus === 'pending') {
      nextStep();
    }
  };

  const getStatusInfo = () => {
    switch (verificationStatus) {
      case 'verified':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          badge: <Badge variant="success">✅ Verified</Badge>,
          title: 'Business Verified',
          description: 'Your business has been successfully verified.',
          canProceed: true,
        };
      case 'pending':
        return {
          icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
          badge: <Badge variant="warning">⏳ Under Review</Badge>,
          title: 'Verification Pending',
          description: 'Your documents are being reviewed. This usually takes 1-2 business days.',
          canProceed: true,
        };
      case 'needs_docs':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-600" />,
          badge: <Badge variant="error">⚠️ Needs Documents</Badge>,
          title: 'Documents Required',
          description: 'Please upload the required business documents to proceed.',
          canProceed: false,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <WizardLayout
      onNext={handleNext}
      onPrev={prevStep}
      nextDisabled={!statusInfo.canProceed}
    >
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">
            Business Verification
          </h2>
          <p className="text-gray-600">
            Verify your business to unlock full WhatsApp Business API features.
          </p>
        </div>

        <Card className="mb-6">
          <div className="flex items-start space-x-4">
            {statusInfo.icon}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-medium text-[#1E1E1E]">{statusInfo.title}</h3>
                {statusInfo.badge}
              </div>
              <p className="text-gray-600 text-sm">{statusInfo.description}</p>
            </div>
          </div>
        </Card>

        {verificationStatus === 'needs_docs' && (
          <Card>
            <h3 className="font-medium text-[#1E1E1E] mb-4">Upload Business Documents</h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#003CFF] transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, PNG up to 10MB each
                  </p>
                </label>
              </div>

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Required Documents:</h4>
                <ul className="space-y-1">
                  <li>• Business registration certificate</li>
                  <li>• Tax identification document (GST/PAN)</li>
                  <li>• Proof of business address</li>
                  <li>• Director/Owner identification</li>
                </ul>
              </div>

              {uploadedDocs.length > 0 && (
                <div>
                  <h4 className="font-medium text-[#1E1E1E] mb-2">Uploaded Documents:</h4>
                  <div className="space-y-2">
                    {uploadedDocs.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-gray-600">{doc}</span>
                        <Badge variant="success" size="sm">Uploaded</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {verificationStatus === 'pending' && (
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">Review in Progress</h3>
                <p className="text-sm text-yellow-700">
                  Your documents are being reviewed by our verification team. 
                  You'll receive an email notification once the review is complete.
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  You can continue with the setup process while verification is pending.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </WizardLayout>
  );
};