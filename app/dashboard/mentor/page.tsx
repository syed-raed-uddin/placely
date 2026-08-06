'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, CornerDownRight } from 'lucide-react';

// Correct endpoint: /api/chat/message (not /api/mentor/chat)
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://placely-backend-production.up.railway.app/api';

const SUGGESTED_QUESTIONS = [
  "What should I focus on today?",
  "Explain my current topic simply",
  "Give me a practice problem",
  "How do I improve my weak areas?",
  "Am I on track for placement?",
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm **Kiro**, your AI Placement Mentor 🚀\n\nI'm here to help you with your coding journey, mock interviews, system design, and placement strategy. What's on your mind today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const studentId =
          getCookie('placely_student_id') ||
          (typeof localStorage !== 'undefined' ? localStorage.getItem('student_id') : '') ||
          '';
        const token =
          getCookie('placely_token') ||
          (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '') ||
          '';
  
        const res = await fetch(`${API_BASE}/chat/history`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'x-dev-student-id': studentId,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            // Merge welcome message with loaded history
            const loadedMessages = data.messages.map((m: any, i: number) => ({
              id: `hist-${i}`,
              role: m.role === 'student' ? 'user' : 'assistant', // Map backend 'kiro'/'student' to 'assistant'/'user'
              content: m.content,
              timestamp: new Date(m.created_at || Date.now()),
            }));
            setMessages(prev => [prev[0], ...loadedMessages]);
          }
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    }
    fetchHistory();
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: new Date() },
    ]);

    try {
      const studentId =
        getCookie('placely_student_id') ||
        (typeof localStorage !== 'undefined' ? localStorage.getItem('student_id') : '') ||
        '';
      const token =
        getCookie('placely_token') ||
        (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '') ||
        '';

      // Correct endpoint: POST /api/chat/message
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        credentials: 'include', // include session cookie
        headers: {
          'Content-Type': 'application/json',
          'x-dev-student-id': studentId,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: text.trim(),
          student_id: studentId,
          ...(conversationId ? { conversation_id: conversationId } : {}),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `API error: ${res.status}`);
      }

      // The backend streams SSE: data: {"text": "..."}\n\n  ...  data: [DONE]
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.slice(5).trim();
          if (!dataStr || dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            // Backend sends {"text": "..."} chunks
            const chunk = parsed.text || parsed.chunk || parsed.reply || '';
            fullText += chunk;
          } catch {
            // Not JSON — treat as raw text chunk
            fullText += dataStr;
          }

          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
          );
        }
      }

      // If we got a non-streaming JSON response (fallback)
      if (!fullText) {
        try {
          const text2 = await res.text();
          const parsed = JSON.parse(text2);
          fullText = parsed.reply || parsed.text || parsed.message || '';
        } catch { /* ignore */ }
      }

      if (!fullText) {
        fullText = "I'm having trouble responding right now. Please try again!";
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
      );

    } catch (err) {
      console.error('Mentor chat error:', err);
      const errorMsg =
        err instanceof Error && err.message.includes('401')
          ? "Session expired. Please refresh the page and log in again."
          : "Sorry, I couldn't connect right now. Please try again!";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: errorMsg } : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Render bold markdown (**text**)
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <main
      className="max-w-4xl mx-auto p-4 md:p-8 pb-4 flex flex-col"
      style={{ height: 'calc(100vh - 68px)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF7A00] to-amber-400 p-0.5 shadow-lg shadow-[#FF7A00]/20">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center text-[#FF7A00]">
              <Bot className="w-6 h-6" />
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0A0A0A] rounded-full" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Kiro — AI Mentor</h1>
          <p className="text-xs text-emerald-400 font-medium">● Online · 24/7 Placement Advisor</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mb-1 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-tr from-[#FF7A00] to-amber-400'
                    : 'bg-white/10 border border-white/10'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-[#FF7A00]" />
                )}
              </div>

              <div
                className={`max-w-[80%] space-y-1 flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#FF7A00] text-white rounded-br-sm'
                      : 'bg-white/8 border border-white/10 text-white/90 rounded-bl-sm'
                  }`}
                >
                  {msg.content === '' && isStreaming ? (
                    <div className="flex items-center gap-1.5 py-0.5">
                      <span className="w-1.5 h-1.5 bg-[#FF7A00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#FF7A00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#FF7A00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{renderContent(msg.content)}</p>
                  )}
                </div>
                <span className="text-[10px] text-white/30 px-1">{formatTime(msg.timestamp)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions (shown only at start) */}
      {messages.length <= 1 && (
        <div className="shrink-0 my-4">
          <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" /> Quick Questions
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:border-[#FF7A00]/60 hover:text-[#FF7A00] hover:bg-[#FF7A00]/5 transition-all"
              >
                <CornerDownRight className="w-3 h-3 text-[#FF7A00]/60" />
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="shrink-0 mt-3 flex items-end gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-[#FF7A00]/50 transition-colors">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Kiro anything..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-white placeholder-white/40 resize-none focus:outline-none leading-relaxed max-h-32"
          style={{ minHeight: '24px' }}
        />
        <button
          type="button"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isStreaming}
          className="shrink-0 w-9 h-9 rounded-xl bg-[#FF7A00] flex items-center justify-center text-white transition-all hover:bg-[#FF7A00]/90 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
          {isStreaming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="text-[10px] text-white/20 text-center mt-2 shrink-0">
        Press Enter to send · Shift+Enter for new line
      </p>
    </main>
  );
}
