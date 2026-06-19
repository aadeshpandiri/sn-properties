import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const metadata = { title: 'Dashboard — SN Properties Admin' };

async function getDashboardStats() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const [properties, inquiries, visits, testimonials] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('schedule_visits').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
  ]);

  const newInquiries = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  return {
    properties: properties.count ?? 0,
    inquiries: inquiries.count ?? 0,
    newInquiries: newInquiries.count ?? 0,
    visits: visits.count ?? 0,
    testimonials: testimonials.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: 'Total Properties', value: stats.properties, icon: '🏠', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Total Inquiries', value: stats.inquiries, icon: '📥', bg: 'bg-amber-50', text: 'text-amber-600', badge: stats.newInquiries > 0 ? `${stats.newInquiries} new` : null },
    { label: 'Scheduled Visits', value: stats.visits, icon: '📅', bg: 'bg-green-50', text: 'text-green-600' },
    { label: 'Testimonials', value: stats.testimonials, icon: '⭐', bg: 'bg-purple-50', text: 'text-purple-600' },
  ];

  const quickLinks = [
    { label: 'Add Property', href: '/admin/properties/new', icon: '➕', desc: 'List a new property' },
    { label: 'View Inquiries', href: '/admin/inquiries', icon: '📋', desc: 'Manage leads' },
    { label: 'Manage Visits', href: '/admin/visits', icon: '🗓️', desc: 'Review bookings' },
    { label: 'Testimonials', href: '/admin/testimonials', icon: '✍️', desc: 'Approve reviews' },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Welcome back to SN Properties admin</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl ${s.bg}`}>
                {s.icon}
              </div>
              {s.badge && (
                <span className="text-xs font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                  {s.badge}
                </span>
              )}
            </div>
            <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-muted text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="card p-5 hover:border-accent transition-colors group"
            >
              <div className="text-2xl mb-3">{link.icon}</div>
              <p className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">
                {link.label}
              </p>
              <p className="text-muted text-xs mt-0.5">{link.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Getting started notice */}
      {stats.properties === 0 && (
        <div className="card p-8 border-dashed border-2 border-border text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="font-bold text-primary mb-2">Ready to add your first property?</h3>
          <p className="text-muted text-sm mb-5">
            Start building your portfolio by adding a property listing.
          </p>
          <a
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Add First Property
          </a>
        </div>
      )}
    </div>
  );
}
