import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SharePost from '@/components/ui/SharePost'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { Calendar, User, Clock, ShieldCheck, ArrowRight } from 'lucide-react'

export interface ArticleTemplateProps {
  post: {
    title: { rendered: string }
    content?: { rendered: string }
    date: string
    author_name?: string
    featured_image_url?: string
    rankMathSchema?: string
  }
  postUrl: string
}

export default function ArticleTemplate({ post, postUrl }: ArticleTemplateProps) {
  const postContent = post.content?.rendered || '<p>No content available.</p>'

  // Estimate read time (avg 220 wpm)
  const wordCount = postContent.replace(/<[^>]*>/g, '').split(/\s+/).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 220))

  return (
    <div className="bg-white min-h-screen font-[family-name:var(--font-inter)] text-slate-900">
      {/* Breadcrumbs Header */}
      <div className="bg-slate-50 border-b border-slate-200 py-3">
        <div className="max-w-5xl mx-auto px-6">
          <Breadcrumbs />
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="py-10">
        <article className="max-w-5xl mx-auto px-6">
          {/* Article Header */}
          <header className="max-w-3xl mx-auto text-left mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8168]/10 text-[#0E8168] text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" /> Web Accessibility Article
            </span>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-200 text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#0E8168]" />
                <span>By <strong>{post.author_name || 'A11y Pros Expert'}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0E8168]" />
                <time dateTime={new Date(post.date).toISOString().split('T')[0]}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0E8168]" />
                <span>{readTimeMinutes} min read</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="max-w-4xl mx-auto mb-10 overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
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

          {/* Grid Layout: Main Article Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar (Desktop & Tablet) */}
            <aside className="lg:col-span-3 lg:order-2 space-y-6">
              <div className="sticky top-16 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                <div>
                  <SharePost url={postUrl} title={post.title.rendered} />
                </div>

                <hr className="border-slate-200" />

                {/* Versatile Consultation CTA Box */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Need Accessibility Help?</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
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
                  prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-5
                  prose-a:text-[#0E8168] prose-a:font-semibold hover:prose-a:underline
                  prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 prose-li:text-slate-700
                  prose-blockquote:border-l-4 prose-blockquote:border-[#0E8168] prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: postContent }}
                suppressHydrationWarning
              />

              {/* General Accessibility Services Banner */}
              <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900 text-white p-8 rounded-2xl">
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Achieve Digital Accessibility Compliance</h4>
                  <p className="text-sm text-slate-300">Explore our manual WCAG auditing, website remediation, PDF compliance, and consulting services.</p>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 bg-[#0E8168] hover:bg-[#0a6b57] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm shrink-0"
                >
                  Explore Services <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* RankMath JSON-LD Schema */}
        {post.rankMathSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: post.rankMathSchema }}
          />
        )}
      </main>
    </div>
  )
}
