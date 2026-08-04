'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';
import CircularRing from '@/components/ui/CircularRing';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

export const HeroGreeting: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { user, careerReadiness, streak } = dashboardData;
  const [greeting, setGreeting] = useState<string>('Good Morning');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good Morning');
    } else if (hours < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side: Greeting & Subtitle */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{streak.current} Day Streak 🔥</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {greeting}, <span className="text-[#FF7A00]">{user.name}</span>
          </h1>

          <p className="text-white/70 text-sm md:text-base max-w-xl">
            You&apos;re making great progress towards your placement goals. Complete today&apos;s mission to boost your interview readiness!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-[#FF7A00]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Circular Ring & Career Readiness */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <CircularRing progress={careerReadiness.score} size={150} strokeWidth={10}>
            <div className="flex flex-col items-center justify-center text-center p-2">
              <AnimatedNumber
                value={careerReadiness.score}
                suffix="%"
                className="text-3xl font-extrabold text-white tracking-tight"
              />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-white/60 mt-0.5">
                Career Readiness
              </span>
            </div>
          </CircularRing>
          <div className="mt-3 text-center max-w-[200px]">
            <span className="text-xs text-white/50 block">Next Milestone</span>
            <span className="text-xs font-medium text-white/90 truncate block">
              Next: {careerReadiness.nextMilestone}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroGreeting;
