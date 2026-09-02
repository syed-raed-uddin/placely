'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Lock,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  ShieldCheck,
  Loader2,
  Terminal,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  HelpCircle,
  GitCommit,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Code2,
  Compass
} from 'lucide-react';
import { apiClient } from '@/lib/api';

export interface HowToStep {
  step?: number;
  title: string;
  description?: string;
  command?: string;
  code_snippet?: string;
  expected_output?: string;
  key_files?: string[];
}

export interface CommonPitfall {
  symptom?: string;
  pitfall?: string;
  cause?: string;
  solution?: string;
  how_to_prevent?: string;
}

export interface Task {
  id: string;
  sequence: number;
  title: string;
  instruction: string;
  acceptance_criteria?: string[];
  is_required?: boolean;
  estimated_minutes?: number;
  student_status?: string;
  completed_at?: string;
  // Phase 1 / Phase 3 deep fields
  how_to_guide?: HowToStep[] | string[];
  verification_checklist?: string[];
  common_pitfalls?: CommonPitfall[] | string[];
  concepts?: string[];
  why_this_task?: string;
  before_you_code?: string[];
  testing_guide?: {
    happy_path?: string;
    negative_case?: string;
    edge_case?: string;
  };
  commit_suggestion?: string;
}

export interface Milestone {
  id: string;
  display_order: number;
  title: string;
  description: string;
  estimated_hours: number;
  xp_reward: number;
  student_status?: string;
  completed_at?: string;
  evidence_summary?: string;
  tasks: Task[];
}

interface ProjectMilestoneStepperProps {
  studentProjectId: string;
  milestones: Milestone[];
  onStateUpdated: () => void;
  onSelectConcept?: (concept: string) => void;
}

