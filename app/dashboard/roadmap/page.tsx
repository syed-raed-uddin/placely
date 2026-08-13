import { cookies } from 'next/headers';
import { fetchDashboardData } from '@/lib/api';
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  Video,
  BookOpen,
  Lightbulb,
  Trophy,
  Calendar,
  Map,
  ChevronDown,
} from 'lucide-react';
import { CodeReviewPanel } from '@/components/dashboard/CodeReviewPanel';
import { MarkCompletedButton } from '@/components/dashboard/MarkCompletedButton';
import { TaskInteractiveBar } from '@/components/dashboard/TaskInteractiveBar';

export default async function RoadmapPage() {
  const cookieStore = cookies();
  const studentId = cookieStore.get('placely_student_id')?.value;
  const token = cookieStore.get('placely_token')?.value;

  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dashResult = await fetchDashboardData(studentId!, token, cookieHeader);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backendData: any = dashResult.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const phases: any[] = backendData?.phases || [];
  const skill = backendData?.skill || { name: 'Learning Track', total_days: 0 };
  const enrollment = backendData?.enrollment || { current_day: 1 };
  const currentDay: number = enrollment.current_day || 1;

  let totalTasks = 0;
  let completedTasks = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  phases.forEach((phase: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (phase.tasks || []).forEach((task: any) => {
      totalTasks++;
      if (task.progress?.status === 'done' || task.progress?.status === 'completed') completedTasks++;
    });
  });
  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8 pb-16 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Your Learning Path</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{skill.name || 'Roadmap'}</h1>
        <p className="text-white/50 text-sm">
          Day {currentDay} of {skill.total_days || '—'} &bull; {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60 font-medium">Overall Progress</span>
          <span className="font-bold text-white">{overallPercent}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-[#FF7A00] to-amber-400 transition-all duration-700"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {completedTasks} completed
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#FF7A00]" />
            Day {currentDay} active
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-white/30" />
            {totalTasks - completedTasks} remaining
          </span>
        </div>
      </div>

      {/* No data state */}
      {phases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Map className="w-8 h-8 text-white/30" />
          </div>
          <div>
            <p className="text-white font-semibold">No roadmap data yet</p>
            <p className="text-white/40 text-sm mt-1">Your learning phases will appear here once your track is set up.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {phases.map((phase: any, phaseIdx: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const phaseTasks: any[] = phase.tasks || [];
            const phaseDone = phaseTasks.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (t: any) => t.progress?.status === 'done' || t.progress?.status === 'completed'
            ).length;
            const phasePercent = phaseTasks.length > 0 ? Math.round((phaseDone / phaseTasks.length) * 100) : 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hasCurrentDay = phaseTasks.some((t: any) => t.day_number === currentDay);

            return (
              <div
                key={phase.id || phaseIdx}
                className={`bg-white/5 border rounded-2xl overflow-hidden transition-colors ${
                  hasCurrentDay ? 'border-[#FF7A00]/40' : 'border-white/10'
                }`}
              >
                {/* Phase Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                      hasCurrentDay
                        ? 'bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40'
                        : phasePercent === 100
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/10 text-white/60 border border-white/10'
                    }`}>
                      {phasePercent === 100 ? '✓' : phaseIdx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{phase.title}</h3>
                      <p className="text-xs text-white/40">{phaseDone} / {phaseTasks.length} tasks done</p>
                    </div>
                    {hasCurrentDay && (
                      <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF7A00] text-[10px] font-bold uppercase tracking-wider">
                        Current Phase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white/60">{phasePercent}%</span>
                    <ChevronDown className="w-4 h-4 text-white/30" />
                  </div>
                </div>

                {/* Phase Progress bar */}
                <div className="w-full bg-white/5 h-1">
                  <div
                    className="h-1 bg-gradient-to-r from-[#FF7A00] to-amber-400 transition-all duration-500"
                    style={{ width: `${phasePercent}%` }}
                  />
                </div>

                {/* Tasks */}
                <div className="divide-y divide-white/5">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {phaseTasks.map((task: any, taskIdx: number) => {
                    const isCompleted = task.progress?.status === 'done' || task.progress?.status === 'completed';
                    const isCurrent = task.day_number === currentDay;
                    const isLocked = false;
                    const resources: any[] = task.resources || [];
                    const videos = resources.filter((r: any) => r.type === 'video' || (r.url && (r.url.includes('youtube') || r.url.includes('youtu.be'))));
                    const hasContent = task.instruction || task.real_world_context || task.optional_challenge || task.stretch_challenge || videos.length > 0;

                    return (
                      <details
                        key={task.id || taskIdx}
                        className={`group ${isCurrent ? 'bg-[#FF7A00]/5' : ''}`}
                        open={isCurrent}
                      >
                        <summary className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer list-none transition-colors ${
                          isLocked ? '' : 'hover:bg-white/[0.02]'
                        }`}>
                          {/* Status Icon */}
                          <div className="shrink-0">
                            {isCompleted ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                            ) : isCurrent ? (
                              <div className="w-6 h-6 rounded-full bg-[#FF7A00]/20 border border-[#FF7A00]/50 flex items-center justify-center">
                                <PlayCircle className="w-3.5 h-3.5 text-[#FF7A00]" />
                              </div>
                            ) : isLocked ? (
                              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Lock className="w-3 h-3 text-white/20" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white/30" />
                              </div>
                            )}
                          </div>

                          {/* Task info */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              isCompleted
                                ? 'text-white/40 line-through'
                                : isCurrent
                                ? 'text-white'
                                : isLocked
                                ? 'text-white/30'
                                : 'text-white/70'
                            }`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-white/30">Day {task.day_number}</span>
                              {videos.length > 0 && (
                                <span className="flex items-center gap-1 text-[10px] text-red-400/70">
                                  <Video className="w-3 h-3" />
                                  {videos.length} video{videos.length > 1 ? 's' : ''}
                                </span>
                              )}
                              {hasContent && !isLocked && (
                                <span className="text-[10px] text-white/30 group-open:hidden">
                                  tap to expand
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF7A00] text-[10px] font-bold">
                                TODAY
                              </span>
                            )}
                            <MarkCompletedButton taskId={task.id} isCompleted={isCompleted} isCurrent={isCurrent} studentId={studentId!} />
                          </div>
                        </summary>

                        {/* Expanded Task Detail */}
                        {!isLocked && hasContent && (
                          <div className="px-5 pb-5 pt-2 space-y-4">
                            {/* Task Instruction */}
                            {task.instruction && (
                              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-semibold text-[#FF7A00] uppercase tracking-wider">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  Task
                                </div>
                                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                                  {task.instruction}
                                </p>
                              </div>
                            )}

                            {/* Real World Context */}
                            {task.real_world_context && (
                              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                  <Lightbulb className="w-3.5 h-3.5" />
                                  Why It Matters
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed">
                                  {task.real_world_context}
                                </p>
                              </div>
                            )}

                            {/* Video Resources */}
                            {videos.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
                                  <Video className="w-3.5 h-3.5" />
                                  Watch First
                                </div>
                                <div className="space-y-2">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {videos.map((video: any, vIdx: number) => (
                                    <a
                                      key={vIdx}
                                      href={video.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 transition-all group/video"
                                    >
                                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                                        <Video className="w-4 h-4 text-red-400" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-sm font-medium text-white group-hover/video:text-red-400 transition-colors truncate">
                                          {video.title || 'Watch Video'}
                                        </p>
                                        <p className="text-xs text-white/40 truncate">{video.url}</p>
                                      </div>
                                      <PlayCircle className="w-4 h-4 text-red-400/60 group-hover/video:text-red-400 shrink-0 ml-auto transition-colors" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Other resources (non-video) */}
                            {resources.filter((r: any) => r.type !== 'video' && !r.url?.includes('youtube') && !r.url?.includes('youtu.be')).length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  Resources
                                </div>
                                {resources
                                  .filter((r: any) => r.type !== 'video' && !r.url?.includes('youtube') && !r.url?.includes('youtu.be'))
                                  .map((res: any, rIdx: number) => (
                                  <a
                                    key={rIdx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 transition-all text-sm text-white/80 hover:text-white"
                                  >
                                    <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                                    {res.title || 'Resource'}
                                  </a>
                                ))}
                              </div>
                            )}

                            {/* Optional Challenge */}
                            {task.optional_challenge && (
                              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                                  <Trophy className="w-3.5 h-3.5" />
                                  Optional Challenge
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed">
                                  {task.optional_challenge}
                                </p>
                              </div>
                            )}

                            {/* Stretch Challenge */}
                            {task.stretch_challenge && (
                              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                                  <Trophy className="w-3.5 h-3.5" />
                                  Stretch Challenge
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed">
                                  {task.stretch_challenge}
                                </p>
                              </div>
                            )}

                            {/* Code Review Panel */}
                            {(isCurrent || isCompleted) && (
                              <div className="space-y-4">
                                <TaskInteractiveBar
                                  taskId={task.id}
                                  taskTitle={task.title}
                                  domain={(skill.slug || skill.name || 'python').toLowerCase()}
                                  isCompleted={isCompleted}
                                />
                                <CodeReviewPanel 
                                  taskId={task.id} 
                                  taskTitle={task.title} 
                                  studentId={studentId!} 
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </details>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
