'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FolderGit2,
  Clock,
  Zap,
  GitBranch,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Trophy,
  Award,
  ExternalLink,
  BookOpen,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import ProjectMilestoneStepper from '@/components/dashboard/ProjectMilestoneStepper';
import ProjectLearningBlueprint from '@/components/dashboard/ProjectLearningBlueprint';
import ProjectDefenseModal from '@/components/dashboard/ProjectDefenseModal';
import ProjectEvidenceDrawer from '@/components/dashboard/ProjectEvidenceDrawer';
import { Layers, Brain } from 'lucide-react';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectIdOrSpId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<any>(null);
  const [studentProject, setStudentProject] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [defenses, setDefenses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Tab & concept navigation state
  const [activeTab, setActiveTab] = useState<'milestones' | 'learning'>('milestones');
  const [activeConceptFilter, setActiveConceptFilter] = useState<string | null>(null);

  // Submission state
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Modals & Drawers
  const [isDefenseOpen, setIsDefenseOpen] = useState(false);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try fetching student project execution state directly
      try {
        const spRes: any = await apiClient(`/api/student/projects/${projectIdOrSpId}`);
        if (spRes?.data) {
          setStudentProject({
            ...spRes.data.student_project,
            milestones: spRes.data.milestones || spRes.data.student_project?.milestones || []
          });
          setProjectData(spRes.data.project);
          setVerifications(spRes.data.verifications || []);
          setDefenses(spRes.data.defenses || []);
          setGithubUrl(spRes.data.student_project?.github_repo || '');
          setLiveDemoUrl(spRes.data.student_project?.live_demo || '');
          setLoading(false);
          return;
        }
      } catch (e) {
        // Not a student_project ID, fallback to template ID
      }

      // 2. Fallback: Fetch blueprint and start/get student instance
      const bpRes: any = await apiClient(`/api/projects/${projectIdOrSpId}`);
      if (bpRes?.project) {
        setProjectData(bpRes.project);
        const startRes: any = await apiClient(`/api/projects/${projectIdOrSpId}/start`, {
          method: 'POST'
        });
        if (startRes?.student_project_id) {
          const spRes: any = await apiClient(`/api/student/projects/${startRes.student_project_id}`);
          setStudentProject({
            ...spRes?.data?.student_project,
            milestones: spRes?.data?.milestones || spRes?.data?.student_project?.milestones || []
          });
          setVerifications(spRes?.data?.verifications || []);
          setDefenses(spRes?.data?.defenses || []);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project workspace');
    } finally {
      setLoading(false);
    }
  }, [projectIdOrSpId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmitForVerification = async () => {
    if (!githubUrl || !studentProject?.id) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await apiClient(`/api/student/projects/${studentProject.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          github_url: githubUrl.trim(),
          live_demo_url: liveDemoUrl.trim() || undefined
        })
      });
      await loadData();
    } catch (err: any) {
      setSubmitError(err.message || 'Verification submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
        <p className="text-sm text-white/50 font-medium">Loading Project Workspace...</p>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-4 text-white">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
          {error || 'Project not found'}
        </div>
        <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Projects Dashboard
        </Link>
      </div>
    );
  }

  const milestones = studentProject?.milestones || projectData.milestones || [];
  const progressPct = studentProject?.progress || 0;
  const isCompleted = studentProject?.status === 'COMPLETED';
  const isDefenseActive = studentProject?.status === 'DEFENSE_ACTIVE';
  const isVerified = studentProject?.status === 'VERIFIED' || isDefenseActive || isCompleted;

  const latestVerification = verifications[0];
  const isNeedsRevision = latestVerification?.status === 'needs_revision' && !isVerified;

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8 pb-24 space-y-8 text-white">
      {/* Top Breadcrumb Link */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Projects Catalog
      </Link>

      {/* Project Header Banner */}
      <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-black border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] uppercase tracking-wider">
                Engineering Workspace
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white/70 capitalize">
                {projectData.difficulty || 'Intermediate'}
              </span>
              {isCompleted && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Completed &amp; Verified
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{projectData.title}</h1>
            <p className="text-white/60 text-sm max-w-2xl leading-relaxed">{projectData.description}</p>
          </div>

          {/* Quick Metrics */}
          <div className="flex md:flex-col items-center md:items-end gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center w-full">
              <span className="text-xs text-white/40 block">Estimated Time</span>
              <strong className="text-sm font-bold text-white flex items-center justify-center md:justify-end gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#FF7A00]" /> ~{projectData.estimated_hours || 10} Hours
              </strong>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center w-full">
              <span className="text-xs text-white/40 block">XP Reward</span>
              <strong className="text-sm font-bold text-amber-400 flex items-center justify-center md:justify-end gap-1 mt-0.5">
                <Zap className="w-3.5 h-3.5" /> 850 XP
              </strong>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-white/50">Overall Engineering Progression</span>
            <span className="text-[#FF7A00] font-bold">{isCompleted ? '100%' : `${progressPct}%`}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF7A00] to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${isCompleted ? 100 : progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Completed Project Evidence Showcase (When Completed) */}
      {/* ------------------------------------------------------------- */}
      {isCompleted && (
        <div className="bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-black border border-emerald-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Project Completed &amp; Verified</h3>
                <p className="text-xs text-emerald-400/80">Tamper-proof engineering evidence generated and stamped to your portfolio.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsEvidenceDrawerOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs inline-flex items-center gap-2 transition-all"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-400" /> View Evidence Dossier
              </button>
              {studentProject?.student_id && (
                <Link
                  href={`/portfolio/${studentProject.student_id}`}
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs inline-flex items-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> View Public Portfolio
                </Link>
              )}
              <Link
                href="/dashboard/career"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" /> View Career X-Ray
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-xs text-white/50 block">Code Quality Score</span>
              <strong className="text-xl font-black text-[#FF7A00] mt-1 block">
                {latestVerification?.quality_score || 90}/100
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-xs text-white/50 block">Technical Defense</span>
              <strong className="text-xl font-black text-purple-400 mt-1 block">
                {defenses[0]?.score || 85}/100 (PASSED)
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-xs text-white/50 block">XP Awarded</span>
              <strong className="text-xl font-black text-amber-400 mt-1 block">+850 XP</strong>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Current Objective & Next Action Guidance Card */}
      {/* ------------------------------------------------------------- */}
      {!isCompleted && (
        <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-[#FF7A00]/10 via-neutral-900 to-neutral-900 border border-[#FF7A00]/30 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FF7A00] text-black">
              Current Objective
            </span>
            <span className="text-xs text-white/60 font-semibold">What to do next:</span>
          </div>

          <div>
            <h3 className="text-base font-extrabold text-white">
              {isDefenseActive || isVerified
                ? 'Pass Your Technical Defense Interview'
                : isNeedsRevision
                ? 'Address Reviewer Feedback & Resubmit Repository'
                : milestones.every((m: any) => m.student_status === 'completed')
                ? 'Submit Your Public GitHub Repository for Automated Verification'
                : (() => {
                    const activeM = milestones.find((m: any) => m.student_status !== 'completed');
                    const activeT = activeM?.tasks?.find((t: any) => t.student_status !== 'completed');
                    return activeT ? `Execute Task: ${activeT.title}` : `Complete Milestone: ${activeM?.title || 'Current Milestone'}`;
                  })()}
            </h3>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">
              {isDefenseActive || isVerified
                ? 'Placely has verified your code structure. Now defend your architecture and engineering tradeoffs to complete the project.'
                : isNeedsRevision
                ? latestVerification?.feedback || 'Update your codebase to satisfy all criteria and submit your GitHub URL below.'
                : milestones.every((m: any) => m.student_status === 'completed')
                ? 'All milestone tasks are finished! Submit your public repository URL below to trigger automated code & deployment verification.'
                : (() => {
                    const activeM = milestones.find((m: any) => m.student_status !== 'completed');
                    const activeT = activeM?.tasks?.find((t: any) => t.student_status !== 'completed');
                    return activeT ? activeT.instruction : 'Complete all required milestone tasks sequentially.';
                  })()}
            </p>
          </div>
        </div>
      )}

      {/* Workspace Navigation Switcher (Milestones vs Learning Blueprint) */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('milestones')}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'milestones'
                  ? 'bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/25'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Engineering Execution ({milestones.length} Milestones)</span>
            </button>

            <button
              onClick={() => setActiveTab('learning')}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'learning'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>
                Learning Blueprint ({(projectData.learning_topics || []).length} Topics)
              </span>
            </button>
          </div>

          <span className="text-xs text-white/40 font-mono hidden sm:inline">
            {activeTab === 'milestones' ? 'Execute tasks sequentially' : 'Master foundational mental models'}
          </span>
        </div>

        {/* Tab 1: Engineering Execution Stepper */}
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <ProjectMilestoneStepper
              studentProjectId={studentProject?.id}
              milestones={milestones}
              onStateUpdated={loadData}
              onSelectConcept={(concept) => {
                setActiveConceptFilter(concept);
                setActiveTab('learning');
              }}
            />
          </div>
        )}

        {/* Tab 2: Learning Blueprint & Mental Models */}
        {activeTab === 'learning' && (
          <div className="space-y-4">
            <ProjectLearningBlueprint
              projectId={projectData.id || projectIdOrSpId}
              topics={projectData.learning_topics || []}
              activeConceptFilter={activeConceptFilter}
              onClearFilter={() => setActiveConceptFilter(null)}
            />
          </div>
        )}
      </div>

      {/* Layered Verification & Submission Section (Only if not completed or verifying) */}
      {!isCompleted && (
        <div id="submission-section" className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Project Evidence &amp; Verification</h3>
                <p className="text-xs text-white/50">Submit your public GitHub repository to trigger automated review and unlock defense.</p>
              </div>
            </div>

            {verifications.length > 0 && (
              <button
                onClick={() => setIsEvidenceDrawerOpen(true)}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
              >
                <FileCheck2 className="w-3.5 h-3.5" /> Evidence History
              </button>
            )}
          </div>

          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Verification Status Card */}
          {latestVerification && (
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isVerified ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">Verification Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {isDefenseActive ? 'DEFENSE ACTIVE (READY TO INTERVIEW)' : isVerified ? 'VERIFIED (READY FOR DEFENSE)' : 'REVISION REQUIRED'}
                </span>
              </div>

              {latestVerification.quality_score && (
                <div className="text-sm font-semibold text-white">
                  Automated Quality Score: <strong className="text-[#FF7A00]">{latestVerification.quality_score}/100</strong>
                </div>
              )}

              {latestVerification.feedback && (
                <p className="text-xs text-white/70 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                  {latestVerification.feedback}
                </p>
              )}
            </div>
          )}

          {/* Submission Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">GitHub Repository URL *</label>
              <input
                type="text"
                placeholder="https://github.com/your-username/project-repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF7A00]/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Live Demo URL (Optional)</label>
              <input
                type="text"
                placeholder="https://my-app.vercel.app"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF7A00]/50"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleSubmitForVerification}
              disabled={submitting || !githubUrl.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-bold text-sm shadow-lg shadow-[#FF7A00]/25 transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isNeedsRevision ? 'Resubmit for Verification' : 'Submit for Verification'}
            </button>

            {isVerified && (
              <button
                onClick={() => setIsDefenseOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all"
              >
                <Shield className="w-4 h-4" />
                {isDefenseActive ? 'Resume Technical Defense' : 'Start Technical Defense'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Defense Modal */}
      {studentProject?.id && (
        <ProjectDefenseModal
          studentProjectId={studentProject.id}
          isOpen={isDefenseOpen}
          onClose={() => setIsDefenseOpen(false)}
          onDefenseCompleted={loadData}
        />
      )}

      {/* Evidence History Drawer */}
      <ProjectEvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        studentProject={studentProject}
        project={projectData}
        verifications={verifications}
        defenses={defenses}
      />
    </main>
  );
}
