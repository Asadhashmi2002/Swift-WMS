import React, { useState } from 'react';
import { Check, ChevronLeft, MessageCircle, Menu, X } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-[#D2D1D4]">
        {/* Main Header */}
        <div className="px-4 py-3 border-b border-[#D2D1D4]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-lg bg-[#25D366] flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-[#1E1E1E] leading-tight">WMS</h1>
                <p className="text-xs text-gray-600 leading-tight">WhatsApp Management System</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="px-2 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center flex-1 relative">
                  {/* Progress Line */}
                  {index > 0 && (
                    <div className={cn(
                      'absolute top-3 left-0 w-full h-0.5 -ml-1',
                      isCompleted ? 'bg-green-500' : 'bg-[#D2D1D4]'
                    )} />
                  )}
                  
                  {/* Step Circle */}
                  <div
                    className={cn(
                      'flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mb-2 relative z-10',
                      isCompleted && 'bg-green-500 text-white',
                      isActive && 'bg-[#25D366] text-white',
                      !isActive && !isCompleted && 'bg-[#D2D1D4] text-gray-600'
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  
                  {/* Step Title */}
                  <div className="text-center px-1">
                    <h3
                      className={cn(
                        'font-medium text-xs leading-tight',
                        isActive && 'text-[#25D366]',
                        isCompleted && 'text-green-700',
                        !isActive && !isCompleted && 'text-gray-500'
                      )}
                    >
                      {step.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-80 bg-white border-r border-[#D2D1D4] transition-transform lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6">
          <div className="mb-8">
            <div className="h-10 w-10 rounded-xl bg-[#25D366] flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#1E1E1E] mb-2">WMS</h1>
            <p className="text-gray-600 text-sm">WhatsApp Management System</p>
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
                    isActive && 'bg-[#25D366]/5 border border-[#25D366]/20',
                    isCompleted && 'bg-green-50'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                      isCompleted && 'bg-green-500 text-white',
                      isActive && 'bg-[#25D366] text-white',
                      !isActive && !isCompleted && 'bg-[#D2D1D4] text-gray-600'
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        'font-medium text-sm',
                        isActive && 'text-[#25D366]',
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

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-[#D2D1D4] p-4 sm:p-6 bg-white lg:fixed lg:bottom-0 lg:right-0 lg:left-80 lg:z-50 lg:shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              {showPrev && currentStep > 1 && (
                <Button
                  variant="ghost"
                  onClick={onPrev}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm text-gray-500 hidden sm:inline">
                Step {currentStep} of {steps.length}
              </span>
              {onNext && (
                <Button
                  onClick={onNext}
                  disabled={nextDisabled}
                  loading={nextLoading}
                  className="min-w-[100px]"
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