import React, { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { WizardLayout } from '../WizardLayout';
import { useWizardStore } from '../../../stores/wizardStore';
import { 
  usePhoneNumbers, 
  useAddPhoneNumber, 
  useRequestVerificationCode, 
  useVerifyCode 
} from '../../../hooks/useMetaQuery';
import toast from 'react-hot-toast';

export const Step5PhoneNumber: React.FC = () => {
  const { data, setData, nextStep, prevStep } = useWizardStore();
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const [currentPhoneId, setCurrentPhoneId] = useState<string | null>(null);
  const [step, setStep] = useState<'add' | 'verify' | 'complete'>('add');

  const { data: phoneNumbers, isLoading } = usePhoneNumbers(data.selectedWabaId);
  const addPhoneNumber = useAddPhoneNumber();
  const requestCode = useRequestVerificationCode();
  const verifyCode = useVerifyCode();

  const handleAddPhoneNumber = async () => {
    if (!phoneNumber || !verifiedName || !data.selectedWabaId) {
      toast.error('Phone number and verified name are required');
      return;
    }

    try {
      const result = await addPhoneNumber.mutateAsync({
        wabaId: data.selectedWabaId,
        phoneNumber,
        verifiedName,
      });
      
      setCurrentPhoneId(result.id);
      setData({ phoneNumber, phoneNumberId: result.id });
      
      // Request verification code
      await requestCode.mutateAsync({
        phoneId: result.id,
        method: 'sms',
      });
      
      setStep('verify');
      toast.success('Verification code sent to your phone');
    } catch (error) {
      toast.error('Failed to add phone number');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || !currentPhoneId) {
      toast.error('Verification code is required');
      return;
    }

    try {
      await verifyCode.mutateAsync({
        phoneId: currentPhoneId,
        code: verificationCode,
      });
      
      setStep('complete');
      toast.success('Phone number verified successfully!');
    } catch (error) {
      toast.error('Invalid verification code');
    }
  };

  const handleNext = () => {
    if (step === 'complete') {
      nextStep();
    }
  };

  const getQualityBadge = (rating: string) => {
    switch (rating) {
      case 'green':
        return <Badge variant="success">High Quality</Badge>;
      case 'yellow':
        return <Badge variant="warning">Medium Quality</Badge>;
      case 'red':
        return <Badge variant="error">Low Quality</Badge>;
      default:
        return <Badge variant="default">{rating}</Badge>;
    }
  };

  return (
    <WizardLayout
      onNext={handleNext}
      onPrev={prevStep}
      nextDisabled={step !== 'complete'}
    >
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">
            Add & Verify Phone Number
          </h2>
          <p className="text-gray-600">
            Add a phone number to your WhatsApp Business Account and verify it.
          </p>
        </div>

        {/* Existing Phone Numbers */}
        {phoneNumbers && phoneNumbers.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-[#1E1E1E] mb-3">Existing Phone Numbers</h3>
            <div className="space-y-3">
              {phoneNumbers.map((phone) => (
                <Card key={phone.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1E1E1E]">{phone.display_phone_number}</p>
                        <p className="text-sm text-gray-500">{phone.verified_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getQualityBadge(phone.quality_rating)}
                      <Badge 
                        variant={phone.code_verification_status === 'verified' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {phone.code_verification_status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Add New Phone Number */}
        {step === 'add' && (
          <Card>
            <h3 className="font-medium text-[#1E1E1E] mb-4">Add New Phone Number</h3>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Important</h4>
                    <p className="text-sm text-yellow-700">
                      The phone number must not be registered with WhatsApp personal app. 
                      It should be a business number that you own.
                    </p>
                  </div>
                </div>
              </div>

              <Input
                label="Phone Number *"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                hint="Include country code (e.g., +1 for US)"
              />

              <Input
                label="Verified Name *"
                value={verifiedName}
                onChange={(e) => setVerifiedName(e.target.value)}
                placeholder="Your Business Name"
                hint="This will be displayed to customers"
              />

              <Button
                onClick={handleAddPhoneNumber}
                loading={addPhoneNumber.isPending || requestCode.isPending}
                disabled={!phoneNumber || !verifiedName}
                className="w-full"
              >
                Add & Send Verification Code
              </Button>
            </div>
          </Card>
        )}

        {/* Verify Phone Number */}
        {step === 'verify' && (
          <Card>
            <h3 className="font-medium text-[#1E1E1E] mb-4">Verify Phone Number</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  We've sent a 6-digit verification code to <strong>{phoneNumber}</strong>. 
                  Please enter the code below.
                </p>
              </div>

              <Input
                label="Verification Code *"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                hint="Enter the 6-digit code you received"
              />

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('add')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  loading={verifyCode.isPending}
                  disabled={verificationCode.length !== 6}
                  className="flex-1"
                >
                  Verify Code
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Verification Complete */}
        {step === 'complete' && (
          <Card className="bg-green-50 border-green-200">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-green-800 mb-2">Phone Number Verified!</h3>
              <p className="text-sm text-green-700 mb-4">
                Your phone number <strong>{phoneNumber}</strong> has been successfully verified 
                and added to your WhatsApp Business Account.
              </p>
              <Badge variant="success">✅ Ready to use</Badge>
            </div>
          </Card>
        )}
      </div>
    </WizardLayout>
  );
};