import type { Metadata } from 'next'

// page.tsx is a client component, so its metadata has to live here.
const title = 'Free Accessibility Audit - Manual WCAG Teaser Audit - A11Y Pros'
const description =
    "Request a free manual accessibility audit. Certified testers check your site's keyboard and screen reader flows and send a video breakdown in 24 hours."
const url = `${process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'}/free-accessibility-audit`

export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title,
        description,
        type: 'website',
        url,
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'}/og_banner.jpg`,
                alt: 'A11Y Pros Logo',
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
    },
    alternates: {
        canonical: url,
    },
}

export default function FreeAccessibilityAuditLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
