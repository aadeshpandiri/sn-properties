import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import DeletePropertyButton from '@/components/admin/DeletePropertyButton';

export const metadata = { title: 'Properties — SN Properties Admin' };

const statusStyles = {
  available: 'bg-green-50 text-green-700',
  sold: 'bg-red-50 text-red-700',
  rented: 'bg-blue-50 text-blue-700',
};

const listingStyles = {
  sale: 'bg-primary/10 text-primary',
  rent: 'bg-accent/10 text-accent',
};

async function getAllProperties() {
  if (!supabaseServer) return [];
  const { data, error } = await supabaseServer
    .from('properties')
    .select('id, title, city, listing_type, property_type, price, status, featured, created_at')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

export default async function AdminPropertiesPage() {
  const properties = await getAllProperties();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Properties</h1>
          <p className="text-muted text-sm mt-1">{properties.length} total listings</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary transition-colors"
        >
          + Add Property
        </Link>
      </div>

      {/* Table */}
      {properties.length === 0 ? (
        <div className="card p-16 text-center border-dashed border-2">
          <div className="text-4xl mb-3">🏠</div>
          <h3 className="font-bold text-primary mb-2">No properties yet</h3>
          <p className="text-muted text-sm mb-6">Add your first property to get started.</p>
          <Link
            href="/admin/properties/new"
            className="inline-flex bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Add First Property
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Property</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Featured</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-primary">{p.title}</p>
                    <p className="text-muted text-xs mt-0.5">{p.city}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${listingStyles[p.listing_type]}`}>
                        {p.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                      </span>
                      <span className="text-xs text-muted capitalize">{p.property_type}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-primary">{formatPrice(p.price)}</span>
                    {p.listing_type === 'rent' && <span className="text-muted text-xs">/mo</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm ${p.featured ? 'text-accent' : 'text-muted'}`}>
                      {p.featured ? '★ Yes' : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/properties/${p.id}/edit`}
                        className="text-accent hover:underline text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <DeletePropertyButton id={p.id} title={p.title} />
                    </div>
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
