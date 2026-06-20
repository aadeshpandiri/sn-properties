import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import StatusBadge from '@/components/admin/StatusBadge';
import { INQUIRY_STATUS } from '@/lib/constants';

export const metadata = { title: 'Inquiries — SN Properties Admin' };

const STATUS_FILTERS = [{ value: '', label: 'All' }, ...INQUIRY_STATUS];

async function getInquiries(status) {
  if (!supabaseServer) return { inquiries: [], properties: {} };

  let query = supabaseServer
    .from('inquiries')
    .select('id, name, email, phone, message, status, property_id, created_at')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data: inquiries } = await query;
  if (!inquiries?.length) return { inquiries: [], properties: {} };

  // Fetch property titles
  const propIds = [...new Set(inquiries.map((i) => i.property_id).filter(Boolean))];
  const { data: props } = propIds.length
    ? await supabaseServer.from('properties').select('id, title').in('id', propIds)
    : { data: [] };

  const properties = Object.fromEntries((props ?? []).map((p) => [p.id, p.title]));
  return { inquiries, properties };
}

export default async function InquiriesPage({ searchParams }) {
  const activeStatus = searchParams?.status ?? '';
  const { inquiries, properties } = await getInquiries(activeStatus);

  const newCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Inquiries</h1>
          <p className="text-muted text-sm mt-1">
            {inquiries.length} {activeStatus || 'total'}
            {newCount > 0 && !activeStatus && (
              <span className="ml-2 text-accent font-semibold">· {newCount} new</span>
            )}
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s.value}
            href={s.value ? `/admin/inquiries?status=${s.value}` : '/admin/inquiries'}
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
      {inquiries.length === 0 ? (
        <div className="card p-16 text-center border-dashed border-2">
          <p className="text-3xl mb-3">📥</p>
          <h3 className="font-bold text-primary mb-2">No inquiries yet</h3>
          <p className="text-muted text-sm">Inquiries submitted via property pages will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Property</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-primary">{inq.name}</p>
                    <p className="text-muted text-xs mt-0.5">{inq.email}</p>
                    {inq.phone && <p className="text-muted text-xs">{inq.phone}</p>}
                  </td>
                  <td className="px-5 py-4">
                    {inq.property_id && properties[inq.property_id] ? (
                      <Link
                        href={`/admin/properties/${inq.property_id}/edit`}
                        className="text-accent text-sm hover:underline"
                      >
                        {properties[inq.property_id]}
                      </Link>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={inq.status} />
                  </td>
                  <td className="px-5 py-4 text-muted text-xs">
                    {formatDate(inq.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/inquiries/${inq.id}`}
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
