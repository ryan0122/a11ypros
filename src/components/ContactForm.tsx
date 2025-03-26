'use client';

import React, { useEffect, useRef, useState } from 'react';
import FieldSet from '@/components/FieldSet';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import { usePathname } from 'next/navigation';

let globalCount = 0;

interface ContactFormProps {
  isMainContactForm?: boolean;
}

type FieldName =
  | 'contact-first-name'
  | 'contact-last-name'
  | 'organization-name'
  | 'contact-email'
  | 'contact-message';

const ContactForm: React.FC<ContactFormProps> = ({ isMainContactForm = false }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormData | null>(null);
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);

  const inputRefs = {
    'contact-first-name': useRef<HTMLInputElement>(null),
    'contact-last-name': useRef<HTMLInputElement>(null),
    'organization-name': useRef<HTMLInputElement>(null),
    'contact-email': useRef<HTMLInputElement>(null),
  };

  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setErrors({});
    setFormData(null);
    formRef.current?.reset();
  }, [pathname]);

  const validateForm = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.get('contact-first-name')) {
      newErrors['contact-first-name'] = 'First name is required';
    }
    if (!formData.get('contact-last-name')) {
      newErrors['contact-last-name'] = 'Last name is required';
    }
    if (!formData.get('organization-name')) {
      newErrors['organization-name'] = 'Organization is required';
    }
    if (!formData.get('contact-email')) {
      newErrors['contact-email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.get('contact-email') as string)) {
      newErrors['contact-email'] = 'Email is invalid';
    }

    return newErrors;
  };

  const handleBlur = (field: FieldName) => {
    const ref =
      field === 'contact-message' ? messageRef.current : inputRefs[field].current;
  
    const value = ref?.value.trim();
  
    // Only validate if there's an error already set for that field
    if (!errors[field]) return;
  
    if (field === 'contact-email') {
      if (!value) return; // still empty, keep error
  
      if (!/\S+@\S+\.\S+/.test(value)) return; // still invalid
  
      // Valid now, clear error
      setErrors((prev) => {
        const rest = Object.fromEntries(
          Object.entries(prev).filter(([key]) => key !== field)
        );
        return rest;
      });
    } else {
      // For all other fields, just clear error if value is not empty
      if (value) {
        setErrors((prev) => {
          const rest = Object.fromEntries(
            Object.entries(prev).filter(([key]) => key !== field)
          );
          return rest;
        });
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0] as FieldName;

      if (firstErrorField === 'contact-message') {
        messageRef.current?.focus();
      } else {
        inputRefs[firstErrorField]?.current?.focus();
      }

      return;
    }

    setErrors({});
    setFormData(formData);

    if (recaptchaRef.current) {
      recaptchaRef.current.execute();
    }
  };

  const onReCAPTCHAVerify = async (captchaToken: string | null) => {
    if (!captchaToken) {
      alert('reCAPTCHA verification failed. Please try again.');
      return;
    }

    if (!formData) {
      alert('Unexpected error: Form data missing.');
      return;
    }

    formData.append('captchaToken', captchaToken);

    globalCount++;
    const unitTag = `wpcf7-f$55-o${globalCount}`;
    formData.append('_wpcf7_unit_tag', unitTag);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CONTACT_URL as string, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (!result) {
        console.error('Form submission failed');
        return;
      }

      router.push('/contact-us-thank-you');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div id={isMainContactForm ? 'mainContactForm' : undefined} className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} noValidate ref={formRef}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6">
          <FieldSet
            legend="Contact Us for a Free Initial Consultation"
            legendClassName={`${isMainContactForm && 'hidden'} text-3xl font-bold text-center py-4 w-full mb-3`}
          >
            <p className="mb-2">
              <span className="text-[#da3940]">*</span> indicates required field
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-y-6">
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
                  onBlur={() => handleBlur('contact-first-name')}
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
                  onBlur={() => handleBlur('contact-last-name')}
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
              />
            </div>
            <Button
              className="w-full rounded-md border-2 border-[#0E8168] text-xl font-bold text-white uppercase bg-[#0E8168] px-6 py-3 text-center hover:bg-[#001d2f] hover:border-[#001d2f] hover:text-white"
              type="submit"
            >
              Submit
            </Button>
          </FieldSet>
        </div>

        {/* @ts-expect-error ReCAPTCHA is a class component, not typed for JSX */}
        <ReCAPTCHA
          tabIndex={-1}
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
          size="invisible"
          onChange={onReCAPTCHAVerify}
        />
      </form>
    </div>
  );
};

export default ContactForm;