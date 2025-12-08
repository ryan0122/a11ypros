import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const vtigerUrl = 'https://sales.a11ypros.com/modules/Webforms/capture.php';

    // Get form data from the request
    const formData = await request.formData();

    // Extract values from form data
    const firstname = formData.get('contact-first-name') as string | null;
    const lastname = formData.get('contact-last-name') as string | null;
    const email = formData.get('contact-email') as string | null;
    const phone = formData.get('contact-phone') as string | null;
    const description = formData.get('contact-message') as string | null;
    const organization = formData.get('organization-name') as string | null;

    // Debug: Log received values
    console.log('Received form data:', {
      firstname,
      lastname,
      email,
      phone,
      description: description?.substring(0, 50),
      organization,
    });

    // Create FormData for vtiger submission
    const vtigerFormData = new FormData();

    // Required hidden fields
    vtigerFormData.append('__vtrftk', 'sid:0e1327504a35b77f6448400aa4847f2a63847518,1764936501');
    vtigerFormData.append('publicid', 'f63888e2ce24715a9872f15474da03a8');
    vtigerFormData.append('urlencodeenable', '1');
    vtigerFormData.append('name', 'Landing page consultation');

    // Map form fields according to vtiger webforms reference fields
    // Only send fields with actual values (trim whitespace to avoid sending "0" defaults)
    
    // Required fields: firstname, lastname, email
    if (firstname && firstname.trim()) {
      vtigerFormData.append('firstname', firstname.trim());
    }
    if (lastname && lastname.trim()) {
      vtigerFormData.append('lastname', lastname.trim());
    }
    if (email && email.trim()) {
      vtigerFormData.append('email', email.trim());
    }
    
    // Optional fields
    if (phone && phone.trim()) {
      vtigerFormData.append('phone', phone.trim());
    }
    if (description && description.trim()) {
      vtigerFormData.append('description', description.trim());
    }
    
    // Organization Name maps to account_id in vtiger webforms
    // The account_id "11x0" appears to be a default placeholder
    // If organization name is provided, try sending it as accountname
    // vtiger may auto-create/link the account based on this
    vtigerFormData.append('account_id', '11x0');
    
    if (organization && organization.trim()) {
      // Try sending organization name - vtiger may accept this to create/link account
      vtigerFormData.append('accountname', organization.trim());
    }

    // Debug: Log what we're sending to vtiger
    const sentFields: Record<string, string> = {};
    vtigerFormData.forEach((value, key) => {
      sentFields[key] = value.toString().substring(0, 100);
    });
    console.log('Sending to vtiger:', sentFields);

    // Submit to vtiger
    const res = await fetch(vtigerUrl, {
      method: 'POST',
      body: vtigerFormData,
      // Don't set Content-Type header - fetch will set it with boundary for multipart/form-data
    });

    if (!res.ok) {
      // Log but don't break the user flow
      const errorText = await res.text();
      console.error('vtiger form error', res.status, errorText.substring(0, 500));
      return NextResponse.json(
        { message: 'vtiger submission failed', error: errorText.substring(0, 200) },
        { status: res.status }
      );
    }

    // vtiger might return HTML or JSON, we don't need to parse it
    return NextResponse.json({ success: true });
  } catch (error) {
    // Log but don't break the user flow
    console.error('Error submitting to vtiger:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error submitting to vtiger', error: errorMessage },
      { status: 500 }
    );
  }
}

