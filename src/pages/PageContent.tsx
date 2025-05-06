
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { pageService, siteSettingsService } from '../services/api';
import NotFound from './NotFound';

const PageContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageContent, setPageContent] = useState<any>(null);
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!slug) throw new Error('Página não encontrada');
        
        const [pageData, siteSettings] = await Promise.all([
          pageService.getPageBySlug(slug),
          siteSettingsService.getSettings()
        ]);
        
        setPageContent(pageData);
        setSettings(siteSettings);
      } catch (error) {
        console.error('Error fetching page:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header logo={settings.logo} siteName={settings.site_name || "ImobiliáriaApp"} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          </div>
        </main>
        <Footer 
          siteName={settings.site_name || "ImobiliáriaApp"} 
          contactEmail={settings.contact_email || "contato@imobiliaria.com"} 
          contactPhone={settings.contact_phone || "(11) 9999-9999"} 
        />
      </div>
    );
  }

  if (error || !pageContent) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header logo={settings.logo} siteName={settings.site_name || "ImobiliáriaApp"} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose max-w-full mx-auto" dangerouslySetInnerHTML={{ __html: pageContent.content }} />
      </main>
      <Footer 
        siteName={settings.site_name || "ImobiliáriaApp"} 
        contactEmail={settings.contact_email || "contato@imobiliaria.com"} 
        contactPhone={settings.contact_phone || "(11) 9999-9999"} 
      />
    </div>
  );
};

export default PageContent;
