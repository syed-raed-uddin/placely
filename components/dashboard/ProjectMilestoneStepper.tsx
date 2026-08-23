'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, Lock, ChevronDown, ChevronUp, Zap, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Task {
  id: string;
  sequence: number;
  title: string;
  instruction: string;
  acceptance_criteria: string[];
  is_required: boolean;
  estimated_minutes: number;
  student_status?: string;
}

interface Milestone {
  id: string;
  display_order: number;
  title: string;
  description: string;
  estimated_hours: number;
  xp_reward: number;
  student_status?: string;
  tasks: Task[];
}

interface ProjectMilestoneStepperProps {
  studentProjectId: string;
  milestones: Milestone[];
  onStateUpdated: () => void;
}

export default function ProjectMilestoneStepper({
  studentProjectId,
  milestones,
  onStateUpdated
}: ProjectMilestoneStepperProps) {
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    [milestones[0]?.id || '']: true
  });
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [completingMilestoneId, setCompletingMilestoneId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const toggleExpand = (mId: string) => {
    setExpandedMilestones((prev) => ({ ...prev, [mId]: !prev[mId] }));
  };

  const handleCompleteTask = async (taskId: string, currentStatus?: string) => {
    if (currentStatus === 'completed') return;
    setUpdatingTaskId(taskId);
    setActionError(null);
    try {
      await apiClient(`/api/student/projects/${studentProjectId}/tasks/${taskId}/complete`, {
        method: 'POST',
        body: JSON.stringify({})
      });
      onStateUpdated();
    } catch (err: any) {
      setActionError(err.message || 'Failed to complete task');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    setCompletingMilestoneId(milestoneId);
    setActionError(null);
    try {
      await apiClient(`/api/student/projects/${studentProjectId}/milestones/${milestoneId}/complete`, {
        method: 'POST',
        body: JSON.stringify({})
      });
      onStateUpdated();
    } catch (err: any) {
      setActionError(err.message || 'Failed to complete milestone');
    } finally {
      setCompletingMilestoneId(null);
    }
  };

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
          {actionError}
        </div>
      )}

      {milestones.map((m, mIdx) => {
        const isCompleted = m.student_status === 'completed';
        const isInProgress = m.student_status === 'in_progress';
        const isLocked = !isCompleted && !isInProgress;
        const isExpanded = !!expandedMilestones[m.id];
        const allTasksDone = (m.tasks || []).every((t) => t.student_status === 'completed');

        return (
          <div
            key={m.id || mIdx}
            className={`border rounded-3xl overflow-hidden transition-all ${
              isCompleted
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : isInProgress
                ? 'bg-neutral-900 border-[#FF7A00]/40 shadow-lg shadow-[#FF7A00]/5'
                : 'bg-neutral-900/40 border-white/5 opacity-60'
            }`}
          >
            {/* Milestone Header */}
            <div
              onClick={() => !isLocked && toggleExpand(m.id)}
              className={`p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer select-none ${
                isLocked ? 'cursor-not-allowed' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : isInProgress
                      ? 'bg-[#FF7A00]/20 border-[#FF7A00]/40 text-[#FF7A00]'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : m.display_order}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                      Milestone {m.display_order}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                      <Zap className="w-3 h-3" /> +{m.xp_reward || 150} XP
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{m.title}</h3>
                  <p className="text-xs text-white/50 mt-1 line-clamp-1">{m.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-white/40 hidden sm:flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ~{m.estimated_hours}h
                </span>
                {!isLocked && (
                  <button className="text-white/40 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Task Checklist */}
            {isExpanded && !isLocked && (
              <div className="p-5 md:p-6 pt-0 border-t border-white/5 space-y-4">
                <div className="space-y-3 pt-4">
                  {m.tasks.map((task) => {
                    const taskDone = task.student_status === 'completed';
                    const isUpdating = updatingTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleCompleteTask(task.id, task.student_status)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          taskDone
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-black/30 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <button
                          disabled={taskDone || isUpdating}
                          className="mt-0.5 shrink-0 text-white/30 hover:text-white transition-all disabled:opacity-80"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#FF7A00]" />
                          ) : taskDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-white/30" />
                          )}
                        </button>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-sm font-bold leading-tight ${taskDone ? 'text-white/70 line-through' : 'text-white'}`}>
                              {task.title}
                            </h4>
                            <span className="text-[11px] text-white/40 shrink-0">~{task.estimated_minutes} min</span>
                          </div>

                          <p className="text-xs text-white/60 leading-relaxed">{task.instruction}</p>

                          {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
                            <div className="pt-1.5 space-y-1">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-white/40 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-[#FF7A00]" /> Acceptance Criteria
                              </span>
                              <ul className="space-y-1 text-xs text-white/50 pl-2">
                                {task.acceptance_criteria.map((crit, cIdx) => (
                                  <li key={cIdx} className="flex items-start gap-1.5">
                                    <span className="text-[#FF7A00] leading-none">•</span>
                                    <span>{crit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Milestone Completion Trigger */}
                {!isCompleted && isInProgress && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleCompleteMilestone(m.id)}
                      disabled={!allTasksDone || completingMilestoneId === m.id}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-bold text-sm shadow-lg shadow-[#FF7A00]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {completingMilestoneId === m.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Complete Milestone &amp; Claim +{m.xp_reward || 150} XP
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
