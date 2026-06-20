export default function Input({ label, id, type = 'text', register, required = false, error, className = '', ...props }) {
  // Supports two usage patterns:
  // 1. <Input id="name" register={register} />  — calls register(id) internally
  // 2. <Input {...register('name')} />           — spreads ref/onChange/onBlur via ...props
  const regProps = typeof register === 'function' ? register(id, { required }) : {};
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={`space-y-2 ${className}`}>
      {label ? <label htmlFor={id} className="block text-sm font-medium text-secondary">{label}</label> : null}
      <input
        id={id}
        type={type}
        className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-primary shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        aria-invalid={error ? 'true' : 'false'}
        {...regProps}
        {...props}
      />
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
