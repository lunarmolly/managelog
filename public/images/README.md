# Images Directory Structure

Эта папка содержит все изображения для проекта managelog.ru

## Структура папок:

### `/backgrounds/`
- Фоновые изображения для header, страниц и компонентов
- Форматы: .jpg, .png, .webp
- Рекомендуемые размеры:
  - Header background: 1920x70px
  - Page backgrounds: 1920x1080px

### `/avatars/`
- Аватары пользователей
- Форматы: .jpg, .png, .webp
- Размеры: 62x62px, 100x100px, 200x200px

### `/icons/`
- Иконки для интерфейса
- Форматы: .svg, .png
- Размеры: 16x16px, 24x24px, 32x32px

### `/logos/`
- Логотипы компании и проекта
- Форматы: .svg, .png
- Размеры: различные

## Использование в коде:

```css
/* Фон header */
background-image: url('/images/backgrounds/header-bg.jpg');

/* Аватар пользователя */
background-image: url('/images/avatars/user-avatar.jpg');

/* Иконка */
background-image: url('/images/icons/icon-name.svg');
```

## Рекомендации:

1. Используйте WebP формат для лучшей производительности
2. Оптимизируйте изображения перед загрузкой
3. Создавайте ретина-версии для высоких DPI экранов
4. Используйте SVG для иконок и логотипов
