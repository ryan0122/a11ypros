import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Human-readable labels for the fields the site's forms send.
const FIELD_LABELS: Record<string, string> = {
  'contact-first-name': 'First name',
  'contact-last-name': 'Last name',
  'organization-name': 'Organization',
  'contact-email': 'Email',
  'contact-phone': 'Phone',
  'contact-message': 'Message',
  email: 'Email',
  url: 'Website URL',
  'scanned-url': 'Scanned URL',
};

const IGNORED_FIELDS = new Set(['form-name', 'bot-field']);

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.LEAD_INBOX;
  // Must be an address on the domain verified in Resend. Resend's test sender
  // (onboarding@resend.dev) only delivers to the account owner, so there is no fallback.
  const from = process.env.RESEND_FROM;

  if (!apiKey || !inbox || !from) {
    console.error('[contact] RESEND_API_KEY, LEAD_INBOX or RESEND_FROM is not configured');
    return NextResponse.json({ message: 'Form submission is not configured' }, { status: 500 });
  }

  // Only string fields are kept, so a malformed body can't crash the handler.
  const data: Record<string, string> = {};
  try {
    if ((request.headers.get('content-type') || '').includes('application/json')) {
      const json: unknown = await request.json();
      if (!json || typeof json !== 'object' || Array.isArray(json)) {
        return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
      }
      Object.entries(json).forEach(([key, value]) => {
        if (typeof value === 'string') data[key] = value;
      });
    } else {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (typeof value === 'string') data[key] = value;
      });
    }
  } catch {
    return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't retry.
  if (data['bot-field']) {
    return NextResponse.json({ ok: true });
  }

  const email = (data['contact-email'] || data.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'A valid email address is required' }, { status: 400 });
  }

  const formName = data['form-name'] || 'contact';
  const text = Object.entries(data)
    .filter(([key, value]) => !IGNORED_FIELDS.has(key) && value.trim())
    .map(([key, value]) => `${FIELD_LABELS[key] || key}: ${value}`)
    .join('\n\n');

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: inbox.split(',').map((address) => address.trim()),
      replyTo: email,
      subject: `New ${formName} submission from ${email}`,
      text,
    });

    if (error) {
      console.error('[contact] Resend rejected the email:', error);
      return NextResponse.json({ message: 'Form submission failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] Error sending email:', error);
    return NextResponse.json({ message: 'Form submission failed' }, { status: 500 });
  }
}
