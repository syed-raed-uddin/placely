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
import TrackProjectCard from '@/components/dashboard/TrackProjectCard';

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
  const dashResult = await fetchDashboardData(studentId!, token, cookieHeader);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backendData: any = dashResult.data;
  const projects: any[] = backendData?.recommended_projects || [];
  const student_projects: any[] = backendData?.student_projects || [];
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
          <TrackProjectCard 
            project={projects[0]} 
            studentProject={student_projects.find((sp: any) => sp.project_id === projects[0].id)} 
            isHero={true} 
          />

          {/* Other Projects */}
          {projects.length > 1 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">More Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(1).map((project: any, idx: number) => (
                  <TrackProjectCard 
                    key={project.id || idx}
                    project={project}
                    studentProject={student_projects.find((sp: any) => sp.project_id === project.id)}
                  />
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
