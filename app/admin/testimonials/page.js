import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import { toggleApproval, deleteTestimonial } from '@/app/actions/testimonials';

export const metadata = { title: 'Testimonials — SN Properties Admin' };

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
];

async function getTestimonials(filter) {
  if (!supabaseServer) return [];
  let query = supabaseServer
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter === 'approved') query = query.eq('approved', true);
  if (filter === 'pending')  query = query.eq('approved', false);

  const { data } = await query;
  return data ?? [];
}

export default async function TestimonialsPage({ searchParams }) {
  const filter = searchParams?.filter ?? '';
  const testimonials = await getTestimonials(filter);

  const approvedCount = testimonials.filter((t) => t.approved).length;
  const pendingCount  = testimonials.filter((t) => !t.approved).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Testimonials</h1>
          <p className="text-muted text-sm mt-1">
            {approvedCount} approved · {pendingCount} pending review
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors"
        >
          + Add Testimonial
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-6">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/testimonials?filter=${f.value}` : '/admin/testimonials'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-primary text-white'
                : 'bg-surface text-muted hover:text-primary border border-border'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {testimonials.length === 0 ? (
        <div className="card p-16 text-center border-dashed border-2">
          <p className="text-3xl mb-3">⭐</p>
          <h3 className="font-bold text-primary mb-2">No testimonials yet</h3>
          <p className="text-muted text-sm mb-6">Add client reviews to build trust on your website.</p>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors"
          >
            Add First Testimonial
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => {
            const approveBound = toggleApproval.bind(null, t.id, !t.approved);
            const deleteBound  = deleteTestimonial.bind(null, t.id);

            return (
              <div key={t.id} className="card p-5 flex items-start gap-5">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 overflow-hidden">
                  {t.image_url ? (
                    <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    t.name.charAt(0)
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-semibold text-primary">{t.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={t.rating} size="text-sm" />
                        <span className="text-xs text-muted">{formatDate(t.created_at)}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      t.approved
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {t.approved ? 'Published' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-2 line-clamp-2">{t.review}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <form action={approveBound}>
                    <button
                      type="submit"
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        t.approved
                          ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                          : 'border-green-200 text-green-700 hover:bg-green-50'
                      }`}
                    >
                      {t.approved ? 'Unpublish' : 'Approve'}
                    </button>
                  </form>
                  <Link
                    href={`/admin/testimonials/${t.id}/edit`}
                    className="px-3 py-1.5 text-xs font-semibold border border-border text-primary rounded-lg hover:bg-surface transition-colors"
                  >
                    Edit
                  </Link>
                  <form action={deleteBound}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      onClick={(e) => { if (!confirm('Delete this testimonial?')) e.preventDefault(); }}
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
