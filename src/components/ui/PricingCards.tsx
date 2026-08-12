'use client'

import React from 'react'
import Link from 'next/link'
import { Check, ShieldCheck, Sparkles, FileText, Layout, ArrowRight } from 'lucide-react'

interface PricingTier {
  id: string
  name: string
  price: string
  period?: string
  description: string
  icon: React.ElementType
  popular?: boolean
  features: string[]
  ctaText: string
  ctaHref: string
}

const pricingTiers: PricingTier[] = [
  {
    id: 'figma-audit',
    name: 'Figma Design Audit',
    price: '$950',
    period: 'starting at',
    description: 'Catch accessibility barriers in Figma design systems before developers write code.',
    icon: Layout,
    features: [
      'Component library color contrast review',
      'Touch target & focus indicator specs',
      'Heading hierarchy & DOM order annotations',
      'Screen reader spec documentation',
      'Design team Q&A walkthrough session',
    ],
    ctaText: 'Book Figma Audit',
    ctaHref: '/contact-us',
  },
  {
    id: 'wcag-audit',
    name: 'WCAG Manual Audit',
    price: '$1,450',
    period: 'starting at',
    description: '100% human screen reader & keyboard testing for websites and web apps.',
    icon: Sparkles,
    popular: true,
    features: [
      '100% IAAP & DHS certified human testers',
      'Screen reader testing (NVDA, JAWS, VoiceOver)',
      'WCAG 2.1 & 2.2 AA criteria coverage',
      'Detailed audit spreadsheet with recommended fixes',
      'Re-testing & verification included',
    ],
    ctaText: 'Request Audit Quote',
    ctaHref: '/contact-us',
  },
  {
    id: 'vpat-acr',
    name: 'VPAT® / ACR Package',
    price: '$1,800',
    period: 'starting at',
    description: 'Comprehensive manual audit + official VPAT report for enterprise procurement.',
    icon: FileText,
    features: [
      'Full WCAG 2.1 AA & Section 508 evaluation',
      'Official VPAT® 2.5 ACR report authoring',
      'Procurement & RFP compliance support',
      'Detailed bug tracking spreadsheet',
      'Annual VPAT update option',
    ],
    ctaText: 'Request VPAT Package',
    ctaHref: '/contact-us',
  },
]

interface PricingCardsProps {
  singleTierId?: string
}

export default function PricingCards({ singleTierId }: PricingCardsProps = {}) {
  const filteredTiers = singleTierId
    ? pricingTiers.filter((t) => t.id === singleTierId)
    : pricingTiers

  const isSingle = filteredTiers.length === 1

  return (
    <section className="py-10 bg-slate-50 rounded-3xl mb-12 mt-0 px-6 sm:px-8 border border-slate-200">
      {!isSingle && (
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8168]/10 text-[#0E8168] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" /> Fixed-Rate Packages
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Accessibility Audit & Design Review Packages
          </h3>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            100% human manual testing and design system audits tailored to your digital assets.
          </p>
        </div>
      )}

      <div className={`grid grid-cols-1 ${isSingle ? 'max-w-lg mx-auto' : 'md:grid-cols-3 max-w-7xl mx-auto'} gap-8 items-stretch`}>
        {filteredTiers.map((tier) => {
          const IconComp = tier.icon
          return (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-xl border ${
                tier.popular
                  ? 'border-[#0E8168] ring-2 ring-[#0E8168]'
                  : 'border-slate-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#0E8168] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#0E8168]/10 text-[#0E8168]">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
              </div>

              <p className="text-sm text-slate-600 mb-6 min-h-[40px]">
                {tier.description}
              </p>

              <div className="mb-6">
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                  {tier.period}
                </span>
                <span className="text-4xl font-extrabold text-slate-900">
                  {tier.price}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="w-5 h-5 text-[#0E8168] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                className={`mt-auto w-full py-3.5 px-6 rounded-xl font-bold text-center transition-all ${
                  tier.popular
                    ? 'bg-[#0E8168] text-white hover:bg-[#0a6b57] shadow-md'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {tier.ctaText}
              </Link>
            </div>
          )
        })}
      </div>

      {/* Enterprise Custom Scope Banner */}
      {!isSingle && (
        <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-sm">
          <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            Need a Custom Enterprise Quote for Complex Web Apps or SaaS Platforms?
          </h4>
          <p className="text-sm text-slate-600 mb-5 max-w-2xl mx-auto">
            For multi-product digital ecosystems, large web applications, or custom enterprise compliance requirements, use our interactive scope calculator.
          </p>
          <Link
            href="/vpat-estimator"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-sm"
          >
            Calculate Enterprise Scope <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  )
}
