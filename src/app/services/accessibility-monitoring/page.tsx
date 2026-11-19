import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import FAQAccordion from '@/components/ui/FaqAccordion'
import {
    ArrowRight,
    Keyboard,
    PanelsTopLeft,
    MonitorSmartphone,
    Cookie,
    Layers,
    UserCheck,
    Radar,
    ClipboardCheck,
    LayoutDashboard,
    FileText,
    Check,
} from 'lucide-react'
import StudioPlans from '@/components/ui/StudioPlans'

export const metadata: Metadata = {
    title: 'A11Y Studio: Accessibility Monitoring with Specialist Review | A11Y Pros',
    description:
        'Weekly accessibility scans that use your site like a keyboard user would, reviewed by a certified specialist, tracked in A11Y Studio. Plans from $499/month.',
    alternates: { canonical: '/services/accessibility-monitoring' },
}

const steps = [
    {
        icon: Radar,
        title: 'We scan your site every week',
        body: 'The scan reads your sitemap and follows your links to find your pages, then tests them the way people do: on desktop and mobile, with a keyboard, zoomed in and in high contrast. Each scan is compared with the last one.',
    },
    {
        icon: UserCheck,
        title: 'A specialist reviews what it finds',
        body: 'Clear failures go straight to your list. Anything the scan can’t be sure about goes to an IAAP-certified specialist, who confirms or dismisses it before you see it.',
    },
    {
        icon: LayoutDashboard,
        title: 'Your team works from A11Y Studio',
        body: 'Every issue with the affected pages, screenshots and how to fix it. Mark what you’re working on, and the next scan confirms the fixes it can check.',
    },
    {
        icon: FileText,
        title: 'You get a signed monthly report',
        body: 'What changed, what’s still open and what was fixed, signed by your specialist. A record you can share with leadership and procurement.',
    },
]

const differences = [
    {
        icon: Keyboard,
        title: 'Uses your site with a keyboard',
        body: 'Tabs through every page to catch focus that disappears or hides behind sticky headers, keyboard traps, buttons you can’t reach and broken skip links. Reports include a numbered focus-order map.',
    },
    {
        icon: PanelsTopLeft,
        title: 'Opens the menus, dialogs and forms',
        body: 'Checks that Escape works, that focus moves into a dialog and back, that menus don’t need a mouse and that form errors are announced. It never submits anything.',
    },
    {
        icon: MonitorSmartphone,
        title: 'Tests eight real-world conditions',
        body: 'Desktop, 200% and 400% zoom, mobile portrait and landscape on Safari’s engine, Windows High Contrast, reduced motion and increased text spacing.',
    },
    {
        icon: Cookie,
        title: 'Handles real websites',
        body: 'Checks whether cookie banners and chat widgets cover focused controls, dismisses banners the way an auditor would, and labels third-party and ad content as such.',
    },
    {
        icon: Layers,
        title: 'Problems, not a pile of errors',
        body: 'Issues are grouped by cause, so one template bug is one issue, and ranked Critical to Low by the impact on people. Each comes with a plain-language fix and the WCAG criteria.',
    },
    {
        icon: ClipboardCheck,
        title: 'Checked by a person',
        body: 'Confirmed failures are kept separate from items that need a human eye, and a specialist reviews those before you see them. Reports say plainly what automation can’t judge.',
    },
]

const studioFeatures = [
    'Every issue in one list, filtered by site, severity and what’s new since the last scan',
    'Issues that come back after a fix are flagged, so regressions don’t slip through',
    'Ask your specialist to check a fix, review a finding or answer a question, right from the issue',
    'Send issues to GitHub, Jira or Azure DevOps with the details, affected pages and a link back, or download any scan as a CSV',
    'Email updates when a scan finds new issues, confirms fixes, or a report is ready, and each person chooses which they get',
    'Your whole team, with owner, member and viewer roles',
    'Your logo on your reports',
]

const scannerAlone = [
    {
        title: 'A certified specialist on every plan',
        body: 'Anything the scan can’t be sure about is reviewed by an IAAP-certified specialist before it reaches your list, and you can ask them to check a fix or answer a question.',
    },
    {
        title: 'A signed monthly report',
        body: 'What changed, what’s open and what was fixed, signed by your specialist, for leadership and procurement.',
    },
    {
        title: 'A scan that uses the page',
        body: 'Keyboard testing, menus and dialogs opened, forms checked for errors, on desktop and mobile, not just a read of the code.',
    },
    {
        title: 'Hands-on screen reader testing',
        body: 'Assurance Pro and Partner include keyboard and screen reader spot-checks by a specialist, with video.',
    },
    {
        title: 'No overlay, nothing installed',
        body: 'There’s no widget or badge on your site. We find the problems and help your team fix them in the code.',
    },
]

