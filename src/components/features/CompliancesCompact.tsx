import React from 'react'
import Link from 'next/link'
import { ShieldCheck, ArrowRight } from 'lucide-react'

export default function CompliancesCompact() {
  const standards = [
    { title: 'WCAG 2.1 / 2.2 AA', desc: 'Web Content Guidelines', href: '/compliance/web-content-accessibility-guidelines' },
    { title: 'ADA Title III', desc: 'Americans with Disabilities Act', href: '/compliance/the-americans-with-disabilities-act' },
    { title: 'Section 508', desc: 'US Rehabilitation Act', href: '/compliance/section-508' },
    { title: 'EN 301 549', desc: 'European Standard', href: '/compliance/en-301-549' },
    { title: 'ACA & AODA', desc: 'Canadian Accessibility Laws', href: '/compliance/the-accessible-canada-act-aca/' },
  ]

  return (
    <section className="py-10 bg-slate-50 text-slate-900 border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="md:w-1/3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8168]/10 text-[#0E8168] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Full Coverage
            </span>
            <h3 className="text-xl font-bold text-slate-900">Compliance Standards</h3>
            <p className="text-sm text-slate-600 mt-1">Audit-ready documentation for US, Canadian, and European legal standards.</p>
          </div>

          <div className="md:w-2/3 flex flex-wrap gap-3">
            {standards.map((st, idx) => (
              <Link
                key={idx}
                href={st.href}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#0E8168] hover:shadow-sm transition-all group"
              >
                <div className="text-sm font-bold text-slate-900 group-hover:text-[#0E8168] transition-colors">{st.title}</div>
                <div className="text-xs text-slate-500">{st.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
