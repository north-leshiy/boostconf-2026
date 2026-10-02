---
name: AI BOOST'26
description: Официальный шаблон конференции AI BOOST'26 — тёмные скруглённые панели на зелёном градиенте, Arial Bold капсом, бейджи AI BOOST и Partners' Club.
mode: dark
---

# AI BOOST'26

Снято с официального шаблона `AI_BOOST'26_шаблон_презентации.pptx` (1920 × 1080 pt — координаты переносятся 1:1 в пиксели канваса).

## Palette

| Role       | Value     | Notes                                                        |
| ---------- | --------- | ------------------------------------------------------------ |
| bg         | `#063524` | зелёный градиент под панелями (картинка `@assets/boost26/bg.jpg`) |
| panel      | `#05100E` | тёмные скруглённые панели — основная «бумага» слайда         |
| text       | `#FFFFFF` | весь основной текст                                          |
| accent     | `#0A8354` | бейджи, номера в списках, «/ total» в нумерации               |
| accentLogo | `#04AB6A` | кружок «AI» в логотипе — только для акцентов-цифр, не для фона |
| muted      | `#818686` | вторичный текст, подписи, «Тема доклада»                     |
| light      | `#CDCFCE` | плейсхолдеры, тонкие линии на тёмном                         |
| tint       | `#CEE3DB` | светло-зелёная подложка, если нужен светлый блок             |

Градиент фона (CSS-аппроксимация, если картинка не нужна):
`linear-gradient(200deg, #062a1e 0%, #063524 35%, #07492f 65%, #0a764c 100%)`.

Зелёная «геройская» панель (обложка, карточка спикера):
`linear-gradient(20deg, #0a764c 0%, #07492f 55%, #062a1e 100%)`.

## Typography

- Единственный шрифт шаблона — **Arial**: `Arial, "Helvetica Neue", Helvetica, "Liberation Sans", sans-serif`. Веб-шрифт не подключаем.
- Заголовки — **700, ВСЕ ПРОПИСНЫЕ**, `lineHeight: 1.0`, `letterSpacing: 0`.
- Шкала (из pptx):
  - Заголовок слайда в шапке: **94 px** (одна строка) / **90 px** (две строки «больше чем заголовок»).
  - Подзаголовок обложки (капс, 700): **84 px**, межстрочный ~1.2.
  - «Спасибо за внимание»: **93 px**.
  - Body: **40 px**, 400, `lineHeight: 1.25`.
  - Плотный body (длинные абзацы рядом с фото): **40 px**, абзацы через 40 px.
  - Имя спикера: **64 px**, компания **40 px**, должность **25 px**.
  - Подпись / «ТЕМА ДОКЛАДА» / нумерация: **24 px**.

## Layout

- Вся композиция — **панели `#05100E` с радиусом 35 px** поверх зелёного градиента, с **отступом 20 px от краёв и 20 px между панелями**.
- Стандартный контент-слайд:
  - Шапка: `left 20, top 20, 1880 × 185`. Заголовок с x = 87 (внутренний отступ 67), вертикально по центру.
  - Справа в шапке — бейджи: `@assets/boost26/boost-badge.svg` (185 × 68) и `@assets/boost26/partners-club-green.png` (361 × 68), правый край 1840, gap 15, top 78.
  - Тело: `left 20, top 225, 1880 × 835`. Внутренние поля 60 px слева/справа, ~62 px сверху.
  - Нумерация `N / total` — правый нижний угол тела (right 50, bottom 45 от краёв тела).
- Вариант «шапка + текст без тела»: только шапка-панель, текст лежит прямо на градиенте.
- Фото рядом с текстом — блок с радиусом 35 px, фото слева или справа, текст колонкой ~760 px.
- Обложка: крупный логотип `@assets/boost26/boost26-logo.svg` (x 80, y 54, ширина 1756) + зелёная панель внизу `20, 536, 1880 × 524` с подзаголовком капсом 84 px.
- Финал: слева зелёная карточка спикера `20, 20, 982 × 1040` (логотип `boost-logo.svg`, круглое ч/б фото, имя), справа «СПАСИБО ЗА ВНИМАНИЕ», тема, ФИО, компания, внизу «22-23.10 · Москва».

## Fixed components

Все компоненты рассчитаны на фон-подложку `Stage`. Ассеты импортируются в слайде явно:

```tsx
import bgImg from '@assets/boost26/bg.jpg';
import boostBadge from '@assets/boost26/boost-badge.svg';
import partnersGreen from '@assets/boost26/partners-club-green.png';
import boostLogoBig from '@assets/boost26/boost26-logo.svg';
import boostLogo from '@assets/boost26/boost-logo.svg';
import partnersWhite from '@assets/boost26/partners-club-white.png';
```

