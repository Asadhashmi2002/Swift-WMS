import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useBilling } from '../../hooks/useBilling';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const { activateSubscription } = useBilling();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      handleActivation();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const handleActivation = async () => {
    try {
      const response = await activateSubscription(sessionId!);
      if (response.success) {
        setSubscription(response.data);
        toast.success('Subscription activated successfully!');
      } else {
        toast.error('Failed to activate subscription');
      }
    } catch (error) {
      toast.error('Failed to activate subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (subscription?.invoices?.[0]?.pdfUrl) {
      window.open(subscription.invoices[0].pdfUrl, '_blank');
    } else {
      toast.error('Invoice not available for download');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Activating your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your subscription has been activated successfully.
          </p>

          {/* Subscription Details */}
          {subscription && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Subscription Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{subscription.plan?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">{subscription.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{subscription.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Billing:</span>
                  <span className="font-medium">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    ${subscription.invoices?.[0]?.amount / 100}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {subscription?.invoices?.[0]?.pdfUrl && (
              <Button
                variant="outline"
                onClick={handleDownloadInvoice}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            )}
            
            <Button
              onClick={handleGoToDashboard}
              className="w-full"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              You'll receive a confirmation email shortly. If you have any questions, 
              please contact our support team.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}; 