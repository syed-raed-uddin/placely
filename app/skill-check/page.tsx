'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import { CourseCard } from '@/components/skill-check/CourseCard';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://placely-backend-production.up.railway.app/api';

const COURSES = [
  {
    slug: 'python',
    name: 'Python',
    title: 'Python Diagnostic Assessment',
    tagline: 'Python Core & Problem Solving',
    icon: 'python',
    description: 'Diagnose your strengths in Python syntax, data structures, OOP, file handling, and algorithmic thinking.',
    domains: ['Syntax & Types', 'Data Structures', 'OOP & Functions', 'Algorithms', 'Error Handling'],
    estimated_minutes: 20,
    question_count: 25,
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    title: 'Full-Stack Web Dev Diagnostic Assessment',
    tagline: 'Full-Stack Web Engineering',
    icon: 'globe',
    description: 'Evaluate your mastery across HTML5, modern CSS/flexbox/grid, REST APIs, HTTP, backend architecture, and security.',
    domains: ['HTML5 & DOM', 'CSS3 & Responsive', 'JavaScript/DOM', 'REST & HTTP', 'Web Security'],
    estimated_minutes: 20,
    question_count: 25,
  },
  {
    slug: 'java',
    name: 'Java',
    title: 'Java & OOP Diagnostic Assessment',
    tagline: 'Java Core & Object-Oriented Design',
    icon: 'coffee',
    description: 'Benchmark your knowledge in Core Java, Collections Framework, Multithreading, JVM internals, and design patterns.',
    domains: ['Core Syntax', 'OOP Concepts', 'Collections Framework', 'Exceptions & IO', 'Concurrency'],
    estimated_minutes: 20,
    question_count: 25,
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    title: 'Modern JavaScript Diagnostic Assessment',
    tagline: 'Modern JS & Async Systems',
    icon: 'code',
    description: 'Test your deep understanding of Closures, Event Loop, Promises/Async-Await, Prototypes, ES6+ features, and DOM.',
    domains: ['ES6+ Syntax', 'Closures & Scope', 'Async & Event Loop', 'Prototypes & Classes', 'Error Handling'],
    estimated_minutes: 20,
    question_count: 25,
  },
];

export default function SkillCheckSelectionPage() {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartCourse = async (courseSlug: string) => {
    setLoadingSlug(courseSlug);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/skill-check/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: courseSlug,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to initialize assessment.');
      }

      const data = await res.json();
      if (typeof window !== 'undefined' && data.session_secret) {
        localStorage.setItem(`skill_check_${data.id}_secret`, data.session_secret);
      }
      router.push(`/skill-check/${data.id}?secret=${data.session_secret}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong starting your assessment.');
      setLoadingSlug(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090F] text-white flex flex-col justify-between selection:bg-[#FF7A00]/30 selection:text-[#FF7A00]">
      {/* Top Header Navigation */}
      <header className="border-b border-white/5 bg-[#07090F]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <Link href="/" className="font-bold text-lg tracking-tight font-mono">
              Placely <span className="text-[#FF7A00] text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 ml-1">SKILL CHECK</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Free · No Credit Card</span>
            </div>
            <Link
              href="/#join"
              className="text-xs font-medium text-white/80 hover:text-white px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              View Full Programs
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Title and Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-xs font-semibold text-[#FF7A00] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest Technical Diagnosis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Choose Your Assessment Track
          </h1>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed">
            Select the technical domain you want to test. In 20 minutes, discover your exact competency gaps, strengths, and areas requiring improvement before interviews.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* 4 Track Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {COURSES.map((c) => (
            <CourseCard
              key={c.slug}
              course={c}
              onSelect={handleStartCourse}
              isLoading={loadingSlug !== null}
            />
          ))}
        </div>

        {/* Value Prop Banner */}
        <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-white/[0.02] border border-white/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-semibold text-white">How the Skill Check works</h4>
            <p className="text-xs sm:text-sm text-white/60">
              25 carefully calibrated questions • Instant domain breakdown • Actionable roadmap recommendations.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-xs text-[#FF7A00] font-medium bg-[#FF7A00]/10 px-3 py-1.5 rounded-lg border border-[#FF7A00]/20">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Analysis</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/40">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Placely. Free Public Assessment Engine.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">Commercial Website</Link>
            <Link href="/#how" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="/#join" className="hover:text-white transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
