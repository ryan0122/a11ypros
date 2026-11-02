import { NextRequest, NextResponse } from 'next/server';
import { checkScanUrl } from '@/lib/utils/scanUrl';

// Proxies free scan requests to the A11Y Pros scan worker (the a11y-engine repo, on Fly.io).
// The worker validates the URL, rate-limits, emails a confirmation link and runs the scan,
// so this route only keeps the shared secret off the client.

const WORKER_TIMEOUT_MS = 9000;

function workerConfig() {
  const url = process.env.SCAN_WORKER_URL?.replace(/\/+$/, '');
  const secret = process.env.SCAN_API_SECRET;
  return url && secret ? { url, secret } : null;
}

// The worker stops when idle and takes a few seconds to start. The scan page calls this
// on load so the worker is awake by the time the form is submitted.
export async function GET() {
  const worker = workerConfig();
  if (!worker) return NextResponse.json({ ok: false }, { status: 503 });
  try {
    const res = await fetch(`${worker.url}/health`, { signal: AbortSignal.timeout(WORKER_TIMEOUT_MS) });
    return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 503 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const worker = workerConfig();
  if (!worker) {
    console.error('[scan] SCAN_WORKER_URL or SCAN_API_SECRET is not configured');
    return NextResponse.json({ message: 'The free accessibility check is not available right now.' }, { status: 503 });
  }

  let data: Record<string, unknown>;
  try {
    const json: unknown = await request.json();
    if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error('not an object');
    data = json as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't retry.
  if (data['bot-field']) {
    return NextResponse.json({ ok: true });
  }

  const checked = checkScanUrl(typeof data.url === 'string' ? data.url : '');
  if (!checked.ok) {
    return NextResponse.json({ message: checked.error }, { status: 400 });
  }
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (!email) {
    return NextResponse.json({ message: 'Enter your email address.' }, { status: 400 });
  }

  // Netlify sets x-nf-client-connection-ip; x-forwarded-for is the fallback elsewhere.
  const ip =
    request.headers.get('x-nf-client-connection-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  try {
    const res = await fetch(`${worker.url}/scans`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${worker.secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: checked.url, email, ip, subscribe: data.subscribe === true }),
      signal: AbortSignal.timeout(WORKER_TIMEOUT_MS),
    });
    if (res.ok) return NextResponse.json({ ok: true });

    // 400 (bad or private URL, bad email) and 429 (rate limit) messages are written for the visitor.
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if ((res.status === 400 || res.status === 429) && body.error) {
      return NextResponse.json({ message: body.error }, { status: res.status });
    }
    console.error(`[scan] worker responded ${res.status}`);
  } catch (error) {
    console.error('[scan] could not reach the scan worker:', error);
  }
  return NextResponse.json(
    { message: 'We could not start your check. Please try again in a minute.' },
    { status: 502 },
  );
}