export default function ProjectMilestoneStepper({
  studentProjectId,
  milestones = [],
  onStateUpdated,
  onSelectConcept
}: ProjectMilestoneStepperProps) {
  // Find first active milestone to expand by default
  const defaultOpenMilestoneId =
    milestones.find((m) => m.student_status === 'in_progress')?.id ||
    milestones.find((m) => m.student_status !== 'completed')?.id ||
    milestones[0]?.id ||
    '';

  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    [defaultOpenMilestoneId]: true
  });

  // Track expanded task accordion ID
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Local interactive step checkboxes: { [taskId]: { [stepIndex]: boolean } }
  const [stepChecks, setStepChecks] = useState<Record<string, Record<number, boolean>>>({});
  // Local interactive criteria checkboxes: { [taskId]: { [critIndex]: boolean } }
  const [critChecks, setCritChecks] = useState<Record<string, Record<number, boolean>>>({});

  // Loading states
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [completingMilestoneId, setCompletingMilestoneId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  // Auto-expand first uncompleted task in active milestone on initial load
  useEffect(() => {
    if (!expandedTaskId && milestones.length > 0) {
      for (const m of milestones) {
        if (m.student_status !== 'completed' && m.tasks) {
          const activeTask = m.tasks.find((t) => t.student_status !== 'completed');
          if (activeTask) {
            setExpandedTaskId(activeTask.id);
            break;
          }
        }
      }
    }
  }, [milestones, expandedTaskId]);

  // Load interactive checkbox states from localStorage
  useEffect(() => {
    if (!studentProjectId) return;
    try {
      const savedSteps = localStorage.getItem(`placely_task_steps_${studentProjectId}`);
      if (savedSteps) setStepChecks(JSON.parse(savedSteps));

      const savedCrits = localStorage.getItem(`placely_task_crits_${studentProjectId}`);
      if (savedCrits) setCritChecks(JSON.parse(savedCrits));
    } catch {
      // Ignore storage errors
    }
  }, [studentProjectId]);

  const toggleMilestone = (mId: string) => {
    setExpandedMilestones((prev) => ({ ...prev, [mId]: !prev[mId] }));
  };

  const toggleTask = (taskId: string) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const handleStepCheck = (taskId: string, stepIdx: number) => {
    const current = stepChecks[taskId] || {};
    const updated = {
      ...stepChecks,
      [taskId]: { ...current, [stepIdx]: !current[stepIdx] }
    };
    setStepChecks(updated);
    try {
      localStorage.setItem(`placely_task_steps_${studentProjectId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleCritCheck = (taskId: string, critIdx: number) => {
    const current = critChecks[taskId] || {};
    const updated = {
      ...critChecks,
      [taskId]: { ...current, [critIdx]: !current[critIdx] }
    };
    setCritChecks(updated);
    try {
      localStorage.setItem(`placely_task_crits_${studentProjectId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
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
      setActionError(err.message || 'Failed to complete task on server');
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
      setActionError(err.message || 'Failed to complete milestone on server');
    } finally {
      setCompletingMilestoneId(null);
    }
  };

  if (!milestones || milestones.length === 0) {
    return (
      <div className="p-8 text-center bg-neutral-900 border border-white/10 rounded-3xl text-white/50 text-sm">
        No engineering milestones registered for this project.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {actionError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {milestones.map((m, mIdx) => {
        const isCompleted = m.student_status === 'completed';
        // Milestone 1 (mIdx === 0) is accessible by default for new/pending projects.
        // Milestone i (mIdx > 0) is accessible only if previous milestone is completed.
        const prevMilestoneCompleted = mIdx === 0 || milestones[mIdx - 1]?.student_status === 'completed';
        const isInProgress = m.student_status === 'in_progress' || (prevMilestoneCompleted && !isCompleted);
        const isLocked = !prevMilestoneCompleted;
        const isExpanded = !isLocked && !!expandedMilestones[m.id];
        const taskList = m.tasks || [];
        const completedTasksCount = taskList.filter((t) => t.student_status === 'completed').length;
        const allTasksDone = taskList.length > 0 && completedTasksCount === taskList.length;

        return (
          <div
            key={m.id}
            className={`border rounded-3xl overflow-hidden transition-all ${
              isCompleted
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : isInProgress
                ? 'bg-neutral-900 border-[#FF7A00]/40 shadow-xl shadow-[#FF7A00]/5'
                : 'bg-neutral-900/40 border-white/5 opacity-65'
            }`}
          >
            {/* Milestone Header */}
            <div
              onClick={() => !isLocked && toggleMilestone(m.id)}
              className={`p-5 md:p-6 flex items-center justify-between gap-4 select-none ${
                isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : isInProgress
                      ? 'bg-[#FF7A00]/20 border-[#FF7A00]/40 text-[#FF7A00]'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    m.display_order
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold text-white/40 uppercase tracking-wider">
                      Milestone {m.display_order}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                      <Zap className="w-3 h-3" /> +{m.xp_reward || 150} XP
                    </span>
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Milestone Completed
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-white leading-tight">{m.title}</h3>
                  <p className="text-xs text-white/50 line-clamp-1 leading-relaxed">{m.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-white/40 hidden sm:flex items-center gap-1 font-mono">
                  {completedTasksCount}/{taskList.length} Tasks
                </span>
                <span className="text-xs text-white/40 hidden md:flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ~{m.estimated_hours}h
                </span>
                {!isLocked && (
                  <div className="text-white/40 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Milestone Workspace */}
            {isExpanded && !isLocked && (
              <div className="p-5 md:p-6 pt-0 border-t border-white/5 space-y-5">
                {/* Task Stepper List */}
                <div className="space-y-4 pt-4">
                  {taskList.map((task, tIdx) => {
                    const isTaskCompleted = task.student_status === 'completed';
                    const isTaskUpdating = updatingTaskId === task.id;
                    const isTaskExpanded = expandedTaskId === task.id;

                    // Sequential task access: Task 1 (tIdx === 0) is accessible if milestone is unlocked.
                    // Task tIdx (tIdx > 0) is locked until previous task tIdx - 1 is completed.
                    const prevTaskCompleted = tIdx === 0 || taskList[tIdx - 1]?.student_status === 'completed';
                    const isTaskLocked = isLocked || (!isTaskCompleted && !prevTaskCompleted);

                    // Derive Task State
                    const taskState = isTaskCompleted
                      ? 'COMPLETED'
                      : isTaskUpdating
                      ? 'UPDATING'
                      : !isTaskLocked
                      ? 'IN_PROGRESS'
                      : 'LOCKED';

                    // Parse how_to steps
                    const rawSteps = task.how_to_guide || [];
                    const normalizedSteps: HowToStep[] = rawSteps.map((s, sIdx) => {
                      if (typeof s === 'string') {
                        return { step: sIdx + 1, title: s, description: s };
                      }
                      return s;
                    });

                    // Parse acceptance criteria
                    const rawCrits = task.acceptance_criteria || [];

                    // Parse common pitfalls
                    const rawPitfalls = task.common_pitfalls || [];
                    const normalizedPitfalls: CommonPitfall[] = rawPitfalls.map((p) => {
                      if (typeof p === 'string') {
                        return { pitfall: p, symptom: p, solution: p };
                      }
                      return p;
                    });

                    // Checkbox counts
                    const taskStepsState = stepChecks[task.id] || {};
                    const checkedStepsCount = Object.values(taskStepsState).filter(Boolean).length;
                    const totalSteps = normalizedSteps.length;

                    const taskCritsState = critChecks[task.id] || {};
                    const checkedCritsCount = Object.values(taskCritsState).filter(Boolean).length;
                    const totalCrits = rawCrits.length;

                    return (
                      <div
                        key={task.id || tIdx}
                        className={`border rounded-2xl overflow-hidden transition-all ${
                          isTaskCompleted
                            ? 'bg-emerald-500/[0.03] border-emerald-500/20'
                            : isTaskExpanded
                            ? 'bg-black/50 border-[#FF7A00]/50 shadow-lg shadow-[#FF7A00]/5'
                            : isTaskLocked
                            ? 'bg-black/20 border-white/5 opacity-55'
                            : 'bg-black/30 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Task Compact Row Header */}
                        <div
                          onClick={() => !isTaskLocked && toggleTask(task.id)}
                          className={`p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 select-none transition-colors ${
                            isTaskLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3.5 flex-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isTaskLocked) handleCompleteTask(task.id, task.student_status);
                              }}
                              disabled={isTaskCompleted || isTaskUpdating || isTaskLocked}
                              className="mt-0.5 sm:mt-0 shrink-0 text-white/30 hover:text-white transition-all disabled:opacity-80"
                              title={
                                isTaskCompleted
                                  ? 'Task completed'
                                  : isTaskLocked
                                  ? `Complete Task ${tIdx} first to unlock`
                                  : 'Click to complete task'
                              }
                            >
                              {isTaskUpdating ? (
                                <Loader2 className="w-5 h-5 animate-spin text-[#FF7A00]" />
                              ) : isTaskCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : isTaskLocked ? (
                                <Lock className="w-4 h-4 text-white/30" />
                              ) : (
                                <Circle className="w-5 h-5 text-white/30 hover:text-[#FF7A00]" />
                              )}
                            </button>

                            <div className="space-y-1 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF7A00]">
                                  Task {task.sequence || tIdx + 1}
                                </span>
                                {isTaskCompleted ? (
                                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                                    Verified Complete
                                  </span>
                                ) : isTaskLocked ? (
                                  <span className="px-2 py-0.2 rounded-full text-[10px] font-medium bg-white/5 text-white/40 border border-white/10 flex items-center gap-1">
                                    <Lock className="w-2.5 h-2.5" /> Locked (Prerequisite required)
                                  </span>
                                ) : null}
                              </div>
                              <h4
                                className={`text-sm sm:text-base font-bold leading-tight ${
                                  isTaskCompleted
                                    ? 'text-white/70 line-through'
                                    : isTaskLocked
                                    ? 'text-white/50'
                                    : 'text-white'
                                }`}
                              >
                                {task.title}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-white/40 hidden sm:flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" /> ~{task.estimated_minutes || 30}m
                            </span>
                            {!isTaskLocked && (
                              <div className="text-white/40 p-1">
                                {isTaskExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Deep Task Execution Panel */}
                        {isTaskExpanded && (
                          <div className="p-4 sm:p-6 pt-0 border-t border-white/5 space-y-6 animate-in fade-in duration-200">
                            {/* 1. Task Instruction & Concept Tags */}
                            <div className="space-y-2 mt-4">
                              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                <span className="text-[10px] uppercase font-extrabold text-white/40 tracking-wider flex items-center gap-1.5">
                                  <Compass className="w-3.5 h-3.5 text-[#FF7A00]" /> Engineering Directive
                                </span>
                                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                                  {task.instruction}
                                </p>
                              </div>

                              {/* Clickable Concept Tags (Connecting to Phase 2 Learning Blueprint) */}
                              {task.concepts && task.concepts.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  <span className="text-[11px] text-white/40 font-medium">Related Concepts:</span>
                                  {task.concepts.map((concept, cIdx) => (
                                    <button
                                      key={cIdx}
                                      onClick={() => onSelectConcept && onSelectConcept(concept)}
                                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition-all flex items-center gap-1"
                                      title="Click to view concept in Learning Blueprint"
                                    >
                                      <span>{concept}</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* 2. Implementation Steps Roadmap (How To Do This) */}
                            {normalizedSteps.length > 0 && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                                    <Code2 className="w-3.5 h-3.5 text-[#FF7A00]" /> Implementation Steps (How To Do This)
                                  </h5>
                                  <span className="text-[11px] text-white/40 font-mono">
                                    {checkedStepsCount}/{totalSteps} Steps Checked (Self-Reported)
                                  </span>
                                </div>

                                <div className="space-y-3">
                                  {normalizedSteps.map((step, sIdx) => {
                                    const isChecked = !!taskStepsState[sIdx];
                                    return (
                                      <div
                                        key={sIdx}
                                        className={`p-4 rounded-xl border transition-all ${
                                          isChecked
                                            ? 'bg-emerald-500/[0.03] border-emerald-500/20'
                                            : 'bg-black/40 border-white/10'
                                        }`}
                                      >
                                        <div className="flex items-start gap-3">
                                          <button
                                            onClick={() => handleStepCheck(task.id, sIdx)}
                                            className="mt-0.5 shrink-0 text-white/30 hover:text-white transition-all"
                                          >
                                            {isChecked ? (
                                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                              <Circle className="w-4 h-4 text-white/30" />
                                            )}
                                          </button>

                                          <div className="space-y-2 flex-1">
                                            <div className="flex items-center justify-between">
                                              <span
                                                className={`text-xs sm:text-sm font-bold ${
                                                  isChecked ? 'text-white/60 line-through' : 'text-white'
                                                }`}
                                              >
                                                Step {step.step || sIdx + 1}: {step.title}
                                              </span>
                                            </div>

                                            {step.description && step.description !== step.title && (
                                              <p className="text-xs text-white/70 leading-relaxed">
                                                {step.description}
                                              </p>
                                            )}

                                            {/* Code / Command Snippet */}
                                            {(step.command || step.code_snippet) && (
                                              <div className="relative group rounded-lg bg-black/80 border border-white/10 p-3 font-mono text-xs text-[#FF7A00] overflow-x-auto">
                                                <pre className="whitespace-pre">
                                                  {step.command || step.code_snippet}
                                                </pre>
                                                <button
                                                  onClick={() =>
                                                    handleCopy(
                                                      step.command || step.code_snippet || '',
                                                      `${task.id}_step_${sIdx}`
                                                    )
                                                  }
                                                  className="absolute top-2 right-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1 transition-all"
                                                >
                                                  {copiedCodeKey === `${task.id}_step_${sIdx}` ? (
                                                    <Check className="w-3 h-3 text-emerald-400" />
                                                  ) : (
                                                    <Copy className="w-3 h-3" />
                                                  )}
                                                  {copiedCodeKey === `${task.id}_step_${sIdx}` ? 'Copied' : 'Copy'}
                                                </button>
                                              </div>
                                            )}

                                            {step.expected_output && (
                                              <div className="text-[11px] text-white/50 flex items-start gap-1.5">
                                                <strong className="text-white/70 shrink-0">Expected Result:</strong>
                                                <span>{step.expected_output}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 3. Acceptance Criteria Checklist */}
                            {rawCrits.length > 0 && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Acceptance Criteria Self-Check
                                  </h5>
                                  <span className="text-[11px] text-white/40 font-mono">
                                    {checkedCritsCount}/{totalCrits} Criteria Checked
                                  </span>
                                </div>

                                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                                  {rawCrits.map((crit, cIdx) => {
                                    const isChecked = !!taskCritsState[cIdx];
                                    return (
                                      <div
                                        key={cIdx}
                                        onClick={() => handleCritCheck(task.id, cIdx)}
                                        className="flex items-start gap-2.5 cursor-pointer text-xs text-white/80 hover:text-white transition-colors"
                                      >
                                        <button className="mt-0.5 shrink-0">
                                          {isChecked ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                          ) : (
                                            <Circle className="w-3.5 h-3.5 text-white/30" />
                                          )}
                                        </button>
                                        <span className={isChecked ? 'text-white/50 line-through' : 'text-white/80'}>
                                          {crit}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 4. Common Pitfalls & Troubleshooting */}
                            {normalizedPitfalls.length > 0 && (
                              <div className="space-y-3">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Common Pitfalls &amp; Troubleshooting
                                </h5>
                                <div className="space-y-2">
                                  {normalizedPitfalls.map((pitfall, pIdx) => (
                                    <div
                                      key={pIdx}
                                      className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 space-y-1"
                                    >
                                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        {pitfall.symptom || pitfall.pitfall || 'Potential Failure Mode'}
                                      </div>
                                      {pitfall.cause && (
                                        <p className="text-[11px] text-white/60 pl-3">
                                          <strong>Root Cause:</strong> {pitfall.cause}
                                        </p>
                                      )}
                                      {pitfall.solution && (
                                        <p className="text-[11px] text-emerald-400/90 pl-3">
                                          <strong>Fix Direction:</strong> {pitfall.solution}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 5. Conventional Git Commit Suggestion */}
                            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-xs text-white/60">
                                <GitCommit className="w-4 h-4 text-[#FF7A00] shrink-0" />
                                <span>Suggested Git Commit:</span>
                                <code className="px-2 py-0.5 rounded bg-white/5 font-mono text-[11px] text-white/90">
                                  {task.commit_suggestion || `feat(task-${task.sequence}): ${task.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                </code>
                              </div>
                              <button
                                onClick={() =>
                                  handleCopy(
                                    `git commit -m "${task.commit_suggestion || `feat(task-${task.sequence}): ${task.title}`}"`,
                                    `${task.id}_commit`
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all shrink-0"
                              >
                                {copiedCodeKey === `${task.id}_commit` ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                {copiedCodeKey === `${task.id}_commit` ? 'Copied' : 'Copy Command'}
                              </button>
                            </div>

                            {/* 6. Task Completion Action Button */}
                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5">
                              <span className="text-[11px] text-white/40">
                                {isTaskCompleted
                                  ? 'Task verified complete on server.'
                                  : 'Completed coding and verified all criteria?'}
                              </span>

                              <button
                                onClick={() => handleCompleteTask(task.id, task.student_status)}
                                disabled={isTaskCompleted || isTaskUpdating}
                                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                                  isTaskCompleted
                                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 cursor-default'
                                    : 'bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white shadow-lg shadow-[#FF7A00]/20'
                                }`}
                              >
                                {isTaskUpdating ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : isTaskCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                                {isTaskCompleted
                                  ? 'Task Completed'
                                  : isTaskUpdating
                                  ? 'Completing...'
                                  : 'Mark Task Complete'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Milestone Completion Trigger Button */}
                {!isCompleted && isInProgress && (
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5">
                    <div className="text-xs text-white/50">
                      {allTasksDone
                        ? 'All milestone tasks completed! Claim your XP and advance.'
                        : `Complete all ${taskList.length} tasks to unlock milestone reward.`}
                    </div>

                    <button
                      onClick={() => handleCompleteMilestone(m.id)}
                      disabled={!allTasksDone || completingMilestoneId === m.id}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#FF7A00]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
