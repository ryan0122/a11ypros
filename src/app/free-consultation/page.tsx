'use client'
import IconLogo from '@/components/icons/IconLogo'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import Image from 'next/image'
import { Shield, Users, TrendingUp, Heart, Check } from 'lucide-react'
import IconHomeHero from '@/components/icons/IconHomeHero'

export default function FreeAudit() {
    return (
        <main>
            {/* Hero Section with 2 Columns */}
            <section className="relative bg-gradient-to-br from-[#000f1a] via-[#003d5c] to-[#001d2f] text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0E8168]/20 via-transparent to-[#d4e300]/5"></div>
                <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-16">
                    <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-12">
                        {/* Left Column: Logo and Text */}
                        <div className="flex w-full flex-col lg:w-1/2">
                            <Link
                                href="/"
                                className="mb-8 w-36 no-underline hover:no-underline sm:w-56"
                            >
                                <IconLogo />
                                <span className="sr-only">Home</span>
                            </Link>
                            <h1 className="text-3xl font-bold leading-tight">
                            Expert ADA Audit and Remediation Services
                            </h1>
                            <h2 className="flex items-start gap-3 text-xl text-[#d4e300]">
                             Over 3,200 ADA website lawsuits filed in 2025 alone. We deliver manual audits + human remediation trusted by enterprises and agencies.</h2>
                            <h2 className='mb-0 mt-8'>Deadline: April 24, 2026 for digital accessibility compliance</h2>
                            <p className='font-500 text-xl mt-5mb-10 leading-relaxed'>
                            Americans with Disabilities Act (ADA) Title II accessibility regulations require that by <strong>April 24, 2026</strong>, all state and local government entities must make their digital content fully accessible, including websites, mobile apps, and online course materials. This federal requirement mandates compliance with WCAG 2.1 Level AA standards, ensuring content is usable with assistive technologies like screen readers and keyboard navigation. Public universities, libraries, and government websites must ensure accessibility from the start, including third-party products and services.
                            </p>

                           <p className='font-500 text-2xl text-[#d4e300] font-bold'>Don&apos;t let your website be the next target. Request a free consultation today.</p>
                        </div>

                        {/* Right Column: Contact Form */}
                        <div className="w-full lg:w-1/2">
                            <div id="consultation-form" className="rounded-lg bg-white p-6 text-gray-800 lg:p-8 border-t-8 border-[#0E8168]">
                                <h2 className="mt-0 mb-4 text-3xl font-bold text-gray-900 text-center">
                                    Book a free 30 minute Consultation
                                </h2>
                                <p className="text-center font-semibold">
                                    Fill out the form below and we&apos;ll get back
                                    to you within 24 hours.
                                </p>
                                <ContactForm className='consultation-form' isMainContactForm={true} privacyNoticeId="consultation-privacy-notice" />
                                <p id="consultation-privacy-notice">Your information is used to respond to your consultation request and stored securely in our systems. See our <a href="/privacy-policy">Privacy Policy</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <h2 className='my-5 text-center text-2xl'>Trusted by</h2>
                <div className='flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20 my-10'>
                    {/* I need to add partner and client images here */}
                    <Image src="https://cms.a11ypros.com/wp-content/uploads/2025/05/Mogli_Logo.png" alt="Mogli" width={175} height={122} />
                    <Image src="https://cms.a11ypros.com/wp-content/uploads/2025/05/spry_elephant_logo.png" alt="Spry Elephant" width={175} height={100} />
                    <Image src="https://cms.a11ypros.com/wp-content/uploads/2025/12/webdrips-logo.png" alt="Webdrips" width={175} height={100} />
                </div>
            </section>

            <section className='bg-[#fff]'>
            <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-16">
                <h2 className="text-3xl font-bold mb-6">Why ADA Compliance Matters</h2>
                <p className="mb-12 text-lg">Non-compliance doesn&apos;t just mean legal exposure—it can damage your brand reputation, trigger negative publicity, and alienate potential customers. Achieving ADA compliance protects your business while expanding your reach to millions of users with disabilities, creating a more inclusive and successful digital presence for everyone.</p>
            
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex flex-col items-start">
                        <div className="mb-4 p-3 bg-[#0E8168]/10 rounded-lg">
                            <Shield className="w-8 h-8 text-[#0E8168]" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Legal Protection</h3>
                        <p className="text-gray-700">Protect your business from costly lawsuits and legal penalties. With over 3,200 ADA website lawsuits filed in 2025, compliance is essential for risk mitigation.</p>
                    </div>
                    
                    <div className="flex flex-col items-start">
                        <div className="mb-4 p-3 bg-[#0E8168]/10 rounded-lg">
                            <Users className="w-8 h-8 text-[#0E8168]" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Expand Your Market</h3>
                        <p className="text-gray-700">Reach millions of users with disabilities who represent a significant market segment. Accessible websites improve user experience for everyone, not just those with disabilities.</p>
                    </div>
                    
                    <div className="flex flex-col items-start">
                        <div className="mb-4 p-3 bg-[#0E8168]/10 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-[#0E8168]" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Better SEO Performance</h3>
                        <p className="text-gray-700">Accessible websites rank higher in search results. Search engines favor sites with proper semantic HTML, alt text, and structured content—all key components of ADA compliance.</p>
                    </div>
                    
                    <div className="flex flex-col items-start">
                        <div className="mb-4 p-3 bg-[#0E8168]/10 rounded-lg">
                            <Heart className="w-8 h-8 text-[#0E8168]" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Promote Inclusivity</h3>
                        <p className="text-gray-700">Demonstrate your commitment to equal access and social responsibility. An accessible website shows that your organization values all users and creates a positive brand image that resonates with customers.</p>
                    </div>
                </div>
            </div>
            </section>
            <section>
            <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-16">
                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
                    <div className="w-full lg:w-1/2 flex-shrink-0 flex flex-col justify-center items-center gap-6">
                        <IconHomeHero size="large" aria-hidden="true" />
                        <a 
                            href="#consultation-form"
                            className="px-8 py-4 bg-[#0E8168] text-white font-bold rounded-lg hover:bg-[#0a6b57] transition-colors text-lg no-underline"
                        >
                            Book Free Consultation
                        </a>
                    </div>
                    <div className="w-full lg:w-1/2 flex-shrink-0">
                        <h2 className="text-4xl mb-10">How does ADA compliance auditing work?</h2>
                        <ul className="space-y-6">
                            <li className="flex items-start">
                                <div className="mr-4 flex-shrink-0 w-8 h-8 rounded-full bg-[#0E8168] flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="block text-xl font-bold text-[#001d2f] mb-2">Hire an expert to audit your website or mobile app for ADA compliance</span>
                                    <p className="text-gray-700">Get assessed by a qualified professional who knows how to properly start an ADA audit, what to look for, and how to measure the results comprehensively.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="mr-4 flex-shrink-0 w-8 h-8 rounded-full bg-[#0E8168] flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="block text-xl font-bold text-[#001d2f] mb-2">Determine the best accessibility testing path for your business</span>
                                    <p className="text-gray-700">Align on which WCAG standard you&apos;d like to test against. Choose a representative sample of pages to test for passing or failing accessibility standards.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="mr-4 flex-shrink-0 w-8 h-8 rounded-full bg-[#0E8168] flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="block text-xl font-bold text-[#001d2f] mb-2">Create an accessibility audit report</span>
                                    <p className="text-gray-700">Receive detailed findings with prioritized remediation recommendations and implementation guidance to address accessibility barriers effectively.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="mr-4 flex-shrink-0 w-8 h-8 rounded-full bg-[#0E8168] flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="block text-xl font-bold text-[#001d2f] mb-2">Receive VPAT/ACR documentation</span>
                                    <p className="text-gray-700">After remediation, we deliver a VPAT (Voluntary Product Accessibility Template) or ACR (Accessibility Conformance Report) documenting your compliance status.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                </div>
            </section>
            
        </main>
    )
}
