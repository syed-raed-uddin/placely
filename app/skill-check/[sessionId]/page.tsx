'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Terminal,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { API_BASE } from '@/lib/api';

interface QuestionItem {
  id: string;
  course: string;
  domain: string;
  question_type: string;
  prompt: string;
  code_snippet?: string | null;
  options: string[];
  difficulty: string;
}

interface SessionData {
  id: string;
  course: string;
  course_meta: any;
  status: string;
  total_questions: number;
  questions: QuestionItem[];
  submitted_answers: Record<string, any>;
}

export default function SkillCheckRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load session from backend
  useEffect(() => {
    if (!sessionId) return;

    const secret =
      (typeof window !== 'undefined' && localStorage.getItem(`skill_check_${sessionId}_secret`)) ||
      new URLSearchParams(window.location.search).get('secret') ||
      '';

    async function fetchSession() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/skill-check/session/${sessionId}`, {
          headers: {
            'X-Skill-Check-Secret': secret,
          },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to load assessment session.');
        }

        const data: SessionData = await res.json();
        setSession(data);

        // If already completed, redirect directly to results
        if (data.status === 'completed') {
          router.replace(`/skill-check/result/${sessionId}`);
          return;
        }

        // Restore previously submitted answers
        const initialAnswers: Record<string, string> = {};
        if (data.submitted_answers) {
          Object.entries(data.submitted_answers).forEach(([qid, ans]) => {
            if (typeof ans === 'object' && ans !== null && ans.option) {
              initialAnswers[qid] = ans.option;
            } else if (typeof ans === 'string') {
              initialAnswers[qid] = ans;
            }
          });
        }
        setSelectedAnswers(initialAnswers);
      } catch (err: any) {
        setErrorMessage(err.message || 'Unable to connect to assessment service.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, [sessionId, router]);

  // Handle selecting an option
  const handleSelectOption = async (optionValue: string) => {
    if (!session || !session.questions[currentIndex]) return;
    const currentQ = session.questions[currentIndex];

    // Optimistically update UI
    const updated = { ...selectedAnswers, [currentQ.id]: optionValue };
    setSelectedAnswers(updated);

    // Save locally
    if (typeof window !== 'undefined') {
      localStorage.setItem(`skill_check_${sessionId}_answers`, JSON.stringify(updated));
    }

    // Persist to backend
    const secret = localStorage.getItem(`skill_check_${sessionId}_secret`) || '';
    try {
      await fetch(`${API_BASE}/skill-check/session/${sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Skill-Check-Secret': secret,
        },
        body: JSON.stringify({
          question_id: currentQ.id,
          answer: { option: optionValue },
        }),
      });
    } catch (e) {
      // Backend error is non-fatal on individual option click; local answer preserved
    }
  };

  // Complete Assessment
  const handleCompleteAssessment = async () => {
    if (!session) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const secret = localStorage.getItem(`skill_check_${sessionId}_secret`) || '';

    try {
      const res = await fetch(`${API_BASE}/skill-check/session/${sessionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Skill-Check-Secret': secret,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to complete assessment.');
      }

      router.push(`/skill-check/result/${sessionId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error scoring assessment. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
        <p className="text-sm font-medium text-white/70">Loading Placely Skill Check...</p>
      </div>
    );
  }

  if (errorMessage && !session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Assessment Unavailable</h2>
        <p className="text-sm text-white/60 max-w-md mb-6">{errorMessage}</p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  if (!session || !session.questions || session.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">No Questions Found</h2>
        <p className="text-sm text-white/60 max-w-md mb-6">
          This assessment session has no configured questions.
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

  const currentQuestion = session.questions[currentIndex];
  const totalQuestions = session.questions.length;
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const selectedOption = selectedAnswers[currentQuestion.id] || '';
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header & Progress Bar */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                {session.course_meta?.name || session.course} Skill Check
              </span>
              <span className="text-xs text-white/50">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white/70">
              {answeredCount}/{totalQuestions} Answered
            </span>
          </div>
        </div>

        {/* Animated Progress Line */}
        <div className="w-full bg-white/5 h-1">
          <div
            className="bg-emerald-500 h-1 transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Main Question Area */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Domain & Difficulty Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              {currentQuestion.domain}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/50 capitalize">
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question Prompt */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug">
            {currentQuestion.prompt}
          </h2>

          {/* Code Snippet Block (if present) */}
          {currentQuestion.code_snippet && (
            <div className="relative rounded-2xl bg-[#141414] border border-white/10 p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-sm text-emerald-300 shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-white/40 mb-2.5 pb-2 border-b border-white/5">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Code Snippet</span>
                </span>
              </div>
              <pre className="whitespace-pre leading-relaxed">
                <code>{currentQuestion.code_snippet}</code>
              </pre>
            </div>
          )}

          {/* Option Cards */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption.toLowerCase() === opt.toLowerCase();
              const optionLetter = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-500/10 text-white'
                      : 'bg-[#121212] border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-white/80'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/5 border border-white/10 text-white/60'
                    }`}
                  >
                    {optionLetter}
                  </div>
                  <span className="text-sm sm:text-base leading-relaxed pt-0.5">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Inline submission error if any */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Bottom Navigation Toolbar */}
        <div className="pt-8 pb-4 border-t border-white/10 flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0 || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {isLastQuestion ? (
              <button
                onClick={handleCompleteAssessment}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scoring Result...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Assessment</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
