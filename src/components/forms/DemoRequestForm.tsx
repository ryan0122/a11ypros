'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/forms/Input'
import TextArea from '@/components/forms/TextArea'
import Button from '@/components/forms/Button'
import { recordNetlifySubmission } from '@/utils/recordNetlifySubmission'
import { getLeadSourceFields } from '@/utils/leadSource'

/** The A11Y Studio plans someone can say they're interested in. Keep in step with StudioPlans. */
export const DEMO_PLANS: Record<string, string> = {
    shield: 'A11y Shield',
    pro: 'Assurance Pro',
    partner: 'Partner',
}

const SITE_SIZES = ['Under 100 pages', '100 to 500 pages', 'More than 500 pages', 'Not sure']
const TRACKERS = ['GitHub', 'Jira', 'Azure DevOps', 'Something else', 'We don’t use one']

type Required = 'contact-first-name' | 'contact-last-name' | 'contact-email' | 'organization-name' | 'website-url'
const REQUIRED_ORDER: Required[] = ['contact-first-name', 'contact-last-name', 'contact-email', 'organization-name', 'website-url']

const selectClass =
    'w-full rounded-md border-2 border-[#001d2f] bg-white p-2 text-base font-medium text-slate-800 focus:border-[#0E8168] focus:outline focus:outline-2 focus:outline-transparent focus:shadow-[0_0_0_2px_#fff,0_0_0_5px_#0E8168]'

function validate(data: FormData): Partial<Record<Required, string>> {
    const errors: Partial<Record<Required, string>> = {}
    const value = (name: Required) => String(data.get(name) ?? '').trim()
    if (!value('contact-first-name')) errors['contact-first-name'] = 'Enter your first name'
    if (!value('contact-last-name')) errors['contact-last-name'] = 'Enter your last name'
    if (!value('contact-email')) errors['contact-email'] = 'Enter your work email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('contact-email'))) errors['contact-email'] = 'Enter an email address like name@company.com'
    if (!value('organization-name')) errors['organization-name'] = 'Enter your organization'
    if (!value('website-url')) errors['website-url'] = 'Enter the website you want monitored'
    else if (!/^(https?:\/\/)?[^\s/.]+\.[^\s]+$/i.test(value('website-url'))) errors['website-url'] = 'Enter a website address like example.com'
    return errors
}

