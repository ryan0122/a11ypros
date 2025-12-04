export async function submitToHubSpot(formData: FormData) {
	const portalId = process.env.NEXT_PUBLIC_HS_PORTAL_ID!;
	const formGuid = process.env.NEXT_PUBLIC_HS_FORM_GUID!;
	const url = `https://forms.hubspot.com/uploads/form/v2/${portalId}/${formGuid}`;
  
	// Pull values from your existing FormData keys.
	// Adjust the keys on the right (e.g. 'your-email', 'your-name') to match your actual CF7 field names.
	const email = formData.get('contact-email') as string | null;
	const firstname = formData.get('contact-first-name') as string | null;
	const lastname = formData.get('contact-last-name') as string | null;
	const organization = formData.get('organization-name') as string | null;
	const phone = formData.get('contact-phone') as string | null;
	const message = formData.get('your-message') as string | null;
  
  
	const payload = {
	  fields: [
		email && { name: 'email', value: email },
		firstname && { name: 'firstname', value: firstname },
		lastname && { name: 'lastname', value: lastname },
		organization && { name: 'company', value: organization },
		phone && { name: 'phone', value: phone },
		message && { name: 'message', value: message },
	  ].filter(Boolean),
	  context: {
		pageUri: window.location.href,
		pageName: document.title,
		// hutk: getHubSpotCookieSomehow() // optional
	  },
	};
  
	const res = await fetch(url, {
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json' },
	  body: JSON.stringify(payload),
	});
  
	if (!res.ok) {
	  // Log but don't break the user flow
	  console.error('HubSpot form error', res.status, await res.text());
	}
  }