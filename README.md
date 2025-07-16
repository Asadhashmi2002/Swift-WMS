# SwiftAMS - WhatsApp API On-Boarding Wizard

A comprehensive WhatsApp Business API setup wizard built with React 18, TypeScript, and modern web technologies. This wizard guides users through the complete process of connecting their WhatsApp Business account to the Meta Graph API.

## 🚀 Features

### Core Wizard Flow
- **6-Step Setup Process**: Streamlined onboarding from Facebook login to API credentials
- **Facebook OAuth Integration**: Secure authentication with Facebook Business accounts
- **Business Account Management**: Create or select existing Business Manager accounts
- **Document Verification**: Upload and verify business documents
- **WABA Creation**: Set up WhatsApp Business Accounts
- **Phone Number Verification**: Add and verify phone numbers with SMS/Voice codes
- **API Configuration**: Generate and configure API credentials and webhooks

### Technical Features
- **React Query Integration**: Efficient data fetching and caching
- **Mock Service Worker**: Complete API simulation for development
- **Session Persistence**: Resume wizard progress after page reload
- **Form Validation**: Comprehensive input validation with error handling
- **Responsive Design**: Mobile-first approach with tablet and desktop support
- **Accessibility**: WCAG-AA compliant with proper contrast ratios

### Design System
- **SwiftAMS Brand Colors**: Primary #003CFF, Accent #FA0082, Gray #D2D1D4, Text #1E1E1E
- **Typography**: Poppins for headings (700/500 weights), Inter for body (400 weight)
- **Consistent Spacing**: 8px grid system throughout
- **Modern UI**: 12px border radius, medium shadows, smooth transitions

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3 with custom design system
- **State Management**: Zustand for wizard state
- **Data Fetching**: React Query (TanStack Query)
- **API Mocking**: Mock Service Worker (MSW)
- **Form Validation**: Yup schema validation
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📦 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# Meta Graph API Configuration (replace with real endpoints)
VITE_META_API_BASE_URL=https://graph.facebook.com/v18.0
VITE_FACEBOOK_APP_ID=your_facebook_app_id

# SwiftAMS Backend Configuration
VITE_SWIFTAMS_API_URL=https://api.swiftams.com/v1
VITE_WEBHOOK_BASE_URL=https://api.swiftams.com/webhook

# Feature Flags
VITE_ENABLE_MOCK_MODE=true
VITE_ENABLE_ANALYTICS=true
```

## 🏗 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── wizard/          # Wizard-specific components
│   │   ├── steps/       # Individual wizard steps
│   │   └── WizardLayout.tsx
│   └── LandingCard.tsx  # Landing page component
├── stores/              # Zustand state management
│   └── wizardStore.ts   # Wizard state and persistence
├── hooks/               # Custom React hooks
│   └── useMetaQuery.ts  # React Query hooks for Meta API
├── lib/                 # Utilities and configurations
│   ├── mockApi.ts       # MSW mock API handlers
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🔄 Wizard Flow

### Step 1: Facebook Login
- OAuth integration with Facebook
- Secure token storage
- User profile retrieval

### Step 2: Business Account Selection
- List existing Business Manager accounts
- Create new Business Manager if needed
- Business information collection (GST/PAN for Indian businesses)

### Step 3: Business Verification
- Document upload interface
- Verification status tracking
- Support for multiple document types (PDF, JPG, PNG)

### Step 4: WhatsApp Business Account
- List existing WABAs
- Create new WABA with custom naming
- Account status monitoring

### Step 5: Phone Number Management
- International phone number input
- SMS/Voice verification code delivery
- Real-time verification status updates

### Step 6: API Credentials & Webhook
- Auto-generated API credentials
- Webhook URL configuration
- Copy-to-clipboard functionality
- Webhook subscription setup

### Finish Screen
- Success confirmation with confetti animation
- Quick actions (Create Template, Invite Team)
- Next steps guidance
- Direct link to main dashboard

## 🔌 API Integration

### Mock API Endpoints
The application uses MSW to mock Meta Graph API endpoints:

```typescript
// Business Managers
GET /mock/graph/me/businesses
POST /mock/graph/business_managers

// WhatsApp Business Accounts
GET /mock/graph/{businessId}/whatsapp_business_accounts
POST /mock/graph/{businessId}/whatsapp_business_accounts

