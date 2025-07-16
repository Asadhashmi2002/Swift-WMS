import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add this at the very top for demo Facebook login success and all wizard steps
const originalFetch = window.fetch;

// Store created businesses in memory for the session
const mockBusinesses = [
  {
    id: 'bm_123',
    name: 'Demo Business',
    gst: 'GST123',
    pan: 'PAN123',
    created_time: new Date().toISOString(),
    verification_status: 'verified',
  },
];

window.fetch = async (input, init) => {
  if (typeof input === 'string') {
    // Facebook OAuth
    if (input.includes('/mock/facebook/oauth')) {
      return Promise.resolve(new Response(JSON.stringify({
        access_token: 'mock_fb_access_token',
        user: { name: 'Demo User', id: 'fb_user_123' }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Business Managers (Step 2)
    if (input.includes('/mock/graph/business_managers')) {
      if (init && init.method === 'POST') {
        let body: any = {};
        if (typeof init.body === 'string') {
          try { body = JSON.parse(init.body); } catch { body = {}; }
        }
        const newBusiness = {
          id: 'bm_' + Date.now(),
          name: body.name,
          gst: body.gst || '',
          pan: body.pan || '',
          created_time: new Date().toISOString(),
          verification_status: 'verified',
        };
        mockBusinesses.push(newBusiness);
        return Promise.resolve(new Response(JSON.stringify(newBusiness), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      // Return all businesses
      return Promise.resolve(new Response(JSON.stringify({ data: mockBusinesses }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Also handle GET /mock/graph/me/businesses for business list
    if (input.includes('/mock/graph/me/businesses')) {
      return Promise.resolve(new Response(JSON.stringify({ data: mockBusinesses }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // WABAs (Step 4)
    if (input.match(/\/mock\/graph\/.+\/whatsapp_business_accounts/)) {
      if (init && init.method === 'POST') {
        return Promise.resolve(new Response(JSON.stringify({
          id: 'waba_123',
          name: 'Demo WABA',
          status: 'approved',
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return Promise.resolve(new Response(JSON.stringify({ data: [{ id: 'waba_123', name: 'Demo WABA', status: 'approved' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Phone Numbers (Step 5)
    if (input.match(/\/mock\/graph\/.+\/phone_numbers/)) {
      if (init && init.method === 'POST') {
        return Promise.resolve(new Response(JSON.stringify({
          id: 'phone_123',
          phone_number: '+1234567890',
          verified_name: 'Demo Business',
          quality_rating: 'green',
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return Promise.resolve(new Response(JSON.stringify({ data: [{ id: 'phone_123', phone_number: '+1234567890', verified_name: 'Demo Business', quality_rating: 'green' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Request Verification Code (Step 5)
    if (input.match(/\/mock\/graph\/.+\/request_code/)) {
      return Promise.resolve(new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Verify Code (Step 5)
    if (input.match(/\/mock\/graph\/.+\/verify_code/)) {
      return Promise.resolve(new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Upload Business Docs (Step 3)
    if (input.includes('/mock/upload/business-docs')) {
      return Promise.resolve(new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Subscribe Webhook (Step 6)
    if (input.match(/\/mock\/graph\/.+\/subscribed_apps/)) {
      return Promise.resolve(new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Message Templates (FinishScreen)
    if (input.match(/\/mock\/graph\/.+\/message_templates/)) {
      if (init && init.method === 'POST') {
        return Promise.resolve(new Response(JSON.stringify({
          id: 'template_123',
          name: 'Demo Template',
          status: 'approved',
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return Promise.resolve(new Response(JSON.stringify({ data: [{ id: 'template_123', name: 'Demo Template', status: 'approved' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);