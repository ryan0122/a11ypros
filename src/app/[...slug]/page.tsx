import { notFound } from 'next/navigation'
import PageTemplate from '@/components/templates/PageTemplate'
import type { Metadata } from 'next'
import { getPageData, getPageMetaData } from '@/lib/api/pages/dataApi'
import he from 'he'
import FAQAccordion from '@/components/ui/FaqAccordion'
import PricingCards from '@/components/ui/PricingCards'

type FAQ = {
    question: string
    answer: string
}

type PageProps = {
    params: Promise<{ slug: string[] }> // Await this
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const dynamic = 'force-dynamic';

// 🛠 Fetch Metadata for SEO
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const resolvedParams = await params

    if (
        !resolvedParams ||
        !Array.isArray(resolvedParams.slug) ||
        resolvedParams.slug.length === 0
    ) {
        return {
            title: 'Page Not Found - A11Y Pros',
            description: 'The page you are looking for does not exist.',
        }
    }

    const [parentSlug, childSlug] = resolvedParams.slug
    const fullSlug = childSlug ? `${parentSlug}/${childSlug}` : parentSlug

    const [page, seoData] = await Promise.all([
        getPageData(childSlug),
        getPageMetaData(fullSlug),
    ])

    if (!page) {
        return {
            title: 'Page Not Found - A11Y Pros',
            description: 'The page you are looking for does not exist.',
        }
    }

    const decodedTitle = he.decode(page.title.rendered)

    return {
        title: `${decodedTitle} - A11Y Pros`,
        description:
            seoData?.description ||
            'A11Y Pros provides trusted accessibility services.',
        openGraph: {
            title: `${decodedTitle} - A11Y Pros`,
            description: seoData?.description,
            url: `${process.env.NEXT_PUBLIC_URL}/${fullSlug}`,
            type: 'website',
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_URL}/og_banner.jpg`,
                    alt: 'A11Y Pros Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${decodedTitle} - A11Y Pros`,
            description: seoData?.description,
            images: [`${process.env.NEXT_PUBLIC_URL}/og_banner.jpg`],
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/${fullSlug}`,
        },
    }
}

// 🛠 Render Page
export default async function Page({ params }: PageProps) {
    const resolvedParams = await params

    if (!resolvedParams?.slug) {
        console.error('❌ ERROR: Missing slug param')
        notFound()
    }

    // Exclude /sales paths - let the server handle PHP files directly
    if (resolvedParams.slug[0] === 'sales') {
        notFound()
    }

    if (resolvedParams?.slug?.join('/') === 'sitemap.xml') {
        return notFound()
    }

    const slugArray =
        resolvedParams.slug[0] === 'pages'
            ? resolvedParams.slug.slice(1)
            : resolvedParams.slug
    const slug = slugArray[slugArray.length - 1]
    const [parentSlug, childSlug] = resolvedParams.slug
    const fullSlug = childSlug ? `${parentSlug}/${childSlug}` : parentSlug

    const [page, seoData] = await Promise.all([
        getPageData(childSlug),
        getPageMetaData(fullSlug),
    ])

    if (!page) {
        console.warn('⚠️ No page found for:', slug)
        notFound()
    }

    const expectedPath = page.parentSlug
        ? [page.parentSlug, page.slug]
        : [page.slug]

    if (JSON.stringify(slugArray) !== JSON.stringify(expectedPath)) {
        console.error(
            `❌ ERROR: Mismatch in URL structure. Expected: /${expectedPath.join('/')}, Got: /${slugArray.join('/')}`
        )
        notFound()
    }

    return (
        <>
            {/* ✅ Inject JSON-LD Schema from RankMath */}
            {seoData?.rankMathSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: seoData.rankMathSchema }}
                />
            )}
            {/* ACF FAQ schema – generated in Next.js (bypasses all Rank Math bugs) */}
            {page.faqs && page.faqs.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'FAQPage',
                            mainEntity: page.faqs
                                .filter((faq: FAQ) => faq && (faq.question || faq.answer))
                                .map((faq: FAQ) => ({
                                    '@type': 'Question',
                                    name: (faq.question || '')
                                        .replace(/&/g, '&amp;')
                                        .replace(/</g, '&lt;')
                                        .replace(/>/g, '&gt;'),
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: (faq.answer || '')
                                            .replace(/&/g, '&amp;')
                                            .replace(/</g, '&lt;')
                                            .replace(/>/g, '&gt;'),
                                    },
                                })),
                        }),
                    }}
                />
            )}

            {/* ✅ Pricing Page OfferCatalog & Service Schema */}
            {page.slug === 'pricing' && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebPage',
                            name: 'Digital Accessibility Services & Pricing Rates - A11Y Pros',
                            description: 'Transparent pricing for manual WCAG audits, technical consulting ($195/hr), itemized page rates, VPAT/ACR reports, and website remediation.',
                            url: `${process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'}/pricing`,
                            mainEntity: {
                                '@type': 'OfferCatalog',
                                name: 'Digital Accessibility Audit & Consulting Services',
                                itemListElement: [
                                    {
                                        '@type': 'Offer',
                                        'itemOffered': {
                                            '@type': 'Service',
                                            name: 'Figma Design Accessibility Audit',
                                            description: 'Evaluate Figma design systems, component libraries, and UI specs for WCAG 2.1/2.2 AA compliance before development.',
                                        },
                                        priceSpecification: {
                                            '@type': 'PriceSpecification',
                                            price: '950.00',
                                            priceCurrency: 'USD',
                                        },
                                    },
                                    {
                                        '@type': 'Offer',
                                        'itemOffered': {
                                            '@type': 'Service',
                                            name: 'WCAG Manual Accessibility Audit',
                                            description: '100% human screen reader & keyboard testing for websites and web apps with prioritized remediation spreadsheet.',
                                        },
                                        priceSpecification: {
                                            '@type': 'PriceSpecification',
                                            price: '1450.00',
                                            priceCurrency: 'USD',
                                        },
                                    },
                                    {
                                        '@type': 'Offer',
                                        'itemOffered': {
                                            '@type': 'Service',
                                            name: 'VPAT / ACR Authoring Package',
                                            description: 'Comprehensive manual audit + official VPAT 2.5 ACR report authoring for enterprise procurement.',
                                        },
                                        priceSpecification: {
                                            '@type': 'PriceSpecification',
                                            price: '1800.00',
                                            priceCurrency: 'USD',
                                        },
                                    },
                                ],
                            },
                        }),
                    }}
                />
            )}

            {/* ✅ Render Page Content */}
            <PageTemplate
                slug={page.slug}
                title={page.title.rendered}
                content={page.content.rendered}
                featuredImage={page.featuredImage}
            />

            {/* ✅ Render Pricing Cards Module for audit service pages */}
            {['wcag-compliance-auditing'].includes(page.slug) && (
                <div className="max-w-6xl mx-auto px-6 pt-12 sm:pt-16">
                    <PricingCards />
                </div>
            )}

            {/* ✅ Render FAQ Accordion */}
            {page.faqs.length > 0 && (
                <FAQAccordion
                    title={`${he.decode(page.title.rendered)} FAQs`}
                    faqs={page.faqs}
                />
            )}
        </>
    )
}
