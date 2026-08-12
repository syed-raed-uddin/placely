'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Shield, ArrowLeft, Loader2, Send, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDefensePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [defense, setDefense] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function startDefense() {
      try {
        const data = await apiClient<any>('/project_defense/generate', {
          method: 'POST',
          body: JSON.stringify({ student_project_id: params.id })
        });
        setDefense(data);
      } catch (err: any) {
        setError(err.message || 'Failed to start defense session');
      } finally {
        setLoading(false);
      }
    }
    startDefense();
  }, [params.id]);

  const handleSubmit = async () => {
    if (!answer.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const resp = await apiClient<any>('/project_defense/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          defense_id: defense.id,
          student_answer: answer
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error && !defense) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-8 shadow-xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Project Defense</h1>
            <p className="text-white/50 text-sm">Explain your technical decisions to AI Senior Engineer Kiro.</p>
          </div>
        </div>

        {defense && !result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">Question from Kiro</span>
              <p className="text-white/90 text-lg leading-relaxed font-medium">
                &quot;{defense.question}&quot;
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-white/70">Your Explanation</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Be detailed. Explain why you chose this approach, any alternatives you considered, and how it works..."
                className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white/90 text-sm focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed"
                disabled={submitting}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting || !answer.trim() || isPending}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-purple-600/20"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Submit Defense
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in zoom-in-95">
            <div className={`p-6 rounded-2xl border ${result.is_passing ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
              <div className="flex items-center gap-3 mb-4">
                {result.is_passing ? (
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-amber-400" />
                  </div>
                )}
                <div>
                  <h2 className={`text-xl font-bold ${result.is_passing ? 'text-green-400' : 'text-amber-400'}`}>
                    {result.is_passing ? 'Defense Successful!' : 'Needs Elaboration'}
                  </h2>
                  <p className="text-white/60 text-sm">
                    {result.is_passing ? 'You proved your technical understanding.' : 'Kiro needs more details.'}
                  </p>
                </div>
              </div>

              <div className="bg-black/30 rounded-xl p-4 text-sm text-white/80 leading-relaxed font-medium">
                {result.feedback}
              </div>
              
              {result.is_passing && result.competency_update && (
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-green-400 text-sm font-bold">
                  <span>+ Competency Evidence Recorded</span>
                  {result.competency_update.xp_awarded && <span>(+XP Awarded)</span>}
                </div>
              )}
            </div>

            {!result.is_passing && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswer('');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
