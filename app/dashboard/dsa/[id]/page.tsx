'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Code2, ArrowLeft, Loader2, Play, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function DSAProblemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadProblem() {
      try {
        const data = await apiClient<any>(`/dsa/problems/${params.id}`);
        setProblem(data.problem);
        // Basic starter code
        setCode(`def solve():\n    # Write your code here\n    pass`);
      } catch (err: any) {
        setError(err.message || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [params.id]);

  const handleSubmit = async () => {
    if (!code.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const resp = await apiClient<any>('/dsa/review', {
        method: 'POST',
        body: JSON.stringify({
          problem_id: params.id,
          code: code
        })
      });
      setResult(resp);
      
      // Refresh the dashboard data (XP, Streak) asynchronously so the UI updates
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
      </div>
    );
  }

  if (error && !problem) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <Link href="/dashboard/dsa" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to Problems
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
        {/* Left Side: Problem Details */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col overflow-y-auto">
          <div className="mb-6 space-y-3">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-6 h-6 text-[#FF7A00]" /> {problem.title}
            </h1>
            <div className="flex gap-2 text-xs font-semibold">
              <span className={`px-2 py-1 rounded-md ${
                problem.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                problem.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {problem.difficulty.toUpperCase()}
              </span>
              <span className="bg-white/5 border border-white/10 text-white/70 px-2 py-1 rounded-md">
                {problem.topic}
              </span>
            </div>
          </div>
          
          <div className="prose prose-invert prose-orange max-w-none mb-6">
            <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{problem.plain_english_desc}</p>
            
            <h3 className="text-lg font-bold text-white mt-6 mb-2">Technical Description</h3>
            <p className="text-white/80 whitespace-pre-wrap leading-relaxed font-mono text-sm bg-black/30 p-4 rounded-xl border border-white/5">{problem.technical_desc}</p>
          </div>
        </div>

        {/* Right Side: Code Editor & Results */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
            <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Solution (Python)</span>
              <button
                onClick={handleSubmit}
                disabled={submitting || isPending}
                className="flex items-center gap-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Submit
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent text-white/90 p-4 font-mono text-sm focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
              disabled={submitting}
            />
          </div>

          {/* Results Panel */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {result && (
            <div className={`p-4 rounded-xl border ${result.review.passed ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'} animate-in fade-in slide-in-from-bottom-4`}>
              <div className="flex items-center gap-2 mb-2">
                {result.review.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-400" />
                )}
                <h3 className={`font-bold ${result.review.passed ? 'text-green-400' : 'text-amber-400'}`}>
                  {result.review.passed ? 'Accepted!' : 'Review Feedback'}
                </h3>
              </div>
              <p className="text-sm text-white/80 whitespace-pre-wrap font-medium">
                {result.review.feedback}
              </p>
              
              {result.execution && result.execution.execution_status && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <span className="text-xs font-bold text-white/40 uppercase block mb-1">Execution Status</span>
                  <span className="text-sm text-white/70 font-mono bg-black/40 px-2 py-1 rounded">
                    {result.execution.execution_status}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
