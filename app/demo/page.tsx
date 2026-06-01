'use client'

import { useState } from 'react'

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState('landing')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">🏉 Rugby Planner</div>
          <div className="text-sm text-gray-600">INVESTOR DEMO</div>
        </div>
      </div>

      {/* Demo Navigation */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap text-sm">
          <button
            onClick={() => setCurrentStep('landing')}
            className={`px-3 py-1 rounded ${currentStep === 'landing' ? 'bg-white text-primary font-bold' : 'bg-primary/80'}`}
          >
            Landing
          </button>
          <button
            onClick={() => setCurrentStep('dashboard')}
            className={`px-3 py-1 rounded ${currentStep === 'dashboard' ? 'bg-white text-primary font-bold' : 'bg-primary/80'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentStep('builder')}
            className={`px-3 py-1 rounded ${currentStep === 'builder' ? 'bg-white text-primary font-bold' : 'bg-primary/80'}`}
          >
            Session Builder
          </button>
          <button
            onClick={() => setCurrentStep('session')}
            className={`px-3 py-1 rounded ${currentStep === 'session' ? 'bg-white text-primary font-bold' : 'bg-primary/80'}`}
          >
            Session Plan
          </button>
          <button
            onClick={() => setCurrentStep('adaptations')}
            className={`px-3 py-1 rounded ${currentStep === 'adaptations' ? 'bg-white text-primary font-bold' : 'bg-primary/80'}`}
          >
            Adaptations
          </button>
        </div>
      </div>

      {/* Landing Page */}
      {currentStep === 'landing' && (
        <div className="min-h-screen bg-gradient-to-b from-primary to-primary/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Build better rugby sessions in minutes.
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                RFU-informed, age-grade aware session planning for every coach.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setCurrentStep('dashboard')}
                  className="bg-accent text-primary px-8 py-3 rounded-full font-bold hover:opacity-90"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setCurrentStep('builder')}
                  className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:opacity-90"
                >
                  See Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {currentStep === 'dashboard' && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-8">
            <h1 className="text-4xl font-bold mb-2">Welcome to Rugby Practice Planner</h1>
            <p className="text-lg text-gray-200 mb-6">
              Create RFU-informed, age-grade aware session plans powered by AI.
            </p>
            <button
              onClick={() => setCurrentStep('builder')}
              className="inline-block bg-accent text-primary px-6 py-3 rounded-lg font-bold hover:opacity-90"
            >
              + Create a Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-gray-600">Sessions Created</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-gray-600">Session Series</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-gray-600">Total Hours Planned</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      )}

      {/* Session Builder */}
      {currentStep === 'builder' && (
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
              <h1 className="text-3xl font-bold mb-2">Create a Session</h1>
              <p className="text-gray-200">Step 1 of 4 — Player Group</p>
            </div>

            <div className="h-1 bg-gray-200">
              <div className="h-full bg-accent" style={{ width: '25%' }} />
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Grade *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent">
                  <option>Select age grade</option>
                  <option selected>Under 12</option>
                  <option>Under 14</option>
                  <option>Under 16</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Select</option>
                    <option selected>Boys</option>
                    <option>Girls</option>
                    <option>Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Player Count *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 15"
                    defaultValue="15"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ability Level *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Select</option>
                  <option selected>Mixed</option>
                  <option>Beginner</option>
                  <option>Experienced</option>
                </select>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium opacity-50 cursor-not-allowed">
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep('builder')}
                  className="ml-auto px-6 py-2 bg-accent text-primary rounded-lg font-bold hover:opacity-90"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Plan */}
      {currentStep === 'session' && (
        <div className="max-w-4xl mx-auto py-8 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">Under 12 — Passing & Catching</h1>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    Under 12
                  </span>
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    60 min
                  </span>
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    15 players
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
                  📋 Copy
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
                  📥 PDF
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Adapt this session</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button className="p-3 rounded-lg font-medium text-sm bg-blue-100 text-blue-900 hover:opacity-80">
                📋 Pitch-Side Card
              </button>
              <button className="p-3 rounded-lg font-medium text-sm bg-purple-100 text-purple-900 hover:opacity-80">
                👥 Assistant Brief
              </button>
              <button className="p-3 rounded-lg font-medium text-sm bg-green-100 text-green-900 hover:opacity-80">
                👨‍👩‍👧 Parent Summary
              </button>
              <button className="p-3 rounded-lg font-medium text-sm bg-yellow-100 text-yellow-900 hover:opacity-80">
                ⬇️ Make Easier
              </button>
              <button className="p-3 rounded-lg font-medium text-sm bg-red-100 text-red-900 hover:opacity-80">
                ⬆️ Make Harder
              </button>
              <button className="p-3 rounded-lg font-medium text-sm bg-indigo-100 text-indigo-900 hover:opacity-80">
                🛡️ No Contact
              </button>
              <button
                onClick={() => setCurrentStep('adaptations')}
                className="p-3 rounded-lg font-medium text-sm bg-orange-100 text-orange-900 hover:opacity-80"
              >
                💪 Increase Contact
              </button>
              <button className="p-3 rounded-lg font-medium text-sm bg-pink-100 text-pink-900 hover:opacity-80">
                👤 Fewer Players
              </button>
              <button className="p-3 rounded-lg font-medium text-sm bg-cyan-100 text-cyan-900 hover:opacity-80">
                ⭐ 1-to-1
              </button>
              <button className="p-3 rounded-lg font-medium text-sm bg-teal-100 text-teal-900 hover:opacity-80">
                👫 Small Group
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 prose prose-sm max-w-none">
            <h2>Session Overview</h2>
            <p>Under 12 — Passing & Catching (60 min)</p>
            <p>RFU-informed, age-grade aware session plan for 15 boys players.</p>

            <h2>Principle Link</h2>
            <p>This session focuses on <strong>Support</strong>.</p>

            <h2>Session Aim</h2>
            <p>Players will develop their ability to execute <strong>Passing & Catching</strong> with accuracy and confidence.</p>

            <h2>APES Check</h2>
            <ul>
              <li><strong>Active:</strong> Players remain active throughout with minimal standing time</li>
              <li><strong>Purposeful:</strong> All activities link directly to Passing & Catching</li>
              <li><strong>Enjoyable:</strong> Game-based learning with clear progression</li>
              <li><strong>Safe:</strong> Age-appropriate contact level with clear coaching focus</li>
            </ul>

            <h2>Timed Session Plan</h2>
            <h3>Warm-Up / Game Readiness (10 minutes)</h3>
            <p>Get players active and engaged with a game that introduces the session theme.</p>

            <h3>Game Zone (15 minutes)</h3>
            <p>Small-sided game with conditions that encourage accurate passing and support play.</p>

            <h3>Skill Zone (20 minutes)</h3>
            <p>Focused skill practice with clear progressions on passing technique and decision-making.</p>

            <h3>Return to Game (10 minutes)</h3>
            <p>Apply the skill back into a game context with reduced conditions.</p>

            <h3>Cool-Down / Review (5 minutes)</h3>
            <p>Cool-down activity and reflection on learning.</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="font-bold text-yellow-900 mb-2">Coach Responsibility Note</p>
            <p className="text-sm text-yellow-800">
              This session is RFU-informed planning support. Coaches remain responsible for checking current RFU regulations, safeguarding requirements, first aid provision, venue risk assessments, player readiness, coaching competence and session suitability before delivery.
            </p>
          </div>
        </div>
      )}

      {/* Adaptations */}
      {currentStep === 'adaptations' && (
        <div className="max-w-4xl mx-auto py-8 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-primary mb-4">💪 Increase Contact — Adaptation</h1>
            <p className="text-gray-600 mb-4">
              This variant progresses the session with more contact elements, suitable for experienced players ready for increased intensity.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 prose prose-sm max-w-none">
            <h2>Increased Contact Version</h2>
            <p>Progression with more contact elements.</p>

            <h2>Key Changes</h2>
            <ul>
              <li>Progress from touch to controlled contact in Game Zone</li>
              <li>Introduce tackle technique in Skill Zone</li>
              <li>Add contact scenarios in Return to Game</li>
              <li>Ensure appropriate protective equipment</li>
              <li>Increase intensity and game-realism</li>
            </ul>

            <h2>Safety Considerations</h2>
            <ul>
              <li>Ensure players are physically and mentally ready for contact</li>
              <li>Progress gradually from controlled to dynamic contact</li>
              <li>Maintain appropriate player-to-coach ratio</li>
              <li>Have first aid provision available</li>
              <li>Check RFU contact guidelines for age group</li>
            </ul>

            <h2>Coaching Focus</h2>
            <ul>
              <li>Correct tackle technique and body position</li>
              <li>Safe landing and ball protection</li>
              <li>Communication and support</li>
              <li>Intensity management</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="font-bold text-blue-900 mb-2">💡 Key Feature</p>
            <p className="text-sm text-blue-800">
              One-tap adaptations let coaches instantly create variants for different needs — no re-planning required. All 10 adaptations are saved to the coach's library for future reference.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
