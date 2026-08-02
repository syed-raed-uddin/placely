'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Calendar, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';
import CircularRing from '@/components/ui/CircularRing';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

export const ProjectCard: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { currentProject } = dashboardData;

  if (!currentProject) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-center items-center space-y-4 relative overflow-hidden text-center min-h-[250px]"
      >
        <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <FolderGit2 className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            No Active Project
          </h3>
          <p className="text-sm text-white/50 mt-1">
            Complete your track modules to unlock your first real-world project.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden"
    >
      <div className="space-y-4">
        {/* Top Header with mini CircularRing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-white/50 block">
                Active Project
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {currentProject.name}
              </h3>
            </div>
          </div>

          <CircularRing
            progress={currentProject.progress}
            size={56}
            strokeWidth={5}
            ringColor="#A855F7"
          >
            <AnimatedNumber
              value={currentProject.progress}
              suffix="%"
              className="text-xs font-bold text-white"
            />
          </CircularRing>
        </div>

        {/* Milestone & Remaining Tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Current Milestone</span>
            </div>
            <p className="text-sm font-semibold text-white truncate">
              {currentProject.currentMilestone}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs text-white/50 block">Remaining Tasks</span>
            <p className="text-sm font-semibold text-white">
              {currentProject.remainingTasks} pending tasks
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info & CTA */}
      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Calendar className="w-3.5 h-3.5" />
          <span>Target: {currentProject.estimatedCompletion}</span>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Open Project</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
