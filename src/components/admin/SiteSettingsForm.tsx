
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { 
  Upload, Building, Mail, Phone, Image, Type, 
  Globe, Facebook, Instagram, Linkedin, MapPin, 
  AlertCircle, CheckCircle2
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';

interface SiteSettings {
  siteName: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBackground: string;
  address?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  metaDescription?: string;
  metaKeywords?: string;
  googleAnalyticsId?: string;
  showContactInfo?: boolean;
  showSocialLinks?: boolean;
  enableContactForm?: boolean;
  enableNewsletter?: boolean;
  footerText?: string;
}

interface SiteSettingsFormProps {
  initialSettings: SiteSettings;
  onSave: (settings: SiteSettings) => void;
}

const SiteSettingsForm = ({ initialSettings, onSave }: SiteSettingsFormProps) => {
  const [settings, setSettings] = useState<SiteSettings>({
    ...initialSettings,
    address: initialSettings.address || '',
    socialFacebook: initialSettings.socialFacebook || '',
    socialInstagram: initialSettings.socialInstagram || '',
    socialLinkedin: initialSettings.socialLinkedin || '',
    metaDescription: initialSettings.metaDescription || '',
    metaKeywords: initialSettings.metaKeywords || '',
    googleAnalyticsId: initialSettings.googleAnalyticsId || '',
    showContactInfo: initialSettings.showContactInfo !== undefined ? initialSettings.showContactInfo : true,
    showSocialLinks: initialSettings.showSocialLinks !== undefined ? initialSettings.showSocialLinks : true,
    enableContactForm: initialSettings.enableContactForm !== undefined ? initialSettings.enableContactForm : true,
    enableNewsletter: initialSettings.enableNewsletter !== undefined ? initialSettings.enableNewsletter : false,
    footerText: initialSettings.footerText || '© 2025 ImobiliáriaApp. Todos os direitos reservados.'
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(initialSettings.logo || null);
  const [bgPreview, setBgPreview] = useState<string | null>(initialSettings.heroBackground || null);
  const [activeTab, setActiveTab] = useState('general');
  const [errors, setErrors] = useState<Partial<Record<keyof SiteSettings, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name as keyof SiteSettings]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSwitchChange = (name: keyof SiteSettings, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
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

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SiteSettings, string>> = {};
    
    if (!settings.siteName.trim()) {
      newErrors.siteName = 'O nome do site é obrigatório';
    }
    
    if (!settings.contactEmail.trim()) {
      newErrors.contactEmail = 'O email de contato é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(settings.contactEmail)) {
      newErrors.contactEmail = 'Email inválido';
    }
    
    if (!settings.contactPhone.trim()) {
      newErrors.contactPhone = 'O telefone de contato é obrigatório';
    }
    
    if (!settings.heroTitle.trim()) {
      newErrors.heroTitle = 'O título principal é obrigatório';
    }
    
    if (!settings.heroSubtitle.trim()) {
      newErrors.heroSubtitle = 'O subtítulo é obrigatório';
    }
    
    // Social media validations (optional but must be valid URLs if provided)
    if (settings.socialFacebook && !settings.socialFacebook.includes('facebook.com')) {
      newErrors.socialFacebook = 'URL do Facebook inválida';
    }
    
    if (settings.socialInstagram && !settings.socialInstagram.includes('instagram.com')) {
      newErrors.socialInstagram = 'URL do Instagram inválida';
    }
    
    if (settings.socialLinkedin && !settings.socialLinkedin.includes('linkedin.com')) {
      newErrors.socialLinkedin = 'URL do LinkedIn inválida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // Simulate API call delay
      setTimeout(() => {
        onSave(settings);
        toast.success("Configurações salvas com sucesso!");
        setIsSubmitting(false);
      }, 500);
    } else {
      toast.error("Por favor, corrija os erros antes de salvar");
      
      // Set the tab with errors as active
      for (const field in errors) {
        if (field === 'siteName' || field === 'logo' || field === 'contactEmail' || field === 'contactPhone') {
          setActiveTab('general');
          break;
        } else if (field === 'heroTitle' || field === 'heroSubtitle' || field === 'heroBackground') {
          setActiveTab('hero');
          break;
        } else if (field.startsWith('social')) {
          setActiveTab('social');
          break;
        } else if (field.startsWith('meta') || field === 'googleAnalyticsId') {
          setActiveTab('seo');
          break;
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" /> Básico
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Image className="h-4 w-4" /> Hero
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> Contato
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Social
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Type className="h-4 w-4" /> SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
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
                  className={errors.siteName ? "border-red-500" : ""}
                />
                {errors.siteName && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.siteName}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo"
                    name="logo"
                    type="file"
                    onChange={(e) => handleImageChange(e, 'logo')}
                    accept="image/*"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('logo')?.click()}
                  >
                    <Upload className="h-4 w-4" /> Upload
                  </Button>
                </div>
                {logoPreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Visualização:</p>
                    <img src={logoPreview} alt="Logo preview" className="h-12 object-contain" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opções do Rodapé</CardTitle>
              <CardDescription>Configure o texto do rodapé do seu site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footerText">Texto do Rodapé</Label>
                <Textarea
                  id="footerText"
                  name="footerText"
                  value={settings.footerText}
                  onChange={handleChange}
                  placeholder="Ex: © 2025 Minha Imobiliária. Todos os direitos reservados."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
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
                  className={errors.heroTitle ? "border-red-500" : ""}
                />
                {errors.heroTitle && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.heroTitle}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Subtítulo</Label>
                <Input
                  id="heroSubtitle"
                  name="heroSubtitle"
                  value={settings.heroSubtitle}
                  onChange={handleChange}
                  placeholder="Ex: Milhares de imóveis para alugar ou comprar"
                  className={errors.heroSubtitle ? "border-red-500" : ""}
                />
                {errors.heroSubtitle && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.heroSubtitle}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroBackground">Imagem de Fundo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="heroBackground"
                    name="heroBackground"
                    type="file"
                    onChange={(e) => handleImageChange(e, 'heroBackground')}
                    accept="image/*"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('heroBackground')?.click()}
                  >
                    <Upload className="h-4 w-4" /> Upload
                  </Button>
                </div>
                {bgPreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Visualização:</p>
                    <img src={bgPreview} alt="Background preview" className="w-full h-32 object-cover rounded" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>Configure as informações de contato exibidas no site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email de Contato
                </Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  placeholder="contato@exemplo.com"
                  className={errors.contactEmail ? "border-red-500" : ""}
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.contactEmail}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Telefone de Contato
                </Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  className={errors.contactPhone ? "border-red-500" : ""}
                />
                {errors.contactPhone && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.contactPhone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Endereço
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  placeholder="Ex: Rua Exemplo, 123 - Bairro, Cidade - UF"
                  rows={2}
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showContactInfo" className="cursor-pointer">
                    Exibir informações de contato no rodapé
                  </Label>
                  <Switch
                    id="showContactInfo"
                    checked={settings.showContactInfo}
                    onCheckedChange={(checked) => handleSwitchChange('showContactInfo', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enableContactForm" className="cursor-pointer">
                    Habilitar formulário de contato
                  </Label>
                  <Switch
                    id="enableContactForm"
                    checked={settings.enableContactForm}
                    onCheckedChange={(checked) => handleSwitchChange('enableContactForm', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enableNewsletter" className="cursor-pointer">
                    Habilitar inscrição em newsletter
                  </Label>
                  <Switch
                    id="enableNewsletter"
                    checked={settings.enableNewsletter}
                    onCheckedChange={(checked) => handleSwitchChange('enableNewsletter', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>Configure os links para as redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="socialFacebook" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" /> Facebook
                </Label>
                <Input
                  id="socialFacebook"
                  name="socialFacebook"
                  value={settings.socialFacebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/minhaimobiliaria"
                  className={errors.socialFacebook ? "border-red-500" : ""}
                />
                {errors.socialFacebook && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.socialFacebook}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialInstagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" /> Instagram
                </Label>
                <Input
                  id="socialInstagram"
                  name="socialInstagram"
                  value={settings.socialInstagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/minhaimobiliaria"
                  className={errors.socialInstagram ? "border-red-500" : ""}
                />
                {errors.socialInstagram && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.socialInstagram}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialLinkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </Label>
                <Input
                  id="socialLinkedin"
                  name="socialLinkedin"
                  value={settings.socialLinkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/minhaimobiliaria"
                  className={errors.socialLinkedin ? "border-red-500" : ""}
                />
                {errors.socialLinkedin && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.socialLinkedin}
                  </p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <Label htmlFor="showSocialLinks" className="cursor-pointer">
                  Exibir links para redes sociais
                </Label>
                <Switch
                  id="showSocialLinks"
                  checked={settings.showSocialLinks}
                  onCheckedChange={(checked) => handleSwitchChange('showSocialLinks', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>SEO e Analytics</CardTitle>
              <CardDescription>Configure as informações para melhorar o SEO do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Descrição Meta (SEO)</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={settings.metaDescription}
                  onChange={handleChange}
                  placeholder="Breve descrição do seu site para SEO"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Uma boa descrição tem entre 120 e 160 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Palavras-chave Meta (SEO)</Label>
                <Input
                  id="metaKeywords"
                  name="metaKeywords"
                  value={settings.metaKeywords}
                  onChange={handleChange}
                  placeholder="imobiliária, imóveis, alugar, comprar, casa, apartamento"
                />
                <p className="text-xs text-muted-foreground">
                  Separe as palavras-chave por vírgulas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">ID do Google Analytics</Label>
                <Input
                  id="googleAnalyticsId"
                  name="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={handleChange}
                  placeholder="G-XXXXXXXXXX ou UA-XXXXXXXX-X"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between pt-6 px-0">
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => setSettings(initialSettings)}
        >
          Restaurar Padrões
        </Button>
        <Button 
          type="submit" 
          className="flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Salvando...</>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" /> Salvar Alterações
            </>
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SiteSettingsForm;
