'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">Welcome to Rugby Practice Planner</h1>
          <p className="text-lg text-gray-200">Create RFU-informed, age-grade aware session plans powered by AI.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* CTA Section */}
        <div className="mb-12">
          <Link
            href="/dashboard/create"
            className="inline-block bg-accent text-primary px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition"
          >
            + Create a New Session
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl font-bold text-primary mb-2">{stats.totalSessions}</div>
            <div className="text-gray-600">Sessions Created</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl font-bold text-primary mb-2">{stats.totalHours}</div>
            <div className="text-gray-600">Total Hours Planned</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl font-bold text-primary mb-2">{stats.totalPlayers}</div>
            <div className="text-gray-600">Total Players Coached</div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-primary">Recent Sessions</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No sessions yet. Create your first session to get started!</p>
              <Link
                href="/dashboard/create"
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-bold hover:opacity-90"
              >
                Create Session
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/dashboard/sessions/${session.id}`}
                  className="p-6 hover:bg-gray-50 transition flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg text-primary">{session.ageGrade} — {session.topic}</h3>
                    <div className="flex gap-3 mt-2 text-sm text-gray-600">
                      <span>📅 {new Date(session.createdAt).toLocaleDateString()}</span>
                      <span>⏱️ {session.sessionLength} min</span>
                      <span>👥 {session.playerCount} players</span>
                    </div>
                  </div>
                  <div className="text-primary font-bold">→</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Full Session Plans</h3>
            <p className="text-gray-600 text-sm">
              Timed plans with Game Zone, Skill Zone, coaching points and player questions.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-bold text-lg mb-2">Progression Tracking</h3>
            <p className="text-gray-600 text-sm">
              Build multi-session series and track progression through your coaching block.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-bold text-lg mb-2">Instant Adaptations</h3>
            <p className="text-gray-600 text-sm">
              One tap to create pitch-side cards, parent summaries, or easier/harder versions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
