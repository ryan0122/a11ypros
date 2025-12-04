export async function submitToHubSpot(formData: FormData) {
	const portalId = process.env.NEXT_PUBLIC_HS_PORTAL_ID!;
	const formGuid = process.env.NEXT_PUBLIC_HS_FORM_GUID!;
	const url = `https://forms.hubspot.com/uploads/form/v2/${portalId}/${formGuid}`;
  
	// Pull values from your existing FormData keys.
	// Adjust the keys on the right (e.g. 'your-email', 'your-name') to match your actual CF7 field names.
	const email = formData.get('your-email') as string | null;
	const name = formData.get('your-name') as string | null;
	const message = formData.get('your-message') as string | null;
  
	// Split name if you want first/last, otherwise just map to firstname.
	const [firstname] = (name || '').split(' ');
  
	const payload = {
	  fields: [
		email && { name: 'email', value: email },
		firstname && { name: 'firstname', value: firstname },
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