import Image from 'next/image';
import Link from 'next/link';
import Services from '@/components/features/Services';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface PageProps {
  title: string;
  content: string;
  slug: string;
  featuredImage?: {
    source_url: string;
    alt_text?: string;
    caption?: string;
  } | null;
}

export default function PageTemplate({ title, content, featuredImage, slug }: PageProps) {
  const isContact = slug === 'contact-us';
  const isServices = slug === 'services';

  return (
    <div className="bg-white text-slate-900 font-[family-name:var(--font-inter)]">
      {/* Breadcrumbs Header */}
      <div className="bg-slate-50 border-b border-slate-200 py-3">
        <div className="max-w-6xl mx-auto px-6">
          <Breadcrumbs />
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Top Hero Section */}
          <div className="py-10 bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 mb-12 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-2" dangerouslySetInnerHTML={{ __html: title }} />
                {isServices && (
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mt-3">
                    Explore our manual WCAG 2.1/2.2 AA auditing, official VPAT® ACR authoring, website remediation, and ADA litigation support.
                  </p>
                )}
                {isContact && (
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mt-3">
                    Reach out to our certified web accessibility team for audits, VPAT® documentation, or compliance inquiries.
                  </p>
                )}
              </div>
              {featuredImage && (
                <div className="flex-1 flex justify-center lg:justify-end">
                  <Image
                    src={featuredImage.source_url}
                    alt={featuredImage.alt_text || ''}
                    width={600}
                    height={450}
                    className="rounded-2xl w-full max-w-lg h-auto object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </div>

          {/* Main Layout */}
          {isContact || isServices ? (
            /* Single column layout for Contact and Services pages - no sidebars */
            <div className="max-w-4xl mx-auto">
              <div
                className="prose prose-slate prose-lg max-w-none 
                  prose-headings:font-bold prose-headings:text-slate-900 
                  prose-p:text-slate-700 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            /* 2-Column Layout for standard informational pages */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Main Rich Content Body */}
              <div className="lg:col-span-8">
                <div
                  className="prose prose-slate prose-lg max-w-none 
                    prose-headings:font-bold prose-headings:text-slate-900 
                    prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-3
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-slate-700 prose-p:leading-relaxed
                    prose-a:text-[#0E8168] prose-a:font-semibold hover:prose-a:underline
                    prose-li:text-slate-700 prose-strong:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Explore Our Services</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Discover our manual WCAG 2.1/2.2 auditing, VPAT® 2.5 authoring, and website remediation.
                  </p>
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#0E8168] hover:bg-[#0a6b57] text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
                  >
                    View Services <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Trust & Coverage Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Why A11y Pros
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#0E8168] shrink-0" />
                    <span>100% Certified Manual Screen Reader Testing</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#0E8168] shrink-0" />
                    <span>Official VPAT® 2.5 ACR Report Delivery</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#0E8168] shrink-0" />
                    <span>Section 508 & WCAG 2.1/2.2 AA Coverage</span>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>

        {/* Overview Services Grid */}
        {isServices && (
          <div className="mt-16 border-t border-slate-200 pt-12 max-w-6xl mx-auto px-6">
            <Services showHeading={false} />
          </div>
        )}
      </main>
    </div>
  );
}