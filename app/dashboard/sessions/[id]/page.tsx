'use client'
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session-storage'
import ReactMarkdown from 'react-markdown'

interface Session {
  id: string
  ageGrade: string
  gender?: string
  abilityLevel?: string
  principle?: string
  contactLevel?: string
  topic: string
  sessionLength: number
  playerCount: number
  createdAt: string
  plan: string
  adaptations: Record<string, string>
  struggles?: string
  desiredOutcome?: string
  equipment?: string
  space?: string
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
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

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
          gender: 'mixed',
          playerCount: session.playerCount,
          abilityLevel: 'intermediate',
          sessionLength: session.sessionLength,
          topic: session.topic,
          principle: 'development',
          contactLevel: 'full',
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

  const handleCopy = async () => {
    const text = adaptedPlan || session?.plan
    if (text) {
      try {
        await navigator.clipboard.writeText(text)
        setCopyFeedback('✓ Copied to clipboard!')
        setTimeout(() => setCopyFeedback(null), 2000)
      } catch (err) {
        console.error('Copy failed:', err)
        setCopyFeedback('✗ Copy failed')
        setTimeout(() => setCopyFeedback(null), 2000)
      }
    }
  }

  const handleDownloadPDF = async () => {
    if (!session) return
    setDownloading(true)
    try {
      const response = await fetch(`/api/sessions/${session.id}/download`)
      if (!response.ok) {
        throw new Error('Failed to download PDF')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${session.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_session_plan.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download failed:', err)
      alert(`Failed to download PDF: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading session...</div>
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Session not found</p>
        <Link href="/dashboard/sessions" className="text-accent hover:text-lime-300 transition">
          Back to Sessions
        </Link>
      </div>
    )
  }

  const displayPlan = adaptedPlan || session.plan

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-lg shadow border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Image src="/logo.png" alt="Rugby Practice Planner" width={80} height={80} className="h-14 w-auto" />
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-accent mb-2">{session.topic}</h1>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-accent text-primary px-3 py-1 rounded-full text-sm font-bold">
                {session.ageGrade}
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm border border-slate-700">
                {session.sessionLength} min
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm border border-slate-700">
                {session.playerCount} players
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-accent hover:bg-lime-500 text-primary rounded-lg font-medium transition flex items-center gap-2"
            >
              📋 {copyFeedback || 'Copy'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 bg-accent hover:bg-lime-500 text-primary rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? '⏳ Generating...' : '📥 Download PDF'}
            </button>
          </div>
        </div>
        {copyFeedback && (
          <p className="text-sm text-accent mt-2">{copyFeedback}</p>
        )}
      </div>

      {/* Adaptation buttons */}
      <div className="bg-slate-900 rounded-lg shadow border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-accent mb-4">Adapt this session</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {ADAPTATIONS.map(adapt => (
            <button
              key={adapt.id}
              onClick={() => handleAdapt(adapt.id)}
              disabled={adaptingType === adapt.id}
              className={`p-3 rounded-lg font-medium text-sm transition ${
                adaptingType === adapt.id
                  ? 'bg-slate-700 text-slate-400 opacity-50 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-accent border border-slate-700'
              }`}
            >
              {adaptingType === adapt.id ? '⏳' : adapt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session plan */}
      <div className="bg-slate-900 rounded-lg shadow border border-slate-800 p-6">
        <div className="prose prose-invert max-w-none prose-headings:text-accent prose-headings:font-bold prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-li:leading-relaxed prose-strong:text-lime-300 prose-em:text-slate-200 prose-code:text-lime-300 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-hr:border-slate-700 prose-blockquote:text-slate-400 prose-blockquote:border-lime-400">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-accent mt-6 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-accent mt-5 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold text-lime-300 mt-4 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="text-slate-300 mb-4 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-2" {...props} />,
              li: ({node, ...props}) => <li className="text-slate-300 ml-2" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-lime-400 pl-4 py-2 my-4 text-slate-400 italic" {...props} />,
              code: ({node, ...props}) => <code className="bg-slate-800 text-lime-300 px-2 py-1 rounded text-sm" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-slate-800 text-lime-300 p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
              hr: ({node, ...props}) => <hr className="border-slate-700 my-6" {...props} />,
            }}
          >
            {displayPlan}
          </ReactMarkdown>
        </div>
      </div>

      {/* Coach responsibility note */}
      <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
        <p className="font-bold text-yellow-400 mb-2">Coach Responsibility Note</p>
        <p className="text-sm text-yellow-300">
          This session is RFU-informed planning support. Coaches remain responsible for checking current RFU regulations, safeguarding requirements, first aid provision, venue risk assessments, player readiness, coaching competence and session suitability before delivery.
        </p>
      </div>
    </div>
  )
}
