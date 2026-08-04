export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Currently hardcoding student_id for demonstration until real auth is integrated in Next.js
export const DEMO_STUDENT_ID = 'e8ecf855-2015-4c00-b503-4f92313b2bbc';

export async function fetchDashboardData(studentId = DEMO_STUDENT_ID) {
  try {
    const res = await fetch(`${API_BASE}/dashboard/${studentId}`, {
      // no-store for now so we see live updates
      cache: 'no-store',
      headers: {
        'x-dev-student-id': studentId
      }
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
