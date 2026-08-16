'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  BarChart3,
  Loader2,
  HelpCircle,
  BrainCircuit,
  Zap,
} from 'lucide-react';
import { PlacelyBasicCTA } from '@/components/skill-check/PlacelyBasicCTA';
import { API_BASE } from '@/lib/api';

interface AreaItem {
  domain: string;
  score: number;
}

interface ResultData {
  id: string;
  course: string;
  course_meta?: any;
  overall_score: number;
  performance_label: string;
  domain_scores: Record<string, any>;
  strong_areas: AreaItem[];
  developing_areas: AreaItem[];
  weak_areas: AreaItem[];
  unassessed_areas: string[];
  biggest_gap: string;
  gap_analysis: string;
  recommended_next_step: string;
}

export default function SkillCheckResultPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;

  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const secret =
      (typeof window !== 'undefined' && localStorage.getItem(`skill_check_${sessionId}_secret`)) ||
      new URLSearchParams(window.location.search).get('secret') ||
      '';

    async function fetchResult() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/skill-check/session/${sessionId}/result`, {
          headers: {
            'X-Skill-Check-Secret': secret,
          },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Diagnostic result not available.');
        }

        const data: ResultData = await res.json();
        setResult(data);

        // Log result view event
        fetch(`${API_BASE}/skill-check/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_name: 'result_viewed',
            session_id: sessionId,
            course: data.course,
            metadata: { overall_score: data.overall_score },
          }),
        }).catch(() => {});
      } catch (err: any) {
        setErrorMessage(err.message || 'Unable to retrieve diagnostic report.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchResult();
  }, [sessionId]);

  const handleCtaClick = (ctaType: string) => {
    try {
      fetch(`${API_BASE}/skill-check/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'basic_cta_clicked',
          session_id: sessionId,
          course: result?.course,
          metadata: { cta_type: ctaType },
        }),
      }).catch(() => {});
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
        <p className="text-sm font-medium text-white/70">Generating Diagnostic Report...</p>
      </div>
    );
  }

  if (errorMessage || !result) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Result Report Not Available</h2>
        <p className="text-sm text-white/60 max-w-md mb-6">
          {errorMessage || 'This assessment has not been completed yet.'}
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const getBadgeColor = (label: string) => {
    switch (label) {
      case 'Strong':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'Developing':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'Needs Improvement':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'Foundational':
      default:
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-black text-base">
              P
            </div>
            <span className="font-bold text-base tracking-tight text-white">Placely</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Test</span>
          </Link>
        </div>
      </header>

      {/* Main Diagnostic Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full space-y-10">
        {/* Score Overview Card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#121212] border border-white/10 p-6 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>DIAGNOSTIC BENCHMARK REPORT</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {result.course_meta?.name || result.course} Skill Check Result
              </h1>

              <p className="text-sm md:text-base text-white/60 leading-relaxed">
                Based on your performance across 25 technical questions, your current technical baseline is{' '}
                <strong className="text-white">{result.overall_score}%</strong> ({result.performance_label}).
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span
                  className={`px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getBadgeColor(
                    result.performance_label
                  )}`}
                >
                  Status: {result.performance_label}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
                  Assessed Domains: {Object.keys(result.domain_scores).length}
                </span>
              </div>
            </div>

            {/* Overall Score Circle */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/50 border border-white/10 shrink-0 w-44 h-44 shadow-inner">
              <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 tracking-tight">
                {result.overall_score}%
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mt-1">
                Assessed Score
              </span>
            </div>
          </div>
        </section>

        {/* Dynamic Gap Diagnosis Callout */}
        <section className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#161616] to-[#121212] border border-amber-500/30 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>PRIMARY SKILL GAP IDENTIFIED</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Your Biggest Gap: <span className="text-amber-300">{result.biggest_gap}</span>
          </h3>

          <p className="text-sm md:text-base text-white/80 leading-relaxed">
            {result.gap_analysis}
          </p>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">
                Recommended Next Step
              </h4>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                {result.recommended_next_step}
              </p>
            </div>
          </div>
        </section>

        {/* Domain-Wise Performance Matrix */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Domain-Wise Performance Breakdown
            </h2>
            <span className="text-xs text-white/50 font-medium">Deterministic Evaluation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Strongest Areas */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strong Areas (&ge; 80%)</span>
                </span>
                <span className="text-xs text-white/40">{result.strong_areas.length} Domains</span>
              </div>

              {result.strong_areas.length === 0 ? (
                <p className="text-xs text-white/40 italic py-2">No domains met the 80%+ threshold.</p>
              ) : (
                <div className="space-y-3">
                  {result.strong_areas.map((a) => (
                    <div key={a.domain} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white/80">{a.domain}</span>
                        <span className="font-bold text-emerald-400">{a.score}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${a.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Developing Areas */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Developing Areas (60–79%)</span>
                </span>
                <span className="text-xs text-white/40">{result.developing_areas.length} Domains</span>
              </div>

              {result.developing_areas.length === 0 ? (
                <p className="text-xs text-white/40 italic py-2">No domains in the 60–79% range.</p>
              ) : (
                <div className="space-y-3">
                  {result.developing_areas.map((a) => (
                    <div key={a.domain} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white/80">{a.domain}</span>
                        <span className="font-bold text-blue-400">{a.score}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${a.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weak Areas */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Weak Areas (&lt; 60%)</span>
                </span>
                <span className="text-xs text-white/40">{result.weak_areas.length} Domains</span>
              </div>

              {result.weak_areas.length === 0 ? (
                <p className="text-xs text-white/40 italic py-2">No weak domains identified.</p>
              ) : (
                <div className="space-y-3">
                  {result.weak_areas.map((a) => (
                    <div key={a.domain} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white/80">{a.domain}</span>
                        <span className="font-bold text-amber-400">{a.score}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${a.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Areas Not Assessed */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Areas Not Assessed</span>
                </span>
                <span className="text-xs text-white/40">{result.unassessed_areas.length} Domains</span>
              </div>

              {result.unassessed_areas.length === 0 ? (
                <p className="text-xs text-white/40 italic py-2">All configured course domains were evaluated.</p>
              ) : (
                <div className="space-y-2">
                  {result.unassessed_areas.map((domain) => (
                    <div
                      key={domain}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs"
                    >
                      <span className="text-white/70">{domain}</span>
                      <span className="text-[10px] font-semibold text-white/40 px-2 py-0.5 rounded bg-white/5">
                        UNKNOWN / NOT ASSESSED
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Diagnostic-to-Conversion Placely Basic CTA */}
        <section className="pt-4">
          <PlacelyBasicCTA
            biggestGap={result.biggest_gap}
            courseName={result.course_meta?.name || result.course}
            onCtaClick={handleCtaClick}
          />
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-8 px-4 sm:px-6 text-center text-xs text-white/40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white/80">Placely</span>
            <span>— Free Public Skill Benchmark</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Student Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
