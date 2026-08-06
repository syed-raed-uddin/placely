import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

    const res = await fetch(`${API_BASE}/chat/mark-complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        // Dev bypass headers if needed by backend
        'x-dev-student-id': body.student_id || cookieStore.get('placely_student_id')?.value || '',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || `Backend returned ${res.status}` },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy mark-complete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
