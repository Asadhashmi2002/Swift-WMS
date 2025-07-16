import Razorpay from 'razorpay';
import { ICheckoutProxy, CheckoutSessionData, CheckoutSession, WebhookEvent } from '../interfaces/ICheckoutProxy';
import crypto from 'crypto';

export class RazorpayProxy implements ICheckoutProxy {
  private razorpay: Razorpay;

  constructor() {
    // TODO: Add RZP_KEY_ID and RZP_KEY_SECRET to environment variables
    this.razorpay = new Razorpay({
      key_id: process.env.RZP_KEY_ID || 'rzp_test_placeholder',
      key_secret: process.env.RZP_KEY_SECRET || 'secret_placeholder',
    });
  }

  async createCheckout(data: CheckoutSessionData): Promise<CheckoutSession> {
    try {
      const order = await this.razorpay.orders.create({
        amount: data.seats * 1000, // TODO: Get actual price from plan
        currency: 'INR',
        receipt: `plan_${data.planId}_${Date.now()}`,
        notes: {
          planId: data.planId,
          seats: data.seats.toString(),
          tenantId: data.tenantId,
        },
      });

      const paymentLink = await this.razorpay.paymentLink.create({
        reference_id: order.id,
        amount: order.amount,
        currency: order.currency,
        description: `Plan ${data.planId} - ${data.seats} seats`,
        callback_url: data.successUrl,
        callback_method: 'get',
      });

      return {
        id: order.id,
        url: paymentLink.short_url,
        gateway: 'razorpay',
      };
    } catch (error) {
      throw new Error(`Razorpay checkout creation failed: ${error}`);
    }
  }

  async handleWebhook(event: WebhookEvent): Promise<void> {
    try {
      switch (event.type) {
        case 'payment.captured':
          await this.handlePaymentCaptured(event.data);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(event.data);
          break;
        case 'subscription.activated':
          await this.handleSubscriptionActivated(event.data);
          break;
        case 'subscription.charged':
          await this.handleSubscriptionCharged(event.data);
          break;
        default:
          console.log(`Unhandled Razorpay webhook event: ${event.type}`);
      }
    } catch (error) {
      throw new Error(`Razorpay webhook handling failed: ${error}`);
    }
  }

  verifySignature(payload: string, signature: string): boolean {
    try {
      // TODO: Add RZP_WEBHOOK_SECRET to environment variables
      const webhookSecret = process.env.RZP_WEBHOOK_SECRET || 'webhook_secret_placeholder';
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Razorpay signature verification failed:', error);
      return false;
    }
  }

  private async handlePaymentCaptured(payment: any): Promise<void> {
    // TODO: Implement payment captured logic
    console.log('Razorpay payment captured:', payment.id);
  }

  private async handlePaymentFailed(payment: any): Promise<void> {
    // TODO: Implement payment failure logic
    console.log('Razorpay payment failed:', payment.id);
  }

  private async handleSubscriptionActivated(subscription: any): Promise<void> {
    // TODO: Implement subscription activation logic
    console.log('Razorpay subscription activated:', subscription.id);
  }

  private async handleSubscriptionCharged(subscription: any): Promise<void> {
    // TODO: Implement subscription charged logic
    console.log('Razorpay subscription charged:', subscription.id);
  }
} 