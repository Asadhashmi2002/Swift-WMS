import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoginForm } from './components/auth/LoginForm';
import { useAuthStore } from './stores/authStore';
import { ThemeProvider } from './components/layout/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    // Auto-login for demo purposes
    // In production, remove this and implement proper authentication
    if (!isAuthenticated && !loading) {
      // Simulate auto-login after a short delay
      setTimeout(() => {
        // This would normally be handled by the login form
        // For demo, we'll skip the login screen
      }, 100);
    }
  }, [isAuthenticated, loading]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen bg-[var(--color-background)]">
          {!isAuthenticated ? (
            <LoginForm />
          ) : (
            <Dashboard />
          )}
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1E1E1E',
                border: '1px solid #D2D1D4',
                borderRadius: '12px',
              },
            }}
          />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;