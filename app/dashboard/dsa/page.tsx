'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Code2, ArrowRight, Loader2 } from 'lucide-react';

type Problem = {
  id: string;
  title: string;
  difficulty: string;
  topic: string;
  concept_slug: string;
  time_limit_ms: number;
};

export default function DSAPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProblems() {
      try {
        const data = await apiClient<{status: string, problems: Problem[]}>('/dsa/problems');
        setProblems(data.problems || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load DSA problems');
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Code2 className="w-8 h-8 text-[#FF7A00]" />
          Data Structures & Algorithms
        </h1>
        <p className="text-white/60 mt-2">Solve challenges, earn XP, and prove your technical mastery.</p>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl">
          {error}
        </div>
      )}

      {!loading && !error && problems.length === 0 && (
        <div className="text-center py-20 text-white/50">
          No problems available right now. Check back later!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problems.map(problem => (
          <Link
            key={problem.id}
            href={`/dashboard/dsa/${problem.id}`}
            className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-[#FF7A00]/50 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-white group-hover:text-[#FF7A00] transition-colors">{problem.title}</h3>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-[#FF7A00] group-hover:translate-x-1 transition-all" />
            </div>
            
            <div className="flex gap-2 text-xs font-semibold">
              <span className={`px-2 py-1 rounded-md ${
                problem.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                problem.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {problem.difficulty.toUpperCase()}
              </span>
              <span className="bg-white/5 border border-white/10 text-white/70 px-2 py-1 rounded-md">
                {problem.topic}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
