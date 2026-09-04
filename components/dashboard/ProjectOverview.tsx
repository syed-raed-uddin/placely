'use client';

import React from 'react';
import {
  Layers,
  Brain,
  Wrench,
  CheckCircle2,
  Briefcase,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  Trophy,
  ShieldCheck,
  Zap,
  Clock,
  Laptop,
  Check,
  ExternalLink
} from 'lucide-react';

export interface ProjectOverviewProps {
  projectData: {
    id: string;
    title: string;
    description: string;
    difficulty?: string;
    estimated_hours?: number;
    skills_covered?: string[];
    prerequisites?: any;
    learning_topics?: any[];
    technologies?: string[];
    project_category?: string;
    summary?: string;
    expected_outcome?: string;
  };
  studentProject?: {
    id?: string;
    status?: string;
    progress?: number;
  } | null;
  onGoToBlueprint: () => void;
  onGoToSetup: () => void;
  onGoToExecution: () => void;
}

export default function ProjectOverview({
  projectData,
  studentProject,
  onGoToBlueprint,
  onGoToSetup,
  onGoToExecution
}: ProjectOverviewProps) {
  const isStarted = !!studentProject?.id;
  const progress = studentProject?.progress || 0;
  const isCompleted = studentProject?.status === 'COMPLETED';

  // Extract skills covered with sensible defaults
  const skills = projectData.skills_covered && projectData.skills_covered.length > 0
    ? projectData.skills_covered
    : ['Frontend Architecture', 'State Management', 'Production Engineering', 'System Design'];

  // Extract prerequisites knowledge safely
  const prereqObj = projectData.prerequisites;
  let knowledgePrereqs: string[] = [];
  let toolPrereqs: string[] = [];

  if (Array.isArray(prereqObj)) {
    knowledgePrereqs = prereqObj.map(p => typeof p === 'string' ? p : p.concept || p.name || 'Core Web Standards');
  } else if (prereqObj && typeof prereqObj === 'object') {
    if (Array.isArray(prereqObj.knowledge)) {
      knowledgePrereqs = prereqObj.knowledge.map((k: any) => typeof k === 'string' ? k : k.concept || k.title || '');
    }
    if (Array.isArray(prereqObj.software)) {
      toolPrereqs = prereqObj.software.map((s: any) => typeof s === 'string' ? s : s.name || '');
    }
  }

  if (knowledgePrereqs.length === 0) {
    knowledgePrereqs = ['Basic JavaScript/TypeScript syntax', 'Modern Web Layouts', 'Git fundamentals'];
  }
  if (toolPrereqs.length === 0) {
    toolPrereqs = ['Node.js (LTS)', 'Modern Web Browser', 'Git CLI'];
  }

  // Technologies
  const techStack = projectData.technologies && projectData.technologies.length > 0
    ? projectData.technologies
    : ['TypeScript', 'Next.js / React', 'Tailwind CSS', 'Web APIs'];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. HERO ARCHITECTURAL BRIEFING BANNER */}
      <div className="relative bg-gradient-to-br from-purple-950/30 via-neutral-900 to-black border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3 h-3" /> System Architecture Briefing
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white/70 capitalize">
                {projectData.difficulty || 'Intermediate'}
              </span>
              <span className="text-xs text-white/40 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ~{projectData.estimated_hours || 10} Hours
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {projectData.title}
            </h2>

            <p className="text-sm text-white/70 leading-relaxed">
              {projectData.description || 'Build and deploy an end-to-end production software engineering project designed to prove real technical competence to engineering hiring managers.'}
            </p>
          </div>

          {/* Quick Action Box */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3 shrink-0 sm:min-w-[240px] text-center sm:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/40 block">
              Suggested Starting Point
            </span>
            <p className="text-xs text-white/70 leading-snug">
              {isStarted && progress > 0
                ? `You're currently ${progress}% through execution.`
                : 'Review the learning blueprint first to build a solid mental model.'}
            </p>
            <div className="pt-1 flex flex-col gap-2">
              {isStarted && progress > 0 ? (
                <button
                  onClick={onGoToExecution}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF7A00]/20 transition-all"
                >
                  <span>Resume Execution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onGoToBlueprint}
                  className="w-full px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Explore Blueprint First</span>
                </button>
              )}
              <button
                onClick={onGoToSetup}
                className="w-full px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Wrench className="w-3 h-3 text-amber-400" />
                <span>View Setup Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WHAT YOU'RE BUILDING vs WHY IT MATTERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What you're building */}
        <div className="p-6 md:p-7 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF7A00]/15 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00]">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">What You&apos;re Building</h3>
                <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Core Engineering Deliverables</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              {projectData.summary || `A fully functional, battle-tested implementation of ${projectData.title}. You will architect the system from scratch, handle robust state synchronization, defend against edge cases, and deploy a live production service.`}
            </p>

            {/* Tech Stack Pills */}
            <div className="pt-2 space-y-1.5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Tech Stack &amp; Foundations:</span>
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 font-mono text-xs text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
            <span>4 Sprints • 8 Guided Tasks</span>
            <button
              onClick={onGoToExecution}
              className="text-[#FF7A00] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>Explore Milestones</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Why you're building it */}
        <div className="p-6 md:p-7 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Why You&apos;re Building It</h3>
                <span className="text-[11px] text-purple-300/60 uppercase tracking-wider font-semibold">Recruiter &amp; Industry Relevance</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              Standard bootcamp projects are repetitive and fail to signal real engineering capability. This project forces you to make real architectural trade-offs: component isolation, race condition handling, defensive validation, and deployment discipline.
            </p>

            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed space-y-1">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Hiring Manager Lens</span>
              </div>
              <p className="text-[11px] text-white/70">
                Engineering teams look for candidates who can explain <em>why</em> they selected a specific pattern, rather than just copying a tutorial. This project gives you verifiable talking points for senior technical interviews.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
            <span>Includes AI Technical Defense</span>
            <button
              onClick={onGoToBlueprint}
              className="text-purple-400 hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>View Tradeoffs in Blueprint</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SKILLS YOU'LL LEARN & DEMONSTRATE */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">Competency Mapping</span>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              Skills You&apos;ll Learn &amp; Demonstrate
            </h3>
          </div>
          <span className="text-xs text-white/40 font-mono">
            {skills.length} Certified Competencies
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {skills.map((skill, sIdx) => (
            <div
              key={sIdx}
              className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3 hover:border-emerald-500/30 transition-all"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white/90">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PREREQUISITES & VERIFICATION */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">Readiness Criteria</span>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              Prerequisites &amp; Toolchain Summary
            </h3>
          </div>
          <button
            onClick={onGoToSetup}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1"
          >
            <span>Open Interactive Setup Guide</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
            <span className="text-[11px] font-extrabold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" /> Recommended Knowledge
            </span>
            <ul className="space-y-1.5 text-xs text-white/70">
              {knowledgePrereqs.slice(0, 4).map((k, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 mt-1.5 shrink-0" />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
            <span className="text-[11px] font-extrabold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Required Software &amp; Tooling
            </span>
            <ul className="space-y-1.5 text-xs text-white/70">
              {toolPrereqs.slice(0, 4).map((t, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 mt-1.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 5. EXPECTED FINAL OUTCOME */}
      <div className="bg-gradient-to-br from-emerald-950/30 via-neutral-900 to-black border border-emerald-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              Proof of Work
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Expected Final Outcome &amp; Portfolio Asset
          </h3>
          <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
            Upon finishing this project, you will have more than code sitting in a private folder. You will possess four certified assets:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-bold">
              01
            </div>
            <h4 className="text-xs font-bold text-white">Live Verified URL</h4>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Public production deployment tested for SSRF security and HTTP 200 health.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">
              02
            </div>
            <h4 className="text-xs font-bold text-white">Git Repository</h4>
            <p className="text-[11px] text-white/60 leading-relaxed">
              8 atomic, conventional commits reflecting real sprint progression.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold">
              03
            </div>
            <h4 className="text-xs font-bold text-white">AI Technical Defense</h4>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Pass an adversarial architectural defense interview with Kiro.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold">
              04
            </div>
            <h4 className="text-xs font-bold text-white">Portfolio Evidence</h4>
            <p className="text-[11px] text-white/60 leading-relaxed">
              A 7-factor tamper-proof evidence dossier stamped to your public portfolio.
            </p>
          </div>
        </div>

        {/* Bottom CTA bar */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-white/50 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready to start the engineering journey?</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToBlueprint}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>1. Study Blueprint Concepts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onGoToExecution}
              className="px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-lg shadow-[#FF7A00]/20 transition-all"
            >
              <span>Jump Straight to Building</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
