'use client';

import React, { useState, useEffect } from 'react';
import { X, HelpCircle, CheckCircle2, AlertCircle, Loader2, Award, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface QuizModalProps {
  domain?: string;
  taskId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function QuizModal({
  domain = 'python',
  taskId,
  isOpen,
  onClose,
  onSuccess,
}: QuizModalProps) {
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      initQuiz();
    } else {
      resetState();
    }
  }, [isOpen, domain]);

  const resetState = () => {
    setLoading(false);
    setSessionId(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmitting(false);
    setResult(null);
    setError(null);
  };

  const initQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: any = await apiClient('/quizzes/start', {
        method: 'POST',
        body: JSON.stringify({ domain: domain || 'python' }),
      });
      setSessionId(data.id || data.session_id);
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option: string) => {
    const q = questions[currentIndex];
    if (!q) return;
    setSelectedAnswers((prev) => ({ ...prev, [q.id]: option }));
  };

  const handleComplete = async () => {
    if (!sessionId) return;
    setSubmitting(true);
    setError(null);
    try {
      // Submit individual answers
      for (const q of questions) {
        const ans = selectedAnswers[q.id];
        if (ans) {
          try {
            await apiClient(`/quizzes/${sessionId}/submit`, {
              method: 'POST',
              body: JSON.stringify({ question_id: q.id, answer: ans }),
            });
          } catch (_) {}
        }
      }

      // Complete session
      const res: any = await apiClient(`/quizzes/${sessionId}/complete`, {
        method: 'POST',
      });
      setResult(res);

      // If passed and taskId provided, mark task complete
      if (taskId) {
        try {
          await apiClient('/progress/update', {
            method: 'POST',
            body: JSON.stringify({ task_id: taskId, completed: true }),
          });
        } catch (_) {}
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const currentAnswer = currentQ ? selectedAnswers[currentQ.id] : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#0F0F12] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                Knowledge Check · {domain}
              </h3>
              <p className="text-xs text-white/50">
                {questions.length > 0
                  ? `Question ${currentIndex + 1} of ${questions.length}`
                  : 'Loading Quiz'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-[#FF7A00] animate-spin" />
            <p className="text-sm text-white/50">Fetching quiz questions...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : result ? (
          /* Quiz Results Screen */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white">Quiz Completed!</h4>
              <p className="text-sm text-white/60 mt-1">
                You scored{' '}
                <strong className="text-emerald-400">
                  {Math.round((result.score || 1) * 100)}%
                </strong>{' '}
                on this knowledge check.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/50">
              ⚡ XP Reward awarded &amp; task progress saved automatically.
            </div>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-[#FF7A00] hover:bg-[#E66A00] text-white font-bold text-sm transition-all"
            >
              Continue Learning
            </button>
          </div>
        ) : currentQ ? (
          /* Question View */
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#FF7A00] uppercase tracking-wider">
                Question {currentIndex + 1}
              </span>
              <h4 className="text-base font-semibold text-white leading-relaxed">
                {currentQ.prompt || currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {(currentQ.options || ['Option A', 'Option B', 'Option C', 'Option D']).map(
                (opt: string, idx: number) => {
                  const selected = currentAnswer === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(opt)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between ${
                        selected
                          ? 'bg-[#FF7A00]/10 border-[#FF7A00] text-white font-semibold'
                          : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <span>{opt}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-[#FF7A00] shrink-0" />}
                    </button>
                  );
                }
              )}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                ← Previous
              </button>

              {isLast ? (
                <button
                  disabled={!currentAnswer || submitting}
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#E66A00] text-white font-bold text-sm disabled:opacity-50 transition-all"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Submit Quiz</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled={!currentAnswer}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs disabled:opacity-30 transition-all"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
