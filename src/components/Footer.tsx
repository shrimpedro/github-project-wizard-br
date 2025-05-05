
import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
}

const Footer = ({ siteName, contactEmail, contactPhone }: FooterProps) => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{siteName}</h3>
            <p className="text-gray-600">
              Encontre o imóvel perfeito para você de maneira rápida, segura e tranquila.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Para você</h3>
            <ul className="space-y-2">
              <li><Link to="/alugar" className="text-gray-600 hover:text-primary">Alugar</Link></li>
              <li><Link to="/comprar" className="text-gray-600 hover:text-primary">Comprar</Link></li>
              <li><Link to="/anunciar" className="text-gray-600 hover:text-primary">Anunciar imóvel</Link></li>
              <li><Link to="/ajuda" className="text-gray-600 hover:text-primary">Central de ajuda</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li><Link to="/sobre" className="text-gray-600 hover:text-primary">Sobre nós</Link></li>
              <li><Link to="/carreiras" className="text-gray-600 hover:text-primary">Carreiras</Link></li>
              <li><Link to="/termos" className="text-gray-600 hover:text-primary">Termos de uso</Link></li>
              <li><Link to="/privacidade" className="text-gray-600 hover:text-primary">Política de privacidade</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Email: {contactEmail || 'contato@imobiliaria.com'}</li>
              <li className="text-gray-600">Telefone: {contactPhone || '(11) 9999-9999'}</li>
              <li className="flex space-x-4 mt-4">
                <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="text-gray-600 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} {siteName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
