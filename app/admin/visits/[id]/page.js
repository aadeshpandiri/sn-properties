import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import StatusBadge from '@/components/admin/StatusBadge';
import StatusSelect from '@/components/admin/StatusSelect';
import DeleteButton from '@/components/admin/DeleteLeadButton';
import { updateVisitStatus } from '@/app/actions/leads';
import { VISIT_STATUS } from '@/lib/constants';

export const metadata = { title: 'Visit Detail — SN Properties Admin' };

async function getVisit(id) {
  if (!supabaseServer) return null;
  const { data, error } = await supabaseServer
    .from('schedule_visits')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

async function getProperty(id) {
  if (!id || !supabaseServer) return null;
  const { data } = await supabaseServer.from('properties').select('id, title, city, address').eq('id', id).single();
  return data;
}

export default async function VisitDetailPage({ params }) {
  const visit = await getVisit(params.id);
  if (!visit) notFound();

  const prop = await getProperty(visit.property_id);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/admin/visits" className="hover:text-primary transition-colors">Visits</Link>
        <span>/</span>
        <span className="text-primary">{visit.visitor_name}</span>
      </div>

      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-primary">Visit — {visit.visitor_name}</h1>
          <p className="text-muted text-sm mt-1">
            Requested {formatDate(visit.created_at)}
          </p>
        </div>
        <StatusBadge status={visit.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Visit details + status ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Visit schedule */}
          <div className="card p-6">
            <h2 className="font-semibold text-primary mb-5">Visit Details</h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-surface rounded-xl p-4 text-center">
                <p className="text-xs text-muted uppercase tracking-wide mb-1">Date</p>
                <p className="text-lg font-bold text-primary">{formatDate(visit.date)}</p>
              </div>
              <div className="bg-surface rounded-xl p-4 text-center">
                <p className="text-xs text-muted uppercase tracking-wide mb-1">Time</p>
                <p className="text-lg font-bold text-primary">{visit.time}</p>
              </div>
            </div>
          </div>

          {/* Status update */}
          <div className="card p-6">
            <h2 className="font-semibold text-primary mb-4">Update Status</h2>
            <StatusSelect
              id={visit.id}
              current={visit.status}
              options={VISIT_STATUS}
              action={updateVisitStatus}
            />
            <p className="text-xs text-muted mt-3">
              Current: <span className="font-medium capitalize">{visit.status}</span>
            </p>
          </div>

        </div>

        {/* ── RIGHT: Visitor + property info ── */}
        <div className="space-y-5">

          {/* Visitor info */}
          <div className="card p-5">
            <h2 className="font-semibold text-primary mb-4">Visitor Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Name</p>
                <p className="text-primary font-medium">{visit.visitor_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Email</p>
                <a href={`mailto:${visit.visitor_email}`} className="text-accent hover:underline">{visit.visitor_email}</a>
              </div>
              {visit.visitor_phone && (
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Phone</p>
                  <a href={`tel:${visit.visitor_phone}`} className="text-accent hover:underline">{visit.visitor_phone}</a>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-5 pt-4 border-t border-border">
              <a
                href={`mailto:${visit.visitor_email}?subject=Your Property Visit Confirmation`}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-secondary transition-colors"
              >
                ✉️ Send Confirmation
              </a>
              {visit.visitor_phone && (
                <a
                  href={`tel:${visit.visitor_phone}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-border text-primary text-xs font-semibold rounded-lg hover:bg-surface transition-colors"
                >
                  📞 Call Visitor
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
              {prop.address && <p className="text-xs text-muted mt-0.5">{prop.address}</p>}
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
            <DeleteButton id={visit.id} type="visit" redirectTo="/admin/visits" />
          </div>

        </div>

      </div>
    </div>
  );
}
