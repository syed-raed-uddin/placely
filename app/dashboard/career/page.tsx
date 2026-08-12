'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Target, Loader2, Play, Search, BrainCircuit, Activity } from 'lucide-react';
import Link from 'next/link';

export default function CareerXRayPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [loadingRoles, setLoadingRoles] = useState(true);
  
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [running, setRunning] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchData() {
      try {
        const [rolesResp, historyResp] = await Promise.all([
          apiClient<any>('/career/roles'),
          apiClient<any>('/career/xray/history')
        ]);
        setRoles(rolesResp.roles || []);
        if (rolesResp.roles?.length > 0) {
          setSelectedRoleId(rolesResp.roles[0].id);
        }
        setHistory(historyResp.results || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load career data');
      } finally {
        setLoadingRoles(false);
        setLoadingHistory(false);
      }
    }
    fetchData();
  }, []);

  const handleRunXRay = async () => {
    if (!selectedRoleId || running) return;
    setRunning(true);
    setError(null);
    setAnalysis(null);

    try {
      const resp = await apiClient<any>('/career/xray', {
        method: 'POST',
        body: JSON.stringify({ role_id: selectedRoleId })
      });
      setAnalysis(resp);
      
      // Update history in background
      apiClient<any>('/career/xray/history').then(h => setHistory(h.results || []));

      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setRunning(false);
    }
  };

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Activity className="w-8 h-8" />
            </div>
            Career X-Ray
          </h1>
          <p className="text-white/60 mt-3 text-lg max-w-xl leading-relaxed">
            AI-powered gap analysis. See exactly how your current skills map to industry roles and what you need to learn next.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Controls & History */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-cyan-400" /> Target Role
            </h2>
            
            {loadingRoles ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        selectedRoleId === role.id 
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-white' 
                          : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-bold">{role.name}</div>
                      <div className="text-xs opacity-70 mt-0.5">{role.description}</div>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleRunXRay}
                  disabled={running || !selectedRoleId}
                  className="w-full flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-cyan-600/20"
                >
                  {running ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Scan Profile
                </button>
              </div>
            )}
            
            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
          </div>

          {!loadingHistory && history.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">Past Scans</h3>
              <div className="space-y-3">
                {history.slice(0, 5).map((h) => (
                  <div key={h.id} className="p-3 bg-black/20 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-sm">{h.career_roles?.name || 'Unknown Role'}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        h.match_score >= 80 ? 'bg-green-500/20 text-green-400' :
                        h.match_score >= 50 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {h.match_score}% Match
                      </span>
                    </div>
                    <span className="text-xs text-white/30">{new Date(h.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2">
          {running ? (
            <div className="h-full min-h-[400px] bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                <BrainCircuit className="w-16 h-16 text-cyan-400 relative animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white">Analyzing Your Profile</h3>
              <p className="text-white/50 max-w-sm">
                Kiro is cross-referencing your completed projects and skills against the requirements for {selectedRole?.name}...
              </p>
            </div>
          ) : analysis ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedRole?.name} Readiness</h2>
                  <p className="text-white/50 mt-1">Based on your portfolio and platform activity.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">Match Score</div>
                    <div className={`text-4xl font-black ${
                        analysis.match_score >= 80 ? 'text-green-400' :
                        analysis.match_score >= 50 ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                      {analysis.match_score}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">Analysis Summary</h3>
                  <p className="text-white/90 leading-relaxed bg-black/20 p-5 rounded-2xl border border-white/5">
                    {analysis.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider flex items-center gap-2">
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strengths?.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/80 bg-green-500/5 p-3 rounded-xl border border-green-500/10">
                          <span className="text-green-400 mt-0.5">•</span> {s}
                        </li>
                      ))}
                      {!analysis.strengths?.length && <li className="text-white/40 text-sm">No major strengths identified yet.</li>}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                      Gaps
                    </h3>
                    <ul className="space-y-2">
                      {analysis.gaps?.map((g: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/80 bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                          <span className="text-red-400 mt-0.5">•</span> {g}
                        </li>
                      ))}
                      {!analysis.gaps?.length && <li className="text-white/40 text-sm">No major gaps identified!</li>}
                    </ul>
                  </div>
                </div>

                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 mt-4">Action Plan</h3>
                    <div className="space-y-2">
                      {analysis.recommendations.map((r: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-white/90 text-sm">
                          <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                            {i + 1}
                          </div>
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center border-dashed">
              <Activity className="w-16 h-16 text-white/10 mb-4" />
              <h3 className="text-xl font-bold text-white/40">Select a Role</h3>
              <p className="text-white/30 max-w-sm mt-2 text-sm">
                Choose a target career role from the left and run a scan to see your readiness score.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
