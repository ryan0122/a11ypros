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
  'resource-title': 'Resource Downloaded',
  'resource-url': 'Resource File',
  'post-slug': 'Blog Post',
  'signup-page': 'Signup Page',
  'source-page': 'Submitted on',
  'referred-from': 'Came from',
  'website-url': 'Website to monitor',
  'site-size': 'Site size',
  'issue-tracker': 'Issue tracker',
  'plan-interest': 'Plan interest',
  'newsletter-opt-in': 'Newsletter opt-in',
  'landing-referrer': 'Came to the site from',
  'landing-utm': 'UTM tags',
  'landing-page': 'First page viewed',
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
      subject: `New ${formName} submission from ${email}${data['referred-from'] ? ` (via ${data['referred-from']})` : ''}`,
      text,
    });

    if (error) {
      console.error('[contact] Resend rejected the email:', error);
      return NextResponse.json({ message: 'Form submission failed' }, { status: 502 });
    }

    // Every form adds the email to Resend Contacts. Only newsletter sign-ups and people who
    // tick the opt-in box on other forms also join the RESEND_NEWSLETTER_SEGMENT_ID segment,
    // which Broadcasts are sent to.
    const contactEmail = email.toLowerCase();
    const wantsNewsletter = formName === 'newsletter-signup' || data['newsletter-opt-in'] === 'yes';
    const segmentId = wantsNewsletter ? (process.env.RESEND_NEWSLETTER_SEGMENT_ID || '').trim() : '';
    if (wantsNewsletter && !segmentId) {
      console.warn('[contact] RESEND_NEWSLETTER_SEGMENT_ID is not set; subscriber not added to a segment');
    }
    const firstName = (data['contact-first-name'] || '').trim() || undefined;
    const lastName = (data['contact-last-name'] || '').trim() || undefined;

    try {
      // The SDK returns errors instead of throwing, so check `error` explicitly.
      const { error: contactError } = await resend.contacts.create({
        email: contactEmail,
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
        unsubscribed: false,
        ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
      });
      if (contactError) {
        // Usually the contact already exists (an earlier form). Create doesn't touch existing
        // contacts, so add the segment separately.
        console.warn('[contact] Resend did not create the contact:', contactError);
        if (segmentId) {
          const { error: segmentError } = await resend.contacts.segments.add({ email: contactEmail, segmentId });
          if (segmentError) console.warn('[contact] Could not add contact to segment:', segmentError);
        }
      }
    } catch (err) {
      console.warn('[contact] Could not add contact to Resend Contacts:', err);
    }

    // If this is a gated resource download, also email a copy of the download link to the requester.
    if (formName === 'resource-download' && data['resource-url']) {
      const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com';
      const downloadUrl = data['resource-url'].startsWith('http')
        ? data['resource-url']
        : `${siteUrl}${data['resource-url']}`;
      const resourceTitle = data['resource-title'] || 'Accessibility Resource';

      await resend.emails
        .send({
          from,
          to: [email],
          replyTo: inbox.split(',')[0].trim(),
          subject: `Your download: ${resourceTitle} - A11Y Pros`,
          text: [
            `Hi there,`,
            `Thanks for downloading the ${resourceTitle} from A11Y Pros!`,
            `You can download your file anytime at the link below:\n${downloadUrl}`,
            `Need help auditing or remediating your organization's presentations, PDFs, or web applications for WCAG 2.1/2.2 AA compliance? Reply directly to this email or get in touch at ${siteUrl}/contact-us.`,
            `— The A11Y Pros Team\n${siteUrl}`,
          ].join('\n\n'),
        })
        .catch((err) => {
          console.warn('[contact] Could not send resource copy to user:', err);
        });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] Error sending email:', error);
    return NextResponse.json({ message: 'Form submission failed' }, { status: 500 });
  }
}
