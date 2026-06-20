'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleVisitSchema } from '@/lib/validators';
import { scheduleVisit } from '@/app/actions/inquiries';

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-primary text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent';

function todayString() {
  return new Date().toISOString().split('T')[0];
}

export default function ScheduleVisitForm({ propertyId }) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(scheduleVisitSchema),
    defaultValues: {
      visitor_name: '',
      visitor_email: '',
      visitor_phone: '',
      date: '',
      time: '',
      property_id: propertyId,
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    const result = await scheduleVisit(data);
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
        <h4 className="font-semibold text-primary mb-1">Visit Requested!</h4>
        <p className="text-sm text-muted">We&apos;ll confirm your visit within 24 hours.</p>
        <button onClick={() => setSuccess(false)} className="text-xs text-accent mt-3 hover:underline">Schedule another</button>
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
        <input {...register('visitor_name')} placeholder="Your Name" className={inputClass} />
        {errors.visitor_name && <p className="text-red-500 text-xs mt-1">{errors.visitor_name.message}</p>}
      </div>

      <div>
        <input {...register('visitor_email')} type="email" placeholder="Email Address" className={inputClass} />
        {errors.visitor_email && <p className="text-red-500 text-xs mt-1">{errors.visitor_email.message}</p>}
      </div>

      <div>
        <input {...register('visitor_phone')} type="tel" placeholder="Phone Number" className={inputClass} />
        {errors.visitor_phone && <p className="text-red-500 text-xs mt-1">{errors.visitor_phone.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <input
            {...register('date')}
            type="date"
            min={todayString()}
            className={inputClass}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <input
            {...register('time')}
            type="time"
            min="09:00"
            max="18:00"
            className={inputClass}
          />
          {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent text-primary py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {isSubmitting ? 'Booking…' : 'Book a Visit'}
      </button>
    </form>
  );
}
