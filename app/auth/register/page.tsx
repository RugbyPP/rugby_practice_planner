'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/dashboard');
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
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-lg p-8 border border-slate-800">
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-accent"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-4">
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

          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Password
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
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent hover:opacity-80 transition">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
