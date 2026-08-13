import { dashboardData as fallbackData, DashboardData, TaskItem } from '@/lib/mockData';

// XP per completed task
const XP_PER_TASK = 100;

// Placement journey stages — driven by % of course completed
// 0-14% → Stage 1 current (just started), 15-29% → Stage 2, etc.
const PLACEMENT_STAGES = [
  { id: 'stage-1', stage: 'Profile Building', icon: 'UserCheck' },
  { id: 'stage-2', stage: 'Skill Building', icon: 'Award' },
  { id: 'stage-3', stage: 'Project Work', icon: 'FileCheck' },
  { id: 'stage-4', stage: 'Mock Interviews', icon: 'MessageSquare' },
  { id: 'stage-5', stage: 'Applications', icon: 'Send' },
  { id: 'stage-6', stage: 'HR Round', icon: 'Briefcase' },
  { id: 'stage-7', stage: 'Offer Letter', icon: 'FileText' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapBackendToDashboard(backendData: any): DashboardData {
  const merged = JSON.parse(JSON.stringify(fallbackData)) as DashboardData;
  if (!backendData) return merged;

  try {
    // ── 0. Plan & Entitlement ─────────────────────────────────────────────
    const plan = backendData.user_plan || (backendData.is_pro ? 'pro' : 'basic');
    merged.userPlan = plan;
    merged.isPro = backendData.is_pro || plan === 'pro' || plan === 'advanced';

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
    merged.streak.longest = streakValue; // No separate longest in backend — use current

    // Derive weekly activity from streak count
    // If streak is N, last N days were active (fill backwards from today = Sunday index 6)
    const today = new Date().getDay(); // 0=Sun, 1=Mon, ... 6=Sat
    const weeklyActivity = [false, false, false, false, false, false, false];
    for (let i = 0; i < Math.min(streakValue, 7); i++) {
      // Fill backwards from today's position in Mon-Sun (Mon=0)
      const mondayBased = ((today - 1) - i + 7) % 7;
      weeklyActivity[mondayBased] = true;
    }
    merged.streak.weeklyActivity = weeklyActivity;

    // ── 3. Phases & task completion ──────────────────────────────────────
    if (backendData.skill) {
      merged.currentRoadmap.name = backendData.skill.name || 'Your Track';
    }

    const currentDay: number = backendData.enrollment?.current_day || 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const phases: any[] = backendData.phases || [];

    let currentModuleTitle = 'Getting Started';
    let doneTasks = 0;
    let totalTasks = 0;
    const todayTasksList: TaskItem[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    phases.forEach((phase: any) => {
      let hasCurrentDayTask = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (phase.tasks || []).forEach((task: any) => {
        totalTasks++;
        const isDone =
          task.progress?.status === 'done' ||
          task.progress?.status === 'completed';
        if (isDone) doneTasks++;
        if (task.day_number === currentDay) {
          hasCurrentDayTask = true;
          todayTasksList.push({
            id: String(task.id),
            title: task.title,
            estimatedTime: '45 mins',
            xpReward: XP_PER_TASK,
            priority: 'High',
            completed: isDone,
            subProgress: isDone ? 100 : 0,
          });
        }
      });
      if (hasCurrentDayTask) currentModuleTitle = phase.title;
    });

    merged.currentRoadmap.currentModule = currentModuleTitle;
    merged.currentRoadmap.modulesCompleted = Math.max(0, currentDay - 1);
    merged.currentRoadmap.totalModules = backendData.skill?.total_days || 0;

    const progressPercent =
      totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    merged.careerReadiness.score = progressPercent;

    if (todayTasksList.length > 0) {
      merged.todayTasks = todayTasksList;
    }

    // ── 4. XP — calculated from completed tasks ───────────────────────────
    const earnedXP = doneTasks * XP_PER_TASK;
    const totalDays = backendData.skill?.total_days || 60;

    // Level = every 10 completed tasks = 1 level, minimum level 1
    const level = Math.max(1, Math.floor(doneTasks / 10) + 1);
    // XP needed for next level
    const currentLevelBase = (level - 1) * 10 * XP_PER_TASK;
    const nextLevelXP = level * 10 * XP_PER_TASK;

    merged.xp = {
      current: earnedXP,
      total: earnedXP,
      level,
      nextLevelXP,
    };

    // ── 5. Next milestone ─────────────────────────────────────────────────
    if (backendData.next_milestone?.title) {
      merged.careerReadiness.nextMilestone = backendData.next_milestone.title;
    } else {
      merged.careerReadiness.nextMilestone = `Day ${currentDay + 1} Task`;
    }

    // ── 6. Notifications: unread badge count ──────────────────────────────
    const earnedBadges = backendData.badges || [];
    merged.notifications.unreadCount = earnedBadges.length;

    // ── 7. Career breakdown — real phase completion percentages ───────────
    if (phases.length > 0) {
      merged.careerBreakdown = phases.map((phase) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const phaseTasks: any[] = phase.tasks || [];
        const phaseDone = phaseTasks.filter(
          (t) =>
            t.progress?.status === 'done' || t.progress?.status === 'completed'
        ).length;
        const pct =
          phaseTasks.length > 0
            ? Math.round((phaseDone / phaseTasks.length) * 100)
            : 0;
        return {
          name: phase.title,
          icon: 'BookOpen',
          percentage: pct,
          suggestion:
            pct === 0
              ? 'Focus on this phase'
              : pct < 50
              ? 'Keep going!'
              : pct < 100
              ? 'Almost done!'
              : 'Phase complete! 🎉',
          status: (pct >= 80 ? 'Excellent' : pct >= 50 ? 'On Track' : 'Needs Work') as
            | 'On Track'
            | 'Needs Work'
            | 'Excellent',
        };
      });
    } else {
      merged.careerBreakdown = [];
    }

    // ── 8. Placement Journey — driven by real course progress % ──────────
    // Map course completion % to which stage the student is at
    // 0%=Stage1, 14%=Stage2, 28%=Stage3, 43%=Stage4, 57%=Stage5, 71%=Stage6, 85%=Stage7
    const stageThresholds = [0, 14, 28, 43, 57, 71, 85];
    const currentStageIdx = stageThresholds.reduce((acc, threshold, idx) => {
      return progressPercent >= threshold ? idx : acc;
    }, 0);

    merged.placementJourney = PLACEMENT_STAGES.map((stage, idx) => ({
      ...stage,
      status:
        idx < currentStageIdx
          ? 'Completed'
          : idx === currentStageIdx
          ? 'Current'
          : 'Locked',
    }));

    // ── 9. Projects from recommended_projects ────────────────────────────
    const recommendedProjects = backendData.recommended_projects || [];
    if (recommendedProjects.length > 0) {
      const p = recommendedProjects[0];
      merged.currentProject = {
        name: p.title,
        progress: 0,
        currentMilestone: p.description?.substring(0, 60) || 'Get started',
        remainingTasks: p.estimated_hours || 10,
        estimatedCompletion: 'Based on your pace',
      };
    } else {
      merged.currentProject = null as unknown as typeof merged.currentProject;
    }

    // ── 10. AI Mentor ─────────────────────────────────────────────────────
    merged.aiMentor.suggestedQuestions = [
      "What should I focus on today?",
      "Explain my current task simply",
      "Give me a practice problem",
      "How am I progressing overall?",
      "What are my weak areas?",
    ];
    merged.aiMentor.lastMessage =
      `You're on Day ${currentDay}. ${
        streakValue > 0
          ? `🔥 ${streakValue}-day streak — keep it up!`
          : 'Start your streak today!'
      }`;

    // ── 11. Placement Tracker — reset to real zeros (no backend data yet) ─
    merged.placementTracker = {
      applicationsSent: 0,
      repliesReceived: 0,
      interviewsScheduled: 0,
      offers: 0,
      responseRate: 0,
      daysSinceLastApplication: 0,
      aiRecommendation:
        'Focus on completing your roadmap first before applying to companies.',
    };

    // Suppress xp calculation variable warning
    void currentLevelBase;

  } catch (err) {
    console.error('Error mapping backend data:', err);
  }

  return merged;
}