// Phone Numbers
GET /mock/graph/{wabaId}/phone_numbers
POST /mock/graph/{wabaId}/phone_numbers
POST /mock/graph/{phoneId}/request_code
POST /mock/graph/{phoneId}/verify_code

// Webhooks
POST /mock/graph/{wabaId}/subscribed_apps

// Templates
GET /mock/graph/{wabaId}/message_templates
POST /mock/graph/{wabaId}/message_templates
```

### Replacing Mock APIs with Real Endpoints

To integrate with real Meta Graph API:

1. **Update API Base URL**:
   ```typescript
   // In src/hooks/useMetaQuery.ts
   const API_BASE = 'https://graph.facebook.com/v18.0';
   ```

2. **Add Authentication Headers**:
   ```typescript
   const headers = {
     'Authorization': `Bearer ${accessToken}`,
     'Content-Type': 'application/json',
   };
   ```

3. **Remove MSW Worker**:
   ```typescript
   // Remove or comment out in src/App.tsx
   // worker.start();
   ```

4. **Update Environment Variables**:
   ```env
   VITE_META_API_BASE_URL=https://graph.facebook.com/v18.0
   VITE_FACEBOOK_APP_ID=your_actual_app_id
   ```

## 🎨 Design Guidelines

### Color Palette
- **Primary**: #003CFF (buttons, links, active states)
- **Accent**: #FA0082 (highlights, badges, CTAs)
- **Gray**: #D2D1D4 (cards, borders, disabled states)
- **Text**: #1E1E1E (primary text color)

### Typography Scale
- **Headings**: Poppins font family
  - H1, H2: 700 weight
  - H3, H4: 600 weight
  - H5, H6: 500 weight
- **Body**: Inter font family, 400 weight
- **Line Height**: 150% for body text, 120% for headings

### Spacing System
- Based on 8px grid system
- Consistent spacing: 8px, 16px, 24px, 32px, 40px, 48px
- Component padding: 24px default, 16px for compact components

### Component Standards
- **Border Radius**: 12px for cards and major components
- **Shadows**: Medium shadow with subtle opacity
- **Transitions**: 200ms ease-in-out for hover states
- **Focus States**: 2px solid primary color outline

## 🧪 Testing

### Manual Testing Checklist
- [ ] Complete wizard flow from start to finish
- [ ] Form validation on all input fields
- [ ] Error handling for API failures
- [ ] Session persistence across page reloads
- [ ] Responsive design on mobile, tablet, desktop
- [ ] Accessibility with keyboard navigation
- [ ] Copy-to-clipboard functionality
- [ ] File upload interface

### Automated Testing (Future Enhancement)
```bash
# Unit tests with Jest + React Testing Library
npm run test

# E2E tests with Cypress
npm run test:e2e

# Accessibility tests
npm run test:a11y
```

## 🚀 Deployment

### Build Optimization
```bash
# Production build with optimizations
npm run build

# Analyze bundle size
npm run build -- --analyze
```

### Deployment Targets
- **Netlify** (recommended for static hosting)
- **Vercel** (with automatic deployments)
- **AWS S3 + CloudFront** (for enterprise)
- **Self-hosted** with nginx

### Performance Targets
- **Lighthouse Score**: ≥90 for all metrics
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Bundle Size**: <500KB gzipped

## 🔒 Security Considerations

### Data Protection
- Secure token storage in memory (not localStorage)
- HTTPS-only cookie configuration
- Input sanitization and validation
- XSS protection with Content Security Policy

### API Security
- OAuth 2.0 flow implementation
- Token refresh mechanism
- Rate limiting considerations
- Webhook signature verification

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Ensure all tests pass: `npm run test`
6. Submit a pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic code formatting
- **Commit Messages**: Conventional commits format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@swiftams.com
- **Documentation**: [docs.swiftams.com](https://docs.swiftams.com)
- **Issues**: Create a GitHub issue with detailed reproduction steps

## 🗺 Roadmap

### Version 2.0
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Advanced template editor
- [ ] Bulk phone number import
- [ ] Integration with CRM systems

### Version 3.0
- [ ] AI-powered setup recommendations
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant support
- [ ] API rate limiting dashboard
- [ ] Advanced webhook management

---

Built with ❤️ by the SwiftAMS Team

**Ready to connect your WhatsApp Business API in minutes, not hours!**