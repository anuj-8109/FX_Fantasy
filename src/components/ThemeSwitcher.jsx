import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { themes, appTypes } from '@/data/themes.js';
import { Palette, Sparkles, Moon, Sun } from 'lucide-react';

const ThemeSwitcher = () => {
  const { currentTheme, currentAppType, setTheme, setAppType, canChangeTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState(null);

  if (!canChangeTheme) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">You don't have permission to change themes.</p>
      </Card>
    );
  }

  const handleThemePreview = (theme) => {
    setPreviewTheme(theme);
    document.documentElement.className = theme.className;
  };

  const handleThemeApply = (theme) => {
    setTheme(theme);
    setPreviewTheme(null);
  };

  const handlePreviewCancel = () => {
    setPreviewTheme(null);
    document.documentElement.className = currentTheme.className;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'colorful': return <Sparkles className="h-4 w-4" />;
      default: return <Palette className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Theme Management</h2>
          <p className="text-muted-foreground">
            Customize your admin dashboard appearance and layout
          </p>
        </div>
        {previewTheme && (
          <div className="flex gap-2">
            <Button onClick={() => handleThemeApply(previewTheme)} className="pulse-glow">
              Apply Theme
            </Button>
            <Button variant="outline" onClick={handlePreviewCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="themes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="themes">Themes & Layouts</TabsTrigger>
          <TabsTrigger value="apps">Application Types</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  currentTheme.id === theme.id ? 'ring-2 ring-primary' : ''
                } ${previewTheme?.id === theme.id ? 'ring-2 ring-orange-500' : ''}`}
                onClick={() => handleThemePreview(theme)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{theme.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(theme.category)}
                      <Badge variant="secondary" className="text-xs">
                        {theme.category}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{theme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{theme.appType.icon}</span>
                      <span>{theme.appType.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {theme.appType.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {theme.appType.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{theme.appType.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apps" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appTypes.map((appType) => (
              <Card 
                key={appType.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  currentAppType.id === appType.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setAppType(appType)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{appType.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{appType.name}</CardTitle>
                      <CardDescription>{appType.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {appType.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeSwitcher;
