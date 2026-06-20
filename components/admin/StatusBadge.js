const styles = {
  // Inquiry statuses
  new:           'bg-amber-50 text-amber-700',
  contacted:     'bg-blue-50 text-blue-700',
  qualified:     'bg-green-50 text-green-700',
  unqualified:   'bg-gray-100 text-gray-500',
  closed:        'bg-gray-100 text-gray-400',
  // Visit statuses
  pending:       'bg-amber-50 text-amber-700',
  confirmed:     'bg-blue-50 text-blue-700',
  completed:     'bg-green-50 text-green-700',
  cancelled:     'bg-red-50 text-red-600',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${styles[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}
