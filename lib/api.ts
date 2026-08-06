import { cache } from 'react';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://placely-backend-production.up.railway.app/api';

/**
 * Fetch the full dashboard payload for a student.
 * Wrapped in React.cache() to deduplicate requests across Layouts and Pages during SSR.
 */
export const fetchDashboardData = cache(async (
  studentId: string,
  token?: string,
  cookieHeader?: string,   // full Cookie: header from Next.js cookies()
) => {
  if (!studentId) return null;
  try {
    const headers: Record<string, string> = {
      // Dev-bypass: accepted by require_session() before cookie check
      'x-dev-student-id': studentId,
    };

    // Forward raw session cookie so the backend can validate it too
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    // Also include the token as a Bearer header (accepted by require_session)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/dashboard/${studentId}`, {
      cache: 'no-store',
      headers,
    });

    if (!res.ok) {
      console.error(`Dashboard fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
});
