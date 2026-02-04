import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageTranslator } from '@/components/ui/language-translator';
import { useNavigationItems } from '@/hooks/useCMS';
import logo from '@/assets/atroun-logo.png';

// Fallback navigation for when CMS is unavailable
const fallbackPages = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'What We Do', path: '/what-we-do' },
  { label: 'Technology', path: '/technology' },
  { label: 'Markets', path: '/markets' },
  { label: 'Sustainability', path: '/sustainability' },
  { label: 'Investors', path: '/investors' },
  { label: 'Contact', path: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data: navigationItems } = useNavigationItems();
  
  // Use CMS navigation items if available, otherwise fallback
  const pages = navigationItems && navigationItems.length > 0
    ? navigationItems.map(item => ({ label: item.label, path: item.path }))
    : fallbackPages;

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
              key={item.label}
              to={item.path}
              className={`px-3 py-2 text-sm font-body font-medium transition-colors rounded-md ${
                location.pathname === item.path
                  ? 'text-primary bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <LanguageTranslator />
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageTranslator />
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
            {pages.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-body font-medium transition-colors rounded-md ${
                  location.pathname === item.path
                    ? 'text-primary bg-secondary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}