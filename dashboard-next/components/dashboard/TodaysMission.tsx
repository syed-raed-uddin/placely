'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Target, CheckCircle2 } from 'lucide-react';
import { TaskItem } from '@/lib/mockData';
import { useDashboard } from '@/components/dashboard/DashboardProvider';
import ProgressBar from '@/components/ui/ProgressBar';

export const TodaysMission: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  
  // Update state when data changes
  React.useEffect(() => {
    setTasks(dashboardData.todayTasks);
  }, [dashboardData.todayTasks]);
  const [floatingXp, setFloatingXp] = useState<{ [key: string]: boolean }>({});

  const toggleTask = (id: string) => {
    setTasks((prevTasks) => {
      const target = prevTasks.find((t) => t.id === id);
      if (target && !target.completed) {
        setFloatingXp((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
          setFloatingXp((prev) => ({ ...prev, [id]: false }));
        }, 1200);
      }
      return prevTasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
    });
  };

  const sortedTasks = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));

  const priorityStyles = {
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Today&apos;s Mission</h2>
            <p className="text-xs text-white/50">Complete tasks to gain XP and stay on schedule</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 font-medium">
          {tasks.filter((t) => t.completed).length} / {tasks.length} Done
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 rounded-full bg-white/5 text-white/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">No tasks for today</p>
              <p className="text-xs text-white/50 mt-1">Check your roadmap or take a break!</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {sortedTasks.map((task) => {
            const isCompleted = task.completed;
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => toggleTask(task.id)}
                className={`relative group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/5 opacity-60'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                }`}
              >
                {/* Floating XP text animation on completion */}
                <AnimatePresence>
                  {floatingXp[task.id] && (
                    <motion.span
                      initial={{ y: 0, opacity: 1, scale: 1 }}
                      animate={{ y: -30, opacity: 0, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="absolute left-10 -top-2 font-black text-[#FF7A00] text-sm pointer-events-none drop-shadow-md z-20 flex items-center gap-1"
                    >
                      <Zap className="w-4 h-4 fill-[#FF7A00]" /> +{task.xpReward} XP
                    </motion.span>
                  )}
                </AnimatePresence>

                <div className="flex items-start gap-4 flex-1">
                  {/* Circular Checkbox with SVG Checkmark */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-[#FF7A00] border-[#FF7A00] text-white shadow-md shadow-[#FF7A00]/30'
                        : 'border-white/30 hover:border-[#FF7A00] bg-white/5'
                    }`}
                  >
                    {isCompleted && (
                      <motion.svg
                        className="w-3.5 h-3.5 stroke-current"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M20 6L9 17l-5-5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.25 }}
                        />
                      </motion.svg>
                    )}
                  </button>

                  <div className="flex-1 space-y-1.5">
                    <span
                      className={`font-semibold text-sm block transition-colors ${
                        isCompleted ? 'text-white/60 line-through' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </span>

                    {task.subProgress !== undefined && !isCompleted && (
                      <div className="w-full max-w-md pt-1 space-y-1">
                        <div className="flex justify-between text-[11px] text-white/50">
                          <span>Sub-task progress</span>
                          <span>{task.subProgress}%</span>
                        </div>
                        <ProgressBar value={task.subProgress} heightClass="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mt-3 md:mt-0 pl-10 md:pl-0 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
                      priorityStyles[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>

                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-[11px] text-white/60">
                    <Clock className="w-3 h-3" />
                    {task.estimatedTime}
                  </span>

                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full text-[11px] font-bold text-[#FF7A00]">
                    +{task.xpReward} XP
                  </span>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TodaysMission;
