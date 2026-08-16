'use client';

import React, { useState } from 'react';

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'https://placely-backend-production.up.railway.app';

export function LogOutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('placely_token') || localStorage.getItem('token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Explicit backend logout call to revoke server session and clear Railway HttpOnly cookie
      await fetch(`${BACKEND}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers,
      }).catch(() => {});
    } catch {
      // ignore network errors on logout
    }

    // Clear all local cookies across all paths
    document.cookie = 'placely_student_id=; max-age=0; path=/; SameSite=Lax';
    document.cookie = 'placely_token=; max-age=0; path=/; SameSite=Lax';
    document.cookie = 'placely_session=; max-age=0; path=/; SameSite=Lax';

    // Clear all local and session storage
    try {
      localStorage.removeItem('student_id');
      localStorage.removeItem('token');
      localStorage.removeItem('placely_student_id');
      localStorage.removeItem('placely_token');
      sessionStorage.clear();
    } catch {
      // ignore
    }

    // Redirect cleanly to the public commercial landing page
    window.location.href = '/index.html';
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 font-semibold text-sm transition-all disabled:opacity-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {isLoggingOut ? 'Logging out...' : 'Log Out'}
    </button>
  );
}
