'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Input from '@/components/forms/Input'
import { checkScanUrl } from '@/lib/utils/scanUrl'
import { recordNetlifySubmission } from '@/utils/recordNetlifySubmission'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = { url?: string; email?: string }

export default function FreeScanForm() {
    const [url, setUrl] = useState('')
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<Errors>({})
    const [submitError, setSubmitError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const urlRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const confirmationRef = useRef<HTMLHeadingElement>(null)

    // The scan worker sleeps when idle; wake it now so submitting is quick.
    useEffect(() => {
        fetch('/api/scan').catch(() => {})
    }, [])

    useEffect(() => {
        if (submitted) confirmationRef.current?.focus()
    }, [submitted])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (submitting) return
        setSubmitError('')

        const next: Errors = {}
        const checkedUrl = checkScanUrl(url)
        if (!checkedUrl.ok) next.url = checkedUrl.error
        if (!EMAIL.test(email.trim())) next.email = 'Enter an email address, for example you@company.com.'
        setErrors(next)
        if (!checkedUrl.ok) return urlRef.current?.focus()
        if (next.email) return emailRef.current?.focus()

        const honeypot = new FormData(e.currentTarget).get('bot-field')
        setSubmitting(true)
        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: checkedUrl.url, email: email.trim(), 'bot-field': honeypot || '' }),
            })
            if (!res.ok) {
                const body = (await res.json().catch(() => ({}))) as { message?: string }
                throw new Error(body.message || 'We could not start your check. Please try again in a minute.')
            }
            recordNetlifySubmission({ 'form-name': 'free-scan', email: email.trim(), url: url.trim() })
            setSubmitted(true)
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'We could not start your check. Please try again in a minute.')
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="rounded-2xl border border-[#0E8168] bg-[#0E8168]/5 p-8">
                <h2 ref={confirmationRef} tabIndex={-1} className="mb-3 text-2xl font-bold text-slate-900">
                    Confirm your email to start the check
                </h2>
                <p className="text-slate-700">
                    We sent a confirmation link to <strong>{email.trim()}</strong>. Select it and we&apos;ll check{' '}
                    <strong>{url.trim()}</strong>. The results arrive by email a few minutes later.
                </p>
                <p className="mt-4 text-sm text-slate-600">
                    Nothing arrived? Check your spam folder, or{' '}
                    <Link href="/contact-us?from=free-accessibility-scan" className="font-semibold text-[#0E8168] underline">
                        contact us
                    </Link>
                    .
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-slate-200 border-t-4 border-t-[#0E8168] bg-white p-6 shadow-lg sm:p-8">
            {/* Honeypot for bot detection */}
            <p className="hidden" aria-hidden="true">
                <label>
                    Don’t fill this out if you are human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
            </p>

            <p className="mb-5 text-sm text-slate-600">Both fields are required.</p>

            <Input
                ref={urlRef}
                label="Website address"
                name="url"
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                placeholder="example.com"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                errorText={errors.url}
                aria-invalid={errors.url ? true : undefined}
                className="text-slate-900 [&_input]:rounded-lg [&_input]:border [&_input]:border-slate-500 [&_input]:px-4 [&_input]:py-3"
            />
            <Input
                ref={emailRef}
                label="Email for your results"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                errorText={errors.email}
                aria-invalid={errors.email ? true : undefined}
                className="text-slate-900 [&_input]:rounded-lg [&_input]:border [&_input]:border-slate-500 [&_input]:px-4 [&_input]:py-3"
            />

            {/* Always rendered so screen readers announce a message added to it. */}
            <p role="alert" className="mb-4 text-sm font-medium text-red-700 empty:mb-0">
                {submitError}
            </p>

            {/* aria-disabled, not disabled: disabling the focused button drops focus to <body> */}
            <button
                type="submit"
                aria-disabled={submitting || undefined}
                className="w-full rounded-lg bg-[#0E8168] px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-[#0a6b57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E8168] aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
            >
                {submitting ? 'Starting your check…' : 'Start my free check'}
            </button>
            <p role="status" className="sr-only">
                {submitting ? 'Starting your check…' : ''}
            </p>
            <p className="mt-4 text-sm text-slate-600">
                We&apos;ll email you a link to confirm before anything is checked, then send the results. We check only
                the address you enter.
            </p>
        </form>
    )
}
