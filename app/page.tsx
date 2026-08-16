'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BrainCircuit,
  Terminal,
  Globe,
  Coffee,
  Code2,
  CheckCircle2,
  BarChart3,
  Lock,
} from 'lucide-react';
import { CourseCard } from '@/components/skill-check/CourseCard';
import { API_BASE } from '@/lib/api';

const COURSES = [
  {
    slug: 'python',
    name: 'Python',
    title: 'Python Developer Skill Check',
    icon: 'python',
    tagline: '🐍 Python',
    description: 'Test your Python fundamentals, control flow, functions, OOP, data structures, and debugging knowledge.',
    domains: ['Fundamentals & Types', 'Control Flow', 'Functions & Scoping', 'OOP & Classes', 'Data Structures', 'Debugging'],
    estimated_minutes: 15,
    question_count: 25,
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    title: 'Full Stack Web Development Skill Check',
    icon: 'globe',
    tagline: '🌐 Web Development',
    description: 'Test your understanding of HTML semantics, CSS box model/Flexbox/Grid, DOM manipulation, APIs, and security.',
    domains: ['HTML & Semantics', 'CSS Layout & Box Model', 'DOM Manipulation', 'HTTP & REST APIs', 'Security', 'Debugging'],
    estimated_minutes: 15,
    question_count: 25,
  },
  {
    slug: 'java',
    name: 'Java',
    title: 'Java Developer Skill Check',
    icon: 'coffee',
    tagline: '☕ Java',
    description: 'Test your Java fundamentals, OOP, collections framework, exceptions, multithreading, and JVM memory management.',
    domains: ['Java Fundamentals', 'OOP & Interfaces', 'Collections Framework', 'Exceptions', 'Memory & JVM', 'Streams & Lambdas'],
    estimated_minutes: 15,
    question_count: 25,
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    title: 'JavaScript Core & Modern ES6+ Skill Check',
    icon: 'code',
    tagline: '🟨 JavaScript',
    description: 'Test your JavaScript fundamentals, closures, lexical scoping, Event Loop, asynchronous programming, and modern ES6+.',
    domains: ['JS Fundamentals & Types', 'Scoping & Hoisting', 'Closures & Functions', 'Async & Event Loop', 'Prototypes & OOP', 'Modern ES6+'],
    estimated_minutes: 15,
    question_count: 25,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [loadingTrack, setLoadingTrack] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Track landing page visit
  useEffect(() => {
    try {
      fetch(`${API_BASE}/skill-check/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_name: 'landing_view' }),
      }).catch(() => {});
    } catch (e) {}
  }, []);

  const handleStartSkillCheck = async (courseSlug: string) => {
    setLoadingTrack(courseSlug);
    setErrorMessage(null);

    try {
      // Log track selected event
      fetch(`${API_BASE}/skill-check/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_name: 'track_selected', course: courseSlug }),
      }).catch(() => {});

      const res = await fetch(`${API_BASE}/skill-check/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: courseSlug }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to initialize assessment.');
      }

      const data = await res.json();
      if (data.id && data.session_secret) {
        // Cache secret for authentication
        if (typeof window !== 'undefined') {
          localStorage.setItem(`skill_check_${data.id}_secret`, data.session_secret);
        }
        router.push(`/skill-check/${data.id}`);
      } else {
        throw new Error('Invalid session payload received.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not start assessment. Please try again.');
      setLoadingTrack(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Placely
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-medium text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Sign In
            </Link>
            <a
              href="#tracks"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Take Free Skill Check</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-16 pb-12 md:pt-24 md:pb-20 max-w-6xl mx-auto w-full text-center">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FREE TECHNICAL BENCHMARK • NO LOGIN REQUIRED</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Are You Actually{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Job-Ready?
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
            Test your technical skills across 25 real-world engineering questions, expose your hidden skill gaps, and get an instant diagnostic roadmap.
          </p>

          {/* Quick trust metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-white/60 mb-12">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>25 Questions per Track</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Deterministic Grading</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Gap Diagnosis</span>
            </div>
          </div>
        </div>

        {/* Error notification if start fails */}
        {errorMessage && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}

        {/* Track Selection Cards */}
        <div id="tracks" className="text-left scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Select Your Technical Track
              </h2>
              <p className="text-xs sm:text-sm text-white/50">
                Choose a language or domain to start your diagnostic assessment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COURSES.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                isLoading={loadingTrack === course.slug}
                onSelect={handleStartSkillCheck}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Placely Skill Check Section */}
      <section className="border-t border-white/10 bg-[#0E0E0E] py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
              BEYOND SIMPLE TRIVIA
            </h3>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              What This Skill Check Actually Evaluates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Code-Output Tracing</h4>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Test your ability to trace execution, predict outputs, and understand how memory, scope, and closures behave at runtime.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Real-World Debugging</h4>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Identify hidden edge-case bugs, concurrency race conditions, mutable defaults, and DOM event memory leaks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Domain-Wise Precision</h4>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Receive granular scores across 8+ technical domains rather than a vague overall percentage score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-8 px-4 sm:px-6 text-center text-xs text-white/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white/80">Placely</span>
            <span>— AI-Powered Student Placement & Skill Acceleration</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Student Login
            </Link>
            <span>•</span>
            <a href="#tracks" className="hover:text-white transition-colors">
              Take Free Assessment
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
