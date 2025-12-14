import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Globe,
  ChevronDown,
  Bot,
  Shield,
  Target,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';

export const HeroSection = () => {
  const stats = [
    { value: '24/7', label: 'Непрерывный мониторинг', icon: Clock, color: 'text-gray-300' },
    { value: '150+', label: 'Источников новостей', icon: Globe, color: 'text-gray-300' },
    { value: 'AI', label: 'Анализ и адаптация', icon: BarChart3, color: 'text-gray-300' },
    { value: '∞', label: 'Вариаций контента', icon: TrendingUp, color: 'text-gray-300' },
  ];

  const features = [
    {
      icon: Bot,
      title: 'Автономная работа',
      description: 'ИИ-агент работает полностью самостоятельно 24/7 без вмешательства человека'
    },
    {
      icon: Shield,
      title: 'Защита репутации',
      description: 'Мониторинг и быстрая реакция на негативные упоминания бренда'
    },
    {
      icon: Target,
      title: 'Точный охват',
      description: 'Алгоритмы находят именно вашу целевую аудиторию на каждой платформе'
    },
    {
      icon: RefreshCw,
      title: 'Масштабирование',
      description: 'Легко адаптируется под рост компании и новые каналы коммуникации'
    }
  ];

  return (
    <div className="w-full --bg-secondary border-gray-700 py-16 lg:py-24">
      <div className="w-full max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-8">
            <Badge 
              variant="outline" 
              className="px-4 py-2 border-gray-700 text-gray-300 text-sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Трансформация медиа-маркетинга 2025
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              ИИ-Ньюсмейкер
              <span className="block text-2xl lg:text-3xl      mt-3">
                Автономный голос вашего бренда в цифровом пространстве
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 leading-relaxed">
              ECHO.PR это платформа с ии агентом, которая непрерывно сканирует медиа-пространство, 
              выделяет ключевые инсайты и многократно усиливает каждую важную новость на всех релевантных площадках.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
             
             
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-gray-700 bg-gray hover:border-gray-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Как работает ИИ-Ньюсмейкер</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-gray-700">
              <AccordionTrigger className="text-lg text-gray-200 hover:text-white">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5" />
                  <span>Этап 1: Мониторинг и анализ</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <div className="p-4">
                  <p>Система непрерывно сканирует более 500+ источников новостей: СМИ, социальные сети, 
                  отраслевые блоги и форумы. ИИ анализирует не только упоминания вашего бренда, 
                  но и контекст, тональность и ключевые тренды в вашей отрасли.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-gray-700">
              <AccordionTrigger className="text-lg ">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5" />
                  <span>Этап 2: Адаптация контента</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <div className="p-4">
                  <p>Каждая новость автоматически адаптируется под специфику платформы: 
                  короткие посты для Twitter/X, развернутые статьи для LinkedIn, визуальный контент для Instagram, 
                  новостные заметки для Telegram. Сохраняется единый бренд-голос на всех каналах.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-gray">
              <AccordionTrigger className="text-lg">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5" />
                  <span>Этап 3: Публикация и анализ</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                <div className="p-4">
                  <p>Автоматическая публикация в оптимальное время для каждой платформы с учетом 
                  поведения целевой аудитории. Реальная аналитика вовлеченности с AI-рекомендациями 
                  по улучшению стратегии. Отслеживание ROI каждой публикации.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-8">Ключевые преимущества</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-gray  border-gray-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 w-fit rounded-lg ">
                      <Icon className="h-6 w-6 text-gray-300" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mt-16 p-8 border border-gray-700 rounded-xl bg-gray">
          <h3 className="text-2xl font-bold text-white mb-6">Показатели эффективности</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border border-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">87%</div>
              <div className="text-sm text-gray-400">Увеличение охвата</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">65%</div>
              <div className="text-sm text-gray-400">Экономия времени команды</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">3.2x</div>
              <div className="text-sm text-gray-400">Рост вовлеченности</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">24ч</div>
              <div className="text-sm text-gray-400">Среднее время внедрения</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};