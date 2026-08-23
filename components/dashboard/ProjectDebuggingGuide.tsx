'use client';

import React, { useState, useEffect } from 'react';
import {
  Bug,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Terminal,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  Save,
  BookOpen,
  Sparkles,
  RotateCcw,
  Compass,
  FileCode2,
  Workflow
} from 'lucide-react';

export interface DebuggingItem {
  symptom: string;
  likely_causes?: string[];
  inspection_steps?: string[];
  fix_steps?: string[];
  verification?: string;
}

export interface DebugLogEntry {
  id: string;
  timestamp: string;
  problem: string;
  expected: string;
  actual: string;
  hypothesis: string;
  fix: string;
  learning: string;
}

interface ProjectDebuggingGuideProps {
  projectId: string;
  projectTitle: string;
  debuggingGuide?: DebuggingItem[];
}

export default function ProjectDebuggingGuide({
  projectId,
  projectTitle,
  debuggingGuide = []
}: ProjectDebuggingGuideProps) {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);
  const [debugLogs, setDebugLogs] = useState<DebugLogEntry[]>([]);
  const [showLogForm, setShowLogForm] = useState<boolean>(false);

  // New Log Form State
  const [newProblem, setNewProblem] = useState('');
  const [newExpected, setNewExpected] = useState('');
  const [newActual, setNewActual] = useState('');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newFix, setNewFix] = useState('');
  const [newLearning, setNewLearning] = useState('');

  // Load debug log from localStorage
  useEffect(() => {
    if (!projectId) return;
    try {
      const saved = localStorage.getItem(`placely_debug_logs_${projectId}`);
      if (saved) setDebugLogs(JSON.parse(saved));
    } catch {
      // Ignore
    }
  }, [projectId]);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProblem.trim()) return;

    const entry: DebugLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      problem: newProblem.trim(),
      expected: newExpected.trim(),
      actual: newActual.trim(),
      hypothesis: newHypothesis.trim(),
      fix: newFix.trim(),
      learning: newLearning.trim()
    };

    const updated = [entry, ...debugLogs];
    setDebugLogs(updated);
    try {
      localStorage.setItem(`placely_debug_logs_${projectId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Reset Form
    setNewProblem('');
    setNewExpected('');
    setNewActual('');
    setNewHypothesis('');
    setNewFix('');
    setNewLearning('');
    setShowLogForm(false);
  };

  const handleDeleteLog = (id: string) => {
    const updated = debugLogs.filter((l) => l.id !== id);
    setDebugLogs(updated);
    try {
      localStorage.setItem(`placely_debug_logs_${projectId}`, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const workflowSteps = [
    { title: '1. Reproduce', desc: 'Find the minimal, deterministic set of steps to trigger the bug on demand.' },
    { title: '2. Observe', desc: 'Check DevTools Console, Network requests, terminal logs, and system state.' },
    { title: '3. Isolate', desc: 'Narrow down the bug to a single file, function, component, or network boundary.' },
    { title: '4. Form Hypothesis', desc: 'Articulate why the bug occurs before changing a single line of code.' },
    { title: '5. Inspect & Fix', desc: 'Inspect variables with debugger/console.log and apply the smallest correct fix.' },
    { title: '6. Retest & Verify', desc: 'Verify the original bug is resolved AND no regressions were introduced.' }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner: Debugging Center */}
      <div className="bg-gradient-to-br from-rose-950/40 via-neutral-900 to-black border border-rose-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider flex items-center gap-1">
                <Bug className="w-3 h-3" /> Diagnostic Cockpit
              </span>
              <span className="text-xs text-white/40">• Root Cause Analysis</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Troubleshooting &amp; Debugging Center
            </h2>
            <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
              Diagnose runtime exceptions, resolve architectural failure modes, follow scientific debugging workflows, and record your engineering learnings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center sm:text-right shrink-0 min-w-[190px]">
            <span className="text-xs text-white/50 block">Diagnostic Patterns</span>
            <strong className="text-base font-extrabold text-rose-400 mt-0.5 block">
              {debuggingGuide.length} Known Failure Modes
            </strong>
            <span className="text-[10px] text-white/40 block mt-1">
              {debugLogs.length} Student Debug Logs Saved
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Scientific Debugging Decision Tree / Workflow */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">1. Scientific Debugging Workflow</h3>
            <p className="text-xs text-white/50">Follow systematic root cause analysis rather than random guesswork.</p>
          </div>
        </div>

        {/* Step Progression */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {workflowSteps.map((step, sIdx) => {
            const isActive = activeWorkflowStep === sIdx;
            return (
              <div
                key={sIdx}
                onClick={() => setActiveWorkflowStep(sIdx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  isActive
                    ? 'bg-purple-500/15 border-purple-500/40 shadow-lg shadow-purple-500/5'
                    : 'bg-black/40 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isActive ? 'text-purple-300' : 'text-white'}`}>
                    {step.title}
                  </span>
                  {isActive && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Known Failure Modes & Troubleshooting Matrix */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">2. Troubleshooting Matrix &amp; Fixes</h3>
            <p className="text-xs text-white/50">Common architectural failure modes, inspection procedures, and solutions.</p>
          </div>
        </div>

        {debuggingGuide.length > 0 ? (
          <div className="space-y-4">
            {debuggingGuide.map((item, idx) => (
              <div
                key={idx}
                className="p-5 md:p-6 rounded-2xl bg-black/50 border border-white/10 space-y-4"
              >
                {/* Symptom */}
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                      Observed Symptom
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {item.symptom}
                    </h4>
                  </div>
                </div>

                {/* 4-Box Troubleshooting Pipeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Likely Causes */}
                  {item.likely_causes && item.likely_causes.length > 0 && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3" /> Likely Root Causes
                      </span>
                      <ul className="space-y-1 text-xs text-white/70 pl-2">
                        {item.likely_causes.map((c, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-1.5">
                            <span className="text-amber-400 leading-none">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Inspection Steps */}
                  {item.inspection_steps && item.inspection_steps.length > 0 && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1.5">
                        <Search className="w-3 h-3" /> What to Inspect First
                      </span>
                      <ul className="space-y-1 text-xs text-white/70 pl-2">
                        {item.inspection_steps.map((ins, insIdx) => (
                          <li key={insIdx} className="flex items-start gap-1.5">
                            <span className="text-blue-400 leading-none">•</span>
                            <span className="font-mono text-[11px] sm:text-xs">{ins}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fix Steps */}
                  {item.fix_steps && item.fix_steps.length > 0 && (
                    <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" /> Concrete Fix Steps
                      </span>
                      <ul className="space-y-1 text-xs text-emerald-200/90 pl-2">
                        {item.fix_steps.map((fix, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 leading-none font-bold">✓</span>
                            <span>{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Verification */}
                  {item.verification && (
                    <div className="p-4 rounded-xl bg-purple-500/[0.03] border border-purple-500/20 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> Objective Verification
                      </span>
                      <p className="text-xs text-purple-200/90 leading-relaxed font-medium">
                        {item.verification}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-white/50">
            No known architectural failure modes recorded for this blueprint.
          </div>
        )}
      </div>

      {/* SECTION 3: Student-Owned Engineering Debug Log */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">3. Engineering Debugging Log</h3>
              <p className="text-xs text-white/50">Document bugs you encounter, hypotheses tested, and takeaways.</p>
            </div>
          </div>

          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="px-4 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#FF7A00]/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{showLogForm ? 'Close Form' : 'Log New Issue'}</span>
          </button>
        </div>

        {/* New Log Entry Form */}
        {showLogForm && (
          <form onSubmit={handleSaveLog} className="p-5 rounded-2xl bg-black/60 border border-[#FF7A00]/30 space-y-4 animate-in fade-in duration-150">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF7A00]">Record Diagnostic Log</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60">Problem Statement *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CORS error when requesting /api/data"
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF7A00]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60">What I Expected</label>
                <input
                  type="text"
                  placeholder="e.g. 200 OK JSON response"
                  value={newExpected}
                  onChange={(e) => setNewExpected(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF7A00]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60">What Actually Happened</label>
                <input
                  type="text"
                  placeholder="e.g. Blocked by CORS policy: No 'Access-Control-Allow-Origin'"
                  value={newActual}
                  onChange={(e) => setNewActual(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF7A00]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60">Root Cause Hypothesis</label>
                <input
                  type="text"
                  placeholder="e.g. Backend ALLOWED_ORIGINS missing port 5050"
                  value={newHypothesis}
                  onChange={(e) => setNewHypothesis(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF7A00]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60">What Fixed It</label>
                <input
                  type="text"
                  placeholder="e.g. Added origin to Flask CORS configuration"
                  value={newFix}
                  onChange={(e) => setNewFix(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF7A00]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60">Key Learning / Takeaway</label>
                <input
                  type="text"
                  placeholder="e.g. Always check preflight OPTIONS headers"
                  value={newLearning}
                  onChange={(e) => setNewLearning(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF7A00]/50"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#FF7A00]/20"
              >
                <Save className="w-3.5 h-3.5" /> Save Diagnostic Log
              </button>
            </div>
          </form>
        )}

        {/* Existing Log Entries */}
        {debugLogs.length > 0 ? (
          <div className="space-y-3">
            {debugLogs.map((log) => (
              <div
                key={log.id}
                className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/10 text-white/60">
                      {log.timestamp}
                    </span>
                    <h5 className="text-xs font-bold text-white">{log.problem}</h5>
                  </div>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="text-white/30 hover:text-rose-400 p-1 transition-colors"
                    title="Delete log entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-white/[0.01] p-3 rounded-xl border border-white/5 font-sans">
                  <div>
                    <strong className="text-white/40 block text-[10px] uppercase">Expected:</strong>
                    <span className="text-white/70">{log.expected || 'N/A'}</span>
                  </div>
                  <div>
                    <strong className="text-rose-400 block text-[10px] uppercase">Actual:</strong>
                    <span className="text-rose-200/80">{log.actual || 'N/A'}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-400 block text-[10px] uppercase">Solution:</strong>
                    <span className="text-emerald-200/90 font-medium">{log.fix || 'N/A'}</span>
                  </div>
                </div>

                {log.learning && (
                  <p className="text-[11px] text-purple-300 italic pl-1">
                    Takeaway: {log.learning}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-white/40">
            No personal debugging logs recorded yet. Click &ldquo;Log New Issue&rdquo; whenever you resolve a bug to build your engineering problem-solving evidence.
          </div>
        )}
      </div>
    </div>
  );
}
