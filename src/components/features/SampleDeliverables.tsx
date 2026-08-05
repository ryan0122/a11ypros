import React from 'react'
import { FileCheck, ShieldCheck, Download, ExternalLink, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SampleDeliverables() {
  return (
    <section className="w-full py-16 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Background Decorative Pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0E8168]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E8168]/30 border border-[#0E8168]/50 text-[#14b895] text-xs font-semibold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4" /> Enterprise Proof & Transparency
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                Inspect Our Audit Deliverables Before You Hire Us
              </h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Procurement officers and engineering managers choose A11y Pros because our reports are actionable, forensic-grade, and ready for legal or vendor review.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <FileCheck className="w-6 h-6 text-[#14b895] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Official VPAT® 2.5 / ACR</h4>
                    <p className="text-xs text-slate-300">Format adhering to ITI VPAT template standards (WCAG 2.1 AA / Section 508).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <CheckCircle className="w-6 h-6 text-[#14b895] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Forensic WCAG Audit Matrix</h4>
                    <p className="text-xs text-slate-300">Issue-by-issue breakdown with code snippets, screenshot evidence, & fix guidance.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#vpat-estimator"
                  className="inline-flex items-center gap-2 bg-[#0E8168] hover:bg-[#0a6b57] text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-[#0E8168]/30"
                >
                  Request Sample Deliverables <Download className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
                >
                  Schedule VPAT Review <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">VPAT_2.5_ACR_REPORT.pdf</span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                    <div className="text-[10px] text-[#14b895] font-bold uppercase">Section 508 & WCAG 2.1 AA Evaluation</div>
                    <div className="text-white font-bold text-sm mt-0.5">Conformance Level: Supports</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 text-slate-300 text-[11px] space-y-1">
                    <div className="text-slate-400">Testing Method:</div>
                    <div className="text-white font-semibold">• JAWS 2024 & VoiceOver Desktop</div>
                    <div className="text-white font-semibold">• Keyboard Focus & Screen Reader Verification</div>
                    <div className="text-white font-semibold">• 100% Certified Manual Inspection</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
