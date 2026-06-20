'use client';

import { useState } from 'react';
import InquiryForm from './InquiryForm';
import ScheduleVisitForm from './ScheduleVisitForm';
import { WHATSAPP_NUMBER } from '@/lib/constants';

const TABS = [
  { id: 'inquiry', label: 'Send Inquiry' },
  { id: 'visit', label: 'Schedule Visit' },
];

export default function PropertySidebar({ property }) {
  const [tab, setTab] = useState('inquiry');

  const waMessage = encodeURIComponent(`Hi, I'm interested in "${property.title}" listed on SN Properties. Can you share more details?`);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  return (
    <div className="space-y-4">

      {/* Price card */}
      <div className="card p-5">
        <p className="text-3xl font-bold text-accent">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.price)}
          {property.listing_type === 'rent' && <span className="text-base font-normal text-muted">/mo</span>}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            property.listing_type === 'rent' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
          }`}>
            {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
            property.status === 'available' ? 'bg-green-50 text-green-700' :
            property.status === 'sold' ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {property.status}
          </span>
        </div>
      </div>

      {/* Contact card */}
      <div className="card p-5">
        {/* Tabs */}
        <div className="flex border-b border-border mb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'text-primary border-b-2 border-primary -mb-px'
                  : 'text-muted hover:text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'inquiry' ? (
          <InquiryForm propertyId={property.id} propertyTitle={property.title} />
        ) : (
          <ScheduleVisitForm propertyId={property.id} />
        )}
      </div>

      {/* WhatsApp CTA */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Chat on WhatsApp
      </a>

    </div>
  );
}
