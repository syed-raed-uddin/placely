import { cache } from 'react';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://placely-backend-production.up.railway.app/api';

/**
 * Generic API Client for Placely Frontend.
 * Handles JSON serialization, authentication injection, and consistent error handling.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  const headers = new Headers(options.headers);
  
  if (options.body && !headers.has('Content-Type') && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  // To forward cookies in SSR, Server Components must explicitly pass them in options.headers
  // Client fetches will automatically include them if credentials: 'include' is set or if same-origin.
  
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = res.statusText;
    try {
      const errJson = await res.json();
      errorDetail = errJson.error || errJson.message || errorDetail;
    } catch (e) {
      // Ignore parse error on failure
    }
    throw new Error(`API Error (${res.status}): ${errorDetail}`);
  }

  try {
    return await res.json() as T;
  } catch (e) {
    throw new Error('Failed to parse API response');
  }
}

export interface DashboardFetchResult {
  data: any | null;
  status: number;
  error?: string;
  isProRequired?: boolean;
}

/**
 * Fetch the full dashboard payload for a student.
 * Wrapped in React.cache() to deduplicate requests across Layouts and Pages during SSR.
 */
export const fetchDashboardData = cache(async (
  studentId: string,
  token?: string,
  cookieHeader?: string,
): Promise<DashboardFetchResult> => {
  if (!studentId) return { data: null, status: 401, error: 'No student ID' };
  try {
    const headers: Record<string, string> = {
      'x-dev-student-id': studentId,
    };

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/dashboard/${studentId}`, {
      cache: 'no-store',
      headers,
    });

    if (!res.ok) {
      console.error(`Dashboard fetch failed: ${res.status} ${res.statusText}`);
      let errorMsg = res.statusText;
      let isProRequired = false;
      try {
        const errJson = await res.json();
        errorMsg = errJson.error || errJson.message || errorMsg;
        if (
          errJson.error === 'PRO_REQUIRED' ||
          (typeof errorMsg === 'string' && errorMsg.includes('PRO_REQUIRED'))
        ) {
          isProRequired = true;
        }
      } catch (_) {}
      return { data: null, status: res.status, error: errorMsg, isProRequired };
    }

    const data = await res.json();
    return { data, status: res.status };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { data: null, status: 0, error: String(error) };
  }
});

/**
 * Fetch the subscription status for a student.
 */
export const fetchSubscriptionStatus = cache(async (
  cookieHeader?: string
) => {
  try {
    const headers: Record<string, string> = {};

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const res = await fetch(`${API_BASE}/subscription`, {
      cache: 'no-store',
      headers,
    });

    if (!res.ok) {
      console.error(`Subscription fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return null;
  }
});
