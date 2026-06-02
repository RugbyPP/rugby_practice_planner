'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session-storage'
import ReactMarkdown from 'react-markdown'

interface Session {
  id: string
  ageGrade: string
  topic: string
  sessionLength: number
  playerCount: number
  createdAt: string
  plan: string
  adaptations: Record<string, string>
}

const ADAPTATIONS = [
  { id: 'pitch_side', label: '📋 Pitch-Side Card' },
  { id: 'assistant_brief', label: '👥 Assistant Brief' },
  { id: 'parent_summary', label: '👨‍👩‍👧 Parent Summary' },
  { id: 'make_easier', label: '⬇️ Make Easier' },
  { id: 'make_harder', label: '⬆️ Make Harder' },
  { id: 'no_contact', label: '🛡️ No Contact' },
  { id: 'increase_contact', label: '💪 Increase Contact' },
  { id: 'fewer_players', label: '👤 Fewer Players' },
  { id: 'one_to_one', label: '⭐ 1-to-1' },
  { id: 'small_group', label: '👫 Small Group' },
]

export default function SessionPage() {
  const params = useParams()
  const sessionId = params.id as string
  const [session, setSession] = useState<Session | null>(null)
  const [adaptedPlan, setAdaptedPlan] = useState<string | null>(null)
  const [adaptingType, setAdaptingType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getSession(sessionId)
    if (stored) {
      setSession(stored)
    }
    setLoading(false)
  }, [sessionId])

  const handleAdapt = async (adaptationType: string) => {
    setAdaptingType(adaptationType)
    try {
      if (!session) throw new Error('Session not loaded')
      
      const res = await fetch('/api/sessions/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          adaptationType,
          planMarkdown: session.plan,
          ageGrade: session.ageGrade,
          gender: 'mixed', // Default value - can be enhanced later
          playerCount: session.playerCount,
          abilityLevel: 'intermediate', // Default value - can be enhanced later
          sessionLength: session.sessionLength,
          topic: session.topic,
          principle: 'development', // Default value - can be enhanced later
          contactLevel: 'full', // Default value - can be enhanced later
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to generate adaptation')
      }

      const data = await res.json()
      setAdaptedPlan(data.adaptedMarkdown)
    } catch (err) {
      console.error(err)
      alert(`Failed to generate adaptation: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setAdaptingType(null)
    }
  }

  const handleCopy = () => {
    const text = adaptedPlan || session?.plan
    if (text) {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }



  if (loading) {
    return <div className="text-center py-12">Loading session...</div>
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Session not found</p>
        <Link href="/dashboard/sessions" className="text-indigo-600 hover:underline">
          Back to Sessions
        </Link>
      </div>
    )
  }

  const displayPlan = adaptedPlan || session.plan

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">{session.topic}</h1>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {session.ageGrade}
              </span>
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                {session.sessionLength} min
              </span>
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                {session.playerCount} players
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              📋 Copy
            </button>
          </div>
        </div>
      </div>

      {/* Adaptation buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-indigo-600 mb-4">Adapt this session</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {ADAPTATIONS.map(adapt => (
            <button
              key={adapt.id}
              onClick={() => handleAdapt(adapt.id)}
              disabled={adaptingType === adapt.id}
              className={`p-3 rounded-lg font-medium text-sm transition ${
                adaptingType === adapt.id
                  ? 'bg-gray-300 text-gray-700 opacity-50'
                  : 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200'
              }`}
            >
              {adaptingType === adapt.id ? '⏳' : adapt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{displayPlan}</ReactMarkdown>
        </div>
      </div>

      {/* Coach responsibility note */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="font-bold text-yellow-900 mb-2">Coach Responsibility Note</p>
        <p className="text-sm text-yellow-800">
          This session is RFU-informed planning support. Coaches remain responsible for checking current RFU regulations, safeguarding requirements, first aid provision, venue risk assessments, player readiness, coaching competence and session suitability before delivery.
        </p>
      </div>
    </div>
  )
}
