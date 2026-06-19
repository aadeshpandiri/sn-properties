import Link from 'next/link';
import PropertyForm from '@/components/admin/PropertyForm';
import { createProperty } from '@/app/actions/properties';

export const metadata = { title: 'Add Property — SN Properties Admin' };

export default function NewPropertyPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <Link href="/admin/properties" className="hover:text-primary transition-colors">
            Properties
          </Link>
          <span>/</span>
          <span className="text-primary">Add New</span>
        </div>
        <h1 className="text-2xl font-bold text-primary">Add New Property</h1>
      </div>

      <PropertyForm action={createProperty} />
    </div>
  );
}
