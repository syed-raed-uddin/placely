'use client';

import React, { useState, useEffect } from 'react';
import {
  PackageCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode2,
  GitBranch,
  Terminal,
  Globe,
  Award,
  BookOpen,
  Sparkles,
  RefreshCw,
  Loader2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface EvidencePackProps {
  studentProjectId?: string;
  projectTitle: string;
  githubUrl?: string;
  deploymentUrl?: string;
  deploymentVerified?: boolean;
  onRefreshData?: () => void;
}

export default function ProjectEvidencePack({
  studentProjectId,
  projectTitle,
  githubUrl = '',
  deploymentUrl = '',
  deploymentVerified = false,
  onRefreshData
}: EvidencePackProps) {
  const [loading, setLoading] = useState(true);
  const [evidenceData, setEvidenceData] = useState<any>(null);
  const [analyzingReadme, setAnalyzingReadme] = useState(false);
  const [readmeResult, setReadmeResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidencePack = async () => {
    if (!studentProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const res: any = await apiClient(`/api/student/projects/${studentProjectId}/evidence-pack`);
      if (res?.data) {
        setEvidenceData(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch evidence pack.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidencePack();
  }, [studentProjectId]);

  const handleVerifyReadme = async () => {
    if (!studentProjectId) return;
    setAnalyzingReadme(true);
    try {
      const res: any = await apiClient(`/api/student/projects/${studentProjectId}/readme/verify`, {
        method: 'POST',
        body: JSON.stringify({ github_url: githubUrl })
      });
      if (res?.data) {
        setReadmeResult(res.data);
        fetchEvidencePack();
        if (onRefreshData) onRefreshData();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze repository README.');
    } finally {
      setAnalyzingReadme(false);
    }
  };

  if (loading && !evidenceData) {
    return (
      <div className="p-12 rounded-3xl bg-neutral-900 border border-white/10 flex flex-col items-center justify-center gap-3 text-white/50">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF7A00]" />
        <span className="text-xs font-mono">Synthesizing project evidence pack...</span>
      </div>
    );
  }

  const strength = evidenceData?.evidence_strength || 0;
  const badge = evidenceData?.badge || 'UNVERIFIED';
  const breakdown = evidenceData?.breakdown || [];
  const gate = evidenceData?.readiness_gate || {};
  const blockers = gate?.blockers || [];
  const gates = gate?.gates || {};
  const readmeMeta = evidenceData?.readme_meta || {};

  const badgeColorMap: Record<string, string> = {
    STRONG_EVIDENCE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    VERIFIED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    PARTIALLY_VERIFIED: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    SELF_REPORTED: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    UNVERIFIED: 'bg-white/10 text-white/50 border-white/10'
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Evidence Strength Cockpit */}
      <div className="bg-gradient-to-br from-purple-950/40 via-neutral-900 to-black border border-purple-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider flex items-center gap-1">
                <PackageCheck className="w-3 h-3" /> Verifiable Placement Asset
              </span>
              <span className="text-xs text-white/40">• 7-Factor Weighted Evidence Model</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Project Evidence Pack &amp; Quality Audit
            </h2>
            <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
              Transparent, tamper-proof engineering evidence collected across code commits, automated QA, server-side deployment probes, and technical AI defense.
            </p>
          </div>

          {/* Evidence Strength Gauge */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center sm:text-right shrink-0 min-w-[210px] space-y-2">
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-semibold text-white/60">
              <span>Evidence Strength</span>
              <span className="text-purple-400 font-extrabold text-sm">{strength}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${strength}%` }}
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                  badgeColorMap[badge] || badgeColorMap.UNVERIFIED
                }`}
              >
                {badge.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: 7-Factor Evidence Dimensions */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">1. Evidence Dimension Breakdown</h3>
              <p className="text-xs text-white/50">Detailed score weighting and verification explanations.</p>
            </div>
          </div>

          <button
            onClick={fetchEvidencePack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Refresh evidence scores"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {breakdown.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{item.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 text-white/40">
                    {item.weight_pct}% weight
                  </span>
                </div>
                <span
                  className={`text-xs font-mono font-bold ${
                    item.score >= 80 ? 'text-emerald-400' : item.score >= 50 ? 'text-amber-400' : 'text-white/40'
                  }`}
                >
                  {item.score}/100
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.score >= 80 ? 'bg-emerald-400' : item.score >= 50 ? 'bg-amber-400' : 'bg-white/20'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>

              <p className="text-[11px] text-white/50 leading-relaxed">{item.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: README Quality & Architecture Documentation */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">2. Repository README Quality Audit</h3>
              <p className="text-xs text-white/50">
                Verifies architectural overview, setup guides, usage examples, and testing docs.
              </p>
            </div>
          </div>

          <button
            onClick={handleVerifyReadme}
            disabled={analyzingReadme || !githubUrl}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            {analyzingReadme ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing README...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Audit README Quality</span>
              </>
            )}
          </button>
        </div>

        {readmeMeta?.sections ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">README Score</span>
                <span className="text-[11px] text-white/50">
                  {readmeMeta.char_count || 0} characters analyzed from GitHub root.
                </span>
              </div>
              <span className="text-lg font-extrabold text-blue-400 font-mono">
                {readmeMeta.score || 0}/100
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(readmeMeta.sections || {}).map(([sec, present]: any) => (
                <div
                  key={sec}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs capitalize ${
                    present
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/5 border-rose-500/20 text-rose-300/60'
                  }`}
                >
                  {present ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span>{sec}</span>
                </div>
              ))}
            </div>

            {readmeMeta.missing && readmeMeta.missing.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                <strong>Recommended Missing Sections:</strong>
                <p className="text-[11px] text-white/60">
                  Consider adding: {readmeMeta.missing.join(', ')} to increase documentation score.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-xs text-white/50 flex items-center justify-between">
            <span>Click &ldquo;Audit README Quality&rdquo; to scan your public GitHub repository.</span>
            {!githubUrl && <span className="text-amber-400 text-[11px] font-medium">GitHub URL required</span>}
          </div>
        )}
      </div>

      {/* SECTION 3: Placement Readiness Gate */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3. Placement Readiness Gate</h3>
            <p className="text-xs text-white/50">Objective readiness checklist required for recruiter showcase.</p>
          </div>
        </div>

        {/* Gates Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs ${
              gates.tasks_complete ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/40 border-white/10'
            }`}
          >
            {gates.tasks_complete ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-white/30" />}
            <span className="text-white">All Milestone Tasks Complete</span>
          </div>

          <div
            className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs ${
              gates.repository_verified ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/40 border-white/10'
            }`}
          >
            {gates.repository_verified ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-white/30" />}
            <span className="text-white">GitHub Repository Verified</span>
          </div>

          <div
            className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs ${
              gates.execution_proof ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/40 border-white/10'
            }`}
          >
            {gates.execution_proof ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-white/30" />}
            <span className="text-white">Deployment / Execution Proof Verified</span>
          </div>

          <div
            className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs ${
              gates.technical_defense ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/40 border-white/10'
            }`}
          >
            {gates.technical_defense ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-white/30" />}
            <span className="text-white">AI Technical Defense Passed</span>
          </div>
        </div>

        {/* Actionable Blockers */}
        {blockers.length > 0 ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <span className="text-xs font-bold text-amber-300 block">
              Remaining Action Items for Placement Readiness:
            </span>
            <ul className="space-y-1.5 text-xs text-amber-200/90 pl-2">
              {blockers.map((b: string, bIdx: number) => (
                <li key={bIdx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 leading-none font-bold">→</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Project is 100% Placement Ready! Fully eligible for recruiter showcase and placement matching.</span>
          </div>
        )}
      </div>
    </div>
  );
}
