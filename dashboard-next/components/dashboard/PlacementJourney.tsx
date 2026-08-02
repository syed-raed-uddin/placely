'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  FileCheck,
  Award,
  MessageSquare,
  Send,
  Briefcase,
  FileText,
  LucideIcon,
  Compass,
  Check,
} from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

const iconMap: Record<string, LucideIcon> = {
  UserCheck,
  FileCheck,
  Award,
  MessageSquare,
  Send,
  Briefcase,
  FileText,
};

export const PlacementJourney: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { placementJourney } = dashboardData;

  const currentStageIndex = placementJourney.findIndex(
    (s) => s.status === 'Current'
  );
  const activeIndex = currentStageIndex !== -1 ? currentStageIndex : 0;
  const fillPercentage = (activeIndex / (placementJourney.length - 1)) * 100;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00]">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Placement Journey</h2>
          <p className="text-xs text-white/50">Your step-by-step roadmap to landing an offer</p>
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2 pt-2 pb-2">
        {/* Horizontal Line (Desktop) */}
        <div className="hidden md:block absolute top-6 left-6 right-6 h-1 bg-white/10 rounded-full -z-0" />
        <motion.div
          className="hidden md:block absolute top-6 left-6 h-1 bg-[#FF7A00] rounded-full -z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${fillPercentage}%` }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Vertical Line (Mobile) */}
        <div className="md:hidden absolute left-6 top-6 bottom-6 w-1 bg-white/10 rounded-full -z-0" />
        <motion.div
          className="md:hidden absolute left-6 top-6 w-1 bg-[#FF7A00] rounded-full -z-0"
          initial={{ height: '0%' }}
          animate={{ height: `${fillPercentage}%` }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Stages List */}
        {placementJourney.map((stage, idx) => {
          const IconComponent = iconMap[stage.icon] || UserCheck;
          const isCompleted = stage.status === 'Completed';
          const isCurrent = stage.status === 'Current';
          const isLocked = stage.status === 'Locked';

          return (
            <div
              key={stage.id}
              className={`relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-2 flex-1 w-full md:w-auto ${
                isLocked ? 'grayscale opacity-40' : 'opacity-100'
              }`}
            >
              {/* Icon Container */}
              <div className="relative shrink-0">
                {isCurrent && (
                  <motion.div
                    className="absolute -inset-1.5 rounded-full border-2 border-[#FF7A00]"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-[#FF7A00]/20 border-[#FF7A00] text-[#FF7A00] shadow-[0_0_15px_rgba(255,122,0,0.5)]'
                      : 'bg-white/5 border-white/20 text-white/40'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Label & Subtitle */}
              <div className="text-left md:text-center min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block">
                  Stage 0{idx + 1}
                </span>
                <h3
                  className={`text-xs font-semibold truncate ${
                    isCurrent
                      ? 'text-[#FF7A00]'
                      : isCompleted
                      ? 'text-white'
                      : 'text-white/50'
                  }`}
                >
                  {stage.stage}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlacementJourney;
