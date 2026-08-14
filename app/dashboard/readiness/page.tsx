'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { ShieldCheck, Loader2, Play, CheckCircle, XCircle, ArrowRight, Activity } from 'lucide-react';

export default function ReadinessPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [session, setSession] = useState<any>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [question, setQuestion] = useState<any>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [answer, setAnswer] = useState<any>('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [finalResult, setFinalResult] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchRoles() {
      try {
        const resp = await apiClient<any>('/career/roles');
        setRoles(resp.roles || []);
        if (resp.roles?.length > 0) setSelectedRoleId(resp.roles[0].id);
      } catch (err: any) {
        setError(err.message || 'Failed to load roles');
      } finally {
        setLoadingRoles(false);
      }
    }
    fetchRoles();
  }, []);

  const handleStart = async () => {
    if (!selectedRoleId) return;
    setSubmitting(true);
    setError(null);
    try {
      const resp = await apiClient<any>('/readiness/start', {
        method: 'POST',
        body: JSON.stringify({ role_id: selectedRoleId })
      });
      setSession(resp);
      setCurrentQuestionIdx(0);
      await loadQuestion(resp.question_set[0]);
    } catch (err: any) {
      setError(err.message || 'Failed to start test');
    } finally {
      setSubmitting(false);
    }
  };

  const loadQuestion = async (qId: string) => {
    setLoadingQuestion(true);
    setAnswer('');
    setEvaluation(null);
    try {
      const q = await apiClient<any>(`/readiness/questions/${qId}`);
      setQuestion(q);
    } catch (err: any) {
      setError(err.message || 'Failed to load question');
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer || submitting || !session || !question) return;
    setSubmitting(true);
    setError(null);

    const payload = question.question_type === 'deterministic_mcq' 
      ? { option: answer } 
      : { text: answer };

    try {
      const resp = await apiClient<any>(`/readiness/${session.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          question_id: question.id,
          answer: payload
        })
      });
      setEvaluation(resp.evaluation_result);
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIdx < session.question_set.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      await loadQuestion(session.question_set[nextIdx]);
    } else {
      // Complete test
      setSubmitting(true);
      try {
        const resp = await apiClient<any>(`/readiness/${session.id}/complete`, { method: 'POST' });
        setFinalResult(resp);
      } catch (err: any) {
        setError(err.message || 'Failed to complete test');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (finalResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8 animate-in fade-in zoom-in-95">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Test Completed</h1>
          <p className="text-white/50 text-lg">Your readiness assessment is ready.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
          <div className="flex flex-col items-center justify-center border-b border-white/10 pb-8">
            <div className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Overall Status</div>
            <div className={`text-5xl font-black capitalize ${
              finalResult.overall_status === 'ready' ? 'text-emerald-400' :
              finalResult.overall_status === 'partial' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {finalResult.overall_status.replace('_', ' ')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">Domain Scores</h3>
              <div className="space-y-3">
                {Object.entries(finalResult.domain_scores || {}).map(([domain, score]: [string, any]) => {
                  if (score === "UNKNOWN / NOT ASSESSED") return null;
                  const percent = Math.round(score * 100);
                  return (
                    <div key={domain} className="bg-black/20 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                      <span className="text-white/80 font-bold">{domain}</span>
                      <span className={`font-bold ${percent >= 75 ? 'text-emerald-400' : percent >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {finalResult.strengths?.map((s: string) => (
                    <li key={s} className="flex items-center gap-2 text-white/80 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> {s}
                    </li>
                  ))}
                  {!finalResult.strengths?.length && <li className="text-white/40 text-sm">Keep practicing!</li>}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">Areas to Improve</h3>
                <ul className="space-y-2">
                  {finalResult.weaknesses?.map((w: string) => (
                    <li key={w} className="flex items-center gap-2 text-white/80 text-sm">
                      <XCircle className="w-4 h-4 text-red-400" /> {w}
                    </li>
                  ))}
                  {!finalResult.weaknesses?.length && <li className="text-white/40 text-sm">None identified!</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => { setFinalResult(null); setSession(null); }}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              Back to Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (session && question) {
    const isMcq = question.question_type === 'deterministic_mcq';
    // Backend normalizes to array in both question.options and question.metadata.options
    const rawOptions = question.options || question.metadata?.options || [];
    // Guard: if somehow still a dict (should not happen after backend fix), extract values
    const options: string[] = Array.isArray(rawOptions)
      ? rawOptions
      : Object.values(rawOptions as Record<string, string>);

    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Readiness Test</h1>
              <p className="text-white/50 text-xs uppercase tracking-wider font-bold">
                Question {currentQuestionIdx + 1} of {session.question_set.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-bold uppercase tracking-wider border border-white/5">
              {question.domain}
            </span>
          </div>

          <h2 className="text-xl font-medium text-white/90 leading-relaxed pr-20 pt-4">
            {question.prompt}
          </h2>

          {!evaluation ? (
            <div className="space-y-4 pt-4">
              {isMcq ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => setAnswer(opt)}
                      disabled={submitting}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        answer === opt 
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-white' 
                          : 'bg-black/30 border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your explanation here..."
                  className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white/90 text-sm focus:outline-none focus:border-emerald-500/50 resize-none"
                  disabled={submitting}
                />
              )}

              {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl">{error}</div>}

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answer || submitting}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Answer'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pt-4 animate-in fade-in">
              <div className={`p-5 rounded-xl border ${evaluation.score >= 0.75 ? 'bg-green-500/10 border-green-500/20' : evaluation.score >= 0.5 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-white uppercase tracking-wider text-xs">Evaluation Score</span>
                  <span className={`font-black ${evaluation.score >= 0.75 ? 'text-green-400' : evaluation.score >= 0.5 ? 'text-amber-400' : 'text-red-400'}`}>
                    {Math.round(evaluation.score * 100)}%
                  </span>
                </div>
                {evaluation.ai_explanation && (
                  <p className="text-white/80 text-sm mt-3 leading-relaxed">{evaluation.ai_explanation}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  {currentQuestionIdx < session.question_set.length - 1 ? (
                    <>Next Question <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    <>{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Test'}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Readiness Test</h1>
        <p className="text-white/60 text-lg leading-relaxed">
          Prove your technical abilities in a timed, rigorous assessment to earn &quot;Ready&quot; status and top-tier XP.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mt-12">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          Select Target Role
        </h2>
        
        {loadingRoles ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        ) : (
          <div className="space-y-4">
            <select 
              value={selectedRoleId || ''} 
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 appearance-none font-bold"
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            {error && <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-xl">{error}</div>}

            <button
              onClick={handleStart}
              disabled={submitting || !selectedRoleId}
              className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20 mt-4"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
              Start Assessment
            </button>
            <p className="text-center text-white/40 text-xs mt-4">
              Requires 15-30 minutes. Do not refresh the page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
