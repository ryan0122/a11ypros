import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Clock, Mail, ScanSearch } from 'lucide-react'
import FreeScanForm from '@/components/features/FreeScanForm'
import Breadcrumbs from '@/components/layout/Breadcrumbs'

const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'
const title = 'Free Website Accessibility Scan (WCAG 2.2 AA) - A11Y Pros'
const description =
    'Scan a page of your website against WCAG 2.2 AA at desktop and mobile sizes, with keyboard testing. Results by email in minutes.'

export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title,
        description,
        type: 'website',
        url: `${siteUrl}/free-accessibility-scan`,
        images: [{ url: `${siteUrl}/og_banner.jpg`, alt: 'A11Y Pros Logo', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `${siteUrl}/free-accessibility-scan` },
}

const CHECKS = [
    'Automated WCAG 2.0, 2.1 and 2.2 Level A and AA rules, including target size',
    'Keyboard navigation: focus order, visible focus, keyboard traps and controls a keyboard can’t reach',
    'Focus hidden behind sticky headers, chat widgets or cookie banners',
    'Reflow at 400% zoom and on a mobile screen',
    'Content issues editors introduce, like image alt text that is just a file name',
]

const MANUAL = [
    'How screen readers like JAWS, NVDA and VoiceOver announce your content',
    'Whether alt text, link text and headings actually make sense',
    'Captions, audio description and other media alternatives',
    'Complete user journeys such as checkout, login and forms',
]

export default function FreeAccessibilityScanPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="border-b border-slate-200 bg-white py-3">
                <div className="mx-auto max-w-5xl px-6">
                    <Breadcrumbs />
                </div>
            </div>

            <main id="main-content" tabIndex={-1} className="py-12">
                <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-2 lg:items-start">
                    <div>
                        <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                            Free website accessibility scan
                        </h1>
                        <p className="mb-6 text-lg leading-relaxed text-slate-700">
                            Test a page of your website against WCAG 2.2 Level AA. Our scan engine loads it in a real
                            browser at desktop and mobile sizes, navigates it with only a keyboard, and emails you a
                            prioritized report.
                        </p>
                        <ol className="space-y-3 text-slate-700">
                            <li className="flex gap-3">
                                <ScanSearch aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0E8168]" />
                                <span>Enter the page you want tested and your email address.</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0E8168]" />
                                <span>Confirm with the link we email you. Nothing is scanned until you do.</span>
                            </li>
                            <li className="flex gap-3">
                                <Clock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0E8168]" />
                                <span>Get your report by email a few minutes later. It stays available for 30 days.</span>
                            </li>
                        </ol>
                    </div>

                    <FreeScanForm />
                </div>

                <div className="mx-auto mt-16 grid max-w-5xl gap-10 px-6 md:grid-cols-2">
                    <section aria-labelledby="checks-heading">
                        <h2 id="checks-heading" className="mb-4 text-2xl font-bold">
                            What the scan checks
                        </h2>
                        <ul className="space-y-3 text-slate-700">
                            {CHECKS.map((item) => (
                                <li key={item} className="flex gap-3">
                                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0E8168]" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="manual-heading">
                        <h2 id="manual-heading" className="mb-4 text-2xl font-bold">
                            What needs a person
                        </h2>
                        <p className="mb-4 text-slate-700">
                            Automated testing finds only part of the possible accessibility issues. An IAAP-certified
                            specialist tests what tools can’t:
                        </p>
                        <ul className="mb-6 list-disc space-y-2 pl-5 text-slate-700">
                            {MANUAL.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <Link
                            href="/contact"
                            className="inline-block rounded-lg border-2 border-[#0E8168] px-6 py-3 font-bold text-[#0E8168] transition-colors hover:bg-[#0E8168] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E8168]"
                        >
                            Talk to us about a full audit
                        </Link>
                    </section>
                </div>

                <p className="mx-auto mt-16 max-w-5xl px-6 text-sm text-slate-600">
                    The scan is a technical evaluation of one page at the time it runs. It is not legal advice and does
                    not by itself establish conformance with WCAG or any law. We use your email address to send your
                    results and may follow up about our services.
                </p>
            </main>
        </div>
    )
}
