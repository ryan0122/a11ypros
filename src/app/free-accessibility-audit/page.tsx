'use client'
import { useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import IconLogo from '@/components/icons/IconLogo'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'

interface ScanIssue {
    code: string;
    message: string;
}

interface ScanData {
    total: number;
    issues: ScanIssue[];
    htmlReport?: string;
    aiReport?: string;
    url?: string;
    disclaimer?: string;
}

// Helper function to extract preview (top 5 issues) from HTML report
const extractTop5Issues = (
    htmlReport: string
): { preview: string; fullReport: string } => {
    if (!htmlReport) return { preview: '', fullReport: htmlReport }

    // Create a temporary DOM parser to extract content
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<div>${htmlReport}</div>`, 'text/html')
    const container = doc.querySelector('div')
    if (!container) return { preview: htmlReport, fullReport: htmlReport }

    // Find the ordered list
    const ol = container.querySelector('ol')
    if (!ol) {
        // No list found, return full report as preview
        return { preview: htmlReport, fullReport: htmlReport }
    }

    // Get all list items
    const listItems = Array.from(ol.querySelectorAll('li'))
    const totalIssues = listItems.length

    // If 5 or fewer issues, show all as preview
    if (totalIssues <= 5) {
        return { preview: htmlReport, fullReport: htmlReport }
    }

    // Get all content before the list
    const beforeList: string[] = []
    let node = ol.previousSibling
    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            beforeList.unshift((node as Element).outerHTML)
        } else if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent?.trim()
        ) {
            beforeList.unshift(`<p>${node.textContent.trim()}</p>`)
        }
        node = node.previousSibling
    }

    // Get all content after the list
    const afterList: string[] = []
    node = ol.nextSibling
    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            afterList.push((node as Element).outerHTML)
        } else if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent?.trim()
        ) {
            afterList.push(`<p>${node.textContent.trim()}</p>`)
        }
        node = node.nextSibling
    }

    // Extract first 5 issues with their details
    // The structure is: <li>...</li> followed by <p>Who it affects:</p>, <p>WCAG rule:</p>, <p>Simple fix:</p>
    const fullOlHtml = ol.outerHTML
    const liMatches = fullOlHtml.match(/<li>[\s\S]*?<\/li>/g)

    if (!liMatches || liMatches.length <= 5) {
        return { preview: htmlReport, fullReport: htmlReport }
    }

    // Find where each issue block ends (after "Simple fix:")
    let previewHtml = ''
    let currentIndex = 0

    for (let i = 0; i < 5; i++) {
        const liHtml = liMatches[i]
        const liStart = fullOlHtml.indexOf(liHtml, currentIndex)
        if (liStart === -1) break

        const afterLi = fullOlHtml.substring(liStart + liHtml.length)
        const pMatches = afterLi.match(/<p>[\s\S]*?<\/p>/g) || []

        // Collect up to 3 detail paragraphs (Who it affects, WCAG rule, Simple fix)
        let detailCount = 0
        let issueBlock = liHtml

        for (const p of pMatches) {
            if (detailCount >= 3) break
            const pText = p.replace(/<[^>]*>/g, '')
            if (
                pText.includes('Who it affects:') ||
                pText.includes('WCAG rule:') ||
                pText.includes('Simple fix:')
            ) {
                issueBlock += p
                detailCount++
                // Update currentIndex to after this paragraph
                const pIndex = afterLi.indexOf(p)
                currentIndex = liStart + liHtml.length + pIndex + p.length
            } else if (detailCount > 0) {
                // We've started collecting details, stop at non-detail content
                break
            }
        }

        previewHtml += issueBlock
    }

    // Build preview with opening <ol> tag and closing </ol> tag
    const olTagMatch = fullOlHtml.match(/<ol[^>]*>/)
    const olOpeningTag = olTagMatch ? olTagMatch[0] : '<ol>'
    const preview =
        beforeList.join('') +
        olOpeningTag +
        previewHtml +
        '</ol>' +
        afterList.join('')

    return {
        preview,
        fullReport: htmlReport,
    }
}

export default function FreeAudit() {
    // DISABLED: Free accessibility scan temporarily disabled to reduce Netlify function usage
    const isDisabled = true;
    
    const [url, setUrl] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<ScanData | null>(null)
    const [error, setError] = useState('')
    const [emailSubmitted, setEmailSubmitted] = useState(false)
    const [showFullResults, setShowFullResults] = useState(false)
    const [submittingEmail, setSubmittingEmail] = useState(false)

    const handleScan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Block scans if disabled
        if (isDisabled) {
            setError('Free accessibility scan is temporarily unavailable. Please contact us for a professional audit.')
            return
        }
        
        setLoading(true)
        setError('')
        setData(null)
        setEmailSubmitted(false)
        setShowFullResults(false)
        setEmail('')

        try {
            // This points to your Netlify function (change name if yours is different)
            const res = await fetch(
                `/.netlify/functions/pa11y-scan?url=${encodeURIComponent(url)}`
            )
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Scan failed')
            setData(json)
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Scan failed')
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Email submission handler to unlock full results
    const handleBookConsult = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email) return

        setSubmittingEmail(true)
        const formData = new FormData()
        formData.append('form-name', 'free-consult')
        formData.append('email', email)
        formData.append('scanned-url', url)

        try {
            const params = new URLSearchParams()
            formData.forEach((value, key) => {
                params.append(key, value.toString())
            })
            
            await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            })
            // Success - unlock full results
            setEmailSubmitted(true)
            setShowFullResults(true)
            // Don't clear email so they can see it was submitted
        } catch {
            setError(
                'Failed to submit email. Please try again or email us directly.'
            )
            setSubmittingEmail(false)
        }
    }

    return (
        <main>
            {/* Hero Section with 2 Columns */}
            <section className="bg-[#001d2f] text-white">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
                    <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-12">
                        {/* Left Column: Logo and Text */}
                        <div className="flex w-full flex-col lg:w-1/2">
                            <Link
                                href="/"
                                className="mb-8 w-36 no-underline hover:no-underline sm:w-56"
                            >
                                <IconLogo />
                                <span className="sr-only">Home</span>
                            </Link>
                            <h1 className="text-xl font-bold leading-tight text-[#d4e300]">
                                ADA Compliance Audits and Accessibility Services
                            </h1>
                            <h2 className="text-5xl">Achieve ADA Compliance</h2>
                        </div>

                        {/* Right Column: Contact Form */}
                        <div className="w-full lg:w-1/2">
                            <div className="rounded-lg bg-white p-6 text-gray-800 lg:p-8">
                                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                    Get Started Today
                                </h2>
                                <p className="mb-6 text-gray-600">
                                    Fill out the form below and we&apos;ll get back
                                    to you within 24 hours.
                                </p>
                                <ContactForm isMainContactForm={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#001d2f] text-white">
                <h2 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
                    Free Website Accessibility Test
                </h2>
                <p className="mb-4 text-lg leading-relaxed opacity-90 lg:text-xl">
                    Find the accessibility issues you need to fix and meet your
                    compliance goals. With a quick automated scan (powered by
                    Pa11y + AI), you&apos;ll get a beautiful, plain-English report in
                    seconds.
                </p>
                <div className="mt-6 rounded-lg border border-sky-700/50 bg-sky-900/30 p-6 text-sm">
                    <p className="mb-2 font-medium">Important:</p>
                    <p className="opacity-90">
                        Automated tools only catch ~30–50% of real issues. A
                        full manual audit with screen readers and real users is
                        required for true WCAG conformance.
                    </p>
                </div>
                <div className="mx-auto max-w-6xl p-8">
                    {isDisabled ? (
                        <div className="rounded-lg border-2 border-yellow-500/50 bg-yellow-900/30 p-8 text-center">
                            <h3 className="mb-4 text-2xl font-bold text-yellow-400">
                                Free Scan Temporarily Unavailable
                            </h3>
                            <p className="mb-6 text-lg opacity-90">
                                The free accessibility scan is temporarily disabled to manage server resources.
                            </p>
                            <p className="mb-6 text-lg opacity-90">
                                For a comprehensive accessibility audit, please{' '}
                                <Link href="/free-consultation" className="text-[#d4e300] underline hover:no-underline">
                                    request a free consultation
                                </Link>
                                {' '}with our certified accessibility experts.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleScan}>
                            <Input
                                label="Web page URL"
                                type="url"
                                placeholder="https://your-site.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                className="w-full rounded-md border-2 px-6 py-4"
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className={`mt-6 w-full rounded-md px-8 py-5 text-xl font-bold uppercase transition-all ${
                                    loading
                                        ? 'cursor-not-allowed bg-gray-500'
                                        : 'bg-[#0E8168] hover:bg-[#0B6652]'
                                }`}
                            >
                                {loading
                                    ? 'Scanning...'
                                    : 'Run Free Accessibility Scan'}
                            </Button>
                        </form>
                    )}

                    <footer className="mt-10 text-center text-sm opacity-80">
                        Powered by Pa11y + Groq AI (Llama 3.1 70B) – 100% free
                        tier
                    </footer>

                    {/* =================== AI REPORT MAGIC =================== */}
                    {data &&
                        (() => {
                            const reportData = data.aiReport
                                ? extractTop5Issues(data.aiReport)
                                : { preview: '', fullReport: '' }
                            const displayReport =
                                emailSubmitted && showFullResults
                                    ? reportData.fullReport
                                    : reportData.preview
                            const hasMoreIssues =
                                data.total > 5 && !emailSubmitted

                            return (
                                <div className="mt-12 overflow-hidden rounded-xl bg-white text-gray-800 shadow-2xl">
                                    <div className="bg-gradient-to-r from-[#0E8168] to-[#0B6652] p-8 text-white">
                                        <h2 className="text-3xl font-bold">
                                            Your AI-Powered Accessibility Report
                                        </h2>
                                        <p className="mt-2 text-lg opacity-90">
                                            Scanned:{' '}
                                            <a
                                                href={data.url}
                                                target="_blank"
                                                rel="noopener"
                                                className="text-white underline"
                                            >
                                                {data.url}
                                            </a>
                                        </p>
                                    </div>

                                    <div className="p-8 pb-12">
                                        {/* Show preview or full report */}
                                        {displayReport ? (
                                            <div
                                                className="prose prose-lg max-w-none whitespace-pre-line leading-relaxed text-gray-700"
                                                dangerouslySetInnerHTML={{
                                                    __html: displayReport,
                                                }}
                                            />
                                        ) : (
                                            <p className="italic text-gray-600">
                                                Generating AI insights…
                                            </p>
                                        )}

                                        {/* Email capture form - show when preview is displayed and there are more issues */}
                                        {hasMoreIssues && !emailSubmitted && (
                                            <div className="mt-10 rounded-lg border-2 border-[#0E8168] bg-gradient-to-br from-green-50 to-blue-50 p-8">
                                                <h3 className="mb-4 text-2xl font-bold text-gray-800">
                                                    See All {data.total} Issues
                                                    + Get Your Free Consultation
                                                </h3>
                                                <p className="mb-6 text-lg text-gray-700">
                                                    Enter your email to unlock
                                                    the complete accessibility
                                                    report and schedule your
                                                    free 30-minute consultation
                                                    with our experts.
                                                </p>
                                                <form
                                                    onSubmit={handleBookConsult}
                                                    className="space-y-4"
                                                >
                                                    <Input
                                                        label="Email Address"
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                        className="w-full rounded-md border-2 border-gray-300 px-6 py-4 text-lg text-black focus:border-[#0E8168] focus:outline-none"
                                                    />
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            submittingEmail
                                                        }
                                                        className={`w-full rounded-md px-8 py-5 text-xl font-bold uppercase transition-all ${
                                                            submittingEmail
                                                                ? 'cursor-not-allowed bg-gray-500'
                                                                : 'bg-[#0E8168] hover:bg-[#0B6652]'
                                                        }`}
                                                    >
                                                        {submittingEmail
                                                            ? 'Submitting...'
                                                            : 'Unlock Full Report & Free Consultation'}
                                                    </Button>
                                                </form>
                                            </div>
                                        )}

                                        {/* Show full results after email submission */}
                                        {emailSubmitted && showFullResults && (
                                            <>
                                                {/* Raw technical issues */}
                                                {data.issues?.length > 0 && (
                                                    <details className="mt-10 cursor-pointer text-sm">
                                                        <summary className="font-semibold text-gray-600">
                                                            View raw technical
                                                            issues ({data.total}
                                                            )
                                                        </summary>
                                                        <ul className="mt-4 space-y-3 text-xs">
                                                            {data.issues.map(
                                                                (
                                                                    i: ScanIssue,
                                                                    idx: number
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="rounded bg-gray-100 p-3 font-mono"
                                                                    >
                                                                        <strong>
                                                                            {
                                                                                i.code
                                                                            }
                                                                        </strong>
                                                                        :{' '}
                                                                        {
                                                                            i.message
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </details>
                                                )}

                                                <hr className="my-10 border-gray-300" />

                                                <p className="italic text-gray-600">
                                                    {data.disclaimer}
                                                </p>

                                                {/* Success message */}
                                                <div className="mt-8 rounded-lg border-2 border-green-200 bg-green-50 p-6">
                                                    <p className="mb-2 text-lg font-semibold text-green-800">
                                                        ✓ Email submitted
                                                        successfully!
                                                    </p>
                                                    <p className="text-green-700">
                                                        We&apos;ll email you at{' '}
                                                        <strong>{email}</strong>{' '}
                                                        to schedule your free
                                                        consultation.
                                                    </p>
                                                </div>

                                                {/* Consultation CTA */}
                                                <div className="mt-10 text-center">
                                                    <Link
                                                        href="/contact"
                                                        className="inline-block transform rounded-lg bg-green-600 px-10 py-5 text-2xl font-bold text-white shadow-lg transition hover:scale-105 hover:bg-green-700"
                                                    >
                                                        Book Your Free 30-Min
                                                        Consultation
                                                    </Link>
                                                </div>
                                            </>
                                        )}

                                        {/* Show email form if no more issues but still want consultation */}
                                        {!hasMoreIssues &&
                                            !emailSubmitted &&
                                            data.total > 0 && (
                                                <div className="mt-10 rounded-lg border-2 border-[#0E8168] bg-gradient-to-br from-green-50 to-blue-50 p-8">
                                                    <h3 className="mb-4 text-2xl font-bold text-gray-800">
                                                        Get Your Free
                                                        Consultation
                                                    </h3>
                                                    <p className="mb-6 text-lg text-gray-700">
                                                        Schedule a free
                                                        30-minute consultation
                                                        to discuss your
                                                        accessibility needs and
                                                        get expert guidance.
                                                    </p>
                                                    <form
                                                        onSubmit={
                                                            handleBookConsult
                                                        }
                                                        className="space-y-4"
                                                    >
                                                        <Input
                                                            label="Email Address"
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            value={email}
                                                            onChange={(e) =>
                                                                setEmail(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            required
                                                            className="w-full rounded-md border-2 border-gray-300 px-6 py-4 text-lg text-black focus:border-[#0E8168] focus:outline-none"
                                                        />
                                                        <Button
                                                            type="submit"
                                                            disabled={
                                                                submittingEmail
                                                            }
                                                            className={`w-full rounded-md px-8 py-5 text-xl font-bold uppercase transition-all ${
                                                                submittingEmail
                                                                    ? 'cursor-not-allowed bg-gray-500'
                                                                    : 'bg-[#0E8168] hover:bg-[#0B6652]'
                                                            }`}
                                                        >
                                                            {submittingEmail
                                                                ? 'Submitting...'
                                                                : 'Get Free Consultation'}
                                                        </Button>
                                                    </form>
                                                </div>
                                            )}

                                        {/* Handle case with 0 issues */}
                                        {data.total === 0 && (
                                            <div className="mt-10 rounded-lg border-2 border-green-200 bg-green-50 p-8">
                                                <p className="mb-4 text-xl font-semibold text-green-800">
                                                    🎉 No automated issues
                                                    found!
                                                </p>
                                                <p className="mb-6 text-gray-700">
                                                    Great start! However,
                                                    automated tools only catch
                                                    ~30–50% of real problems. A
                                                    full manual audit with
                                                    screen readers and real
                                                    users is required for true
                                                    WCAG conformance.
                                                </p>
                                                <form
                                                    onSubmit={handleBookConsult}
                                                    className="space-y-4"
                                                >
                                                    <Input
                                                        label="Email Address"
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                        className="w-full rounded-md border-2 border-gray-300 px-6 py-4 text-lg text-black focus:border-[#0E8168] focus:outline-none"
                                                    />
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            submittingEmail
                                                        }
                                                        className={`w-full rounded-md px-8 py-5 text-xl font-bold uppercase transition-all ${
                                                            submittingEmail
                                                                ? 'cursor-not-allowed bg-gray-500'
                                                                : 'bg-[#0E8168] hover:bg-[#0B6652]'
                                                        }`}
                                                    >
                                                        {submittingEmail
                                                            ? 'Submitting...'
                                                            : 'Get Free Consultation'}
                                                    </Button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })()}

                    {loading && (
                        <div className="mt-12 text-center">
                            <p className="text-xl">
                                Scanning your site and generating your AI
                                report…
                            </p>
                            <p className="mt-4 text-lg opacity-80">
                                This usually takes 15–30 seconds
                            </p>
                        </div>
                    )}

                    {error && (
                        <p className="mt-8 text-red-300">Error: {error}</p>
                    )}
                </div>
            </section>
            <section className="mx-auto max-w-6xl p-8">
                <h2 className="mt-4 text-center text-2xl">
                    What does this accessibility scan do?
                </h2>
                <p>
                    This scan will provide a brief, automated audit of the url
                    you submit. It will check for issues based on WCAG 2.1 AA,
                    the guidelines provided by the W3C which help support the
                    Americans with Disabilities Act, Section 508 and many other
                    accessibility laws and directives.
                </p>
                <p>
                    You’ll receive a few simple bullets, with plain-English
                    descriptions of your accessibility issues and the disability
                    types most impacted. This scan alone is not enough for you
                    to achieve compliance, or ensure barrier-free web
                    experiences for all users. We can assure you that it’s
                    accurate, fast and a good first step in practicing
                    accessibility. We hope you’ll schedule a discovery call with
                    us to help advance your efforts.
                </p>
            </section>
        </main>
    )
}
