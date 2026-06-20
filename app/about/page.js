import Link from 'next/link';

export const metadata = {
  title: 'About Us — SN Properties',
  description: 'Learn about SN Properties — our story, mission, and team. Over 15 years helping clients find their perfect property in the Bay Area.',
  openGraph: {
    title: 'About SN Properties',
    description: 'Over 15 years of expertise helping clients buy, sell, and rent premium properties.',
    type: 'website',
  },
};

const stats = [
  { value: '500+',  label: 'Properties Sold' },
  { value: '1,000+', label: 'Happy Clients' },
  { value: '$2B+',  label: 'Transaction Value' },
  { value: '15+',   label: 'Years Experience' },
];

const values = [
  {
    icon: '⚖️',
    title: 'Integrity',
    description: 'Every deal is conducted with full transparency. No hidden fees, no surprises — just honest guidance you can rely on.',
  },
  {
    icon: '🏆',
    title: 'Excellence',
    description: 'We hold ourselves to the highest standard in service, market knowledge, and results for every client we serve.',
  },
  {
    icon: '💡',
    title: 'Innovation',
    description: 'From virtual tours to data-driven pricing, we leverage technology to give you a smarter property experience.',
  },
  {
    icon: '🤝',
    title: 'Community',
    description: 'We invest in the neighbourhoods we work in and build lasting relationships beyond the transaction.',
  },
];

const team = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    bio: 'With 15+ years in Bay Area real estate, Sarah founded SN Properties to set a new standard for client-first service.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  },
  {
    name: 'Michael Chen',
    role: 'Head of Property Management',
    bio: 'Michael oversees our growing portfolio with deep expertise across residential and commercial assets.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Client Relations Director',
    bio: 'Emma ensures every client feels heard, informed, and supported from first inquiry to closing day.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  },
  {
    name: 'David Park',
    role: 'Investment Advisor',
    bio: 'David guides investors with sharp market insights, helping them maximise returns and minimise risk.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  },
];

export default function AboutPage() {
  return (
    <main>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[520px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600"
          alt="San Francisco skyline"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative text-center text-white px-6 max-w-3xl mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">About Us</p>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Redefining Real Estate,<br />One Home at a Time
          </h1>
          <p className="text-white/75 text-lg leading-relaxed">
            For over 15 years, SN Properties has helped Bay Area families, investors,
            and businesses find exactly where they belong.
          </p>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────── */}
      <section className="bg-primary py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-accent mb-1">{s.value}</p>
                <p className="text-white/70 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ─────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-3">Our Story</p>
              <h2 className="text-4xl font-bold text-primary mb-6 leading-snug">
                Built on Trust,<br />Driven by Results
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  SN Properties was founded on a simple belief: buying or renting a home should be
                  one of life&apos;s great experiences, not a stressful ordeal. We set out to build a team
                  that combines deep local knowledge with genuine care for every client.
                </p>
                <p>
                  Today, we manage hundreds of listings across San Francisco and the wider Bay Area,
                  from sleek SoMa studios to oceanfront villas in Half Moon Bay. Whatever your next
                  chapter looks like, we&apos;ll help you write it.
                </p>
              </div>
              <div className="flex gap-4 mt-8">
                <Link href="/properties" className="btn-primary px-7 py-3 inline-flex">
                  Browse Listings
                </Link>
                <Link href="/contact" className="btn-ghost px-7 py-3 inline-flex">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-xl overflow-hidden h-[440px]">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900"
                  alt="Modern luxury interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-accent text-primary px-7 py-5 rounded-xl shadow-lg">
                <p className="text-3xl font-bold">15+</p>
                <p className="text-sm font-semibold opacity-80">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ──────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border-l-4 border-accent shadow-sm">
              <p className="text-accent font-bold text-xs uppercase tracking-widest mb-3">Mission</p>
              <h3 className="text-2xl font-bold text-primary mb-4">Why We Exist</h3>
              <p className="text-muted leading-relaxed">
                To empower individuals and businesses in their real estate decisions through
                exceptional service, market expertise, and innovative solutions that create
                lasting value for our clients and communities.
              </p>
            </div>
            <div className="bg-primary rounded-xl p-8 border-l-4 border-accent shadow-sm">
              <p className="text-accent font-bold text-xs uppercase tracking-widest mb-3">Vision</p>
              <h3 className="text-2xl font-bold text-white mb-4">Where We&apos;re Headed</h3>
              <p className="text-white/70 leading-relaxed">
                To be the most trusted and innovative real estate platform in the Bay Area —
                where clients find not just properties, but their ideal lifestyle and
                long-term investment opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ───────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="section-label mb-3">What We Stand For</p>
            <h2 className="text-4xl font-bold text-primary">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-7 text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-lg font-bold text-primary mb-3">{v.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────── */}
      <section className="py-24 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="section-label mb-3">The People Behind It</p>
            <h2 className="text-4xl font-bold text-primary">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="card overflow-hidden group">
                <div className="h-56 overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-primary text-lg">{member.name}</h3>
                  <p className="text-accent text-sm font-semibold mt-0.5 mb-3">{member.role}</p>
                  <p className="text-muted text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 bg-primary">
        <div className="container-custom text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">Ready to Begin?</p>
          <h2 className="text-4xl font-bold text-white mb-5">
            Let&apos;s Find Your Perfect Property
          </h2>
          <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto">
            Whether you&apos;re buying, selling, renting, or investing — our team is ready to guide you every step of the way.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/properties"
              className="px-8 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
