'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Video,
  Code2,
  Mail,
  TrendingUp,
  UserPlus,
  Layout,
  LucideIcon,
  Zap,
} from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Video,
  Code2,
  Mail,
  TrendingUp,
  UserPlus,
  Layout,
};

export const QuickActions: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { quickActions } = dashboardData;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00]">
          <Zap className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const IconComponent = iconMap[action.icon] || FileText;
          const isComingSoon = action.label !== 'DSA Practice';

          return (
            <motion.div
              key={action.id}
              whileHover={!isComingSoon ? { scale: 1.05 } : {}}
              transition={{ duration: 0.2 }}
              className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 transition-colors relative overflow-hidden ${
                isComingSoon ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:border-[#FF7A00] hover:shadow-[0_0_20px_rgba(255,122,0,0.25)] cursor-pointer group'
              }`}
            >
              {isComingSoon && (
                <div className="absolute inset-0 bg-[#0A0A0A]/40 flex items-center justify-center backdrop-blur-[1px] z-10">
                  <span className="px-2 py-1 rounded-full bg-black/80 border border-white/10 text-[10px] font-bold text-white/90">
                    Coming Soon
                  </span>
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl bg-gradient-to-br ${action.color} shadow-lg text-white ${!isComingSoon && 'group-hover:shadow-[#FF7A00]/30'} transition-all`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <span className={`text-xs font-semibold transition-colors ${!isComingSoon ? 'text-white/90 group-hover:text-white' : 'text-white/50'}`}>
                {action.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
