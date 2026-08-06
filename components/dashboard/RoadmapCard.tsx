'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';
import ProgressBar from '@/components/ui/ProgressBar';

export const RoadmapCard: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { currentRoadmap } = dashboardData;
  const progressPercent = Math.round(
    (currentRoadmap.modulesCompleted / currentRoadmap.totalModules) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden"
    >
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-white/50 block">
                Active Roadmap
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {currentRoadmap.name}
              </h3>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white/10 border border-white/10 rounded-full text-white/80">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Current Module */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <BookOpen className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span>Current Module</span>
          </div>
          <p className="text-sm font-semibold text-white truncate">
            {currentRoadmap.currentModule}
          </p>
        </div>

        {/* Progress Bar & Module Count */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-white/60">
            <span>Progress</span>
            <span className="font-medium text-white/90">
              {currentRoadmap.modulesCompleted} of {currentRoadmap.totalModules} modules
            </span>
          </div>
          <ProgressBar value={progressPercent} heightClass="h-2.5" />
        </div>
      </div>

      {/* Footer Info & CTA */}
      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Calendar className="w-3.5 h-3.5" />
          <span>Est. completion: {currentRoadmap.estimatedCompletion}</span>
        </div>

        <Link
          href="/dashboard/roadmap"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold text-xs transition-all shadow-md shadow-[#FF7A00]/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default RoadmapCard;
