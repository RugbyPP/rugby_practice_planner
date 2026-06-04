'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Both fields are required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to reset password');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 rounded-lg p-8 border border-slate-800 text-center">
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200">
              Invalid reset link
            </div>
            <p className="text-slate-400 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link href="/auth/forgot-password" className="text-accent hover:opacity-80 transition">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Rugby Practice Planner" width={120} height={120} className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Set New Password</h1>
        </div>

        {success ? (
          <div className="bg-slate-900 rounded-lg p-8 border border-slate-800 text-center">
            <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded text-green-200">
              Password reset successful!
            </div>
            <p className="text-slate-400 mb-6">
              Your password has been reset. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-900 rounded-lg p-8 border border-slate-800">
            {error && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                placeholder="••••••••"
                required
              />
              <p className="text-slate-500 text-xs mt-1">At least 8 characters</p>
            </div>

            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:opacity-90 text-primary font-bold py-2 px-4 rounded transition disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Links */}
        {!success && (
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              <Link href="/auth/login" className="text-accent hover:opacity-80 transition">
                Back to login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
