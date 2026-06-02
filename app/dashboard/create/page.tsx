'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CreateSessionPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    ageGrade: 'Under 12',
    gender: 'Mixed',
    playerCount: 15,
    abilityLevel: 'Mixed',
    sessionLength: 60,
    topic: '',
    principle: 'Support',
    struggles: '',
    desiredOutcome: '',
    contactLevel: 'touch_only',
    equipment: '',
    space: 'Full pitch',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'playerCount' || name === 'sessionLength' ? parseInt(value) : value,
    }))
  }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step < 4) {
      setStep(step + 1)
      return
    }

    // Generate session
    setLoading(true)
    try {
      const { saveSession } = await import('@/lib/session-storage')
      
      const res = await fetch('/api/sessions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to generate session')
      }

      const data = await res.json()
      
      const session = {
        id: Date.now().toString(),
        ...formData,
        plan: data.plan,
        createdAt: new Date().toISOString(),
        adaptations: {},
      }

      saveSession(session)
      router.push(`/dashboard/sessions/${session.id}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Error generating session: ' + (error instanceof Error ? error.message : 'Unknown error'))
      setLoading(false)
    }
  }

  const contactWarning = formData.contactLevel === 'full_contact' && 
    (formData.ageGrade.includes('7') || formData.ageGrade.includes('8'))

  return (
    <div className="min-h-screen bg-primary py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-slate-900 rounded-lg shadow border border-slate-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6 border-b border-slate-700">
            <h1 className="text-3xl font-bold mb-2">Create a Session</h1>
            <p className="text-slate-400">Step {step} of 4 — {
              step === 1 ? 'Player Group' :
              step === 2 ? 'Session Focus' :
              step === 3 ? 'Delivery Conditions' :
              'Review & Generate'
            }</p>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-slate-700">
            <div className="h-full bg-accent transition-all" style={{ width: `${(step / 4) * 100}%` }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Step 1: Player Group */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Age Grade *
                  </label>
                  <select
                    name="ageGrade"
                    value={formData.ageGrade}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option>Under 7</option>
                    <option>Under 8</option>
                    <option>Under 9</option>
                    <option>Under 10</option>
                    <option>Under 11</option>
                    <option>Under 12</option>
                    <option>Under 13</option>
                    <option>Under 14</option>
                    <option>Under 15</option>
                    <option>Under 16</option>
                    <option>Under 18</option>
                    <option>Senior</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option>Boys</option>
                      <option>Girls</option>
                      <option>Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Player Count *
                    </label>
                    <input
                      type="number"
                      name="playerCount"
                      value={formData.playerCount}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Ability Level *
                  </label>
                  <select
                    name="abilityLevel"
                    value={formData.abilityLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option>Beginner</option>
                    <option>Mixed</option>
                    <option>Experienced</option>
                  </select>
                </div>
              </>
            )}

            {/* Step 2: Session Focus */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Coaching Topic *
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g., Passing & Catching, Tackling, Ruck & Maul"
                    className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    RFU Principle of Play *
                  </label>
                  <select
                    name="principle"
                    value={formData.principle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option>Support</option>
                    <option>Communication</option>
                    <option>Continuity</option>
                    <option>Breakdown</option>
                    <option>Set Piece</option>
                    <option>Positioning</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Session Length (minutes) *
                    </label>
                    <input
                      type="number"
                      name="sessionLength"
                      value={formData.sessionLength}
                      onChange={handleChange}
                      min="30"
                      max="120"
                      className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Player Struggles (optional)
                  </label>
                  <textarea
                    name="struggles"
                    value={formData.struggles}
                    onChange={handleChange}
                    placeholder="e.g., Players struggle with support play, decision-making under pressure"
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Desired Outcome (optional)
                  </label>
                  <textarea
                    name="desiredOutcome"
                    value={formData.desiredOutcome}
                    onChange={handleChange}
                    placeholder="e.g., Players will execute accurate passes and recognize support opportunities"
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </>
            )}

            {/* Step 3: Delivery Conditions */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Contact Level *
                  </label>
                  <select
                    name="contactLevel"
                    value={formData.contactLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="no_contact">No Contact (Touch Only)</option>
                    <option value="touch_only">Touch Only</option>
                    <option value="minimal_contact">Minimal Contact</option>
                    <option value="progressive_contact">Progressive Contact</option>
                    <option value="full_contact">Full Contact</option>
                  </select>
                </div>

                {contactWarning && (
                  <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="font-bold text-yellow-400 mb-1">⚠️ Safety Warning</p>
                    <p className="text-sm text-yellow-300">
                      Full contact is not recommended for {formData.ageGrade}. Consider touch-only or minimal contact instead.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Equipment Available (optional)
                  </label>
                  <textarea
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    placeholder="e.g., Cones, bibs, tackle pads, balls"
                    rows={2}
                    className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Space *
                  </label>
                  <select
                    name="space"
                    value={formData.space}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option>Full pitch</option>
                    <option>Half pitch</option>
                    <option>Third of pitch</option>
                    <option>Small area</option>
                    <option>Indoor hall</option>
                  </select>
                </div>
              </>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
                  <h3 className="font-bold text-accent mb-3">Session Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Age Grade:</span>
                      <p className="font-bold text-white">{formData.ageGrade}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Topic:</span>
                      <p className="font-bold text-white">{formData.topic}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Players:</span>
                      <p className="font-bold text-white">{formData.playerCount} {formData.gender}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Length:</span>
                      <p className="font-bold text-white">{formData.sessionLength} minutes</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Principle:</span>
                      <p className="font-bold text-white">{formData.principle}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Contact:</span>
                      <p className="font-bold text-white">{formData.contactLevel.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="font-bold text-yellow-400 mb-2">📋 Coach Responsibility</p>
                  <p className="text-sm text-yellow-300">
                    This session is RFU-informed planning support. You remain responsible for checking current RFU regulations, safeguarding requirements, first aid provision, venue risk assessments, player readiness, coaching competence and session suitability before delivery.
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading || (step === 2 && !formData.topic)}
                className="ml-auto px-6 py-2 bg-accent text-primary rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Generating...' : step === 4 ? 'Generate Session' : 'Next →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
