'use client';

import React, { useState } from 'react';
import { X, BrainCircuit, Sparkles, Loader2, Award, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import AITransparencyBadge from '@/components/ui/AITransparencyBadge';

interface TeachBackModalProps {
  conceptSlug?: string;
  conceptTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TeachBackModal({
  conceptSlug = 'arrays',
  conceptTitle = 'Core Concept',
  isOpen,
  onClose,
  onSuccess,
}: TeachBackModalProps) {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!explanation.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data: any = await apiClient('/dsa/teach-back', {
        method: 'POST',
        body: JSON.stringify({
          concept_slug: conceptSlug || 'arrays',
          explanation: explanation.trim(),
        }),
      });
      setResult(data);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit teach-back explanation');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setExplanation('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#0F0F12] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                Teach-Back Challenge · {conceptTitle}
              </h3>
              <p className="text-xs text-white/50">
                Explain this concept in your own words to verify true mastery.
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

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result ? (
          /* Evaluation Result Card */
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#FF7A00]" />
                  <h4 className="text-xl font-bold text-white">AI Evaluation Summary</h4>
                </div>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {Math.round((result.score || result.accuracy_score || 85))} / 100
                </span>
              </div>

              {result.feedback && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                    Feedback
                  </span>
                  <p className="text-sm text-white/90 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                    {result.feedback}
                  </p>
                </div>
              )}

              {result.missing_points && result.missing_points.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Key Points to Include Next Time
                  </span>
                  <ul className="space-y-1 text-xs text-white/70">
                    {result.missing_points.map((pt: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400">•</span> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <AITransparencyBadge className="mt-2" />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all"
              >
                Try Another Explanation
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[#FF7A00] hover:bg-[#E66A00] text-white font-bold text-xs transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300/80 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>How it works:</strong> Pretend you are teaching this concept to a junior developer. Kiro will grade your clarity, accuracy, and completeness.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Your Explanation
              </label>
              <textarea
                rows={6}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain the concept clearly here..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF7A00] transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!explanation.trim() || loading}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#E66A00] text-white font-bold text-sm disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating Explanation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit for AI Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
