'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Session {
  id: number
  title: string
  ageGrade: string
  coachingTopic: string
  sessionLength: string
  playerCount: string
  createdAt: string
  seriesId?: number
}

export default function SessionsPage() {
  const [sessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // TODO: Fetch sessions from API
    setLoading(false)
  }, [])

  const filteredSessions = sessions.filter(s => {
    if (filter === 'series') return s.seriesId
    if (filter === 'standalone') return !s.seriesId
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">My Sessions</h1>
        <Link
          href="/dashboard/create"
          className="bg-accent text-primary px-6 py-2 rounded-lg font-bold hover:opacity-90"
        >
          + New Session
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Sessions
        </button>
        <button
          onClick={() => setFilter('series')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'series'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Series
        </button>
        <button
          onClick={() => setFilter('standalone')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'standalone'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Standalone
        </button>
      </div>

      {/* Sessions grid */}
      {loading ? (
        <div className="text-center py-12">Loading sessions...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No sessions yet</h2>
          <p className="text-gray-600 mb-6">
            Create your first session to get started with RFU-informed planning.
          </p>
          <Link
            href="/dashboard/create"
            className="inline-block bg-accent text-primary px-6 py-2 rounded-lg font-bold hover:opacity-90"
          >
            Create a Session
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map(session => (
            <Link
              key={session.id}
              href={`/dashboard/sessions/${session.id}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg hover:border-accent border-2 border-transparent transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-primary line-clamp-2">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600">{session.coachingTopic}</p>
                </div>
                {session.seriesId && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Series
                  </span>
                )}
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                  {session.ageGrade}
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {session.sessionLength} min
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {session.playerCount} players
                </span>
              </div>

              <p className="text-xs text-gray-500">
                {new Date(session.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
