'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Award } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import ProgressBar from '@/components/ui/ProgressBar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMotivationalMessage = (currentStreak: number, motivationalMessages: any): string => {
  if (currentStreak >= 30) {
    return motivationalMessages.month1;
  } else if (currentStreak >= 14) {
    return motivationalMessages.week2;
  } else if (currentStreak >= 7) {
    return motivationalMessages.week1;
  } else {
    return motivationalMessages.zero;
  }
};

export const StreakXPCard: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { streak, xp } = dashboardData;
  const { motivationalMessages } = dashboardData.streak;
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {/* Left Half: Streak & Activity */}
        <div className="space-y-4 pr-0 md:pr-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="p-3 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] shrink-0"
            >
              <Flame className="w-6 h-6 fill-[#FF7A00]" />
            </motion.div>
            <div>
              <div className="flex items-baseline gap-2">
                <AnimatedNumber
                  value={streak.current}
                  className="text-3xl font-extrabold text-white tracking-tight"
                />
                <span className="text-sm font-bold text-[#FF7A00] uppercase tracking-wide">
                  Day Streak
                </span>
              </div>
              <p className="text-xs text-white/50">
                Longest streak: <span className="text-white/80 font-medium">{streak.longest} days</span>
              </p>
            </div>
          </div>

          {/* 7-Day Weekly Activity Bar */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block">
              Weekly Activity
            </span>
            <div className="flex items-center gap-2">
              {weekDays.map((day, idx) => {
                const isActive = streak.weeklyActivity[idx];
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-full h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#FF7A00] text-white shadow-md shadow-[#FF7A00]/30'
                          : 'bg-white/5 text-white/30 border border-white/10'
                      }`}
                    >
                      {isActive ? '✓' : ''}
                    </div>
                    <span className="text-[10px] font-semibold text-white/50">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Half: Level & XP */}
        <div className="space-y-4 pt-6 md:pt-0 pl-0 md:pl-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Level Progress</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] text-xs font-bold">
                LVL {xp.level}
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-baseline gap-1">
                  <AnimatedNumber
                    value={xp.current}
                    className="text-2xl font-extrabold text-white tracking-tight"
                  />
                  <span className="text-xs text-white/50 font-medium">XP</span>
                </div>
                <span className="text-xs text-white/50">
                  Target: <span className="text-white/80 font-medium">{xp.nextLevelXP} XP</span>
                </span>
              </div>

              <ProgressBar
                value={xp.current}
                max={xp.nextLevelXP}
                colorClass="bg-[#FF7A00]"
                heightClass="h-2.5"
              />
            </div>
          </div>

          <div className="pt-2 text-xs text-white/50 flex items-center justify-between border-t border-white/5">
            <span>Total XP Earned</span>
            <span className="font-bold text-white/90">{xp.total.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Bottom Motivational Message */}
      <div className="pt-4 border-t border-white/10 flex items-center gap-2.5 text-xs font-medium text-[#FF7A00] bg-[#FF7A00]/5 p-3 rounded-2xl border border-[#FF7A00]/20">
        <Zap className="w-4 h-4 shrink-0 fill-[#FF7A00]" />
        <span className="leading-snug">{getMotivationalMessage(streak.current, motivationalMessages)}</span>
      </div>
    </div>
  );
};

export default StreakXPCard;
