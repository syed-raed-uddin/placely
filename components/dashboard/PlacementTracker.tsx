'use client';

import React from 'react';
import { Send, MessageSquareCheck, Calendar, Award, Percent, Clock, Sparkles, Plus } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

export const PlacementTracker: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { placementTracker } = dashboardData;

  const stats = [
    {
      label: 'Applications Sent',
      value: placementTracker.applicationsSent,
      suffix: '',
      icon: Send,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Replies Received',
      value: placementTracker.repliesReceived,
      suffix: '',
      icon: MessageSquareCheck,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Interviews Scheduled',
      value: placementTracker.interviewsScheduled,
      suffix: '',
      icon: Calendar,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Offers Received',
      value: placementTracker.offers,
      suffix: '',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Response Rate',
      value: placementTracker.responseRate,
      suffix: '%',
      icon: Percent,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Days Since Last App',
      value: placementTracker.daysSinceLastApplication,
      suffix: ' days',
      icon: Clock,
      color: 'text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]/20',
    },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 z-20 backdrop-blur-sm bg-[#0A0A0A]/60 flex flex-col items-center justify-center rounded-3xl">
        <div className="px-4 py-2 rounded-full bg-[#FF7A00]/20 border border-[#FF7A00]/50 text-[#FF7A00] font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,122,0,0.3)]">
          Coming Soon
        </div>
      </div>

      <div className="opacity-50 pointer-events-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Placement Tracker</h2>
            <p className="text-xs text-white/50">Track your job applications and funnel metrics</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-semibold text-xs transition-all shadow-lg shadow-[#FF7A00]/20 hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log Application</span>
          </button>
        </div>

        {/* 2x3 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/60">{stat.label}</span>
                  <div className={`p-2 rounded-lg border ${stat.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <AnimatedNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-2xl font-extrabold text-white tracking-tight"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Recommendation Strip */}
        <div className="p-4 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-start gap-3 mt-6">
          <div className="p-2 rounded-xl bg-[#FF7A00]/20 text-[#FF7A00] shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider block">
              AI Recommendation
            </span>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              {placementTracker.aiRecommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementTracker;
