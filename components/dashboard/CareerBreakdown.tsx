'use client';

import React from 'react';
import { Code, Server, FolderGit2, Users, BookOpen, LucideIcon, Sparkles } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import ProgressBar from '@/components/ui/ProgressBar';

const iconMap: Record<string, LucideIcon> = {
  Code,
  Server,
  FolderGit2,
  Users,
  BookOpen,
};

const getProgressColor = (percentage: number): string => {
  if (percentage < 40) return 'bg-rose-500';
  if (percentage < 70) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const getBadgeStyle = (status: string): string => {
  switch (status) {
    case 'Excellent':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Needs Work':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'On Track':
    default:
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }
};

export const CareerBreakdown: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { careerBreakdown } = dashboardData;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white tracking-tight">Career Breakdown</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {careerBreakdown.map((item) => {
          const IconComponent = iconMap[item.icon] || BookOpen;
          const colorClass = getProgressColor(item.percentage);
          const badgeStyle = getBadgeStyle(item.status);

          return (
            <div
              key={item.name}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00]">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${badgeStyle}`}>
                    {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white/90 line-clamp-1">{item.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <AnimatedNumber
                      value={item.percentage}
                      suffix="%"
                      className="text-2xl font-extrabold text-white tracking-tight"
                    />
                  </div>
                </div>

                <ProgressBar value={item.percentage} colorClass={colorClass} heightClass="h-2" />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-white/50 pt-2 border-t border-white/5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
                <span className="truncate">{item.suggestion}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareerBreakdown;
