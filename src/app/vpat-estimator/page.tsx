import type { Metadata } from 'next'
import VpatEstimatorWidget from '@/components/features/VpatEstimatorWidget'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Interactive Audit & VPAT® Scope Estimator - A11Y Pros',
  description: 'Calculate your WCAG 2.1/2.2 AA audit scope, Section 508 compliance requirements, and estimated VPAT / ACR timeline.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'}/vpat-estimator`,
  },
}

export default function VpatEstimatorPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-[family-name:var(--font-inter)] text-slate-900">
      {/* Breadcrumbs Header */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-5xl mx-auto px-6">
          <Breadcrumbs />
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8168]/10 text-[#0E8168] text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" /> Certified WCAG & VPAT® Scope Calculator
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
              Estimate Your Accessibility Audit & VPAT® Scope
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Answer 3 quick questions to calculate your compliance scope, recommended WCAG standard, and estimated completion timeline.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0E8168]" /> 100% Manual Human Testing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0E8168]" /> Official VPAT® 2.5 ACR
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0E8168]" /> Direct Proposal Response
              </span>
            </div>
          </div>

          {/* Calculator Container */}
          <VpatEstimatorWidget />
        </div>
      </main>
    </div>
  )
}
