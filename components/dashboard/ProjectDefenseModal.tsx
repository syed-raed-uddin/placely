'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, AlertCircle, CheckCircle2, Loader2, X, RotateCcw, ThumbsUp, Lightbulb } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface ProjectDefenseModalProps {
  studentProjectId: string;
  isOpen: boolean;
  onClose: () => void;
  onDefenseCompleted: () => void;
}

export default function ProjectDefenseModal({
  studentProjectId,
  isOpen,
  onClose,
  onDefenseCompleted
}: ProjectDefenseModalProps) {
  const [loading, setLoading] = useState(false);
  const [defenseData, setDefenseData] = useState<{ id: string; question: string } | null>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<{
    is_passing: boolean;
    score?: number;
    feedback?: string;
    strengths?: string[];
    weaknesses?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startDefense = async () => {
    setLoading(true);
    setError(null);
    setEvalResult(null);
    setStudentAnswer('');
    try {
      const res: any = await apiClient(`/api/student/projects/${studentProjectId}/defense/start`, {
        method: 'POST'
      });
      if (res?.defense) {
        setDefenseData(res.defense);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start defense session');
    } finally {
      setLoading(false);
    }
  };

  const submitDefenseAnswer = async () => {
    if (!defenseData || !studentAnswer.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res: any = await apiClient(`/api/student/projects/${studentProjectId}/defense/answer`, {
        method: 'POST',
        body: JSON.stringify({
          defense_id: defenseData.id,
          student_answer: studentAnswer.trim()
        })
      });
      setEvalResult(res);
      if (res?.is_passing) {
        onDefenseCompleted();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit defense answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden text-white space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-white/40 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Project Technical Defense</h3>
            <p className="text-xs text-white/50">Defend your architectural and implementation decisions to complete this project.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!defenseData && !evalResult && (
          <div className="py-8 text-center space-y-4">
            <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
              Kiro will ask you a targeted engineering interview question based on your project blueprint and repository architecture. Answer concisely with technical reasoning.
            </p>
            <button
              onClick={startDefense}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Interview Defense Question
            </button>
          </div>
        )}

        {defenseData && !evalResult && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Interview Question</span>
              <p className="text-sm font-semibold text-white leading-relaxed">{defenseData.question}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Your Technical Defense</label>
              <textarea
                rows={5}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Explain your architectural design, data structures used, and tradeoffs considered..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-semibold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitDefenseAnswer}
                disabled={submitting || !studentAnswer.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Submit Defense Answer
              </button>
            </div>
          </div>
        )}

        {evalResult && (
          <div className="space-y-6 text-center py-2">
            <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border ${
              evalResult.is_passing ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              {evalResult.is_passing ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-extrabold text-white">
                {evalResult.is_passing ? 'Defense Passed! Project Completed' : 'Technical Defense Needs Revision'}
              </h4>
              {evalResult.score !== undefined && (
                <div className="text-sm font-bold text-white/70">
                  Defense Score: <span className={evalResult.is_passing ? 'text-emerald-400' : 'text-amber-400'}>{evalResult.score}/100</span>
                </div>
              )}
            </div>

            <div className="space-y-3 text-left max-w-lg mx-auto">
              {evalResult.feedback && (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-white/80 leading-relaxed">
                  <strong className="text-white block mb-1 font-bold">Evaluator Feedback:</strong>
                  {evalResult.feedback}
                </div>
              )}

              {/* Strengths */}
              {evalResult.strengths && evalResult.strengths.length > 0 && (
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5" /> What You Demonstrated:
                  </span>
                  <ul className="list-disc list-inside text-white/70 space-y-0.5 pl-1">
                    {evalResult.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {evalResult.weaknesses && evalResult.weaknesses.length > 0 && (
                <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> What Needs Improvement:
                  </span>
                  <ul className="list-disc list-inside text-white/70 space-y-0.5 pl-1">
                    {evalResult.weaknesses.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              {!evalResult.is_passing && (
                <button
                  onClick={startDefense}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retry Defense Question
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
