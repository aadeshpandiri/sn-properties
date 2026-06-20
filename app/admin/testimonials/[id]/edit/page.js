import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { updateTestimonial } from '@/app/actions/testimonials';

export const metadata = { title: 'Edit Testimonial — SN Properties Admin' };

async function getTestimonial(id) {
  if (!supabaseServer) return null;
  const { data, error } = await supabaseServer
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export default async function EditTestimonialPage({ params }) {
  const testimonial = await getTestimonial(params.id);
  if (!testimonial) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/admin/testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
        <span>/</span>
        <span className="text-primary">Edit</span>
      </div>

      <h1 className="text-2xl font-bold text-primary mb-8">Edit Testimonial</h1>

      <div className="card p-8">
        <TestimonialForm testimonial={testimonial} action={updateTestimonial} />
      </div>
    </div>
  );
}
