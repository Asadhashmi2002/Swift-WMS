import { useState } from 'react';

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  seatLimit: number;
}

interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: string;
  seats: number;
  gateway: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  plan: Plan;
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

interface CheckoutData {
  planId: string;
  seats: number;
  tenantId: string;
}

interface CheckoutResponse {
  id: string;
  url: string;
  gateway: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const useBilling = () => {
  const [loading, setLoading] = useState(false);

  const getPlans = async (): Promise<ApiResponse<Plan[]>> => {
    try {
      const response = await fetch(`${API_BASE}/plans`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch plans');
    }
  };

  const createCheckout = async (checkoutData: CheckoutData): Promise<ApiResponse<CheckoutResponse>> => {
    try {
      const response = await fetch(`${API_BASE}/checkout/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to create checkout session');
    }
  };

  const getSubscription = async (id: string): Promise<ApiResponse<Subscription>> => {
    try {
      const response = await fetch(`${API_BASE}/subscriptions/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch subscription');
    }
  };

  const updateSubscription = async (
    id: string, 
    updates: { seats?: number; autoRenew?: boolean }
  ): Promise<ApiResponse<Subscription>> => {
    try {
      const response = await fetch(`${API_BASE}/subscriptions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to update subscription');
    }
  };

  const activateSubscription = async (sessionId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE}/subscriptions/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to activate subscription');
    }
  };

  return {
    getPlans,
    createCheckout,
    getSubscription,
    updateSubscription,
    activateSubscription,
    loading,
  };
}; 