### Stage (фон) и Panel

```tsx
const FONT = 'Arial, "Helvetica Neue", Helvetica, "Liberation Sans", sans-serif';

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: `#063524 url(${bgImg}) center / cover no-repeat`,
      color: '#ffffff',
      fontFamily: FONT,
    }}
  >
    {children}
  </div>
);

const Panel = ({
  x, y, w, h, green = false, children, style,
}: {
  x: number; y: number; w: number; h: number; green?: boolean;
  children?: React.ReactNode; style?: React.CSSProperties;
}) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      borderRadius: 35, overflow: 'hidden', boxSizing: 'border-box',
      background: green
        ? 'linear-gradient(20deg, #0a764c 0%, #07492f 55%, #062a1e 100%)'
        : '#05100E',
      ...style,
    }}
  >
    {children}
  </div>
);
```

### Title (шапка с бейджами)

```tsx
const Title = ({ children }: { children: React.ReactNode }) => (
  <Panel x={20} y={20} w={1880} h={185}>
    <h1
      style={{
        position: 'absolute', left: 67, right: 640, top: 0, bottom: 0,
        display: 'flex', alignItems: 'center', margin: 0,
        fontSize: 92, fontWeight: 700, lineHeight: 1.0,
        textTransform: 'uppercase', color: '#ffffff',
      }}
    >
      {children}
    </h1>
    <div style={{ position: 'absolute', right: 40, top: 58, display: 'flex', gap: 15 }}>
      <img src={boostBadge} alt="AI BOOST" style={{ height: 68, display: 'block' }} />
      <img src={partnersGreen} alt="Partners' Club" style={{ height: 68, display: 'block' }} />
    </div>
  </Panel>
);
```

Двухстрочный заголовок — тот же `Title` с `<br />` внутри; при двух строках поставь `fontSize: 88`.

### Footer (нумерация внутри тела)

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const Footer = ({ topic }: { topic?: string }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute', left: 87, right: 70, bottom: 64,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontSize: 24, fontFamily: FONT, textTransform: 'uppercase',
      }}
    >
      <span style={{ color: '#818686', letterSpacing: '0.02em' }}>{topic ?? ''}</span>
      <span style={{ color: '#ffffff' }}>
        {current} <span style={{ color: '#0A8354' }}>/ {total}</span>
      </span>
    </div>
  );
};
```

### Eyebrow и нумерованный пункт

```tsx
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: 'inline-block', padding: '10px 22px', borderRadius: 18,
      background: '#0A8354', color: '#ffffff',
      fontSize: 26, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
    }}
  >
    {children}
  </span>
);

const NumItem = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
    <div
      style={{
        flex: '0 0 56px', width: 56, height: 56, borderRadius: '50%',
        background: '#0A8354', color: '#ffffff', fontSize: 38,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div style={{ fontSize: 40, lineHeight: 1.25, paddingTop: 2 }}>{children}</div>
  </div>
);
```

## Motion

- Философия: **subtle** — шаблон статичный, допускаем только мягкое появление пунктов по шагам; никаких «прыгающих» эффектов.

```css
@keyframes boostFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

## Aesthetic

Корпоративный ивент-шаблон: глубокий почти чёрный зелёный, сочный изумрудный градиент проступает только в 20-пиксельных щелях между панелями и в «геройских» зелёных блоках. Плотный, конструктивный, «приборная панель». Arial Bold капсом для заголовков, обычный Arial для текста — без других шрифтов. Скругления только 35 px (панели, фото) и ~22 px (бейджи), круги — для номеров и фото спикера. Избегать: светлого фона на весь слайд, тонких декоративных линий, эмодзи, теней и стеклянных эффектов, любых цветов вне зелёной гаммы (кроме белого и серого). Логотипы AI BOOST и Partners' Club обязаны быть на каждом контентном слайде (шапка) — это требование организаторов.

## Example usage

```tsx
const Content: Page = () => (
  <Stage>
    <Title>Мини заголовок</Title>
    <Panel x={20} y={225} w={1880} h={835}>
      <div style={{ position: 'absolute', left: 60, top: 62, right: 120, display: 'flex', flexDirection: 'column', gap: 48 }}>
        <NumItem n={1}>На выбор 3 цвета слайдов: черный, белый, зеленый.</NumItem>
        <NumItem n={2}>Логотип вашей компании можно разместить рядом с логотипом мероприятия.</NumItem>
      </div>
      <Footer topic="Тема доклада" />
    </Panel>
  </Stage>
);
```
