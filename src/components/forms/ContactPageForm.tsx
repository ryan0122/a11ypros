import React from 'react'
import ContactForm from "./ContactForm"
import { Phone, Mail, MapPin, ShieldCheck, CheckCircle2, Clock } from 'lucide-react'

export default function ContactPageForm() {
  return (
    <div className="w-full bg-slate-50 py-12 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8168]/10 text-[#0E8168] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Reach Out To Our Team
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Get in Touch with A11y Pros
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Have questions about WCAG 2.1/2.2 AA compliance, VPAT® authoring, website remediation, or an upcoming procurement review? Our certified team is here to help.
          </p>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>

            {/* Phone Card */}
            <a
              href="tel:+17207221775"
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#0E8168] hover:shadow-md transition-all flex items-start gap-4 group"
            >
              <div className="p-3 rounded-xl bg-[#0E8168]/10 text-[#0E8168] group-hover:bg-[#0E8168] group-hover:text-white transition-colors shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</span>
                <p className="font-bold text-slate-900 text-lg group-hover:text-[#0E8168] transition-colors mt-0.5">
                  +1 (720) 722-1775
                </p>
                <p className="text-xs text-slate-500 mt-1">Mon–Fri, 9am–5pm MT</p>
              </div>
            </a>

            {/* Email Card */}
            <a
              href="mailto:info@a11ypros.com"
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#0E8168] hover:shadow-md transition-all flex items-start gap-4 group"
            >
              <div className="p-3 rounded-xl bg-[#0E8168]/10 text-[#0E8168] group-hover:bg-[#0E8168] group-hover:text-white transition-colors shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</span>
                <p className="font-bold text-slate-900 text-lg group-hover:text-[#0E8168] transition-colors mt-0.5">
                  info@a11ypros.com
                </p>
                <p className="text-xs text-slate-500 mt-1">We respond within 24 business hours</p>
              </div>
            </a>

            {/* Location Address Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#0E8168]/10 text-[#0E8168] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">USA Headquarters</span>
                <address className="not-italic text-sm text-slate-800 font-semibold leading-relaxed mt-1">
                  1905 Sherman Street<br />
                  Ste 200 #2042<br />
                  Denver, CO 80203
                </address>
              </div>
            </div>

            {/* Trust Badges Box */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#14b895] shrink-0" />
                <span>100% Certified Manual Screen Reader Audits</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-[#14b895] shrink-0" />
                <span>Expedited 5-day VPAT turnaround available</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="w-5 h-5 text-[#14b895] shrink-0" />
                <span>Section 508 & WCAG 2.1/2.2 AA Conformance</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form Card */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
            <ContactForm isMainContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}