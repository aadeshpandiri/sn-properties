'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Input from '@/components/forms/Input';
import TextArea from '@/components/forms/TextArea';

const schema = z.object({
  question:    z.string().min(5, 'Question is required'),
  answer:      z.string().min(10, 'Answer is required'),
  order_index: z.number().int().min(0).default(0),
  active:      z.boolean().default(true),
});

export default function FaqForm({ faq, action }) {
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      question:    faq?.question    ?? '',
      answer:      faq?.answer      ?? '',
      order_index: faq?.order_index ?? 0,
      active:      faq?.active      ?? true,
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    const result = faq
      ? await action(faq.id, data)
      : await action(data);
    if (result?.error) { setServerError(result.error); return; }
    router.push('/admin/faqs');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Question <span className="text-red-500">*</span>
        </label>
        <Input {...register('question')} placeholder="What areas do you cover?" error={errors.question?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Answer <span className="text-red-500">*</span>
        </label>
        <TextArea
          {...register('answer')}
          rows={5}
          placeholder="We cover the entire San Francisco Bay Area including..."
          error={errors.answer?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">
            Display Order
            <span className="text-muted text-xs font-normal ml-1">(lower = first)</span>
          </label>
          <Input
            {...register('order_index', { valueAsNumber: true })}
            type="number"
            min="0"
            placeholder="0"
            error={errors.order_index?.message}
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('active')}
              className="w-4 h-4 accent-accent rounded"
            />
            <span className="text-sm font-medium text-primary">Show on website</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : faq ? 'Save Changes' : 'Add FAQ'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/faqs')}
          className="px-6 py-2.5 border border-border text-primary text-sm font-semibold rounded-lg hover:bg-surface transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
