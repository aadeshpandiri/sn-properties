'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { testimonialSchema } from '@/lib/validators';
import Input from '@/components/forms/Input';
import TextArea from '@/components/forms/TextArea';

export default function TestimonialForm({ testimonial, action }) {
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: testimonial?.name ?? '',
      rating: testimonial?.rating ?? 5,
      review: testimonial?.review ?? '',
      image_url: testimonial?.image_url ?? '',
      approved: testimonial?.approved ?? false,
    },
  });

  const rating = watch('rating');

  const onSubmit = async (data) => {
    setServerError('');
    const result = testimonial
      ? await action(testimonial.id, data)
      : await action(data);
    if (result?.error) { setServerError(result.error); return; }
    router.push('/admin/testimonials');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Client Name <span className="text-red-500">*</span>
        </label>
        <Input
          {...register('name')}
          placeholder="e.g. Sarah Mitchell"
          error={errors.name?.message}
        />
      </div>

      {/* Star rating */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue('rating', star, { shouldValidate: true })}
              className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
                star <= rating ? 'text-accent' : 'text-border hover:text-accent/50'
              }`}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
        </div>
        <input type="hidden" {...register('rating', { valueAsNumber: true })} />
        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
      </div>

      {/* Review */}
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Review <span className="text-red-500">*</span>
        </label>
        <TextArea
          {...register('review')}
          rows={4}
          placeholder="Share what the client said about their experience..."
          error={errors.review?.message}
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Client Photo URL <span className="text-muted text-xs font-normal">(optional)</span>
        </label>
        <Input
          {...register('image_url')}
          placeholder="https://example.com/photo.jpg"
          error={errors.image_url?.message}
        />
      </div>

      {/* Approved */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="approved"
          {...register('approved')}
          className="w-4 h-4 accent-accent rounded"
        />
        <label htmlFor="approved" className="text-sm font-medium text-primary cursor-pointer">
          Publish on website (approved)
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : testimonial ? 'Save Changes' : 'Add Testimonial'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/testimonials')}
          className="px-6 py-2.5 border border-border text-primary text-sm font-semibold rounded-lg hover:bg-surface transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
