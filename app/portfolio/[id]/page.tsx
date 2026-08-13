import React from 'react';
import { API_BASE } from '@/lib/api';
import { Award, FolderGit2, CheckCircle2, ExternalLink, Sparkles, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface PublicPortfolioProps {
  params: {
    id: string;
  };
}

async function getPublicPortfolio(studentId: string) {
  try {
    const res = await fetch(`${API_BASE}/portfolio/${studentId}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (_) {
    return null;
  }
}

export default async function PublicPortfolioPage({ params }: PublicPortfolioProps) {
  const studentId = params.id;
  const portfolio = await getPublicPortfolio(studentId);

  if (!portfolio || portfolio.error) {
    return (
      <main className="min-h-screen bg-[#0A0A0C] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Profile Not Found</h1>
            <p className="text-sm text-white/50">
              We couldn&apos;t find a public Placely portfolio associated with this ID.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#E66A00] text-white font-bold text-sm transition-all"
          >
            Back to Placely
          </Link>
        </div>
      </main>
    );
  }

  const name = portfolio.name || 'Placely Student';
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const completedSkills: string[] = portfolio.completed_skills || [];
  const projects: any[] = portfolio.projects || [];
  const badges: any[] = portfolio.badges || [];

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-white p-4 md:p-12 space-y-10 max-w-5xl mx-auto">
      {/* Branding Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF7A00] flex items-center justify-center text-white font-bold text-base shadow-lg shadow-[#FF7A00]/20">
            P
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">Placely</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Student Portfolio
        </div>
      </div>

      {/* Hero Student Banner */}
      <div className="bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FF7A00] to-amber-400 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-[#FF7A00]/20 shrink-0">
          {initials}
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-white">{name}</h1>
          <p className="text-sm text-white/60">
            Placely Verified Student · Skill Passport &amp; Public Credentials
          </p>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verified Tracks */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Completed Tracks</h3>
          </div>
          <div className="space-y-2">
            {completedSkills.length > 0 ? (
              completedSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 flex items-center justify-between"
                >
                  <span>{skill}</span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-400 font-bold">
                    Verified
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/40 italic">Track completion in progress.</p>
            )}
          </div>
        </div>

        {/* Portfolio Projects */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <FolderGit2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Verified Projects</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.length > 0 ? (
              projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm leading-snug">{proj.title}</h4>
                    {proj.github_url && (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-white/60 line-clamp-2">{proj.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-white/40 pt-1">
                    <span className="capitalize px-2 py-0.5 rounded-md bg-white/5">
                      {proj.difficulty || 'Intermediate'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/40 italic col-span-2">No projects submitted yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Earned Badges</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300"
              >
                <span>{badge.emoji || '🏆'}</span>
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-8 border-t border-white/10 text-xs text-white/40">
        Powered by <span className="text-white font-semibold">Placely</span> · Verified Placement Preparation Platform
      </div>
    </main>
  );
}
