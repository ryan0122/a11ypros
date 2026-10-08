import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ApexCut 9000 Industrial CNC Gantry | A11Y Pros Audit Demonstration',
  description: 'Sample evaluation page containing intentional WCAG 2.1 / 2.2 AA violations for demonstration of audit spreadsheet action items.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
}

export default function AuditTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
