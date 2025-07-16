import React from 'react';
import { Check, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { useWizardStore } from '../../stores/wizardStore';
import { cn } from '../../lib/utils';

interface WizardLayoutProps {
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  nextLabel?: string;
  showPrev?: boolean;
}

const steps = [
  { number: 1, title: 'Facebook Login', description: 'Connect your Facebook account' },
  { number: 2, title: 'Business Account', description: 'Select or create business' },
  { number: 3, title: 'Verification', description: 'Business verification check' },
  { number: 4, title: 'WhatsApp Account', description: 'Create or pick WABA' },
  { number: 5, title: 'Phone Number', description: 'Add and verify number' },
  { number: 6, title: 'API Setup', description: 'Configure credentials' },
];

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  children,
  onNext,
  onPrev,
  nextDisabled = false,
  nextLoading = false,
  nextLabel = 'Next',
  showPrev = true,
}) => {
  const { currentStep } = useWizardStore();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-[#D2D1D4] p-6">
        <div className="mb-8">
          <div className="h-10 w-10 rounded-xl bg-[#003CFF] flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold text-[#1E1E1E] mb-2">SwiftAMS</h1>
          <p className="text-gray-600 text-sm">WhatsApp API Setup Wizard</p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div
                key={step.number}
                className={cn(
                  'flex items-start space-x-3 p-3 rounded-lg transition-colors',
                  isActive && 'bg-[#003CFF]/5 border border-[#003CFF]/20',
                  isCompleted && 'bg-green-50'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                    isCompleted && 'bg-green-500 text-white',
                    isActive && 'bg-[#003CFF] text-white',
                    !isActive && !isCompleted && 'bg-[#D2D1D4] text-gray-600'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      'font-medium text-sm',
                      isActive && 'text-[#003CFF]',
                      isCompleted && 'text-green-700',
                      !isActive && !isCompleted && 'text-gray-600'
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-[#D2D1D4] p-6 bg-white fixed bottom-0 right-0 left-80 z-50 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              {showPrev && currentStep > 1 && (
                <Button
                  variant="ghost"
                  onClick={onPrev}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </span>
              {onNext && (
                <Button
                  onClick={onNext}
                  disabled={nextDisabled}
                  loading={nextLoading}
                >
                  {nextLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};