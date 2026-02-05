import { getPostsForListing, Post } from '@/lib/api/posts/dataApi'
import Services from '@/components/features/Services'
import Compliances from '@/components/features/Compliances'
import IconHomeHero from '@/components/icons/IconHomeHero'
import Image from 'next/image'
import Link from 'next/link'
import IconManualAudit from '@/components/icons/IconManualAudit'

export default async function HomeTemplate({
    content,
}: {
    title: string
    content: string
}) {
    const posts: Post[] = await getPostsForListing() // ✅ Optimized: fast fetch without RankMath

    return (
        <div className="font-[family-name:var(--font-inter)]">
            <div className="home-hero isolate mx-auto w-full px-6 py-14 pt-0 sm:pt-14 lg:px-8">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-left md:flex-row">
				<div className="mx-auto mt-8 flex flex-col max-w-6xl justify-center md:w-1/2">
					<h1 className="text-balance text-4xl tracking-tight md:text-5xl w-full">
                        WCAG, ADA & Section 508
                        <span className="block font-semibold">
                            Web Accessibility Compliance Consultants
                        </span>
                    </h1>
                   
                        <a
                            href="#contactForm"
                            className="rounded-lg w-fit mt-8 text-center  px-8 py-4 text-xl font-semibold bg-white hover:text-white text-#0E8168 border-2 border-[#0E8168] transition-colors hover:bg-[#0a6b57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E8168]"
                        >
                            Schedule a Free Consultation
                        </a>
                    </div>

                    <div className="flex justify-center md:w-1/2">
                        <IconHomeHero aria-hidden="true" />
                    </div>
                </div>
            </div>
            <main id="main-content" tabIndex={-1}>
                <section className="home-content isolate w-full py-10 text-center">
                    <div
                        className="content mx-auto max-w-6xl px-10 text-xl"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </section>
                <section className="max-full bg-white">
                    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 pb-20 pt-10 md:flex-row">
                        <div className="flex-shrink-0 md:w-1/2">
                            <IconManualAudit />
                        </div>
                        <div className="px-10 text-center md:w-1/2 md:px-0 md:text-left">
                            <h3>
                                Why WCAG Testing for ADA Web Compliance Requires
                                Manual Auditing
                            </h3>
                            <p className="text-xl">
                                Automated accessibility testing tools, including
                                those with AI capabilities, are essential for
                                identifying certain web accessibility issues
                                efficiently. However, these tools alone can only
                                detect about 40% of WCAG success criteria,
                                leaving a significant gap that requires manual
                                human testing to ensure full compliance.
                            </p>
                            <p className="text-center text-xl">
                                <strong>
                                    Manual human testing. No Shortcuts. <br />
                                    Expert Audits for True WCAG Compliance.
                                </strong>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Compliances showHeading={true} />
            <Services showHeading />
            <section className="mx-auto max-w-6xl items-center px-10 pb-20 pt-10 text-center">
                <h2 className="page-heading">Accessibility Articles</h2>
                {/* render blog posts here */}
                <ul className="articles-list grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.slice(0, 6).map((post: Post) => (
                        <li
                            key={post.id}
                            className="rounded-lg border border-gray-300 bg-white p-6 shadow-md"
                        >
                            <Link href={`/blog/${post.slug}`}>
                                {/* ✅ Featured Image */}
                                {post.featured_image_url && (
                                    <div className="mb-4">
                                        <Image
                                            src={post.featured_image_url}
                                            alt={`${post.title.rendered}`}
                                            className="h-48 w-full"
                                            loading="lazy"
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                )}
                                <h3
                                    dangerouslySetInnerHTML={{
                                        __html: post.title.rendered,
                                    }}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
                {/* View More Link */}
                <div className="mt-12">
                    <Link
                        href="/blog"
                        className="inline-block rounded-lg border-2 border-[#0E8168] px-4 py-2 text-xl font-semibold hover:underline"
                    >
                        View All Articles
                    </Link>
                </div>
            </section>
        </div>
    )
}
