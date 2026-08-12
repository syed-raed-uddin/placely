import { cookies } from 'next/headers';
import { fetchDashboardData } from '@/lib/api';
import { LogOutButton } from './components';


export default async function SettingsPage() {
  const cookieStore = cookies();
  const studentId = cookieStore.get('placely_student_id')?.value;
  const token = cookieStore.get('placely_token')?.value;

  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dashResult = await fetchDashboardData(studentId!, token, cookieHeader);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backendData: any = dashResult.data;
  const student = backendData?.student || {};
  const skill = backendData?.skill || {};
  const enrollment = backendData?.enrollment || {};

  const profileFields = [
    { icon: 'user', label: 'Full Name', value: student.name || 'Not set' },
    { icon: 'mail', label: 'Email', value: student.email || 'Not set' },
    { icon: 'book', label: 'Course Track', value: skill.name || 'Not set' },
    { icon: 'calendar', label: 'Enrolled On', value: enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set' },
    { icon: 'award', label: 'Current Day', value: enrollment.current_day ? `Day ${enrollment.current_day} of ${skill.total_days || '—'}` : 'Not started' },
  ];

  return (
    <main className="max-w-3xl mx-auto p-4 md:p-8 pb-16 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Account</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-white/50 text-sm">Your profile and account information</p>
      </div>

      {/* Avatar + Name Card */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF7A00] to-amber-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-[#FF7A00]/20 shrink-0">
          {(student.name || 'S').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{student.name || 'Student'}</h2>
          <p className="text-white/50 text-sm">{skill.name || 'Placely Student'}</p>
          <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Active
          </span>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="font-bold text-white text-sm">Profile Information</h3>
        </div>
        <div className="divide-y divide-white/5">
          {profileFields.map((field, idx) => (
            <div key={idx} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-white/50">{field.label}</span>
              <span className="text-sm font-semibold text-white text-right max-w-[60%] truncate">{field.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
        <div>
          <h3 className="font-bold text-white text-sm">Session</h3>
          <p className="text-xs text-white/40 mt-1">Logging out will clear your session and return you to the home page.</p>
        </div>
        <LogOutButton />
      </div>
    </main>
  );
}
