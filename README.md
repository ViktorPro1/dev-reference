# DevRef — Developer Reference PWA

Статичний офлайн-довідник для розробника. Встановлюється як PWA на телефон.

## Структура проекту

```
dev-reference/
├── icons/
│   ├── icon-192.png       # іконка для PWA (Android, manifest)
│   └── icon-512.png       # іконка для PWA (splash screen)
├── index.html             # розмітка, весь контент вкладок
├── style.css              # всі стилі, адаптив, темна тема
├── app.js                 # логіка: вкладки, пошук, копіювання, PWA install
├── sw.js                  # Service Worker — кешування, офлайн-режим
├── manifest.json          # PWA маніфест — назва, іконки, колір, shortcuts
└── README.md              # цей файл
```

## Вкладки

**Backend** — Node.js / Express
- `app.js` / `server.js` — точки входу
- `routes/index.js` — агрегатор маршрутів
- `controllers/userController.js` — обробка запитів
- `services/userService.js` — бізнес-логіка
- `models/User.js` — Sequelize модель
- `middleware/auth.js` — JWT авторизація
- `.env` / `config.js` — змінні середовища
- `migrations/` — версіонована схема БД
- `package.json` — залежності та скрипти

**Frontend** — React / Vite
- `main.jsx` — точка входу React
- `App.jsx` — кореневий компонент, роутер
- `components/` — переиспользуємі компоненти
- `hooks/useFetch.js` — кастомний хук для API
- `context/AuthContext.jsx` — Context API для глобального стану
- `pages/` — сторінки прив'язані до роутів
- `vite.config.js` — аліаси, проксі, плагіни
- CSS Modules — локальні стилі компонентів
- `types/index.ts` — TypeScript інтерфейси

**Співбесіда** — JS / React / Node / DB / HR
- Замикання, Event Loop, прототипи, `this`
- `useEffect`, Virtual DOM, memo/useMemo/useCallback
- REST vs GraphQL, async/await, індекси БД
- HR-питання зі структурою відповіді (STAR)
- До кожного питання — нюанси та підводні камені

## Функціонал

- Три вкладки з навігацією (хедер + нижня панель на мобільному)
- Пошук по тексту і тегах в межах активної вкладки
- Натискання на блок коду — копіює в буфер обміну
- На мобільному картки співбесіди — розкриваються по тапу
- `Ctrl+K` / `Cmd+K` — фокус на пошуку
- Адаптив: mobile (< 600px), tablet (600–900px), desktop (> 900px)

## Запуск

Потрібен локальний HTTP-сервер (Service Worker не працює через `file://`):

```bash
# варіант 1
npx serve .

# варіант 2 — VS Code розширення Live Server
# варіант 3
python3 -m http.server 8080
```

Відкрити: `http://localhost:8080`

## PWA — встановлення на телефон

1. Відкрити сайт у Chrome (Android) або Safari (iOS)
2. Chrome: кнопка «Встановити» у хедері або «Додати на головний екран» у меню браузера
3. iOS Safari: Share → «На екран "Додому"»

Після встановлення працює офлайн.
