import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'About Us — SN Properties',
  description: 'Learn about SN Properties — our story, mission, and team. Over 15 years helping clients find their perfect property in the Bay Area.',
  openGraph: {
    title: 'About SN Properties',
    description: 'Over 15 years of expertise helping clients buy, sell, and rent premium properties.',
    type: 'website',
  },
};

export default function AboutPage() {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'With 15 years in real estate, Sarah founded SN Properties to transform the property market.',
    },
    {
      name: 'Michael Chen',
      role: 'Property Manager',
      bio: 'Michael oversees our portfolio with expertise in residential and commercial properties.',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Client Relations',
      bio: 'Emma ensures every client receives personalized service and exceptional support.',
    },
    {
      name: 'David Park',
      role: 'Investment Advisor',
      bio: 'David guides clients through investment decisions with market insights and expertise.',
    },
  ];

  const values = [
    {
      title: 'Integrity',
      description: 'We conduct all business with honesty and transparency.',
    },
    {
      title: 'Excellence',
      description: 'We strive for the highest standards in every aspect of our service.',
    },
    {
      title: 'Innovation',
      description: 'We embrace technology to improve the real estate experience.',
    },
    {
      title: 'Community',
      description: 'We build long-lasting relationships with our clients and stakeholders.',
    },
  ];

  return (
    <main className="container-custom py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="section-title text-5xl mb-4">About SN Properties</h1>
        <p className="text-muted text-lg max-w-3xl mx-auto mb-8">
          We're dedicated to making real estate transactions seamless, transparent, and accessible
          to everyone. With over a decade of combined expertise, our team brings passion and
          professionalism to every property transaction.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-muted leading-relaxed">
            To empower individuals and businesses in their real estate decisions through
            exceptional service, market expertise, and innovative solutions that create lasting
            value.
          </p>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-secondary/10 to-primary/10">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
          <p className="text-muted leading-relaxed">
            To be the most trusted and innovative real estate platform, where clients find not just
            properties, but their ideal lifestyle and investment opportunities.
          </p>
        </Card>
      </section>

      {/* Core Values */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-primary mb-8 text-center">Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-primary mb-2">{value.title}</h3>
              <p className="text-muted text-sm">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-primary mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full mb-4"></div>
              <h3 className="font-bold text-lg text-primary mb-1">{member.name}</h3>
              <p className="text-secondary text-sm font-medium mb-3">{member.role}</p>
              <p className="text-muted text-sm">{member.bio}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16 bg-surface rounded-lg p-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
            <p className="text-muted">Properties Sold</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary mb-2">1000+</h3>
            <p className="text-muted">Happy Clients</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary mb-2">$2B+</h3>
            <p className="text-muted">Transaction Value</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary mb-2">15+</h3>
            <p className="text-muted">Years Experience</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Ready to Get Started?</h2>
        <p className="text-muted mb-8 max-w-2xl mx-auto">
          Whether you're buying, selling, or investing, our team is here to guide you through every
          step of the process.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button variant="primary" className="px-8 py-3">
            Explore Properties
          </Button>
          <Button variant="secondary" className="px-8 py-3">
            Contact Us
          </Button>
        </div>
      </section>
    </main>
  );
}
