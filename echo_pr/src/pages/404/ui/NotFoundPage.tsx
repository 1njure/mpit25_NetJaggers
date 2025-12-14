import { Home, Search, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Link } from '@tanstack/react-router';
import { QUICK_LINKS, SEARCH_SUGGESTIONS } from '../lib/constants';

export const NotFoundPage = () => {
  const goHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      goHome();
    }
  };

  const search = (query: string) => {
    console.log('Search for:', query);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="w-full max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-16">
          <div className="relative mb-12">
            <div className="text-[120px] lg:text-[180px] font-bold text-gray-700 opacity-30">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl lg:text-8xl font-bold mb-4">
                  <span className="text-white">4</span>
                  <span className="text-[#d1d5db]">0</span>
                  <span className="text-white">4</span>
                </div>
                <div className="text-lg lg:text-xl text-[#d1d5db]">
                  Страница не найдена
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-xl text-center mb-12">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-white">
              Заблудились в цифровом пространстве?
            </h1>
            <p className="text-lg text-[#d1d5db] mb-6">
              Возможно, страница была перемещена или удалена. 
              Но не волнуйтесь — наш ИИ-Ньюсмейкер продолжает работать и создавать контент!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-lg bg-gray-900">
              <Search className="h-4 w-4 text-[#d1d5db]" />
              <span className="text-sm text-[#d1d5db]">
                Страница могла быть перенесена или вы ввели неверный адрес
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg" 
              className="px-8 py-4 text-base bg-white text-black hover:bg-gray-700"
              onClick={goHome}
            >
              <ArrowLeft className="mr-3 h-5 w-5" />
              На главную
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-base bg-white text-black hover:bg-gray-700"
              onClick={goBack}
            >
              <ArrowLeft className="mr-3 h-5 w-5 text-base border-gray-500 hover:bg-gray-800" />
              Назад
            </Button>
          </div>

          <div className="w-full max-w-2xl mb-12">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">
              Популярные разделы
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.to}
                    asChild
                    variant="outline"
                    className="h-auto py-4  bg-white text-black  border-gray-800 hover:border-gray-700 hover:bg-gray-700"
                  >
                    <Link to={link.to}>
                      <Icon className="h-4 w-4 mr-2" />
                      {link.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">
              Что вы искали?
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {SEARCH_SUGGESTIONS.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  className="text-[#d1d5db] hover:text-white hover:bg-gray-800"
                  onClick={() => search(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};