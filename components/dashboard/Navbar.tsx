'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Menu, X, LayoutDashboard, Map, FolderGit2, Bot, Settings } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/roadmap', label: 'Roadmap', icon: Map, exact: false },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderGit2, exact: false },
  { href: '/dashboard/mentor', label: 'AI Mentor', icon: Bot, exact: false },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, exact: false },
];

export const Navbar: React.FC = () => {
  const { data: dashboardData } = useDashboard();
  const { user, notifications } = dashboardData;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (link: typeof NAV_LINKS[0]) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/10 px-4 md:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-[#FF7A00] rounded-xl flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-[#FF7A00]/20">
              P
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden sm:inline-block">
              Placely
            </span>
          </Link>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]/60'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
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

          {/* Right Side */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
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

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-72 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl py-2 px-2 z-50">
                  <div className="p-3 border-b border-white/10 mb-2">
                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                  </div>
                  <div className="px-2 py-4 text-center">
                    <p className="text-xs text-white/60 mb-4">Stay updated on your placement journey.</p>
                    <button
                      onClick={() => {
                        if ('Notification' in window) {
                          Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                              alert('Notifications enabled!');
                            }
                          });
                        } else {
                          alert('Your browser does not support notifications.');
                        }
                        setShowNotifications(false);
                      }}
                      className="w-full py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#FF7A00]/20"
                    >
                      Enable Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <Link href="/dashboard/settings">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF7A00] to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-md cursor-pointer ring-2 ring-white/10 hover:ring-[#FF7A00]/60 transition-all">
                  {user.initials}
                </div>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl flex flex-col pt-20 px-6 pb-8 gap-2">
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all ${
                  active
                    ? 'text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]/40'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Navbar;
