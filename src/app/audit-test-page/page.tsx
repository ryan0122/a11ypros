'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  FileSpreadsheet, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  FileText
} from 'lucide-react'

export default function AuditTestPage() {
  const [activeTab, setActiveTab] = useState<'specs' | 'consumables' | 'support'>('specs')
  const [modalOpen, setModalOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 font-sans pb-16">
      
      {/* =========================================================================
          TOP SANDBOX BANNER: Explains the purpose & provides Excel download
          ========================================================================= */}
      <aside aria-label="Audit Demonstration Notice" className="bg-slate-900 text-white border-b-4 border-[#0E8168] px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#0E8168] text-white font-bold text-xs uppercase tracking-wider">Sandbox</span>
            <span className="text-slate-200">
              <strong>A11Y Pros Audit Reference Page:</strong> Intentionally contains 13 real-world WCAG 2.2 AA violations for audit demonstrations.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0E8168] hover:bg-[#0b6b55] text-white font-semibold transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {drawerOpen ? 'Hide Action Items Matrix' : 'View Action Items Matrix (13)'}
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          ACTION ITEMS DRAWER (When toggled by user)
          ========================================================================= */}
      {drawerOpen && (
        <section className="bg-white border-b border-slate-300 shadow-xl px-4 py-6 max-w-7xl mx-auto mt-4 rounded-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-[#0E8168]" />
                Sample Accessibility Audit & Remediation Action Plan
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Reflective of the audit matrix delivered to clients. Notice how <strong>46% of violations (6 of 13)</strong> are detectable <em>only through manual human testing</em>.
              </p>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              aria-label="Close matrix drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Audit Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-xs font-bold text-red-700 uppercase">Critical Severity</span>
              <p className="text-2xl font-black text-red-900 mt-1">3 Issues</p>
              <span className="text-[11px] text-red-600">Blocks screen reader / keyboard</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-xs font-bold text-amber-700 uppercase">Serious Severity</span>
              <p className="text-2xl font-black text-amber-900 mt-1">5 Issues</p>
              <span className="text-[11px] text-amber-600">Severe barrier for users</span>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-xs font-bold text-yellow-700 uppercase">Moderate Severity</span>
              <p className="text-2xl font-black text-yellow-900 mt-1">4 Issues</p>
              <span className="text-[11px] text-yellow-700">WCAG AA non-conformance</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-xs font-bold text-emerald-700 uppercase">Discovery Split</span>
              <p className="text-xl font-black text-emerald-900 mt-1">7 Auto / 6 Manual</p>
              <span className="text-[11px] text-emerald-700">Axe/ARC vs Human Testing</span>
            </div>
          </div>

          {/* Action Items Table Preview */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-96">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900 text-white sticky top-0">
                <tr>
                  <th className="p-2.5 font-bold">ID</th>
                  <th className="p-2.5 font-bold">Location</th>
                  <th className="p-2.5 font-bold">WCAG Criteria</th>
                  <th className="p-2.5 font-bold">Severity</th>
                  <th className="p-2.5 font-bold">Discovery</th>
                  <th className="p-2.5 font-bold">Barrier Description</th>
                  <th className="p-2.5 font-bold">Recommended Code Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-01</td>
                  <td className="p-2.5 font-medium">Hero Image (#hero-product-image)</td>
                  <td className="p-2.5">1.1.1 Non-text Content (A)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">Serious</span></td>
                  <td className="p-2.5 text-blue-700 font-semibold">Automated (Axe/ARC)</td>
                  <td className="p-2.5 text-slate-700">Empty alt attribute (<code className="text-slate-800">alt=""</code>) causes screen readers to skip the informative product illustration.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Add alt="ApexCut 9000 Industrial CNC Gantry dual-torch plasma and waterjet cutting system"</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-02</td>
                  <td className="p-2.5 font-medium">Subtitle (#product-model-subtitle)</td>
                  <td className="p-2.5">1.4.3 Contrast (Minimum) (AA)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Serious</span></td>
                  <td className="p-2.5 text-blue-700 font-semibold">Automated (Axe/ARC)</td>
                  <td className="p-2.5 text-slate-700">Faint grey #94A3B8 text on white produces 2.6:1 contrast (fails 4.5:1 AA minimum).</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Update color to #334155 (yields 5.4:1 contrast ratio)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-03</td>
                  <td className="p-2.5 font-medium">Headings (#metrics-heading)</td>
                  <td className="p-2.5">1.3.1 Info and Relationships (A)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-bold">Moderate</span></td>
                  <td className="p-2.5 text-blue-700 font-semibold">Automated (Axe/ARC)</td>
                  <td className="p-2.5 text-slate-700">Heading levels skip directly from &lt;h1&gt; to &lt;h4&gt; without intermediate &lt;h2&gt; or &lt;h3&gt;.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Change &lt;h4 id="metrics-heading"&gt; to &lt;h2 id="metrics-heading"&gt;</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-04</td>
                  <td className="p-2.5 font-medium">Header Buttons (#btn-header-search, #btn-header-cart)</td>
                  <td className="p-2.5">4.1.2 Name, Role, Value (A)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">Critical</span></td>
                  <td className="p-2.5 text-blue-700 font-semibold">Automated (Axe/ARC)</td>
                  <td className="p-2.5 text-slate-700">Icon-only buttons have no aria-label or accessible text; screen reader announces "Button".</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Add aria-label="Search equipment catalog" and aria-label="Shopping Cart (2 items)"</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-05</td>
                  <td className="p-2.5 font-medium">Inquiry Inputs (#input-business-name, #input-contact-email)</td>
                  <td className="p-2.5">3.3.2 Labels or Instructions (A)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Serious</span></td>
                  <td className="p-2.5 text-blue-700 font-semibold">Automated (Axe/ARC)</td>
                  <td className="p-2.5 text-slate-700">Inputs rely solely on placeholder attributes without programmatic &lt;label&gt; tags.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Add &lt;label for="input-business-name"&gt; and &lt;label for="input-contact-email"&gt;</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-06</td>
                  <td className="p-2.5 font-medium">Specs Table (#spec-table-grid)</td>
                  <td className="p-2.5">4.1.2 Name, Role, Value / 1.3.1 (A)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-bold">Moderate</span></td>
                  <td className="p-2.5 text-blue-700 font-semibold">Automated (Axe/ARC)</td>
                  <td className="p-2.5 text-slate-700">Duplicate element id="spec-table-grid" appears twice in the DOM tree.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Rename IDs to "spec-table-desktop" and "spec-table-mobile"</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-07</td>
                  <td className="p-2.5 font-medium">Manual Download (#link-download-manual)</td>
                  <td className="p-2.5">2.4.4 Link Purpose (Context) (A)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Minor</span></td>
                  <td className="p-2.5 text-purple-700 font-semibold">Auto & Manual</td>
                  <td className="p-2.5 text-slate-700">Generic anchor text "Click Here" lacks destination, format, and file size context.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Change text to "Download ApexCut 9000 Operator Manual &amp; Schematics (PDF, 8.4 MB)"</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-08</td>
                  <td className="p-2.5 font-medium">CTA Button (#btn-configure-specs)</td>
                  <td className="p-2.5">2.1.1 Keyboard (A)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">Critical</span></td>
                  <td className="p-2.5 text-purple-700 font-semibold">Manual Only (Keyboard)</td>
                  <td className="p-2.5 text-slate-700">Primary CTA is a &lt;div onclick&gt; with no tabindex or keyboard listener. Unreachable via Tab key.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Replace with semantic &lt;button type="button" id="btn-configure-specs"&gt;</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-09</td>
                  <td className="p-2.5 font-medium">Tabs &amp; Inputs (#tab-specs, #input-business-name)</td>
                  <td className="p-2.5">2.4.7 Focus Visible (AA)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Serious</span></td>
                  <td className="p-2.5 text-purple-700 font-semibold">Manual Only (Keyboard)</td>
                  <td className="p-2.5 text-slate-700">Elements use style="outline: none;" and focus:outline-none with no visible replacement indicator.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Replace with focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E8168]</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-10</td>
                  <td className="p-2.5 font-medium">Tabstrip (#product-tabstrip)</td>
                  <td className="p-2.5">1.3.1 / 4.1.2 (A)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Serious</span></td>
                  <td className="p-2.5 text-purple-700 font-semibold">Manual (Screen Reader)</td>
                  <td className="p-2.5 text-slate-700">Tabstrip lacks role="tablist", role="tab", aria-selected state, and arrow-key navigation.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Add role="tablist", role="tab", aria-selected="true/false", and aria-controls</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-11</td>
                  <td className="p-2.5 font-medium">CAD Modal (#cad-drawing-modal)</td>
                  <td className="p-2.5">2.1.2 No Keyboard Trap / 2.4.3 (A)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">Critical</span></td>
                  <td className="p-2.5 text-purple-700 font-semibold">Manual Only (Keyboard)</td>
                  <td className="p-2.5 text-slate-700">Modal fails to trap focus; Tab escapes into background DOM; Esc key does not close.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Use native &lt;dialog id="cad-drawing-modal"&gt; with showModal() to trap focus</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-12</td>
                  <td className="p-2.5 font-medium">Quantity Steppers (#btn-qty-decrement, #btn-qty-increment)</td>
                  <td className="p-2.5">2.5.8 Target Size (Min) (WCAG 2.2 AA)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-bold">Moderate</span></td>
                  <td className="p-2.5 text-purple-700 font-semibold">Manual (WCAG 2.2)</td>
                  <td className="p-2.5 text-slate-700">Quantity stepper buttons measure only 14x14px, violating the 24x24 CSS pixel minimum.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Set min-width and min-height to at least 24px (e.g. w-6 h-6 min-w-[24px])</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-[#0E8168]">ACT-13</td>
                  <td className="p-2.5 font-medium">Form Feedback (#quote-confirmation-message)</td>
                  <td className="p-2.5">4.1.3 Status Messages (AA)</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Serious</span></td>
                  <td className="p-2.5 text-purple-700 font-semibold">Manual (Screen Reader)</td>
                  <td className="p-2.5 text-slate-700">Dynamic confirmation banner appears visually without role="status" or aria-live.</td>
                  <td className="p-2.5 font-mono text-[11px] text-emerald-800 bg-slate-50">Add role="status" and aria-live="polite" to the confirmation container</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

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
