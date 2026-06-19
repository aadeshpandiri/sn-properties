export default function Loading() {
  return (
    <main className="container-custom py-24 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-surface border-t-accent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted">Loading...</p>
      </div>
    </main>
  );
}
