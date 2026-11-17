import Link from 'next/link'
import { Check, ShieldCheck } from 'lucide-react'

interface Plan {
    id: string
    name: string
    price: string
    annual: string
    description: string
    popular?: boolean
    features: string[]
}

// Monthly monitoring plans for A11Y Studio. Prices and inclusions are set by A11Y Pros (see the
// engine's PLAN.md and the review credit amounts in Studio); change them here and on the
// monitoring page's FAQ together.
const plans: Plan[] = [
    {
        id: 'shield',
        name: 'A11y Shield',
        price: '$499',
        annual: '$449/month billed annually',
        description: 'Ongoing checks for one site, with a specialist reviewing the results.',
        features: [
            'Up to 100 pages monitored',
            'Weekly scans',
            'Monthly report signed by your specialist',
            'A11Y Studio portal for your whole team',
            '5 review credits a month',
            'Email updates on new issues and fixes',
        ],
    },
    {
        id: 'pro',
        name: 'Assurance Pro',
        price: '$1,450',
        annual: '$1,295/month billed annually',
        description: 'For larger sites and teams that want hands-on testing between audits.',
        popular: true,
        features: [
            'Up to 500 pages monitored',
            'Everything in A11y Shield',
            '20 review credits a month',
            'Quarterly keyboard and screen reader spot-check, with video',
            'Yearly VPAT® / ACR refresh',
        ],
    },
    {
        id: 'partner',
        name: 'Partner',
        price: '$2,950',
        annual: '$2,650/month billed annually',
        description: 'A specialist on your team: monthly testing and help fixing the code.',
        features: [
            'Up to 2,000 pages monitored',
            'Everything in Assurance Pro',
            '50 review credits a month',
            'Monthly keyboard and screen reader spot-check, with video',
            'Up to 5 hours of hands-on remediation a month',
        ],
    },
]

interface StudioPlansProps {
    /** The heading level for the section heading; plan names are one level below. */
    headingLevel?: 'h2' | 'h3'
}

export default function StudioPlans({ headingLevel = 'h2' }: StudioPlansProps) {
    const Heading = headingLevel
    const PlanHeading = headingLevel === 'h2' ? 'h3' : 'h4'
    return (
        <section
            id="plans"
            aria-labelledby="studio-plans-heading"
            className="py-10 bg-slate-50 rounded-3xl px-6 sm:px-8 border border-slate-200 scroll-mt-8"
        >
            <div className="max-w-4xl mx-auto text-center mb-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8168]/10 text-[#0a6b57] text-xs font-bold uppercase tracking-wider mb-3">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Monthly monitoring
                </span>
                <Heading id="studio-plans-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    A11Y Studio Monitoring Plans
                </Heading>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
                    Weekly scans, a certified specialist reviewing what they find, and one place for your team to track every issue to a fix.
                </p>
            </div>

            <ul className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto" role="list">
                {plans.map((plan) => (
                    <li
                        key={plan.id}
                        className={`relative flex flex-col rounded-2xl bg-white p-8 shadow-sm border ${
                            plan.popular ? 'border-[#0E8168] ring-2 ring-[#0E8168]' : 'border-slate-200'
                        }`}
                    >
                        {plan.popular && (
                            <p className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#0E8168] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md whitespace-nowrap">
                                Most popular
                            </p>
                        )}
                        <PlanHeading className="text-xl font-bold text-slate-900 mb-2">{plan.name}</PlanHeading>
                        <p className="text-sm text-slate-600 mb-6">{plan.description}</p>
                        <p className="mb-6">
                            <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                            <span className="text-base font-semibold text-slate-600"> /month</span>
                            <span className="block text-sm text-slate-600 mt-1">or {plan.annual}</span>
                        </p>
                        <ul className="space-y-3 mb-8 flex-1" role="list">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                                    <Check className="w-5 h-5 text-[#0E8168] shrink-0 mt-0.5" aria-hidden="true" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={`/contact-us?from=studio-${plan.id}`}
                            className={`mt-auto w-full py-3.5 px-6 rounded-xl font-bold text-center transition-colors ${
                                plan.popular ? 'bg-[#0E8168] text-white hover:bg-[#0a6b57] shadow-md' : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                        >
                            Request monitoring<span className="sr-only">: {plan.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="max-w-4xl mx-auto mt-10 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <p>
                    <strong className="text-slate-900">Onboarding:</strong> a one-time $750 setup covers your site configuration and the baseline review that later scans compare against. Waived for Partner on annual billing.
                </p>
                <p>
                    <strong className="text-slate-900">Review credits:</strong> each request to your specialist, such as checking a fix, uses 1 credit, and a question uses 2. Fixes the scan can check are verified for free. Unused credits roll over one month. More credits: 10 for $250 or 50 for $1,000.
                </p>
                <p>
                    <strong className="text-slate-900">Extra specialist time:</strong> $175 an hour, on any plan.
                </p>
                <p>
                    <strong className="text-slate-900">More than one site:</strong> each additional domain is priced per site. Ask us for a quote.
                </p>
            </div>
        </section>
    )
}
