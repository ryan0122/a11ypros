// Where a visitor came from, recorded on the first page of their visit and sent with every
// lead form so the lead email says e.g. "Came to the site from: chatgpt.com". Kept in
// sessionStorage (this tab's visit only), and only the referrer's host is kept, never its path
// or query string.

const STORAGE_KEY = 'a11ypros-lead-source'

type LeadSource = Record<'landing-referrer' | 'landing-utm' | 'landing-page', string>

export function captureLeadSource() {
    try {
        if (sessionStorage.getItem(STORAGE_KEY)) return

        let referrer = ''
        if (document.referrer) {
            const host = new URL(document.referrer).host
            if (host && host !== window.location.host) referrer = host
        }

        const params = new URLSearchParams(window.location.search)
        const utm = ['utm_source', 'utm_medium', 'utm_campaign']
            .map((key) => params.get(key)?.slice(0, 100))
            .filter(Boolean)
            .join(' / ')

        const source: LeadSource = {
            'landing-referrer': referrer || 'none (direct, or the app sent no referrer)',
            'landing-utm': utm,
            'landing-page': window.location.pathname,
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(source))
    } catch {
        // Storage blocked or a malformed referrer: lead source is nice to have, never required.
    }
}

export function getLeadSourceFields(): Partial<LeadSource> {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY)
        return stored ? (JSON.parse(stored) as LeadSource) : {}
    } catch {
        return {}
    }
}
