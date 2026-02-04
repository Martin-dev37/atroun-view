import { Link } from 'react-router-dom';
import logo from '@/assets/atroun-logo.png';

const footerLinks = {
  company: [
    { name: 'About ATROUN', href: '/about' },
    { name: 'What We Do', href: '/what-we-do' },
    { name: 'Technology & Platform', href: '/technology' },
  ],
  business: [
    { name: 'Markets & Partnerships', href: '/markets' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Investors', href: '/investors' },
  ],
  connect: [
    { name: 'Contact Us', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <img src={logo} alt="ATROUN Bio-Dynamics" className="h-12 w-auto brightness-0 invert" />
            </Link>
            <p className="mt-6 text-sm text-primary-foreground/80 leading-relaxed font-body">
              Building integrated agri-biotech and biorefinery systems for high-value food and bio-based ingredients.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-body font-semibold tracking-wide uppercase text-primary-foreground/60 mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-body text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-sm font-body font-semibold tracking-wide uppercase text-primary-foreground/60 mb-4">
              Business
            </h4>
            <ul className="space-y-3">
              {footerLinks.business.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-body text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-body font-semibold tracking-wide uppercase text-primary-foreground/60 mb-4">
              Connect
            </h4>
            <ul className="space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm font-body text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <a 
                href="https://wa.me/256783125129" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-body text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                +256 783 125 129
              </a>
              <a 
                href="mailto:atroun.bd@gmail.com" 
                className="block text-sm font-body text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                atroun.bd@gmail.com
              </a>
              <p className="text-sm font-body text-primary-foreground/60">Uganda, East Africa</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10">
          <p className="text-sm font-body text-primary-foreground/60 text-center">
            © {new Date().getFullYear()} ATROUN Bio-Dynamics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
