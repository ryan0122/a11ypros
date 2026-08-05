import { getPostsForListing, Post } from '@/lib/api/posts/dataApi'
import ServicesCompact from '@/components/features/ServicesCompact'
import CompliancesCompact from '@/components/features/CompliancesCompact'
import IconHomeHero from '@/components/icons/IconHomeHero'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, CheckCircle2, UserCheck, Sparkles, Building2 } from 'lucide-react'

export default async function HomeTemplate({
    content,
}: {
    title: string
    content: string
}) {
    const posts: Post[] = await getPostsForListing()

    return (
        <div className="font-[family-name:var(--font-inter)] bg-white text-slate-900">
            <main id="main-content" tabIndex={-1}>
                {/* Hero Section */}
                <div className="home-hero isolate mx-auto w-full px-6 py-12 lg:px-8 bg-slate-50 border-b border-slate-200">
                    <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 text-left md:flex-row">
                        <div className="flex flex-col max-w-2xl justify-center md:w-3/5">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E8168]/10 text-[#0E8168] text-xs font-bold uppercase tracking-wider mb-3 w-fit">
                                <ShieldCheck className="w-4 h-4" /> Certified WCAG 2.1/2.2 AA & VPAT® Experts
                            </span>
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
                                    href="/vpat-estimator"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#0E8168] px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-[#0a6b57] transition-colors"
                                >
                                    Estimate VPAT Scope <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/contact-us"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-600 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-[#0E8168]" /> 100% Manual Human Testing
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-[#0E8168]" /> Official VPAT® 2.5 ACR
                                </span>
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

                {/* Standalone Interactive Scope Teaser Card */}
                <section className="max-w-5xl mx-auto px-6 py-10">
                    <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="md:w-2/3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8168]/20 border border-[#0E8168]/40 text-[#14b895] text-xs font-bold uppercase tracking-wider mb-3">
                                <Sparkles className="w-3.5 h-3.5" /> Interactive Scope Calculator
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                Calculate Your Audit & VPAT® Scope in 30 Seconds
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Select your product type, target compliance standards, and timeline to receive an instant audit scope estimate and proposal.
                            </p>
                        </div>
                        <div className="md:w-1/3 flex justify-end w-full md:w-auto">
                            <Link
                                href="/vpat-estimator"
                                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#0E8168] hover:bg-[#0a6b57] text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-[#0E8168]/20"
                            >
                                Launch Estimator <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Manual Audit Callout Banner */}
                <section className="py-10 bg-slate-50 border-y border-slate-200">
                    <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <div className="p-3.5 rounded-xl bg-[#0E8168]/10 text-[#0E8168] shrink-0">
                            <UserCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-base mb-1">Why 100% Manual Testing Matters</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Automated accessibility scanners only catch ~40% of WCAG criteria. Key barriers like screen reader DOM order and keyboard focus traps require human testing by certified auditors.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Articles List */}
                {posts && posts.length > 0 && (
                    <section className="py-12 bg-white">
                        <div className="max-w-5xl mx-auto px-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Accessibility Articles</h3>
                                <Link href="/blog" className="text-sm font-semibold text-[#0E8168] hover:underline">
                                    View All Articles →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {posts.slice(0, 3).map((post: Post) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
                                        <h4
                                            className="font-bold text-sm text-slate-900 mb-2 line-clamp-2 hover:text-[#0E8168] transition-colors leading-snug"
                                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                        />
                                        <time dateTime={new Date(post.date).toISOString().split('T')[0]} className="text-slate-500 text-xs">
                                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </time>
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
