'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

interface Session {
  id: number
  title: string
  ageGrade: string
  coachingTopic: string
  sessionLength: string
  playerCount: string
  contactLevel: string
  planMarkdown: string
}

const ADAPTATIONS = [
  { id: 'pitch_side', label: '📋 Pitch-Side Card', color: 'bg-blue-100 text-blue-900' },
  { id: 'assistant_brief', label: '👥 Assistant Brief', color: 'bg-purple-100 text-purple-900' },
  { id: 'parent_summary', label: '👨‍👩‍👧 Parent Summary', color: 'bg-green-100 text-green-900' },
  { id: 'easier', label: '⬇️ Make Easier', color: 'bg-yellow-100 text-yellow-900' },
  { id: 'harder', label: '⬆️ Make Harder', color: 'bg-red-100 text-red-900' },
  { id: 'no_contact', label: '🛡️ No Contact', color: 'bg-indigo-100 text-indigo-900' },
  { id: 'increase_contact', label: '💪 Increase Contact', color: 'bg-orange-100 text-orange-900' },
  { id: 'fewer_players', label: '👤 Fewer Players', color: 'bg-pink-100 text-pink-900' },
  { id: 'one_to_one', label: '⭐ 1-to-1', color: 'bg-cyan-100 text-cyan-900' },
  { id: 'small_group', label: '👫 Small Group', color: 'bg-teal-100 text-teal-900' },
]

export default function SessionPage() {
  const params = useParams()
  const sessionId = params.id as string
  const [session] = useState<Session | null>(null)
  const [adaptedPlan, setAdaptedPlan] = useState<string | null>(null)
  const [adaptingType, setAdaptingType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [_error, _setError] = useState('')

  useEffect(() => {
    // TODO: Fetch session from API
    // For now, show loading
    setLoading(false)
  }, [sessionId])

  const handleAdapt = async (adaptationType: string) => {
    setAdaptingType(adaptationType)
    try {
      const res = await fetch('/api/sessions/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: parseInt(sessionId), adaptationType }),
      })

      if (!res.ok) throw new Error('Failed to generate adaptation')

      const data = await res.json()
      setAdaptedPlan(data.adaptedMarkdown)
    } catch (err) {
      _setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAdaptingType(null)
    }
  }

  const handleCopy = () => {
    const text = adaptedPlan || session?.planMarkdown
    if (text) {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    alert('PDF download coming soon')
  }

  if (loading) {
    return <div className="text-center py-12">Loading session...</div>
  }

  if (!session) {
    return <div className="text-center py-12 text-red-600">Session not found</div>
  }

  const displayPlan = adaptedPlan || session.planMarkdown

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{session.title}</h1>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
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
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              📥 PDF
            </button>
          </div>
        </div>
      </div>

      {/* Adaptation buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Adapt this session</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {ADAPTATIONS.map(adapt => (
            <button
              key={adapt.id}
              onClick={() => handleAdapt(adapt.id)}
              disabled={adaptingType === adapt.id}
              className={`p-3 rounded-lg font-medium text-sm transition ${
                adapt.color
              } ${adaptingType === adapt.id ? 'opacity-50' : 'hover:opacity-80'}`}
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
