import type { Metadata } from 'next'
import Link from 'next/link'
import {
    ShieldAlert,
    AlertTriangle,
    Search,
    Hammer,
    FileText,
    ArrowRight,
    Receipt,
    Scale,
    Zap,
} from 'lucide-react'
import Button from '@/components/forms/Button'

export const metadata: Metadata = {
    title: 'ADA Website Compliance & Litigation Protection | A11Y Pros',
    description:
        'Shield your business from rising ADA Title III website lawsuits in 2026. Get expert accessibility audits, code-level remediation, WCAG 2.1 AA compliance, and formal VPAT/ACR certification to avoid demand letters and costly settlements.',
    keywords:
        'ADA website compliance, ADA Title III lawsuits, WCAG 2.1 AA, website accessibility audit, ADA demand letter defense, VPAT authoring, accessibility remediation, ADA litigation protection, WCAG compliance services, disabled access credit, IRS Form 8826',
}

const roadmapSteps = [
    {
        step: '01',
        title: 'Accessibility Audit & Remediation Roadmap',
        icon: <Search className="w-6 h-6" aria-hidden="true" />,
        what: 'We perform deep-dive manual and automated testing on the unique templates and functional states of your site using a combination of browsers, devices and screen readers (Windows, OSX, iPhone, Android, VoiceOver, NVDA, JAWS, TalkBack).',
        goal: "This audit produces a comprehensive WCAG 2.1 AA conformance report documenting every accessibility barrier across your site, prioritized by severity and mapped to specific success criteria. The deliverable is a formal Remediation Roadmap your attorney can present as evidence of a good-faith compliance effort.",
    },
    {
        step: '02',
        title: 'Remediation (The Fix)',
        icon: <Hammer className="w-6 h-6" aria-hidden="true" />,
        what: 'Based on the audit findings and the detailed remediation roadmap we deliver, we begin fixing your site at the code level. This includes custom component updates for complex templates, structural code changes for deeper issues, and targeted adjustments for content barriers; all prioritized by legal risk and WCAG severity',
        goal: 'Resolve accessibility barriers efficiently and permanently, focusing budget on the highest-risk issues first. All fixes are implemented directly in the source code (never via overlays or automated patches) to eliminate root causes and provide lasting compliance and defense against ADA claims.',
    },
    {
        step: '03',
        title: 'Verification & Formal VPAT/ACR',
        icon: <FileText className="w-6 h-6" aria-hidden="true" />,
        what: 'Once fixes are live, we re-test the site to verify they work.We then author and deliver your formal VPAT 2.5 / ACR document, detailing conformance to WCAG 2.1 Level AA. This includes comprehensive documentation of any remaining issues, their legal risk, and the steps taken to address them.',
        goal: "This is your 'Certificate of Compliance'—a legal document that proves your site meets WCAG 2.1 AA standards and provides your final layer of legal defense.",
    },
]

