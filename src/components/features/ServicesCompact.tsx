import React from 'react'
import Link from 'next/link'
import { FileSearch, Code, FileText, Users, FileCheck2, ShieldAlert, ArrowRight } from 'lucide-react'

export default function ServicesCompact() {
  const services = [
    {
      title: 'WCAG Compliance Auditing',
      desc: 'Forensic manual testing with screen readers (JAWS, NVDA, VoiceOver) and keyboard-only navigation.',
      href: '/services/wcag-compliance-auditing',
      icon: FileSearch,
    },
    {
      title: 'VPAT & ACR Authoring',
      desc: 'Official Accessibility Conformance Reports required to win enterprise and government contracts.',
      href: '/services/vpat-acr-authoring',
      icon: FileText,
    },
    {
      title: 'Website Remediation',
      desc: 'Hands-on code and content fixes to eliminate WCAG barriers and satisfy legal demand letters.',
      href: '/services/website-remediation',
      icon: Code,
    },
    {
      title: 'ADA Litigation Support',
      desc: 'Expert guidance, forensic audits, and post-fix Letters of Conformance for demand letters & lawsuits.',
      href: '/services/ada-litigation-support',
      icon: ShieldAlert,
    },
    {
      title: 'Web Accessibility Consulting',
      desc: 'Ongoing policy guidance, design system reviews, and strategic compliance roadmaps.',
      href: '/services/web-accessibility-consulting',
      icon: Users,
    },
    {
      title: 'PDF Remediation',
      desc: 'Make your digital documents as accessible as your website with full Section 508 compliance.',
      href: '/services/pdf-remediation',
      icon: FileCheck2,
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Our Accessibility Services</h2>
          <p className="text-base text-slate-600">Expert-led manual testing and compliance solutions tailored for SaaS, enterprise, and agencies.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon
            return (
              <Link
                key={idx}
                href={srv.href}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0E8168] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0E8168]/10 text-[#0E8168] flex items-center justify-center mb-4 group-hover:bg-[#0E8168] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-[#0E8168] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{srv.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E8168]">
                  Learn More <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
