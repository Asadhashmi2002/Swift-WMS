import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PaymentGatewayFactory } from '../payment-gateway/factory/PaymentGatewayFactory';
import { CheckoutSessionData } from '../payment-gateway/interfaces/ICheckoutProxy';

const prisma = new PrismaClient();

export class PaymentController {
  // GET /plans - List all available plans
  static async getPlans(req: Request, res: Response) {
    try {
      const plans = await prisma.plan.findMany({
        orderBy: { priceMonthly: 'asc' },
      });
      
      res.json({ success: true, data: plans });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch plans' });
    }
  }

  // POST /checkout/session - Create checkout session
  static async createCheckoutSession(req: Request, res: Response) {
    try {
      const { planId, seats, tenantId } = req.body;

      if (!planId || !seats || !tenantId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: planId, seats, tenantId' 
        });
      }

      // Verify plan exists
      const plan = await prisma.plan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        return res.status(404).json({ 
          success: false, 
          error: 'Plan not found' 
        });
      }

      // Check seat limit
      if (seats > plan.seatLimit) {
        return res.status(400).json({ 
          success: false, 
          error: `Seats exceed plan limit of ${plan.seatLimit}` 
        });
      }

      const gateway = PaymentGatewayFactory.createGateway();
      
      const checkoutData: CheckoutSessionData = {
        planId,
        seats,
        tenantId,
        successUrl: `${process.env.FRONTEND_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${process.env.FRONTEND_URL}/payments/cancel`,
      };

      const session = await gateway.createCheckout(checkoutData);

      res.json({ success: true, data: session });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create checkout session' });
    }
  }

  // POST /webhooks/stripe - Handle Stripe webhooks
  static async handleStripeWebhook(req: Request, res: Response) {
    try {
      const gateway = PaymentGatewayFactory.createGateway();
      const signature = req.headers['stripe-signature'] as string;
      const payload = JSON.stringify(req.body);

      if (!gateway.verifySignature(payload, signature)) {
        return res.status(400).json({ success: false, error: 'Invalid signature' });
      }

      await gateway.handleWebhook({
        type: req.body.type,
        data: req.body.data.object,
        signature,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Webhook processing failed' });
    }
  }

  // POST /webhooks/razorpay - Handle Razorpay webhooks
  static async handleRazorpayWebhook(req: Request, res: Response) {
    try {
      const gateway = PaymentGatewayFactory.createGateway();
      const signature = req.headers['x-razorpay-signature'] as string;
      const payload = JSON.stringify(req.body);

      if (!gateway.verifySignature(payload, signature)) {
        return res.status(400).json({ success: false, error: 'Invalid signature' });
      }

      await gateway.handleWebhook({
        type: req.body.event,
        data: req.body.payload,
        signature,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Webhook processing failed' });
    }
  }

  // PATCH /subscriptions/:id - Update subscription
  static async updateSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { seats, autoRenew } = req.body;

      const updateData: any = {};
      if (seats !== undefined) updateData.seats = seats;
      if (autoRenew !== undefined) updateData.autoRenew = autoRenew;

      const subscription = await prisma.subscription.update({
        where: { id },
        data: updateData,
        include: { plan: true },
      });

      res.json({ success: true, data: subscription });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update subscription' });
    }
  }

  // GET /subscriptions/:id - Get subscription details
  static async getSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const subscription = await prisma.subscription.findUnique({
        where: { id },
        include: { 
          plan: true,
          invoices: {
            orderBy: { issuedAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!subscription) {
        return res.status(404).json({ success: false, error: 'Subscription not found' });
      }

      res.json({ success: true, data: subscription });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch subscription' });
    }
  }

  // POST /subscriptions/activate - Activate subscription after payment
  static async activateSubscription(req: Request, res: Response) {
    try {
      const { sessionId } = req.body;

      // TODO: Verify session and activate subscription
      // This would typically involve checking the payment gateway
      // and updating the subscription status

      res.json({ success: true, message: 'Subscription activated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to activate subscription' });
    }
  }
} 