'use client';

import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Sparkles,
  BookOpen,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export interface GitWorkflow {
  branching_strategy?: string;
  recommended_branch_name?: string;
  conventional_commit_examples?: Array<{
    type?: string;
    example?: string;
    purpose?: string;
    code?: string;
  }>;
  pre_push_checklist?: string[];
  clean_push_workflow?: Array<{
    step?: number;
    title?: string;
    command?: string;
    description?: string;
  }>;
}

interface ProjectGitWorkflowProps {
  projectId: string;
  projectTitle: string;
  gitWorkflow?: GitWorkflow;
}

export default function ProjectGitWorkflow({
  projectId,
  projectTitle,
  gitWorkflow = {}
}: ProjectGitWorkflowProps) {
  const [prePushChecks, setPrePushChecks] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    if (!projectId) return;
    try {
      const saved = localStorage.getItem(`placely_git_prepush_${projectId}`);
      if (saved) setPrePushChecks(JSON.parse(saved));
    } catch {
      // Ignore
    }
  }, [projectId]);

  const handleToggleCheck = (idx: number) => {
    const updated = { ...prePushChecks, [idx]: !prePushChecks[idx] };
    setPrePushChecks(updated);
    try {
      localStorage.setItem(`placely_git_prepush_${projectId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const defaultChecklist = gitWorkflow.pre_push_checklist || [
    'All core unit & integration tests pass with 0 errors',
    'No secrets, private keys, or API tokens committed in code',
    '.env is explicitly added to .gitignore and .env.example exists',
    'Removed unnecessary debugging console.log/print statements',
    'README.md contains clear architecture, setup, and usage docs',
    'Working tree is clean: git status shows nothing uncommitted'
  ];

  const defaultCommitExamples = gitWorkflow.conventional_commit_examples || [
    { type: 'feat', example: 'feat(auth): implement jwt session verification', purpose: 'A new user-facing feature or capability.' },
    { type: 'fix', example: 'fix(layout): resolve 320px horizontal overflow in navbar', purpose: 'A bug fix or layout correction.' },
    { type: 'refactor', example: 'refactor(storage): extract atomic json writer service', purpose: 'Code restructuring without changing external behavior.' },
    { type: 'test', example: 'test(book): add edge-case unit tests for empty inputs', purpose: 'Adding or correcting automated test suites.' },
    { type: 'chore', example: 'chore(deps): configure eslint and prettier tokens', purpose: 'Build process, configuration, or dependency updates.' }
  ];

  const pushSequence = gitWorkflow.clean_push_workflow || [
    { step: 1, title: 'Inspect Working Tree', command: 'git status', description: 'Ensure only intentional modified and untracked files are staged.' },
    { step: 2, title: 'Stage Verified Changes', command: 'git add .', description: 'Stage all modified files for atomic commit.' },
    { step: 3, title: 'Semantic Commit', command: `git commit -m "feat: complete ${projectTitle.toLowerCase().slice(0, 30)} milestone implementation"`, description: 'Commit staged changes with conventional semantic message.' },
    { step: 4, title: 'Push to Remote', command: 'git push origin main', description: 'Push commits to your public GitHub repository.' }
  ];

  const totalChecks = defaultChecklist.length;
  const checkedCount = Object.values(prePushChecks).filter(Boolean).length;
  const checklistPercent = Math.round((checkedCount / totalChecks) * 100);

  return (
    <div className="space-y-8">
      {/* Top Banner: Git Discipline */}
      <div className="bg-gradient-to-br from-blue-950/40 via-neutral-900 to-black border border-blue-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider flex items-center gap-1">
                <GitBranch className="w-3 h-3" /> Version Control Discipline
              </span>
              <span className="text-xs text-white/40">• Semantic Git Standards</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Git Workflow &amp; Release Discipline
            </h2>
            <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
              Maintain professional git hygiene with semantic feature branches, conventional atomic commit messages, and systematic pre-push verification.
            </p>
          </div>

          {/* Pre-Push Readiness Gauge */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center sm:text-right shrink-0 min-w-[190px]">
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-semibold text-white/60">
              <span>Pre-Push Gate</span>
              <span className="text-blue-400 font-bold">{checklistPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden my-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${checklistPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-white/40 block">
              {checkedCount} of {totalChecks} Pre-Push Checks (Self-Reported)
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Branch Strategy & Initialization */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">1. Branch Strategy &amp; Scoping</h3>
            <p className="text-xs text-white/50">Why isolating features into dedicated branches protects production integrity.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-emerald-400 font-mono block">main</span>
            <p className="text-[11px] text-white/60">Production-ready trunk. Always deployable and verified.</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-blue-400 font-mono block">feature/&lt;milestone&gt;</span>
            <p className="text-[11px] text-white/60">Isolated feature branches for tasks before merging.</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-amber-400 font-mono block">fix/&lt;bug-name&gt;</span>
            <p className="text-[11px] text-white/60">Targeted bug fixes and regression remediation.</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Conventional Commits */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">2. Conventional Commit Standards</h3>
            <p className="text-xs text-white/50">Write commit messages that technical recruiters and engineering managers respect.</p>
          </div>
        </div>

        <div className="space-y-3">
          {defaultCommitExamples.map((ex, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                    {ex.type || 'commit'}
                  </span>
                  <span className="font-mono text-white/90 font-medium">{ex.example}</span>
                </div>
                {ex.purpose && <p className="text-white/50 pl-1">{ex.purpose}</p>}
              </div>

              <button
                onClick={() => handleCopy(`git commit -m "${ex.example}"`, `cmt_${idx}`)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-[11px] flex items-center gap-1.5 shrink-0 transition-all self-start sm:self-auto"
              >
                {copiedKey === `cmt_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === `cmt_${idx}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Pre-Push Safety Checklist */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3. Pre-Push Safety Gate</h3>
            <p className="text-xs text-white/50">Prevent embarrassing secret leaks and broken builds before running git push.</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {defaultChecklist.map((item, idx) => {
            const isChecked = !!prePushChecks[idx];
            return (
              <div
                key={idx}
                onClick={() => handleToggleCheck(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-blue-500/[0.03] border-blue-500/20'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <button className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/30" />
                  )}
                </button>
                <span className={`text-xs leading-relaxed ${isChecked ? 'text-white/50 line-through' : 'text-white/90'}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Guided Push Sequence */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">4. Atomic Push Execution Sequence</h3>
            <p className="text-xs text-white/50">Standard release workflow for submitting your codebase to GitHub.</p>
          </div>
        </div>

        <div className="space-y-4">
          {pushSequence.map((step, sIdx) => (
            <div key={sIdx} className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-cyan-500/20 flex items-center justify-center text-[10px]">
                    {step.step || sIdx + 1}
                  </span>
                  {step.title}
                </span>
                <span className="text-[10px] text-white/40">{step.description}</span>
              </div>

              {step.command && (
                <div className="relative group rounded-xl bg-black border border-white/10 p-3 font-mono text-xs text-cyan-400 overflow-x-auto">
                  <pre className="whitespace-pre">{step.command}</pre>
                  <button
                    onClick={() => handleCopy(step.command || '', `push_${sIdx}`)}
                    className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === `push_${sIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === `push_${sIdx}` ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
