# Echo.PR - платформа для актуализации новостей. 

---

## Содержание
1) [Описание проекта](#описание-проекта)
2) [Документация к развертыванию и работе](#документация-к-развертыванию-и-работе-с-платформой)
  1) [Развертывание](#развертывание)
  2) [Развертывание фронтенда](#развертывание-фронтенда)
  3) [Работа](#работа)
4) [Технологии](#технологии)
5) [Разработчики](#разработчики)

---

## Описание проекта

Наша платформа предлагает ии-агента для создания постов в Телеграмм, ВКонтакте и Дзене на основе свежей новости о вашем бренде, а также автопостинг постов.

Routs

<img width="336" height="444" alt="изображение" src="https://github.com/user-attachments/assets/9603993b-2cff-4423-b05b-c8a00a19bc75" />

---

## Документация к развертыванию и работе с платформой

### Развертывание 
Для того, чтобы развернуть платформу необходимо:

1) Установить Docker и Docker Compose
2) `docker compose up -d --build`
3) `docker compose exec api alembic upgrade head`

### Развертывание фронтенда
Если хочется запустить отдельно клиентскую часть веб-платформы.

1) `pnpm i или yarn i`
2) `pnpm run generate-routes` - для генерации древа маршрутов проекта
3) `pnpm run dev` - запуск в dev режиме

**В случае ошибок остановить в системе сервисы PostgreSQL и Redis, если они установлены.**

### Работа
Доступ к сайту - `localhost:3000`
Доступ к списку эндпоинтов API - `localhost:8000/docs` или `localhost:8000/redoc`

---

## Технологии

- Python
- FastAPI
- Redis
- PostgreSQL
- Redux
- React
- Selenium
- GigaChatAPI
- Tanstack Query
- Tanstack Router

---

## Разработчики
  
Бекенд: Чечетов Кирилл  
GitHub: https://github.com/1njure  
Telegram: @l1njure  
  
Фронтенд: Никитин Владислав   
GitHub: https://github.com/solervan  
Telegram: @solervan  
  
Оформление документации: Прокопец Анастасия  
GitHub: https://github.com/Ahimenes17  
Telegram: @Drotaverin_Arbidolovich  
  
Менеджер: Числин Михаил   
GitHub: https://github.com/MegumTrue  
Telegram: @megumtrue  
