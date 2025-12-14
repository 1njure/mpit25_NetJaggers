import { Palette, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { THEME_OPTIONS } from '../../lib/constants';

interface ThemeToggleProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  disabled?: boolean;
}

export const ThemeToggle = ({ currentTheme, onThemeChange, disabled }: ThemeToggleProps) => {
  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      default: return Monitor;
    }
  };

  return (
    <Card className="border-gray-700 bg-gray">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Внешний вид
        </CardTitle>
        <CardDescription className="text-gray-400">
          Выберите тему интерфейса
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((option) => {
            const Icon = getThemeIcon(option.value);
            const isActive = currentTheme === option.value;
            
            return (
              <Button
                key={option.value}
                type="button"
                variant={isActive ? "default" : "outline"}
                className={`h-24 flex-col gap-2 ${isActive ? 'bg-white text-black hover:bg-gray-100' : 'border-gray hover:border-gray-600 '}`}
                onClick={() => onThemeChange(option.value)}
                disabled={disabled}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm">{option.label}</span>
                <span className="text-lg">{option.icon}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-6 text-xs text-gray">
          <p>Тема применяется ко всему интерфейсу ИИ-Ньюсмейкер</p>
          <p className="mt-1 text-gray-300">Текущая тема: <span className="text-gray-300">{THEME_OPTIONS.find(t => t.value === currentTheme)?.label}</span></p>
        </div>
      </CardContent>
    </Card>
  );
};