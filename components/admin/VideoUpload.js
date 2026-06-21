'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadPropertyVideo, deletePropertyVideo } from '@/app/actions/properties';

export default function VideoUpload({ existingVideos = [], onNewVideos }) {
  const [existing, setExisting] = useState(existingVideos);
  const [newVideos, setNewVideos] = useState([]);
  const inputRef = useRef(null);
  const onNewVideosRef = useRef(onNewVideos);
  onNewVideosRef.current = onNewVideos;

  useEffect(() => {
    const urls = newVideos.filter((v) => !v.uploading).map((v) => v.url);
    onNewVideosRef.current(urls);
  }, [newVideos]);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';

    for (const file of files) {
      if (!file.type.startsWith('video/')) continue;
      if (file.size > 200 * 1024 * 1024) {
        alert(`"${file.name}" is too large — max 200 MB`);
        continue;
      }

      const tempId = `${Date.now()}-${Math.random()}`;
      const previewUrl = URL.createObjectURL(file);

      setNewVideos((prev) => [...prev, { tempId, url: previewUrl, uploading: true }]);

      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadPropertyVideo(formData);

      if (result?.url) {
        URL.revokeObjectURL(previewUrl);
        setNewVideos((prev) =>
          prev.map((v) =>
            v.tempId === tempId ? { tempId, url: result.url, uploading: false } : v
          )
        );
      } else {
        URL.revokeObjectURL(previewUrl);
        setNewVideos((prev) => prev.filter((v) => v.tempId !== tempId));
        alert(result?.error || `Failed to upload "${file.name}"`);
      }
    }
  };

  const removeExisting = async (id, url) => {
    if (!confirm('Delete this video permanently?')) return;
    const result = await deletePropertyVideo(id, url);
    if (!result?.error) {
      setExisting((prev) => prev.filter((v) => v.id !== id));
    } else {
      alert(result.error);
    }
  };

  const removeNew = (tempId) => {
    setNewVideos((prev) => prev.filter((v) => v.tempId !== tempId));
  };

  const total = existing.length + newVideos.length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Existing videos */}
        {existing.map((v) => (
          <div key={v.id} className="relative aspect-video rounded-lg overflow-hidden group border border-border bg-surface">
            <video src={v.video_url} className="w-full h-full object-cover" muted playsInline />
            <button
              type="button"
              onClick={() => removeExisting(v.id, v.video_url)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
            >
              ✕
            </button>
            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ))}

        {/* New videos (uploading or done) */}
        {newVideos.map((v) => (
          <div key={v.tempId} className="relative aspect-video rounded-lg overflow-hidden group border border-border bg-surface">
            {v.uploading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted">Uploading…</span>
              </div>
            ) : (
              <>
                <video src={v.url} className="w-full h-full object-cover" muted playsInline />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            )}
            {!v.uploading && (
              <button
                type="button"
                onClick={() => removeNew(v.tempId)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {/* Upload button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1.5 text-muted hover:border-accent hover:text-accent transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="text-xs font-medium">Add Video</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        multiple
        onChange={handleFiles}
        className="sr-only"
      />

      <p className="text-xs text-muted">
        {total > 0 ? `${total} video${total !== 1 ? 's' : ''} added · ` : ''}
        MP4, MOV, WEBM — max 200 MB each
      </p>
    </div>
  );
}
