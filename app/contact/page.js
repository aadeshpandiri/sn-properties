import { supabase } from '@/lib/supabase';
import ContactForm from '@/components/contact/ContactForm';
import FaqAccordion from '@/components/contact/FaqAccordion';
import Card from '@/components/ui/Card';

export const metadata = {
  title: 'Contact Us — SN Properties',
  description: 'Get in touch with the SN Properties team. We are ready to help you find your perfect property.',
};

const DEFAULTS = {
  phone:          '+44 7424 794571',
  email:          'Snlettingsproperties@gmail.com',
  address:        'Icon Office London, Office 1, 182-184 High Street North, East Ham, London E6 2JA',
  hours_weekday:  'Mon – Fri: 9:00 AM – 6:00 PM',
  hours_saturday: 'Sat: 10:00 AM – 4:00 PM',
  hours_sunday:   'Sun: Closed',
};

async function getContactData() {
  if (!supabase) return { settings: DEFAULTS, faqs: [] };

  const [settingsRes, faqsRes] = await Promise.all([
    supabase.from('site_settings').select('key, value'),
    supabase.from('faqs').select('id, question, answer').eq('active', true).order('order_index').order('created_at'),
  ]);

  const settings = settingsRes.data?.length
    ? settingsRes.data.reduce((acc, row) => ({ ...acc, [row.key]: row.value ?? '' }), { ...DEFAULTS })
    : DEFAULTS;

  return { settings, faqs: faqsRes.data ?? [] };
}

export default async function ContactPage() {
  const { settings, faqs } = await getContactData();

  const infoCards = [
    {
      icon: '📍',
      label: 'Office Address',
      value: settings.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`,
      linkLabel: 'Get directions',
    },
    {
      icon: '📞',
      label: 'Phone',
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\D/g, '')}`,
      linkLabel: 'Call us',
    },
    {
      icon: '✉️',
      label: 'Email',
      value: settings.email,
      href: `mailto:${settings.email}`,
      linkLabel: 'Send email',
    },
    {
      icon: '🕐',
      label: 'Business Hours',
      value: [settings.hours_weekday, settings.hours_saturday, settings.hours_sunday].filter(Boolean).join('\n'),
    },
  ];

  return (
    <main>
      {/* Header */}
      <section className="bg-primary py-20">
        <div className="container-custom text-center">
          <span className="section-label">We&apos;re Here to Help</span>
          <h1 className="text-5xl font-bold text-white mt-4 mb-4">Get In Touch</h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Have questions about a property? Our team is ready to help you find the perfect home.
          </p>
        </div>
      </section>

      {/* Form + contact info */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact form — left (2 cols) */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Contact info — right */}
            <div className="space-y-4">
              {infoCards.map((card) => (
                <Card key={card.label} className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{card.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">{card.label}</p>
                      <p className="text-sm text-primary whitespace-pre-line leading-relaxed">{card.value}</p>
                      {card.href && (
                        <a
                          href={card.href}
                          className="text-xs text-accent hover:underline mt-1.5 inline-block"
                          target={card.href.startsWith('http') ? '_blank' : undefined}
                          rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {card.linkLabel} →
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {/* WhatsApp CTA */}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Hi, I have a question about a property.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  💬 Chat on WhatsApp
                </a>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <FaqAccordion faqs={faqs} />
    </main>
  );
}
