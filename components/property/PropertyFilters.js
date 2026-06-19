'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PROPERTY_TYPES, LISTING_TYPES } from '@/lib/constants';

export default function PropertyFilters({ filters }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    listing_type: filters.listing_type || '',
    property_type: filters.property_type || '',
    city: filters.city || '',
    sort: filters.sort || '',
    min_price: filters.min_price || '',
    max_price: filters.max_price || '',
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toUrl = (overrides = {}) => {
    const merged = { ...form, ...overrides };
    const qs = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => { if (v) qs.set(k, v); });
    const q = qs.toString();
    return `/properties${q ? '?' + q : ''}`;
  };

  const apply = (e) => {
    e.preventDefault();
    startTransition(() => router.push(toUrl({ page: '' })));
  };

  const clear = () => {
    setForm({ listing_type: '', property_type: '', city: '', sort: '', min_price: '', max_price: '' });
    startTransition(() => router.push('/properties'));
  };

  const hasFilters = Object.values(form).some(Boolean);

  const inputClass = 'px-3.5 py-2 rounded-lg border border-border text-sm text-primary bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent';

  return (
    <form onSubmit={apply} className="bg-white border border-border rounded-xl p-5">
      <div className="flex flex-wrap items-end gap-4">

        {/* Listing type tabs */}
        <div>
          <p className="text-xs font-medium text-muted mb-1.5">Listing Type</p>
          <div className="flex rounded-lg overflow-hidden border border-border">
            {[{ value: '', label: 'All' }, ...LISTING_TYPES].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => update('listing_type', t.value)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  form.listing_type === t.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-muted hover:text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property type */}
        <div>
          <p className="text-xs font-medium text-muted mb-1.5">Property Type</p>
          <select value={form.property_type} onChange={(e) => update('property_type', e.target.value)} className={inputClass}>
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <p className="text-xs font-medium text-muted mb-1.5">City</p>
          <input
            type="text"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Any city…"
            className={`${inputClass} w-36`}
          />
        </div>

        {/* Price range */}
        <div>
          <p className="text-xs font-medium text-muted mb-1.5">Price Range ($)</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={form.min_price}
              onChange={(e) => update('min_price', e.target.value)}
              placeholder="Min"
              min="0"
              className={`${inputClass} w-24`}
            />
            <span className="text-muted text-sm">–</span>
            <input
              type="number"
              value={form.max_price}
              onChange={(e) => update('max_price', e.target.value)}
              placeholder="Max"
              min="0"
              className={`${inputClass} w-24`}
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <p className="text-xs font-medium text-muted mb-1.5">Sort By</p>
          <select value={form.sort} onChange={(e) => update('sort', e.target.value)} className={inputClass}>
            <option value="">Newest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 ml-auto">
          {hasFilters && (
            <button
              type="button"
              onClick={clear}
              className="px-4 py-2 text-sm text-muted hover:text-primary border border-border rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-60"
          >
            {isPending ? 'Searching…' : 'Search'}
          </button>
        </div>

      </div>
    </form>
  );
}
