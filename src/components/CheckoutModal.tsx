import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { useBilling } from '../hooks/useBilling';
import toast from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  seatLimit: number;
}

interface CheckoutModalProps {
  plan: Plan;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ plan, onClose }) => {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gateway, setGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const { createCheckout } = useBilling();

  const totalAmount = seats * plan.priceMonthly;

  const handleCheckout = async () => {
    if (seats < 1 || seats > plan.seatLimit) {
      toast.error(`Seats must be between 1 and ${plan.seatLimit}`);
      return;
    }

    setLoading(true);
    try {
      // TODO: Get actual tenant ID from auth context
      const tenantId = 'demo-tenant-id';
      
      const response = await createCheckout({
        planId: plan.id,
        seats,
        tenantId,
      });

      // Redirect to payment gateway
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatsChange = (value: number) => {
    const newSeats = Math.max(1, Math.min(value, plan.seatLimit));
    setSeats(newSeats);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Complete Your Purchase" size="lg">
      <div className="space-y-6">
        {/* Plan Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900">{plan.name} Plan</h3>
            <span className="text-sm text-gray-600">${plan.priceMonthly}/seat/month</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Seats</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSeatsChange(seats - 1)}
                disabled={seats <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center">{seats}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSeatsChange(seats + 1)}
                disabled={seats >= plan.seatLimit}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Gateway Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="gateway"
                value="stripe"
                checked={gateway === 'stripe'}
                onChange={(e) => setGateway(e.target.value as 'stripe' | 'razorpay')}
                className="h-4 w-4 text-blue-600"
              />
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Credit Card (Stripe)</span>
              </div>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="gateway"
                value="razorpay"
                checked={gateway === 'razorpay'}
                onChange={(e) => setGateway(e.target.value as 'stripe' | 'razorpay')}
                className="h-4 w-4 text-blue-600"
              />
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Razorpay</span>
              </div>
            </label>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${totalAmount}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">$0.00</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${totalAmount}</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Lock className="h-4 w-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            Pay ${totalAmount}
          </Button>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By completing your purchase, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </Modal>
  );
}; 