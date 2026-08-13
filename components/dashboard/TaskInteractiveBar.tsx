'use client';

import React, { useState } from 'react';
import { HelpCircle, BrainCircuit } from 'lucide-react';
import QuizModal from '@/components/dashboard/QuizModal';
import TeachBackModal from '@/components/dashboard/TeachBackModal';

interface TaskInteractiveBarProps {
  taskId: string;
  taskTitle: string;
  domain?: string;
  isCompleted?: boolean;
}

export function TaskInteractiveBar({
  taskId,
  taskTitle,
  domain = 'python',
  isCompleted = false,
}: TaskInteractiveBarProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showTeachBack, setShowTeachBack] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <button
        onClick={() => setShowQuiz(true)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 font-semibold text-xs transition-all"
      >
        <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
        <span>Take Knowledge Quiz</span>
      </button>

      <button
        onClick={() => setShowTeachBack(true)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 font-semibold text-xs transition-all"
      >
        <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
        <span>Explain Concept (Teach-Back)</span>
      </button>

      <QuizModal
        domain={domain}
        taskId={taskId}
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
      />

      <TeachBackModal
        conceptSlug={domain}
        conceptTitle={taskTitle}
        isOpen={showTeachBack}
        onClose={() => setShowTeachBack(false)}
      />
    </div>
  );
}
