
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { AlertCircle, Check, Copy, Eye, EyeOff, Palette, TypeIcon, Layout } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  headerBackground: string;
  footerBackground: string;
  buttonColor: string;
  borderRadius: string;
  fontPrimary?: string;
  fontSecondary?: string;
  fontSize?: string;
  lineHeight?: string;
  cardBackground?: string;
  navbarVariant?: 'light' | 'dark' | 'transparent';
  buttonStyle?: 'rounded' | 'square' | 'pill';
  heroHeight?: string;
  containerWidth?: string;
  enableAnimations?: boolean;
  showLogo?: boolean;
  showSocialLinks?: boolean;
  enableDarkMode?: boolean;
}

interface ThemeCustomizerProps {
  initialTheme: ThemeSettings;
  onSave: (theme: ThemeSettings) => void;
}

const FONT_OPTIONS = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Raleway, sans-serif', label: 'Raleway' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'Merriweather, serif', label: 'Merriweather' },
  { value: 'Source Sans Pro, sans-serif', label: 'Source Sans Pro' },
];

const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Pequeno' },
  { value: 'medium', label: 'Médio' },
  { value: 'large', label: 'Grande' },
];

const LINE_HEIGHT_OPTIONS = [
  { value: 'tight', label: 'Compacto' },
  { value: 'normal', label: 'Normal' },
  { value: 'relaxed', label: 'Relaxado' },
];

const BUTTON_STYLE_OPTIONS = [
  { value: 'rounded', label: 'Arredondado' },
  { value: 'square', label: 'Quadrado' },
  { value: 'pill', label: 'Pílula' },
];

const NAVBAR_VARIANT_OPTIONS = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'transparent', label: 'Transparente' },
];

const CONTAINER_WIDTH_OPTIONS = [
  { value: 'narrow', label: 'Estreito' },
  { value: 'standard', label: 'Padrão' },
  { value: 'wide', label: 'Amplo' },
  { value: 'full', label: 'Tela cheia' },
];

const HERO_HEIGHT_OPTIONS = [
  { value: 'small', label: 'Pequeno' },
  { value: 'medium', label: 'Médio' },
  { value: 'large', label: 'Grande' },
  { value: 'full', label: 'Tela cheia' },
];

