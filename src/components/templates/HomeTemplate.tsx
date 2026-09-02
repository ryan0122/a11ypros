import { getPostsForListing, Post } from '@/lib/api/posts/dataApi'
import ServicesCompact from '@/components/features/ServicesCompact'
import CompliancesCompact from '@/components/features/CompliancesCompact'
import IconHomeHero from '@/components/icons/IconHomeHero'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

export default async function HomeTemplate({
    title,
    content,
}: {
    title?: string
    content?: string
} = {}) {
    void title
    void content
    const posts: Post[] = await getPostsForListing()

    return (
        <div className="font-[family-name:var(--font-inter)] bg-white text-slate-900">
            <main id="main-content" tabIndex={-1}>
                {/* Hero Section */}
                <div className="home-hero isolate mx-auto w-full px-6 py-12 lg:px-8 bg-slate-50 border-b border-slate-200">
                    <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 text-left md:flex-row">
                        <div className="flex flex-col max-w-2xl justify-center md:w-3/5">
                            <h1 className="text-balance text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
                                WCAG, ADA & Section 508
                                <span className="block font-semibold text-2xl sm:text-3xl text-slate-700 mt-1">
                                    Web Accessibility Compliance Consultants
                                </span>
                            </h1>
                            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                                Expert manual auditing, VPAT® / ACR authoring, website remediation, and ADA litigation support by certified accessibility engineers.
                            </p>

                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#0E8168] px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-[#0a6b57] transition-colors"
                                >
                                    View Services & Pricing <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/contact-us"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>

                        <div className="flex justify-center md:w-2/5 w-full">
                            <IconHomeHero aria-hidden="true" />
                        </div>
                    </div>
                </div>

                {/* Visually Appealing Trusted By Section */}
                <section className="py-10 bg-slate-50/80 border-b border-slate-200">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center max-w-xl mx-auto mb-6">
                            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                                Trusted By
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#0E8168] transition-all flex items-center justify-center h-24 group">
                                <Image
                                    src="/coforma_logo.png"
                                    alt="Coforma"
                                    className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                                    width={160}
                                    height={50}
                                />
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#0E8168] transition-all flex items-center justify-center h-24 group">
                                <Image
                                    src="/savvy_insure_logo.webp"
                                    alt="Savvy Insure"
                                    className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                                    width={140}
                                    height={50}
                                />
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#0E8168] transition-all flex items-center justify-center h-24 group">
                                <Image
                                    src="/Mogli_Logo.png"
                                    alt="Mogli"
                                    className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                                    width={140}
                                    height={50}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Compact Services Grid */}
                <ServicesCompact />

                {/* Compact Compliance Standards Bar */}
                <CompliancesCompact />





                {/* Articles List */}
                {posts && posts.length > 0 && (
                    <section className="py-16 bg-white border-t border-slate-100">
                        <div className="max-w-5xl mx-auto px-6">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                                <div>
                                    <span className="text-xs font-bold text-[#0E8168] uppercase tracking-wider block mb-1">
                                        Insights & Best Practices
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                        Accessibility Articles
                                    </h3>
                                </div>
                                <Link
                                    href="/blog"
                                    className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#0E8168] hover:text-[#0a6b57] transition-colors"
                                >
                                    View All Articles
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {posts.slice(0, 3).map((post: Post) => (
                                    <Link
                                        key={post.id}
                                        href={`/blog/${post.slug}`}
                                        className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-[#0E8168]/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden focus-visible:ring-2 focus-visible:ring-[#0E8168] outline-none"
                                    >
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                            {post.featured_image_url ? (
                                                <Image
                                                    src={post.featured_image_url}
                                                    alt=""
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 33vw"
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#084A3B]/10 to-slate-100 text-[#084A3B]">
                                                    <Calendar className="w-8 h-8 opacity-40" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5 flex flex-col flex-1 justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2.5">
                                                    <Calendar className="w-3.5 h-3.5 text-[#0E8168]" />
                                                    <time dateTime={new Date(post.date).toISOString().split('T')[0]}>
                                                        {new Date(post.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </time>
                                                </div>
                                                <h4
                                                    className="font-bold text-base text-slate-900 line-clamp-2 group-hover:text-[#0E8168] transition-colors leading-snug"
                                                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                                />
                                            </div>

                                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#0E8168] group-hover:text-[#0a6b57]">
                                                Read Article
                                                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}
