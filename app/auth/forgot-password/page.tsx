'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to process request');
        return;
      }

      const data = await response.json();
      setResetLink(data.resetLink || '');
      setSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Rugby Practice Planner" width={120} height={120} className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
        </div>

        {submitted ? (
          <div className="bg-slate-900 rounded-lg p-8 border border-slate-800 text-center">
            <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded text-green-200">
              Password reset link generated
            </div>
            <p className="text-slate-400 mb-4 text-sm">
              We have generated a password reset link for <strong>{email}</strong>.
            </p>
            {resetLink && (
              <div className="mb-6 p-4 bg-slate-800 rounded border border-slate-700">
                <p className="text-slate-300 text-xs mb-2">Reset Link (for testing):</p>
                <Link href={resetLink} className="text-accent hover:text-lime-300 break-all text-sm font-mono">
                  {resetLink}
                </Link>
                <p className="text-slate-500 text-xs mt-3">
                  Click the link above to reset your password
                </p>
              </div>
            )}
            <Link href="/auth/login" className="text-accent hover:opacity-80 transition">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-900 rounded-lg p-8 border border-slate-800">
            {error && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
                {error}
              </div>
            )}

            <p className="text-slate-400 mb-6 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:opacity-90 text-primary font-bold py-2 px-4 rounded transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-slate-400">
            <Link href="/auth/login" className="text-accent hover:opacity-80 transition">
              Back to login
            </Link>
          </p>
          <p className="text-slate-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-accent hover:opacity-80 transition">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
