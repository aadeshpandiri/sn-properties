export default function VideoPlayer({ src, poster, className = '' }) {
  if (!src) {
    return <div className={`rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted ${className}`}>No video available</div>;
  }

  return (
    <div className={`overflow-hidden rounded-xl bg-black ${className}`}>
      <video controls poster={poster} className="w-full">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
