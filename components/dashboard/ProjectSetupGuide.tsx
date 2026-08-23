'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Terminal,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FolderTree,
  KeyRound,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  Clock,
  Layers,
  Cpu,
  MonitorCheck
} from 'lucide-react';

export interface PrerequisiteKnowledge {
  concept: string;
  why_needed?: string;
  verification?: string;
  remediation?: string;
}

export interface PrerequisiteSoftware {
  name: string;
  min_version?: string;
  purpose?: string;
  install_url?: string;
}

export interface PrerequisiteRuntime {
  name: string;
  version?: string;
  command_check?: string;
}

export interface ReadinessCheck {
  question: string;
  expected_answer?: string;
}

export interface Prerequisites {
  minimum_level?: string;
  knowledge?: PrerequisiteKnowledge[];
  software?: PrerequisiteSoftware[];
  runtime?: PrerequisiteRuntime[];
  tools?: Array<{ name: string; purpose?: string }>;
  recommended_prior_learning?: string[];
  readiness_check?: ReadinessCheck[];
}

export interface SetupEnvironmentStep {
  step?: number;
  title: string;
  command?: string;
  description?: string;
  expected_output?: string;
}

export interface EnvironmentVariable {
  key: string;
  description?: string;
  is_secret?: boolean;
  example_value?: string;
  where_to_obtain?: string;
}

export interface SanityCheck {
  action: string;
  expected_result?: string;
  failure_signal?: string;
}

export interface SetupGuide {
  environment?: SetupEnvironmentStep[];
  installation_steps?: Array<{ step?: number; title?: string; command?: string; explanation?: string }>;
  initialization?: {
    init_commands?: string[];
    folder_structure?: string;
  };
  environment_variables?: EnvironmentVariable[];
  sanity_checks?: SanityCheck[];
  common_setup_errors?: Array<{ error: string; cause?: string; solution?: string }>;
}

interface ProjectSetupGuideProps {
  projectId: string;
  projectTitle: string;
  difficulty?: string;
  estimatedHours?: number;
  prerequisites?: Prerequisites;
  setupGuide?: SetupGuide;
  onGoToExecution?: () => void;
}

