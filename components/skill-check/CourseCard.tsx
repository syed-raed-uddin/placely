'use client';

import React from 'react';
import { Sparkles, ArrowRight, Code2, Globe, Coffee, Terminal, CheckCircle2, Clock } from 'lucide-react';

interface CourseMeta {
  slug: string;
  name: string;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  domains: string[];
  estimated_minutes: number;
  question_count: number;
}

interface CourseCardProps {
  course: CourseMeta;
  onSelect: (slug: string) => void;
  isLoading?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, isLoading }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'python':
        return <Terminal className="w-7 h-7 text-emerald-400" />;
      case 'globe':
        return <Globe className="w-7 h-7 text-blue-400" />;
      case 'coffee':
        return <Coffee className="w-7 h-7 text-amber-400" />;
      case 'code':
      default:
        return <Code2 className="w-7 h-7 text-yellow-400" />;
    }
  };

  const getBorderGlow = (slug: string) => {
    switch (slug) {
      case 'python':
        return 'hover:border-emerald-500/50 hover:shadow-emerald-500/10';
      case 'web-development':
        return 'hover:border-blue-500/50 hover:shadow-blue-500/10';
      case 'java':
        return 'hover:border-amber-500/50 hover:shadow-amber-500/10';
      case 'javascript':
      default:
        return 'hover:border-yellow-500/50 hover:shadow-yellow-500/10';
    }
  };

  return (
    <div
      onClick={() => !isLoading && onSelect(course.slug)}
      className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-[#121212] border border-white/10 transition-all duration-300 cursor-pointer hover:scale-[1.02] shadow-xl ${getBorderGlow(
        course.slug
      )}`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
            {getIcon(course.icon)}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70">
            <Clock className="w-3.5 h-3.5 text-white/50" />
            <span>~{course.estimated_minutes} mins</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors mb-2">
          {course.tagline}
        </h3>
        <p className="text-sm text-white/60 line-clamp-2 mb-4 leading-relaxed">
          {course.description}
        </p>

        {/* Domain chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {course.domains.slice(0, 4).map((d) => (
            <span
              key={d}
              className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[11px] font-medium text-white/60"
            >
              {d}
            </span>
          ))}
          {course.domains.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-white/[0.02] text-[11px] font-medium text-white/40">
              +{course.domains.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-white/50 font-medium">
          {course.question_count} Technical Questions
        </span>
        <button
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg bg-white/10 group-hover:bg-white group-hover:text-black transition-all"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
