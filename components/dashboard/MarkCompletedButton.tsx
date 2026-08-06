'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

interface MarkCompletedButtonProps {
  taskId: string;
  isCompleted: boolean;
  isCurrent: boolean;
  studentId: string;
}

export function MarkCompletedButton({ taskId, isCompleted, isCurrent, studentId }: MarkCompletedButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(isCompleted);

  if (done) {
    return (
      <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
        <CheckCircle2 className="w-3 h-3" />
        Completed
      </span>
    );
  }

  if (!isCurrent) return null;

  const handleMarkComplete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const headers: Record<string, string> = { 
        'Content-Type': 'application/json',
        'x-dev-student-id': studentId 
      };

      const res = await fetch(`${API_BASE}/progress/update`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ student_id: studentId, task_id: taskId, status: 'done' }),
      });
      const data = await res.json();
      if (data.success || data.active_enrollment_id || data.milestone_hit || data.message || res.ok) {
        setDone(true);
        router.refresh(); // Re-render server component to reflect new progress
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMarkComplete}
      disabled={loading}
      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <CheckCircle2 className="w-3 h-3" />
      )}
      {loading ? 'Saving...' : 'Mark as Completed'}
    </button>
  );
}
