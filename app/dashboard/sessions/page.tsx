'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSessions, deleteSession } from '@/lib/session-storage';

interface Session {
  id: string;
  ageGrade: string;
  topic: string;
  sessionLength: number;
  playerCount: number;
  createdAt: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getSessions();
    setSessions(stored);
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      deleteSession(id);
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-primary py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-accent">My Sessions</h1>
          <Link
            href="/dashboard/create"
            className="bg-accent hover:bg-lime-500 text-primary px-6 py-2 rounded-lg font-bold transition"
          >
            + New Session
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-slate-400">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="bg-slate-900 rounded-lg shadow border border-slate-800 p-12 text-center">
            <p className="text-slate-400 mb-6">No sessions created yet</p>
            <Link
              href="/dashboard/create"
              className="inline-block bg-accent hover:bg-lime-500 text-primary px-6 py-2 rounded-lg font-bold transition"
            >
              Create Your First Session
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {sessions.map(session => (
              <div key={session.id} className="bg-slate-900 rounded-lg shadow border border-slate-800 p-6 hover:border-lime-400 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-accent">{session.topic}</h3>
                    <p className="text-slate-400 text-sm">
                      {session.ageGrade} • {session.playerCount} players • {session.sessionLength} mins
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/sessions/${session.id}`}
                      className="bg-accent hover:bg-lime-500 text-primary px-4 py-2 rounded font-semibold text-sm transition"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">
                  Created {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
