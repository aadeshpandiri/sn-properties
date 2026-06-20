import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import FaqForm from '@/components/admin/FaqForm';
import { updateFaq } from '@/app/actions/settings';

export const metadata = { title: 'Edit FAQ — SN Properties Admin' };

async function getFaq(id) {
  if (!supabaseServer) return null;
  const { data, error } = await supabaseServer.from('faqs').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export default async function EditFaqPage({ params }) {
  const faq = await getFaq(params.id);
  if (!faq) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/admin/faqs" className="hover:text-primary transition-colors">FAQs</Link>
        <span>/</span>
        <span className="text-primary">Edit</span>
      </div>

      <h1 className="text-2xl font-bold text-primary mb-8">Edit FAQ</h1>

      <div className="card p-8">
        <FaqForm faq={faq} action={updateFaq} />
      </div>
    </div>
  );
}
