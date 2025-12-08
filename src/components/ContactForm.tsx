'use client'

import React, { useEffect, useRef, useState } from 'react'
import FieldSet from '@/components/FieldSet'
import Input from '@/components/Input'
import TextArea from '@/components/TextArea'
import Button from '@/components/Button'
import { useRouter } from 'next/navigation'
import ReCAPTCHA from 'react-google-recaptcha'
import { usePathname } from 'next/navigation'
import cx from 'clsx'
import { submitToVtiger } from '@/utils/submitToVtiger';

let globalCount = 0

interface ContactFormProps {
    isMainContactForm?: boolean
    className?: string;
    privacyNoticeId?: string;
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
}) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [formData, setFormData] = useState<FormData | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const recaptchaRef = useRef<ReCAPTCHA>(null)
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
        setFormData(null)
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
            // Remove all non-digit characters except + to count digits
            const digitsOnly = phoneValue.replace(/[^\d]/g, '')
            // Check if format is valid (allows +, digits, dashes, spaces, parentheses, dots)
            const isValidFormat = /^(\+\d{1,4}[-.\s()]?)?[\d\s\-\(\)\.]{7,}$/.test(phoneValue)
            // Must have at least 10 digits
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
        const formData = new FormData(event.target as HTMLFormElement)
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
        setFormData(formData)
        setIsSubmitting(true)

        if (recaptchaRef.current) {
            recaptchaRef.current.execute()
        }
    }

    const onReCAPTCHAVerify = async (captchaToken: string | null) => {
        if (!captchaToken) {
            alert('reCAPTCHA verification failed. Please try again.')
            setIsSubmitting(false)
            return
        }

        if (!formData) {
            alert('Unexpected error: Form data missing.')
            setIsSubmitting(false)
            return
        }

        formData.append('captchaToken', captchaToken)

        globalCount++
        const unitTag = `wpcf7-f$55-o${globalCount}`
        formData.append('_wpcf7_unit_tag', unitTag)

        try {
            // Use Next.js API route to proxy the request (bypasses CORS)
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }

            const result = await res.json()

            if (!result) {
                console.error('Form submission failed: No response data')
                setIsSubmitting(false)
                return
            }

            // Submit to vtiger CRM (non-blocking)
            submitToVtiger(formData).catch(err => {
                console.error('Error submitting to vtiger:', err)
            })

            router.push('/contact-us-thank-you')
        } catch (error) {
            console.error('Error submitting form:', error)
            
            // Provide user-friendly error message
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                alert('Network error: Unable to reach the server. Please check your connection and try again.')
            } else if (error instanceof Error) {
                alert(`Form submission error: ${error.message}. Please try again.`)
            } else {
                alert('An unexpected error occurred. Please try again later.')
            }
            
            setIsSubmitting(false)
        }
    }

    const legendText = isPartnerForm
        ? 'Reach Out to Discuss a Strategic Partnership with Your Team'
        : 'Contact Us for a Free Initial Consultation'

    return (
        <div
            id={isMainContactForm ? 'mainContactForm' : undefined}
            className={cx('mx-auto max-w-2xl', className)}
        >
            <form onSubmit={handleSubmit} noValidate ref={formRef} aria-describedby={privacyNoticeId ? privacyNoticeId : undefined}>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                    <FieldSet
                        legend={legendText}
                        legendClassName={`${isMainContactForm && 'hidden'} text-3xl font-bold text-center py-4 w-full mb-3`}
                    >
                        <p className="mb-2">
                            <span className="text-[#da3940]">*</span> indicates
                            required field
                        </p>
                        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2 md:gap-y-6">
                            <div>
                                <Input
                                    autoComplete="given-name"
                                    className="text-xl"
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
                                    className="text-xl"
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
                                className="text-xl"
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
                                className="text-xl"
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
                                className="text-xl"
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
                                className="text-xl"
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
                            className={`w-full rounded-md border-2 px-6 py-3 text-center text-xl font-bold uppercase text-white ${
                                isSubmitting
                                    ? 'cursor-not-allowed border-gray-400 bg-gray-400'
                                    : 'border-[#0E8168] bg-[#0E8168] hover:border-[#001d2f] hover:bg-[#001d2f]'
                            }`}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </FieldSet>
                </div>

                <ReCAPTCHA
                    tabIndex={-1}
                    ref={recaptchaRef}
                    sitekey={
                        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string
                    }
                    size="invisible"
                    onChange={onReCAPTCHAVerify}
                />
            </form>
        </div>
    )
}

export default ContactForm
