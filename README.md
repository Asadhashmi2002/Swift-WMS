# WhatsApp Management System (WMS)

A comprehensive WhatsApp Business API management system with integrated Payments & Auto-Billing functionality.

## 🚀 Features

### Core Features
- WhatsApp Business API integration
- Real-time messaging and chat management
- Message templates and broadcasting
- Analytics dashboard
- User management and permissions

### Payments & Auto-Billing Module
- **Multi-Gateway Support**: Stripe (primary) + Razorpay (fallback)
- **Subscription Management**: Plan-based billing with seat limits
- **Auto-Renewal**: Automated subscription renewal with retry logic
- **Invoice Management**: PDF generation and download
- **WhatsApp Notifications**: Payment confirmations and failure alerts
- **Admin Dashboard**: Complete billing management interface

## 🛠 Tech Stack

### Backend
- **Database**: PostgreSQL with Prisma ORM
- **Payment Gateways**: Stripe + Razorpay
- **Caching**: Redis
- **Cron Jobs**: Automated subscription renewal

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: React Query

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/whatsapp-management-system.git
   cd whatsapp-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/wms"
   
   # Payment Gateway (stripe or razorpay)
   PAYMENT_GW="stripe"
   
   # Stripe Configuration
   STRIPE_SECRET="sk_test_your_stripe_secret_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"
   
   # Razorpay Configuration
   RZP_KEY_ID="rzp_test_your_razorpay_key_id"
   RZP_KEY_SECRET="your_razorpay_key_secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── CheckoutModal.tsx   # Payment checkout modal
│   └── ...
├── pages/
│   ├── payments/
│   │   ├── PricingPage.tsx # Plan selection page
│   │   └── Success.tsx     # Payment success page
│   └── admin/billing/
│       └── BillingDashboard.tsx # Admin billing management
├── hooks/
│   └── useBilling.ts       # Billing API hooks
├── payment-gateway/        # Payment gateway abstraction
│   ├── interfaces/
│   ├── proxies/
│   └── factory/
├── controllers/            # API controllers
├── cron/                   # Automated tasks
└── ...
```

## 💳 Payment Integration

### Supported Gateways

#### Stripe (Primary)
- Credit card processing
- Subscription management
- Webhook handling
- Invoice generation

#### Razorpay (Fallback)
- Indian payment methods
- UPI, cards, net banking
- Subscription support
- Webhook integration

### Configuration

Switch between payment gateways using the `PAYMENT_GW` environment variable:

```env
PAYMENT_GW="stripe"    # Use Stripe
PAYMENT_GW="razorpay"  # Use Razorpay
```

## 📊 Subscription Plans

### Starter Plan
- **Price**: $29/month per seat
- **Seats**: Up to 5 users
- **Features**: Basic WhatsApp API, 1,000 messages/month

### Growth Plan
- **Price**: $99/month per seat
- **Seats**: Up to 25 users
- **Features**: Advanced analytics, 10,000 messages/month

### Enterprise Plan
- **Price**: $299/month per seat
- **Seats**: Up to 100 users
- **Features**: Unlimited messages, custom integrations

## 🔄 Auto-Billing Features

### Subscription Renewal
- Daily cron job checks for past-due subscriptions
- Automatic payment retry with configurable attempts
- Grace period handling before suspension

### Payment Failure Handling
- Automatic downgrade or suspension
- WhatsApp notification alerts
- Admin dashboard for manual intervention

### Invoice Management
- Automatic PDF generation
- Download links for customers
- Payment status tracking

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Payment Gateway Tests
```bash
npm run test:payments
```

## 🚀 Deployment

### Prerequisites
- PostgreSQL database
- Redis for caching
- Payment gateway accounts (Stripe/Razorpay)

### Environment Setup
1. Set production environment variables
2. Configure webhook endpoints
3. Set up SSL certificates
4. Configure database connections

### Build & Deploy
```bash
npm run build
npm start
```

## 📝 API Endpoints

### Plans
- `GET /plans` - List available plans

### Checkout
- `POST /checkout/session` - Create payment session

### Subscriptions
- `GET /subscriptions/:id` - Get subscription details
- `PATCH /subscriptions/:id` - Update subscription
- `POST /subscriptions/activate` - Activate subscription

### Webhooks
- `POST /webhooks/stripe` - Stripe webhook handler
- `POST /webhooks/razorpay` - Razorpay webhook handler

## 🔧 Development

### Adding New Payment Gateways

1. Implement `ICheckoutProxy` interface
2. Add gateway to `PaymentGatewayFactory`
3. Update environment configuration
4. Add webhook handlers

### Customizing Plans

1. Update `prisma/seed.ts` with new plans
2. Modify `PricingPage.tsx` for UI changes
3. Update billing logic in controllers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@swiftams.com

## 🔐 Security

- All payment data is encrypted
- Webhook signatures are verified
- Environment variables for sensitive data
- Regular security updates

---

**Built with ❤️ by the SwiftAMS Team**