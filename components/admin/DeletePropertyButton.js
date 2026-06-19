'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProperty } from '@/app/actions/properties';

export default function DeletePropertyButton({ id, title }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;

    setLoading(true);
    const result = await deleteProperty(id);

    if (result?.error) {
      alert(`Error: ${result.error}`);
      setLoading(false);
      return;
    }

    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 transition-colors"
    >
      {loading ? 'Deleting…' : 'Delete'}
    </button>
  );
}
