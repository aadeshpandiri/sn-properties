import { headers } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: 'Admin — SN Properties' };

const AUTH_PATHS = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];

export default async function AdminLayout({ children }) {
  const heads = await headers();
  const pathname = heads.get('x-pathname') ?? '';
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Auth pages (login, forgot-password) — no sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Protected admin pages — full sidebar layout
  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
