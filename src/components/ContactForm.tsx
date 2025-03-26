'use client';


import React, { useEffect, useRef, useState } from 'react';
import FieldSet from '@/components/FieldSet';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import { usePathname } from 'next/navigation';

let globalCount = 0; // Global counter for tracking form submissions

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
    // Clear form state on route change
    setErrors({});
    setFormData(null);
  
    // Optionally reset the actual HTML form fields too
    formRef.current?.reset();
  }, [pathname]);

  // ✅ Function to validate form fields BEFORE executing reCAPTCHA
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

  // ✅ Handle form submission (Validate first, then trigger reCAPTCHA)
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

    setErrors({}); // ✅ Clear errors if validation passes
    setFormData(formData); // ✅ Store form data temporarily

    if (recaptchaRef.current) {
      recaptchaRef.current.execute(); // ✅ Execute reCAPTCHA v2 Invisible AFTER validation
    }
  };

  // ✅ Handle successful reCAPTCHA verification
  const onReCAPTCHAVerify = async (captchaToken: string | null) => {
    if (!captchaToken) {
      alert("reCAPTCHA verification failed. Please try again.");
      return;
    }

    if (!formData) {
      alert("Unexpected error: Form data missing.");
      return;
    }

    // ✅ Append reCAPTCHA token to form data
    formData.append("captchaToken", captchaToken);

    // Increment global count and generate _wpcf7_unit_tag
    globalCount++;
    const unitTag = `wpcf7-f$55-o${globalCount}`;
    formData.append('_wpcf7_unit_tag', unitTag);

    try {
      const reqOptions = {
        body: formData,
        method: 'POST',
      };
      const req = await fetch(process.env.NEXT_PUBLIC_CONTACT_URL as string, reqOptions);
      const res = await req.json();

      if (!res) {
        console.error('Form submission failed');
        return;
      }

      // ✅ Redirect to thank-you page after successful submission
      router.push('/contact-us-thank-you');
      console.log('response', res);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div id={isMainContactForm ? 'mainContactForm' : undefined} className='mx-auto max-w-2xl'>
      <form onSubmit={handleSubmit} noValidate ref={formRef}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6">
          <FieldSet legend="Contact Us for a Free Initial Consultation" legendClassName={`${isMainContactForm && 'hidden'} text-3xl font-bold text-center py-4 w-full mb-3`}>
            <p className='mb-2'><span className="text-[#da3940]">*</span> indicates required field</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-y-6">
              <div>
                <Input
                  autoComplete="given-name"
                  className='text-xl'
                  errorText={errors['contact-first-name']} 
                  id='contact-first-name'
                  label='First name' 
                  name='contact-first-name'
                  ref={inputRefs['contact-first-name']}  
                  required  
                />
              </div>
              <div>
                <Input
                  autoComplete="family-name"
                  className='text-xl'
                  errorText={errors['contact-last-name']} 
                  id='contact-last-name'
                  label='Last name' 
                  name='contact-last-name'  
                  ref={inputRefs['contact-last-name']}
                  required  
                />
              </div>
            </div>
            <div>
              <Input
                autoComplete="organization"
                className='text-xl'
                errorText={errors['organization-name']} 
                id='organization-name'
                label='Organization name' 
                name='organization-name'  
                ref={inputRefs['organization-name']}
                required  
              />
            </div>
            <div>
              <Input 
                className='text-xl'
                errorText={errors['contact-email']}
                label='Business email' 
                name='contact-email' 
                id='email' 
                type="email"
                ref={inputRefs['contact-email']}
                required 
                autoComplete="email" 
              />
            </div>
            <div>
              <TextArea
                className='text-xl' 
                errorText={errors['contact-message']}
                label='Message' 
                name='contact-message' 
                id='message' 
                ref={messageRef}
              />
            </div>

              {/* Submit Button */}
              <Button 
                className="w-full rounded-md border-2 border-[#0E8168] text-xl font-bold text-white uppercase bg-[#0E8168] px-6 py-3 text-center hover:bg-[#001d2f] hover:border-[#001d2f] hover:text-white" 
                type="submit">
                  Submit
              </Button>

          </FieldSet>
        </div>
		    {/* Invisible reCAPTCHA - Runs AFTER validation passes */}
			{/* @ts-expect-error  ReCAPTCHA is a class component, and TypeScript has issues with JSX inference */}
			<ReCAPTCHA
			  tabIndex={-1}
			  ref={recaptchaRef}
			  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string} // Replace with your site key
			  size="invisible"
			  onChange={onReCAPTCHAVerify} // Runs only when verification is successful
			/>
      </form>
    </div>
  );
};

export default ContactForm;
