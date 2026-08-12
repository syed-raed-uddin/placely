'use client';

import React, { useState, useTransition } from 'react';
import { FolderGit2, Clock, Zap, GitBranch, ExternalLink, Lock, CheckCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type TrackProjectCardProps = {
  project: any;
  studentProject?: any;
  isHero?: boolean;
};

export default function TrackProjectCard({ project, studentProject, isHero }: TrackProjectCardProps) {
  const router = useRouter();
  const [githubUrl, setGithubUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const difficultyColor = (difficulty: string) => {
    const d = (difficulty || '').toLowerCase();
    if (d === 'easy' || d === 'beginner') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (d === 'medium' || d === 'intermediate') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const handleSubmit = async () => {
    if (!githubUrl) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiClient('/submit-project', {
        method: 'POST',
        body: JSON.stringify({
          project_id: project.id,
          github_url: githubUrl
        })
      });
      startTransition(() => {
        router.refresh();
      });
      setShowSubmit(false);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (isHero) {
    return (
      <div className="relative bg-gradient-to-br from-[#FF7A00]/10 via-white/5 to-transparent border border-[#FF7A00]/30 rounded-3xl p-6 md:p-8 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#FF7A00]">
                  ⭐ Recommended for You
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                {project.title}
              </h2>
            </div>
            <div className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${difficultyColor(project.difficulty)}`}>
              {project.difficulty || 'Intermediate'}
            </div>
          </div>

          {project.description && (
            <p className="text-white/70 text-sm leading-relaxed">
              {project.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-white/50">
            {project.estimated_hours && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                ~{project.estimated_hours}h to build
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FF7A00]" />
              Portfolio-ready
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {!studentProject ? (
              <>
                {project.github_starter_url ? (
                  <a
                    href={project.github_starter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold text-sm transition-all shadow-lg shadow-[#FF7A00]/25"
                  >
                    <GitBranch className="w-4 h-4" />
                    Start Project
                  </a>
                ) : (
                  <button type="button" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold text-sm transition-all shadow-lg shadow-[#FF7A00]/25">
                    <ExternalLink className="w-4 h-4" />
                    Start Project
                  </button>
                )}
                
                <button 
                  onClick={() => setShowSubmit(!showSubmit)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all"
                >
                  <CheckCircle className="w-4 h-4" /> Submit
                </button>
              </>
            ) : (
              <Link
                href={`/dashboard/projects/${studentProject.id}/defense`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-500/90 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/25"
              >
                <Shield className="w-4 h-4" />
                Start Project Defense
              </Link>
            )}
          </div>
          
          {showSubmit && !studentProject && (
            <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/10 flex flex-col gap-3 max-w-sm">
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Submit Project URL</span>
              <input 
                type="text" 
                placeholder="https://github.com/your/repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF7A00]/50"
              />
              {error && <span className="text-red-400 text-xs">{error}</span>}
              <button 
                onClick={handleSubmit}
                disabled={submitting || !githubUrl}
                className="w-full py-2 bg-[#FF7A00] rounded-lg text-white text-sm font-bold disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit URL'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Non-hero styling
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/20 transition-all group">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center shrink-0">
          <FolderGit2 className="w-5 h-5 text-[#FF7A00]" />
        </div>
        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full capitalize ${difficultyColor(project.difficulty)}`}>
          {project.difficulty || 'Intermediate'}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-white text-sm group-hover:text-[#FF7A00] transition-colors">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      {project.estimated_hours && (
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <Clock className="w-3 h-3" />
          ~{project.estimated_hours}h
        </div>
      )}

      {!studentProject ? (
        <div className="flex items-center gap-3 mt-4">
          {project.github_starter_url ? (
            <a
              href={project.github_starter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF7A00] hover:text-amber-400 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              View Starter Code
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-white/30">
              <Lock className="w-3 h-3" />
              Starter code coming soon
            </span>
          )}
          <button 
            onClick={() => setShowSubmit(!showSubmit)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors ml-auto"
          >
            Submit
          </button>
        </div>
      ) : (
        <Link
          href={`/dashboard/projects/${studentProject.id}/defense`}
          className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-semibold text-xs border border-purple-500/20 transition-all"
        >
          <Shield className="w-3.5 h-3.5" />
          Defend Project
        </Link>
      )}

      {showSubmit && !studentProject && (
        <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/10 flex flex-col gap-2">
          <input 
            type="text" 
            placeholder="GitHub Repo URL"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF7A00]/50"
          />
          {error && <span className="text-red-400 text-xs">{error}</span>}
          <button 
            onClick={handleSubmit}
            disabled={submitting || !githubUrl}
            className="w-full py-1.5 bg-[#FF7A00] rounded-lg text-white text-xs font-bold disabled:opacity-50 flex justify-center items-center"
          >
            {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}
