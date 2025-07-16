import { ICheckoutProxy } from '../interfaces/ICheckoutProxy';
import { StripeProxy } from '../proxies/StripeProxy';
import { RazorpayProxy } from '../proxies/RazorpayProxy';

export class PaymentGatewayFactory {
  static createGateway(): ICheckoutProxy {
    const gateway = process.env.PAYMENT_GW || 'stripe';
    
    switch (gateway.toLowerCase()) {
      case 'razorpay':
        return new RazorpayProxy();
      case 'stripe':
      default:
        return new StripeProxy();
    }
  }
} 