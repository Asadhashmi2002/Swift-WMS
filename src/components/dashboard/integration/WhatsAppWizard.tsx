import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Step1FacebookLogin } from '../../wizard/steps/Step1FacebookLogin';
import { Step2BusinessAccount } from '../../wizard/steps/Step2BusinessAccount';
import { Step3Verification } from '../../wizard/steps/Step3Verification';
import { Step4WABA } from '../../wizard/steps/Step4WABA';
import { Step5PhoneNumber } from '../../wizard/steps/Step5PhoneNumber';
import { Step6APISetup } from '../../wizard/steps/Step6APISetup';
import { FinishScreen } from '../../wizard/steps/FinishScreen';
import { useWizardStore } from '../../../stores/wizardStore';

interface WhatsAppWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const WhatsAppWizard: React.FC<WhatsAppWizardProps> = ({ onComplete, onCancel }) => {
  const { currentStep, completed, reset } = useWizardStore();

  const handleComplete = () => {
    reset();
    onComplete();
  };

  const renderStep = () => {
    if (completed) {
      return <FinishScreen onComplete={handleComplete} />;
    }

    switch (currentStep) {
      case 1:
        return <Step1FacebookLogin />;
      case 2:
        return <Step2BusinessAccount />;
      case 3:
        return <Step3Verification />;
      case 4:
        return <Step4WABA />;
      case 5:
        return <Step5PhoneNumber />;
      case 6:
        return <Step6APISetup />;
      default:
        return <Step1FacebookLogin />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Main Header */}
      <div className="border-b border-[var(--color-border)] px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">
            WhatsApp API Setup Wizard
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2 sm:p-3"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="h-[calc(100vh-65px)] sm:h-[calc(100vh-73px)] overflow-auto">
        {renderStep()}
      </div>
    </div>
  );
};