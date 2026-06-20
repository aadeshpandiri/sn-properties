import Link from 'next/link';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { createTestimonial } from '@/app/actions/testimonials';

export const metadata = { title: 'Add Testimonial — SN Properties Admin' };

export default function NewTestimonialPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/admin/testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
        <span>/</span>
        <span className="text-primary">Add New</span>
      </div>

      <h1 className="text-2xl font-bold text-primary mb-8">Add Testimonial</h1>

      <div className="card p-8">
        <TestimonialForm action={createTestimonial} />
      </div>
    </div>
  );
}
