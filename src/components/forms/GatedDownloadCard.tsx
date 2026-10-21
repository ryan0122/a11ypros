'use client'

import React, { useState, useRef, useId } from 'react'
import { Download, CheckCircle2, FileText } from 'lucide-react'
import { recordNetlifySubmission } from '@/utils/recordNetlifySubmission'

export interface GatedDownloadProps {
  title: string
  description: string
  fileUrl: string
  buttonText?: string
  postSlug?: string
}

export default function GatedDownloadCard({
  title,
  description,
  fileUrl,
  buttonText = 'Download Free Template',
  postSlug = '',
}: GatedDownloadProps) {
  const [email, setEmail] = useState('')
  const [botField, setBotField] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const baseId = useId()
  const emailInputId = `${baseId}-email`
  const hintId = `${baseId}-hint`
  const errorId = `${baseId}-error`
  const headingId = `${baseId}-heading`

  const downloadLinkRef = useRef<HTMLAnchorElement>(null)

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
      'form-name': 'resource-download',
      'bot-field': botField,
      email: trimmedEmail,
      'resource-title': title,
      'resource-url': fileUrl,
      'post-slug': postSlug,
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

      setUnlocked(true)

      // Trigger automatic file download and move focus to the unlocked download link
      setTimeout(() => {
        if (downloadLinkRef.current) {
          downloadLinkRef.current.focus()
          downloadLinkRef.current.click()
        }
      }, 50)
    } catch {
      setErrorMessage(
        'Sorry, we could not process your request right now. Please try again or email us at info@a11ypros.com.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className="my-10 rounded-2xl border-2 border-[#084A3B] bg-[#F4F9F7] p-6 sm:p-8 text-slate-900 shadow-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#084A3B] text-white"
          >
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#084A3B]">
              Free Accessibility Resource
            </span>
            <h2 id={headingId} className="mt-0.5 text-xl sm:text-2xl font-extrabold text-slate-900">
              {title}
            </h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{description}</p>

        {unlocked ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-2 rounded-xl border border-[#084A3B]/30 bg-white p-5 space-y-4"
          >
            <div className="flex items-start gap-2.5 text-[#084A3B]">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base font-medium text-slate-800">
                Thank you! Your download has started, and we sent a copy of the link to{' '}
                <strong>{email.trim()}</strong>.
              </p>
            </div>
            <div>
              <a
                ref={downloadLinkRef}
                href={fileUrl}
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#084A3B] hover:bg-[#06382C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#084A3B] px-5 py-3 text-sm font-bold text-white transition-colors"
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Download {title}
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-1 space-y-3">
            {/* Honeypot field for bots */}
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
              <label
                htmlFor={emailInputId}
                className="block text-sm font-bold text-slate-900 mb-1.5"
              >
                Work or Personal Email <span aria-hidden="true">*</span>
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
                  className="flex-1 rounded-xl border border-slate-400 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-[#084A3B] focus:outline-none focus:ring-2 focus:ring-[#084A3B]"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#084A3B] hover:bg-[#06382C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#084A3B] px-6 py-3 text-sm sm:text-base font-bold text-white transition-colors disabled:opacity-60 shrink-0"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  {submitting ? 'Unlocking Download...' : buttonText}
                </button>
              </div>
              <p id={hintId} className="mt-1.5 text-xs text-slate-600">
                Enter your email for instant access to the template file (and a backup link in your inbox).
              </p>
            </div>

            <p
              id={errorId}
              role="alert"
              className="text-sm font-semibold text-[#B42318] empty:hidden"
            >
              {errorMessage}
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
