'use client';

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CircleDot,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Bomb,
  Layers,
  HelpCircle,
  Flame
} from 'lucide-react';

export type TestStatus = 'not_tested' | 'passed' | 'failed' | 'blocked';

export interface TestScenario {
  name: string;
  given?: string;
  when?: string;
  then?: string;
  why_it_matters?: string;
}

export interface EdgeCaseScenario {
  name: string;
  scenario: string;
  expected_behavior: string;
}

export interface AutomatedTestExample {
  framework?: string;
  test_file?: string;
  description?: string;
  code_snippet?: string;
}

export interface TestingGuide {
  strategy_overview?: string;
  happy_path_scenarios?: TestScenario[];
  negative_test_scenarios?: TestScenario[];
  edge_cases?: EdgeCaseScenario[];
  manual_qa_checklist?: string[];
  automated_test_examples?: AutomatedTestExample[];
}

interface ProjectTestingGuideProps {
  projectId: string;
  projectTitle: string;
  testingGuide?: TestingGuide;
}

export default function ProjectTestingGuide({
  projectId,
  projectTitle,
  testingGuide = {}
}: ProjectTestingGuideProps) {
  // Test statuses: { [scenarioKey]: TestStatus }
  const [testStatuses, setTestStatuses] = useState<Record<string, TestStatus>>({});
  const [manualChecks, setManualChecks] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    if (!projectId) return;
    try {
      const savedStatuses = localStorage.getItem(`placely_qa_statuses_${projectId}`);
      if (savedStatuses) setTestStatuses(JSON.parse(savedStatuses));

      const savedManual = localStorage.getItem(`placely_qa_manual_${projectId}`);
      if (savedManual) setManualChecks(JSON.parse(savedManual));
    } catch {
      // Ignore
    }
  }, [projectId]);

  const handleSetStatus = (key: string, status: TestStatus) => {
    const updated = { ...testStatuses, [key]: status };
    setTestStatuses(updated);
    try {
      localStorage.setItem(`placely_qa_statuses_${projectId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleToggleManual = (idx: number) => {
    const updated = { ...manualChecks, [idx]: !manualChecks[idx] };
    setManualChecks(updated);
    try {
      localStorage.setItem(`placely_qa_manual_${projectId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const happyPaths = testingGuide.happy_path_scenarios || [];
  const negativeCases = testingGuide.negative_test_scenarios || [];
  const edgeCases = testingGuide.edge_cases || [];
  const manualList = testingGuide.manual_qa_checklist || [];
  const autoExamples = testingGuide.automated_test_examples || [];

  const allScenarioKeys = [
    ...happyPaths.map((_, i) => `happy_${i}`),
    ...negativeCases.map((_, i) => `neg_${i}`),
    ...edgeCases.map((_, i) => `edge_${i}`)
  ];

  const totalScenarios = allScenarioKeys.length;
  const passedCount = Object.values(testStatuses).filter((s) => s === 'passed').length;
  const failedCount = Object.values(testStatuses).filter((s) => s === 'failed').length;
  const blockedCount = Object.values(testStatuses).filter((s) => s === 'blocked').length;
  const completedCount = passedCount + failedCount + blockedCount;
  const progressPercent = totalScenarios > 0 ? Math.round((completedCount / totalScenarios) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner: QA Testing Cockpit */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-black border border-emerald-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                <FlaskConical className="w-3 h-3" /> QA &amp; Verification Suite
              </span>
              <span className="text-xs text-white/40">• Multi-Layer Test Strategy</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Systematic Testing &amp; QA Matrix
            </h2>
            <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
              {testingGuide.strategy_overview ||
                'Systematically verify your implementation across happy path user flows, negative input failures, and extreme edge conditions.'}
            </p>
          </div>

          {/* QA Metrics Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center sm:text-right shrink-0 min-w-[210px] space-y-2">
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-semibold text-white/60">
              <span>QA Execution</span>
              <span className="text-emerald-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#FF7A00] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/50 font-mono">
              <span className="text-emerald-400">✓ {passedCount} Pass</span>
              <span className="text-rose-400">✕ {failedCount} Fail</span>
              <span className="text-amber-400">⚠ {blockedCount} Blocked</span>
              <span>{totalScenarios - completedCount} Left</span>
            </div>
            <span className="text-[9px] text-white/30 block italic">Self-Reported QA Results</span>
          </div>
        </div>
      </div>

      {/* LAYER 1: Smoke Testing */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Layer 1: Smoke Tests (Core Health)</h3>
            <p className="text-xs text-white/50">Does the application fundamentally boot without fatal runtime crashes?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-white block">1. Application Boots</span>
            <p className="text-[11px] text-white/50">Local dev server or CLI executable starts up cleanly with 0 syntax errors.</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-white block">2. Primary Route / Menu</span>
            <p className="text-[11px] text-white/50">Default view renders immediately with all interactive controls visible.</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-white block">3. Zero Fatal Console Logs</span>
            <p className="text-[11px] text-white/50">DevTools console has zero uncaught exceptions or unhandled promise rejections.</p>
          </div>
        </div>
      </div>

      {/* LAYER 2: Happy Path Scenarios */}
      {happyPaths.length > 0 && (
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Layer 2: Happy Path User Scenarios</h3>
              <p className="text-xs text-white/50">Given / When / Then workflows representing successful user journeys.</p>
            </div>
          </div>

          <div className="space-y-4">
            {happyPaths.map((scenario, idx) => {
              const key = `happy_${idx}`;
              const currentStatus = testStatuses[key] || 'not_tested';

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {scenario.name}
                    </span>

                    {/* 4-Way Status Selector */}
                    <div className="flex items-center gap-1.5 bg-black p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => handleSetStatus(key, 'not_tested')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'not_tested'
                            ? 'bg-white/15 text-white'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        Not Tested
                      </button>
                      <button
                        onClick={() => handleSetStatus(key, 'passed')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'passed'
                            ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/40'
                            : 'text-white/40 hover:text-emerald-400'
                        }`}
                      >
                        ✓ Passed
                      </button>
                      <button
                        onClick={() => handleSetStatus(key, 'failed')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'failed'
                            ? 'bg-rose-500/25 text-rose-400 border border-rose-500/40'
                            : 'text-white/40 hover:text-rose-400'
                        }`}
                      >
                        ✕ Failed
                      </button>
                      <button
                        onClick={() => handleSetStatus(key, 'blocked')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'blocked'
                            ? 'bg-amber-500/25 text-amber-400 border border-amber-500/40'
                            : 'text-white/40 hover:text-amber-400'
                        }`}
                      >
                        ⚠ Blocked
                      </button>
                    </div>
                  </div>

                  {/* Given / When / Then Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-white/[0.02] p-4 rounded-xl border border-white/5 font-sans">
                    <div>
                      <strong className="text-emerald-400 block uppercase tracking-wider text-[10px]">
                        GIVEN:
                      </strong>
                      <span className="text-white/70">{scenario.given || 'System in baseline state'}</span>
                    </div>
                    <div>
                      <strong className="text-[#FF7A00] block uppercase tracking-wider text-[10px]">
                        WHEN:
                      </strong>
                      <span className="text-white/70">{scenario.when || 'User performs core action'}</span>
                    </div>
                    <div>
                      <strong className="text-purple-400 block uppercase tracking-wider text-[10px]">
                        THEN:
                      </strong>
                      <span className="text-white/70">{scenario.then || 'Expected output occurs'}</span>
                    </div>
                  </div>

                  {scenario.why_it_matters && (
                    <div className="text-[11px] text-white/40 italic">
                      Engineering Rationale: {scenario.why_it_matters}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LAYER 3: Negative Testing */}
      {negativeCases.length > 0 && (
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Layer 3: Negative Testing (Failure Resilience)</h3>
              <p className="text-xs text-white/50">Does your system handle invalid, malformed, or missing inputs gracefully?</p>
            </div>
          </div>

          <div className="space-y-4">
            {negativeCases.map((scenario, idx) => {
              const key = `neg_${idx}`;
              const currentStatus = testStatuses[key] || 'not_tested';

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {scenario.name}
                    </span>

                    {/* 4-Way Status Selector */}
                    <div className="flex items-center gap-1.5 bg-black p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => handleSetStatus(key, 'not_tested')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'not_tested'
                            ? 'bg-white/15 text-white'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        Not Tested
                      </button>
                      <button
                        onClick={() => handleSetStatus(key, 'passed')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'passed'
                            ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/40'
                            : 'text-white/40 hover:text-emerald-400'
                        }`}
                      >
                        ✓ Passed
                      </button>
                      <button
                        onClick={() => handleSetStatus(key, 'failed')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'failed'
                            ? 'bg-rose-500/25 text-rose-400 border border-rose-500/40'
                            : 'text-white/40 hover:text-rose-400'
                        }`}
                      >
                        ✕ Failed
                      </button>
                      <button
                        onClick={() => handleSetStatus(key, 'blocked')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'blocked'
                            ? 'bg-amber-500/25 text-amber-400 border border-amber-500/40'
                            : 'text-white/40 hover:text-amber-400'
                        }`}
                      >
                        ⚠ Blocked
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-rose-500/[0.02] p-4 rounded-xl border border-rose-500/10 font-sans">
                    <div>
                      <strong className="text-rose-400 block uppercase tracking-wider text-[10px]">
                        GIVEN:
                      </strong>
                      <span className="text-white/70">{scenario.given || 'Invalid input condition'}</span>
                    </div>
                    <div>
                      <strong className="text-[#FF7A00] block uppercase tracking-wider text-[10px]">
                        WHEN:
                      </strong>
                      <span className="text-white/70">{scenario.when || 'Operation attempted'}</span>
                    </div>
                    <div>
                      <strong className="text-purple-400 block uppercase tracking-wider text-[10px]">
                        THEN:
                      </strong>
                      <span className="text-white/70">{scenario.then || 'Graceful recovery with validation message'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LAYER 4: "Break Your Project" Edge Cases */}
      {edgeCases.length > 0 && (
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bomb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Layer 4: &ldquo;Break Your Project&rdquo; Edge Cases</h3>
              <p className="text-xs text-white/50">Deliberately stress test boundary values, empty files, and unusual states.</p>
            </div>
          </div>

          <div className="space-y-4">
            {edgeCases.map((edge, idx) => {
              const key = `edge_${idx}`;
              const currentStatus = testStatuses[key] || 'not_tested';

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-sm font-bold text-purple-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {edge.name}
                    </span>

                    {/* Status Selector */}
                    <div className="flex items-center gap-1.5 bg-black p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => handleSetStatus(key, 'not_tested')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'not_tested'
                            ? 'bg-white/15 text-white'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        Not Tested
                      </button>
                      <button
                        onClick={() => handleSetStatus(key, 'passed')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'passed'
                            ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/40'
                            : 'text-white/40 hover:text-emerald-400'
                        }`}
                      >
                        ✓ Passed
                      </button>
                      <button
                        onClick={() => handleSetStatus(key, 'failed')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          currentStatus === 'failed'
                            ? 'bg-rose-500/25 text-rose-400 border border-rose-500/40'
                            : 'text-white/40 hover:text-rose-400'
                        }`}
                      >
                        ✕ Failed
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs space-y-1.5">
                    <p className="text-white/80">
                      <strong>Scenario:</strong> {edge.scenario}
                    </p>
                    <p className="text-purple-300 font-medium">
                      <strong>Expected Defensive Behavior:</strong> {edge.expected_behavior}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LAYER 5: Automated Test Examples */}
      {autoExamples.length > 0 && (
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Layer 5: Automated Code Verification</h3>
              <p className="text-xs text-white/50">Run automated unit and integration tests locally.</p>
            </div>
          </div>

          <div className="space-y-4">
            {autoExamples.map((ex, exIdx) => (
              <div key={exIdx} className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                      {ex.framework || 'Automated Test'}
                    </span>
                    <span className="text-xs font-bold text-white">{ex.test_file}</span>
                  </div>
                  {ex.description && <span className="text-[11px] text-white/40">{ex.description}</span>}
                </div>

                {ex.code_snippet && (
                  <div className="relative group rounded-xl bg-black border border-white/10 p-3.5 font-mono text-xs text-emerald-400 overflow-x-auto">
                    <pre className="whitespace-pre">{ex.code_snippet}</pre>
                    <button
                      onClick={() => handleCopy(ex.code_snippet || '', `auto_${exIdx}`)}
                      className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1 transition-all"
                    >
                      {copiedKey === `auto_${exIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === `auto_${exIdx}` ? 'Copied' : 'Copy Test'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LAYER 6: Manual QA Release Checklist */}
      {manualList.length > 0 && (
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Layer 6: Manual QA Release Checklist</h3>
              <p className="text-xs text-white/50">Final checklist before submitting your repository for verification.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {manualList.map((item, mIdx) => {
              const isChecked = !!manualChecks[mIdx];
              return (
                <div
                  key={mIdx}
                  onClick={() => handleToggleManual(mIdx)}
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
                      <CircleDot className="w-4 h-4 text-white/30" />
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
      )}
    </div>
  );
}
