'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          name: newUserName,
          password: newUserPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to add user');
        return;
      }

      setNewUserEmail('');
      setNewUserName('');
      setNewUserPassword('');
      setShowAddUser(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to delete user');
        return;
      }

      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleChangePassword = async (userId: number) => {
    if (!editPassword) {
      setError('Password is required');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: editPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to change password');
        return;
      }

      setEditingUserId(null);
      setEditPassword('');
      fetchUsers();
    } catch (err) {
      setError('Failed to change password');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Rugby Practice Planner" width={120} height={120} className="h-12 w-auto" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded text-red-200">
            {error}
            <button
              onClick={() => setError('')}
              className="float-right text-red-200 hover:text-red-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Add User Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="bg-accent hover:opacity-90 text-primary font-bold py-2 px-6 rounded transition"
          >
            {showAddUser ? 'Cancel' : '+ Add New User'}
          </button>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-accent"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-accent"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-accent"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-accent hover:opacity-90 text-primary font-bold py-2 px-6 rounded transition"
              >
                Add User
              </button>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Users ({users.length})</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-slate-400">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-slate-400">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Created</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800 transition">
                      <td className="px-6 py-4 text-sm text-slate-300">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${user.isAdmin ? 'bg-accent text-primary' : 'bg-slate-700 text-slate-300'}`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        {editingUserId === user.id ? (
                          <div className="flex gap-2">
                            <input
                              type="password"
                              value={editPassword}
                              onChange={(e) => setEditPassword(e.target.value)}
                              placeholder="New password"
                              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs focus:outline-none focus:border-accent"
                            />
                            <button
                              onClick={() => handleChangePassword(user.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingUserId(null);
                                setEditPassword('');
                              }}
                              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingUserId(user.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition"
                            >
                              Change Password
                            </button>
                            {user.email !== 'c.williams@mwbs.co.uk' && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition"
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
