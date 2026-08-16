'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { API_BASE } from '@/lib/api';

interface AnalyticsData {
  total_starts: number;
  total_completed: number;
  completion_rate_pct: number;
  average_overall_score: number;
  course_distribution: Record<string, number>;
  top_weak_domains: [string, number][];
  performance_distribution: Record<string, number>;
  funnel_events: Record<string, number>;
}

export default function AdminSkillCheckAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [adminSecret, setAdminSecret] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAnalytics = async (secret: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE}/skill-check/admin/analytics`, {
        headers: {
          'X-Admin-Secret': secret,
        },
      });

      if (!res.ok) {
        throw new Error('Invalid admin secret key or unauthorized access.');
      }

      const data: AnalyticsData = await res.json();
      setAnalytics(data);
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('placely_admin_secret', secret);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate admin access.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('placely_admin_secret');
    if (saved) {
      setAdminSecret(saved);
      fetchAnalytics(saved);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#121212] border border-white/10 text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <BarChart3 className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">Skill Check Admin Analytics</h1>
            <p className="text-xs text-white/50 mt-1">
              Enter your founder admin secret key to view the public acquisition funnel.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (adminSecret) fetchAnalytics(adminSecret);
            }}
            className="space-y-4"
          >
            <input
              type="password"
              placeholder="Admin Secret Key"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />

            {errorMessage && (
              <p className="text-xs text-red-400">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !adminSecret}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all disabled:opacity-40"
            >
              {isLoading ? 'Authenticating...' : 'Access Analytics'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Skill Check Acquisition Funnel
            </h1>
            <p className="text-xs text-white/50">
              Real-time analytics for free public benchmark assessments.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchAnalytics(adminSecret)}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 transition-colors"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Metrics'}
        </button>
      </div>

      {analytics && (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#121212] border border-white/10">
              <span className="text-xs font-medium text-white/50 block mb-1">Total Starts</span>
              <span className="text-2xl md:text-3xl font-extrabold text-white">
                {analytics.total_starts}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-[#121212] border border-white/10">
              <span className="text-xs font-medium text-white/50 block mb-1">Completions</span>
              <span className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                {analytics.total_completed}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-[#121212] border border-white/10">
              <span className="text-xs font-medium text-white/50 block mb-1">Completion Rate</span>
              <span className="text-2xl md:text-3xl font-extrabold text-cyan-400">
                {analytics.completion_rate_pct}%
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-[#121212] border border-white/10">
              <span className="text-xs font-medium text-white/50 block mb-1">Average Score</span>
              <span className="text-2xl md:text-3xl font-extrabold text-amber-400">
                {analytics.average_overall_score}%
              </span>
            </div>
          </div>

          {/* Breakdown Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Popularity */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
                Course Distribution
              </h3>
              <div className="space-y-2.5">
                {Object.entries(analytics.course_distribution).map(([course, count]) => (
                  <div key={course} className="flex items-center justify-between text-xs py-1">
                    <span className="text-white/80 capitalize font-medium">{course}</span>
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-white/5">
                      {count} sessions
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Diagnosed Gaps */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
                Most Common Skill Gaps
              </h3>
              <div className="space-y-2.5">
                {analytics.top_weak_domains.length === 0 ? (
                  <p className="text-xs text-white/40 italic">No completed assessments yet.</p>
                ) : (
                  analytics.top_weak_domains.map(([domain, count]) => (
                    <div key={domain} className="flex items-center justify-between text-xs py-1">
                      <span className="text-amber-300 font-medium">{domain}</span>
                      <span className="font-bold text-white px-2 py-0.5 rounded bg-white/5">
                        {count} students
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Acquisition Funnel Events */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
              Acquisition Funnel Events
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
              {Object.entries(analytics.funnel_events).map(([event, count]) => (
                <div key={event} className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/50 text-[11px] block truncate mb-1">{event}</span>
                  <span className="text-lg font-bold text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
