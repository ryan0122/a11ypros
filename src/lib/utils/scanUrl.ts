// Validates the website address entered for the free scan. Used by FreeScanForm (to show
// errors before submitting) and /api/scan (so the server never trusts the client). The scan
// worker still does the real safety checks, including resolving the domain.

export type ScanUrlCheck = { ok: true; url: string } | { ok: false; error: string }

const GENERIC = 'Enter a website address like example.com or https://www.example.com/page.'
const TLD = /\.(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i
const LOCAL = /(^|\.)(localhost|local|internal|lan|home\.arpa)$/i

export function checkScanUrl(input: string): ScanUrlCheck {
    const value = input.trim()
    if (!value) return { ok: false, error: 'Enter your website address, for example example.com.' }
    if (value.length > 2048) return { ok: false, error: 'That address is too long.' }
    if (/\s/.test(value)) return { ok: false, error: 'Website addresses can’t contain spaces.' }

    // "example.com:8080" is a host and port, not a scheme; only "x://" or a known non-web scheme counts.
    const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) || /^(javascript|data|mailto|tel|file|about|blob):/i.test(value)
    if (hasScheme && !/^https?:\/\//i.test(value)) {
        return { ok: false, error: 'Enter an address that starts with http:// or https://, or just the domain.' }
    }

    let url: URL
    try {
        url = new URL(hasScheme ? value : `https://${value}`)
    } catch {
        return { ok: false, error: GENERIC }
    }

    const host = url.hostname.toLowerCase()
    if (url.username || url.password) return { ok: false, error: GENERIC }
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[')) {
        return { ok: false, error: 'Enter a domain name, like example.com, not an IP address.' }
    }
    if (LOCAL.test(host)) return { ok: false, error: 'Enter the address of a public website.' }
    if (!TLD.test(host)) return { ok: false, error: GENERIC }
    if (url.port && url.port !== '80' && url.port !== '443') {
        return { ok: false, error: 'Enter the address without a port number.' }
    }
    return { ok: true, url: url.href }
}
