function getEmbedUrl(url) {
  try {
    const u = new URL(url);

    // YouTube
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  return null;
}

export default function VideoTour({ videos = [] }) {
  if (!videos.length) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">Video Tour</h2>
      <div className="space-y-4">
        {videos.map((v) => {
          const embedUrl = getEmbedUrl(v.video_url);
          if (!embedUrl) return null;
          return (
            <div key={v.id} className="aspect-video rounded-xl overflow-hidden bg-surface border border-border">
              <iframe
                src={embedUrl}
                title="Property video tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
