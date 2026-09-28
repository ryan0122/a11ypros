// Stores a copy of a form submission in the Netlify Forms dashboard.
// Resend (via /api/contact) is what notifies us and decides success;
// this is fire-and-forget so a Netlify failure never blocks a lead.
// `fields` must include `form-name` matching a form in public/__forms.html.
export function recordNetlifySubmission(fields: Record<string, string>) {
	fetch('/__forms.html', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams(fields).toString(),
	}).catch((error) => {
		console.warn('Netlify Forms submission failed:', error)
	})
}
