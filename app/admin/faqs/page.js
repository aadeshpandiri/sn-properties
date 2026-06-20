import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import { toggleFaqActive, deleteFaq } from '@/app/actions/settings';

export const metadata = { title: 'FAQs — SN Properties Admin' };

async function getFaqs() {
  if (!supabaseServer) return [];
  const { data } = await supabaseServer
    .from('faqs')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });
  return data ?? [];
}

export default async function FaqsPage() {
  const faqs = await getFaqs();
  const activeCount = faqs.filter((f) => f.active).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">FAQs</h1>
          <p className="text-muted text-sm mt-1">{faqs.length} total · {activeCount} published</p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors"
        >
          + Add FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div className="card p-16 text-center border-dashed border-2">
          <p className="text-3xl mb-3">❓</p>
          <h3 className="font-bold text-primary mb-2">No FAQs yet</h3>
          <p className="text-muted text-sm mb-6">Add common questions to help visitors find answers quickly.</p>
          <Link
            href="/admin/faqs/new"
            className="inline-flex px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors"
          >
            Add First FAQ
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq) => {
            const toggleBound = toggleFaqActive.bind(null, faq.id, !faq.active);
            const deleteBound = deleteFaq.bind(null, faq.id);

            return (
              <div key={faq.id} className="card p-5 flex items-start gap-4">
                {/* Order badge */}
                <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-xs font-bold text-muted flex-shrink-0">
                  {faq.order_index}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary text-sm">{faq.question}</p>
                  <p className="text-muted text-xs mt-1 line-clamp-2">{faq.answer}</p>
                </div>

                {/* Status + actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    faq.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {faq.active ? 'Published' : 'Hidden'}
                  </span>

                  <form action={toggleBound}>
                    <button
                      type="submit"
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        faq.active
                          ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                          : 'border-green-200 text-green-700 hover:bg-green-50'
                      }`}
                    >
                      {faq.active ? 'Hide' : 'Publish'}
                    </button>
                  </form>

                  <Link
                    href={`/admin/faqs/${faq.id}/edit`}
                    className="px-3 py-1.5 text-xs font-semibold border border-border text-primary rounded-lg hover:bg-surface transition-colors"
                  >
                    Edit
                  </Link>

                  <form action={deleteBound}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      onClick={(e) => { if (!confirm('Delete this FAQ?')) e.preventDefault(); }}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
