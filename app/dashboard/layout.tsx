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

  const backendData = await fetchDashboardData(studentId, token, cookieHeader);
  const subscriptionData = await fetchSubscriptionStatus(cookieHeader);
  
  // If the backend returns 404 (no active enrollment), redirect them to purchase
  if (!backendData) {
    redirect('/index.html');
  }

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
