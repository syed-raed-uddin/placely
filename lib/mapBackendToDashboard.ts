import { dashboardData as fallbackData, DashboardData, TaskItem } from '@/lib/mockData';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapBackendToDashboard(backendData: any): DashboardData {
  // Deep clone mock data as the fallback
  const merged = JSON.parse(JSON.stringify(fallbackData)) as DashboardData;
  if (!backendData) return merged;

  try {
    // ── 1. Student name & initials ────────────────────────────────────────
    if (backendData.student) {
      const name: string = backendData.student.name || '';
      merged.user.name = name;
      merged.user.initials = name
        .split(' ')
        .filter(Boolean)
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }

    // ── 2. Streak (backend returns integer, not object) ───────────────────
    const streakValue: number =
      typeof backendData.streak === 'number' ? backendData.streak : 0;
    merged.streak.current = streakValue;
    // longest_streak is not in the backend response — keep mock or set same
    merged.streak.longest = Math.max(merged.streak.longest, streakValue);

    // ── 3. Roadmap / Phases ───────────────────────────────────────────────
    if (backendData.skill) {
      merged.currentRoadmap.name = backendData.skill.name || 'Your Track';
    }

    const currentDay: number = backendData.enrollment?.current_day || 1;
    const phases: any[] = backendData.phases || [];

    let currentModuleTitle = 'Module';
    let doneTasks = 0;
    let totalTasks = 0;
    const todayTasksList: TaskItem[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    phases.forEach((phase: any) => {
      let hasCurrentDayTask = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (phase.tasks || []).forEach((task: any) => {
        totalTasks++;
        if (task.progress?.status === 'done' || task.progress?.status === 'completed') {
          doneTasks++;
        }
        if (task.day_number === currentDay) {
          hasCurrentDayTask = true;
          todayTasksList.push({
            id: String(task.id),
            title: task.title,
            estimatedTime: '45 mins',
            xpReward: 100,
            priority: 'High',
            completed: task.progress?.status === 'done' || task.progress?.status === 'completed',
            subProgress: task.progress?.status === 'done' ? 100 : 0,
          });
        }
      });
      if (hasCurrentDayTask) currentModuleTitle = phase.title;
    });

    merged.currentRoadmap.currentModule = currentModuleTitle;
    merged.currentRoadmap.modulesCompleted = Math.max(0, currentDay - 1);
    merged.currentRoadmap.totalModules = backendData.skill?.total_days || 0;

    const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    merged.careerReadiness.score = progressPercent;

    // Only replace tasks if we have real ones for today
    if (todayTasksList.length > 0) {
      merged.todayTasks = todayTasksList;
    }

    // ── 4. Next milestone ─────────────────────────────────────────────────
    if (backendData.next_milestone?.title) {
      merged.careerReadiness.nextMilestone = backendData.next_milestone.title;
    }

    // ── 5. Notifications: unread badges count ─────────────────────────────
    const earnedBadges: any[] = backendData.badges || [];
    merged.notifications.unreadCount = earnedBadges.length;

    // ── 6. Career breakdown from phases ──────────────────────────────────
    // Build career breakdown from real phase completion data
    if (phases.length > 0) {
      merged.careerBreakdown = phases.map((phase: any) => {
        const phaseTasks: any[] = phase.tasks || [];
        const phaseDone = phaseTasks.filter(
          (t: any) => t.progress?.status === 'done' || t.progress?.status === 'completed'
        ).length;
        const pct = phaseTasks.length > 0 ? Math.round((phaseDone / phaseTasks.length) * 100) : 0;
        return {
          name: phase.title,
          icon: 'BookOpen',
          percentage: pct,
          suggestion: pct < 50 ? 'Focus on this phase' : pct < 100 ? 'Almost there!' : 'Phase complete!',
          status: pct >= 80 ? 'Excellent' : pct >= 50 ? 'On Track' : 'Needs Work',
        };
      });
    } else {
      merged.careerBreakdown = [];
    }

    // ── 7. Placement Journey — keep mock (no backend data for it yet) ─────
    // Keep mock data as-is; placement journey stages aren't tracked in backend yet

    // ── 8. Projects from recommended_projects ────────────────────────────
    const recommendedProjects: any[] = backendData.recommended_projects || [];
    if (recommendedProjects.length > 0) {
      const firstProject = recommendedProjects[0];
      merged.currentProject = {
        name: firstProject.title,
        progress: 0, // Students haven't started yet
        currentMilestone: firstProject.description?.substring(0, 60) + '...' || 'Get started',
        remainingTasks: firstProject.estimated_hours || 10,
        estimatedCompletion: 'Based on your pace',
      };
    } else {
      // No projects for this track yet
      merged.currentProject = null as unknown as typeof merged.currentProject;
    }

    // ── 9. AI Mentor suggested questions ─────────────────────────────────
    // Keep static suggestions — they don't depend on backend
    merged.aiMentor.suggestedQuestions = [
      "What should I focus on today?",
      "Explain my current task",
      "Give me a practice problem",
      "How am I progressing overall?",
      "What are my weak areas?",
    ];

  } catch (err) {
    console.error('Error mapping backend data:', err);
  }

  return merged;
}
