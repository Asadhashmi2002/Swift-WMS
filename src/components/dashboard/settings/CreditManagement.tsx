import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Calendar,
  DollarSign,
  MessageSquare,
  Plus,
  Eye
} from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { 
  getCreditBalance, 
  getCreditPackages, 
  purchaseCredits, 
  getCreditTransactions, 
  getCreditUsage 
} from '../../../lib/mockApi';
import { 
  CreditBalance, 
  CreditPackage, 
  CreditTransaction, 
  CreditUsageStats 
} from '../../../types';
import toast from 'react-hot-toast';

export const CreditManagement: React.FC = () => {
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [usageStats, setUsageStats] = useState<CreditUsageStats | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [usagePeriod, setUsagePeriod] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    loadCreditData();
  }, []);

  const loadCreditData = async () => {
    try {
      const [balance, packages, txns, usage] = await Promise.all([
        getCreditBalance(),
        getCreditPackages(),
        getCreditTransactions(),
        getCreditUsage(usagePeriod)
      ]);
      setCreditBalance(balance);
      setCreditPackages(packages);
      setTransactions(txns);
      setUsageStats(usage);
    } catch (error) {
      console.error('Failed to load credit data:', error);
      toast.error('Failed to load credit data');
    }
  };

  const handlePurchaseCredits = async (packageId: string) => {
    setLoading(true);
    try {
      await purchaseCredits(packageId, 'Stripe');
      toast.success('Credits purchased successfully!');
      setShowPurchaseModal(false);
      loadCreditData(); // Refresh data
    } catch (error) {
      toast.error('Failed to purchase credits');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <CreditCard className="h-4 w-4" />;
      case 'usage': return <MessageSquare className="h-4 w-4" />;
      case 'refund': return <CheckCircle className="h-4 w-4" />;
      case 'bonus': return <Plus className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-green-600';
      case 'usage': return 'text-red-600';
      case 'refund': return 'text-blue-600';
      case 'bonus': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (!creditBalance) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Credit Balance Warning */}
      {creditBalance.isLow && (
        <Card className="border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-orange-800 font-medium">
                  Your Credit Balance is low, please Buy Credits to ensure continued messaging
                </p>
                <p className="text-orange-700 text-sm">
                  Credit Balance: {formatCurrency(creditBalance.balance, creditBalance.currency)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Pricing Overview
              </Button>
              <Button 
                size="sm" 
                onClick={() => setShowPurchaseModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Buy Credits
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Credit Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">Credit Balance</h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(creditBalance.balance, creditBalance.currency)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">Messages Sent</h3>
              <p className="text-2xl font-bold text-green-600">
                {usageStats?.totalMessagesSent || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">Avg. Cost/Message</h3>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(usageStats?.averageCostPerMessage || 0, creditBalance.currency)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Credit Usage History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Credit Usage History</h3>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowUsageModal(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <select
              value={usagePeriod}
              onChange={(e) => setUsagePeriod(e.target.value as 'daily' | 'monthly')}
              className="p-2 border border-[var(--color-border)] rounded-lg text-sm"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-2 font-medium">Date</th>
                <th className="text-left p-2 font-medium">Messages</th>
                <th className="text-left p-2 font-medium">Credits Used</th>
                <th className="text-left p-2 font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {(usagePeriod === 'daily' ? usageStats?.dailyUsage : usageStats?.monthlyUsage)?.slice(0, 5).map((usage) => (
                <tr key={usage.id} className="border-b border-[var(--color-border)]">
                  <td className="p-2">
                    {usage.date.toLocaleDateString()}
                  </td>
                  <td className="p-2">{usage.messagesSent}</td>
                  <td className="p-2">{usage.creditsUsed}</td>
                  <td className="p-2 font-medium">
                    {formatCurrency(usage.totalCost, creditBalance.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Credit Packages */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Credit Packages</h3>
          <Button 
            onClick={() => setShowPurchaseModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buy Credits
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creditPackages.map((pkg) => (
            <div key={pkg.id} className="border border-[var(--color-border)] rounded-lg p-4">
              {pkg.isPopular && (
                <Badge variant="primary" className="mb-2">Most Popular</Badge>
              )}
              <h4 className="font-semibold text-[var(--color-text)] mb-2">{pkg.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm">Credits:</span>
                  <span className="font-medium">{pkg.credits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Price:</span>
                  <span className="font-medium">{formatCurrency(pkg.price, pkg.currency)}</span>
                </div>
                {pkg.discount && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Discount:</span>
                    <span className="font-medium">{pkg.discount}%</span>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => {
                  setSelectedPackage(pkg);
                  setShowPurchaseModal(true);
                }}
                className="w-full"
              >
                Select Package
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Transaction History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Transaction History</h3>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-2 font-medium">Date</th>
                <th className="text-left p-2 font-medium">Type</th>
                <th className="text-left p-2 font-medium">Description</th>
                <th className="text-left p-2 font-medium">Credits</th>
                <th className="text-left p-2 font-medium">Amount</th>
                <th className="text-left p-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-[var(--color-border)]">
                  <td className="p-2">
                    {txn.timestamp.toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <div className={`flex items-center space-x-1 ${getTransactionColor(txn.type)}`}>
                      {getTransactionIcon(txn.type)}
                      <span className="capitalize">{txn.type}</span>
                    </div>
                  </td>
                  <td className="p-2">{txn.description}</td>
                  <td className="p-2 font-medium">{txn.credits}</td>
                  <td className="p-2 font-medium">
                    {formatCurrency(txn.amount, creditBalance.currency)}
                  </td>
                  <td className="p-2">
                    <Badge 
                      variant={txn.status === 'completed' ? 'success' : txn.status === 'pending' ? 'warning' : 'error'}
                      size="sm"
                    >
                      {txn.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Purchase Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Purchase Credits"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Select a credit package to purchase. Credits will be added to your account immediately after payment.
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            {creditPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPackage?.id === pkg.id 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[var(--color-text)]">{pkg.name}</h4>
                    <p className="text-sm text-gray-600">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(pkg.price, pkg.currency)}</p>
                    <p className="text-sm text-gray-600">{pkg.credits.toLocaleString()} credits</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPurchaseModal(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedPackage && handlePurchaseCredits(selectedPackage.id)}
              disabled={!selectedPackage || loading}
              loading={loading}
            >
              Purchase Credits
            </Button>
          </div>
        </div>
      </Modal>

      {/* Usage Details Modal */}
      <Modal
        isOpen={showUsageModal}
        onClose={() => setShowUsageModal(false)}
        title="Credit Usage Details"
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-center">
                <h4 className="font-semibold text-[var(--color-text)]">Total Credits Used</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {usageStats?.totalCreditsUsed.toLocaleString()}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <h4 className="font-semibold text-[var(--color-text)]">Total Messages</h4>
                <p className="text-2xl font-bold text-green-600">
                  {usageStats?.totalMessagesSent.toLocaleString()}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <h4 className="font-semibold text-[var(--color-text)]">Avg. Cost/Message</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(usageStats?.averageCostPerMessage || 0, creditBalance.currency)}
                </p>
              </div>
            </Card>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left p-2 font-medium">Date</th>
                  <th className="text-left p-2 font-medium">Messages Sent</th>
                  <th className="text-left p-2 font-medium">Credits Used</th>
                  <th className="text-left p-2 font-medium">Cost Per Message</th>
                  <th className="text-left p-2 font-medium">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {(usagePeriod === 'daily' ? usageStats?.dailyUsage : usageStats?.monthlyUsage)?.map((usage) => (
                  <tr key={usage.id} className="border-b border-[var(--color-border)]">
                    <td className="p-2">
                      {usage.date.toLocaleDateString()}
                    </td>
                    <td className="p-2">{usage.messagesSent}</td>
                    <td className="p-2">{usage.creditsUsed}</td>
                    <td className="p-2">
                      {formatCurrency(usage.costPerMessage, creditBalance.currency)}
                    </td>
                    <td className="p-2 font-medium">
                      {formatCurrency(usage.totalCost, creditBalance.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 