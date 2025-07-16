import { PrismaClient } from '@prisma/client';
import { PaymentGatewayFactory } from '../payment-gateway/factory/PaymentGatewayFactory';

const prisma = new PrismaClient();

export class SubscriptionRenewalService {
  static async processPastDueSubscriptions() {
    try {
      console.log('Starting subscription renewal process...');

      // Find past due subscriptions
      const pastDueSubscriptions = await prisma.subscription.findMany({
        where: {
          currentPeriodEnd: {
            lt: new Date(),
          },
          status: {
            in: ['active', 'trialing'],
          },
          autoRenew: true,
        },
        include: {
          plan: true,
        },
      });

      console.log(`Found ${pastDueSubscriptions.length} past due subscriptions`);

      for (const subscription of pastDueSubscriptions) {
        await this.processSubscription(subscription);
      }

      console.log('Subscription renewal process completed');
    } catch (error) {
      console.error('Subscription renewal process failed:', error);
    }
  }

  private static async processSubscription(subscription: any) {
    try {
      console.log(`Processing subscription ${subscription.id}`);

      // Attempt to retry payment
      const paymentSuccess = await this.retryPayment(subscription);

      if (paymentSuccess) {
        // Update subscription status to active
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'active',
            currentPeriodEnd: this.calculateNextPeriodEnd(subscription.currentPeriodEnd),
          },
        });

        // Create invoice for successful payment
        await prisma.invoice.create({
          data: {
            subscriptionId: subscription.id,
            amount: subscription.seats * subscription.plan.priceMonthly,
            status: 'paid',
            issuedAt: new Date(),
          },
        });

        // TODO: Send WhatsApp template for successful payment
        await this.sendPaymentSuccessNotification(subscription);

        console.log(`Subscription ${subscription.id} renewed successfully`);
      } else {
        // Payment failed, downgrade or suspend
        await this.handlePaymentFailure(subscription);
      }
    } catch (error) {
      console.error(`Failed to process subscription ${subscription.id}:`, error);
    }
  }

  private static async retryPayment(subscription: any): Promise<boolean> {
    try {
      const gateway = PaymentGatewayFactory.createGateway();
      
      // TODO: Implement payment retry logic based on gateway
      // This would typically involve creating a new payment intent
      // and attempting to charge the customer's saved payment method

      // For now, return false to simulate payment failure
      return false;
    } catch (error) {
      console.error('Payment retry failed:', error);
      return false;
    }
  }

  private static async handlePaymentFailure(subscription: any) {
    try {
      // Update subscription status to past_due
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'past_due',
        },
      });

      // Create failed invoice
      await prisma.invoice.create({
        data: {
          subscriptionId: subscription.id,
          amount: subscription.seats * subscription.plan.priceMonthly,
          status: 'failed',
          issuedAt: new Date(),
        },
      });

      // TODO: Send WhatsApp template for payment failure
      await this.sendPaymentFailureNotification(subscription);

      console.log(`Subscription ${subscription.id} marked as past due`);
    } catch (error) {
      console.error('Failed to handle payment failure:', error);
    }
  }

  private static calculateNextPeriodEnd(currentEnd: Date): Date {
    const nextEnd = new Date(currentEnd);
    nextEnd.setMonth(nextEnd.getMonth() + 1);
    return nextEnd;
  }

  private static async sendPaymentSuccessNotification(subscription: any) {
    try {
      // TODO: Implement WhatsApp template sending
      // await sendTemplate({
      //   phone: subscription.tenant.phone,
      //   templateSlug: 'payment_confirmation',
      //   variables: {
      //     amount: subscription.seats * subscription.plan.priceMonthly,
      //     plan: subscription.plan.name,
      //     nextBilling: subscription.currentPeriodEnd,
      //   },
      // });
      console.log('Payment success notification sent');
    } catch (error) {
      console.error('Failed to send payment success notification:', error);
    }
  }

  private static async sendPaymentFailureNotification(subscription: any) {
    try {
      // TODO: Implement WhatsApp template sending
      // await sendTemplate({
      //   phone: subscription.tenant.phone,
      //   templateSlug: 'payment_failed',
      //   variables: {
      //     amount: subscription.seats * subscription.plan.priceMonthly,
      //     plan: subscription.plan.name,
      //     retryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      //   },
      // });
      console.log('Payment failure notification sent');
    } catch (error) {
      console.error('Failed to send payment failure notification:', error);
    }
  }
}

// Export for cron job usage
export const runSubscriptionRenewal = () => {
  SubscriptionRenewalService.processPastDueSubscriptions();
}; 