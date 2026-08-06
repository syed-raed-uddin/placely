import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // Required to prevent caching of streaming response

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

    const res = await fetch(`${API_BASE}/chat/review-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        // Dev bypass headers if needed by backend
        'x-dev-student-id': body.student_id || cookieStore.get('placely_student_id')?.value || '',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: data.error || `Backend returned ${res.status}` },
        { status: res.status }
      );
    }

    // Proxy the Server-Sent Events stream directly back to the client
    return new Response(res.body, {
      status: res.status,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Proxy code-review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
