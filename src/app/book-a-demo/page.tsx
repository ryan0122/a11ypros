import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import DemoRequestForm from '@/components/forms/DemoRequestForm'
import { pageStructuredData, toJsonLd } from '@/lib/seo/structuredData'

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'
const title = 'Book an A11Y Studio Demo | A11Y Pros'
const description =
    'See A11Y Studio accessibility monitoring: weekly scans, review by a certified specialist, and one place for your team to track issues to a fix.'

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/book-a-demo` },
    openGraph: {
        title,
        description,
        type: 'website',
        url: `${BASE_URL}/book-a-demo`,
        images: [{ url: `${BASE_URL}/og_banner.jpg`, alt: 'A11Y Pros', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${BASE_URL}/og_banner.jpg`] },
}

const covered = [
    'How the weekly scan uses your site with a keyboard and checks it in real-world conditions',
    'How your specialist reviews what the scan can’t be sure about',
    'Working through issues in A11Y Studio, and sending them to your team’s issue tracker',
    'Which plan fits your site, and what onboarding looks like',
]

type Props = { searchParams: Promise<{ plan?: string | string[] }> }

export default async function BookADemoPage({ searchParams }: Props) {
    const { plan } = await searchParams
    return (
        <main id="main-content" tabIndex={-1} className="font-[family-name:var(--font-inter)] bg-[#001d2f] text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: toJsonLd(
                        pageStructuredData({
                            path: '/book-a-demo',
                            title: 'Book an A11Y Studio demo',
                            description,
                            crumbs: [
                                { name: 'Services', path: '/services' },
                                { name: 'A11Y Studio Monitoring', path: '/services/accessibility-monitoring' },
                                { name: 'Book a demo', path: '/book-a-demo' },
                            ],
                        }),
                    ),
                }}
            />
            <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_32rem] items-start">
                <div>
                    <p className="flex items-center gap-3 mb-5">
                        <Image src="/images/a11y-studio-emblem.png" alt="" width={48} height={48} className="w-12 h-12" />
                        <span className="text-sm font-bold uppercase tracking-widest text-emerald-300">A11Y Studio by A11Y Pros</span>
                    </p>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5">Book an A11Y Studio demo</h1>
                    <p className="text-lg text-slate-200 leading-relaxed mb-8">
                        Tell us about your site and we’ll set up a time to walk you through accessibility monitoring with A11Y Studio, and answer your
                        questions.
                    </p>
                    <h2 className="text-xl font-bold mb-4">What we’ll cover</h2>
                    <ul className="space-y-3 mb-8" role="list">
                        {covered.map((item) => (
                            <li key={item} className="flex gap-3 text-slate-200">
                                <Check className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" aria-hidden="true" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-slate-300">
                        Want to read more first?{' '}
                        <Link href="/services/accessibility-monitoring" className="font-semibold text-emerald-300 underline underline-offset-2 hover:no-underline">
                            See how A11Y Studio monitoring works
                        </Link>
                        .
                    </p>
                </div>

                <section aria-labelledby="demo-form-heading" className="rounded-2xl bg-white p-6 sm:p-8 text-slate-900 border-t-8 border-[#0E8168]">
                    <h2 id="demo-form-heading" className="mt-0 mb-2 text-2xl font-extrabold">Request your demo</h2>
                    <p className="mt-0 mb-5 text-slate-700">We’ll reply by email to find a time that works for you.</p>
                    <DemoRequestForm plan={typeof plan === 'string' ? plan : undefined} privacyNoticeId="demo-privacy-notice" />
                    <p id="demo-privacy-notice" className="mt-4 mb-0 text-sm text-slate-600">
                        We use your details only to arrange your demo and follow up about A11Y Studio. See our{' '}
                        <Link href="/privacy-policy" className="text-[#0a6b57] underline">Privacy Policy</Link>.
                    </p>
                </section>
            </div>
        </main>
    )
}
