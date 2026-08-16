'use client';

import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap, BrainCircuit, Rocket, Lock } from 'lucide-react';
import Link from 'next/link';

interface PlacelyBasicCTAProps {
  biggestGap?: string;
  courseName?: string;
  onCtaClick?: (ctaType: string) => void;
}

export const PlacelyBasicCTA: React.FC<PlacelyBasicCTAProps> = ({
  biggestGap,
  courseName = 'your technical track',
  onCtaClick,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181818] to-[#0D0D0D] border border-white/15 p-6 md:p-10 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Value Proposition Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SYSTEMATIC SKILL ACCELERATION</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
            Your Skill Check shows <span className="text-emerald-400">WHAT</span> is missing.
            <br />
            Placely builds the system to <span className="text-white underline decoration-emerald-500/60 decoration-2">FIX IT</span>.
          </h2>

          <p className="text-sm md:text-base text-white/70 leading-relaxed mb-6">
            Knowing your gaps in {biggestGap ? <strong className="text-white">{biggestGap}</strong> : courseName} is only step one. 
            Placely gives you an AI-guided daily execution roadmap, structured projects, and automated code reviews to reach interview-ready mastery.
          </p>
        </div>

        {/* Pricing Card & Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 p-6 rounded-2xl bg-black/40 border border-white/10">
          {/* Features Column */}
          <div className="lg:col-span-7 space-y-3.5">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white/50 mb-3">
              Included in Placely Basic
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-white/80">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Personalized Daily Roadmap</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kiro AI Mentor (24/7 Guidance)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>AI Learning Firewall Protection</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Topic Quizzes & Teach-Back</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Real Project Systems & Defense</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Verified Skill Passport & XP</span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Column */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-white/[0.03] border border-white/10 text-center lg:text-left">
            <div>
              <div className="flex items-baseline justify-center lg:justify-start gap-1.5 mb-1">
                <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">₹199</span>
                <span className="text-xs font-medium text-white/50">/ month</span>
              </div>
              <p className="text-xs text-emerald-400/90 font-medium mb-4">
                BASIC PLAN • Build Your Foundation
              </p>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/dashboard"
                onClick={() => onCtaClick?.('enroll_basic')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
              >
                <span>Enroll in Basic Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard"
                onClick={() => onCtaClick?.('free_signup')}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors"
              >
                <span>Create Free Account & Save Report</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
