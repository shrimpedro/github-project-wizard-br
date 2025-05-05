
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';

interface SiteSettings {
  siteName: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBackground: string;
}

interface SiteSettingsFormProps {
  initialSettings: SiteSettings;
  onSave: (settings: SiteSettings) => void;
}

const SiteSettingsForm = ({ initialSettings, onSave }: SiteSettingsFormProps) => {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialSettings.logo || null);
  const [bgPreview, setBgPreview] = useState<string | null>(initialSettings.heroBackground || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'heroBackground') => {
    const file = e.target.files?.[0];
    if (file) {
      // Em uma aplicação real, você faria upload para um servidor e receberia a URL
      // Aqui estamos apenas criando uma URL temporária para visualização
      const imageUrl = URL.createObjectURL(file);
      
      if (type === 'logo') {
        setLogoPreview(imageUrl);
        setSettings(prev => ({ ...prev, logo: imageUrl }));
      } else {
        setBgPreview(imageUrl);
        setSettings(prev => ({ ...prev, heroBackground: imageUrl }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Configure as informações básicas do seu site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Nome do Site</Label>
            <Input
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              placeholder="Ex: Minha Imobiliária"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              name="logo"
              type="file"
              onChange={(e) => handleImageChange(e, 'logo')}
              accept="image/*"
            />
            {logoPreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Visualização:</p>
                <img src={logoPreview} alt="Logo preview" className="h-12 object-contain" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email de Contato</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleChange}
              placeholder="contato@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Telefone de Contato</Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              value={settings.contactPhone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seção Hero</CardTitle>
          <CardDescription>Configure a seção de destaque da página inicial</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Título Principal</Label>
            <Input
              id="heroTitle"
              name="heroTitle"
              value={settings.heroTitle}
              onChange={handleChange}
              placeholder="Ex: Encontre seu novo lar"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtítulo</Label>
            <Input
              id="heroSubtitle"
              name="heroSubtitle"
              value={settings.heroSubtitle}
              onChange={handleChange}
              placeholder="Ex: Milhares de imóveis para alugar ou comprar"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroBackground">Imagem de Fundo</Label>
            <Input
              id="heroBackground"
              name="heroBackground"
              type="file"
              onChange={(e) => handleImageChange(e, 'heroBackground')}
              accept="image/*"
            />
            {bgPreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Visualização:</p>
                <img src={bgPreview} alt="Background preview" className="w-full h-32 object-cover rounded" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">Salvar Alterações</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SiteSettingsForm;
