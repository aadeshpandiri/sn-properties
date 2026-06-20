import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import StatusBadge from '@/components/admin/StatusBadge';
import { VISIT_STATUS } from '@/lib/constants';

export const metadata = { title: 'Scheduled Visits — SN Properties Admin' };

const STATUS_FILTERS = [{ value: '', label: 'All' }, ...VISIT_STATUS];

async function getVisits(status) {
  if (!supabaseServer) return { visits: [], properties: {} };

  let query = supabaseServer
    .from('schedule_visits')
    .select('id, visitor_name, visitor_email, visitor_phone, date, time, status, property_id, created_at')
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (status) query = query.eq('status', status);

  const { data: visits } = await query;
  if (!visits?.length) return { visits: [], properties: {} };

  const propIds = [...new Set(visits.map((v) => v.property_id).filter(Boolean))];
  const { data: props } = propIds.length
    ? await supabaseServer.from('properties').select('id, title').in('id', propIds)
    : { data: [] };

  const properties = Object.fromEntries((props ?? []).map((p) => [p.id, p.title]));
  return { visits, properties };
}

export default async function VisitsPage({ searchParams }) {
  const activeStatus = searchParams?.status ?? '';
  const { visits, properties } = await getVisits(activeStatus);

  const pendingCount = visits.filter((v) => v.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Scheduled Visits</h1>
          <p className="text-muted text-sm mt-1">
            {visits.length} {activeStatus || 'total'}
            {pendingCount > 0 && !activeStatus && (
              <span className="ml-2 text-accent font-semibold">· {pendingCount} pending</span>
            )}
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s.value}
            href={s.value ? `/admin/visits?status=${s.value}` : '/admin/visits'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeStatus === s.value
                ? 'bg-primary text-white'
                : 'bg-surface text-muted hover:text-primary border border-border'
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      {visits.length === 0 ? (
        <div className="card p-16 text-center border-dashed border-2">
          <p className="text-3xl mb-3">📅</p>
          <h3 className="font-bold text-primary mb-2">No visits scheduled</h3>
          <p className="text-muted text-sm">Visit requests from property pages will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Visitor</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Property</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Visit Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visits.map((visit) => (
                <tr key={visit.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-primary">{visit.visitor_name}</p>
                    <p className="text-muted text-xs mt-0.5">{visit.visitor_email}</p>
                    {visit.visitor_phone && <p className="text-muted text-xs">{visit.visitor_phone}</p>}
                  </td>
                  <td className="px-5 py-4">
                    {visit.property_id && properties[visit.property_id] ? (
                      <Link
                        href={`/admin/properties/${visit.property_id}/edit`}
                        className="text-accent text-sm hover:underline"
                      >
                        {properties[visit.property_id]}
                      </Link>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-primary font-medium">{formatDate(visit.date)}</p>
                    <p className="text-muted text-xs mt-0.5">{visit.time}</p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={visit.status} />
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/visits/${visit.id}`}
                      className="text-accent hover:underline text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
