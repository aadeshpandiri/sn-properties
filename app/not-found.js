import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="container-custom py-24 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-primary mb-4">Page Not Found</h2>
        <p className="text-muted mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link href="/properties">
            <Button variant="ghost">Browse Properties</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
