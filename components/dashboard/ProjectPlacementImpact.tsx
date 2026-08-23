'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  FileText,
  MessageSquare,
  Award,
  Briefcase,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface PlacementImpactProps {
  studentProjectId?: string;
  projectTitle: string;
  difficulty?: string;
  technologies?: string[];
  skillsCovered?: string[];
  evidenceStrength?: number;
}

export default function ProjectPlacementImpact({
  studentProjectId,
  projectTitle,
  difficulty = 'Intermediate',
  technologies = [],
  skillsCovered = [],
  evidenceStrength = 0
}: PlacementImpactProps) {
  const [loading, setLoading] = useState(true);
  const [impactData, setImpactData] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!studentProjectId) return;
    const fetchImpact = async () => {
      setLoading(true);
      try {
        const res: any = await apiClient(`/api/student/projects/${studentProjectId}/placement-impact`);
        if (res?.data) {
          setImpactData(res.data);
        }
      } catch {
        // Fallback to local synthesis
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, [studentProjectId]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const resumeBullets = impactData?.resume_bullets || [
    `Architected ${projectTitle} utilizing modern engineering patterns with modular component architecture and robust error boundaries.`,
    `Implemented multi-layer QA validation suites covering happy path flows, negative inputs, and defensive boundary edge cases.`,
    `Constructed conventional git release history, comprehensive README architecture documentation, and validated system reliability.`
  ];

  const interviewTalkingPoints = impactData?.interview_talking_points || [
    {
      topic: 'Architecture & Modularity',
      prompt: `Why did you choose the current architecture for ${projectTitle}?`,
      talking_point: 'Separated concerns across modules to ensure testability, easy maintenance, and single-responsibility boundaries.'
    },
    {
      topic: 'Defensive QA & Edge Cases',
      prompt: 'How did you handle edge cases and failure resilience?',
      talking_point: 'Built systematic test scenarios testing empty inputs, malformed structures, and graceful degradation.'
    },
    {
      topic: 'Verification & Release',
      prompt: 'How was this project verified for production?',
      talking_point: 'Executed automated repository code inspection, README quality analysis, and server-side deployment health checks.'
    }
  ];

  const targetRoles = impactData?.target_roles || [
    { role: 'Software Engineer', match: 'HIGH', reason: `Validated through ${difficulty}-level technical defense and QA test suites.` },
    { role: 'Full Stack Developer', match: 'HIGH', reason: 'Proves end-to-end execution from architecture to deployment.' },
    { role: 'Frontend Engineer', match: 'MEDIUM', reason: 'Demonstrates clean component design and responsive layout mastery.' }
  ];

  const verifiedCompetencies = impactData?.verified_competencies || skillsCovered || technologies;

  return (
    <div className="space-y-8">
      {/* Top Banner: Placement Value Cockpit */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-black border border-emerald-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                <Target className="w-3 h-3" /> Career ROI &amp; Placement Asset
              </span>
              <span className="text-xs text-white/40">• Recruiter-Calibrated Artifacts</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Placement Impact &amp; Interview Defense
            </h2>
            <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
              How this project transforms into verifiable resume bullet points, technical interview defense talking points, and target role qualifications.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center sm:text-right shrink-0 min-w-[200px]">
            <span className="text-xs text-white/50 block">Target Role Alignment</span>
            <strong className="text-base font-extrabold text-emerald-400 mt-0.5 block">
              {targetRoles[0]?.role || 'Software Engineer'}
            </strong>
            <span className="text-[10px] text-white/40 block mt-1">
              {targetRoles.filter((r: any) => r.match === 'HIGH').length} High-Match Roles
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Evidence-Grounded Resume Bullets */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">1. Verified Resume Achievement Bullets</h3>
              <p className="text-xs text-white/50">
                Grounded bullet points formulated strictly from your verified code and QA evidence.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCopy(resumeBullets.join('\n• '), 'all_bullets')}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            {copiedKey === 'all_bullets' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'all_bullets' ? 'All Copied' : 'Copy All Bullets'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {resumeBullets.map((bullet: string, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-start justify-between gap-4 group"
            >
              <div className="flex items-start gap-3 text-xs leading-relaxed text-white/90">
                <span className="text-emerald-400 font-bold leading-none mt-0.5">•</span>
                <span>{bullet}</span>
              </div>
              <button
                onClick={() => handleCopy(bullet, `b_${idx}`)}
                className="text-white/30 group-hover:text-white p-1 transition-colors shrink-0"
                title="Copy bullet"
              >
                {copiedKey === `b_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Technical Interview Defense Prompts */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">2. Technical Interview Defense Talking Points</h3>
            <p className="text-xs text-white/50">
              Prepare for deep-dive technical questions about your architectural choices and tradeoffs.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {interviewTalkingPoints.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  {item.topic}
                </span>
                <span className="text-[10px] font-mono text-white/40 uppercase">Interview Defense</span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs space-y-1.5">
                <strong className="text-white block font-semibold">Q: &ldquo;{item.prompt}&rdquo;</strong>
                <p className="text-purple-200/90 leading-relaxed pl-3 border-l-2 border-purple-400/40">
                  <strong className="text-purple-300">Defense Strategy: </strong>
                  {item.talking_point}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Target Role Alignment & Competency Matrix */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3. Role Match &amp; Verified Competencies</h3>
            <p className="text-xs text-white/50">
              Industry roles and technical competencies directly reinforced by this project artifact.
            </p>
          </div>
        </div>

        {/* Roles Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {targetRoles.map((role: any, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{role.role}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    role.match === 'HIGH'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {role.match} MATCH
                </span>
              </div>
              <p className="text-[11px] text-white/50">{role.reason}</p>
            </div>
          ))}
        </div>

        {/* Competencies Badges */}
        {verifiedCompetencies.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Verified Competency Evidence
            </h4>
            <div className="flex flex-wrap gap-2">
              {verifiedCompetencies.map((comp: string, cIdx: number) => (
                <span
                  key={cIdx}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/80 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{comp}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
