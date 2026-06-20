'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inquirySchema } from '@/lib/validators';
import { submitInquiry } from '@/app/actions/inquiries';

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-primary text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent';

export default function InquiryForm({ propertyId, propertyTitle }) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: `I'm interested in "${propertyTitle}". Please send me more details.`,
      property_id: propertyId,
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    const result = await submitInquiry(data);
    if (result?.error) { setServerError(result.error); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="font-semibold text-primary mb-1">Message Sent!</h4>
        <p className="text-sm text-muted">We&apos;ll get back to you within 24 hours.</p>
        <button onClick={() => setSuccess(false)} className="text-xs text-accent mt-3 hover:underline">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      {serverError && (
        <p className="text-red-500 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{serverError}</p>
      )}

      <input type="hidden" {...register('property_id')} />

      <div>
        <input {...register('name')} placeholder="Your Name" className={inputClass} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <input {...register('email')} type="email" placeholder="Email Address" className={inputClass} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <input {...register('phone')} type="tel" placeholder="Phone Number" className={inputClass} />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <textarea {...register('message')} rows={3} placeholder="Your message…" className={`${inputClass} resize-none`} />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-60"
      >
        {isSubmitting ? 'Sending…' : 'Send Inquiry'}
      </button>
    </form>
  );
}
