import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Navigation() {
  return (
    <nav className="sticky top-0 bg-white shadow-sm border-b border-surface z-50">
      <div className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SN</span>
          </div>
          <span className="text-lg font-bold text-primary hidden sm:inline">SN Properties</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="text-text hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/properties" className="text-text hover:text-primary transition-colors">
                Properties
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-text hover:text-primary transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-text hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>

          {/* CTA Button */}
          <Link href="/contact" className="hidden md:block">
            <Button variant="primary" className="whitespace-nowrap">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
