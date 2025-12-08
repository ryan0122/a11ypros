import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
    title: 'Free Consultation - Expert ADA Audit and Remediation Services - A11Y Pros',
    description: 'Book a free 30-minute consultation for expert ADA website audit and remediation services. Over 3,200 ADA website lawsuits filed in 2025. Get trusted manual audits and human remediation.',
    openGraph: {
        title: 'Free Consultation - Expert ADA Audit and Remediation Services - A11Y Pros',
        description: 'Book a free 30-minute consultation for expert ADA website audit and remediation services.',
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'}/free-consultation`,
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
        title: 'Free Consultation - Expert ADA Audit and Remediation Services - A11Y Pros',
        description: 'Book a free 30-minute consultation for expert ADA website audit and remediation services.',
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'}/free-consultation`,
    },
}

export default function FreeConsultationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}

