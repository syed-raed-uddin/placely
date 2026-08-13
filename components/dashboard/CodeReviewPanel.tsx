'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Code2, Loader2, ChevronDown, ChevronUp, Send, AlertCircle, Sparkles } from 'lucide-react';
import { API_BASE } from '@/lib/api';
import AITransparencyBadge from '@/components/ui/AITransparencyBadge';

interface CodeReviewPanelProps {
  taskId: string;
  taskTitle: string;
  studentId: string;
}

type ReviewState = 'idle' | 'open' | 'loading' | 'done' | 'error';

export function CodeReviewPanel({ taskId, taskTitle, studentId }: CodeReviewPanelProps) {
  const [state, setState] = useState<ReviewState>('idle');
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleOpen = () => {
    if (state === 'idle') {
      setState('open');
      setTimeout(() => textareaRef.current?.focus(), 100);
    } else if (state === 'open') {
      setState('idle');
    }
  };

  const handleSubmit = useCallback(async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      textareaRef.current?.focus();
      return;
    }

    setState('loading');
    setReview('');
    setErrorMsg('');

    try {
      const studentIdToken = document.cookie.split('; ').find(row => row.startsWith('placely_student_id='))?.split('=')[1] || '';
      const token = document.cookie.split('; ').find(row => row.startsWith('placely_token='))?.split('=')[1] || '';
      const headers: Record<string, string> = { 
        'Content-Type': 'application/json',
        'x-dev-student-id': studentIdToken 
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/code/review`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          student_id: studentIdToken || studentId,
          task_id: taskId,
          code: trimmed,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const feedback = data.feedback || 'No feedback returned.';
      setReview(feedback);
      setState('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(msg);
      setState('error');
    }
  }, [code, taskId, studentId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const resetPanel = () => {
    setState('open');
    setReview('');
    setErrorMsg('');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Simple markdown-like renderer for the review output
  const renderReview = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold **text**
      const withBold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Code `inline`
      const withCode = withBold.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-[#FF7A00] text-[11px] font-mono">$1</code>');
      
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-white font-semibold text-sm mt-3 mb-1" dangerouslySetInnerHTML={{ __html: withCode.replace('### ', '') }} />;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-white font-bold text-sm mt-4 mb-1" dangerouslySetInnerHTML={{ __html: withCode.replace('## ', '') }} />;
      }
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-white font-extrabold text-base mt-4 mb-1" dangerouslySetInnerHTML={{ __html: withCode.replace('# ', '') }} />;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={i} className="flex gap-2 text-sm text-white/75 leading-relaxed">
            <span className="text-[#FF7A00] shrink-0 mt-0.5">•</span>
            <span dangerouslySetInnerHTML={{ __html: withCode.replace(/^[-*] /, '') }} />
          </div>
        );
      }
      if (line.match(/^\d+\. /)) {
        const num = line.match(/^(\d+)\. /)?.[1];
        const rest = line.replace(/^\d+\. /, '');
        return (
          <div key={i} className="flex gap-2 text-sm text-white/75 leading-relaxed">
            <span className="text-[#FF7A00] shrink-0 font-bold min-w-[18px]">{num}.</span>
            <span dangerouslySetInnerHTML={{ __html: rest.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-[#FF7A00] text-[11px] font-mono">$1</code>') }} />
          </div>
        );
      }
      if (line === '') return <div key={i} className="h-1.5" />;
      return <p key={i} className="text-sm text-white/75 leading-relaxed" dangerouslySetInnerHTML={{ __html: withCode }} />;
    });
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#FF7A00]/20 bg-[#FF7A00]/5">
      {/* Header / Toggle */}
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#FF7A00]/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF7A00]/20 flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-[#FF7A00]" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider block">Submit Code for Review</span>
            <span className="text-[10px] text-white/40">Kiro will review your code and give specific feedback</span>
          </div>
        </div>
        {(state === 'open') ? (
          <ChevronUp className="w-4 h-4 text-white/40 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
        )}
      </button>

      {/* Input Panel */}
      {state === 'open' && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#FF7A00]/10">
          <p className="text-xs text-white/40 pt-3">
            Paste your code below. Kiro will review it against the task:{' '}
            <strong className="text-white/60">{taskTitle}</strong>
          </p>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`// Paste your code here...\n// Press Ctrl+Enter to submit`}
              rows={10}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white/80 placeholder-white/20 resize-y focus:outline-none focus:border-[#FF7A00]/50 focus:ring-1 focus:ring-[#FF7A00]/20 transition-all leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-white/20">Ctrl+Enter to submit</span>
            <button
              onClick={handleSubmit}
              disabled={!code.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] text-white text-sm font-semibold hover:bg-[#FF7A00]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#FF7A00]/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Get AI Review
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {state === 'loading' && (
        <div className="px-4 pb-5 border-t border-[#FF7A00]/10">
          <div className="flex items-center gap-3 pt-4">
            <div className="w-8 h-8 rounded-full bg-[#FF7A00]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#FF7A00] animate-pulse" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-[#FF7A00] animate-spin" />
                <span className="text-sm text-white/70">Kiro is reviewing your code...</span>
              </div>
              <p className="text-xs text-white/30">Checking against today&apos;s task requirements</p>
            </div>
          </div>
          {/* Skeleton shimmer */}
          <div className="mt-4 space-y-2">
            {[80, 60, 75, 50, 70].map((w, i) => (
              <div key={i} className="h-3 rounded-full bg-white/5 animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )}

      {/* Review Result */}
      {state === 'done' && review && (
        <div className="px-4 pb-5 border-t border-[#FF7A00]/10">
          <div className="flex items-center justify-between pt-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FF7A00]/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
              </div>
              <span className="text-sm font-semibold text-white">Kiro&apos;s Review</span>
            </div>
            <button
              onClick={resetPanel}
              className="text-[10px] text-[#FF7A00] hover:text-[#FF7A00]/80 font-medium transition-colors"
            >
              Submit another →
            </button>
          </div>
          <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-1.5 max-h-80 overflow-y-auto">
            {renderReview(review)}
          </div>
          <AITransparencyBadge className="mt-3" />
        </div>
      )}

      {/* Error State */}
      {state === 'error' && (
        <div className="px-4 pb-4 border-t border-[#FF7A00]/10">
          <div className="flex items-start gap-3 pt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-red-400 font-medium">Review failed</p>
              <p className="text-xs text-red-400/70">{errorMsg}</p>
              <button
                onClick={resetPanel}
                className="text-xs text-red-400 hover:text-red-300 font-medium mt-1 transition-colors"
              >
                Try again →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
