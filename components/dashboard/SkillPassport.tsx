'use client';

import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, FolderGit2, Share2, Sparkles, ExternalLink, Copy, Check } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface SkillPassportProps {
  studentId: string;
}

export function SkillPassport({ studentId }: SkillPassportProps) {
  const [portfolio, setPortfolio] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchPortfolio();
    }
  }, [studentId]);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const data: any = await apiClient(`/portfolio/${studentId}`);
      setPortfolio(data);
    } catch (_) {
      // Fallback state if no portfolio yet
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/portfolio/${studentId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const projects = portfolio?.projects || [];
  const badges = portfolio?.badges || [];
  const completedSkills = portfolio?.completed_skills || [];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF7A00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF7A00]">
              Verified Credentials
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-white">Skill Passport</h3>
          <p className="text-xs text-white/50">
            Consolidated record of your verified competencies, completed projects, and earned badges.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7A00] hover:bg-[#E66A00] text-white font-bold text-xs shadow-lg shadow-[#FF7A00]/20 transition-all shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share Public Profile</span>
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-white/40 animate-pulse">
          Loading Skill Passport details...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Verified Skills */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Completed Tracks ({completedSkills.length})
            </h4>
            <div className="space-y-2">
              {completedSkills.length > 0 ? (
                completedSkills.map((skill: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 flex items-center justify-between"
                  >
                    <span>{skill}</span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-400">
                      Verified
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/30 italic">Track completion in progress.</p>
              )}
            </div>
          </div>

          {/* Portfolio Projects */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-blue-400" />
              Submitted Projects ({projects.length})
            </h4>
            <div className="space-y-2">
              {projects.length > 0 ? (
                projects.map((proj: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span className="truncate">{proj.title || 'Project'}</span>
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-white/40 capitalize">
                      {proj.difficulty || 'Intermediate'} difficulty
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/30 italic">No projects submitted yet.</p>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Earned Badges ({badges.length})
            </h4>
            <div className="space-y-2">
              {badges.length > 0 ? (
                badges.map((badge: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 flex items-center gap-2"
                  >
                    <span>{badge.emoji || '🏆'}</span>
                    <span>{badge.name || 'Achievement Badge'}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/30 italic">Keep solving tasks to earn badges.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