/** A short form for booking an A11Y Studio demo. It goes to the lead inbox as "book-a-demo". */
export default function DemoRequestForm({ plan, privacyNoticeId }: { plan?: string; privacyNoticeId?: string }) {
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const [errors, setErrors] = useState<Partial<Record<Required, string>>>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const errorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (submitError) errorRef.current?.focus()
    }, [submitError])

    // Clear a field's message as soon as what's typed is valid. Not on blur: clearing it then
    // shifts the form while the submit button is being clicked, and the click misses.
    const clearIfFilled = (name: Required) => () => {
        if (!errors[name]) return
        const data = new FormData(formRef.current!)
        if (!validate(data)[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const data = new FormData(form)
        const found = validate(data)
        setErrors(found)
        const first = REQUIRED_ORDER.find((name) => found[name])
        if (first) {
            form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus()
            return
        }
        if (data.get('bot-field')) {
            router.push('/book-a-demo/thank-you')
            return
        }

        setSubmitError(null)
        setIsSubmitting(true)
        data.set('source-page', window.location.pathname)
        const from = new URLSearchParams(window.location.search).get('from')
        if (from && /^[\w/-]{1,100}$/.test(from)) data.set('referred-from', from)
        Object.entries(getLeadSourceFields()).forEach(([key, value]) => data.set(key, value))

        const fields: Record<string, string> = {}
        data.forEach((value, key) => {
            if (typeof value === 'string') fields[key] = value
        })
        recordNetlifySubmission(fields)

        try {
            const res = await fetch('/api/contact', { method: 'POST', body: data })
            if (!res.ok) {
                const body = await res.json().catch(() => null)
                throw new Error(body?.message || `Server responded with ${res.status}`)
            }
            router.push('/book-a-demo/thank-you')
        } catch (error) {
            setSubmitError(
                error instanceof TypeError
                    ? 'We couldn’t reach our server. Check your connection and try again.'
                    : 'Your request didn’t go through. Please try again, or call us at +1 (720) 722-1775.',
            )
            setIsSubmitting(false)
        }
    }

    return (
        <form
            ref={formRef}
            name="book-a-demo"
            method="POST"
            noValidate
            onSubmit={handleSubmit}
            aria-describedby={privacyNoticeId}
            className="text-slate-800"
        >
            <input type="hidden" name="form-name" value="book-a-demo" />
            <p className="hidden" aria-hidden="true">
                <label>
                    Don’t fill this out if you are human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
            </p>

            {submitError && (
                <div ref={errorRef} tabIndex={-1} role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    {submitError}
                </div>
            )}

            <p className="mt-0 mb-4 text-xs text-slate-600">
                <span className="text-[#da3940]">*</span> indicates a required field
            </p>

            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <Input label="First name" name="contact-first-name" id="demo-first-name" autoComplete="given-name" required
                    errorText={errors['contact-first-name']} aria-invalid={!!errors['contact-first-name']} onChange={clearIfFilled('contact-first-name')} disabled={isSubmitting} />
                <Input label="Last name" name="contact-last-name" id="demo-last-name" autoComplete="family-name" required
                    errorText={errors['contact-last-name']} aria-invalid={!!errors['contact-last-name']} onChange={clearIfFilled('contact-last-name')} disabled={isSubmitting} />
            </div>
            <Input label="Work email" name="contact-email" id="demo-email" type="email" autoComplete="email" required
                errorText={errors['contact-email']} aria-invalid={!!errors['contact-email']} onChange={clearIfFilled('contact-email')} disabled={isSubmitting} />
            <Input label="Organization" name="organization-name" id="demo-organization" autoComplete="organization" required
                errorText={errors['organization-name']} aria-invalid={!!errors['organization-name']} onChange={clearIfFilled('organization-name')} disabled={isSubmitting} />
            <Input label="Website to monitor" name="website-url" id="demo-website" type="url" inputMode="url" autoComplete="url" placeholder="example.com" required
                errorText={errors['website-url']} aria-invalid={!!errors['website-url']} onChange={clearIfFilled('website-url')} disabled={isSubmitting} />

            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <div className="mb-5 flex flex-col">
                    <label htmlFor="demo-site-size" className="mb-2 block">About how many pages?</label>
                    <select id="demo-site-size" name="site-size" defaultValue="" className={selectClass} disabled={isSubmitting}>
                        <option value="">Choose one</option>
                        {SITE_SIZES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div className="mb-5 flex flex-col">
                    <label htmlFor="demo-tracker" className="mb-2 block">Issue tracker</label>
                    <select id="demo-tracker" name="issue-tracker" defaultValue="" className={selectClass} disabled={isSubmitting}>
                        <option value="">Choose one</option>
                        {TRACKERS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                </div>
            </div>
            <div className="mb-5 flex flex-col">
                <label htmlFor="demo-plan" className="mb-2 block">Plan you’re interested in</label>
                <select id="demo-plan" name="plan-interest" defaultValue={plan && DEMO_PLANS[plan] ? DEMO_PLANS[plan] : ''} className={selectClass} disabled={isSubmitting}>
                    <option value="">Not sure yet</option>
                    {Object.values(DEMO_PLANS).map((p) => <option key={p}>{p}</option>)}
                </select>
            </div>
            <TextArea label="Anything we should know? (optional)" name="contact-message" id="demo-notes" disabled={isSubmitting}
                placeholder="For example, a deadline, a recent audit, or who else should join." />

            <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-xl border-none px-6 py-4 text-center text-base font-bold text-white shadow-md transition-all ${isSubmitting ? 'cursor-not-allowed bg-slate-500' : 'bg-[#0E8168] hover:bg-[#0a6b57]'}`}
            >
                {isSubmitting ? 'Sending…' : 'Book a demo'}
            </Button>
        </form>
    )
}
