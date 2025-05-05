
import React, { useState, useEffect } from 'react';
import SiteSettingsForm from '../components/admin/SiteSettingsForm';

// Estas configurações viriam de uma API em uma aplicação real
const defaultSettings = {
  siteName: "ImobiliáriaApp",
  logo: "",
  contactEmail: "contato@imobiliaria.com",
  contactPhone: "(11) 9999-9999",
  heroTitle: "Encontre seu novo lar",
  heroSubtitle: "Milhares de imóveis para alugar ou comprar",
  heroBackground: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregamento de dados da API
    const savedSettings = localStorage.getItem('siteSettings');
    
    setTimeout(() => {
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSaveSettings = (newSettings: typeof defaultSettings) => {
    // Em uma aplicação real, enviaríamos para uma API
    localStorage.setItem('siteSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações do Site</h1>
      <SiteSettingsForm 
        initialSettings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default SettingsPage;
