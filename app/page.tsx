'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getSessions } from '@/lib/session-storage';

export default function Home() {
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    const sessions = getSessions();
    setSessionCount(sessions.length);
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation */}
      <nav className="bg-primary border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Rugby Practice Planner" width={120} height={120} className="h-40 w-auto" />
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#home" className="text-white hover:text-accent transition">Home</a>
            <a href="#features" className="text-white hover:text-accent transition">Features</a>
                      </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                RFU-Aligned<br />
                <span className="text-accent">Coaching Sessions</span>
              </h1>
              <div className="w-24 h-1 bg-accent mb-6"></div>
              <p className="text-xl text-slate-300 mb-8">
                Age-Grade Specific Training<br />
                for Every Ability Level
              </p>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 bg-accent hover:opacity-90 text-primary font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
              >
                Get Started <span>→</span>
              </Link>
            </div>
            <div className="hidden md:flex justify-center">
              {/* Hero Image Box with Lime Border */}
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-accent rounded-3xl transform -skew-y-3" style={{clipPath: 'polygon(0 0, 100% 5%, 100% 95%, 0 100%)'}}></div>
                <div className="relative bg-slate-900 rounded-3xl p-8 text-center m-1 transform -skew-y-3" style={{clipPath: 'polygon(0 0, 100% 5%, 100% 95%, 0 100%)'}}>
              <Image src="/logo.png" alt="Rugby Practice Planner" width={150} height={150} className="h-40 w-auto mx-auto mb-4" />
              <p className="text-slate-300 font-semibold">AI-Powered Session Planning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-900 py-20 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Powerful Capabilities
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Feature 1 */}
            <div className="border-2 border-accent rounded-lg p-6 hover:shadow-lg hover:shadow-accent/20 transition">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-white mb-3">Customizable Session Plans</h3>
              <p className="text-slate-400">
                Any length, development, and skill level.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-2 border-accent rounded-lg p-6 hover:shadow-lg hover:shadow-accent/20 transition">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-3">Complete Coach Resources</h3>
              <p className="text-slate-400">
                Assistant briefs, parent briefs, and difficulty adjustments.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-2 border-accent rounded-lg p-6 hover:shadow-lg hover:shadow-accent/20 transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">RFU Principles of Play</h3>
              <p className="text-slate-400">
                Aligned with official rugby coaching standards.
              </p>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="border-l-4 border-accent pl-4">
              <h4 className="text-accent font-bold mb-2 text-lg">⏱️ Session Planning</h4>
              <p className="text-slate-400 text-sm font-semibold">Any Duration</p>
              <p className="text-slate-500 text-xs mt-2">Create sessions from 15 minutes to 2+ hours.</p>
            </div>
            <div className="border-l-4 border-accent pl-4">
              <h4 className="text-accent font-bold mb-2 text-lg">👥 Participant Flexibility</h4>
              <p className="text-slate-400 text-sm font-semibold">Scale Up or Down</p>
              <p className="text-slate-500 text-xs mt-2">Adapt activities for any group size with ease.</p>
            </div>
            <div className="border-l-4 border-accent pl-4">
              <h4 className="text-accent font-bold mb-2 text-lg">⚙️ Difficulty Adjustment</h4>
              <p className="text-slate-400 text-sm font-semibold">Easier or Harder</p>
              <p className="text-slate-500 text-xs mt-2">Modify activities to suit all ability levels.</p>
            </div>
            <div className="border-l-4 border-accent pl-4">
              <h4 className="text-accent font-bold mb-2 text-lg">👨‍👩‍👧 Multi-Audience Briefs</h4>
              <p className="text-slate-400 text-sm font-semibold">Coaches, Assistants, Parents</p>
              <p className="text-slate-500 text-xs mt-2">Clear, tailored briefs for every audience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sessions Info */}
      {sessionCount > 0 && (
        <section className="bg-primary py-12 border-t border-slate-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-300 text-lg mb-4">
              You have <span className="text-accent font-bold">{sessionCount}</span> saved session{sessionCount !== 1 ? 's' : ''}
            </p>
            <Link
              href="/dashboard/sessions"
              className="inline-block text-accent hover:opacity-80 font-semibold transition"
            >
              View Your Sessions →
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-slate-900 py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Ready to create better sessions?</h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/create"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:opacity-90 text-primary font-bold py-3 px-8 rounded-lg transition"
            >
              Create New Session
            </Link>
            <Link
              href="/dashboard/sessions"
              className="inline-flex items-center justify-center gap-2 border-2 border-accent text-accent hover:bg-accent hover:text-primary font-bold py-3 px-8 rounded-lg transition"
            >
              View Sessions
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>Rugby Practice Planner • Better Coaching. Better Players. Better Game.</p>
        </div>
      </footer>
    </div>
  );
}
