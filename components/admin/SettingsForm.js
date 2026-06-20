'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/forms/Input';

const schema = z.object({
  phone:          z.string().min(1, 'Phone is required'),
  email:          z.string().email('Invalid email'),
  address:        z.string().min(5, 'Address is required'),
  hours_weekday:  z.string().min(1, 'Required'),
  hours_saturday: z.string().min(1, 'Required'),
  hours_sunday:   z.string().min(1, 'Required'),
  whatsapp:       z.string().min(1, 'WhatsApp number is required'),
});

export default function SettingsForm({ settings, action }) {
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: settings,
  });

  const onSubmit = async (data) => {
    setServerError('');
    setSaved(false);
    const result = await action(data);
    if (result?.error) { setServerError(result.error); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✓ Settings saved successfully
        </div>
      )}

      {/* Contact info */}
      <div>
        <h2 className="text-base font-semibold text-primary mb-4 pb-2 border-b border-border">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Phone Number</label>
            <Input {...register('phone')} placeholder="(415) 555-0123" error={errors.phone?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Email Address</label>
            <Input {...register('email')} type="email" placeholder="info@snproperties.com" error={errors.email?.message} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-primary mb-1.5">Office Address</label>
            <Input {...register('address')} placeholder="123 Market Street, San Francisco, CA 94103" error={errors.address?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              WhatsApp Number
              <span className="text-muted text-xs font-normal ml-1">(with country code, no + or spaces)</span>
            </label>
            <Input {...register('whatsapp')} placeholder="14155550123" error={errors.whatsapp?.message} />
          </div>
        </div>
      </div>

      {/* Business hours */}
      <div>
        <h2 className="text-base font-semibold text-primary mb-4 pb-2 border-b border-border">
          Business Hours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Weekdays</label>
            <Input {...register('hours_weekday')} placeholder="Mon – Fri: 9:00 AM – 6:00 PM" error={errors.hours_weekday?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Saturday</label>
            <Input {...register('hours_saturday')} placeholder="Sat: 10:00 AM – 4:00 PM" error={errors.hours_saturday?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Sunday</label>
            <Input {...register('hours_sunday')} placeholder="Sun: Closed" error={errors.hours_sunday?.message} />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
