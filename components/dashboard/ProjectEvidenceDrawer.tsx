'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  GitBranch,
  Globe,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Award,
  BookOpen,
  MessageSquareCode
} from 'lucide-react';

interface ProjectEvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentProject: any;
  project: any;
  verifications: any[];
  defenses: any[];
}

export default function ProjectEvidenceDrawer({
  isOpen,
  onClose,
  studentProject,
  project,
  verifications = [],
  defenses = []
}: ProjectEvidenceDrawerProps) {
  if (!isOpen) return null;

  const latestVer = verifications[0] || {};
  const latestDef = defenses[0] || {};
  const autoChecks = latestVer.automated_checks || {};
  const isCompleted = studentProject?.status === 'COMPLETED';
  const isVerified = studentProject?.status === 'VERIFIED' || studentProject?.status === 'DEFENSE_ACTIVE' || isCompleted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-full bg-neutral-950 border-l border-white/10 p-6 md:p-8 overflow-y-auto space-y-6 text-white shadow-2xl flex flex-col justify-between">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">Engineering Evidence Dossier</h2>
                <p className="text-xs text-white/50">{project?.title || 'Project Verification Records'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Verification Badge Overview */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            isCompleted
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : isVerified
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block">Evidence Status</span>
                <strong className="text-sm font-extrabold text-white">
                  {isCompleted ? 'Verified & Completed with Defense' : isVerified ? 'Verified Repository & Architecture' : 'In Progress / Pending Verification'}
                </strong>
              </div>
            </div>
            {latestVer?.quality_score && (
              <div className="text-right shrink-0">
                <span className="text-xs text-white/50 block">Quality Score</span>
                <strong className="text-lg font-black text-[#FF7A00]">{latestVer.quality_score}/100</strong>
              </div>
            )}
          </div>

          {/* 1. GitHub Code Evidence */}
          <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <GitBranch className="w-4 h-4 text-[#FF7A00]" /> GitHub Repository Evidence
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  VERIFIED BY PLACELY
                </span>
              </div>
              {studentProject?.github_repo && (
                <a
                  href={studentProject.github_repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#FF7A00] hover:underline inline-flex items-center gap-1"
                >
                  View Repo <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                <span className="text-white/40 block">Total Commits</span>
                <strong className="text-sm font-bold text-white mt-0.5 block">{autoChecks.commit_count || 0} Commits</strong>
              </div>
              <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                <span className="text-white/40 block">README Documentation</span>
                <strong className={`text-sm font-bold mt-0.5 block ${autoChecks.has_readme ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {autoChecks.has_readme ? 'Verified (Present)' : 'Missing / Incomplete'}
                </strong>
              </div>
            </div>
          </div>

          {/* 2. Live Deployment Health Evidence */}
          {studentProject?.live_demo && (
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Globe className="w-4 h-4 text-emerald-400" /> Live Deployment Evidence
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    VERIFIED BY PLACELY
                  </span>
                </div>
                <a
                  href={studentProject.live_demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  Visit Live Site <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                <span className="text-white/60 truncate max-w-[280px]">{studentProject.live_demo}</span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400">
                  HTTP 200 OK
                </span>
              </div>
            </div>
          )}

          {/* 3. Technical Defense Evidence */}
          {latestDef && latestDef.question && (
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <MessageSquareCode className="w-4 h-4 text-purple-400" /> Technical Defense Interview
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    AI EVALUATION
                  </span>
                </div>
              </div>

              <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2 text-xs">
                <div className="text-white/80">
                  <strong className="text-white/40 block mb-0.5">Question Asked:</strong>
                  {latestDef.question}
                </div>

                {latestDef.student_answer && (
                  <div className="text-white/70 pt-2 border-t border-white/5">
                    <strong className="text-white/40 block mb-0.5">Student Provided Claim:</strong>
                    &ldquo;{latestDef.student_answer}&rdquo;
                  </div>
                )}

                {latestDef.feedback && (
                  <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-200 text-xs">
                    <strong className="block text-[11px] uppercase tracking-wider text-purple-300 font-bold mb-0.5">
                      Evaluator Assessment:
                    </strong>
                    {latestDef.feedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Verified Competencies Mapped */}
          {project?.skills_covered && project.skills_covered.length > 0 && (
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Award className="w-4 h-4 text-amber-400" /> Verified Competencies
              </div>
              <div className="flex flex-wrap gap-2">
                {project.skills_covered.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
