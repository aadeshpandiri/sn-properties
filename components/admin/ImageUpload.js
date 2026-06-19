'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadPropertyImage, deletePropertyImage } from '@/app/actions/properties';

export default function ImageUpload({ existingImages = [], onNewImages }) {
  const [existing, setExisting] = useState(existingImages);
  const [newImages, setNewImages] = useState([]);
  const inputRef = useRef(null);
  const onNewImagesRef = useRef(onNewImages);
  onNewImagesRef.current = onNewImages;

  // Notify parent whenever newImages change
  useEffect(() => {
    const urls = newImages.filter((img) => !img.uploading).map((img) => img.url);
    onNewImagesRef.current(urls);
  }, [newImages]);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" is too large — max 5 MB`);
        continue;
      }

      const tempId = `${Date.now()}-${Math.random()}`;
      const previewUrl = URL.createObjectURL(file);

      setNewImages((prev) => [...prev, { tempId, url: previewUrl, uploading: true }]);

      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadPropertyImage(formData);

      if (result?.url) {
        setNewImages((prev) =>
          prev.map((img) =>
            img.tempId === tempId ? { tempId, url: result.url, uploading: false } : img
          )
        );
      } else {
        setNewImages((prev) => prev.filter((img) => img.tempId !== tempId));
        alert(result?.error || `Failed to upload "${file.name}"`);
      }
    }
  };

  const removeExisting = async (id, url) => {
    if (!confirm('Delete this image permanently?')) return;
    const result = await deletePropertyImage(id, url);
    if (!result?.error) {
      setExisting((prev) => prev.filter((img) => img.id !== id));
    } else {
      alert(result.error);
    }
  };

  const removeNew = (tempId) => {
    setNewImages((prev) => prev.filter((img) => img.tempId !== tempId));
  };

  const total = existing.length + newImages.length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Existing images */}
        {existing.map((img) => (
          <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden group border border-border bg-surface">
            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeExisting(img.id, img.image_url)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}

        {/* New images (uploading or done) */}
        {newImages.map((img) => (
          <div key={img.tempId} className="relative aspect-video rounded-lg overflow-hidden group border border-border bg-surface">
            {img.uploading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted">Uploading…</span>
              </div>
            ) : (
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            )}
            {!img.uploading && (
              <button
                type="button"
                onClick={() => removeNew(img.tempId)}
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
          <span className="text-xs font-medium">Add Photos</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFiles}
        className="sr-only"
      />

      <p className="text-xs text-muted">
        {total > 0 ? `${total} photo${total !== 1 ? 's' : ''} added · ` : ''}
        JPG, PNG, WEBP — max 5 MB each
      </p>
    </div>
  );
}
