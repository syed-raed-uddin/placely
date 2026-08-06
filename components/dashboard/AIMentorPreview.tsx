'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, MessageSquare, Sparkles, ArrowRight, CornerDownRight } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

export const AIMentorPreview: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { aiMentor } = dashboardData;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 flex flex-col justify-between">
      {/* Header with Avatar & Online Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF7A00] to-amber-400 p-0.5 shadow-lg shadow-[#FF7A00]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center text-[#FF7A00]">
                <Bot className="w-6 h-6" />
              </div>
            </div>
            {/* Active Online Green Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0A0A0A] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{aiMentor.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                Online
              </span>
            </div>
            <p className="text-xs text-white/50">24/7 Placement & Career Advisor</p>
          </div>
        </div>
      </div>

      {/* Last Message Preview Box */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative">
        <div className="flex items-start gap-2 text-white/80 text-xs leading-relaxed font-medium">
          <Sparkles className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
          <p className="line-clamp-2">{aiMentor.lastMessage}</p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block">
          Suggested Questions
        </span>
        <div className="flex flex-wrap gap-2">
          {aiMentor.suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:border-[#FF7A00] hover:text-[#FF7A00] hover:bg-[#FF7A00]/5 transition-all text-left flex items-center gap-1.5"
            >
              <CornerDownRight className="w-3 h-3 text-[#FF7A00]/70 shrink-0" />
              <span>{question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Conversation Button */}
      <Link
        href="/dashboard/mentor"
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white text-xs font-semibold transition-all shadow-lg shadow-[#FF7A00]/25 hover:scale-[1.01] active:scale-[0.99]"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Continue Conversation</span>
        <ArrowRight className="w-3.5 h-3.5 ml-auto" />
      </Link>
    </div>
  );
};

export default AIMentorPreview;
