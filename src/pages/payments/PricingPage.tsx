import React, { useState, useEffect } from 'react';
import { Check, Users, Zap, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CheckoutModal } from '../../components/CheckoutModal';
import { useBilling } from '../../hooks/useBilling';
import toast from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  seatLimit: number;
}

export const PricingPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getPlans } = useBilling();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getPlans();
      setPlans(response.data);
    } catch (error) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const getPlanFeatures = (planName: string) => {
    const baseFeatures = [
      'WhatsApp Business API',
      'Real-time messaging',
      'Message templates',
      'Analytics dashboard',
    ];

    switch (planName.toLowerCase()) {
      case 'starter':
        return [
          ...baseFeatures,
          'Up to 1,000 messages/month',
          'Basic support',
          'Standard templates',
        ];
      case 'growth':
        return [
          ...baseFeatures,
          'Up to 10,000 messages/month',
          'Priority support',
          'Custom templates',
          'Advanced analytics',
          'Team collaboration',
        ];
      case 'enterprise':
        return [
          ...baseFeatures,
          'Unlimited messages',
          '24/7 dedicated support',
          'Custom integrations',
          'Advanced security',
          'SLA guarantee',
          'Custom branding',
        ];
      default:
        return baseFeatures;
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return <Zap className="h-6 w-6" />;
      case 'growth':
        return <Users className="h-6 w-6" />;
      case 'enterprise':
        return <Shield className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. All plans include our core WhatsApp Business API features.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative p-8 ${
                plan.name.toLowerCase() === 'growth'
                  ? 'ring-2 ring-blue-500 scale-105'
                  : ''
              }`}
            >
              {plan.name.toLowerCase() === 'growth' && (
                <Badge
                  variant="success"
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                >
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    {getPlanIcon(plan.name)}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.priceMonthly}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Up to {plan.seatLimit.toLocaleString()} seats
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {getPlanFeatures(plan.name).map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleChoosePlan(plan)}
                className={`w-full ${
                  plan.name.toLowerCase() === 'growth'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                Choose {plan.name}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and digital wallets. All payments are processed securely through our payment partners.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, all plans come with a 14-day free trial. No credit card required to start your trial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}; 