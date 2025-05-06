
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  logo?: string;
  siteName: string;
}

const Header: React.FC<HeaderProps> = ({ logo, siteName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            {logo ? (
              <img src={logo} alt={siteName} className="h-8 mr-2" />
            ) : (
              <span className="text-2xl font-bold text-primary">{siteName}</span>
            )}
          </Link>

          {/* Links de navegação para desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
              Início
            </Link>
            <Link to="/comprar" className="text-gray-600 hover:text-primary transition-colors">
              Comprar
            </Link>
            <Link to="/alugar" className="text-gray-600 hover:text-primary transition-colors">
              Alugar
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">
              Contato
            </Link>
          </nav>

          <div className="hidden md:block">
            <Link to="/admin">
              <Button variant="outline" className="mr-2">
                Área Administrativa
              </Button>
            </Link>
            <Link to="/submit-property">
              <Button>Anunciar Imóvel</Button>
            </Link>
          </div>

          {/* Botão do menu móvel */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Menu móvel */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t pt-2 pb-4 px-4">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/comprar"
              className="text-gray-600 hover:text-primary py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Comprar
            </Link>
            <Link
              to="/alugar"
              className="text-gray-600 hover:text-primary py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Alugar
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-primary py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-primary py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Link
              to="/admin"
              className="text-gray-600 hover:text-primary py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Área Administrativa
            </Link>
            <Link
              to="/submit-property"
              className="bg-primary text-white py-2 px-4 rounded text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Anunciar Imóvel
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
