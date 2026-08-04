export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchDashboardData(studentId: string, token: string | undefined) {
  if (!studentId) return null;
  try {
    const headers: Record<string, string> = {
      'x-dev-student-id': studentId
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/dashboard/${studentId}`, {
      // no-store for now so we see live updates
      cache: 'no-store',
      headers
    });
    if (!res.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching real data:', error);
    return null;
  }
}
