import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface LandingCardProps {
  onStartWizard: () => void;
}

export const LandingCard: React.FC<LandingCardProps> = ({ onStartWizard }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="h-16 w-16 rounded-xl bg-[#25D366] flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">
            WhatsApp Management System
          </h1>
          <p className="text-gray-600 mb-6">
            Complete WhatsApp Business API setup in 6 easy steps
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 text-left">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm font-medium">1</span>
            </div>
            <span className="text-sm text-gray-600">Connect Facebook account</span>
          </div>
          
          <div className="flex items-center space-x-3 text-left">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm font-medium">2</span>
            </div>
            <span className="text-sm text-gray-600">Select business account</span>
          </div>
          
          <div className="flex items-center space-x-3 text-left">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm font-medium">3</span>
            </div>
            <span className="text-sm text-gray-600">Verify business documents</span>
          </div>
          
          <div className="flex items-center space-x-3 text-left">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm font-medium">4</span>
            </div>
            <span className="text-sm text-gray-600">Create WhatsApp account</span>
          </div>
          
          <div className="flex items-center space-x-3 text-left">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm font-medium">5</span>
            </div>
            <span className="text-sm text-gray-600">Add & verify phone number</span>
          </div>
          
          <div className="flex items-center space-x-3 text-left">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-sm font-medium">6</span>
            </div>
            <span className="text-sm text-gray-600">Configure API credentials</span>
          </div>
        </div>

        <Button onClick={onStartWizard} size="lg" className="w-full">
          Start Setup
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          Setup takes approximately 10-15 minutes
        </p>
      </Card>
    </div>
  );
};