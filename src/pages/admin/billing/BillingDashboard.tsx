import React, { useState, useEffect } from 'react';
import { CreditCard, Users, Calendar, Download, Settings, Plus, Minus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { useBilling } from '../../../hooks/useBilling';
import toast from 'react-hot-toast';

interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: string;
  seats: number;
  gateway: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  plan: {
    id: string;
    name: string;
    priceMonthly: number;
    seatLimit: number;
  };
  invoices: Invoice[];
}

interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  status: string;
  pdfUrl?: string;
  issuedAt: string;
}

export const BillingDashboard: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateSeats, setShowUpdateSeats] = useState(false);
  const [showUpdateCard, setShowUpdateCard] = useState(false);
  const [newSeats, setNewSeats] = useState(1);
  const { getSubscription, updateSubscription } = useBilling();

  // TODO: Get actual subscription ID from auth context
  const subscriptionId = 'demo-subscription-id';

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await getSubscription(subscriptionId);
      if (response.success) {
        setSubscription(response.data);
        setNewSeats(response.data.seats);
      }
    } catch (error) {
      toast.error('Failed to fetch subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeats = async () => {
    if (!subscription) return;

    try {
      const response = await updateSubscription(subscription.id, { seats: newSeats });
      if (response.success) {
        setSubscription(response.data);
        setShowUpdateSeats(false);
        toast.success('Seats updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update seats');
    }
  };

  const handleToggleAutoRenew = async () => {
    if (!subscription) return;

    try {
      const response = await updateSubscription(subscription.id, { 
        autoRenew: !subscription.autoRenew 
      });
      if (response.success) {
        setSubscription(response.data);
        toast.success(`Auto-renew ${response.data.autoRenew ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      toast.error('Failed to update auto-renew setting');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'trialing':
        return <Badge variant="warning">Trial</Badge>;
      case 'past_due':
        return <Badge variant="error">Past Due</Badge>;
      case 'canceled':
        return <Badge variant="default">Canceled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      case 'open':
        return <Badge variant="warning">Open</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Subscription</h2>
          <p className="text-gray-600 mb-6">You don't have an active subscription.</p>
          <Button onClick={() => window.location.href = '/pricing'}>
            View Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription and billing settings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Plan Card */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
                {getStatusBadge(subscription.status)}
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{subscription.plan.name}</h3>
                  <p className="text-sm text-gray-600">${subscription.plan.priceMonthly}/seat/month</p>
                </div>

                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{subscription.seats} Seats</h3>
                  <p className="text-sm text-gray-600">of {subscription.plan.seatLimit} available</p>
                </div>

                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Next Billing</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateSeats(true)}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Update Seats
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateCard(true)}
                  className="flex items-center"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Card
                </Button>
                <Button
                  variant={subscription.autoRenew ? "outline" : "default"}
                  onClick={handleToggleAutoRenew}
                  className="flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {subscription.autoRenew ? 'Disable' : 'Enable'} Auto-Renew
                </Button>
              </div>
            </Card>
          </div>

          {/* Billing Summary */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Cost</span>
                  <span className="font-medium">
                    ${(subscription.seats * subscription.plan.priceMonthly).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">{subscription.gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto-Renew</span>
                  <span className="font-medium">
                    {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Invoice History */}
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscription.invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{invoice.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.issuedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(invoice.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getInvoiceStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.pdfUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(invoice.pdfUrl, '_blank')}
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Update Seats Modal */}
      <Modal
        isOpen={showUpdateSeats}
        onClose={() => setShowUpdateSeats(false)}
        title="Update Seats"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Seats
            </label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewSeats(Math.max(1, newSeats - 1))}
                disabled={newSeats <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={newSeats}
                onChange={(e) => setNewSeats(parseInt(e.target.value) || 1)}
                min={1}
                max={subscription?.plan.seatLimit}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewSeats(Math.min(subscription?.plan.seatLimit || 1, newSeats + 1))}
                disabled={newSeats >= (subscription?.plan.seatLimit || 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Maximum {subscription?.plan.seatLimit} seats for {subscription?.plan.name} plan
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowUpdateSeats(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSeats}
              className="flex-1"
            >
              Update Seats
            </Button>
          </div>
        </div>
      </Modal>

      {/* Update Card Modal */}
      <Modal
        isOpen={showUpdateCard}
        onClose={() => setShowUpdateCard(false)}
        title="Update Payment Method"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            You will be redirected to update your payment method securely.
          </p>
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowUpdateCard(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement payment method update
                toast.info('Payment method update coming soon');
                setShowUpdateCard(false);
              }}
              className="flex-1"
            >
              Update Payment Method
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 