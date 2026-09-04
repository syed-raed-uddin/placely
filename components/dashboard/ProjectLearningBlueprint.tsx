'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Brain,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Briefcase,
  Terminal,
  Target,
  Sparkles,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface PracticeExercise {
  exercise: string;
  instructions: string;
  expected_result?: string;
}

export interface MasteryCheck {
  question: string;
  criteria?: string;
  expected_answer?: string;
}

export interface LearningTopic {
  topic: string;
  importance?: string;
  why_it_matters?: string;
  mental_model?: string;
  what_to_learn?: string[];
  how_to_practice?: PracticeExercise[];
  project_application?: string;
  common_mistakes?: string[];
  mastery_check?: MasteryCheck[];
  interview_relevance?: string;
}

interface ProjectLearningBlueprintProps {
  projectId: string;
  topics: LearningTopic[];
  activeConceptFilter?: string | null;
  onClearFilter?: () => void;
  onGoToExecution?: () => void;
  milestones?: any[];
  onSelectTask?: (taskId: string, milestoneId?: string) => void;
}

export default function ProjectLearningBlueprint({
  projectId,
  topics = [],
  activeConceptFilter,
  onClearFilter,
  onGoToExecution,
  milestones = [],
  onSelectTask
}: ProjectLearningBlueprintProps) {
  const [expandedTopicIdx, setExpandedTopicIdx] = useState<number | null>(0);
  const [reviewedTopics, setReviewedTopics] = useState<Record<number, boolean>>({});
  const [selfCheckedQuestions, setSelfCheckedQuestions] = useState<Record<string, 'understood' | 'needs_review'>>({});
  const [revealedCriteria, setRevealedCriteria] = useState<Record<string, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Load local state from localStorage for persistence across reloads
  useEffect(() => {
    if (!projectId) return;
    try {
      const savedReviewed = localStorage.getItem(`placely_learning_reviewed_${projectId}`);
      if (savedReviewed) {
        setReviewedTopics(JSON.parse(savedReviewed));
      }
      const savedChecked = localStorage.getItem(`placely_learning_checks_${projectId}`);
      if (savedChecked) {
        setSelfCheckedQuestions(JSON.parse(savedChecked));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [projectId]);

  // If filtered by concept, auto-expand matching topic
  useEffect(() => {
    if (activeConceptFilter && topics.length > 0) {
      const matchIdx = topics.findIndex(
        (t) => t.topic.toLowerCase().includes(activeConceptFilter.toLowerCase())
      );
      if (matchIdx !== -1) {
        setExpandedTopicIdx(matchIdx);
      }
    }
  }, [activeConceptFilter, topics]);

  const toggleExpand = (idx: number) => {
    setExpandedTopicIdx((prev) => (prev === idx ? null : idx));
  };

  const handleToggleReviewed = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...reviewedTopics, [idx]: !reviewedTopics[idx] };
    setReviewedTopics(updated);
    try {
      localStorage.setItem(`placely_learning_reviewed_${projectId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleMasteryAssess = (qKey: string, assessment: 'understood' | 'needs_review') => {
    const updated = { ...selfCheckedQuestions, [qKey]: assessment };
    setSelfCheckedQuestions(updated);
    try {
      localStorage.setItem(`placely_learning_checks_${projectId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const toggleCriteriaReveal = (qKey: string) => {
    setRevealedCriteria((prev) => ({ ...prev, [qKey]: !prev[qKey] }));
  };

  if (!topics || topics.length === 0) {
    return (
      <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 text-center space-y-3">
        <BookOpen className="w-10 h-10 text-white/30 mx-auto" />
        <h3 className="text-base font-bold text-white">No Learning Topics Specified</h3>
        <p className="text-xs text-white/50 max-w-md mx-auto">
          This project focuses primarily on implementation milestones and technical defense.
        </p>
      </div>
    );
  }

  const totalTopics = topics.length;
  const reviewedCount = Object.values(reviewedTopics).filter(Boolean).length;
  const progressPercent = Math.round((reviewedCount / totalTopics) * 100);

  return (
    <div className="space-y-6">
      {/* Learning Blueprint Header Banner */}
      <div className="bg-gradient-to-br from-purple-950/40 via-neutral-900 to-black border border-purple-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-wider flex items-center gap-1">
                <Brain className="w-3 h-3" /> Core Engineering Foundations
              </span>
              <span className="text-xs text-white/40">• {totalTopics} Topics</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Learning Blueprint &amp; Mental Models
            </h2>
            <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
              Understand the core mental models, practice key implementation patterns, and master interview-critical tradeoffs before and while coding this project.
            </p>
          </div>

          {/* Learning Progress Gauge */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center sm:text-right shrink-0 min-w-[180px]">
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-semibold text-white/60">
              <span>Learning Progress</span>
              <span className="text-purple-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden my-2">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-[#FF7A00] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-white/40 block">
              {reviewedCount} of {totalTopics} topics reviewed (Self-Reported)
            </span>
          </div>
        </div>

        {/* Active Filter Pill (if navigated from task) */}
        {activeConceptFilter && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs">
            <span className="text-purple-300">
              Filtering by concept: <strong className="text-white">&ldquo;{activeConceptFilter}&rdquo;</strong>
            </span>
            {onClearFilter && (
              <button
                onClick={onClearFilter}
                className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-semibold transition-all"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Topics Accordion List */}
      <div className="space-y-4">
        {topics.map((topic, idx) => {
          const isExpanded = expandedTopicIdx === idx;
          const isReviewed = !!reviewedTopics[idx];
          const hasMasteryChecks = topic.mastery_check && topic.mastery_check.length > 0;
          const hasPractice = topic.how_to_practice && topic.how_to_practice.length > 0;

          // Compute matching execution tasks for bidirectional linking
          const topicTitleLower = (topic.topic || '').toLowerCase();
          const matchingTasks: Array<{ id: string; milestoneId: string; milestoneOrder: number; milestoneTitle: string; sequence: number; title: string }> = [];
          (milestones || []).forEach((m: any) => {
            (m.tasks || []).forEach((t: any) => {
              const conceptMatches = (t.concepts || []).some((c: string) => {
                const cl = (c || '').toLowerCase();
                return cl.includes(topicTitleLower) || topicTitleLower.includes(cl);
              });
              const titleMatches = (t.title || '').toLowerCase().includes(topicTitleLower);
              if (conceptMatches || titleMatches) {
                matchingTasks.push({
                  id: t.id,
                  milestoneId: m.id,
                  milestoneOrder: m.display_order || 1,
                  milestoneTitle: m.title || `Milestone ${m.display_order || 1}`,
                  sequence: t.sequence || 1,
                  title: t.title
                });
              }
            });
          });

          // Fallback: If no direct concept match, link to corresponding milestone sprint
          if (matchingTasks.length === 0 && milestones[idx]?.tasks?.[0]) {
            const fallbackTask = milestones[idx].tasks[0];
            matchingTasks.push({
              id: fallbackTask.id,
              milestoneId: milestones[idx].id,
              milestoneOrder: milestones[idx].display_order || idx + 1,
              milestoneTitle: milestones[idx].title || `Milestone ${idx + 1}`,
              sequence: fallbackTask.sequence || 1,
              title: fallbackTask.title
            });
          }

          return (
            <div
              key={idx}
              className={`border rounded-3xl overflow-hidden transition-all ${
                isExpanded
                  ? 'bg-neutral-900 border-purple-500/40 shadow-xl shadow-purple-500/5'
                  : isReviewed
                  ? 'bg-neutral-900/60 border-emerald-500/20 hover:border-emerald-500/40'
                  : 'bg-neutral-900/40 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Compact Card Header */}
              <div
                onClick={() => toggleExpand(idx)}
                className="p-5 md:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(idx);
                  }
                }}
              >
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 border ${
                      isReviewed
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : isExpanded
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    {isReviewed ? <CheckCircle2 className="w-5 h-5" /> : `0${idx + 1}`}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        {topic.importance || 'Core Engineering Topic'}
                      </span>
                      {isReviewed && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Reviewed
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white leading-snug">{topic.topic}</h3>
                    {!isExpanded && topic.why_it_matters && (
                      <p className="text-xs text-white/50 line-clamp-1 mt-0.5 leading-relaxed">
                        {topic.why_it_matters}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => handleToggleReviewed(idx, e)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isReviewed
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                        : 'bg-white/5 hover:bg-white/10 text-white/60 border border-white/10'
                    }`}
                    title={isReviewed ? 'Marked as reviewed' : 'Click to mark reviewed'}
                  >
                    {isReviewed ? <Check className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isReviewed ? 'Reviewed' : 'Mark Reviewed'}</span>
                  </button>

                  <div className="text-white/40 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Deep Learning Blueprint Panel */}
              {isExpanded && (
                <div className="p-5 md:p-8 pt-0 border-t border-white/5 space-y-8 animate-in fade-in duration-200">
                  {/* 1. Mental Model Callout */}
                  {topic.mental_model && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-neutral-950 to-neutral-950 border border-purple-500/30 space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                        <Brain className="w-4 h-4" /> How to Think About This (Mental Model)
                      </div>
                      <p className="text-sm text-purple-100/90 leading-relaxed italic font-medium">
                        &ldquo;{topic.mental_model}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* 2. Why It Matters & Project Application Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topic.why_it_matters && (
                      <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                          <Lightbulb className="w-4 h-4" /> Why It Matters in Real Engineering
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed">
                          {topic.why_it_matters}
                        </p>
                      </div>
                    )}

                    {topic.project_application && (
                      <div className="p-5 rounded-2xl bg-black/40 border border-[#FF7A00]/20 space-y-2">
                        <div className="flex items-center gap-2 text-[#FF7A00] font-bold text-xs uppercase tracking-wider">
                          <Target className="w-4 h-4" /> Application to This Project
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed">
                          {topic.project_application}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Connected Execution Tasks (Bidirectional Linking: Concept -> Task) */}
                  {matchingTasks.length > 0 && (
                    <div className="p-5 rounded-2xl bg-black/40 border border-purple-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-[#FF7A00]" />
                          Execution Tasks Applying This Concept
                        </span>
                        <span className="text-[11px] text-white/40 font-mono">
                          {matchingTasks.length} Connected Task{matchingTasks.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {matchingTasks.map((taskItem, tIdx) => (
                          <button
                            key={tIdx}
                            onClick={() => {
                              if (onSelectTask) {
                                onSelectTask(taskItem.id, taskItem.milestoneId);
                              } else if (onGoToExecution) {
                                onGoToExecution();
                              }
                            }}
                            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#FF7A00]/40 text-left transition-all flex items-center justify-between group"
                            title={`Jump to ${taskItem.title} in Execution`}
                          >
                            <div className="space-y-0.5 truncate pr-2">
                              <span className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-wider block">
                                {taskItem.milestoneTitle} • Task {taskItem.sequence}
                              </span>
                              <span className="text-xs font-semibold text-white/90 group-hover:text-white truncate block">
                                {taskItem.title}
                              </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF7A00] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. What You Need to Learn (Core Concept Checklist) */}
                  {topic.what_to_learn && topic.what_to_learn.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Core Concepts &amp; Patterns to Master
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {topic.what_to_learn.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white/80 flex items-start gap-2.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                            <span className="font-mono text-[11px] sm:text-xs">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Practice Exercises / Katas */}
                  {hasPractice && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Practice Katas (Try Before Building)
                      </h4>
                      <div className="space-y-3">
                        {topic.how_to_practice!.map((practice, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[10px]">
                                  {pIdx + 1}
                                </span>
                                {practice.exercise}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                                Hands-On Kata
                              </span>
                            </div>

                            <p className="text-xs text-white/70 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                              {practice.instructions}
                            </p>

                            {practice.expected_result && (
                              <div className="text-xs text-white/60 flex items-start gap-2">
                                <strong className="text-white/80 shrink-0">Expected Result:</strong>
                                <span>{practice.expected_result}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Common Engineering Mistakes */}
                  {topic.common_mistakes && topic.common_mistakes.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Common Failure Modes &amp; Anti-Patterns
                      </h4>
                      <div className="space-y-2">
                        {topic.common_mistakes.map((mistake, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-200/80 flex items-start gap-2.5"
                          >
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{mistake}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. Interactive Mastery Self-Check */}
                  {hasMasteryChecks && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Mastery Self-Check
                      </h4>
                      <div className="space-y-3">
                        {topic.mastery_check!.map((check, qIdx) => {
                          const qKey = `${idx}_q_${qIdx}`;
                          const isRevealed = !!revealedCriteria[qKey];
                          const assessment = selfCheckedQuestions[qKey];

                          return (
                            <div
                              key={qIdx}
                              className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4"
                            >
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                                  Self-Assessment Question {qIdx + 1}
                                </span>
                                <h5 className="text-sm font-bold text-white">{check.question}</h5>
                              </div>

                              {/* Toggle to reveal evaluation criteria */}
                              <div className="pt-1">
                                <button
                                  onClick={() => toggleCriteriaReveal(qKey)}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  {isRevealed ? 'Hide Evaluation Criteria' : 'Reveal Ideal Answer & Evaluation Criteria'}
                                </button>

                                {isRevealed && (
                                  <div className="mt-3 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200/90 space-y-1.5 animate-in fade-in duration-150">
                                    <strong className="block text-purple-300 uppercase tracking-wider text-[10px]">
                                      Expected Engineering Understanding:
                                    </strong>
                                    <p className="leading-relaxed font-sans">{check.criteria || check.expected_answer}</p>
                                  </div>
                                )}
                              </div>

                              {/* Self-Rating Buttons */}
                              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                                <span className="text-[11px] text-white/40">How well do you understand this?</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleMasteryAssess(qKey, 'needs_review')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                      assessment === 'needs_review'
                                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                                        : 'bg-white/5 hover:bg-white/10 text-white/50'
                                    }`}
                                  >
                                    <RotateCcw className="w-3 h-3" /> Needs Review
                                  </button>
                                  <button
                                    onClick={() => handleMasteryAssess(qKey, 'understood')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                      assessment === 'understood'
                                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                                        : 'bg-white/5 hover:bg-white/10 text-white/50'
                                    }`}
                                  >
                                    <Check className="w-3 h-3" /> I Understand This
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 7. Technical Interview Relevance */}
                  {topic.interview_relevance && (
                    <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-3">
                      <Briefcase className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                          Why Hiring Managers Ask This
                        </span>
                        <p className="text-xs text-white/70 leading-relaxed">
                          {topic.interview_relevance}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bottom Action: Mark Topic Complete & Jump to Execution */}
                  <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-white/40">
                      {isReviewed ? 'Topic marked as reviewed in your local progress.' : 'Ready to start implementing? Mark topic as reviewed.'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleToggleReviewed(idx, e)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isReviewed
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isReviewed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                        {isReviewed ? 'Marked as Reviewed' : 'Mark as Reviewed'}
                      </button>

                      {onGoToExecution && (
                        <button
                          onClick={onGoToExecution}
                          className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-black flex items-center gap-1.5 shadow-lg shadow-[#FF7A00]/20 transition-all"
                        >
                          <span>Start Building in Execution</span>
                          <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
