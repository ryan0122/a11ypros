'use client'

import { useEffect } from 'react'
import { captureLeadSource } from '@/utils/leadSource'

// Records where this visit came from on the first page load; see src/utils/leadSource.ts.
export default function LeadSourceCapture() {
    useEffect(() => {
        captureLeadSource()
    }, [])
    return null
}
