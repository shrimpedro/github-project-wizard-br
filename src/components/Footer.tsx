
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Lock } from 'lucide-react';

interface FooterProps {
  siteName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const Footer: React.FC<FooterProps> = ({ 
  siteName = "Real Estate",
  contactEmail = "contato@example.com",
  contactPhone = "(00) 0000-0000" 
}) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{siteName}</h3>
            <p className="mb-4 text-gray-300">
              Sua imobiliária de confiança para encontrar o imóvel dos seus sonhos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/alugar" className="text-gray-300 hover:text-white transition-colors">Alugar</Link>
              </li>
              <li>
                <Link to="/comprar" className="text-gray-300 hover:text-white transition-colors">Comprar</Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-300 hover:text-white transition-colors">Contato</Link>
              </li>
              <li>
                <Link 
                  to="/admin" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Lock size={16} />
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <address className="not-italic">
              <p className="mb-2 text-gray-300">Rua Exemplo, 123</p>
              <p className="mb-2 text-gray-300">São Paulo - SP</p>
              <p className="mb-2">
                <strong>Email:</strong>{" "}
                <a href={`mailto:${contactEmail}`} className="text-gray-300 hover:text-white transition-colors">
                  {contactEmail}
                </a>
              </p>
              <p>
                <strong>Telefone:</strong>{" "}
                <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="text-gray-300 hover:text-white transition-colors">
                  {contactPhone}
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {siteName}. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors mr-4">
              Termos de Uso
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
