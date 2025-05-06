
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Search, LogIn } from 'lucide-react';

interface HeaderProps {
  logo: string;
  siteName: string;
}

const Header = ({ logo, siteName }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            {logo ? (
              <img src={logo} alt={siteName} className="h-8 w-auto" />
            ) : (
              <div className="h-8 w-auto font-bold text-2xl text-primary">
                {siteName || "ImobiliáriaApp"}
              </div>
            )}
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Início
            </Link>
            <Link to="/alugar" className="text-sm font-medium hover:text-primary">
              Alugar
            </Link>
            <Link to="/comprar" className="text-sm font-medium hover:text-primary">
              Comprar
            </Link>
            <Link to="/anunciar" className="text-sm font-medium hover:text-primary">
              Anunciar imóvel
            </Link>
          </nav>
          <Link to="/submit-property" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ml-4">
            Enviar Imóvel
          </Link>
          <Link to="/admin" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
            <LogIn className="h-4 w-4" />
            Área do Corretor
          </Link>
        </div>
        
        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="px-2"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </Button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 pb-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Início
            </Link>
            <Link to="/alugar" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Alugar
            </Link>
            <Link to="/comprar" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Comprar
            </Link>
            <Link to="/anunciar" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Anunciar imóvel
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Link 
                to="/submit-property" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Enviar Imóvel
              </Link>
              <Link 
                to="/admin" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                Área do Corretor
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