const ThemeCustomizer = ({ initialTheme, onSave }: ThemeCustomizerProps) => {
  const [theme, setTheme] = useState<ThemeSettings>({
    ...initialTheme,
    fontPrimary: initialTheme.fontPrimary || 'Inter, sans-serif',
    fontSecondary: initialTheme.fontSecondary || 'Inter, sans-serif',
    fontSize: initialTheme.fontSize || 'medium',
    lineHeight: initialTheme.lineHeight || 'normal',
    cardBackground: initialTheme.cardBackground || '#FFFFFF',
    navbarVariant: initialTheme.navbarVariant || 'light',
    buttonStyle: initialTheme.buttonStyle || 'rounded',
    heroHeight: initialTheme.heroHeight || 'medium',
    containerWidth: initialTheme.containerWidth || 'standard',
    enableAnimations: initialTheme.enableAnimations !== undefined ? initialTheme.enableAnimations : true,
    showLogo: initialTheme.showLogo !== undefined ? initialTheme.showLogo : true,
    showSocialLinks: initialTheme.showSocialLinks !== undefined ? initialTheme.showSocialLinks : true,
    enableDarkMode: initialTheme.enableDarkMode !== undefined ? initialTheme.enableDarkMode : false,
  });
  const [activeTab, setActiveTab] = useState('colors');
  const [showCssCode, setShowCssCode] = useState(false);

  const handleChange = (field: keyof ThemeSettings, value: string | boolean) => {
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(theme);
    toast.success('Tema personalizado aplicado com sucesso!');
  };

  const generateCssVariables = () => {
    return `
:root {
  --primary: ${theme.primaryColor};
  --secondary: ${theme.secondaryColor};
  --accent: ${theme.accentColor};
  --text: ${theme.textColor};
  --background: ${theme.backgroundColor};
  --header-bg: ${theme.headerBackground};
  --footer-bg: ${theme.footerBackground};
  --button: ${theme.buttonColor};
  --border-radius: ${theme.borderRadius};
  --font-primary: ${theme.fontPrimary};
  --font-secondary: ${theme.fontSecondary};
  --card-bg: ${theme.cardBackground};
}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCssVariables());
    toast.success('CSS copiado para a área de transferência!');
  };

  // Helper function to preview color
  const ColorPreview = ({ color }: { color: string }) => (
    <div 
      className="h-4 w-4 rounded-full border" 
      style={{ backgroundColor: color }}
    />
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Personalização do Tema</CardTitle>
          <CardDescription>
            Personalize as cores, tipografia e estilo do seu site
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" /> Cores
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <TypeIcon className="h-4 w-4" /> Tipografia
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="h-4 w-4" /> Layout
              </TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primaryColor" className="flex items-center gap-2">
                      <ColorPreview color={theme.primaryColor} /> 
                      Cor Primária
                    </Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor" className="flex items-center gap-2">
                      <ColorPreview color={theme.secondaryColor} /> 
                      Cor Secundária
                    </Label>
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={theme.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accentColor" className="flex items-center gap-2">
                      <ColorPreview color={theme.accentColor} /> 
                      Cor Destaque
                    </Label>
                    <Input
                      id="accentColor"
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buttonColor" className="flex items-center gap-2">
                      <ColorPreview color={theme.buttonColor} /> 
                      Cor dos Botões
                    </Label>
                    <Input
                      id="buttonColor"
                      type="color"
                      value={theme.buttonColor}
                      onChange={(e) => handleChange('buttonColor', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="textColor" className="flex items-center gap-2">
                      <ColorPreview color={theme.textColor} /> 
                      Cor do Texto
                    </Label>
                    <Input
                      id="textColor"
                      type="color"
                      value={theme.textColor}
                      onChange={(e) => handleChange('textColor', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="backgroundColor" className="flex items-center gap-2">
                      <ColorPreview color={theme.backgroundColor} /> 
                      Cor de Fundo
                    </Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={theme.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headerBackground" className="flex items-center gap-2">
                      <ColorPreview color={theme.headerBackground} /> 
                      Cor do Cabeçalho
                    </Label>
                    <Input
                      id="headerBackground"
                      type="color"
                      value={theme.headerBackground}
                      onChange={(e) => handleChange('headerBackground', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="footerBackground" className="flex items-center gap-2">
                      <ColorPreview color={theme.footerBackground} /> 
                      Cor do Rodapé
                    </Label>
                    <Input
                      id="footerBackground"
                      type="color"
                      value={theme.footerBackground}
                      onChange={(e) => handleChange('footerBackground', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="cardBackground" className="flex items-center gap-2">
                  <ColorPreview color={theme.cardBackground || '#ffffff'} /> 
                  Cor de Fundo dos Cards
                </Label>
                <Input
                  id="cardBackground"
                  type="color"
                  value={theme.cardBackground || '#ffffff'}
                  onChange={(e) => handleChange('cardBackground', e.target.value)}
                  className="h-10 w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="borderRadius">Raio da Borda</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="borderRadius"
                    value={theme.borderRadius}
                    onChange={(e) => handleChange('borderRadius', e.target.value)}
                    placeholder="0.5rem"
                  />
                  <div 
                    className="h-8 w-8 bg-primary border"
                    style={{ borderRadius: theme.borderRadius }}
                  ></div>
                </div>
              </div>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fontPrimary">Fonte Principal</Label>
                  <Select
                    value={theme.fontPrimary}
                    onValueChange={(value) => handleChange('fontPrimary', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma fonte" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-2 text-sm" style={{ fontFamily: theme.fontPrimary }}>
                    Exemplo de texto com esta fonte
                  </p>
                </div>

                <div>
                  <Label htmlFor="fontSecondary">Fonte Secundária</Label>
                  <Select
                    value={theme.fontSecondary}
                    onValueChange={(value) => handleChange('fontSecondary', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma fonte" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-2 text-sm" style={{ fontFamily: theme.fontSecondary }}>
                    Exemplo de texto com esta fonte
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                    <Select
                      value={theme.fontSize}
                      onValueChange={(value) => handleChange('fontSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lineHeight">Altura da Linha</Label>
                    <Select
                      value={theme.lineHeight}
                      onValueChange={(value) => handleChange('lineHeight', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um espaçamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {LINE_HEIGHT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buttonStyle">Estilo dos Botões</Label>
                  <Select
                    value={theme.buttonStyle}
                    onValueChange={(value: 'rounded' | 'square' | 'pill') => handleChange('buttonStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUTTON_STYLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="mt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mr-2"
                      style={{
                        borderRadius: 
                          theme.buttonStyle === 'rounded' ? '0.5rem' : 
                          theme.buttonStyle === 'pill' ? '9999px' : 
                          '0'
                      }}
                    >
                      Exemplo
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="navbarVariant">Estilo do Menu</Label>
                  <Select
                    value={theme.navbarVariant}
                    onValueChange={(value: 'light' | 'dark' | 'transparent') => handleChange('navbarVariant', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      {NAVBAR_VARIANT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="heroHeight">Altura do Hero</Label>
                  <Select
                    value={theme.heroHeight}
                    onValueChange={(value) => handleChange('heroHeight', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma altura" />
                    </SelectTrigger>
                    <SelectContent>
                      {HERO_HEIGHT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="containerWidth">Largura do Conteúdo</Label>
                  <Select
                    value={theme.containerWidth}
                    onValueChange={(value) => handleChange('containerWidth', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma largura" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTAINER_WIDTH_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableAnimations" className="cursor-pointer">Habilitar Animações</Label>
                  <Switch
                    id="enableAnimations"
                    checked={theme.enableAnimations}
                    onCheckedChange={(checked) => handleChange('enableAnimations', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showLogo" className="cursor-pointer">Exibir Logo</Label>
                  <Switch
                    id="showLogo"
                    checked={theme.showLogo}
                    onCheckedChange={(checked) => handleChange('showLogo', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showSocialLinks" className="cursor-pointer">Exibir Links de Redes Sociais</Label>
                  <Switch
                    id="showSocialLinks"
                    checked={theme.showSocialLinks}
                    onCheckedChange={(checked) => handleChange('showSocialLinks', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enableDarkMode" className="cursor-pointer">Habilitar Modo Escuro</Label>
                  <Switch
                    id="enableDarkMode"
                    checked={theme.enableDarkMode}
                    onCheckedChange={(checked) => handleChange('enableDarkMode', checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          {/* CSS Code Preview */}
          <div className="bg-muted/30 rounded-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> CSS Variables
              </h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCssCode(!showCssCode)}
                  type="button"
                >
                  {showCssCode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showCssCode ? 'Ocultar' : 'Mostrar'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  type="button" 
                  disabled={!showCssCode}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copiar
                </Button>
              </div>
            </div>
            {showCssCode && (
              <pre className="p-4 overflow-x-auto text-xs">
                {generateCssVariables()}
              </pre>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => setTheme(initialTheme)}>
            Restaurar Padrão
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Check className="h-4 w-4" /> Aplicar Alterações
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ThemeCustomizer;
