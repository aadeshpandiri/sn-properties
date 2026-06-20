'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteInquiry, deleteVisit } from '@/app/actions/leads';

const actions = { inquiry: deleteInquiry, visit: deleteVisit };

export default function DeleteLeadButton({ id, type, redirectTo }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await actions[type](id);
      if (!result?.error) router.push(redirectTo);
    });
  };

  if (confirming) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-600 font-medium">Are you sure?</p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Deleting…' : 'Yes, Delete'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="px-3 py-1.5 border border-border text-primary text-xs font-semibold rounded-lg hover:bg-surface transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1.5 text-red-600 border border-red-200 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
    >
      Delete {type === 'inquiry' ? 'Inquiry' : 'Visit'}
    </button>
  );
}
