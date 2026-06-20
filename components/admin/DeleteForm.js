'use client';

import { useTransition } from 'react';

export default function DeleteForm({ action, label = 'Delete', confirmMessage = 'Are you sure you want to delete this?' }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirm(confirmMessage)) return;
    startTransition(() => action());
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={isPending}
        className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Deleting…' : label}
      </button>
    </form>
  );
}
