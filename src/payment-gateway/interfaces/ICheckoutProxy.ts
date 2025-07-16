export interface CheckoutSessionData {
  planId: string;
  seats: number;
  tenantId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
  gateway: string;
}

export interface WebhookEvent {
  type: string;
  data: any;
  signature?: string;
}

export interface ICheckoutProxy {
  createCheckout(data: CheckoutSessionData): Promise<CheckoutSession>;
  handleWebhook(event: WebhookEvent): Promise<void>;
  verifySignature(payload: string, signature: string): boolean;
} 