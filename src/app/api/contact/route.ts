import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const contactUrl = process.env.NEXT_PUBLIC_CONTACT_URL;
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com';

  try {
    const contentType = request.headers.get('content-type') || '';
    const netlifyBody = new URLSearchParams();

    let firstName = '';
    let lastName = '';
    let email = '';
    let phone = '';
    let org = '';
    let message = '';

    if (contentType.includes('application/json')) {
      const json = await request.json();
      firstName = json['contact-first-name'] || '';
      lastName = json['contact-last-name'] || '';
      org = json['organization-name'] || '';
      email = json['contact-email'] || json.email || '';
      phone = json['contact-phone'] || '';
      message = json['contact-message'] || json.message || '';
    } else {
      const formData = await request.formData();
      firstName = (formData.get('contact-first-name') as string) || '';
      lastName = (formData.get('contact-last-name') as string) || '';
      org = (formData.get('organization-name') as string) || '';
      email = (formData.get('contact-email') as string) || (formData.get('email') as string) || '';
      phone = (formData.get('contact-phone') as string) || '';
      message = (formData.get('contact-message') as string) || (formData.get('message') as string) || '';
    }

    // Build Netlify Forms payload
    netlifyBody.append('form-name', 'contact');
    netlifyBody.append('contact-first-name', firstName);
    netlifyBody.append('contact-last-name', lastName);
    netlifyBody.append('organization-name', org);
    netlifyBody.append('contact-email', email);
    netlifyBody.append('contact-phone', phone);
    netlifyBody.append('contact-message', message);

    console.log(`[Form Submission] Forwarding contact submission for ${email} to Netlify Forms...`);

    // Submit to Netlify Forms endpoint
    try {
      const netlifyRes = await fetch(`${siteUrl}/__forms.html`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (compatible; A11yPros/1.0; +https://a11ypros.com)',
        },
        body: netlifyBody.toString(),
        signal: AbortSignal.timeout(6000),
      });

      if (!netlifyRes.ok) {
        console.warn(`Netlify Forms returned status ${netlifyRes.status}, fallback handling...`);
      }
    } catch (netErr) {
      console.warn('Netlify Forms submission skipped/failed:', (netErr as Error).message);
    }

    // Also forward to WordPress Contact Form 7 if contactUrl is defined
    if (contactUrl && contactUrl.includes('http')) {
      try {
        const wpFormData = new FormData();
        wpFormData.append('_wpcf7', '55');
        wpFormData.append('_wpcf7_version', '6.0');
        wpFormData.append('_wpcf7_locale', 'en_US');
        wpFormData.append('_wpcf7_unit_tag', 'wpcf7-f55-o1');
        wpFormData.append('contact-first-name', firstName);
        wpFormData.append('contact-last-name', lastName);
        wpFormData.append('organization-name', org);
        wpFormData.append('contact-email', email);
        wpFormData.append('contact-phone', phone);
        wpFormData.append('contact-message', message);

        const wpRes = await fetch(contactUrl, {
          method: 'POST',
          body: wpFormData,
          signal: AbortSignal.timeout(8000),
        });

        if (wpRes.ok) {
          console.log(`[WordPress CF7] Successfully delivered message for ${email}`);
        } else {
          console.warn(`[WordPress CF7] Returned status ${wpRes.status}`);
        }
      } catch (err) {
        console.warn('WordPress CF7 forward skipped/failed:', (err as Error).message);
      }
    }

    return NextResponse.json({ status: 'mail_sent', message: 'Thank you! Your message has been received.' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { message: 'Form submission failed', error: (error as Error).message },
      { status: 500 }
    );
  }
}
