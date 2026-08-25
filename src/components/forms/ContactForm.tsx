'use client'

import React, { useEffect, useRef, useState } from 'react'
import FieldSet from '@/components/forms/FieldSet'
import Input from '@/components/forms/Input'
import TextArea from '@/components/forms/TextArea'
import Button from '@/components/forms/Button'
import { useRouter, usePathname } from 'next/navigation'
import cx from 'clsx'
import { submitToVtiger } from '@/utils/submitToVtiger'

let globalCount = 0

interface ContactFormProps {
    isMainContactForm?: boolean
    className?: string
    privacyNoticeId?: string
    submitToVtiger?: boolean
}

type FieldName =
    | 'contact-first-name'
    | 'contact-last-name'
    | 'organization-name'
    | 'contact-phone'
    | 'contact-email'
    | 'contact-message'

const ContactForm: React.FC<ContactFormProps> = ({
    isMainContactForm = false,
    className,
    privacyNoticeId,
    submitToVtiger: shouldSubmitToVtiger = false,
}) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const formRef = useRef<HTMLFormElement>(null)

    const inputRefs = {
        'contact-first-name': useRef<HTMLInputElement>(null),
        'contact-last-name': useRef<HTMLInputElement>(null),
        'organization-name': useRef<HTMLInputElement>(null),
        'contact-email': useRef<HTMLInputElement>(null),
        'contact-phone': useRef<HTMLInputElement>(null),
    }

    const messageRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        setErrors({})
        setSubmitError(null)
        setIsSubmitting(false)
        formRef.current?.reset()
    }, [pathname])

    const validateForm = (formData: FormData) => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.get('contact-first-name')) {
            newErrors['contact-first-name'] = 'First name is required'
        }
        if (!formData.get('contact-last-name')) {
            newErrors['contact-last-name'] = 'Last name is required'
        }
        if (!formData.get('organization-name')) {
            newErrors['organization-name'] = 'Organization is required'
        }
        if (!formData.get('contact-email')) {
            newErrors['contact-email'] = 'Email is required'
        } else if (
            !/\S+@\S+\.\S+/.test(formData.get('contact-email') as string)
        ) {
            newErrors['contact-email'] = 'Email is invalid'
        }

        const phoneValue = formData.get('contact-phone') as string
        if (phoneValue) {
            const digitsOnly = phoneValue.replace(/[^\d]/g, '')
            const isValidFormat = /^(\+\d{1,4}[-.\s()]?)?[\d\s\-\(\)\.]{7,}$/.test(phoneValue)
            const hasEnoughDigits = digitsOnly.length >= 10

            if (!isValidFormat || !hasEnoughDigits) {
                newErrors['contact-phone'] = 'Phone number is invalid.'
            }
        }

        return newErrors
    }

    const isPartnerForm =
        pathname ===
        '/services/accessibility-partnerships-for-agencies-dev-teams'

    const handleBlur = (field: FieldName) => {
        const ref =
            field === 'contact-message'
                ? messageRef.current
                : inputRefs[field].current

        const value = ref?.value.trim()

        // Only validate if there's an error already set for that field
        if (!errors[field]) return

        if (field === 'contact-email') {
            if (!value) return // still empty, keep error
            if (!/\S+@\S+\.\S+/.test(value)) return // still invalid

            // Valid now, clear error
            setErrors((prev) => {
                const rest = Object.fromEntries(
                    Object.entries(prev).filter(([key]) => key !== field)
                )
                return rest
            })
        } else {
            // For all other fields, just clear error if value is not empty
            if (value) {
                setErrors((prev) => {
                    const rest = Object.fromEntries(
                        Object.entries(prev).filter(([key]) => key !== field)
                    )
                    return rest
                })
            }
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formElement = event.currentTarget
        const formData = new FormData(formElement)
        const newErrors = validateForm(formData)

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            const firstErrorField = Object.keys(newErrors)[0] as FieldName

            if (firstErrorField === 'contact-message') {
                messageRef.current?.focus()
            } else {
                inputRefs[firstErrorField]?.current?.focus()
            }

            return
        }

        setErrors({})
        setSubmitError(null)
        setIsSubmitting(true)

        // Spam protection: honeypot check
        const honeypot = formData.get('bot-field')
        if (honeypot) {
            // Silently redirect if bot fills hidden field
            router.push('/contact-us-thank-you')
            return
        }

        globalCount++
        const unitTag = `wpcf7-f$55-o${globalCount}`
        formData.append('_wpcf7_unit_tag', unitTag)

        try {
            // Submit form data to internal Next.js API endpoint
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
            }

            // Submit to vtiger CRM (non-blocking) - only if prop is enabled
            if (shouldSubmitToVtiger) {
                submitToVtiger(formData).catch((err) => {
                    console.error('Error submitting to vtiger:', err)
                })
            }

            router.push('/contact-us-thank-you')
        } catch (error) {
            console.error('Error submitting form:', error)

            let msg = 'An unexpected error occurred. Please try again later.'
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                msg = 'Network error: Unable to reach the server. Please check your connection and try again.'
            } else if (error instanceof Error) {
                msg = `Form submission error: ${error.message}. Please try again.`
            }

            setSubmitError(msg)
            setIsSubmitting(false)
        }
    }

    const legendText = isPartnerForm
        ? 'Discuss a Strategic Partnership with Our Team'
        : 'Contact Us'

    return (
        <div
            id={isMainContactForm ? 'mainContactForm' : undefined}
            className={cx('mx-auto max-w-2xl', className)}
        >
            <form
                onSubmit={handleSubmit}
                noValidate
                ref={formRef}
                aria-describedby={privacyNoticeId ? privacyNoticeId : undefined}
            >
                {/* Honeypot for Netlify bot detection */}
                <p className="hidden" aria-hidden="true">
                    <label>
                        Don’t fill this out if you are human:{' '}
                        <input name="bot-field" tabIndex={-1} autoComplete="off" />
                    </label>
                </p>

                {submitError && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                    >
                        {submitError}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                    <FieldSet
                        legend={legendText}
                        legendClassName={`${isMainContactForm && 'hidden'} text-3xl font-extrabold text-slate-900 text-center py-2 w-full mb-1`}
                    >
                        <p className="text-xs text-slate-500 mt-0 mb-2">
                            <span className="text-[#da3940]">*</span> indicates required field
                        </p>
                        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                            <div>
                                <Input
                                    autoComplete="given-name"
                                    className="text-base font-medium text-slate-800"
                                    errorText={errors['contact-first-name']}
                                    id="contact-first-name"
                                    label="First name"
                                    name="contact-first-name"
                                    ref={inputRefs['contact-first-name']}
                                    required
                                    onBlur={() =>
                                        handleBlur('contact-first-name')
                                    }
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <Input
                                    autoComplete="family-name"
                                    className="text-base font-medium text-slate-800"
                                    errorText={errors['contact-last-name']}
                                    id="contact-last-name"
                                    label="Last name"
                                    name="contact-last-name"
                                    ref={inputRefs['contact-last-name']}
                                    required
                                    onBlur={() =>
                                        handleBlur('contact-last-name')
                                    }
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        <div>
                            <Input
                                autoComplete="organization"
                                className="text-base font-medium text-slate-800"
                                errorText={errors['organization-name']}
                                id="organization-name"
                                label="Organization name"
                                name="organization-name"
                                ref={inputRefs['organization-name']}
                                required
                                onBlur={() => handleBlur('organization-name')}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <Input
                                className="text-base font-medium text-slate-800"
                                errorText={errors['contact-email']}
                                label="Business email"
                                name="contact-email"
                                id="email"
                                type="email"
                                ref={inputRefs['contact-email']}
                                required
                                autoComplete="email"
                                onBlur={() => handleBlur('contact-email')}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <Input
                                className="text-base font-medium text-slate-800"
                                errorText={errors['contact-phone']}
                                label="Phone number"
                                name="contact-phone"
                                id="contact-phone"
                                type="tel"
                                ref={inputRefs['contact-phone']}
                                autoComplete="tel"
                                onBlur={() => handleBlur('contact-phone')}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <TextArea
                                className="text-base font-medium text-slate-800"
                                errorText={errors['contact-message']}
                                label="Message"
                                name="contact-message"
                                id="message"
                                ref={messageRef}
                                onBlur={() => handleBlur('contact-message')}
                                autoComplete="off"
                                disabled={isSubmitting}
                                placeholder={
                                    isPartnerForm
                                        ? 'Tell us about your team and how we can help.'
                                        : 'Tell us how we can help you.'
                                }
                            />
                        </div>
                        <Button
                            className={`w-full rounded-xl border-none px-6 py-4 text-center text-base font-bold text-white shadow-md transition-all ${isSubmitting
                                ? 'cursor-not-allowed bg-slate-400'
                                : 'bg-[#0E8168] hover:bg-[#0a6b57]'
                                }`}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending Message...' : 'Send Message'}
                        </Button>
                    </FieldSet>
                </div>
            </form>
        </div>
    )
}

export default ContactForm

