'use client';

import React, { useState, useTransition } from 'react';
import { FolderGit2, Clock, Zap, GitBranch, ExternalLink, Lock, CheckCircle, Shield, ArrowRight } from 'lucide-react';
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
            <Link
              href={`/dashboard/projects/${project.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold text-sm transition-all shadow-lg shadow-[#FF7A00]/25"
            >
              <GitBranch className="w-4 h-4" />
              {studentProject ? 'Continue Execution' : 'Open Workspace'}
              <ArrowRight className="w-4 h-4" />
            </Link>

            {studentProject && studentProject.status === 'VERIFIED' && (
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-500/90 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/25"
              >
                <Shield className="w-4 h-4" />
                Start Project Defense
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-white text-base leading-snug">{project.title}</h3>
          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold border capitalize ${difficultyColor(project.difficulty)}`}>
            {project.difficulty || 'Intermediate'}
          </span>
        </div>
        {project.description && (
          <p className="text-white/50 text-xs line-clamp-2 leading-relaxed">{project.description}</p>
        )}
      </div>

      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> ~{project.estimated_hours || 6}h
          </span>
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" /> +150 XP/milestone
          </span>
        </div>

        <Link
          href={`/dashboard/projects/${project.id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all"
        >
          <span>{studentProject ? 'View Progress' : 'Start Project'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
