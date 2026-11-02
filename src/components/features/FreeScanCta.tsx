import Link from 'next/link'
import { ArrowRight, ScanSearch } from 'lucide-react'

type Variant = 'card' | 'sidebar' | 'banner'

interface FreeScanCtaProps {
    variant?: Variant
    /** Pick the level that fits the page's heading outline. */
    headingLevel?: 'h2' | 'h3'
}

const COPY: Record<Variant, { heading: string; body: string; button: string }> = {
    card: {
        heading: 'How accessible is your website?',
        body: 'Run a free scan of any page against WCAG 2.2 AA. We test it at desktop and mobile sizes, navigate it with only a keyboard, and email you a prioritized report in minutes.',
        button: 'Run a free scan',
    },
    sidebar: {
        heading: 'Free accessibility scan',
        body: 'Check one page against WCAG 2.2 AA, including keyboard navigation. Results by email in minutes.',
        button: 'Scan a page',
    },
    banner: {
        heading: 'Not ready for an audit? Start with a free scan',
        body: 'Scan any page against WCAG 2.2 AA and get a prioritized report by email. A full audit adds the manual and screen reader testing automated tools can’t do.',
        button: 'Run a free scan',
    },
}

// Points visitors at the free scan (/free-accessibility-scan) from articles, compliance pages and pricing.
export default function FreeScanCta({ variant = 'card', headingLevel = 'h2' }: FreeScanCtaProps) {
    const Heading = headingLevel
    const { heading, body, button } = COPY[variant]

    if (variant === 'sidebar') {
        return (
            <div className="space-y-3 rounded-2xl border border-[#0E8168]/40 bg-[#0E8168]/5 p-6 shadow-sm">
                <Heading className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <ScanSearch aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0E8168]" />
                    {heading}
                </Heading>
                <p className="text-xs leading-relaxed text-slate-600">{body}</p>
                <Link
                    href="/free-accessibility-scan"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E8168] px-4 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#0a6b57]"
                >
                    {button} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
            </div>
        )
    }

    return (
        <div
            className={`flex flex-col gap-6 rounded-2xl border p-8 sm:flex-row sm:items-center sm:justify-between ${
                variant === 'banner' ? 'border-[#0E8168]/40 bg-[#0E8168]/5' : 'border-slate-200 bg-slate-50'
            }`}
        >
            <div className="space-y-2">
                <Heading className="flex items-center gap-2 text-xl font-bold text-slate-900">
                    <ScanSearch aria-hidden="true" className="h-6 w-6 shrink-0 text-[#0E8168]" />
                    {heading}
                </Heading>
                <p className="max-w-xl text-sm leading-relaxed text-slate-700">{body}</p>
            </div>
            <Link
                href="/free-accessibility-scan"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0E8168] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0a6b57]"
            >
                {button} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
        </div>
    )
}
