'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Trophy, Medal, Star, Flame, Users, Loader2 } from 'lucide-react';

export default function LeaderboardPage() {
  const [boardType, setBoardType] = useState<'global' | 'weekly'>('global');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      setError(null);
      try {
        const resp = await apiClient<any>(`/leaderboards/?type=${boardType}`);
        setLeaderboard(resp.leaderboard || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [boardType]);

  const renderRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Medal className="w-6 h-6 text-yellow-400 drop-shadow-md" />;
      case 2: return <Medal className="w-6 h-6 text-slate-300 drop-shadow-md" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600 drop-shadow-md" />;
      default: return <span className="font-bold text-white/40 text-lg w-6 text-center">{rank}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <Trophy className="w-8 h-8" />
            </div>
            Hall of Fame
          </h1>
          <p className="text-white/60 mt-3 text-lg max-w-xl leading-relaxed">
            Compete with peers globally. Climb the ranks by completing tracks, winning battles, and defending projects.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setBoardType('global')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              boardType === 'global' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Users className="w-4 h-4" /> Global
          </button>
          <button
            onClick={() => setBoardType('weekly')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              boardType === 'weekly' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Flame className="w-4 h-4" /> Weekly
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px]">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Header row */}
        <div className="grid grid-cols-[80px_1fr_120px] items-center px-6 md:px-8 py-4 border-b border-white/5 bg-black/20 text-xs font-bold text-white/40 uppercase tracking-wider">
          <div className="text-center">Rank</div>
          <div>Student</div>
          <div className="text-right">Total XP</div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
            <p className="text-white/50 font-medium">Crunching the numbers...</p>
          </div>
        ) : error ? (
          <div className="m-8 p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center font-medium">
            {error}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
              <Star className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/50 font-medium">No one has earned XP yet.</p>
            <p className="text-sm text-white/30">Be the first to climb the ranks!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {leaderboard.map((user, idx) => (
              <div 
                key={user.profile_slug || idx}
                className="grid grid-cols-[80px_1fr_120px] items-center px-6 md:px-8 py-4 hover:bg-white/[0.02] transition-colors group relative"
              >
                {/* Rank highlight overlay for top 3 */}
                {user.rank <= 3 && (
                  <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${
                    user.rank === 1 ? 'bg-yellow-400' : user.rank === 2 ? 'bg-slate-300' : 'bg-amber-600'
                  }`} />
                )}

                <div className="flex justify-center items-center relative z-10">
                  {renderRankIcon(user.rank)}
                </div>
                
                <div className="font-bold text-white/90 group-hover:text-white transition-colors relative z-10 truncate pr-4">
                  {user.display_name}
                  {user.profile_slug && (
                    <span className="ml-3 text-xs font-medium text-white/30">@{user.profile_slug}</span>
                  )}
                </div>
                
                <div className="text-right relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <span className="font-bold text-yellow-400">{user.total_xp.toLocaleString()}</span>
                    <span className="text-[10px] font-extrabold text-yellow-500/60 uppercase">XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
