import React from 'react';
import { Facebook } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { WizardLayout } from '../WizardLayout';
import { useWizardStore } from '../../../stores/wizardStore';
import { useFacebookLogin } from '../../../hooks/useMetaQuery';
import toast from 'react-hot-toast';

export const Step1FacebookLogin: React.FC = () => {
  const { setData, nextStep } = useWizardStore();
  const facebookLogin = useFacebookLogin();

  const handleFacebookLogin = async () => {
    try {
      const result = await facebookLogin.mutateAsync();
      setData({ fbAccessToken: result.access_token });
      toast.success(`Welcome, ${result.user.name}!`);
      nextStep();
    } catch (error) {
      toast.error('Failed to connect to Facebook');
    }
  };

  return (
    <WizardLayout
      onNext={handleFacebookLogin}
      nextDisabled={!facebookLogin.isSuccess}
      nextLoading={facebookLogin.isPending}
      nextLabel="Connect Facebook"
      showPrev={false}
    >
      <div className="text-center">
        <div className="mb-8">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Facebook className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">
            Connect Your Facebook Account
          </h2>
          <p className="text-gray-600">
            We need to connect to your Facebook account to access your business accounts and set up WhatsApp Business API.
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <div className="space-y-4">
            <div className="text-left">
              <h3 className="font-medium text-[#1E1E1E] mb-2">What we'll access:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your business accounts</li>
                <li>• WhatsApp Business accounts</li>
                <li>• Basic profile information</li>
              </ul>
            </div>

            <Button
              onClick={handleFacebookLogin}
              loading={facebookLogin.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Continue with Facebook
            </Button>

            <p className="text-xs text-gray-500">
              By continuing, you agree to Facebook's terms of service and privacy policy.
            </p>
          </div>
        </Card>
      </div>
    </WizardLayout>
  );
};