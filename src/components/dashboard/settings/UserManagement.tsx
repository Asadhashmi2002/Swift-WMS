import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Users as UsersIcon } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { Badge } from '../../ui/Badge';
import { useAppStore } from '../../../stores/appStore';
import { useAuthStore } from '../../../stores/authStore';
import { User } from '../../../types';

export const UserManagement: React.FC = () => {
  const { users, seatLimit, loadUsers, createUser, updateUser, deleteUser, canCreateUser } = useAppStore();
  const { user: currentUser } = useAuthStore();
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'agent' as const,
    permissions: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const allPermissions = [
    'chat',
    'view_inbox',
    'broadcast',
    'view_analytics',
    'manage_users',
    'integration',
  ];

  const rolePermissions = {
    admin: ['all'],
    manager: ['view_analytics', 'manage_users', 'broadcast', 'chat', 'view_inbox'],
    agent: ['chat', 'view_inbox'],
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        permissions: user.permissions,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        phone: '',
        role: 'agent',
        permissions: rolePermissions.agent,
      });
    }
    setError('');
    setShowUserModal(true);
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
    setError('');
  };

  const handleRoleChange = (role: 'admin' | 'manager' | 'agent') => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: rolePermissions[role],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        if (!canCreateUser()) {
          throw new Error(`Seat limit of ${seatLimit} reached`);
        }
        await createUser(formData);
      }
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own account');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'accent';
      case 'agent': return 'primary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">User Management</h2>
          <p className="text-gray-500 mt-1">
            {users.length} of {seatLimit} seats used
          </p>
        </div>
        
        <Button 
          onClick={() => handleOpenModal()}
          disabled={!canCreateUser()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Seat Usage */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
              <UsersIcon className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">Seat Usage</h3>
              <p className="text-sm text-gray-500">Track your team capacity</p>
            </div>
          </div>
          
          <Badge variant={users.length >= seatLimit ? 'error' : 'success'}>
            {users.length}/{seatLimit} seats
          </Badge>
        </div>
        
        <div className="w-full bg-[var(--color-gray)] rounded-full h-2">
          <div 
            className="bg-[var(--color-primary)] h-2 rounded-full transition-all"
            style={{ width: `${(users.length / seatLimit) * 100}%` }}
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-4 font-medium text-[var(--color-text)]">User</th>
                <th className="text-left p-4 font-medium text-[var(--color-text)]">Role</th>
                <th className="text-left p-4 font-medium text-[var(--color-text)]">Status</th>
                <th className="text-left p-4 font-medium text-[var(--color-text)]">Permissions</th>
                <th className="text-right p-4 font-medium text-[var(--color-text)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[var(--color-text)]">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm text-gray-500">
                        {user.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.includes('all') ? (
                        <Badge variant="error" size="sm">All Permissions</Badge>
                      ) : (
                        user.permissions.slice(0, 2).map((permission) => (
                          <Badge key={permission} variant="default" size="sm">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))
                      )}
                      {user.permissions.length > 2 && !user.permissions.includes('all') && (
                        <Badge variant="default" size="sm">
                          +{user.permissions.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === currentUser?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found. Add your first user to get started.
          </div>
        )}
      </Card>

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />

          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleRoleChange(e.target.value as any)}
              className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] text-[var(--color-text)]"
            >
              <option value="agent">Agent</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Permissions
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {formData.role === 'admin' ? (
                <div className="p-2 bg-red-50 rounded-lg">
                  <Badge variant="error" size="sm">All Permissions</Badge>
                </div>
              ) : (
                allPermissions.map((permission) => (
                  <label key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            permissions: [...prev.permissions, permission],
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            permissions: prev.permissions.filter(p => p !== permission),
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-[var(--color-text)]">
                      {permission.replace('_', ' ')}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};