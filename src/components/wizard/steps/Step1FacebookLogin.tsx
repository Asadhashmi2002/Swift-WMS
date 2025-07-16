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
        <div className="mb-6 sm:mb-8">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Facebook className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-2">
            Connect Your Facebook Account
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">
            We need to connect to your Facebook account to access your business accounts and set up WhatsApp Business API.
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <div className="space-y-4 p-4 sm:p-6">
            <div className="text-left">
              <h3 className="font-medium text-[#1E1E1E] mb-2 text-sm sm:text-base">What we'll access:</h3>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li>• Your business accounts</li>
                <li>• WhatsApp Business accounts</li>
                <li>• Basic profile information</li>
              </ul>
            </div>

            <Button
              onClick={handleFacebookLogin}
              loading={facebookLogin.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
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