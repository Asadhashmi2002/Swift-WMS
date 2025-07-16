import React, { useState } from 'react';
import { Mail, Phone, Lock, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAuthStore } from '../../stores/authStore';

type LoginMethod = 'email' | 'phone' | 'otp';

export const LoginForm: React.FC = () => {
  const [method, setMethod] = useState<LoginMethod>('email');
  const [credentials, setCredentials] = useState({
    email: '',
    phone: '',
    password: '',
    otp: '',
  });
  const [otpStep, setOtpStep] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, sendOtp, verifyOtp, isTwoFactorEnabled, setTwoFactorEnabled, loading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (method === 'otp') {
        if (!otpStep) {
          await sendOtp(credentials.phone);
          setOtpStep(true);
          return;
        }
        
        const isValid = await verifyOtp(credentials.phone, credentials.otp);
        if (!isValid) {
          setErrors({ otp: 'Invalid OTP' });
          return;
        }
      }

      const loginData = method === 'email' 
        ? { email: credentials.email, password: credentials.password }
        : method === 'phone'
        ? { phone: credentials.phone, password: credentials.password }
        : { phone: credentials.phone, otp: credentials.otp };

      if (isTwoFactorEnabled && method !== 'otp') {
        if (!credentials.otp) {
          setErrors({ otp: 'Two-factor authentication code required' });
          return;
        }
        (loginData as any).otp = credentials.otp;
      }

      await login(loginData);
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials.' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Welcome to SwiftAMS</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {/* Method Tabs */}
        <div className="flex rounded-xl bg-[var(--color-gray)] p-1 mb-6">
          {[
            { id: 'email', icon: Mail, label: 'Email' },
            { id: 'phone', icon: Phone, label: 'Phone' },
            { id: 'otp', icon: Shield, label: 'OTP' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setMethod(id as LoginMethod);
                setOtpStep(false);
                setErrors({});
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                method === id
                  ? 'bg-[var(--color-background)] text-[var(--color-text)] shadow-sm'
                  : 'text-gray-500 hover:text-[var(--color-text)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {method === 'email' && (
            <Input
              type="email"
              label="Email"
              value={credentials.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
            />
          )}

          {(method === 'phone' || method === 'otp') && (
            <Input
              type="tel"
              label="Phone Number"
              value={credentials.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              placeholder="+1234567890"
              required
            />
          )}

          {method !== 'otp' && (
            <Input
              type="password"
              label="Password"
              value={credentials.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              required
            />
          )}

          {(method === 'otp' && otpStep) && (
            <Input
              type="text"
              label="OTP Code"
              value={credentials.otp}
              onChange={(e) => handleInputChange('otp', e.target.value)}
              error={errors.otp}
              placeholder="123456"
              maxLength={6}
              required
            />
          )}

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isTwoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-[var(--color-text)]">
                Enable Two-Step Auth
              </span>
            </label>
          </div>

          {isTwoFactorEnabled && method !== 'otp' && (
            <Input
              type="text"
              label="Two-Factor Code"
              value={credentials.otp}
              onChange={(e) => handleInputChange('otp', e.target.value)}
              error={errors.otp}
              placeholder="123456"
              maxLength={6}
            />
          )}

          {errors.general && (
            <div className="text-red-500 text-sm text-center">
              {errors.general}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            {method === 'otp' && !otpStep
              ? 'Send OTP'
              : method === 'otp' && otpStep
              ? 'Verify OTP'
              : 'Sign In'
            }
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Demo credentials: admin@swiftams.com / password
        </div>
      </Card>
    </div>
  );
};