import { dashboardData as fallbackData, DashboardData, TaskItem } from '@/lib/mockData';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapBackendToDashboard(backendData: any): DashboardData {
  const merged = JSON.parse(JSON.stringify(fallbackData)) as DashboardData;
  if (!backendData) return merged;

  try {
    // 1. User
    if (backendData.student) {
      merged.user.name = backendData.student.name;
      const initials = backendData.student.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2);
      merged.user.initials = initials;
    }

    // 2. Streak
    if (backendData.streak) {
      merged.streak.current = backendData.streak.current_streak || 0;
      merged.streak.longest = backendData.streak.longest_streak || 0;
    }

    // 3. Roadmap / Progress
    if (backendData.skill) {
      merged.currentRoadmap.name = backendData.skill.name;
      const currentDay = backendData.enrollment?.current_day || 1;
      let currentModuleTitle = 'Module';
      let doneTasks = 0;
      let totalTasks = 0;
      const todayTasksList: TaskItem[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (backendData.phases || []).forEach((phase: any) => {
        let hasCurrentDayTask = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (phase.tasks || []).forEach((task: any) => {
          totalTasks++;
          if (task.progress?.status === 'completed') doneTasks++;
          if (task.day_number === currentDay) {
            hasCurrentDayTask = true;
            todayTasksList.push({
              id: task.id.toString(),
              title: task.title,
              estimatedTime: '45 mins',
              xpReward: 100,
              priority: 'High',
              completed: task.progress?.status === 'completed',
            });
          }
        });
        if (hasCurrentDayTask) currentModuleTitle = phase.title;
      });

      merged.currentRoadmap.currentModule = currentModuleTitle;
      merged.currentRoadmap.modulesCompleted = backendData.enrollment?.current_day - 1 || 0;
      merged.currentRoadmap.totalModules = backendData.skill.total_days || 0;

      const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
      merged.careerReadiness.score = progressPercent;
      merged.todayTasks = todayTasksList;
    }

    // 4. Milestone
    if (backendData.next_milestone) {
      merged.careerReadiness.nextMilestone = backendData.next_milestone.title;
    }

    // 5. Zero out unimplemented features to prevent showing wrong mock data
    merged.currentProject = null as unknown as typeof merged.currentProject;
    merged.careerBreakdown = [];
    merged.aiMentor.suggestedQuestions = [];
    merged.aiMentor.lastMessage =
      'Hello! I am your AI Mentor. Let me know if you need help with your current mission.';
    merged.placementJourney = merged.placementJourney.map((stage, idx) => ({
      ...stage,
      status: idx === 0 ? 'Current' : 'Locked',
    }));
  } catch (err) {
    console.error('Error mapping backend data:', err);
  }

  return merged;
}
