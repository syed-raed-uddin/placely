'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

export const Navbar: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { user, notifications } = dashboardData;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/10 px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Placely Logo */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-9 h-9 bg-[#FF7A00] rounded-xl flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-[#FF7A00]/20">
            P
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden sm:inline-block">
            Placely
          </span>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <a href="/dashboard" className="px-4 py-2 rounded-xl text-sm font-semibold text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00] transition-colors">
            Dashboard
          </a>
          <a href="/legacy-dashboard.html?tab=roadmap" className="px-4 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            Roadmap
          </a>
          <a href="/legacy-dashboard.html?tab=projects" className="px-4 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            Projects
          </a>
          <a href="/legacy-dashboard.html?tab=mentor" className="px-4 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            AI Mentor
          </a>
          <a href="/legacy-dashboard.html?tab=settings" className="px-4 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            Settings
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search topics, tasks, roadmaps..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FF7A00]/50 focus:ring-1 focus:ring-[#FF7A00]/50 transition-all"
              readOnly
            />
          </div>
        </div>

        {/* Notifications & User Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="relative p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#FF7A00] text-white text-[10px] font-bold rounded-full border border-[#0A0A0A]">
                {notifications.unreadCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF7A00] to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-md cursor-pointer ring-2 ring-white/10">
              {user.initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
