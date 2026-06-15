export default function TextArea({ label, id, register, required = false, error, className = '', ...props }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label ? <label htmlFor={id} className="block text-sm font-medium text-secondary">{label}</label> : null}
      <textarea
        id={id}
        className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-primary shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        aria-invalid={error ? 'true' : 'false'}
        {...register(id, { required })}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error.message}</p> : null}
    </div>
  );
}
