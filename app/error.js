'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <main className="container-custom py-24 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-primary mb-4">Oops</h1>
        <h2 className="text-2xl font-semibold text-primary mb-4">Something went wrong</h2>
        <p className="text-muted mb-8">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
          <Button variant="ghost" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </main>
  );
}
