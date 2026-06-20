'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/forms/Input';
import TextArea from '@/components/forms/TextArea';
import Card from '@/components/ui/Card';

const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Invalid email address'),
  phone:   z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Contact form:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <Card className="p-8">
      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          ✓ Thank you! We received your message and will get back to you within 24 hours.
        </div>
      )}

      <h2 className="text-xl font-bold text-primary mb-6">Send Us a Message</h2>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="name"
            label="Full Name"
            register={register}
            required
            placeholder="John Smith"
            error={errors.name}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            register={register}
            required
            placeholder="john@example.com"
            error={errors.email}
          />
        </div>

        <Input
          id="phone"
          label="Phone (optional)"
          type="tel"
          register={register}
          placeholder="(415) 555-0000"
          error={errors.phone}
        />

        <Input
          id="subject"
          label="Subject"
          register={register}
          required
          placeholder="Inquiry about a property"
          error={errors.subject}
        />

        <TextArea
          id="message"
          label="Message"
          register={register}
          required
          rows={5}
          placeholder="Tell us how we can help..."
          error={errors.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </Card>
  );
}
