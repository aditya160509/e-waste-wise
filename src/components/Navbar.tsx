import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Education', href: '/education' },
    { name: 'Recycling Centers', href: '/recycling-centers' },
    { name: 'How it Works', href: '/#how-it-works' },
  ];

  const location = useLocation();
  const isActive = (href: string) => {
    const path = location.pathname + (location.hash || '');
    if (href === '/') return location.pathname === '/';
    return path.startsWith(href.replace('#', ''));
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/65 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b">
      <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              E-Waste Classifier
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-baseline space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative text-muted-foreground hover:text-primary font-body transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-primary after:transition-all ${isActive(item.href) ? 'text-foreground after:w-full' : 'after:w-0 hover:after:w-full'}`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="glass-button"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* CTA Button */}
            <Button 
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium hover-lift"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Try Demo
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-panel border-t border-border">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-muted-foreground hover:text-primary font-body transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile Theme Toggle */}
              <Button
                variant="ghost"
                className="w-full justify-start glass-button"
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light Mode
                  </>
                )}
              </Button>

              <Button 
                className="w-full mt-4 bg-gradient-primary hover:opacity-90 text-primary-foreground"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Try Demo
              </Button>
            </div>
          </div>
        )}
      </div>
      </nav>
    </header>
  );
};

export default Navbar;
