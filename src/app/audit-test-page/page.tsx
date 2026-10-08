'use client'

import React, { useState } from 'react'
import { 
  X,
  Search,
  ShoppingCart,
  FileText
} from 'lucide-react'

export default function AuditTestPage() {
  const [activeTab, setActiveTab] = useState<'specs' | 'consumables' | 'support'>('specs')
  const [modalOpen, setModalOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 font-sans pb-16">
      
      {/* =========================================================================
          TOP SANDBOX BANNER: Explains the purpose
          ========================================================================= */}
      <aside aria-label="Audit Demonstration Notice" className="bg-slate-900 text-white border-b-4 border-[#0E8168] px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs sm:text-sm">
          <span className="p-1 rounded bg-[#0E8168] text-white font-bold text-xs uppercase tracking-wider">Sandbox</span>
          <span className="text-slate-200">
            <strong>A11Y Pros Audit Reference Page:</strong> Intentionally contains 13 real-world WCAG 2.2 AA violations for audit demonstrations.
          </span>
        </div>
      </aside>

      {/* =========================================================================
          THE ACTUAL MOCK B2B INDUSTRIAL WEBSITE (With intentional WCAG violations)
          ========================================================================= */}
      
      {/* Mock Global Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span className="text-[#0E8168] text-2xl font-black">APEX</span> SYSTEMS
            </span>
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
              <span className="cursor-pointer hover:text-white">Cutting Systems</span>
              <span className="cursor-pointer hover:text-white">Software</span>
              <span className="cursor-pointer hover:text-white">Consumables</span>
              <span className="cursor-pointer hover:text-white">Support</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* VIOLATION ACT-04: Icon button without aria-label (Automated) */}
            <button id="btn-header-search" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
              <Search className="w-4 h-4" />
            </button>

            {/* VIOLATION ACT-04: Icon button without aria-label (Automated) */}
            <button id="btn-header-cart" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 relative">
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-[#0E8168] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-2.5 text-xs text-slate-500 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span>Home</span> <span>/</span> <span>CNC Cutting Systems</span> <span>/</span> <span className="text-slate-900 font-semibold">ApexCut 9000</span>
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Product Imagery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              {/* VIOLATION ACT-01: Missing alt text on primary hero image (Automated) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="hero-product-image"
                src="/images/apexcut-9000-industrial-cnc.svg"
                alt=""
                className="w-full h-80 object-contain rounded-xl bg-slate-900 p-2 shadow-inner"
              />
              <span className="absolute top-4 left-4 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Industrial Heavy Duty
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-600 mr-2">Views:</span>
              <button className="w-6 h-6 bg-slate-300 rounded border border-slate-400 text-xs flex items-center justify-center">1</button>
              <button className="w-6 h-6 bg-slate-200 rounded border border-slate-400 text-xs flex items-center justify-center">2</button>
              <button className="w-6 h-6 bg-slate-200 rounded border border-slate-400 text-xs flex items-center justify-center">3</button>
            </div>
          </div>

          {/* Right Column: Title, Pricing & Configuration CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E8168]">High-Precision Plasma & Waterjet</span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                ApexCut 9000 Industrial CNC Gantry
              </h1>
              
              {/* VIOLATION ACT-02: Low Contrast text (#94A3B8 on white = 2.6:1) (Automated) */}
              <p id="product-model-subtitle" style={{ color: '#94A3B8' }} className="text-sm mt-1 font-medium">
                Part # APC-9000-HD • Next-Gen Dual-Torch Industrial Cutting System
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">System Price Starting At</span>
                  <span className="text-3xl font-black text-slate-900">$84,500</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  Lead Time: 3-4 Weeks
                </span>
              </div>

              {/* VIOLATION ACT-03: Skipped Heading level jumping from h1 directly to h4 (Automated) */}
              <h4 id="metrics-heading" className="text-xs font-bold uppercase text-slate-700 tracking-wider pt-2 border-t border-slate-100">
                Key Performance Metrics
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Cut Speed</span>
                  <strong className="text-slate-800 font-bold">Up to 400 IPM</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Table Envelope</span>
                  <strong className="text-slate-800 font-bold">10 ft × 20 ft Bed</strong>
                </div>
              </div>

              {/* VIOLATION ACT-08: Inaccessible Custom Button (<div onclick>) (Manual Only) */}
              <div
                id="btn-configure-specs"
                onClick={() => alert('Configurator modal triggered!')}
                className="w-full py-3.5 px-4 bg-[#0E8168] hover:bg-[#0b6b55] text-white font-bold text-center rounded-xl cursor-pointer transition-all shadow-md select-none"
              >
                Configure Machine Specs & Pricing
              </div>

              {/* Accessible Modal Trigger */}
              <button
                type="button"
                id="btn-open-cad-modal"
                onClick={() => setModalOpen(true)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors border border-slate-300"
              >
                Request Engineering CAD Drawings
              </button>
            </div>

            {/* Quick Spec Card with VIOLATION ACT-07: "Click Here" ambiguous link */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0E8168]" /> Official Technical Documentation
              </p>
              <p>
                Comprehensive operator manual, electrical schematics, and cut charts are available. To download the full packet, <a id="link-download-manual" href="/docs/apexcut-9000-manual.pdf" className="text-blue-600 underline font-semibold">Click Here</a>.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION: TABS (Intentionally lacking ARIA tab roles & focus outlines)
            ========================================================================= */}
        <section className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          
          {/* VIOLATION ACT-10: Inaccessible Custom Tabstrip without ARIA roles (Manual Only) */}
          {/* VIOLATION ACT-09: outline:none suppressing visible focus indicator on keyboard focus (Manual Only) */}
          <div id="product-tabstrip" className="flex border-b border-slate-200 gap-8 mb-6">
            <button
              type="button"
              id="tab-specs"
              onClick={() => setActiveTab('specs')}
              className={`pb-3 font-bold text-sm cursor-pointer select-none transition-colors border-b-2 focus:outline-none focus:ring-0 ${
                activeTab === 'specs' 
                  ? 'border-[#0E8168] text-[#0E8168]' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
              style={{ outline: 'none' }}
            >
              System Specifications
            </button>

            <button
              type="button"
              id="tab-consumables"
              onClick={() => setActiveTab('consumables')}
              className={`pb-3 font-bold text-sm cursor-pointer select-none transition-colors border-b-2 focus:outline-none focus:ring-0 ${
                activeTab === 'consumables' 
                  ? 'border-[#0E8168] text-[#0E8168]' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
              style={{ outline: 'none' }}
            >
              Consumables & Parts
            </button>

            <button
              type="button"
              id="tab-support"
              onClick={() => setActiveTab('support')}
              className={`pb-3 font-bold text-sm cursor-pointer select-none transition-colors border-b-2 focus:outline-none focus:ring-0 ${
                activeTab === 'support' 
                  ? 'border-[#0E8168] text-[#0E8168]' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
              style={{ outline: 'none' }}
            >
              Support & Inquiries
            </button>
          </div>

          {/* Tab Panel 1: Specs */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Technical Data Sheet</h3>
              
              {/* VIOLATION ACT-06: Duplicate element ID in DOM (Automated) */}
              <div className="overflow-x-auto">
                <table id="spec-table-grid" className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="p-3 border border-slate-200">Parameter</th>
                      <th className="p-3 border border-slate-200">Standard Model</th>
                      <th className="p-3 border border-slate-200">High-Definition Model</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold border border-slate-200">Input Voltage</td>
                      <td className="p-3 border border-slate-200">240V / 480V 3-Phase</td>
                      <td className="p-3 border border-slate-200">480V 3-Phase Dedicated</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold border border-slate-200">Max Cut Thickness</td>
                      <td className="p-3 border border-slate-200">1.25 in (32 mm) Mild Steel</td>
                      <td className="p-3 border border-slate-200">2.0 in (50 mm) Production Piercing</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold border border-slate-200">CNC Controller</td>
                      <td className="p-3 border border-slate-200">Apex MotionControl v4</td>
                      <td className="p-3 border border-slate-200">Apex MotionControl v4 Pro HD</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Hidden duplicate ID table to simulate duplicate ID violation in mobile DOM */}
              <div className="sr-only">
                <table id="spec-table-grid">
                  <tbody><tr><td>Hidden Duplicate Table</td></tr></tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Panel 2: Consumables with Quantity Steppers */}
          {activeTab === 'consumables' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Frequently Replaced Consumables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Electrode Assembly (Pack of 5)</h4>
                    <span className="text-xs text-slate-500">Part # ELEC-85-05 • $85.00</span>
                  </div>
                  
                  {/* VIOLATION ACT-12: Undersized touch target (14x14px buttons) (WCAG 2.2 AA) */}
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-300">
                    <button 
                      id="btn-qty-decrement"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-3.5 h-3.5 min-w-0 min-h-0 bg-slate-200 hover:bg-slate-300 rounded text-[10px] flex items-center justify-center p-0 leading-none"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold px-1">{quantity}</span>
                    <button 
                      id="btn-qty-increment"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-3.5 h-3.5 min-w-0 min-h-0 bg-slate-200 hover:bg-slate-300 rounded text-[10px] flex items-center justify-center p-0 leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Nozzle Cartridge 85A</h4>
                    <span className="text-xs text-slate-500">Part # NOZ-85-HD • $42.00</span>
                  </div>
                  <button className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Panel 3: Quote & Support Form */}
          {activeTab === 'support' && (
            <div className="max-w-xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Request Technical Inquiry or Quote</h3>
              
              {/* VIOLATION ACT-13: Status message without role="status" / aria-live (Manual Only) */}
              {formSubmitted && (
                <div id="quote-confirmation-message" className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-300">
                  ✓ Thank you! Your quote request was submitted. A sales engineer will follow up shortly.
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* VIOLATION ACT-05: Missing form labels, placeholder-only inputs (Automated) */}
                {/* VIOLATION ACT-09: outline:none suppressing visible focus ring */}
                <div>
                  <input
                    id="input-business-name"
                    type="text"
                    placeholder="Full Business Name"
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-0"
                    style={{ outline: 'none' }}
                  />
                </div>

                <div>
                  <input
                    id="input-contact-email"
                    type="email"
                    placeholder="Engineering Contact Email"
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-0"
                    style={{ outline: 'none' }}
                  />
                </div>

                <div>
                  <textarea
                    id="input-project-details"
                    rows={3}
                    placeholder="Describe your cutting requirements, material thickness, and production schedule..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-0"
                    style={{ outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0E8168] text-white text-xs font-bold rounded-lg hover:bg-[#0b6b55] transition-colors"
                >
                  Send Inquiry Request
                </button>
              </form>
            </div>
          )}
        </section>

        {/* =========================================================================
            VIOLATION ACT-11: Modal Dialog Fails to Trap Focus (Manual Only)
            ========================================================================= */}
        {modalOpen && (
          <div id="cad-drawing-modal" className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">CAD Drawing Request Portal</h3>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Please provide your work email to receive full 3D STEP and DWG files for the ApexCut 9000 system.
              </p>

              <div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('CAD package dispatched via email!')
                    setModalOpen(false)
                  }}
                  className="px-4 py-2 text-xs font-bold bg-[#0E8168] text-white rounded-lg hover:bg-[#0b6b55]"
                >
                  Download CAD Package
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
