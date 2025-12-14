import { 
  MessageSquare, Globe, Newspaper,  Shield, 
   Users, Target, Brain, RefreshCw,
  Facebook, Instagram, Youtube, Linkedin, Twitter
} from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';

const platforms = [
  { name: 'Telegram', icon: MessageSquare, color: 'text-[#d1d5db]', count: '500M+' },
  { name: 'VK', icon: Globe, color: 'text-[#d1d5db]', count: '97M' },
  { name: 'Дзен', icon: Newspaper, color: 'text-[#d1d5db]', count: '35M' },
];

const features = [
  {
    icon: Brain,
    title: 'Контекстный анализ',
    description: 'ИИ понимает смысл новости, выделяет ключевые тезисы и определяет эмоциональный окрас',
    details: 'Анализ семантики, тональности и релевантности для каждой целевой аудитории'
  },
  {
    icon: Target,
    title: 'Прецизионный таргетинг',
    description: 'Автоматический подбор площадок и форматов для максимального охвата',
    details: 'Алгоритмы предсказывают где и когда публикация получит наибольший отклик'
  },
  {
    icon: RefreshCw,
    title: 'Мультиформатная адаптация',
    description: 'Одна новость превращается в десятки уникальных публикаций',
    details: 'От коротких твитов до развернутых статей — каждый формат оптимизирован'
  },
  {
    icon: Shield,
    title: 'Бренд-консистентность',
    description: 'Сохранение единого голоса и стиля на всех платформах',
    details: 'Настройка тона, лексики и формата под корпоративные стандарты'
  },
];

const workflow = [
  'Мониторинг 500+ источников новостей',
  'AI-анализ и выделение ключевых инсайтов',
  'Создание адаптированного контента для каждой платформы',
  'Автоматическая публикация по расписанию',
  'Анализ вовлеченности и оптимизация',
  'Генерация отчетов в реальном времени'
];

export const PlatformsSection = () => {
  return (
    <div className="w-full py-16 lg:py-24 ">
      <div className="w-full max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
            Мультиплатформенный охват: одна новость — десятки форматов
          </h2>
          <p className="text-lg text-[#d1d5db] max-w-4xl mx-auto mb-8">
            Ваш контент автоматически адаптируется под специфику каждой площадки, 
            достигая максимальной релевантности и вовлеченности на каждом канале коммуникации
          </p>
        </div>

        <div className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-white">Поддерживаемые площадки</h3>
            <div className="text-sm text-[#d1d5db]">
              Общий охват: <span className="font-semibold text-white">4.8B+ пользователей</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <Card key={platform.name} className="border-gray-700 bg-gray hover:border-[#d1d5db]/30 transition-all">
                  <CardContent className="p-5 flex flex-col items-center justify-center">
                    <Icon className={`h-10 w-10 mb-3 ${platform.color}`} />
                    <span className="text-base font-medium text-white mb-1">{platform.name}</span>
                    <span className="text-xs text-[#d1d5db]">~{platform.count} аудитории</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-20">
          <h3 className="text-2xl font-semibold text-center mb-12 text-white">
            Технологические возможности системы
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-gray-700 bg-gray">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-gray-800">
                        <Icon className="h-8 w-8 text-[#d1d5db]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                        <p className="text-[#d1d5db] mb-3">{feature.description}</p>
                        <p className="text-sm text-gray-500">{feature.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="border  rounded-2xl border-gray-700  p-8 bg-gray">
          <h3 className="text-2xl font-semibold mb-8 text-white">Как работает ИИ-Ньюсмейкер: полный цикл</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflow.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d1d5db]/10 flex items-center justify-center">
                  <span className="text-[#d1d5db] font-bold">{index + 1}</span>
                </div>
                <p className="text-[#d1d5db]">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 border border-gray-700 rounded-lg bg-black">
            <p className="text-[#d1d5db] text-center">
              <span className="font-semibold text-white">Среднее время обработки новости:</span> от обнаружения до публикации на всех платформах — менее 15 минут
            </p>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-700 rounded-xl bg-gray">
            <h4 className="text-lg font-semibold text-white mb-4">Автоматизация 90% процессов</h4>
            <p className="text-[#d1d5db] text-sm">
              Система самостоятельно выполняет мониторинг, анализ, создание контента и публикацию, 
              оставляя команде только стратегические задачи
            </p>
          </div>
          
          <div className="p-6 border border-gray-700 rounded-xl bg-gray">
            <h4 className="text-lg font-semibold text-white mb-4">Интеграция с существующими инструментами</h4>
            <p className="text-[#d1d5db] text-sm">
              Легко подключается к вашим CRM, системам аналитики, маркетинговым платформам и 
              средствам мониторинга
            </p>
          </div>
          
          <div className="p-6 border border-gray-700 rounded-xl bg-gray">
            <h4 className="text-lg font-semibold text-white mb-4">Поддержка 24/7</h4>
            <p className="text-[#d1d5db] text-sm">
              Техническая поддержка и регулярные обновления системы с учетом изменений 
              в алгоритмах социальных сетей и медиа-пространства
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};