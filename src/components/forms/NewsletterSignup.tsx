'use client'

import React, { useState, useId } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react'
import { recordNetlifySubmission } from '@/utils/recordNetlifySubmission'

const NEWSLETTER_TOPICS = [
  'Legal News',
  'Best Practice Guides',
  'Benefits of Accessibility',
  'Lessons Learned',
  'Free Resources',
]

export interface NewsletterSignupProps {
  /**
   * 'banner' (default): wide 2-column section for footers / page bottoms.
   * 'sidebar': compact vertical card for article and page sidebars.
   */
  variant?: 'banner' | 'sidebar'
  headingLevel?: 'h2' | 'h3' | 'h4'
}

export default function NewsletterSignup({
  variant = 'banner',
  headingLevel = variant === 'sidebar' ? 'h4' : 'h2',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [botField, setBotField] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const pathname = usePathname()
  const baseId = useId()
  const emailInputId = `${baseId}-newsletter-email`
  const hintId = `${baseId}-newsletter-hint`
  const errorId = `${baseId}-newsletter-error`
  const headingId = `${baseId}-newsletter-heading`

  const HeadingTag = headingLevel

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')

    const trimmedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address (for example, name@organization.com).')
      return
    }

    setSubmitting(true)

    const fields: Record<string, string> = {
      'form-name': 'newsletter-signup',
      'bot-field': botField,
      email: trimmedEmail,
      'signup-page': pathname || '/',
    }

    recordNetlifySubmission(fields)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })

      if (!res.ok) {
        throw new Error(`Status ${res.status}`)
      }

      setSubscribed(true)
    } catch {
      setErrorMessage(
        'Sorry, we could not subscribe your email right now. Please try again or email info@a11ypros.com.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (variant === 'sidebar') {
    return (
      <div
        aria-labelledby={headingId}
        className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Mail aria-hidden="true" className="w-4 h-4 text-[#084A3B] shrink-0" />
          <HeadingTag id={headingId} className="text-xs font-bold text-slate-900 leading-snug">
            Stay Informed
          </HeadingTag>
        </div>

        <ul aria-label="Newsletter topics" className="flex flex-wrap gap-1.5">
          {NEWSLETTER_TOPICS.map((topic) => (
            <li
              key={topic}
              className="inline-flex items-center rounded-md bg-[#084A3B]/10 px-2 py-0.5 text-[10px] font-semibold text-[#084A3B]"
            >
              {topic}
            </li>
          ))}
        </ul>

        {subscribed ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-[#084A3B]/30 bg-[#F4F9F7] p-3 text-xs text-slate-800 flex items-start gap-2"
          >
            <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-[#084A3B] shrink-0 mt-0.5" />
            <span>
              You&apos;re subscribed! We&apos;ll send accessibility updates to{' '}
              <strong>{email.trim()}</strong>.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
            <div className="hidden" aria-hidden="true">
              <label htmlFor={`${baseId}-bot`}>Do not fill this out if you are human</label>
              <input
                id={`${baseId}-bot`}
                type="text"
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor={emailInputId} className="block text-[11px] font-bold text-slate-900 mb-1">
                Email Address <span aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                id={emailInputId}
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={errorMessage ? 'true' : 'false'}
                aria-describedby={errorMessage ? `${hintId} ${errorId}` : hintId}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-500 focus:border-[#084A3B] focus:outline-none focus:ring-2 focus:ring-[#084A3B]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-1.5 w-full bg-[#084A3B] hover:bg-[#06382C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#084A3B] text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {submitting ? 'Subscribing...' : 'Subscribe'} <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
            </button>

            <p id={hintId} className="text-[10px] text-slate-600 leading-snug">
              Occasional accessibility updates. Unsubscribe anytime.{' '}
              <Link href="/privacy-policy" className="font-semibold text-[#084A3B] underline">
                Privacy Policy
              </Link>
              .
            </p>

            <p id={errorId} role="alert" className="text-xs font-semibold text-[#B42318] empty:hidden">
              {errorMessage}
            </p>
          </form>
        )}
      </div>
    )
  }

  return (
    <div
      aria-labelledby={headingId}
      className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 text-white shadow-lg"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        <div className="lg:col-span-6 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Mail aria-hidden="true" className="w-4 h-4" /> Accessibility Insights Newsletter
          </div>
          <HeadingTag id={headingId} className="text-2xl sm:text-3xl font-extrabold text-white">
            Stay Informed
          </HeadingTag>
          <ul aria-label="Topics covered in our newsletter" className="flex flex-wrap gap-2 pt-1">
            {NEWSLETTER_TOPICS.map((topic) => (
              <li
                key={topic}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-200"
              >
                <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          {subscribed ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border border-emerald-500/40 bg-emerald-950/50 p-5 text-sm text-emerald-100 flex items-start gap-3"
            >
              <CheckCircle2 aria-hidden="true" className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Thanks for subscribing!</p>
                <p className="mt-1 text-emerald-200">
                  We&apos;ve added <strong>{email.trim()}</strong> to our accessibility updates list.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
              <div className="hidden" aria-hidden="true">
                <label htmlFor={`${baseId}-bot`}>Do not fill this out if you are human</label>
                <input
                  id={`${baseId}-bot`}
                  type="text"
                  name="bot-field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor={emailInputId} className="block text-xs font-bold text-slate-200 mb-1.5">
                  Email Address <span aria-hidden="true">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id={emailInputId}
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={errorMessage ? 'true' : 'false'}
                    aria-describedby={errorMessage ? `${hintId} ${errorId}` : hintId}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm sm:text-base text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E8168] hover:bg-[#0a6b57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 px-6 py-3 text-sm sm:text-base font-bold text-white transition-colors disabled:opacity-60 shrink-0"
                  >
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                    <ArrowRight aria-hidden="true" className="w-4 h-4" />
                  </button>
                </div>
                <p id={hintId} className="mt-2 text-xs text-slate-300 leading-relaxed">
                  We collect your email to send occasional digital accessibility updates and resources. Unsubscribe anytime. View our{' '}
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-emerald-300 underline hover:text-emerald-200"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <p id={errorId} role="alert" className="text-sm font-semibold text-red-300 empty:hidden">
                {errorMessage}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
