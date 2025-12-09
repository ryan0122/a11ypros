export async function submitToVtiger(formData: FormData) {
	try {
		// Use Next.js API route to proxy the request (bypasses CORS)
		const res = await fetch('/api/vtiger', {
			method: 'POST',
			body: formData,
		});

		if (!res.ok) {
			// Log but don't break the user flow
			const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
			console.error('vtiger form error', res.status, errorData);
		}
	} catch (error) {
		// Log but don't break the user flow
		console.error('Error submitting to vtiger:', error);
	}
}

