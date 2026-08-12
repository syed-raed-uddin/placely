export interface UserInfo {
  name: string;
  avatar: string;
  initials: string;
}

export interface CareerReadinessInfo {
  score: number;
  nextMilestone: string;
}

export interface TaskItem {
  id: string;
  title: string;
  estimatedTime: string;
  xpReward: number;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  subProgress?: number;
}

export interface RoadmapInfo {
  name: string;
  currentModule: string;
  modulesCompleted: number;
  totalModules: number;
  estimatedCompletion: string;
}

export interface ProjectInfo {
  name: string;
  progress: number;
  currentMilestone: string;
  remainingTasks: number;
  estimatedCompletion: string;
}

export interface AIMentorInfo {
  name: string;
  lastMessage: string;
  suggestedQuestions: string[];
}

export interface CareerMetric {
  name: string;
  icon: string;
  percentage: number;
  suggestion: string;
  status: 'On Track' | 'Needs Work' | 'Excellent';
}

export interface JourneyStage {
  id: string;
  stage: string;
  icon: string;
  status: 'Completed' | 'Current' | 'Locked';
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface PlacementTrackerInfo {
  applicationsSent: number;
  repliesReceived: number;
  interviewsScheduled: number;
  offers: number;
  responseRate: number;
  daysSinceLastApplication: number;
  aiRecommendation: string;
}

export interface StreakInfo {
  current: number;
  longest: number;
  weeklyActivity: boolean[];
  motivationalMessages: {
    zero: string;
    week1: string;
    week2: string;
    month1: string;
  };
}

export interface XPInfo {
  current: number;
  total: number;
  level: number;
  nextLevelXP: number;
}

export interface NotificationInfo {
  unreadCount: number;
}

export interface DashboardData {
  user: UserInfo;
  careerReadiness: CareerReadinessInfo;
  todayTasks: TaskItem[];
  currentRoadmap: RoadmapInfo;
  currentProject: ProjectInfo;
  aiMentor: AIMentorInfo;
  careerBreakdown: CareerMetric[];
  placementJourney: JourneyStage[];
  quickActions: QuickAction[];
  placementTracker: PlacementTrackerInfo;
  streak: StreakInfo;
  xp: XPInfo;
  notifications: NotificationInfo;
  isPro?: boolean;
}

export const dashboardData: DashboardData = {
  user: { name: "Syed Raed", avatar: "/avatar.png", initials: "SR" },
  isPro: false,
  careerReadiness: { score: 78, nextMilestone: "Mock Interview Round 2" },
  todayTasks: [
    { id: "task-1", title: "Solve 3 Hard Graph DP Problems on LeetCode", estimatedTime: "45 mins", xpReward: 150, priority: "High", completed: false, subProgress: 66 },
    { id: "task-2", title: "Design Distributed Caching Strategy for System Design", estimatedTime: "60 mins", xpReward: 200, priority: "High", completed: false, subProgress: 30 },
    { id: "task-3", title: "Review & Refactor ATS Parsing Algorithm in AI Resume Parser", estimatedTime: "30 mins", xpReward: 100, priority: "Medium", completed: true, subProgress: 100 },
    { id: "task-4", title: "Practice STAR Method for Amazon Behavioral Mock Interview", estimatedTime: "25 mins", xpReward: 80, priority: "Low", completed: false },
  ],
  currentRoadmap: { name: "Full Stack SDE Track", currentModule: "System Design & Distributed Caching", modulesCompleted: 14, totalModules: 20, estimatedCompletion: "Aug 15, 2026" },
  currentProject: { name: "AI Resume Parser & Scorer", progress: 65, currentMilestone: "ATS Parsing Algorithm", remainingTasks: 3, estimatedCompletion: "Aug 5, 2026" },
  aiMentor: {
    name: "Kiro - AI Mentor",
    lastMessage: "Your DSA consistency is up 40%! Focus on Dynamic Programming graphs today.",
    suggestedQuestions: ["How to optimize Graph Dijkstra?", "Review my System Design schema", "Mock behavioral question"],
  },
  careerBreakdown: [
    { name: "Data Structures & Algo", icon: "Code", percentage: 85, suggestion: "Practice Graph DP problems", status: "On Track" },
    { name: "System Design", icon: "Server", percentage: 60, suggestion: "Focus on caching strategies", status: "Needs Work" },
    { name: "Projects & Portfolio", icon: "FolderGit2", percentage: 90, suggestion: "Deploy live demo for parser", status: "Excellent" },
    { name: "Behavioral & HR", icon: "Users", percentage: 75, suggestion: "Prepare STAR method stories", status: "On Track" },
  ],
  placementJourney: [
    { id: "stage-1", stage: "Profile Building", icon: "UserCheck", status: "Completed" },
    { id: "stage-2", stage: "Resume Verification", icon: "FileCheck", status: "Completed" },
    { id: "stage-3", stage: "Skill Assessment", icon: "Award", status: "Completed" },
    { id: "stage-4", stage: "Mock Interviews", icon: "MessageSquare", status: "Current" },
    { id: "stage-5", stage: "Company Applications", icon: "Send", status: "Locked" },
    { id: "stage-6", stage: "HR Round", icon: "Briefcase", status: "Locked" },
    { id: "stage-7", stage: "Offer Letter", icon: "FileText", status: "Locked" },
  ],
  quickActions: [
    { id: "action-1", label: "Resume Builder", icon: "FileText", color: "from-blue-500 to-indigo-600" },
    { id: "action-2", label: "Mock Interview", icon: "Video", color: "from-orange-500 to-amber-600" },
    { id: "action-3", label: "DSA Practice", icon: "Code2", color: "from-emerald-500 to-teal-600" },
    { id: "action-4", label: "Cold Email AI", icon: "Mail", color: "from-purple-500 to-pink-600" },
    { id: "action-5", label: "Salary Benchmark", icon: "TrendingUp", color: "from-cyan-500 to-blue-600" },
    { id: "action-6", label: "Referral Finder", icon: "UserPlus", color: "from-amber-500 to-orange-600" },
    { id: "action-7", label: "Portfolio Generator", icon: "Layout", color: "from-rose-500 to-red-600" },
  ],
  placementTracker: {
    applicationsSent: 34,
    repliesReceived: 12,
    interviewsScheduled: 5,
    offers: 2,
    responseRate: 35,
    daysSinceLastApplication: 2,
    aiRecommendation: "High response rate! Send 3 more applications to top tier product companies this week.",
  },
  streak: {
    current: 14,
    longest: 21,
    weeklyActivity: [true, true, true, true, true, true, false],
    motivationalMessages: {
      zero: "🚀 Start your daily streak today! Consistency is the key to placement success.",
      week1: "⚡ Great momentum! Keep solving daily to push towards your 14-day streak.",
      week2: "🔥 Unstoppable consistency! You're in the top 5% of placement candidates.",
      month1: "👑 Legendary streak! You're fully interview-ready and unstoppable.",
    },
  },
  xp: { current: 3450, total: 5000, level: 12, nextLevelXP: 4000 },
  notifications: { unreadCount: 3 },
};
