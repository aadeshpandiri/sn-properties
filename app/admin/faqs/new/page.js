import Link from 'next/link';
import FaqForm from '@/components/admin/FaqForm';
import { createFaq } from '@/app/actions/settings';

export const metadata = { title: 'Add FAQ — SN Properties Admin' };

export default function NewFaqPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/admin/faqs" className="hover:text-primary transition-colors">FAQs</Link>
        <span>/</span>
        <span className="text-primary">Add New</span>
      </div>

      <h1 className="text-2xl font-bold text-primary mb-8">Add FAQ</h1>

      <div className="card p-8">
        <FaqForm action={createFaq} />
      </div>
    </div>
  );
}