export default function ProjectSetupGuide({
  projectId,
  projectTitle,
  difficulty = 'Intermediate',
  estimatedHours = 10,
  prerequisites = {},
  setupGuide = {},
  onGoToExecution
}: ProjectSetupGuideProps) {
  const [sanityChecksState, setSanityChecksState] = useState<Record<number, boolean>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load sanity checks from localStorage
  useEffect(() => {
    if (!projectId) return;
    try {
      const saved = localStorage.getItem(`placely_setup_sanity_${projectId}`);
      if (saved) setSanityChecksState(JSON.parse(saved));
    } catch {
      // Ignore storage errors
    }
  }, [projectId]);

  const handleToggleSanity = (idx: number) => {
    const updated = { ...sanityChecksState, [idx]: !sanityChecksState[idx] };
    setSanityChecksState(updated);
    try {
      localStorage.setItem(`placely_setup_sanity_${projectId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleAnswerReveal = (idx: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const sanityList = setupGuide.sanity_checks || [
    { action: 'Verify runtime is installed', expected_result: 'Runtime binary outputs version correctly.' },
    { action: 'Verify Git is initialized in workspace', expected_result: 'git status executes with clean working tree.' },
    { action: 'Verify dependencies are installed', expected_result: 'Build or test runner executes cleanly.' },
    { action: 'Verify local development server starts', expected_result: 'Application boots and listens on local port.' }
  ];

  const totalSanity = sanityList.length;
  const checkedSanity = Object.values(sanityChecksState).filter(Boolean).length;
  const sanityPercent = Math.round((checkedSanity / totalSanity) * 100);

  const envVars = setupGuide.environment_variables || [];
  const hasEnvVars = envVars.length > 0 && envVars.some((v) => v.key !== 'NONE');

  return (
    <div className="space-y-8">
      {/* Top Banner: Readiness Gate Overview */}
      <div className="bg-gradient-to-br from-amber-950/40 via-neutral-900 to-black border border-amber-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1">
                <Wrench className="w-3 h-3" /> Environment Onboarding
              </span>
              <span className="text-xs text-white/40">• Level: {difficulty}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Before You Start &amp; Setup Guide
            </h2>
            <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
              Verify your local development toolchain, scaffold the modular project architecture, configure environment safety, and run sanity checks before writing application code.
            </p>
          </div>

          {/* Sanity Check Progress Gauge */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center sm:text-right shrink-0 min-w-[190px]">
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-semibold text-white/60">
              <span>Environment Readiness</span>
              <span className="text-amber-400 font-bold">{sanityPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden my-2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#FF7A00] rounded-full transition-all duration-500"
                style={{ width: `${sanityPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-white/40 block">
              {checkedSanity} of {totalSanity} Sanity Checks (Self-Reported)
            </span>
          </div>
        </div>
      </div>

      {/* SECTION A: Prerequisites & Toolchain Verification */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">1. Required Toolchain &amp; Runtimes</h3>
            <p className="text-xs text-white/50">Required development software and verification commands.</p>
          </div>
        </div>

        {/* Runtime & Software Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Software */}
          {(prerequisites.software || []).map((soft, sIdx) => (
            <div key={sIdx} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{soft.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-white/60">
                  {soft.min_version || 'Latest'}
                </span>
              </div>
              <p className="text-xs text-white/50">{soft.purpose}</p>
              {soft.install_url && (
                <a
                  href={soft.install_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF7A00] hover:underline pt-1"
                >
                  <span>Download / Docs</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          ))}

          {/* Runtimes */}
          {(prerequisites.runtime || []).map((run, rIdx) => (
            <div key={rIdx} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{run.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                  {run.version}
                </span>
              </div>
              {run.command_check && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-black font-mono text-[11px] text-white/80 border border-white/5">
                  <code>{run.command_check}</code>
                  <button
                    onClick={() => handleCopy(run.command_check || '', `run_${rIdx}`)}
                    className="text-white/40 hover:text-white"
                  >
                    {copiedKey === `run_${rIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Knowledge & Concept Readiness */}
        {prerequisites.knowledge && prerequisites.knowledge.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Prerequisite Knowledge &amp; Remediation
            </h4>
            <div className="space-y-2.5">
              {prerequisites.knowledge.map((k, kIdx) => (
                <div
                  key={kIdx}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <strong className="text-white font-bold block">{k.concept}</strong>
                    <p className="text-white/60">{k.why_needed}</p>
                    {k.verification && (
                      <p className="text-[11px] text-purple-300/80 italic">
                        Self-Check: {k.verification}
                      </p>
                    )}
                  </div>
                  {k.remediation && (
                    <span className="text-[11px] text-amber-400/90 font-medium bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
                      {k.remediation}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Readiness Check Questions */}
        {prerequisites.readiness_check && prerequisites.readiness_check.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Readiness Self-Assessment
            </h4>
            <div className="space-y-3">
              {prerequisites.readiness_check.map((rc, qIdx) => {
                const isRevealed = !!revealedAnswers[qIdx];
                return (
                  <div key={qIdx} className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-bold text-white">{rc.question}</span>
                      <button
                        onClick={() => toggleAnswerReveal(qIdx)}
                        className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 shrink-0"
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isRevealed ? 'Hide' : 'Reveal Expected Answer'}</span>
                      </button>
                    </div>
                    {isRevealed && (
                      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200/90 leading-relaxed animate-in fade-in duration-150">
                        {rc.expected_answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SECTION B: Environment Setup & Scaffolding Commands */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">2. Project Scaffolding &amp; Execution</h3>
            <p className="text-xs text-white/50">Step-by-step terminal commands to initialize your codebase.</p>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="space-y-4">
          {(setupGuide.environment || []).map((envStep, eIdx) => (
            <div key={eIdx} className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[10px]">
                    {envStep.step || eIdx + 1}
                  </span>
                  {envStep.title}
                </span>
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                  Terminal Command
                </span>
              </div>

              {envStep.description && (
                <p className="text-xs text-white/60 leading-relaxed">{envStep.description}</p>
              )}

              {/* Command Box */}
              {envStep.command && (
                <div className="relative group rounded-xl bg-black border border-white/10 p-3.5 font-mono text-xs text-[#FF7A00] overflow-x-auto">
                  <pre className="whitespace-pre">{envStep.command}</pre>
                  <button
                    onClick={() => handleCopy(envStep.command || '', `env_${eIdx}`)}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === `env_${eIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === `env_${eIdx}` ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}

              {envStep.expected_output && (
                <div className="text-[11px] text-white/50 flex items-start gap-1.5 pl-1">
                  <strong className="text-white/70 shrink-0">Expected Terminal Output:</strong>
                  <span>{envStep.expected_output}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recommended Folder Structure */}
        {setupGuide.initialization?.folder_structure && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-blue-400" /> Target Modular Architecture
            </h4>
            <div className="relative rounded-2xl bg-black border border-white/10 p-4 font-mono text-xs text-emerald-400/90 overflow-x-auto">
              <pre className="whitespace-pre">{setupGuide.initialization.folder_structure}</pre>
              <button
                onClick={() => handleCopy(setupGuide.initialization?.folder_structure || '', 'folder_tree')}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1 transition-all"
              >
                {copiedKey === 'folder_tree' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'folder_tree' ? 'Copied' : 'Copy Structure'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION C: Environment Variable Security */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3. Environment Variables &amp; Secret Hygiene</h3>
            <p className="text-xs text-white/50">Manage local runtime configuration safely without leaking secrets.</p>
          </div>
        </div>

        {hasEnvVars ? (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-white/50">
                    <th className="p-3.5 font-bold uppercase tracking-wider">Variable Name</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">Secret?</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">Purpose</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">Example Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {envVars.map((v, vIdx) => (
                    <tr key={vIdx} className="hover:bg-white/[0.01]">
                      <td className="p-3.5 font-mono font-bold text-[#FF7A00]">{v.key}</td>
                      <td className="p-3.5">
                        {v.is_secret ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">
                            SECRET (DO NOT COMMIT)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-white/60">
                            Public
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">{v.description}</td>
                      <td className="p-3.5 font-mono text-white/60">{v.example_value || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Explicit Security Warning */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-200">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-rose-300 font-bold block">Production Secret Hygiene Rule</strong>
                <p className="leading-relaxed">
                  Never commit <code>.env</code>, API keys, database connection strings, or personal access tokens to GitHub. Always list <code>.env</code> in your <code>.gitignore</code> and provide a sanitized <code>.env.example</code> for reviewers.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-white/60 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No secret API keys or complex environment variables required for this project.</span>
          </div>
        )}
      </div>

      {/* SECTION D: Environment Sanity Check */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <MonitorCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">4. Environment Sanity Check</h3>
            <p className="text-xs text-white/50">Verify all systems are operational before beginning Milestone 1.</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {sanityList.map((check, sIdx) => {
            const isChecked = !!sanityChecksState[sIdx];
            return (
              <div
                key={sIdx}
                onClick={() => handleToggleSanity(sIdx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-emerald-500/[0.03] border-emerald-500/20'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <button className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/30" />
                  )}
                </button>
                <div className="space-y-1 flex-1 text-xs">
                  <span className={`font-bold block ${isChecked ? 'text-white/60 line-through' : 'text-white'}`}>
                    {check.action}
                  </span>
                  {check.expected_result && (
                    <p className="text-white/50">
                      <strong>Expected:</strong> {check.expected_result}
                    </p>
                  )}
                  {check.failure_signal && (
                    <p className="text-rose-400/80 text-[11px]">
                      <strong>Failure Signal:</strong> {check.failure_signal}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Common Setup Errors */}
        {setupGuide.common_setup_errors && setupGuide.common_setup_errors.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Common Setup Traps &amp; Quick Fixes
            </h4>
            <div className="space-y-2">
              {setupGuide.common_setup_errors.map((err, errIdx) => (
                <div
                  key={errIdx}
                  className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 space-y-1"
                >
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {err.error}
                  </div>
                  {err.cause && (
                    <p className="text-[11px] text-white/60 pl-3">
                      <strong>Cause:</strong> {err.cause}
                    </p>
                  )}
                  {err.solution && (
                    <p className="text-[11px] text-emerald-400/90 pl-3">
                      <strong>Solution:</strong> {err.solution}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Action: Jump to Milestone Execution */}
        {onGoToExecution && (
          <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-white/40">
              Verified your local environment? You are ready to start coding.
            </span>
            <button
              onClick={onGoToExecution}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-black flex items-center gap-2 shadow-lg shadow-[#FF7A00]/25 transition-all"
            >
              <span>Start Milestone 1 Tasks</span>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