export default function ADALitigationSupport() {
    return (
        <main id="main-content" tabIndex={-1}>
            {/* ── Hero ── */}
            <section
                aria-labelledby="hero-heading"
                className="relative overflow-hidden pt-24 pb-32 text-white bg-[#001d2f]"
            >
                {/* Decorative background icon — hidden from assistive tech */}
                <Scale
                    aria-hidden="true"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-[720px] h-[720px] text-white opacity-[0.04] pointer-events-none select-none"
                />
                <div className="max-w-6xl mx-auto px-6 relative">
                    <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 bg-[#0E8168] text-[#fff]">
                        <ShieldAlert size={14} aria-hidden="true" />
                        Litigation Defense &amp; Remediation
                    </p>

                    <h1
                        id="hero-heading"
                        className="text-5xl md:text-7xl font-black tracking-tight mb-8 max-w-4xl leading-[1.1]"
                    >
                        ADA Website Compliance for Title III Lawsuits.
                    </h1>
                    <p className="text-xl text-white max-w-2xl mb-4 leading-relaxed">
                        Small businesses face ADA Title III lawsuits every day, often with
                        little warning and no clear path forward. A11Y Pros is here to help
                        you understand your options and get compliant with confidence.
                    </p>

                    <p className="text-xl text-white max-w-2xl mb-12 leading-relaxed">
                        From accessibility auditing to code-level remediation, we
                        provide the technical shield your business needs to
                        survive Title III litigation.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="#contactForm"
                            className="px-10 py-5 rounded-xl font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 bg-[#0E8168] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                           Talk to an Expert Today{' '}
                            <ArrowRight size={20} aria-hidden="true" />
                        </Link>
                        <Link
                            href="#roadmap"
                            className="px-10 py-5 rounded-xl font-bold text-lg border-2 border-[#ccd2d5] transition-all hover:bg-white/10 flex items-center justify-center gap-2 text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            View the Process
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Threat ── */}
            <section
                aria-labelledby="litigation-heading"
                className="max-w-5xl mx-auto px-6 py-20"
            >
                <h2
                    id="litigation-heading"
                    className="text-4xl font-bold mb-6"
                >
                    The Rising Threat of{' '}
                    <span className="text-[#b02027]">ADA Website Litigation</span>
                </h2>
                <p className="text-lg text-gray-700 mb-10 leading-relaxed ">
                    Aggressive litigators use automated scanners to target thousands of
                    businesses a month. If your site has keyboard traps, missing labels, poor contrast, or other accessibility issues, you are a target. Settlements average{' '}
                    <strong>$15,000–$50,000</strong> plus your own legal fees and
                    most businesses have no plan when the demand letter arrives.
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 list-none p-0 mb-16">
                    {[
                        'Demand letters often arrive with a 10-day response window, leaving little time to act.',
                        'Aggressive litigators file hundreds of cases per month using automated scanning tools.',
                        `Most businesses don't budget for this — by the time a demand arrives, options are limited.`,
                    ].map((item) => (
                        <li
                            key={item}
                            className="flex gap-3 p-5 rounded-2xl bg-red-50 border border-red-100"
                        >
                            <AlertTriangle
                                size={20}
                                className="text-[#b02027] flex-shrink-0 mt-0.5"
                                aria-hidden="true"
                            />
                            <span className="text-sm font-semibold leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>

                {/* ── Cost of Reacting Too Late ── */}
                <h3 className="text-2xl text-center font-black tracking-tight mb-6 text-[#b02027]">
                    The Escalating Cost of Reacting Too Late
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {[
                        {
                            heading: 'Repeat Lawsuits Are the New Normal',
                            body: 'Over 1,400 businesses faced multiple ADA claims in 2025 alone — even after previous settlements. One quick fix rarely ends the cycle; plaintiffs return when issues reappear or new barriers emerge.',
                            sub: 'Hidden ongoing exposure: $20k–$100k+ in cumulative legal and remediation costs across repeat filings.',
                            citation: {
                                url: 'https://accessiblemindstech.com/ada-web-lawsuits-2026-insights-from-2025-filings/',
                                label: 'Accessible Minds Tech: ADA Lawsuit Trends',
                            },
                        },
                        {
                            heading: 'Hidden Demand Letters Add Up Fast',
                            body: 'Pre-lawsuit demand letters go largely untracked each year — used to pressure businesses into quick private settlements that never appear in court records.',
                            sub: 'Attorney fees, settlement payouts, and remediation work frequently cost more than the original demand itself.',
                            citation: {
                                url: 'https://www.ecomback.com/ada-website-lawsuits-recap-report/2025-mid-year-ada-website-lawsuit-report',
                                label: 'EcomBack: ADA Lawsuit Recap Report',
                            },
                        },
                        {
                            heading: 'Industry & Geographic Hotspots Amplify Risk',
                            body: 'E-commerce sites captured 70% of cases in 2025, while states like New York, Florida, California, and rising areas (e.g., Illinois up 746% YoY) drive filings. Overlay widgets failed in 22%+ of targeted sites.',
                            sub: 'Businesses in high-risk sectors or states face 30–50% higher average exposure.',
                            citation: {
                                url: 'https://darroweverett.com/ada-website-accessibility-litigation-insights-legal-analysis/',
                                label: 'Darrow Everett: ADA Litigation Insights',
                            },
                        },
                    ].map((card) => (
                        <div
                            key={card.heading}
                            className="flex flex-col gap-3 p-6 rounded-2xl bg-[#001d2f] text-white"
                        >
                            <h4 className="text-sm font-black uppercase tracking-widest text-[#d4e300] leading-snug">
                                {card.heading}
                            </h4>
                            <p className="text text-white leading-relaxed">{card.body}</p>
                            <p className="text-sm font-bold text-white border-t border-gray-700 pt-3 mt-auto leading-relaxed">
                                {card.sub}
                            </p>
                            {card.citation && (
                                <a
                                    href={card.citation.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-[#d4e300] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4e300] mt-1"
                                >
                                    {card.citation.label}
                                    <span className="sr-only"> (opens in a new tab)</span>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
                <div className="p-6 rounded-2xl bg-[#7a1519] text-white mb-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest mb-1">
                            Estimated Total Exposure
                        </p>
                        <p className="text-white max-w-md">
                           Including repeats, hidden demands, rush fixes, and fees with 4,000+ total filings in 2024 and 2025 on pace to exceed 5,000, up 37% year-over-year.
                        </p>
                        
                    </div>
                    <div className='text-right w-2/5 flex-shrink-0'>
                    <p className="text-5xl font-black font-mono flex-shrink-0">$50,000+</p>
                    <small className='line-clamp-2 mt-2'>Estimated based on average settlement, defense fees, and remediation costs. Actual costs vary by case.</small>
                    </div>
                </div>

                {/* ── Proactive Path ── */}
                {/* <h3 className="text-2xl font-black uppercase tracking-tight mb-6 text-[#0E8168]">
                    The Proactive Path with A11Y Pros
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl">
                    Avoid lawsuits altogether with a structured compliance program —
                    at a fraction of reactive costs. Here&apos;s what we deliver:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 mb-10">
                    {[
                        'WCAG Conformance Audits',
                        'Manual Screen Reader Testing',
                        'Code-Level Remediation',
                        'Formal VPAT/ACR Authoring',
                        
                    ].map((item) => (
                        <li
                            key={item}
                            className="flex items-center gap-3 p-5 rounded-2xl bg-emerald-50 border border-emerald-100"
                        >
                            <CheckCircle
                                size={20}
                                className="text-emerald-600 flex-shrink-0"
                                aria-hidden="true"
                            />
                            <span className="text-sm font-semibold text-gray-800">{item}</span>
                        </li>
                    ))}
                </ul>
                <Button
                    href="/free-consultation"
                    className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-black text-lg shadow-xl transition-all hover:scale-105 bg-[#0E8168] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E8168]"
                >
                    Start Your Audit Now <ArrowRight size={20} aria-hidden="true" />
                </Button> */}
            </section>

            {/* ── 3-Step Compliance Roadmap ── */}
            <section
                id="roadmap"
                aria-labelledby="roadmap-heading"
                className="py-24 bg-[#f0eee4]"
            >
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-16">
                        <h2
                            id="roadmap-heading"
                            className="text-4xl font-black mb-4 uppercase tracking-tight text-center"
                        >
                            The 3-Step Compliance Roadmap
                        </h2>
                        <p className="font-medium">
                            In an era of surging ADA website lawsuits, driven by automated scanners and aggressive plaintiffs, achieving true compliance requires more than quick fixes or overlays. Our proven 3-step roadmap guides you from thorough discovery to permanent remediation and formal documentation, ensuring your site meets WCAG 2.1 Level AA standards, eliminates high-risk barriers, and demonstrates good-faith effort that strengthens your defense against claims.
                        </p>
                    </div>

                    <ol className="space-y-12 list-none p-0 relative">
                        {/* Decorative vertical line — hidden from assistive tech */}
                        <li aria-hidden="true" className="hidden lg:block absolute left-8 top-0 bottom-0 w-1 bg-stone-300 pointer-events-none" />

                        {roadmapSteps.map((s) => (
                            <li
                                key={s.step}
                                className="relative flex flex-col lg:flex-row gap-8 items-start"
                            >
                                <span
                                    aria-hidden="true"
                                    className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg bg-[#0E8168] text-[#fff]"
                                >
                                    {s.step}
                                </span>

                                <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-stone-200 flex-grow">
                                    <h3 className="text-2xl font-bold flex items-center gap-3 mb-6">
                                        <span
                                            className="text-[#0E8168]"
                                            aria-hidden="true"
                                        >
                                            {s.icon}
                                        </span>
                                        {s.title}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                                                What Happens
                                            </h4>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {s.what}
                                            </p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-[#f9f8f2]">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-3 flex items-center gap-2">
                                                <Zap
                                                    size={14}
                                                    aria-hidden="true"
                                                />{' '}
                                                The Goal
                                            </h4>
                                            <p className="text-emerald-900 text-sm font-semibold leading-relaxed">
                                                {s.goal}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ── IRS Tax Credit ── */}
            <section
                id="tax-credit"
                aria-labelledby="tax-credit-heading"
                className="py-24"
            >
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="p-8 md:p-16">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                <div>
                                    <p className="flex items-center gap-2 text-emerald-800 font-black uppercase tracking-widest text-sm mb-2">
                                        <Receipt
                                            size={18}
                                            aria-hidden="true"
                                        />{' '}
                                        Financial Subsidy
                                    </p>
                                    <h2
                                        id="tax-credit-heading"
                                        className="text-4xl font-black leading-tight"
                                    >
                                        The IRS Disabled Access Credit
                                    </h2>
                                </div>
                                <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200 text-center flex-shrink-0">
                                    <span className="block text-xs font-bold text-gray-500 uppercase">
                                        IRS Form
                                    </span>
                                    <span className="text-2xl font-black text-gray-800">
                                        8826
                                    </span>
                                </div>
                            </div>

                            <p className="text-lg text-gray-700 mb-10 leading-relaxed">
                                Small businesses can use federal tax incentives
                                to subsidize these costs via{' '}
                                <strong>IRS Form 8826</strong>. This credit was
                                specifically designed to help businesses offset
                                the expense of making their digital assets
                                accessible.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                {[
                                    {
                                        title: 'Eligibility',
                                        body: 'Gross receipts of $1M or less or less than 30 full-time employees in the preceding year.',
                                    },
                                    {
                                        title: 'The Credit',
                                        body: '50% of eligible expenses above $250, capped at $5,000 per year.',
                                        highlight: '$5,000 per year',
                                    },
                                    {
                                        title: 'Qualified Costs',
                                        body: 'Includes accessibility audits, manual testing, and code remediation.',
                                    },
                                ].map((card) => (
                                    <div
                                        key={card.title}
                                        className="p-6 rounded-2xl bg-stone-50 border border-stone-100"
                                    >
                                        <h3 className="font-bold mb-2 text-gray-900">
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {card.body}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <a
                                    href="https://www.irs.gov/newsroom/tax-benefits-to-help-offset-the-cost-of-making-businesses-accessible-to-people-with-disabilities"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 font-bold underline text-[#0E8168] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E8168]"
                                >
                                    Read official IRS documentation{' '}
                                    <ArrowRight size={16} aria-hidden="true" />
                                    <span className="sr-only">
                                        (opens in a new tab)
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
