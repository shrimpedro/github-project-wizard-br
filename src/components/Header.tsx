
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  siteName?: string;
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ siteName = "ImobiliáriaApp", logo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary' : 'text-gray-700 hover:text-primary';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Site Name */}
          <Link to="/" className="flex items-center">
            {logo ? (
              <img 
                src={logo} 
                alt={siteName} 
                className="h-8 mr-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            <span className="text-xl font-bold text-gray-900">{siteName}</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`font-medium ${isActive('/')}`}>
              Início
            </Link>
            <Link to="/alugar" className={`font-medium ${isActive('/alugar')}`}>
              Alugar
            </Link>
            <Link to="/comprar" className={`font-medium ${isActive('/comprar')}`}>
              Comprar
            </Link>
            <Link to="/contato" className={`font-medium ${isActive('/contato')}`}>
              Contato
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Menu principal"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md font-medium hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/alugar" 
              className="block px-3 py-2 rounded-md font-medium hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Alugar
            </Link>
            <Link 
              to="/comprar" 
              className="block px-3 py-2 rounded-md font-medium hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Comprar
            </Link>
            <Link 
              to="/contato" 
              className="block px-3 py-2 rounded-md font-medium hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
