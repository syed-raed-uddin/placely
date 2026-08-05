'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Calendar, ExternalLink, CheckCircle2, Sparkles, Lock } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';
import CircularRing from '@/components/ui/CircularRing';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

export default function ProjectsPage() {
  const { data } = useDashboard();
  const { currentProject, currentRoadmap } = data;

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8 pb-16 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Your Work</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Projects</h1>
        <p className="text-white/50 text-sm">Real-world projects tied to your learning track</p>
      </div>

      {currentProject ? (
        <>
          {/* Active Project Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 backdrop-blur-md border border-[#FF7A00]/30 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden"
          >
            {/* Glow accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Circular Progress */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <CircularRing
                  progress={currentProject.progress}
                  size={120}
                  strokeWidth={10}
                  ringColor="#FF7A00"
                >
                  <AnimatedNumber
                    value={currentProject.progress}
                    suffix="%"
                    className="text-xl font-extrabold text-white"
                  />
                </CircularRing>
                <span className="text-xs text-white/40 font-medium">Complete</span>
              </div>

              {/* Project Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#FF7A00]">Active Project</span>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">{currentProject.name}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A00]" />
                      Current Milestone
                    </div>
                    <p className="text-sm font-semibold text-white">{currentProject.currentMilestone}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <Calendar className="w-3.5 h-3.5 text-[#FF7A00]" />
                      Target Date
                    </div>
                    <p className="text-sm font-semibold text-white">{currentProject.estimatedCompletion}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/50 mb-1">Remaining Tasks</p>
                  <p className="text-lg font-bold text-white">{currentProject.remainingTasks} <span className="text-sm font-normal text-white/50">pending</span></p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold text-sm transition-all shadow-lg shadow-[#FF7A00]/25 hover:scale-[1.02] active:scale-[0.99]"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Project
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        /* No Project State */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Active Project Yet</h3>
            <p className="text-white/50 text-sm mt-1 max-w-xs">
              Complete more modules in your roadmap to unlock your first real-world project.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span>Day <strong className="text-white">{currentRoadmap.modulesCompleted + 1}</strong> of {currentRoadmap.totalModules} — Keep going!</span>
          </div>
        </motion.div>
      )}

      {/* Coming Soon: Past Projects */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
      >
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-[#0A0A0A]/60 flex flex-col items-center justify-center rounded-3xl gap-3">
          <Lock className="w-6 h-6 text-white/30" />
          <div className="px-4 py-2 rounded-full bg-[#FF7A00]/20 border border-[#FF7A00]/50 text-[#FF7A00] font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,122,0,0.3)]">
            Coming Soon
          </div>
          <p className="text-white/40 text-xs">Portfolio & past project history</p>
        </div>

        <div className="opacity-20 pointer-events-none space-y-4">
          <h2 className="text-xl font-bold text-white">Past Projects</h2>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-2xl bg-white/10 border border-white/10" />
          ))}
        </div>
      </motion.div>
    </main>
  );
}
