'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image'

interface Session {
  id: number
  ageGrade: string
  topic: string
  sessionLength: number
  playerCount: number
  createdAt: string
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalHours: 0,
    totalPlayers: 0,
  })

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions')
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions || [])
        
        // Calculate stats
        const totalSessions = data.sessions?.length || 0
        const totalHours = (data.sessions || []).reduce((sum: number, s: Session) => sum + (s.sessionLength / 60), 0)
        const totalPlayers = (data.sessions || []).reduce((sum: number, s: Session) => sum + s.playerCount, 0)
        
        setStats({
          totalSessions,
          totalHours: Math.round(totalHours * 10) / 10,
          totalPlayers,
        })
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.png" alt="Rugby Practice Planner" width={100} height={100} className="h-20 w-auto" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome to Rugby Practice Planner</h1>
          <p className="text-lg text-slate-300">Create RFU-informed, age-grade aware session plans powered by AI.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* CTA Section */}
        <div className="mb-12">
          <Link
            href="/dashboard/create"
            className="inline-block bg-accent hover:bg-lime-500 text-primary px-8 py-4 rounded-lg font-bold text-lg transition"
          >
            + Create a New Session
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 rounded-lg shadow border border-slate-800 p-6">
            <div className="text-4xl font-bold text-accent mb-2">{stats.totalSessions}</div>
            <div className="text-slate-400">Sessions Created</div>
          </div>
          <div className="bg-slate-900 rounded-lg shadow border border-slate-800 p-6">
            <div className="text-4xl font-bold text-accent mb-2">{stats.totalHours}</div>
            <div className="text-slate-400">Total Hours Planned</div>
          </div>
          <div className="bg-slate-900 rounded-lg shadow border border-slate-800 p-6">
            <div className="text-4xl font-bold text-accent mb-2">{stats.totalPlayers}</div>
            <div className="text-slate-400">Total Players Coached</div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-slate-900 rounded-lg shadow border border-slate-800">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-accent">Recent Sessions</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center text-slate-400">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 mb-4">No sessions yet. Create your first session to get started!</p>
              <Link
                href="/dashboard/create"
                className="inline-block bg-accent hover:bg-lime-500 text-primary px-6 py-2 rounded-lg font-bold transition"
              >
                Create Session
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/dashboard/sessions/${session.id}`}
                  className="p-6 hover:bg-slate-800 transition flex justify-between items-center border-slate-700"
                >
                  <div>
                    <h3 className="font-bold text-lg text-accent">{session.ageGrade} — {session.topic}</h3>
                    <div className="flex gap-3 mt-2 text-sm text-slate-400">
                      <span>📅 {new Date(session.createdAt).toLocaleDateString()}</span>
                      <span>⏱️ {session.sessionLength} min</span>
                      <span>👥 {session.playerCount} players</span>
                    </div>
                  </div>
                  <div className="text-accent font-bold">→</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-900 rounded-lg shadow border border-slate-800 p-6 hover:border-lime-400 transition">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-lg text-accent mb-2">Full Session Plans</h3>
            <p className="text-slate-400 text-sm">
              Timed plans with Game Zone, Skill Zone, coaching points and player questions.
            </p>
          </div>
          <div className="bg-slate-900 rounded-lg shadow border border-slate-800 p-6 hover:border-lime-400 transition">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-bold text-lg text-accent mb-2">Progression Tracking</h3>
            <p className="text-slate-400 text-sm">
              Build multi-session series and track progression through your coaching block.
            </p>
          </div>
          <div className="bg-slate-900 rounded-lg shadow border border-slate-800 p-6 hover:border-lime-400 transition">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-bold text-lg text-accent mb-2">Instant Adaptations</h3>
            <p className="text-slate-400 text-sm">
              One tap to create pitch-side cards, parent summaries, or easier/harder versions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
