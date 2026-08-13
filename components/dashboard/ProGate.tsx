'use client';

import React from 'react';
import { useDashboard } from './DashboardProvider';
import { Lock, Sparkles, Code2, Target, Trophy } from 'lucide-react';

interface ProGateProps {
  children: React.ReactNode;
  featureName: string;
  requiredPlan?: 'pro' | 'advanced';
}

export default function ProGate({ children, featureName, requiredPlan = 'pro' }: ProGateProps) {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF7A00]"></div>
      </div>
    );
  }

  const userPlan = data?.userPlan || (data?.isPro ? 'pro' : 'basic');
  const hasAccess = requiredPlan === 'advanced' 
    ? userPlan === 'advanced'
    : (data?.isPro || userPlan === 'pro' || userPlan === 'advanced');

  if (hasAccess) {
    return <>{children}</>;
  }

  const isAdvanced = requiredPlan === 'advanced';
  const isDsa = featureName.includes('DSA');

  const title = isDsa 
    ? 'Master DSA for Technical Interviews' 
    : `Unlock ${featureName}`;
  const subtitle = isDsa
    ? 'Build problem-solving ability through a structured DSA system designed around the skills companies actually test.'
    : `This feature requires Placely ${isAdvanced ? 'Advanced' : 'Pro'}. Upgrade today to supercharge your placement preparation.`;
  const ctaText = isDsa 
    ? 'Unlock Full DSA — ₹499/month' 
    : isAdvanced 
      ? `Upgrade to Placely Advanced — ₹999/mo` 
      : 'Upgrade to Placely Pro — ₹499/mo';

  const cards = isDsa
    ? [
        {
          icon: Code2,
          iconBg: 'bg-blue-500/10',
          iconColor: 'text-blue-400',
          title: '500+ Interview Problems',
          desc: 'Practice curated problems across the core DSA topics.',
        },
        {
          icon: Target,
          iconBg: 'bg-[#FF7A00]/10',
          iconColor: 'text-[#FF7A00]',
          title: 'Skill-Based Progression',
          desc: 'Strengthen weak concepts and track your DSA readiness as you improve.',
        },
        {
          icon: Trophy,
          iconBg: 'bg-purple-500/10',
          iconColor: 'text-purple-400',
          title: 'Compete & Improve',
          desc: 'Challenge yourself through timed problems, battles, and performance tracking.',
        },
      ]
    : [
        {
          icon: Code2,
          iconBg: 'bg-blue-500/10',
          iconColor: 'text-blue-400',
          title: 'Unlimited DSA',
          desc: 'Practice 500+ curated questions',
        },
        {
          icon: Target,
          iconBg: 'bg-[#FF7A00]/10',
          iconColor: 'text-[#FF7A00]',
          title: 'AI Code Mentor',
          desc: 'Get instant, personalized feedback',
        },
        {
          icon: Trophy,
          iconBg: 'bg-purple-500/10',
          iconColor: 'text-purple-400',
          title: 'Global Battles',
          desc: 'Compete with peers worldwide',
        },
      ];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm p-8 max-w-4xl mx-auto my-8">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-[#FF7A00]/20 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#E66A00] flex items-center justify-center shadow-lg shadow-[#FF7A00]/25">
          <Lock className="w-8 h-8 text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            {title}
            <Sparkles className="w-6 h-6 text-[#FF7A00]" />
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-lg">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center gap-3">
                <div className={`p-3 ${card.iconBg} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200">{card.title}</h4>
                  <p className="text-sm text-gray-500">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6 w-full flex justify-center">
          <a
            href="#"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-[#FF7A00] border border-transparent rounded-full hover:bg-[#E66A00] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7A00] focus:ring-offset-gray-900"
          >
            {ctaText}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF9E40] opacity-20 group-hover:opacity-40 blur transition duration-200"></div>
          </a>
        </div>
      </div>
    </div>
  );
}
