import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Thanks for booking a demo | A11Y Pros',
    robots: { index: false, follow: false },
}

export default function DemoThankYouPage() {
    return (
        <main id="main-content" tabIndex={-1} className="font-[family-name:var(--font-inter)] bg-white text-slate-900">
            <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Thanks, we got your request</h1>
                <p className="text-lg text-slate-700 mb-8">
                    We’ll email you soon to find a time for your A11Y Studio demo. If you need us sooner, call{' '}
                    <a href="tel:+17207221775" className="font-semibold text-[#0a6b57] underline">+1 (720) 722-1775</a>.
                </p>
                <Link
                    href="/services/accessibility-monitoring"
                    className="inline-flex items-center rounded-xl bg-[#0E8168] px-6 py-3.5 font-bold text-white hover:bg-[#0a6b57] transition-colors"
                >
                    Back to A11Y Studio monitoring
                </Link>
            </div>
        </main>
    )
}
