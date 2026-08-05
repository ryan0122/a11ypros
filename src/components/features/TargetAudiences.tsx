import React from 'react'
import { Building2, Code2, ShoppingCart, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function TargetAudiences() {
  const audiences = [
    {
      title: 'B2B SaaS & EdTech Vendors',
      subtitle: 'Pass Enterprise Procurement & Win Contracts',
      icon: Building2,
      badge: 'Procurement Ready',
      desc: 'Don’t let a missing VPAT or failed vendor security review stall your enterprise software deals. We author official Accessibility Conformance Reports (ACRs) that enterprise buyers and higher-ed institutions demand.',
      highlights: [
        'VPAT / ACR authored by certified CPACC / WAS auditors',
        'Section 508 & EN 301 549 compliance verification',
        'Turnaround in as fast as 5 business days for urgent deals',
      ],
      ctaText: 'Get VPAT for SaaS',
      ctaHref: '#vpat-estimator',
    },
    {
      title: 'Web & Digital Agencies',
      subtitle: 'White-Label Accessibility Services for Your Clients',
      icon: Code2,
      badge: 'Agency Partner Program',
      desc: 'Offer expert manual WCAG 2.1/2.2 AA audits and remediation guidance to your clients without hiring full-time in-house specialists or taking on legal liability.',
      highlights: [
        '100% white-label audit reports with your branding',
        'Developer-friendly remediation instructions & code snippets',
        'Generous partner referral commission or wholesale pricing',
      ],
      ctaText: 'Become an Agency Partner',
      ctaHref: '/contact-us',
    },
    {
      title: 'E-Commerce & Brands',
      subtitle: 'Defend Against ADA Lawsuits & Improve Conversion',
      icon: ShoppingCart,
      badge: 'ADA Risk Protection',
      desc: 'Websites facing accessibility demand letters or ADA litigation need legitimate manual auditing—not surface-level automated overlays that fail in court.',
      highlights: [
        'Forensic manual testing with JAWS, NVDA & VoiceOver',
        'Prioritized issue backlog for your dev team',
        'Post-remediation verification & Letter of Conformance',
      ],
      ctaText: 'Remediate ADA Barriers',
      ctaHref: '#vpat-estimator',
    },
  ]

  return (
    <section className="w-full py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 sm:text-4xl">
            Tailored Accessibility Solutions for Your Specific Business Needs
          </h2>
          <p className="text-lg text-slate-600">
            Whether you need a VPAT for an enterprise deal, white-label agency support, or defense against ADA claims, we deliver manual, audit-ready compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {audiences.map((aud, index) => {
            const Icon = aud.icon
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 rounded-xl bg-[#0E8168]/10 text-[#0E8168] group-hover:bg-[#0E8168] group-hover:text-white transition-colors">
                      <Icon className="w-7 h-7" />
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {aud.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{aud.title}</h3>
                  <p className="text-sm font-semibold text-[#0E8168] mb-4">{aud.subtitle}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{aud.desc}</p>

                  <ul className="space-y-2.5 mb-8 text-xs text-slate-700">
                    {aud.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0E8168] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={aud.ctaHref}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#0E8168] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm"
                >
                  {aud.ctaText} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
