'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Bug, ArrowLeft, Loader2, Play, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function BugHunterPage() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<any>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [isPending, startTransition] = useTransition();

  const loadChallenge = async (diff: string = difficulty) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiClient<any>(`/bug_hunter/challenge?difficulty=${diff}`);
      setChallenge(data);
      setCode(data.code_snippet);
    } catch (err: any) {
      setError(err.message || 'Failed to load bug challenge');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenge();
  }, []);

  const handleDifficultyChange = (diff: string) => {
    setDifficulty(diff);
    loadChallenge(diff);
  };

  const handleSubmit = async () => {
    if (!code.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const resp = await apiClient<any>('/bug_hunter/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          challenge_id: challenge.id,
          student_code: code
        })
      });
      setResult(resp);
      
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Bug className="w-6 h-6" />
            </div>
            Bug Hunter
          </h1>
          <p className="text-white/50 mt-2 text-sm">Find and fix the bugs in the code snippet to earn XP.</p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
          {['easy', 'medium', 'hard'].map((d) => (
            <button
              key={d}
              onClick={() => handleDifficultyChange(d)}
              disabled={loading}
              className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-colors ${
                difficulty === d 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32 border border-white/10 rounded-3xl bg-white/5">
          <Loader2 className="w-8 h-8 animate-spin text-red-400" />
        </div>
      ) : error && !challenge ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 py-20">
          <p className="font-semibold">{error}</p>
          <button 
            onClick={() => loadChallenge()}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      ) : challenge ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
          {/* Left Side: Challenge Details */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col overflow-y-auto">
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-red-400 border border-red-500/20 px-2 py-1 rounded-md bg-red-500/10">
                  {challenge.language || 'Code'}
                </span>
                <button
                  onClick={() => loadChallenge()}
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Skip
                </button>
              </div>
              <h2 className="text-xl font-bold text-white mt-2">{challenge.title}</h2>
            </div>
            
            <div className="prose prose-invert prose-red max-w-none">
              <p className="text-white/80 whitespace-pre-wrap leading-relaxed text-sm">
                {challenge.description}
              </p>
            </div>
            
            {!result && (
               <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                 <p className="text-xs text-amber-400 font-semibold mb-1">Mission:</p>
                 <p className="text-sm text-white/90">Find the bug and fix it. Click &quot;Verify Fix&quot; when you&apos;re done.</p>
               </div>
            )}
          </div>

          {/* Right Side: Code Editor & Results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
              <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Fix the Code</span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || isPending}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Verify Fix
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-transparent text-red-50 p-4 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
                disabled={submitting}
              />
            </div>

            {/* Results Panel */}
            {result && (
              <div className={`p-4 rounded-xl border ${result.is_passing ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'} animate-in fade-in slide-in-from-bottom-4`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.is_passing ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-400" />
                  )}
                  <h3 className={`font-bold ${result.is_passing ? 'text-green-400' : 'text-amber-400'}`}>
                    {result.is_passing ? 'Bug Squashed!' : 'Bug Still Exists'}
                  </h3>
                </div>
                <p className="text-sm text-white/80 whitespace-pre-wrap font-medium leading-relaxed">
                  {result.feedback}
                </p>
                
                {result.is_passing ? (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => loadChallenge()}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                    >
                      Next Bug
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setResult(null)}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                    >
                      Keep Trying
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
