import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageTranslator } from '@/components/ui/language-translator';
import { usePublishedPages } from '@/hooks/useCMS';
import logo from '@/assets/atroun-logo.png';

const allPages = [
  { name: 'Home', href: '/', slug: 'home' },
  { name: 'About', href: '/about', slug: 'about' },
  { name: 'What We Do', href: '/what-we-do', slug: 'what-we-do' },
  { name: 'Technology', href: '/technology', slug: 'technology' },
  { name: 'Markets', href: '/markets', slug: 'markets' },
  { name: 'Sustainability', href: '/sustainability', slug: 'sustainability' },
  { name: 'Investors', href: '/investors', slug: 'investors' },
  { name: 'Contact', href: '/contact', slug: 'contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data: publishedPages } = usePublishedPages();

  const pages = useMemo(() => {
    if (!publishedPages) return allPages; // Show all while loading
    const publishedSlugs = new Set(publishedPages.map(p => p.slug));
    return allPages.filter(page => publishedSlugs.has(page.slug));
  }, [publishedPages]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="ATROUN Bio-Dynamics" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {pages.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-3 py-2 text-sm font-body font-medium transition-colors rounded-md ${
                location.pathname === item.href
                  ? 'text-primary bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <LanguageTranslator />
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-1">
            <div className="px-4 py-2">
              <LanguageTranslator />
            </div>
            {pages.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-body font-medium transition-colors rounded-md ${
                  location.pathname === item.href
                    ? 'text-primary bg-secondary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
