import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import StatusBadge from '@/components/admin/StatusBadge';
import StatusSelect from '@/components/admin/StatusSelect';
import DeleteButton from '@/components/admin/DeleteLeadButton';
import { updateInquiryStatus } from '@/app/actions/leads';
import { INQUIRY_STATUS } from '@/lib/constants';

export const metadata = { title: 'Inquiry Detail — SN Properties Admin' };

async function getInquiry(id) {
  if (!supabaseServer) return null;
  const { data, error } = await supabaseServer
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

async function getProperty(id) {
  if (!id || !supabaseServer) return null;
  const { data } = await supabaseServer.from('properties').select('id, title, city').eq('id', id).single();
  return data;
}

export default async function InquiryDetailPage({ params }) {
  const [inquiry, property] = await Promise.all([
    getInquiry(params.id),
    // property loaded after inquiry resolves below
    Promise.resolve(null),
  ]);

  if (!inquiry) notFound();

  const prop = await getProperty(inquiry.property_id);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/admin/inquiries" className="hover:text-primary transition-colors">Inquiries</Link>
        <span>/</span>
        <span className="text-primary">{inquiry.name}</span>
      </div>

      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-primary">Inquiry from {inquiry.name}</h1>
          <p className="text-muted text-sm mt-1">Received {formatDate(inquiry.created_at)}</p>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Message + status ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Message */}
          <div className="card p-6">
            <h2 className="font-semibold text-primary mb-4">Message</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line text-sm">
              {inquiry.message || '(no message provided)'}
            </p>
          </div>

          {/* Status update */}
          <div className="card p-6">
            <h2 className="font-semibold text-primary mb-4">Update Status</h2>
            <StatusSelect
              id={inquiry.id}
              current={inquiry.status}
              options={INQUIRY_STATUS}
              action={updateInquiryStatus}
            />
            <p className="text-xs text-muted mt-3">
              Current: <span className="font-medium capitalize">{inquiry.status}</span>
            </p>
          </div>

        </div>

        {/* ── RIGHT: Contact + property info ── */}
        <div className="space-y-5">

          {/* Contact info */}
          <div className="card p-5">
            <h2 className="font-semibold text-primary mb-4">Contact Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Name</p>
                <p className="text-primary font-medium">{inquiry.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Email</p>
                <a href={`mailto:${inquiry.email}`} className="text-accent hover:underline">{inquiry.email}</a>
              </div>
              {inquiry.phone && (
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Phone</p>
                  <a href={`tel:${inquiry.phone}`} className="text-accent hover:underline">{inquiry.phone}</a>
                </div>
              )}
            </div>

            {/* Quick reply buttons */}
            <div className="flex flex-col gap-2 mt-5 pt-4 border-t border-border">
              <a
                href={`mailto:${inquiry.email}?subject=Re: Your Property Inquiry`}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-secondary transition-colors"
              >
                ✉️ Reply by Email
              </a>
              {inquiry.phone && (
                <a
                  href={`tel:${inquiry.phone}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-border text-primary text-xs font-semibold rounded-lg hover:bg-surface transition-colors"
                >
                  📞 Call Now
                </a>
              )}
            </div>
          </div>

          {/* Property info */}
          {prop && (
            <div className="card p-5">
              <h2 className="font-semibold text-primary mb-3">Property</h2>
              <p className="text-sm font-medium text-primary">{prop.title}</p>
              <p className="text-xs text-muted mt-0.5">{prop.city}</p>
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/properties/${prop.id}`}
                  target="_blank"
                  className="text-xs text-accent hover:underline font-medium"
                >
                  View listing ↗
                </Link>
                <span className="text-muted">·</span>
                <Link
                  href={`/admin/properties/${prop.id}/edit`}
                  className="text-xs text-muted hover:text-primary"
                >
                  Edit property
                </Link>
              </div>
            </div>
          )}

          {/* Danger zone */}
          <div className="card p-5 border-red-100">
            <h2 className="font-semibold text-primary mb-3">Danger Zone</h2>
            <DeleteButton id={inquiry.id} type="inquiry" redirectTo="/admin/inquiries" />
          </div>

        </div>

      </div>
    </div>
  );
}
