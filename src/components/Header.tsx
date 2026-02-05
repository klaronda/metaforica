import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ContactModal } from "./ContactModal";

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <style>{`
        header {
          background-color: #020202 !important;
        }
        header a:not(.sr-only) {
          color: #fdd91f !important;
        }
        header a:not(.sr-only):hover {
          color: #fee568 !important;
        }
      `}</style>
      <header className="!bg-[#020202] sticky top-0 z-50 shadow-lg" style={{ backgroundColor: '#020202' }}>
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#fdd91f] focus:text-[#020202] focus:px-4 focus:py-2 focus:rounded-full focus:font-bold"
      >
        Skip to main content
      </a>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
              className="text-3xl font-black text-[#fdd91f] text-shadow-warm transform -rotate-1 hover:scale-105 transition-transform cursor-pointer"
              aria-label="Metafórica home"
            >
              Metafórica
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-8">
            <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-all duration-200 font-semibold hover:scale-105">
              Home
            </a>
            <a href="/escritos" onClick={(e) => { e.preventDefault(); handleNavClick('allPosts'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-all duration-200 font-semibold hover:scale-105">
              Blog
            </a>
            <a href="/#podcast" onClick={(e) => { e.preventDefault(); handleNavClick('podcast'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-all duration-200 font-semibold hover:scale-105">
              Podcast
            </a>
            <a href="/historias" onClick={(e) => { e.preventDefault(); handleNavClick('historias'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-all duration-200 font-semibold hover:scale-105">
              Cuentos
            </a>
            <a href="/#books" onClick={(e) => { e.preventDefault(); handleNavClick('books'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-all duration-200 font-semibold hover:scale-105">
              Libros
            </a>
            <a href="/#about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-all duration-200 font-semibold hover:scale-105">
              Mi Historia
            </a>
            <Button 
              onClick={handleContactClick}
              className="!bg-[#fdd91f] hover:!bg-[#fee568] !text-[#020202] font-bold rounded-full px-6 py-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
              style={{ backgroundColor: '#fdd91f', color: '#020202' }}
            >
              Contacto
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden bg-[#020202] rounded-full p-2 shadow-lg border-2 border-[#fdd91f]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-[#fdd91f]" />
            ) : (
              <Menu className="h-6 w-6 text-[#fdd91f]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav aria-label="Mobile navigation" className="md:hidden py-4 border-t border-[#fdd91f]">
            <div className="flex flex-col space-y-4">
              <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-colors font-semibold text-left">
                Home
              </a>
              <a href="/escritos" onClick={(e) => { e.preventDefault(); handleNavClick('allPosts'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-colors font-semibold text-left">
                Blog
              </a>
              <a href="/#podcast" onClick={(e) => { e.preventDefault(); handleNavClick('podcast'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-colors font-semibold text-left">
                Podcast
              </a>
              <a href="/historias" onClick={(e) => { e.preventDefault(); handleNavClick('historias'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-colors font-semibold text-left">
                Cuentos
              </a>
              <a href="/#books" onClick={(e) => { e.preventDefault(); handleNavClick('books'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-colors font-semibold text-left">
                Libros
              </a>
              <a href="/#about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} className="text-[#fdd91f] hover:text-[#fee568] transition-colors font-semibold text-left">
                Mi Historia
              </a>
              <Button 
                onClick={handleContactClick}
                className="!bg-[#fdd91f] hover:!bg-[#fee568] !text-[#020202] font-bold rounded-full w-full shadow-lg"
                style={{ backgroundColor: '#fdd91f', color: '#020202' }}
              >
                Contacto
              </Button>
            </div>
          </nav>
        )}
      </div>

      {/* Contact Modal */}
      <ContactModal 
        open={isContactModalOpen} 
        onOpenChange={setIsContactModalOpen}
      />
    </header>
    </>
  );
}