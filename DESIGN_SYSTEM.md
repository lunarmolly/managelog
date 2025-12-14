# 🎨 Канбан Доска - Справочник Дизайна

## 📚 Содержание
1. [Цветовая палитра](#цветовая-палитра)
2. [Типография](#типография)
3. [Компоненты](#компоненты)
4. [Анимации](#анимации)
5. [Адаптивность](#адаптивность)
6. [Лучшие практики](#лучшие-практики)

---

## 🎨 Цветовая палитра

### Основные Цвета
```
Primary Red:      #912138  rgba(145, 33, 56)
Primary Dark:     #7a1a2d  (для gradient)
Background Dark:  #0a0e12
Background Deep:  #1a1e24
Text Light:       #e1eaf8
Text White:       #ffffff
Text Dark:        #292d32
```

### Акцентные Цвета
```
Accent Blue:      #85afe4  (для таймеров)
Dark Blue:        #5b8bc1
Accent Purple:    #ce9eff  (для дедлайнов)
Error Red:        #ff6b6b
Success Green:    #dbf3c2
```

### Градиенты
```
Column Bg:
  linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)

Task Card Bg:
  linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)

Button Primary:
  linear-gradient(135deg, #912138 0%, #7a1a2d 100%)

Button Hover:
  linear-gradient(135deg, #a02a43 0%, #8a1f34 100%)
```

---

## 📝 Типография

### Семейство Шрифтов
```
Font Family: 'Involve', Arial, sans-serif
Fallback:    Arial, sans-serif
```

### Шкала Размеров
```
H1 (Project Name):     32px, font-weight: 700
H2 (Modal Title):      clamp(1.5rem, 3vw, 2rem), font-weight: 600
H3 (Column Title):     18px, font-weight: 600
H4 (Task Name):        15px, font-weight: 600
Body (Text):           15px, font-weight: 400
Small (Metadata):      14px / 13px, font-weight: 500
Tiny (Info):           12px, font-weight: 400
```

### Межстрочный интервал (Line-height)
```
Heading:       1.3
Body:          1.5
Compact:       1.2
Dense:         1.0
```

### Межбуквенное расстояние (Letter-spacing)
```
Titles:        0.3px
Normal:        0px
Dense:         -1.4px (progress)
```

---

## 🧩 Компоненты

### Button States
```
Default:     rgba(145, 33, 56, 0.2)
Hover:       rgba(145, 33, 56, 0.4)
Active:      linear-gradient(135deg, #912138, #7a1a2d)
Disabled:    opacity: 0.5
```

### Input Fields
```
Background:  rgba(255, 255, 255, 0.05)
Border:      1px solid rgba(255, 255, 255, 0.1)
Focus:       border-color: rgba(145, 33, 56, 0.5)
             box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.1)
```

### Cards
```
Background:  linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))
Border:      1px solid rgba(255, 255, 255, 0.2)
Shadow:      0 4px 16px rgba(0, 0, 0, 0.1)
Hover:       
  - Shadow: 0 12px 32px rgba(145, 33, 56, 0.2)
  - Transform: translateY(-4px)
  - Border: rgba(145, 33, 56, 0.4)
```

### Checkboxes
```
Unchecked:
  Border:    2px solid #912138
  Background: rgba(145, 33, 56, 0.1)
  
Checked:
  Background: linear-gradient(135deg, #912138, #7a1a2d)
  Box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3)
```

---

## ✨ Анимации

### Timing Functions
```
Smooth Standard: cubic-bezier(0.4, 0, 0.2, 1)
                 (использовать везде!)

Fast In:        cubic-bezier(0.4, 0, 1, 1)
Fast Out:       cubic-bezier(0, 0, 0.2, 1)
```

### Длительности
```
Quick:      0.2s (для color changes, opacity)
Standard:   0.3s (для transforms, transitions)
Slow:       0.5s (для complex animations)
```

### Типичные Анимации
```
Hover Lift:
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.3);

Checkmark Animation:
  @keyframes checkmark {
    from { opacity: 0; transform: rotate(0deg) scale(0.8); }
    to   { opacity: 1; transform: rotate(45deg) scale(1); }
  }

Pulse Effect (Timer):
  @keyframes pulse {
    0%, 100% { box-shadow: 0 4px 12px rgba(...); }
    50%      { box-shadow: 0 4px 20px rgba(...); }
  }

Fade In:
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

Slide Up (Modal):
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
```

---

## 📱 Адаптивность

### Breakpoints
```
Mobile:   max-width: 480px
Tablet:   max-width: 768px
Desktop:  min-width: 1024px
Wide:     min-width: 1440px
```

### Изменения на Мобильных
```
Columns:
  Desktop: width: 280px
  Mobile:  width: 95vw

Padding:
  Desktop: 30px 36px
  Mobile:  16px 12px

Font Sizes:
  Desktop: 18px → 16px (columns)
  Desktop: 15px → 14px (body)

Height Modal:
  Desktop: max-height: 90vh
  Mobile:  height: 100vh
```

### Touch Targets
```
Минимальный размер: 32x32px
Рекомендуемый:     44x44px
Расстояние между:  8px minimum
```

---

## 🎯 Лучшие Практики

### Performance
```
✓ Используйте transform для анимаций (GPU-accelerated)
✓ Используйте opacity для фейдов
✓ Избегайте width/height изменений в animations
✓ Используйте will-change осторожно
✓ Минимизируйте repaints и reflows
```

### Accessibility
```
✓ Контраст: минимум 4.5:1 для текста
✓ Focus states должны быть видимы
✓ Размер шрифта: минимум 12px
✓ Интерактивные элементы: 44x44px
✓ Используйте semantic HTML
```

### Код
```
✓ Используйте CSS переменные для цветов
✓ Группируйте похожие стили
✓ Используйте shorthand где возможно
✓ Комментируйте сложные селекторы
✓ Следите за специфичностью
```

### User Experience
```
✓ Дайте immediate feedback
✓ Используйте consistent patterns
✓ Избегайте surprises
✓ Тестируйте на реальных устройствах
✓ Учитывайте different connection speeds
```

---

## 📐 Spacing Grid (8px)

```
0:   0px
1:   4px   (use sparingly)
2:   8px   (standard)
3:   12px
4:   16px
5:   20px
6:   24px  (standard large)
7:   28px
8:   32px
9:   36px
10:  40px
12:  48px
```

---

## 🔲 Border Radius Scale

```
Minimal:    4px   (small interactive)
Small:      6px   (checkboxes, tags)
Standard:   8px   (buttons, inputs)
Medium:     12px  (cards, modals)
Large:      16px  (kanban columns)
XL:         20px  (sections)
Full:       50%   (circles, avatars)
```

---

## 💡 CSS Utility Classes

### Shadow
```
shadow-sm:    0 2px 8px rgba(0,0,0,0.15)
shadow-md:    0 4px 16px rgba(0,0,0,0.1)
shadow-lg:    0 12px 32px rgba(0,0,0,0.2)
shadow-xl:    0 20px 60px rgba(0,0,0,0.3)
```

### Backdrop
```
backdrop-sm:  blur(5px)
backdrop-md:  blur(10px)
backdrop-lg:  blur(20px)
```

---

## 📋 Чек-лист для Новых Компонентов

Добавляя новый компонент, проверьте:

- [ ] Цвета из палитры
- [ ] Шрифты из шкалы
- [ ] Spacing из 8px grid
- [ ] Border radius из шкалы
- [ ] Hover состояние определено
- [ ] Focus состояние видимо
- [ ] Disabled состояние ясно
- [ ] Mobile адаптивность
- [ ] Animations smooth
- [ ] Контраст достаточный
- [ ] Touch targets 32x32px+
- [ ] Performance оптимален

---

**Версия:** 1.0.0  
**Последнее обновление:** 14 декабря 2025  
**Статус:** ✅ Production Ready
