'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { method: 'GET' });
        if (response.ok) {
          setIsLoggedIn(true);
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const slides = [
    {
      title: 'Step 1: Create Your Session',
      description: 'Define your session parameters - age group, duration, player count, and coaching focus',
      placeholder: '/carousel-1.png',
    },
    {
      title: 'Step 2: AI-Powered Planning',
      description: 'Get an RFU-aligned session plan with warm-up, main activities, and cool-down',
      placeholder: '/carousel-2.png',
    },
    {
      title: 'Step 3: Adapt & Customize',
      description: 'Make it easier or harder, adjust for different abilities, or modify for your squad',
      placeholder: '/carousel-3.png',
    },
    {
      title: 'Step 4: Generate Briefs',
      description: 'Create tailored briefs for coaches, assistants, and parents in seconds',
      placeholder: '/carousel-4.png',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation */}
      <nav className="bg-primary border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Rugby Practice Planner" width={120} height={120} className="h-12 w-auto" />
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#home" className="text-white hover:text-accent transition">Home</a>
            <a href="#features" className="text-white hover:text-accent transition">Features</a>
            <a href="#process" className="text-white hover:text-accent transition">Process</a>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="text-white hover:text-accent transition font-semibold">
              Sign In
            </Link>
            <Link href="/auth/register" className="bg-accent hover:opacity-90 text-primary font-bold py-2 px-4 rounded-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                RFU-Aligned<br />
                <span className="text-accent">Coaching Sessions</span>
              </h1>
              <div className="w-24 h-1 bg-accent mb-6"></div>
              <p className="text-xl text-slate-300 mb-8">
                AI-powered session planning for every age group and ability level. Create professional coaching plans in minutes.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-accent hover:opacity-90 text-primary font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
              >
                Get Started Free <span>→</span>
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

      {/* Process Carousel Section */}
      <section id="process" className="bg-primary py-20 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-center mb-12 text-lg">
            Create a complete coaching session in four simple steps
          </p>

          {/* Carousel */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden border-2 border-accent">
              {/* Slide Container */}
              <div className="relative h-96 md:h-[500px] overflow-hidden">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {/* Placeholder for image - users will add their own */}
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📸</div>
                        <p className="text-slate-400 text-lg font-semibold">Carousel Image {index + 1}</p>
                        <p className="text-slate-500 text-sm mt-2">Replace with your screenshot</p>
                        <p className="text-slate-600 text-xs mt-4 max-w-xs mx-auto">
                          Recommended size: 1200x600px
                        </p>
                      </div>
                    </div>

                    {/* Text Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                      <p className="text-slate-300">{slide.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-accent hover:opacity-90 text-primary font-bold w-12 h-12 rounded-full flex items-center justify-center transition"
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-accent hover:opacity-90 text-primary font-bold w-12 h-12 rounded-full flex items-center justify-center transition"
              >
                →
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === currentSlide ? 'bg-accent' : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Slide Counter */}
            <div className="text-center mt-6 text-slate-400">
              Slide {currentSlide + 1} of {slides.length}
            </div>
          </div>
        </div>
      </section>

      {/* Full Plan Section */}
      <section className="bg-slate-900 py-20 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Complete Session Plans
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Every session includes a detailed plan with warm-up, main activities, cool-down, and coaching cues. Perfect for preparation and delivery.
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Structured warm-up activities</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Progressive main activities</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Cool-down & reflection</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Coaching points & tips</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-800 rounded-xl p-8 border-2 border-accent h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-slate-400 text-lg font-semibold">Full Plan Image</p>
                <p className="text-slate-500 text-sm mt-2">Add your full session plan screenshot here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parents Brief Section */}
      <section className="bg-primary py-20 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-900 rounded-xl p-8 border-2 border-accent h-96 flex items-center justify-center order-2 md:order-1">
              <div className="text-center">
                <div className="text-6xl mb-4">👨‍👩‍👧</div>
                <p className="text-slate-400 text-lg font-semibold">Parents Brief Image</p>
                <p className="text-slate-500 text-sm mt-2">Add your parents brief screenshot here</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-white mb-4">
                Parents Brief
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Keep parents informed with a clear, concise brief explaining the session focus, what their child will learn, and how they can support at home.
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Session objectives in plain language</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Key learning points</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>How to support at home</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Safety information</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Assistant Coach Brief Section */}
      <section className="bg-slate-900 py-20 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Assistant Coach Brief
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Give your assistant coaches all the information they need to support the session effectively. Clear instructions and coaching cues included.
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Detailed activity instructions</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Coaching cues & key points</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Progression & regression options</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>Safety considerations</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-800 rounded-xl p-8 border-2 border-accent h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">👨‍🏫</div>
                <p className="text-slate-400 text-lg font-semibold">Assistant Coach Brief Image</p>
                <p className="text-slate-500 text-sm mt-2">Add your assistant coach brief screenshot here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Ready to create better sessions?</h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:opacity-90 text-primary font-bold py-3 px-8 rounded-lg transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 border-2 border-accent text-accent hover:bg-accent hover:text-primary font-bold py-3 px-8 rounded-lg transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>Rugby Practice Planner • Better Coaching. Better Players. Better Game.</p>
        </div>
      </footer>
    </div>
  );
}
