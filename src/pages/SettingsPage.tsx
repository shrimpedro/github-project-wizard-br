
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
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
  address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100",
  socialFacebook: "https://facebook.com/imobiliaria",
  socialInstagram: "https://instagram.com/imobiliaria",
  socialLinkedin: "https://linkedin.com/company/imobiliaria",
  metaDescription: "Encontre os melhores imóveis para comprar e alugar. Casas, apartamentos e escritórios em todo o Brasil.",
  metaKeywords: "imóveis, aluguel, compra, apartamentos, casas, imobiliária",
  googleAnalyticsId: "",
  showContactInfo: true,
  showSocialLinks: true,
  enableContactForm: true,
  enableNewsletter: false,
  footerText: "© 2025 ImobiliáriaApp. Todos os direitos reservados."
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
  fontPrimary: 'Inter, sans-serif',
  fontSecondary: 'Playfair Display, serif',
  fontSize: 'medium',
  lineHeight: 'normal',
  cardBackground: '#ffffff',
  navbarVariant: 'light',
  buttonStyle: 'rounded',
  heroHeight: 'medium',
  containerWidth: 'standard',
  enableAnimations: true,
  showLogo: true,
  showSocialLinks: true,
  enableDarkMode: false,
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

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
    setHasChanges(true);
    
    // Refresh após 2 segundos para demonstrar as mudanças
    setTimeout(() => {
      setHasChanges(false);
    }, 2000);
  };

  const handleSaveTheme = (newTheme: ThemeSettings) => {
    localStorage.setItem('siteTheme', JSON.stringify(newTheme));
    setTheme(newTheme);
    setHasChanges(true);
    
    // Aplicar o tema imediatamente
    applyTheme(newTheme);
    
    // Refresh após 2 segundos para demonstrar as mudanças
    setTimeout(() => {
      setHasChanges(false);
    }, 2000);
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
    
    // Apply additional theme settings
    if (theme.fontPrimary) {
      root.style.setProperty('--font-primary', theme.fontPrimary);
    }
    
    if (theme.fontSecondary) {
      root.style.setProperty('--font-secondary', theme.fontSecondary);
    }
    
    if (theme.cardBackground) {
      root.style.setProperty('--card-bg', theme.cardBackground);
    }
  };

  // Aplicar o tema ao carregar a página
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  if (isLoading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações do Site</h1>
      
      {hasChanges && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
          <span>Suas alterações foram salvas com sucesso!</span>
          <span className="text-sm">As alterações serão aplicadas ao site.</span>
        </div>
      )}
      
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
