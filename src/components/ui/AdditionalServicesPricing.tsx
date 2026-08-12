'use client'

import React from 'react'
import Link from 'next/link'
import { Code2, FileSpreadsheet, FileCheck2, Wrench, ArrowRight, ShieldCheck } from 'lucide-react'

const additionalServices = [
  {
    id: 'technical-support',
    title: 'Technical Support & Consulting',
    category: 'On-Demand Advisory',
    icon: Code2,
    badge: '$195 / hour',
    subtitle: 'Min 2 hours',
    description: 'Validate your development team’s fixes, consult directly with certified technical accessibility engineers, and receive live architecture-level code guidance.',
    features: [
      'Live code reviews & pull request validation',
      'Screen reader & keyboard behavior troubleshooting',
      'Component library & design system consulting',
    ],
    ctaText: 'Book Technical Support',
    ctaHref: '/contact-us',
  },
  {
    id: 'itemized-audits',
    title: 'Per-Page Manual WCAG Auditing',
    category: 'Itemized Evaluation',
    icon: FileSpreadsheet,
    badge: '$100 – $250 / primary page',
    subtitle: '$25 – $100 for light pages',
    description: '100% manual evaluation of your digital assets based on WCAG 2.1 AA or 2.2 AA standards. Conducted by DHS Trusted Testers & IAAP certified experts.',
    features: [
      'DHS Trusted Tester certified human evaluation',
      'Actionable audit spreadsheet with screenshots',
      'Detailed code-level remediation recommendations',
    ],
    ctaText: 'Request Itemized Quote',
    ctaHref: '/contact-us',
  },
  {
    id: 'vpat-acr-addon',
    title: 'VPAT® / ACR Authoring Add-On',
    category: 'Procurement Compliance',
    icon: FileCheck2,
    badge: '$350 add-on',
    subtitle: '+ base audit cost',
    description: 'Our experts complete the official WCAG edition VPAT® (using audit findings) and independently issue a formal Accessibility Conformance Report (ACR).',
    features: [
      'Official VPAT® 2.5 WCAG Edition report',
      'Enterprise procurement & RFP support',
      'Independently issued ACR documentation',
    ],
    ctaText: 'Add VPAT to Audit',
    ctaHref: '/contact-us',
  },
  {
    id: 'code-remediation',
    title: 'Website & Code Remediation',
    category: 'Hands-On Engineering',
    icon: Wrench,
    badge: 'Custom Project Quote',
    subtitle: 'Full codebase repair',
    description: 'Our accessibility engineers work directly in your codebase, CMS, or design system to remediate HTML, ARIA, CSS, and focus management violations.',
    features: [
      'Direct GitHub / GitLab pull request fixes',
      'Headless & CMS framework remediation',
      'Re-testing & verification included',
    ],
    ctaText: 'Inquire About Remediation',
    ctaHref: '/services/website-remediation',
  },
]

export default function AdditionalServicesPricing() {
  return (
    <section className="py-10 my-10 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8168]/10 text-[#0E8168] text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4" /> Itemized & Technical Services
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
          Consulting, Remediation & Itemized Rates
        </h3>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          In addition to our fixed-rate packages, we offer per-hour technical consulting, itemized page-by-page WCAG auditing, VPAT authoring add-ons, and full codebase remediation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {additionalServices.map((service) => {
          const IconComponent = service.icon
          return (
            <div
              key={service.id}
              className="flex flex-col justify-between p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#0E8168]/40 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-[#0E8168] shadow-sm group-hover:bg-[#0E8168] group-hover:text-white transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {service.category}
                      </span>
                      <h4 className="text-xl font-bold text-slate-900">
                        {service.title}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="mb-4 bg-white p-3.5 rounded-xl border border-slate-200 flex items-baseline justify-between">
                  <span className="text-lg font-extrabold text-[#0E8168]">
                    {service.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {service.subtitle}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0E8168]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={service.ctaHref}
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-sm hover:bg-[#0E8168] hover:text-white hover:border-[#0E8168] transition-all shadow-xs"
              >
                {service.ctaText} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
