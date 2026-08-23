'use client';

import React, { useState } from 'react';
import {
  Rocket,
  Globe,
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Loader2,
  RefreshCw,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface DeploymentGuideProps {
  studentProjectId?: string;
  projectTitle: string;
  technologies?: string[];
  projectCategory?: string;
  existingDeploymentUrl?: string;
  deploymentVerified?: boolean;
  deploymentMeta?: any;
  onVerificationSuccess?: () => void;
}

export default function ProjectDeploymentGuide({
  studentProjectId,
  projectTitle,
  technologies = [],
  projectCategory = 'Fullstack',
  existingDeploymentUrl = '',
  deploymentVerified = false,
  deploymentMeta = {},
  onVerificationSuccess
}: DeploymentGuideProps) {
  const [deploymentUrl, setDeploymentUrl] = useState(existingDeploymentUrl || '');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(
    deploymentVerified
      ? {
          verified: true,
          status_code: deploymentMeta?.status_code || 200,
          response_time_ms: deploymentMeta?.response_time_ms || 320,
          message: 'Deployment is live and verified via server-side probe.'
        }
      : null
  );
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const techs = technologies.map((t) => t.toLowerCase());
  const isCliOrPython =
    (techs.includes('python') || projectTitle.toLowerCase().includes('contact') || projectTitle.toLowerCase().includes('adventure') || projectTitle.toLowerCase().includes('password')) &&
    !techs.some((w) => ['react', 'html', 'css', 'vue', 'nextjs', 'browser'].includes(w));

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifyDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentProjectId) {
      setVerifyError('Please start the project first to enable automated deployment verification.');
      return;
    }
    if (!deploymentUrl.trim()) {
      setVerifyError('Please provide a valid deployment URL.');
      return;
    }

    setVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);

    try {
      const res: any = await apiClient(`/api/student/projects/${studentProjectId}/deployment/verify`, {
        method: 'POST',
        body: JSON.stringify({ deployment_url: deploymentUrl.trim() })
      });

      if (res?.data) {
        setVerifyResult(res.data);
        if (res.data.verified && onVerificationSuccess) {
          onVerificationSuccess();
        }
      } else {
        setVerifyError(res?.error || 'Verification failed. Please check the URL.');
      }
    } catch (err: any) {
      setVerifyError(err?.message || 'Failed to communicate with verification server.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Deployment Cockpit */}
      <div className="bg-gradient-to-br from-cyan-950/40 via-neutral-900 to-black border border-cyan-500/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider flex items-center gap-1">
                <Rocket className="w-3 h-3" /> Production Release
              </span>
              <span className="text-xs text-white/40">
                • Archetype: {isCliOrPython ? 'CLI / Modular Python' : 'Live Web Application'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {isCliOrPython ? 'Execution Proof & Verification' : 'Production Deployment & Live Verification'}
            </h2>
            <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
              {isCliOrPython
                ? 'Prove technical reproducibility through clean dependency isolation, automated pytest validation, and structured repository execution.'
                : 'Deploy your codebase to public cloud infrastructure (Vercel, Render, Railway, GitHub Pages) and execute server-side verification.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center sm:text-right shrink-0 min-w-[200px]">
            <span className="text-xs text-white/50 block">Verification Status</span>
            <div className="mt-1 flex items-center justify-center sm:justify-end gap-1.5">
              {deploymentVerified || verifyResult?.verified ? (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> System-Verified
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Unverified
                </span>
              )}
            </div>
            <span className="text-[10px] text-white/40 block mt-1">
              {isCliOrPython ? 'Test Suite & Manifest Proof' : 'Server-Authoritative HTTPS Probe'}
            </span>
          </div>
        </div>
      </div>

      {/* WEB DEPLOYMENT SECTION (For Web / Frontend / Fullstack projects) */}
      {!isCliOrPython && (
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">1. Server-Side Live Deployment Probe</h3>
              <p className="text-xs text-white/50">
                Placely probes your live HTTPS URL to objectively verify uptime, status code, and latency.
              </p>
            </div>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerifyDeployment} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/70 block">
                Public Live Production URL (Vercel, Render, Netlify, Railway) *
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="url"
                    required
                    placeholder="https://my-product-clone.vercel.app"
                    value={deploymentUrl}
                    onChange={(e) => setDeploymentUrl(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={verifying}
                  className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 shrink-0"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Probing Server...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Verify Deployment</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {verifyError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="font-bold block text-rose-200">Verification Failure</strong>
                  <span>{verifyError}</span>
                </div>
              </div>
            )}

            {/* Verification Result Card */}
            {verifyResult && (
              <div
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  verifyResult.verified
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {verifyResult.verified ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                    <strong className="text-xs font-extrabold text-white">
                      {verifyResult.verified ? 'Live Deployment Verified (HTTP 200 OK)' : 'Probe Returned Non-200 Status'}
                    </strong>
                  </div>
                  {verifyResult.response_time_ms && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-black/40 text-[10px] font-mono text-white/60">
                      Latency: {verifyResult.response_time_ms}ms
                    </span>
                  )}
                </div>

                <p className="text-xs leading-relaxed text-white/80">{verifyResult.message}</p>

                {verifyResult.final_url && (
                  <a
                    href={verifyResult.final_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline pt-1"
                  >
                    <span>Visit Live Production Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </form>

          {/* Deployment Platform Guides */}
          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-400" /> Recommended Cloud Deployment Providers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-xs font-bold text-white block">Vercel (Recommended)</span>
                <p className="text-[11px] text-white/50">One-click Git repository import for Next.js, Vite, and HTML/CSS static sites.</p>
                <div className="font-mono text-[10px] text-cyan-400 bg-black p-2 rounded-lg border border-white/5">
                  Build: npm run build<br />Output: dist / .next
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-xs font-bold text-white block">Render / Railway</span>
                <p className="text-[11px] text-white/50">Continuous deployment for backend Node/Python web services and databases.</p>
                <div className="font-mono text-[10px] text-cyan-400 bg-black p-2 rounded-lg border border-white/5">
                  Start: gunicorn / node server.js
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-xs font-bold text-white block">GitHub Pages</span>
                <p className="text-[11px] text-white/50">Free HTTPS hosting directly from your repository's /docs or gh-pages branch.</p>
                <div className="font-mono text-[10px] text-cyan-400 bg-black p-2 rounded-lg border border-white/5">
                  Settings -&gt; Pages -&gt; Deploy
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLI / PYTHON EXECUTION PROOF SECTION */}
      {isCliOrPython && (
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">1. Technical Reproducibility &amp; Test Suite Execution</h3>
              <p className="text-xs text-white/50">
                CLI and algorithm projects are verified through automated test suites, requirements manifests, and zero-setup execution.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200/90 space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>CLI Verification Standards</span>
              </div>
              <p className="leading-relaxed">
                As a standalone Python/CLI engineering tool, you do not need a web URL. Your project is verified by submitting your public GitHub repository containing a valid <code>requirements.txt</code> or <code>pyproject.toml</code> and passing <code>pytest</code> suites.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Local Reproducibility Verification</h4>
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Execute Automated Test Suite</span>
                  <span className="text-[10px] text-white/40 font-mono">pytest -v</span>
                </div>
                <div className="relative group rounded-xl bg-black border border-white/10 p-3 font-mono text-xs text-purple-400">
                  <pre className="whitespace-pre">pytest tests/ -v --tb=short</pre>
                  <button
                    onClick={() => handleCopy('pytest tests/ -v --tb=short', 'cli_test')}
                    className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1"
                  >
                    {copiedKey === 'cli_test' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'cli_test' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
