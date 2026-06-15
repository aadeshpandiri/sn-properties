'use client';

export default function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-hover">
        <div className="flex items-center justify-between gap-4 pb-4">
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          <button type="button" className="text-secondary hover:text-primary" onClick={onClose}>
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
