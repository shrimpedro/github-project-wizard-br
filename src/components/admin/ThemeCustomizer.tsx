
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker, Palette } from 'lucide-react';
import { toast } from 'sonner';

// Interface para as configurações de tema
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
}

interface ThemeCustomizerProps {
  initialTheme: ThemeSettings;
  onSave: (theme: ThemeSettings) => void;
}

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

const ThemeCustomizer = ({ initialTheme = defaultTheme, onSave }: ThemeCustomizerProps) => {
  const [theme, setTheme] = useState<ThemeSettings>(initialTheme);
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});

  // Atualizar o estilo de visualização quando o tema muda
  useEffect(() => {
    setPreviewStyle({
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      borderRadius: theme.borderRadius,
      borderColor: theme.primaryColor,
    });
  }, [theme]);

  const handleColorChange = (field: keyof ThemeSettings, value: string) => {
    setTheme((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(theme);
    toast.success('Configurações de tema salvas com sucesso!');
    
    // Aplicar o tema globalmente
    document.documentElement.style.setProperty('--primary', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary', theme.secondaryColor);
    document.documentElement.style.setProperty('--accent', theme.accentColor);
    document.documentElement.style.setProperty('--background', theme.backgroundColor);
    document.documentElement.style.setProperty('--button', theme.buttonColor);
  };

  const handleReset = () => {
    setTheme(defaultTheme);
    toast.info('Configurações de tema redefinidas para o padrão');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Personalização de Tema
        </CardTitle>
        <CardDescription>
          Personalize as cores e aparência do seu site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors">
          <TabsList className="mb-4">
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="typography">Tipografia</TabsTrigger>
            <TabsTrigger value="preview">Visualização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor" className="flex items-center gap-2">
                  <ColorPicker className="h-4 w-4" /> Cor Primária
                </Label>
                <div className="flex">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor" className="flex items-center gap-2">
                  <ColorPicker className="h-4 w-4" /> Cor Secundária
                </Label>
                <div className="flex">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor" className="flex items-center gap-2">
                  <ColorPicker className="h-4 w-4" /> Cor de Destaque
                </Label>
                <div className="flex">
                  <Input
                    id="accentColor"
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor" className="flex items-center gap-2">
                  <ColorPicker className="h-4 w-4" /> Cor do Texto
                </Label>
                <div className="flex">
                  <Input
                    id="textColor"
                    type="color"
                    value={theme.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={theme.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backgroundColor" className="flex items-center gap-2">
                  <ColorPicker className="h-4 w-4" /> Cor de Fundo
                </Label>
                <div className="flex">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={theme.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonColor" className="flex items-center gap-2">
                  <ColorPicker className="h-4 w-4" /> Cor dos Botões
                </Label>
                <div className="flex">
                  <Input
                    id="buttonColor"
                    type="color"
                    value={theme.buttonColor}
                    onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={theme.buttonColor}
                    onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="borderRadius">Bordas Arredondadas</Label>
              <Input
                id="borderRadius"
                type="text"
                value={theme.borderRadius}
                onChange={(e) => handleColorChange('borderRadius', e.target.value)}
                placeholder="0.5rem"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="p-4 border rounded-md mb-4" style={previewStyle}>
              <h2 style={{ color: theme.primaryColor }}>Visualização do Tema</h2>
              <p style={{ color: theme.textColor }}>
                Este é um exemplo de como seu site ficará com as configurações atuais.
              </p>
              <div 
                className="p-2 mt-2 rounded" 
                style={{ 
                  backgroundColor: theme.secondaryColor, 
                  color: '#fff',
                  display: 'inline-block'
                }}
              >
                Botão de Exemplo
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Restaurar Padrão
        </Button>
        <Button onClick={handleSave}>
          Salvar Configurações
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThemeCustomizer;
