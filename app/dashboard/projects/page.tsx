import { cookies } from 'next/headers';
import { fetchDashboardData } from '@/lib/api';
import {
  FolderGit2,
  Clock,
  Zap,
  GitBranch,
  ExternalLink,
  Lock,
  Sparkles,
  Trophy,
} from 'lucide-react';

function difficultyColor(difficulty: string) {
  const d = (difficulty || '').toLowerCase();
  if (d === 'easy' || d === 'beginner') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (d === 'medium' || d === 'intermediate') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  return 'text-red-400 bg-red-500/10 border-red-500/20';
}

export default async function ProjectsPage() {
  const cookieStore = cookies();
  const studentId = cookieStore.get('placely_student_id')?.value;
  const token = cookieStore.get('placely_token')?.value;

  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backendData: any = await fetchDashboardData(studentId!, token, cookieHeader);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects: any[] = backendData?.recommended_projects || [];
  const skill = backendData?.skill || {};
  const enrollment = backendData?.enrollment || {};

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8 pb-16 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Build &amp; Ship</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Projects</h1>
        <p className="text-white/50 text-sm">
          Real-world projects for the <span className="text-white font-semibold">{skill.name || 'your'}</span> track
        </p>
      </div>

      {projects.length === 0 ? (
        /* No projects state */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
            <FolderGit2 className="w-10 h-10 text-white/20" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">No Projects Yet</h3>
            <p className="text-white/40 text-sm mt-2 max-w-xs">
              Projects for the <span className="text-white">{skill.name || 'your'}</span> track will appear here once they&apos;re set up. Keep completing your daily tasks!
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
            Day <strong className="text-white mx-1">{enrollment.current_day || 1}</strong> of{' '}
            <strong className="text-white mx-1">{skill.total_days || '—'}</strong> — Keep going!
          </div>
        </div>
      ) : (
        <>
          {/* Hero Project (first one) */}
          <div className="relative bg-gradient-to-br from-[#FF7A00]/10 via-white/5 to-transparent border border-[#FF7A00]/30 rounded-3xl p-6 md:p-8 overflow-hidden">
            {/* Background glow */}
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
                    {projects[0].title}
                  </h2>
                </div>
                <div className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${difficultyColor(projects[0].difficulty)}`}>
                  {projects[0].difficulty || 'Intermediate'}
                </div>
              </div>

              {projects[0].description && (
                <p className="text-white/70 text-sm leading-relaxed">
                  {projects[0].description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-white/50">
                {projects[0].estimated_hours && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    ~{projects[0].estimated_hours}h to build
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#FF7A00]" />
                  Portfolio-ready
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {projects[0].github_starter_url ? (
                  <a
                    href={projects[0].github_starter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold text-sm transition-all shadow-lg shadow-[#FF7A00]/25 hover:scale-[1.02] active:scale-[0.99]"
                  >
                    <GitBranch className="w-4 h-4" />
                    Start Project
                  </a>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold text-sm transition-all shadow-lg shadow-[#FF7A00]/25"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Start Project
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Other Projects */}
          {projects.length > 1 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">More Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(1).map((project: any, idx: number) => (
                  <div
                    key={project.id || idx}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/20 transition-all group"
                  >
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievement Banner */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Complete a project to unlock portfolio mode</p>
              <p className="text-xs text-white/40 mt-0.5">Submit your GitHub link once done — Kiro will review your code automatically.</p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
