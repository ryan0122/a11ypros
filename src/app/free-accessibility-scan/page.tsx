import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowRight,
    CheckCircle2,
    Ear,
    ImageOff,
    Keyboard,
    Layers,
    MailCheck,
    ListChecks,
    Route,
    ScanSearch,
    Smartphone,
    UserCheck,
} from 'lucide-react'
import FreeScanForm from '@/components/features/FreeScanForm'
import Breadcrumbs from '@/components/layout/Breadcrumbs'

const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'
const title = 'Free Website Accessibility Check (WCAG 2.2 AA) - A11Y Pros'
const description =
    'Check a page of your website against WCAG 2.2 AA at desktop and mobile sizes, with keyboard testing. Results by email in minutes.'

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

const STEPS = [
    {
        step: '01',
        title: 'Enter your page',
        body: 'Give us the address of the page you want tested and the email where you want the report.',
        Icon: ScanSearch,
    },
    {
        step: '02',
        title: 'Confirm by email',
        body: 'Select the link we email you. Nothing is checked until you do, and we check only the address you entered.',
        Icon: MailCheck,
    },
    {
        step: '03',
        title: 'Get your report',
        body: 'A prioritized report arrives a few minutes later. It stays available for 30 days.',
        Icon: ListChecks,
    },
]

const CHECKS = [
    {
        title: 'WCAG 2.2 A & AA rules',
        body: 'Automated WCAG 2.0, 2.1 and 2.2 Level A and AA rules, including target size.',
        Icon: CheckCircle2,
    },
    {
        title: 'Keyboard navigation',
        body: 'Focus order, visible focus, keyboard traps and controls a keyboard can’t reach.',
        Icon: Keyboard,
    },
    {
        title: 'Obscured focus',
        body: 'Focus hidden behind sticky headers, chat widgets or cookie banners.',
        Icon: Layers,
    },
    {
        title: 'Reflow & mobile',
        body: 'Content that breaks or scrolls sideways at 400% zoom and on a mobile screen.',
        Icon: Smartphone,
    },
    {
        title: 'Content issues',
        body: 'Problems editors introduce, like image alt text that is just a file name.',
        Icon: ImageOff,
    },
]

const MANUAL = [
    { text: 'How screen readers like JAWS, NVDA and VoiceOver announce your content', Icon: Ear },
    { text: 'Whether alt text, link text and headings actually make sense', Icon: UserCheck },
    { text: 'Captions, audio description and other media alternatives', Icon: CheckCircle2 },
    { text: 'Complete user journeys such as checkout, login and forms', Icon: Route },
]

export default function FreeAccessibilityScanPage() {
    return (
        <div className="bg-white text-slate-900">
            <div className="border-b border-slate-200 bg-slate-50 py-3">
                <div className="mx-auto max-w-6xl px-6">
                    <Breadcrumbs />
                </div>
            </div>

            <main id="main-content" tabIndex={-1}>
                {/* ── Hero + form ── */}
                <section aria-labelledby="scan-heading" className="bg-slate-50 py-12 sm:py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                                <div>
                                    <h1
                                        id="scan-heading"
                                        className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
                                    >
                                        Free website accessibility check
                                    </h1>
                                    <p className="mb-6 text-lg leading-relaxed text-slate-700">
                                        Test a page of your website against WCAG 2.2 Level AA. Our testing engine loads it
                                        in a real browser at desktop and mobile sizes, navigates it with only a
                                        keyboard, and emails you a prioritized report.
                                    </p>
                                    <Image
                                        src="/images/pages/free-accessibility-scan.jpg"
                                        alt=""
                                        width={1376}
                                        height={768}
                                        priority
                                        className="h-auto w-full max-w-md rounded-xl"
                                    />
                                </div>

                                <FreeScanForm />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── How it works ── */}
                <section aria-labelledby="steps-heading" className="py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        <h2 id="steps-heading" className="mb-8 text-center text-3xl font-bold">
                            How the free check works
                        </h2>
                        <ol className="grid gap-6 md:grid-cols-3">
                            {STEPS.map(({ step, title, body, Icon }) => (
                                <li
                                    key={step}
                                    className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0E8168] text-white">
                                            <Icon aria-hidden="true" className="h-6 w-6" />
                                        </span>
                                        <span aria-hidden="true" className="text-3xl font-black text-slate-500">
                                            {step}
                                        </span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold">{title}</h3>
                                    <p className="text-slate-700">{body}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* ── What the check covers ── */}
                <section aria-labelledby="checks-heading" className="border-t border-slate-200 bg-slate-50 py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        <h2 id="checks-heading" className="mb-3 text-center text-3xl font-bold">
                            What the check covers
                        </h2>
                        <p className="mx-auto mb-10 max-w-2xl text-center text-slate-700">
                            More than a rules check: the engine uses the page the way a keyboard user would, at
                            several screen sizes.
                        </p>
                        {/* Flex rather than grid so the odd last row is centered */}
                        <ul className="flex flex-wrap justify-center gap-5">
                            {CHECKS.map(({ title, body, Icon }) => (
                                <li
                                    key={title}
                                    className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:w-[calc(50%-0.625rem)] lg:w-[calc((100%-2.5rem)/3)]"
                                >
                                    {/* Icon beside the heading rather than on its own row above it */}
                                    <div className="mb-2 flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0E8168]/10 text-[#0E8168]">
                                            <Icon aria-hidden="true" className="h-5 w-5" />
                                        </span>
                                        <h3 className="m-0 font-bold">{title}</h3>
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-700">{body}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* ── What needs a person ── */}
                <section aria-labelledby="manual-heading" className="py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="relative overflow-hidden rounded-3xl bg-[#001d2f] p-8 text-white shadow-xl sm:p-12">
                            {/* Decorative background icon, hidden from assistive tech */}
                            <UserCheck
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-16 top-1/2 h-96 w-96 -translate-y-1/2 select-none text-white opacity-[0.04]"
                            />
                            <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
                                <div>
                                    <h2 id="manual-heading" className="mb-4 text-3xl font-bold">
                                        What needs a person
                                    </h2>
                                    <p className="mb-8 text-lg leading-relaxed text-slate-200">
                                        Automated testing finds only part of the possible accessibility issues. An
                                        IAAP-certified specialist tests what tools can’t.
                                    </p>
                                    <Link
                                        href="/contact-us?from=free-accessibility-scan"
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#0E8168] px-8 py-4 font-bold text-white no-underline shadow-lg transition-colors hover:bg-[#0a6b57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    >
                                        Talk to us about a full audit
                                        <ArrowRight aria-hidden="true" className="h-5 w-5" />
                                    </Link>
                                </div>
                                <ul className="space-y-3">
                                    {MANUAL.map(({ text, Icon }) => (
                                        <li
                                            key={text}
                                            className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                                        >
                                            <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#d4e300]" />
                                            <span>{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <p className="mt-10 text-sm text-slate-600">
                            The check is a technical evaluation of one page at the time it runs. It is not legal advice
                            and does not by itself establish conformance with WCAG or any law. We use your email
                            address to send your results and may follow up about our services.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    )
}
