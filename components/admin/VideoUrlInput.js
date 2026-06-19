'use client';

import { useState } from 'react';
import { deletePropertyVideo } from '@/app/actions/properties';

function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
  } catch {}
  return null;
}

function VideoPreview({ url }) {
  const ytId = getYouTubeId(url);

  if (ytId) {
    return (
      <img
        src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
      />
    );
  }

  // Generic preview — just show the URL domain
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface px-2">
        <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span className="text-xs text-muted truncate w-full text-center">{domain}</span>
      </div>
    );
  } catch {
    return null;
  }
}

export default function VideoUrlInput({ existingVideos = [], onNewVideos }) {
  const [existing, setExisting] = useState(existingVideos);
  const [pending, setPending] = useState([]); // New URLs not yet saved to DB
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const notify = (updated) => {
    onNewVideos(updated.map((v) => v.url));
  };

  const addUrl = () => {
    setError('');
    const url = input.trim();
    if (!url) return;

    try {
      new URL(url); // Validate it's a real URL
    } catch {
      setError('Enter a valid URL (e.g. https://youtube.com/watch?v=...)');
      return;
    }

    const all = [...existing.map((v) => v.video_url), ...pending.map((v) => v.url)];
    if (all.includes(url)) {
      setError('This URL has already been added');
      return;
    }

    const updated = [...pending, { url }];
    setPending(updated);
    notify(updated);
    setInput('');
  };

  const removeExisting = async (id) => {
    const result = await deletePropertyVideo(id);
    if (!result?.error) {
      setExisting((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const removePending = (url) => {
    const updated = pending.filter((v) => v.url !== url);
    setPending(updated);
    notify(updated);
  };

  const allVideos = [
    ...existing.map((v) => ({ id: v.id, url: v.video_url, isExisting: true })),
    ...pending.map((v) => ({ url: v.url, isExisting: false })),
  ];

  return (
    <div>
      {/* Existing + pending video list */}
      {allVideos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {allVideos.map((v) => (
            <div key={v.url} className="relative aspect-video rounded-lg overflow-hidden group border border-border bg-surface">
              <VideoPreview url={v.url} />
              <button
                type="button"
                onClick={() => v.isExisting ? removeExisting(v.id) : removePending(v.url)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* URL input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          placeholder="https://youtube.com/watch?v=..."
          className="flex-1 px-3.5 py-2.5 rounded-lg border border-border bg-white text-primary text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
        <button
          type="button"
          onClick={addUrl}
          className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors whitespace-nowrap"
        >
          Add Video
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      <p className="text-xs text-muted mt-1.5">Paste a YouTube or Vimeo URL</p>
    </div>
  );
}
