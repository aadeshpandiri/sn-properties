export default function Button({ children, variant = 'primary', type = 'button', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-6 py-3';
  const variants = {
    primary: 'bg-primary text-white hover:bg-secondary',
    secondary: 'bg-secondary text-white hover:bg-primary',
    ghost: 'border border-primary text-primary bg-transparent hover:bg-surface',
  };

  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
