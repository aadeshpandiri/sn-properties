'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema } from '@/lib/validators';
import { PROPERTY_TYPES, LISTING_TYPES, PROPERTY_STATUS } from '@/lib/constants';
import { savePropertyImages, savePropertyVideos } from '@/app/actions/properties';
import ImageUpload from '@/components/admin/ImageUpload';
import VideoUpload from '@/components/admin/VideoUpload';

function FieldError({ error }) {
  if (!error) return null;
  return <p className="text-red-500 text-xs mt-1">{error.message}</p>;
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-primary mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-primary text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent';

export default function PropertyForm({ property, action, existingImages = [], existingVideos = [] }) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingImageUrls, setPendingImageUrls] = useState([]);
  const [pendingVideoUrls, setPendingVideoUrls] = useState([]);
  const isEdit = Boolean(property);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title ?? '',
      description: property?.description ?? '',
      listing_type: property?.listing_type ?? 'sale',
      property_type: property?.property_type ?? '',
      price: property?.price ?? undefined,
      bedrooms: property?.bedrooms ?? 0,
      bathrooms: property?.bathrooms ?? 0,
      area: property?.area ?? undefined,
      address: property?.address ?? '',
      city: property?.city ?? '',
      status: property?.status ?? 'available',
      featured: property?.featured ?? false,
      availability_date: property?.availability_date ?? '',
    },
  });

  const listingType = watch('listing_type');

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');

    const result = await action(data);

    if (result?.error) {
      setServerError(result.error);
      setLoading(false);
      return;
    }

    // Associate media with the property (create uses returned id, edit uses property.id)
    const propertyId = result?.id ?? property?.id;

    if (propertyId) {
      if (pendingImageUrls.length) {
        const imgResult = await savePropertyImages(propertyId, pendingImageUrls);
        if (imgResult?.error) { setServerError(imgResult.error); setLoading(false); return; }
      }
      if (pendingVideoUrls.length) {
        const vidResult = await savePropertyVideos(propertyId, pendingVideoUrls);
        if (vidResult?.error) { setServerError(vidResult.error); setLoading(false); return; }
      }
    }

    router.push('/admin/properties');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          {serverError}
        </div>
      )}

      <div className="space-y-6">

        {/* ── BASIC INFO ── */}
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-5">Basic Information</h3>
          <div className="space-y-4">

            <div>
              <Label required>Property Title</Label>
              <input {...register('title')} placeholder="e.g. Modern Downtown Apartment" className={inputClass} />
              <FieldError error={errors.title} />
            </div>

            <div>
              <Label required>Listing Type</Label>
              <div className="flex rounded-lg overflow-hidden border border-border w-fit">
                {LISTING_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setValue('listing_type', t.value, { shouldValidate: true })}
                    className={`px-6 py-2.5 text-sm font-medium transition-colors ${
                      listingType === t.value
                        ? 'bg-primary text-white'
                        : 'bg-white text-muted hover:text-primary'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <input type="hidden" {...register('listing_type')} />
              <FieldError error={errors.listing_type} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label required>Property Type</Label>
                <select {...register('property_type')} className={inputClass}>
                  <option value="">Select type…</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <FieldError error={errors.property_type} />
              </div>

              <div>
                <Label required>Status</Label>
                <select {...register('status')} className={inputClass}>
                  {PROPERTY_STATUS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <FieldError error={errors.status} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                {...register('featured')}
                type="checkbox"
                id="featured"
                className="w-4 h-4 rounded accent-accent cursor-pointer"
              />
              <label htmlFor="featured" className="text-sm text-primary cursor-pointer select-none">
                Mark as Featured Property
              </label>
            </div>

          </div>
        </div>

        {/* ── DETAILS ── */}
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-5">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <Label required>Price ({listingType === 'rent' ? '$/month' : '$'})</Label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 450000"
                className={inputClass}
              />
              <FieldError error={errors.price} />
            </div>

            <div>
              <Label required>Area (sqft)</Label>
              <input
                {...register('area', { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="e.g. 1200"
                className={inputClass}
              />
              <FieldError error={errors.area} />
            </div>

            <div>
              <Label>Bedrooms</Label>
              <input
                {...register('bedrooms', { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="0"
                className={inputClass}
              />
              <FieldError error={errors.bedrooms} />
            </div>

            <div>
              <Label>Bathrooms</Label>
              <input
                {...register('bathrooms', { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="0"
                className={inputClass}
              />
              <FieldError error={errors.bathrooms} />
            </div>

            <div>
              <Label>Availability Date</Label>
              <input
                {...register('availability_date')}
                type="date"
                className={inputClass}
              />
              <FieldError error={errors.availability_date} />
            </div>

          </div>
        </div>

        {/* ── LOCATION ── */}
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-5">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label required>City</Label>
              <input {...register('city')} placeholder="e.g. San Francisco" className={inputClass} />
              <FieldError error={errors.city} />
            </div>
            <div>
              <Label required>Full Address</Label>
              <input {...register('address')} placeholder="e.g. 123 Market St" className={inputClass} />
              <FieldError error={errors.address} />
            </div>
          </div>
        </div>

        {/* ── DESCRIPTION ── */}
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-5">Description</h3>
          <Label required>Property Description</Label>
          <textarea
            {...register('description')}
            rows={6}
            placeholder="Describe the property — features, highlights, nearby amenities…"
            className={`${inputClass} resize-none`}
          />
          <FieldError error={errors.description} />
        </div>

        {/* ── PHOTOS ── */}
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-1">Photos</h3>
          <p className="text-muted text-xs mb-5">Photos upload immediately when selected — no need to save first.</p>
          <ImageUpload
            existingImages={existingImages}
            onNewImages={setPendingImageUrls}
          />
        </div>

        {/* ── VIDEOS ── */}
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-1">Videos</h3>
          <p className="text-muted text-xs mb-5">Videos upload immediately when selected — no need to save first.</p>
          <VideoUpload
            existingVideos={existingVideos}
            onNewVideos={setPendingVideoUrls}
          />
        </div>

        {/* ── ACTIONS ── */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => router.push('/admin/properties')}
            className="px-6 py-2.5 text-sm text-muted hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? (isEdit ? 'Saving…' : 'Creating…')
              : (isEdit ? 'Save Changes' : 'Create Property')}
          </button>
        </div>

      </div>
    </form>
  );
}
