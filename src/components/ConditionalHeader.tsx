'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Hide header on free-accessibility-test page
  if (pathname === '/free-accessibility-test' || pathname === '/free-consultation') {
    return null
  }
  
  return <Header />
}

