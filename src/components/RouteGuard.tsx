import React from 'react';
import { useAuthStore } from '../stores/authStore';

interface RouteGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  permission,
  fallback,
}) => {
  const { user } = useAuthStore();

  const hasPermission = () => {
    if (!user) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  };

  if (!hasPermission()) {
    return (
      <div className="flex items-center justify-center h-64">
        {fallback || (
          <div className="text-center">
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-500">
              You don't have permission to access this feature.
            </p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};