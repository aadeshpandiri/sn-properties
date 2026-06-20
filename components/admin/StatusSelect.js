'use client';

import { useState, useTransition } from 'react';

export default function StatusSelect({ id, current, options, action }) {
  const [status, setStatus] = useState(current);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const isDirty = status !== current;

  const save = () => {
    setError('');
    startTransition(async () => {
      const result = await action(id, status);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setSaved(false); }}
          className="px-3.5 py-2 rounded-lg border border-border text-sm text-primary bg-white focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button
          onClick={save}
          disabled={isPending || !isDirty}
          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving…' : saved ? '✓ Saved' : 'Update'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
