'use client';

import React, { useState } from 'react';
import FieldSet from '@/components/FieldSet';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Button from '@/components/Button';

let globalCount = 0; // Global counter for tracking form submissions

const ContactForm: React.FC = () => {
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const validateForm = (formData: FormData) => {
		const newErrors: { [key: string]: string } = {};
		if (!formData.get('contact-name')) {
			newErrors['contact-name'] = 'Name is required';
		}
		if (!formData.get('contact-email')) {
			newErrors['contact-email'] = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.get('contact-email') as string)) {
			newErrors['contact-email'] = 'Email is invalid';
		}
		if (!formData.get('contact-message')) {
			newErrors['contact-message'] = 'Message is required';
		}
		return newErrors;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const newErrors = validateForm(formData);

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const data = Object.fromEntries(formData);
		console.log(data);

		// Increment global count and generate _wpcf7_unit_tag
		globalCount++;
		const unitTag = `wpcf7-f$55-o${globalCount}`;
		formData.append('_wpcf7_unit_tag', unitTag);

		const reqOptions = {
			body: formData,
			method: 'POST',
		};
		const req = await fetch(process.env.NEXT_PUBLIC_CONTACT_URL as string, reqOptions);
		const res = await req.json();

		if(!res) return //SHOW ERROR MESSAGING HERE;

		// SHOW SUCCESS MESSAGING HERE

		console.log('response', res);
	};

	return (
		<div className='mx-auto max-w-2xl'>
			<form onSubmit={handleSubmit} noValidate>
				<div className="grid grid-cols-1 gap-x-8 gap-y-6">
					<FieldSet legend="Contact us for a free initial consultation" legendClassName='text-2xl font-bold text-center uppercase border-b-2 border-t-2 border-white py-4 w-full mb-8'>
						<div>
							<Input
								autoComplete="name"
								className='text-xl'
								errorText={errors['contact-name']} 
								id='name'
								label='Name' 
								name='contact-name'  
								required  
							/>
						</div>
						<div>
							<Input 
								className='text-xl'
								errorText={errors['contact-email']}
								label='Email' 
								name='contact-email' 
								id='email' 
								type="email"
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
								required 
							/>
						</div>
						<Button 
							className='rounded-md border-2 border-[#0f866c] text-xl font-bold text-white uppercase bg-[#0f866c] w-full text-center hover:bg-gray-800 hover:text-white hover:outline hover:outline-2 hover:outline-white  focus-visible:outline-white' type="submit">
								Submit
						</Button>				
					</FieldSet>
				</div>
			</form>
		</div>
	);
};

export default ContactForm;