const faqs = [
    {
        question: 'Does monitoring replace a manual audit?',
        answer: 'No. Automated testing can’t judge everything WCAG asks for, such as whether alt text is accurate or a page makes sense with a screen reader. Monitoring keeps watch between audits and catches new problems as your site changes. Pairing a manual audit with a plan covers both, and Assurance Pro and Partner include hands-on keyboard and screen reader testing.',
    },
    {
        question: 'Does the scan test with a screen reader?',
        answer: 'No. The scan doesn’t run a screen reader such as JAWS, NVDA or VoiceOver. It checks the code screen readers rely on, like labels, roles, states and live regions, but it can’t hear what a screen reader actually says or judge whether that makes sense. That takes an IAAP-certified specialist testing by hand. Assurance Pro includes a screen reader spot-check every quarter and Partner every month, each with video. On any plan, you can book specialist time or a full manual audit.',
    },
    {
        question: 'What are review credits?',
        answer: 'Credits pay for your specialist’s time on your requests. Asking them to check a fix or review a finding uses 1 credit, and a question uses 2. Fixes the scan can verify on its own are free. When credits run out, new requests wait until next month’s credits arrive or you add more. You’re never billed for extra requests automatically.',
    },
    {
        question: 'How many pages does the scan test?',
        answer: 'The scan finds up to your plan’s page limit from your sitemap and links, then groups the pages by template, such as article, product or program pages. It runs a full test on one page of each template and on every priority page you name. Pages built from the same template share the same code, so a problem found once is usually on all of them, and that’s how the issue is reported. Testing one page per template in eight conditions goes deeper than testing every page once.',
    },
    {
        question: 'What do you need from us to start?',
        answer: 'A short call to agree on the site and pages to cover, and written authorization to scan your site. We only scan sites we’re authorized to. Onboarding includes the baseline review that later scans compare against.',
    },
    {
        question: 'Do you use an overlay or add anything to our site?',
        answer: 'No. Nothing is installed on your site and there’s no overlay or badge. We find the problems and help your team fix them in the code.',
    },
    {
        question: 'Can colleges and government agencies pay by invoice?',
        answer: 'Yes. We invoice with PO numbers and net terms, and annual prepayment lowers the monthly price.',
    },
]

