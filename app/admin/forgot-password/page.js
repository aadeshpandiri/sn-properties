'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password`,
    });
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="card p-10">
            <div className="text-5xl mb-5">📧</div>
            <h2 className="text-xl font-bold text-primary mb-2">Check your email</h2>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              We sent a password reset link to your email.
              Check your inbox and follow the link to set a new password.
            </p>
            <Link href="/admin/login" className="text-accent text-sm font-medium hover:underline">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
            <span className="text-accent text-xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">SN Properties</h1>
          <p className="text-muted text-sm mt-1">Admin Portal</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-bold text-primary mb-2">Reset your password</h2>
          <p className="text-muted text-sm mb-6">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@snproperties.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-primary text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>

          <div className="text-center mt-5">
            <Link href="/admin/login" className="text-sm text-accent hover:underline">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
