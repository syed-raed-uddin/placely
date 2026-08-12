import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchDashboardData, fetchSubscriptionStatus } from '@/lib/api';
import { mapBackendToDashboard } from '@/lib/mapBackendToDashboard';
import { DashboardProvider } from '@/components/dashboard/DashboardProvider';
import Navbar from '@/components/dashboard/Navbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const studentId = cookieStore.get('placely_student_id')?.value;
  const token = cookieStore.get('placely_token')?.value;

  if (!studentId) {
    redirect('/index.html');
  }

  // Build the full Cookie header to forward to the backend
  // This lets the backend's require_session() validate the placely_session cookie
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const result = await fetchDashboardData(studentId, token, cookieHeader);
  const { data: backendData, status, error: errorMsg, isProRequired } = result;
  
  // Explicit HTTP status handling:
  // 401: Session unauthenticated or expired -> redirect to login
  if (status === 401) {
    redirect('/index.html?login=1');
  }

  // 403: Distinguish identity/session mismatch vs PRO_REQUIRED feature access
  if (status === 403) {
    if (!isProRequired) {
      // Identity or student ownership mismatch -> redirect to login
      redirect('/index.html?login=1');
    }
    // If isProRequired is true, DO NOT redirect to login!
    // The session is valid; preserving session lets ProGate render the ₹499/mo upgrade CTA.
  }

  // 404: Student has no active enrollment -> redirect to purchase/onboarding
  if (status === 404) {
    redirect('/index.html');
  }

  // 500+ / 0 (Network error): Server issue -> render app/dashboard/error.tsx (NO redirect)
  if (status >= 500 || status === 0 || (!backendData && !isProRequired)) {
    throw new Error(errorMsg || `Backend server unavailable (HTTP ${status})`);
  }

  const subscriptionData = await fetchSubscriptionStatus(cookieHeader);

  const realData = mapBackendToDashboard(backendData);
  realData.isPro = subscriptionData?.is_pro || false;

  return (
    <DashboardProvider initialData={realData}>
      <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white selection:bg-[#FF7A00]/30 selection:text-[#FF7A00]">
        <Navbar />
        {children}
      </div>
    </DashboardProvider>
  );
}
