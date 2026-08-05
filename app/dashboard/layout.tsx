import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchDashboardData } from '@/lib/api';
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

  const backendData = await fetchDashboardData(studentId, token);
  const realData = mapBackendToDashboard(backendData);

  return (
    <DashboardProvider initialData={realData}>
      <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF7A00]/30 selection:text-[#FF7A00]">
        <Navbar />
        {children}
      </div>
    </DashboardProvider>
  );
}
