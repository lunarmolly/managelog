# managelog

managelog.ru — минималистичный фронтенд (Vue 3 + Vite + TS + Tailwind) с модулем регистрации/авторизации, роутингом, Pinia, мок-API (MSW) и готовностью к FastAPI-бэкенду.

## Технологии
- Vue 3 (Composition API), TypeScript, Vite
- Router (vue-router), Store (Pinia)
- Tailwind CSS, PostCSS, Autoprefixer
- fetch с лёгкой обёрткой (без axios)
- MSW (Mock Service Worker) для dev-моков

## Запуск
```bash
npm i
npm run dev
```

## Структура
- `src/router` — маршруты и guards
- `src/stores/auth.ts` — Pinia-store авторизации
- `src/api` — fetchJson, типы и endpoints
- `src/mocks` — MSW (handlers + worker)
- `src/views` — Auth/Dashboard
- `src/components/auth` — формы входа/регистрации
- `src/styles` — Tailwind и токены

## MSW
- Активен в DEV автоматически. Отключить — закомментировать инициализацию в `src/main.ts`.
- Эмулируется httpOnly-refresh cookie через внутреннее хранилище MSW.

## Автор и лицензия
- Автор: managelog.ru
- Примечание: проект в разработке, код проприетарный (не open-source).
