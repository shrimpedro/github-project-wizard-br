
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SiteSettingsForm from '../components/admin/SiteSettingsForm';
import ThemeCustomizer, { ThemeSettings } from '../components/admin/ThemeCustomizer';

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

const defaultTheme: ThemeSettings = {
  primaryColor: '#222222',
  secondaryColor: '#3182ce',
  accentColor: '#48bb78',
  textColor: '#1a202c',
  backgroundColor: '#ffffff',
  headerBackground: '#f7fafc',
  footerBackground: '#2d3748',
  buttonColor: '#3182ce',
  borderRadius: '0.5rem',
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    // Simulação de carregamento de dados da API
    const savedSettings = localStorage.getItem('siteSettings');
    const savedTheme = localStorage.getItem('siteTheme');
    
    setTimeout(() => {
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      if (savedTheme) {
        setTheme(JSON.parse(savedTheme));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSaveSettings = (newSettings: typeof defaultSettings) => {
    // Em uma aplicação real, enviaríamos para uma API
    localStorage.setItem('siteSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const handleSaveTheme = (newTheme: ThemeSettings) => {
    localStorage.setItem('siteTheme', JSON.stringify(newTheme));
    setTheme(newTheme);
    // Aplicar o tema imediatamente
    applyTheme(newTheme);
  };

  const applyTheme = (theme: ThemeSettings) => {
    // Aplicar as cores do tema como variáveis CSS
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--accent', theme.accentColor);
    root.style.setProperty('--text', theme.textColor);
    root.style.setProperty('--background', theme.backgroundColor);
    root.style.setProperty('--button', theme.buttonColor);
  };

  // Aplicar o tema ao carregar a página
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

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
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="general">Configurações Gerais</TabsTrigger>
          <TabsTrigger value="theme">Personalização de Tema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <SiteSettingsForm 
            initialSettings={settings}
            onSave={handleSaveSettings}
          />
        </TabsContent>
        
        <TabsContent value="theme" className="mt-6">
          <ThemeCustomizer
            initialTheme={theme}
            onSave={handleSaveTheme}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
