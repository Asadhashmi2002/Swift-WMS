import React, { useState } from 'react';
import { Settings as SettingsIcon, Palette, Shield, Bell, CreditCard, Users, Calendar, Plus, Edit, Download, Settings, Trash2, X, AlertCircle, Minus } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { Badge } from '../../ui/Badge';
import { UserManagement } from './UserManagement';
import { useTheme } from '../../layout/ThemeProvider';
import { themes } from '../../../lib/themes';
import toast from 'react-hot-toast';

type SettingsSection = 'users' | 'theme' | 'security' | 'notifications' | 'payments';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard';
  last4: string;
  isDefault: boolean;
  expiryMonth: string;
  expiryYear: string;
}

export const SettingsTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('users');
  const { theme, setTheme } = useTheme();
  
  // Payment module state
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showUpdateSeatsModal, setShowUpdateSeatsModal] = useState(false);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showBillingHistoryModal, setShowBillingHistoryModal] = useState(false);
  const [currentSeats, setCurrentSeats] = useState(10);
  const [autoRenew, setAutoRenew] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { id: '1', type: 'visa', last4: '4242', isDefault: true, expiryMonth: '12', expiryYear: '2025' },
    { id: '2', type: 'mastercard', last4: '8888', isDefault: false, expiryMonth: '08', expiryYear: '2026' },
  ];

  const plans = [
    { id: 'starter', name: 'Starter', price: 29, seats: 5, current: false },
    { id: 'growth', name: 'Growth', price: 99, seats: 25, current: true },
    { id: 'enterprise', name: 'Enterprise', price: 299, seats: 100, current: false },
  ];

  const invoices = [
    { id: 'INV-2024-001', date: 'Nov 15, 2024', amount: 990.00, status: 'paid' },
    { id: 'INV-2024-002', date: 'Oct 15, 2024', amount: 990.00, status: 'paid' },
    { id: 'INV-2024-003', date: 'Sep 15, 2024', amount: 990.00, status: 'paid' },
  ];

  const handleAddPaymentMethod = async (formData: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Payment method added successfully!');
      setShowAddPaymentModal(false);
    } catch (error) {
      toast.error('Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeats = async (newSeats: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentSeats(newSeats);
      toast.success(`Seats updated to ${newSeats}`);
      setShowUpdateSeatsModal(false);
    } catch (error) {
      toast.error('Failed to update seats');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = async (planId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Plan changed successfully!');
      setShowChangePlanModal(false);
    } catch (error) {
      toast.error('Failed to change plan');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Subscription cancelled successfully');
      setShowCancelModal(false);
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}...`);
    // Simulate download
    setTimeout(() => {
      toast.success('Invoice downloaded successfully!');
    }, 2000);
  };

  const handleToggleAutoRenew = () => {
    setAutoRenew(!autoRenew);
    toast.success(`Auto-renewal ${!autoRenew ? 'enabled' : 'disabled'}`);
  };

  const handleToggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
    toast.success(`Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`);
  };

  const sections = [
    { id: 'users', icon: SettingsIcon, label: 'User Management' },
    { id: 'theme', icon: Palette, label: 'Theme Settings' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      
      case 'theme':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Theme Settings</h2>
            
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Choose Theme
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {Object.values(themes).map((themeOption) => (
                  <div
                    key={themeOption.name}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      theme.name === themeOption.name
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                    }`}
                    onClick={() => setTheme(themeOption)}
                  >
                    <div className="flex space-x-2 mb-3">
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: themeOption.colors.primary }}
                      />
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: themeOption.colors.accent }}
                      />
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: themeOption.colors.gray }}
                      />
                    </div>
                    <h4 className="font-medium text-[var(--color-text)]">
                      {themeOption.name}
                    </h4>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Security Settings</h2>
            
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Two-Factor Authentication
              </h3>
              <p className="text-gray-500 mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                API Keys
              </h3>
              <p className="text-gray-500 mb-4">
                Manage API keys for external integrations
              </p>
              <Button variant="outline">Generate New Key</Button>
            </Card>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Notification Settings</h2>
            
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Email Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-[var(--color-text)]">New message alerts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-[var(--color-text)]">Broadcast reports</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-[var(--color-text)]">Weekly analytics</span>
                </label>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Push Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-[var(--color-text)]">Urgent messages</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-[var(--color-text)]">Assignment notifications</span>
                </label>
              </div>
            </Card>
          </div>
        );
      
      case 'payments':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Payments & Billing</h2>
            
            {/* Current Plan Card */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Current Plan</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-[var(--color-text)]">Growth Plan</h4>
                  <p className="text-sm text-gray-600">$99/month per seat</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-[var(--color-text)]">{currentSeats} Seats</h4>
                  <p className="text-sm text-gray-600">of 25 available</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-[var(--color-text)]">Next Billing</h4>
                  <p className="text-sm text-gray-600">Dec 15, 2024</p>
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Payment Methods</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddPaymentModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        method.type === 'visa' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <CreditCard className={`h-5 w-5 ${
                          method.type === 'visa' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text)]">•••• •••• •••• {method.last4}</p>
                        <p className="text-sm text-gray-500">
                          {method.type === 'visa' ? 'Visa' : 'Mastercard'} ending in {method.last4}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && <Badge variant="success" size="sm">Default</Badge>}
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!method.isDefault && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Billing Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Billing Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Cost</span>
                    <span className="font-medium">${(currentSeats * 99).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">Stripe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto-Renew</span>
                    <span className="font-medium text-green-600">{autoRenew ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Invoice</span>
                    <span className="font-medium">Dec 15, 2024</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Billing
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowUpdateSeatsModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Seats
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadInvoice('latest')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowAddPaymentModal(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Update Payment Method
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowBillingHistoryModal(true)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    View Billing History
                  </Button>
                </div>
              </Card>
            </div>

            {/* Recent Invoices */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Recent Invoices</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowBillingHistoryModal(true)}
                >
                  View All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="text-left p-2 sm:p-3 font-medium text-[var(--color-text)]">Invoice</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-[var(--color-text)]">Date</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-[var(--color-text)]">Amount</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-[var(--color-text)]">Status</th>
                      <th className="text-right p-2 sm:p-3 font-medium text-[var(--color-text)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-[var(--color-border)]">
                        <td className="p-2 sm:p-3">
                          <div className="font-medium text-[var(--color-text)]">{invoice.id}</div>
                        </td>
                        <td className="p-2 sm:p-3 text-gray-600">{invoice.date}</td>
                        <td className="p-2 sm:p-3 font-medium">${invoice.amount.toFixed(2)}</td>
                        <td className="p-2 sm:p-3">
                          <Badge variant="success" size="sm">Paid</Badge>
                        </td>
                        <td className="p-2 sm:p-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Subscription Controls */}
            <Card>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Subscription Controls</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[var(--color-text)]">Auto-Renewal</h4>
                      <p className="text-sm text-gray-500">Automatically renew your subscription</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={autoRenew}
                        onChange={handleToggleAutoRenew}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[var(--color-text)]">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive billing notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={emailNotifications}
                        onChange={handleToggleEmailNotifications}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowChangePlanModal(true)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Change Plan
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowUpdateSeatsModal(true)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Seats
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={() => setShowCancelModal(true)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Settings Navigation - Horizontal on desktop, vertical on mobile */}
        <div className="border-b border-[var(--color-border)] p-4">
          <h2 className="font-semibold text-[var(--color-text)] mb-4 md:hidden">Settings</h2>
          <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SettingsSection)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors w-full md:w-auto ${
                    activeSection === section.id
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-gray)]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        {/* Settings Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
      {/* Modals remain unchanged, but ensure they use w-full and max-w-xs on mobile if needed */}

      {/* Add Payment Method Modal */}
      <Modal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        title="Add Payment Method"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleAddPaymentMethod({
            cardNumber: formData.get('cardNumber'),
            expiryMonth: formData.get('expiryMonth'),
            expiryYear: formData.get('expiryYear'),
            cvv: formData.get('cvv'),
          });
        }} className="space-y-4">
          <Input
            label="Card Number"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Month"
              name="expiryMonth"
              placeholder="MM"
              required
            />
            <Input
              label="Year"
              name="expiryYear"
              placeholder="YYYY"
              required
            />
            <Input
              label="CVV"
              name="cvv"
              placeholder="123"
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddPaymentModal(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              Add Payment Method
            </Button>
          </div>
        </form>
      </Modal>

      {/* Update Seats Modal */}
      <Modal
        isOpen={showUpdateSeatsModal}
        onClose={() => setShowUpdateSeatsModal(false)}
        title="Update Seats"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Number of Seats
            </label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSeats(Math.max(1, currentSeats - 1))}
                disabled={currentSeats <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={currentSeats}
                onChange={(e) => setCurrentSeats(parseInt(e.target.value) || 1)}
                min={1}
                max={25}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSeats(Math.min(25, currentSeats + 1))}
                disabled={currentSeats >= 25}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Maximum 25 seats for Growth plan
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                New monthly cost: ${(currentSeats * 99).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowUpdateSeatsModal(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleUpdateSeats(currentSeats)}
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              Update Seats
            </Button>
          </div>
        </div>
      </Modal>

      {/* Change Plan Modal */}
      <Modal
        isOpen={showChangePlanModal}
        onClose={() => setShowChangePlanModal(false)}
        title="Change Plan"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Select a new plan for your subscription:</p>
          <div className="grid gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  plan.current
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
                onClick={() => !plan.current && handleChangePlan(plan.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[var(--color-text)]">{plan.name}</h4>
                    <p className="text-sm text-gray-600">${plan.price}/month per seat</p>
                    <p className="text-sm text-gray-600">Up to {plan.seats} seats</p>
                  </div>
                  <div className="text-right">
                    {plan.current && <Badge variant="success">Current</Badge>}
                    <div className="text-lg font-bold text-[var(--color-text)]">
                      ${(currentSeats * plan.price).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowChangePlanModal(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Subscription Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Are you sure?</span>
            </div>
            <p className="text-red-700 mt-2">
              Cancelling your subscription will:
            </p>
            <ul className="text-red-700 mt-2 list-disc list-inside space-y-1">
              <li>Stop all billing immediately</li>
              <li>Limit access to premium features</li>
              <li>Delete your data after 30 days</li>
            </ul>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="flex-1"
              disabled={loading}
            >
              Keep Subscription
            </Button>
                         <Button
               variant="outline"
               onClick={handleCancelSubscription}
               loading={loading}
               disabled={loading}
               className="flex-1 text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
             >
               Cancel Subscription
             </Button>
          </div>
        </div>
      </Modal>

      {/* Billing History Modal */}
      <Modal
        isOpen={showBillingHistoryModal}
        onClose={() => setShowBillingHistoryModal(false)}
        title="Billing History"
        size="lg"
      >
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left p-2 sm:p-3 font-medium text-[var(--color-text)]">Invoice</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-[var(--color-text)]">Date</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-[var(--color-text)]">Amount</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-[var(--color-text)]">Status</th>
                  <th className="text-right p-2 sm:p-3 font-medium text-[var(--color-text)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-[var(--color-border)]">
                    <td className="p-2 sm:p-3">
                      <div className="font-medium text-[var(--color-text)]">{invoice.id}</div>
                    </td>
                    <td className="p-2 sm:p-3 text-gray-600">{invoice.date}</td>
                    <td className="p-2 sm:p-3 font-medium">${invoice.amount.toFixed(2)}</td>
                    <td className="p-2 sm:p-3">
                      <Badge variant="success" size="sm">Paid</Badge>
                    </td>
                    <td className="p-2 sm:p-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setShowBillingHistoryModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};