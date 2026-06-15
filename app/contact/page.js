'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/forms/Input';
import TextArea from '@/components/forms/TextArea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form submitted:', data);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <main className="container-custom py-12">
      {/* Header Section */}
      <section className="mb-12 text-center">
        <h1 className="section-title text-5xl mb-2">Get In Touch</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Have questions about our properties? Our team is ready to help you find your perfect home.
        </p>
      </section>

      {/* Contact Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            {submitted && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
                ✓ Thank you! We received your message and will get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  id="name"
                  register={register}
                  required
                  error={errors.name}
                />
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  register={register}
                  required
                  error={errors.email}
                />
              </div>

              <Input
                label="Phone (Optional)"
                id="phone"
                type="tel"
                register={register}
                error={errors.phone}
              />

              <Input
                label="Subject"
                id="subject"
                register={register}
                required
                error={errors.subject}
              />

              <TextArea
                label="Message"
                id="message"
                register={register}
                required
                rows={6}
                error={errors.message}
              />

              <Button
                variant="primary"
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-2 text-primary">Address</h3>
            <p className="text-muted">
              123 Market Street
              <br />
              San Francisco, CA 94103
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-2 text-primary">Phone</h3>
            <p className="text-muted">(415) 555-0123</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-2 text-primary">Email</h3>
            <p className="text-muted">info@snproperties.com</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-2 text-primary">Hours</h3>
            <p className="text-muted text-sm">
              Mon - Fri: 9:00 AM - 6:00 PM
              <br />
              Sat: 10:00 AM - 4:00 PM
              <br />
              Sun: Closed
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
