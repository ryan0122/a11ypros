import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SharePost from '@/components/ui/SharePost'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { Calendar, User, Clock, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react'

export interface ArticleTemplateProps {
  post: {
    title: { rendered: string }
    content?: { rendered: string }
    date: string
    author_name?: string
    featured_image_url?: string
    rankMathSchema?: string
    slug: string
  }
  postUrl: string
}

export default function ArticleTemplate({ post, postUrl }: ArticleTemplateProps) {
  const authorName = post.author_name || 'A11y Pros Editorial Team'
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Estimate read time (avg 200 words/min)
  const plainText = post.content?.rendered.replace(/<[^>]*>/g, '') || ''
  const wordCount = plainText.split(/\s+/).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <article className="min-h-screen bg-white font-[family-name:var(--font-inter)] text-slate-900">
      {/* Breadcrumbs Header */}
      <div className="bg-slate-50 border-b border-slate-200 py-3">
        <div className="max-w-6xl mx-auto px-6">
          <Breadcrumbs />
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Article Header */}
          <header className="max-w-4xl mx-auto mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#084A3B]/10 text-[#084A3B] text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" /> Accessibility Insights
            </span>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600 font-medium pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#084A3B]" />
                <span>{authorName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#084A3B]" />
                <time dateTime={new Date(post.date).toISOString()}>{formattedDate}</time>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#084A3B]" />
                <span>{readTimeMinutes} min read</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="max-w-4xl mx-auto mb-10 overflow-hidden rounded-2xl">
              <Image
                src={post.featured_image_url}
                alt={post.title.rendered.replace(/<[^>]*>/g, '')}
                width={1200}
                height={630}
                className="w-full h-auto object-cover max-h-[500px]"
                priority
              />
            </div>
          )}

          {/* Main Article Grid: Body + Sticky Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Sticky Sidebar (Social Share + UI Component Library Card + CTA) */}
            <aside className="lg:col-span-3 lg:order-2 space-y-6 lg:sticky lg:top-8">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
                <div>
                  <SharePost url={postUrl} title={post.title.rendered} />
                </div>

                <hr className="border-slate-200" />

                {/* Free Developer UI Library Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#084A3B] block">
                    Free Developer Tool
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">A11Y UI Component Library</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Free, open-source WCAG 2.2 AA compliant React & HTML components tested with screen readers.
                  </p>
                  <a
                    href="https://ui.a11ypros.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#084A3B] hover:underline pt-1"
                  >
                    Browse Components <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <hr className="border-slate-200" />

                {/* Consultation CTA Box */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">Need Accessibility Help?</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Speak with our accessibility team for WCAG audits, remediation, or compliance strategy.
                  </p>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-1.5 w-full justify-center bg-[#0E8168] hover:bg-[#0a6b57] text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors"
                  >
                    Contact Us <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Article Body */}
            <div className="lg:col-span-9 lg:order-1">
              <div
                className="prose prose-slate prose-lg max-w-none 
                  prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-slate-700 prose-p:leading-relaxed
                  prose-a:text-[#084A3B] prose-a:font-semibold hover:prose-a:underline
                  prose-img:rounded-xl prose-img:shadow-md
                  prose-blockquote:border-l-4 prose-blockquote:border-[#084A3B] prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: post.content?.rendered || '' }}
              />

              {/* Versatile Bottom Services & Audit Callout */}
              <div className="mt-12 p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#14b895] uppercase tracking-wider">Audit & Remediation Services</span>
                  <h3 className="text-xl font-bold text-white">Achieve Digital Accessibility Compliance</h3>
                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                    Explore our manual WCAG 2.1/2.2 AA auditing, website remediation, PDF compliance, and VPAT® documentation services.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 bg-[#0E8168] hover:bg-[#0a6b57] text-white text-sm font-bold py-3 px-5 rounded-xl transition-colors"
                  >
                    View Services <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </article>
  )
}
