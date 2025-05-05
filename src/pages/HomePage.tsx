
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import PropertyGrid from '../components/PropertyGrid';
import { Property } from '../components/PropertyCard';

// Este é um exemplo de dados, em produção viria de uma API
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento em Pinheiros',
    address: 'Pinheiros, São Paulo - SP',
    price: 2500,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: '2',
    title: 'Casa em Vila Madalena',
    address: 'Vila Madalena, São Paulo - SP',
    price: 1200000,
    type: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: '3',
    title: 'Studio na Consolação',
    address: 'Consolação, São Paulo - SP',
    price: 1800,
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3R1ZGlvJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: '4',
    title: 'Apartamento em Moema',
    address: 'Moema, São Paulo - SP',
    price: 4500,
    type: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: '5',
    title: 'Casa em Perdizes',
    address: 'Perdizes, São Paulo - SP',
    price: 1500000,
    type: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: '6',
    title: 'Apartamento no Itaim',
    address: 'Itaim Bibi, São Paulo - SP',
    price: 3200,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 75,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
  }
];

// Em uma aplicação real, isso seria carregado de uma API ou banco de dados
const defaultSiteSettings = {
  siteName: "ImobiliáriaApp",
  logo: "",
  contactEmail: "contato@imobiliaria.com",
  contactPhone: "(11) 9999-9999",
  heroTitle: "Encontre seu novo lar",
  heroSubtitle: "Milhares de imóveis para alugar ou comprar",
  heroBackground: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
};

const HomePage = () => {
  const [settings, setSettings] = useState(defaultSiteSettings);

  // Em uma aplicação real, faríamos uma chamada para API aqui
  useEffect(() => {
    // Simula o carregamento das configurações da API
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header logo={settings.logo} siteName={settings.siteName} />
      
      <main className="flex-grow">
        <HeroSection 
          title={settings.heroTitle} 
          subtitle={settings.heroSubtitle} 
          backgroundImage={settings.heroBackground} 
        />
        
        <PropertyGrid properties={mockProperties} title="Destaques para alugar" />
        
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Encontre o imóvel perfeito para você</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Contamos com um time de especialistas prontos para ajudar você a encontrar seu novo lar ou investimento.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 20H6a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v3"></path>
                    <path d="M9 12v-4h6v4"></path>
                    <path d="M9 16h6"></path>
                    <path d="M16 20l2-2 4 4"></path>
                    <path d="M21 15l-2 2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Busque</h3>
                <p className="text-gray-600">
                  Utilize nossa ferramenta de busca avançada para encontrar o imóvel ideal.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"></path>
                    <path d="M19 17V5a2 2 0 0 0-2-2H4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Visite</h3>
                <p className="text-gray-600">
                  Agende visitas online e conheça os imóveis que mais te interessam.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 10h.01"></path>
                    <path d="M15 10h.01"></path>
                    <path d="M12 18H7a2 2 0 0 1-2-2v-1.1a2 2 0 0 1 .6-1.4l.4-.4A7.8 7.8 0 0 1 12 10a7.8 7.8 0 0 1 6 2.9l.4.4a2 2 0 0 1 .6 1.4V16a2 2 0 0 1-2 2h-5z"></path>
                    <path d="M12 18v-2"></path>
                    <rect x="2" y="2" width="20" height="8" rx="2"></rect>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Feche Negócio</h3>
                <p className="text-gray-600">
                  Negocie e firme seu contrato de forma segura e transparente.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-16">
          <PropertyGrid properties={mockProperties.slice(2)} title="Destaques para comprar" />
        </div>
      </main>
      
      <Footer 
        siteName={settings.siteName}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
      />
    </div>
  );
};

export default HomePage;