export default function AccessibilityMonitoring() {
    return (
        <main id="main-content" tabIndex={-1} className="font-[family-name:var(--font-inter)] bg-white text-slate-900">
            {/* Hero */}
            <section aria-labelledby="hero-heading" className="bg-[#001d2f] text-white overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
                    <div>
                        <p className="flex items-center gap-3 mb-5">
                            <Image src="/images/a11y-studio-emblem.png" alt="" width={48} height={48} className="w-12 h-12" />
                            <span className="text-sm font-bold uppercase tracking-widest text-emerald-300">A11Y Studio by A11Y Pros</span>
                        </p>
                        <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
                            Accessibility monitoring, checked by a specialist
                        </h1>
                        <p className="text-lg text-slate-200 leading-relaxed mb-8">
                            Most accessibility checkers read your code. We use your site the way people with disabilities do, then a certified specialist checks the results. Your team tracks every issue to a fix in A11Y Studio.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="#plans"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0E8168] px-6 py-3.5 font-bold text-white hover:bg-[#0a6b57] transition-colors"
                            >
                                See plans and pricing <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </Link>
                            <Link
                                href="/contact-us?from=studio-page"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors"
                            >
                                Talk to us about monitoring
                            </Link>
                        </div>
                    </div>
                    <StudioExample />
                </div>
            </section>

            {/* How it works */}
            <section aria-labelledby="how-heading" className="py-16 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 id="how-heading" className="text-2xl sm:text-3xl font-extrabold mb-10 text-center">
                        How it works
                    </h2>
                    <div className="rounded-2xl border-2 border-[#0E8168] bg-white p-6 sm:p-8 mb-10 grid gap-6 md:grid-cols-3 md:items-center">
                        <div className="md:col-span-2">
                            <p className="mt-0 text-sm font-bold uppercase tracking-wider text-[#0a6b57] mb-2">Recommended first step</p>
                            <h3 className="mt-0 text-xl sm:text-2xl font-bold mb-3">Start with a full manual audit</h3>
                            <p className="text-slate-700 leading-relaxed">
                                A manual audit tests what no scan can judge, such as screen reader announcements, alt text and whether pages make sense, and gives your team the full list to fix. Add a VPAT® / ACR if you need one for procurement. Once those fixes are in, monitoring keeps watch as your site changes, so new problems don’t build up until the next audit.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/services/wcag-compliance-auditing"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 transition-colors"
                            >
                                Manual WCAG audits <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Link>
                            <Link
                                href="/services/vpat-acr-authoring"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                VPAT® / ACR authoring
                            </Link>
                        </div>
                    </div>
                    <h3 className="mt-0 text-lg font-bold text-slate-700 text-center mb-6">Then, every week and every month</h3>
                    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
                        {steps.map((step, i) => (
                            <li key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E8168]/10 text-[#0E8168]">
                                        <step.icon className="w-5 h-5" aria-hidden="true" />
                                    </span>
                                    <span className="text-sm font-bold text-slate-600">Step {i + 1}</span>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                                <p className="text-sm text-slate-700 leading-relaxed">{step.body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* What sets it apart */}
            <section aria-labelledby="different-heading" className="py-16 bg-slate-50 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center mb-10">
                        <h2 id="different-heading" className="text-2xl sm:text-3xl font-extrabold mb-3">
                            What the scan does that most checkers don’t
                        </h2>
                        <p className="text-slate-700 text-lg">
                            Code rules catch some problems. Many of the barriers people actually hit only show up when you use the page.
                        </p>
                    </div>
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
                        {differences.map((d) => (
                            <li key={d.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <d.icon className="w-7 h-7 text-[#0E8168] mb-3" aria-hidden="true" />
                                <h3 className="font-bold text-lg mb-2">{d.title}</h3>
                                <p className="text-sm text-slate-700 leading-relaxed">{d.body}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Inside Studio */}
            <section aria-labelledby="studio-heading" className="py-16 border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 id="studio-heading" className="text-2xl sm:text-3xl font-extrabold mb-3">
                        Inside A11Y Studio
                    </h2>
                    <p className="text-lg text-slate-700 mb-6">
                        A11Y Studio is where your team and your specialist work together. No spreadsheets passed around by email.
                    </p>
                    <ul className="grid gap-3 sm:grid-cols-2" role="list">
                        {studioFeatures.map((f) => (
                            <li key={f} className="flex gap-3 rounded-xl border border-slate-200 p-4 text-slate-700">
                                <ClipboardCheck className="w-5 h-5 text-[#0E8168] shrink-0 mt-0.5" aria-hidden="true" />
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Plans */}
            <div className="py-16 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6">
                    <section aria-labelledby="scanner-alone-heading" className="mb-14">
                        <h2 id="scanner-alone-heading" className="text-2xl sm:text-3xl font-extrabold mb-3 text-center">
                            What you get that a scanner alone doesn’t
                        </h2>
                        <p className="text-slate-700 text-lg text-center max-w-3xl mx-auto mb-8">
                            Every plan pairs the scan with a person who checks its work.
                        </p>
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5" role="list">
                            {scannerAlone.map((item) => (
                                <li key={item.title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <Check className="w-6 h-6 text-[#0E8168] mb-2" aria-hidden="true" />
                                    <h3 className="mt-0 font-bold text-base mb-2">{item.title}</h3>
                                    <p className="m-0 text-sm text-slate-700 leading-relaxed">{item.body}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <StudioPlans />
                </div>
            </div>

            {/* FAQ: the site-wide accordion, so it matches every other FAQ */}
            <div className="border-b border-slate-200">
                <FAQAccordion title="A11Y Studio Monitoring FAQs" faqs={faqs} />
            </div>

            {/* Closing CTA */}
            <section aria-labelledby="cta-heading" className="py-16 bg-[#001d2f] text-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 id="cta-heading" className="text-2xl sm:text-3xl font-extrabold mb-3">
                        Not sure where your site stands?
                    </h2>
                    <p className="text-lg text-slate-200 mb-8">
                        Start with a free check of one page, or talk to us about monitoring your whole site.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/free-accessibility-scan"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#0E8168] px-6 py-3.5 font-bold text-white hover:bg-[#0a6b57] transition-colors"
                        >
                            Free accessibility check <ArrowRight className="w-5 h-5" aria-hidden="true" />
                        </Link>
                        <Link
                            href="/contact-us?from=studio-page"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors"
                        >
                            Talk to us about monitoring
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

/** An illustration of the Studio overview, built from sample data rather than a real client. */
/**
 * A mock-up of the Studio site overview, with sample data. Only shows things Studio really does:
 * issue counts, severity and status, specialist notes, fixes confirmed by the next scan.
 */
function StudioExample() {
    const stats = [
        { label: 'To fix', value: '18', accent: 'bg-amber-400', note: '3 critical' },
        { label: 'New this week', value: '2', accent: 'bg-sky-500', note: 'Since Monday' },
        { label: 'Fixed', value: '5', accent: 'bg-emerald-500', note: 'Confirmed by scan' },
    ]
    const severity: Record<string, string> = {
        Critical: 'bg-red-100 text-red-800',
        High: 'bg-orange-100 text-orange-800',
        Medium: 'bg-yellow-100 text-yellow-900',
    }
    const status: Record<string, string> = {
        New: 'bg-sky-100 text-sky-800',
        'In progress': 'bg-slate-100 text-slate-700',
        Fixed: 'bg-emerald-100 text-emerald-800',
    }
    const issues = [
        { title: 'Focus hidden behind the sticky header', page: 'All pages · header', severity: 'Critical', status: 'In progress' },
        { title: 'Form field has no label', page: '/apply · newsletter form', severity: 'High', status: 'New' },
        { title: 'Link text contrast too low', page: '/news · article footer', severity: 'Medium', status: 'Fixed' },
    ]
    return (
        <figure className="relative m-0 min-w-0">
            {/* Glow behind the window */}
            <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-400/30 via-sky-400/10 to-transparent blur-2xl" />

            <div className="relative rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-white/10 overflow-hidden">
                {/* Browser bar */}
                <div aria-hidden="true" className="flex items-center gap-3 bg-slate-800 px-4 py-2.5">
                    <span className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="flex-1 min-w-0 truncate rounded-md bg-slate-700 px-3 py-1 text-xs text-slate-300">studio.a11ypros.com</span>
                </div>

                {/* Site header */}
                <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#001d2f] text-sm font-extrabold text-emerald-300">EU</span>
                        <div className="min-w-0">
                            <p className="m-0 font-bold leading-tight truncate">Example University</p>
                            <p className="m-0 text-xs text-slate-600">Weekly scan · last run Monday</p>
                        </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" /> Monitoring
                    </span>
                </div>

                <div className="px-5 pb-5">
                    <dl className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                        {stats.map((s) => (
                            <div key={s.label} className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${s.accent}`} />
                                <dt className="text-[11px] sm:text-xs font-semibold text-slate-600">{s.label}</dt>
                                <dd className="m-0 text-2xl sm:text-3xl font-extrabold leading-tight">{s.value}</dd>
                                <dd className="m-0 hidden sm:block text-[11px] text-slate-600">{s.note}</dd>
                            </div>
                        ))}
                    </dl>

                    <ul className="space-y-2 text-sm" role="list">
                        {issues.map((issue) => (
                            <li key={issue.title} className="rounded-xl border border-slate-200 px-3 py-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                                <span className="min-w-0">
                                    <span className="block font-semibold leading-snug">{issue.title}</span>
                                    <span className="block text-xs text-slate-600">{issue.page}</span>
                                </span>
                                <span className="flex gap-1.5">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${severity[issue.severity]}`}>{issue.severity}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status[issue.status]}`}>{issue.status}</span>
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Specialist note */}
                    <div className="mt-4 flex gap-3 rounded-xl bg-[#001d2f] p-3 text-white">
                        <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-extrabold text-[#001d2f]">JD</span>
                        <p className="m-0 text-xs leading-relaxed text-slate-200">
                            <span className="font-bold text-white">Specialist review: </span>
                            Confirmed with a keyboard. The sticky header hides focus on every page, so fix this one first.
                        </p>
                    </div>
                </div>
                <figcaption className="border-t border-slate-200 bg-slate-50 px-5 py-2.5 text-xs text-slate-600">
                    Example of a site overview in A11Y Studio, with sample data.
                </figcaption>
            </div>

            {/* Floating badges */}
            <p aria-hidden="true" className="hidden md:flex absolute right-8 -top-5 m-0 items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-xl ring-1 ring-slate-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
                Fix confirmed by scan
            </p>
            <p aria-hidden="true" className="hidden md:flex absolute -right-4 -bottom-5 m-0 items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-xl ring-1 ring-slate-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#001d2f] text-emerald-300">✎</span>
                Monthly report signed
            </p>
        </figure>
    )
}
