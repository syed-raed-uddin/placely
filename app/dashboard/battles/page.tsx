'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Swords, Plus, Loader2, Play, Trophy, Users } from 'lucide-react';

export default function BattlesPage() {
  const router = useRouter();
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBattle, setActiveBattle] = useState<any>(null);
  const [code, setCode] = useState('def solve():\n    pass');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchBattles = async () => {
    setLoading(true);
    try {
      const resp = await apiClient<any>('/battles/');
      setBattles(resp.battles || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load battles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBattles();
  }, []);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const resp = await apiClient<any>('/battles/', {
        method: 'POST',
        body: JSON.stringify({
          category: 'dsa',
          challenge_payload: {
            title: 'Reverse Linked List',
            description: 'Write a function to reverse a singly linked list in Python.'
          }
        })
      });
      // Automatically join the created battle
      await handleJoin(resp.id, resp);
    } catch (err: any) {
      setError(err.message || 'Failed to create battle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (id: string, battleObj: any) => {
    setSubmitting(true);
    try {
      await apiClient<any>(`/battles/${id}/join`, {
        method: 'POST'
      });
      setActiveBattle(battleObj);
      setResult(null);
    } catch (err: any) {
      if (err.message === 'Already joined.') {
        setActiveBattle(battleObj);
      } else {
        setError(err.message || 'Failed to join battle');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim() || submitting || !activeBattle) return;
    setSubmitting(true);
    setError(null);

    try {
      const resp = await apiClient<any>(`/battles/${activeBattle.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          submission_payload: { code }
        })
      });
      setResult(resp);
      
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (activeBattle) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <Swords className="w-6 h-6" />
              </div>
              Battle Arena
            </h1>
            <p className="text-white/50 mt-2 text-sm">Compete against other students in real-time.</p>
          </div>
          <button
            onClick={() => { setActiveBattle(null); fetchBattles(); }}
            className="text-white/50 hover:text-white text-sm font-semibold"
          >
            Leave Battle
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-2">{activeBattle.challenge_payload?.title || 'Coding Challenge'}</h2>
            <p className="text-white/70 text-sm whitespace-pre-wrap">{activeBattle.challenge_payload?.description}</p>
            
            {result && (
              <div className="mt-auto bg-black/40 border border-white/10 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-yellow-400">Submission Evaluated</h3>
                </div>
                <p className="text-white/80 text-sm">Score: <span className="font-bold text-white">{result.score} / 100</span></p>
                <p className="text-white/50 text-xs mt-2">Waiting for other participants to finish...</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
              <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Solution</span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || isPending || !!result}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Submit
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-transparent text-white/90 p-4 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
                disabled={submitting || !!result}
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Swords className="w-6 h-6" />
            </div>
            Battles
          </h1>
          <p className="text-white/60 mt-2">Challenge peers to coding duels and earn XP.</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={submitting}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-xl font-bold transition-all text-sm disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create Battle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl">
          {error}
        </div>
      ) : battles.length === 0 ? (
        <div className="text-center py-20 text-white/50 border border-white/5 rounded-3xl bg-white/5">
          <Swords className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p>No active battles waiting.</p>
          <p className="text-sm mt-1">Create one to challenge others!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {battles.map((b) => (
            <div
              key={b.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{b.challenge_payload?.title || 'Coding Challenge'}</h3>
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {b.category}
                  </span>
                </div>
                <p className="text-xs text-white/50 line-clamp-2">{b.challenge_payload?.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-white/40 font-semibold">
                  <Users className="w-3.5 h-3.5" /> Waiting for players
                </div>
                <button
                  onClick={() => handleJoin(b.id, b)}
                  disabled={submitting}
                  className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
