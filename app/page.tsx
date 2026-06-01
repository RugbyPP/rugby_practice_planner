'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSessions } from '@/lib/session-storage';

export default function Home() {
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    const sessions = getSessions();
    setSessionCount(sessions.length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Rugby Practice Planner
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered session planning for rugby coaches
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your First Session
            </h2>
            <p className="text-gray-600 mb-6">
              Generate AI-powered rugby session plans tailored to your teams needs
            </p>
            <Link
              href="/dashboard/create"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-bold text-lg mb-2">AI Generation</h3>
            <p className="text-gray-600 text-sm">
              Claude 3.5 Sonnet generates session plans based on your teams needs
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-bold text-lg mb-2">10 Adaptations</h3>
            <p className="text-gray-600 text-sm">
              Instantly adapt sessions for different contexts and player needs
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="font-bold text-lg mb-2">Local Storage</h3>
            <p className="text-gray-600 text-sm">
              All sessions saved locally in your browser
            </p>
          </div>
        </div>

        {sessionCount > 0 && (
          <div className="max-w-2xl mx-auto bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
            <p className="text-gray-700">
              You have <span className="font-bold text-indigo-600">{sessionCount}</span> saved session{sessionCount !== 1 ? 's' : ''}
            </p>
            <Link
              href="/dashboard/sessions"
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              View Your Sessions
            </Link>
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-12 text-center">
          <Link
            href="/dashboard/sessions"
            className="inline-block mr-6 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Session Library
          </Link>
          <Link
            href="/dashboard/create"
            className="inline-block text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Create New Session
          </Link>
        </div>
      </div>
    </div>
  );
}
