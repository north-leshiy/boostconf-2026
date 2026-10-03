import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { MorphElement, Step, Steps, useIsActivePage, useSlidePageNumber } from '@open-slide/core';

import speakerImg from './assets/speaker.png';
import logoAgenticdevconf from './assets/conf-logos/agenticdevconf.png';
import logoAinativeconf from './assets/conf-logos/ainativeconf.svg';
import logoTechleadconf from './assets/conf-logos/techleadconf.svg';
import logoCtoconf from './assets/conf-logos/ctoconf.svg';
import logoPodlodkaCrew from './assets/conf-logos/podlodka-crew.svg';
import logoTeamleadconf from './assets/conf-logos/teamleadconf.svg';
import logoAaaconf from './assets/conf-logos/aaaconf.svg';
import logoPyhconf from './assets/conf-logos/pyhconf.svg';
import clientsImg from './assets/clients.svg';
import fabricaImg from './assets/fabrica.png';
import mostiImg from './assets/mosti.jpg';
import qrChannelImg from './assets/qr-techlead-stream.png';
import meatProxyImg from './assets/meat-proxy.png';
import meatProxyVideo from './assets/meat-proxy-reaction.mp4';

// Тема AI BOOST'26 (themes/ai-boost-26.md)
import bgImg from '@assets/boost26/bg.jpg';
import boostBadge from '@assets/boost26/boost-badge.svg';
import partnersGreen from '@assets/boost26/partners-club-green.png';
import partnersWhite from '@assets/boost26/partners-club-white.png';
import boostLogoBig from '@assets/boost26/boost26-logo-sm.svg';
import boostLogo from '@assets/boost26/boost-logo.svg';

// ─── Дизайн-токены (правятся из панели Design) ───────────────────────────────
export const design: DesignSystem = {
  palette: { bg: '#05100E', text: '#ffffff', accent: '#04AB6A' },
  fonts: {
    display: 'Arial, "Helvetica Neue", Helvetica, "Liberation Sans", sans-serif',
    body: 'Arial, "Helvetica Neue", Helvetica, "Liberation Sans", sans-serif',
  },
  typeScale: { hero: 140, body: 40 },
  radius: 22,
};

// ─── Локальные константы ─────────────────────────────────────────────────────
const muted = '#8F9794';
const line = 'rgba(255,255,255,0.14)';
const surface = '#0C1D18';
const tint = '#0E2C22';
const accentSoft = '#3E9B76';
const accentFill = '#0A8354'; // сплошные заливки под белый текст
const ink = '#E8ECEA'; // линии и подписи схем
const dark = '#05100E'; // панели и текст на светлых заливках
const mono = '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace';

const PAD = 140;
const TOPIC = '3 вектора развития AI SDLC';
const GREEN_PANEL = 'linear-gradient(20deg, #0a764c 0%, #07492f 55%, #062a1e 100%)';

// ─── Переходы: один почерк на всю колоду ─────────────────────────────────────
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

// RISE — тихий домашний переход.
export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// BREATH — только для разделителей глав.
const breath: SlideTransition = {
  duration: 460,
  exit: { duration: 180, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 0 }] },
  enter: {
    duration: 240,
    delay: 300,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// MORPH — схемы ролей: рамки переезжают, остальное только проявляется.
const MORPH_MS = 760;
const morphT: SlideTransition = {
  duration: 280,
  exit: { duration: 220, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 0 }] },
  enter: { duration: 300, delay: 110, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  morph: { duration: MORPH_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
};

// ─── Внутристраничное движение ───────────────────────────────────────────────
// Подъём на 12px + проявление. Работает только на «живой» странице (data-live="1")
// и не трогает ещё не раскрытые шаги, поэтому превью и снимки всегда финальные.
const nth = Array.from({ length: 12 }, (_, i) => `.rs-stagger > :nth-child(${i + 1}) { --rs-i: ${i}; }`).join('\n');
const MOTION_CSS = `
@keyframes rs-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rs-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes rs-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes rs-pop { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
@keyframes rs-lay { from { opacity: 0; transform: scaleX(0.35); } to { opacity: 1; transform: scaleX(1); } }
@keyframes rs-fillbar { from { width: 0; } to { width: 50%; } }
@keyframes rs-pulse {
  0% { box-shadow: 0 12px 28px -10px rgba(4,171,106,0.7), 0 0 0 0 rgba(4,171,106,0.45); }
  100% { box-shadow: 0 12px 28px -10px rgba(4,171,106,0.7), 0 0 0 22px rgba(4,171,106,0); }
}
${nth}
.rs-d1 { --rs-d: 120ms; } .rs-d2 { --rs-d: 240ms; } .rs-d3 { --rs-d: 360ms; } .rs-d4 { --rs-d: 480ms; }
.rs-d5 { --rs-d: 600ms; } .rs-d6 { --rs-d: 720ms; }
.rs-morph-late { --rs-t0: ${MORPH_MS}ms; }
.rs-fade { --rs-anim: rs-fade; } .rs-pop { --rs-anim: rs-pop; }
.rs-lay { --rs-anim: rs-lay; }
.rs-fast { --rs-gap: 45ms; } .rs-slow { --rs-gap: 110ms; }
[data-live="1"] .rs-stagger:not([data-osd-step="pending"] *) > :not([data-osd-step]):not(.rs-static) {
  animation: var(--rs-anim, rs-rise) 440ms cubic-bezier(0, 0, 0.2, 1) both;
  animation-delay: calc(var(--rs-t0, 100ms) + var(--rs-d, 0ms) + var(--rs-i, 0) * var(--rs-gap, 90ms));
}
[data-live="1"] .rs-in:not([data-osd-step="pending"] *) {
  animation: var(--rs-anim, rs-rise) 440ms cubic-bezier(0, 0, 0.2, 1) both;
  animation-delay: calc(var(--rs-t0, 100ms) + var(--rs-d, 0ms));
}
[data-live="1"] .rs-draw:not([data-osd-step="pending"] *) {
  transform-origin: left center;
  animation: rs-draw 600ms cubic-bezier(0, 0, 0.2, 1) both;
  animation-delay: calc(var(--rs-t0, 100ms) + var(--rs-d, 0ms));
}
/* Раскладка обёрток <Step> в рядах/сетках/колонках */
.rs-steps-row > [data-osd-step] { flex: 1; min-width: 0; display: flex; }
.rs-steps-grid > [data-osd-step] { min-width: 0; display: flex; }
.rs-steps-col > [data-osd-step] { display: flex; }
svg .rs-stagger > *, svg .rs-in { transform-box: fill-box; transform-origin: left center; }
[data-live="1"] .rs-pulse:not([data-osd-step="pending"] *) { animation: rs-pulse 1.6s cubic-bezier(0, 0, 0.2, 1) 900ms infinite; }
[data-live="1"] .rs-fill:not([data-osd-step="pending"] *) { animation: rs-fillbar 800ms cubic-bezier(0, 0, 0.2, 1) 160ms both; }
[data-live="1"] .rs-strike:not([data-osd-step="pending"] *) { animation: rs-draw 360ms cubic-bezier(0, 0, 0.2, 1) 860ms both; }
@media (prefers-reduced-motion: reduce) { [data-live="1"] * { animation: none !important; } }
`;

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  background: `#063524 url(${bgImg}) center / cover no-repeat`,
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
  overflow: 'hidden',
  isolation: 'isolate',
};

// ─── Каркас темы: тёмные панели r=35 на зелёном градиенте, зазор 20 ─────────
const HEADER_H = 185;
const BODY_TOP = 20 + HEADER_H + 20;

const PanelBg = ({ x, y, w, h, green }: { x: number; y: number; w: number; h: number; green?: boolean }) => (
  <div
    className="rs-static"
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 35,
      background: green ? GREEN_PANEL : dark,
      zIndex: -1,
    }}
  />
);

// Бейджи AI BOOST + Partners' Club — обязательны на контентных слайдах.
const Logos = ({ top = 78 }: { top?: number }) => (
  <div className="rs-static" style={{ position: 'absolute', right: 80, top, display: 'flex', gap: 15, zIndex: 2 }}>
    <img src={boostBadge} alt="AI BOOST" style={{ height: 68, display: 'block' }} />
    <img src={partnersGreen} alt="Partners' Club" style={{ height: 68, display: 'block' }} />
  </div>
);

// Корень страницы: фон темы + панели + флаг «живой» страницы для CSS-анимаций.
// chrome: 'panel' — одна панель на весь слайд; 'frame' — шапка + тело; 'bare' — страница рисует сама.
type Chrome = 'panel' | 'frame' | 'bare';
const Live = ({
  style,
  className,
  children,
  chrome = 'panel',
}: {
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
  chrome?: Chrome;
}) => {
  const live = useIsActivePage();
  return (
    <div data-live={live ? '1' : '0'} className={className} style={{ ...fill, ...style }}>
      {chrome === 'panel' && <PanelBg x={20} y={20} w={1880} h={1040} />}
      {chrome === 'frame' && (
        <>
          <PanelBg x={20} y={20} w={1880} h={HEADER_H} />
          <PanelBg x={20} y={BODY_TOP} w={1880} h={1080 - BODY_TOP - 20} />
        </>
      )}
      {chrome !== 'bare' && <Logos />}
      {children}
      <style>{MOTION_CSS}</style>
    </div>
  );
};

// ─── Общие элементы ──────────────────────────────────────────────────────────
const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      className="rs-static"
      style={{
        position: 'absolute',
        left: PAD,
        right: 90,
        bottom: 54,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontSize: 22,
        textTransform: 'uppercase',
      }}
    >
      <span style={{ color: muted, letterSpacing: '0.04em' }}>{TOPIC}</span>
      <span style={{ fontSize: 24 }}>
        {current} <span style={{ color: 'var(--osd-accent)' }}>/ {total}</span>
      </span>
    </div>
  );
};

// Плашка-надзаголовок, как в шаблоне: зелёный бейдж капсом.
const Eyebrow = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      display: 'inline-block',
      padding: '10px 24px',
      borderRadius: 18,
      background: accentFill,
      color: '#fff',
      fontSize: 30,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      ...style,
    }}
  >
    {children}
  </div>
);

const Heading = ({ children, size = 72, caps = true }: { children: ReactNode; size?: number; caps?: boolean }) => (
  <h2
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: size,
      fontWeight: 700,
      lineHeight: caps ? 1.05 : 1.15,
      letterSpacing: 0,
      textTransform: caps ? 'uppercase' : 'none',
      margin: 0,
    }}
  >
    {children}
  </h2>
);

const Lead = ({ children, size = 34 }: { children: ReactNode; size?: number }) => (
  <p style={{ fontSize: size, lineHeight: 1.4, color: muted, margin: 0, maxWidth: 1640 }}>{children}</p>
);

const A = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--osd-accent)' }}>{children}</span>;

// Заголовок в шапке-панели (слева от бейджей).
const HeaderTitle = ({ children, size = 60 }: { children: ReactNode; size?: number }) => (
  <div
    className="rs-in"
    style={{ position: 'absolute', left: 87, top: 20, width: 1880 - 67 - 640, height: HEADER_H, display: 'flex', alignItems: 'center' }}
  >
    <Heading size={size}>{children}</Heading>
  </div>
);

// Стандартная контентная страница: шапка с заголовком, тело, футер.
const Frame = ({
  title,
  lead,
  children,
  gap = 56,
  titleSize,
}: {
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  gap?: number;
  titleSize?: number;
}) => (
  <Live chrome="frame" style={{ padding: `${BODY_TOP + 54}px ${PAD}px 0` }}>
    <HeaderTitle size={titleSize}>{title}</HeaderTitle>
    {lead && (
      <div className="rs-in">
        <Lead>{lead}</Lead>
      </div>
    )}
    <div style={{ marginTop: lead ? Math.max(24, gap - 16) : 0 }}>{children}</div>
    <Footer />
  </Live>
);

// Буллет с зелёным маркером.
const Bullet = ({ children, size = 40, mark }: { children: ReactNode; size?: number; mark?: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28, fontSize: size, lineHeight: 1.4 }}>
    <span
      style={{
        flex: 'none',
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: 'var(--osd-accent)',
        marginTop: size * 0.7 - 8,
        display: mark ? 'none' : 'block',
      }}
    />
    {mark && (
      <span
        style={{
          flex: 'none',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: accentFill,
          color: '#fff',
          fontSize: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: size * 0.7 - 28,
        }}
      >
        {mark}
      </span>
    )}
    <span>{children}</span>
  </div>
);

const BulletList = ({ children, gap = 26 }: { children: ReactNode; gap?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
);

// Разделитель главы: зелёная «геройская» панель.
const Divider = ({ n, title, sub }: { n: string; title: ReactNode; sub?: ReactNode }) => (
  <Live chrome="bare" style={{ padding: `0 ${PAD}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <PanelBg x={20} y={20} w={1880} h={1040} green />
    <img className="rs-static" src={boostLogo} alt="AI BOOST" style={{ position: 'absolute', left: 80, top: 60, height: 92 }} />
    <img className="rs-static" src={partnersWhite} alt="Partners' Club" style={{ position: 'absolute', right: 80, top: 72, height: 68 }} />
    <div
      className="rs-in"
      style={{ fontFamily: 'var(--osd-font-display)', fontSize: 220, fontWeight: 700, lineHeight: 0.9, color: 'rgba(255,255,255,0.32)' }}
    >
      {n}
    </div>
    <div className="rs-in rs-d1" style={{ marginTop: 40 }}>
      <Heading size={110}>{title}</Heading>
    </div>
    {sub && (
      <div className="rs-in rs-d2" style={{ fontSize: 38, lineHeight: 1.4, color: 'rgba(255,255,255,0.78)', marginTop: 36, maxWidth: 1300 }}>
        {sub}
      </div>
    )}
  </Live>
);
const dividerPage = (n: string, title: ReactNode, sub?: ReactNode): Page => {
  const P: Page = () => <Divider n={n} title={title} sub={sub} />;
  P.transition = breath;
  return P;
};

// Крупный тезис на всю страницу.
const Shout = ({ children, size = 88, eyebrow }: { children: ReactNode; size?: number; eyebrow?: ReactNode }) => (
  <Live style={{ padding: `0 ${PAD}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    {eyebrow && (
      <div className="rs-in" style={{ marginBottom: 40 }}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
    )}
    <div className="rs-in rs-d1" style={{ borderLeft: '10px solid var(--osd-accent)', paddingLeft: 56 }}>
      <Heading size={size} caps={false}>
        {children}
      </Heading>
    </div>
    <Footer />
  </Live>
);

// Карточка с меткой сверху.
const Card = ({
  label,
  title,
  text,
  accent,
  flex = 1,
  badge,
}: {
  label?: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  accent?: boolean;
  flex?: number;
  badge?: ReactNode;
}) => (
  <div
    style={{
      flex,
      minWidth: 0,
      position: 'relative',
      background: accent ? accentFill : surface,
      color: accent ? '#fff' : 'var(--osd-text)',
      border: `1px solid ${accent ? 'transparent' : line}`,
      borderRadius: 'var(--osd-radius)',
      padding: '32px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      boxShadow: accent ? '0 24px 48px -24px rgba(0,0,0,0.5)' : 'none',
    }}
  >
    {badge && (
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: 32,
          background: '#fff',
          color: dark,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '8px 18px',
          borderRadius: 999,
        }}
      >
        {badge}
      </div>
    )}
    {label && (
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: accent ? 'rgba(255,255,255,0.75)' : 'var(--osd-accent)',
        }}
      >
        {label}
      </div>
    )}
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 38, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
      {title}
    </div>
    {text && <div style={{ fontSize: 27, lineHeight: 1.45, color: accent ? 'rgba(255,255,255,0.85)' : muted }}>{text}</div>}
  </div>
);

const ArrowRight = ({ width = 72 }: { width?: number }) => (
  <div style={{ flex: 'none', width, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentSoft }}>
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none" aria-hidden="true">
      <path d="M2 16h40M30 4l12 12-12 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const Caption = ({ children, top = 40 }: { children: ReactNode; top?: number }) => (
  <div style={{ fontSize: 30, lineHeight: 1.4, color: muted, marginTop: top }}>{children}</div>
);


// ═══════════════════════════════════════════════════════════════════════════════
// ПЕРЕНЕСЕНО ИЗ КОЛОДЫ production-transformation (хендофы, SDLC, модель ролей)
// ═══════════════════════════════════════════════════════════════════════════════
const feColor = '#0A8354'; // фронтенд — работа
const beColor = '#5FD3A2'; // бекенд — работа
const ctxColor = '#7E8A86'; // погружение в бизнес-логику
const blockerColor = '#ffffff';



const LegendItem = ({ color, label, stroke }: { color: string; label: string; stroke?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: muted, whiteSpace: 'nowrap' }}>
    <span style={{ width: 36, height: 26, background: color, border: `${stroke ? 2 : 1}px solid ${stroke ? ink : 'transparent'}`, display: 'inline-block' }} />
    {label}
  </div>
);

// ─── Схема хендофов (SVG): две дорожки, фиксированная геометрия ──────────────
const ROW_H = 70;
const FE_Y = 40;
const BE_Y = FE_Y + ROW_H;
const PANEL_H = BE_Y + ROW_H + 10;

type SegKind = 'fe' | 'be' | 'ctx' | 'blk';
const segFill: Record<SegKind, string> = { fe: feColor, be: beColor, ctx: ctxColor, blk: blockerColor };

const Seg = ({ x, w, y, kind, label }: { x: number; w: number; y: number; kind: SegKind; label?: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={ROW_H} fill={segFill[kind]} stroke={dark} strokeWidth={2} />
    {label && (
      <text x={x + w / 2} y={y + ROW_H / 2 + 9} textAnchor="middle" fontSize={26} fill={kind === 'fe' ? '#fff' : dark}>
        {label}
      </text>
    )}
  </g>
);

const RowLabel = ({ y, children }: { y: number; children: string }) => (
  <text x={0} y={y + ROW_H / 2 + 9} fontSize={28} fill={ink}>
    {children}
  </text>
);

const PanelLabel = ({ children }: { children: string }) => (
  <text x={0} y={24} fontSize={26} fontWeight={800} fill={ink} letterSpacing="0.06em">
    {children}
  </text>
);

const Callout = ({ cx, text }: { cx: number; text: string }) => (
  <g>
    <text x={cx} y={-64} textAnchor="middle" fontSize={26} fontWeight={600} fill={ink}>
      {text}
    </text>
    <line x1={cx} y1={-48} x2={cx} y2={FE_Y - 12} stroke={ink} strokeWidth={2.5} />
    <polygon points={`${cx - 8},${FE_Y - 16} ${cx + 8},${FE_Y - 16} ${cx},${FE_Y - 2}`} fill={ink} />
  </g>
);

const PanelSvg = ({ children, calloutSpace = 0 }: { children: ReactNode; calloutSpace?: number }) => (
  <svg width={1640} height={PANEL_H + calloutSpace} viewBox={`0 ${-calloutSpace} 1640 ${PANEL_H + calloutSpace}`} style={{ display: 'block', overflow: 'visible' }}>
    {children}
  </svg>
);

const BeforePlain = () => (
  <PanelSvg calloutSpace={90}>
    <PanelLabel>ДО ИИ</PanelLabel>
    <Callout cx={710} text="Блокер / хендоф" />
    <RowLabel y={FE_Y}>фронтенд</RowLabel>
    <g className="rs-stagger rs-lay">
      <Seg y={FE_Y} x={330} w={330} kind="fe" label="работа" />
      <Seg y={FE_Y} x={660} w={100} kind="blk" />
      <Seg y={FE_Y} x={760} w={380} kind="fe" />
      <Seg y={FE_Y} x={1140} w={100} kind="blk" />
      <Seg y={FE_Y} x={1240} w={390} kind="fe" />
    </g>
    <RowLabel y={BE_Y}>бекенд</RowLabel>
    <g className="rs-stagger rs-lay">
      <Seg y={BE_Y} x={200} w={360} kind="be" label="работа" />
      <Seg y={BE_Y} x={560} w={100} kind="blk" />
      <Seg y={BE_Y} x={660} w={380} kind="be" />
      <Seg y={BE_Y} x={1040} w={100} kind="blk" />
      <Seg y={BE_Y} x={1140} w={360} kind="be" />
    </g>
  </PanelSvg>
);

const AfterPlain = () => (
  <PanelSvg>
    <PanelLabel>С ИИ</PanelLabel>
    <RowLabel y={FE_Y}>фронтенд</RowLabel>
    <g className="rs-stagger rs-lay rs-fast">
      <Seg y={FE_Y} x={330} w={130} kind="fe" />
      <Seg y={FE_Y} x={460} w={130} kind="blk" />
      <Seg y={FE_Y} x={590} w={130} kind="fe" />
      <Seg y={FE_Y} x={720} w={130} kind="blk" />
      <Seg y={FE_Y} x={850} w={130} kind="fe" />
      <Seg y={FE_Y} x={980} w={130} kind="blk" />
      <Seg y={FE_Y} x={1110} w={130} kind="fe" />
      <Seg y={FE_Y} x={1240} w={130} kind="blk" />
      <Seg y={FE_Y} x={1370} w={130} kind="fe" />
      <Seg y={FE_Y} x={1500} w={130} kind="blk" />
    </g>
    <RowLabel y={BE_Y}>бекенд</RowLabel>
    <g className="rs-stagger rs-lay rs-fast">
      <Seg y={BE_Y} x={200} w={130} kind="be" />
      <Seg y={BE_Y} x={330} w={130} kind="blk" />
      <Seg y={BE_Y} x={460} w={130} kind="be" />
      <Seg y={BE_Y} x={590} w={130} kind="blk" />
      <Seg y={BE_Y} x={720} w={130} kind="be" />
      <Seg y={BE_Y} x={850} w={130} kind="blk" />
      <Seg y={BE_Y} x={980} w={130} kind="be" />
      <Seg y={BE_Y} x={1110} w={130} kind="blk" />
      <Seg y={BE_Y} x={1240} w={130} kind="be" />
      <Seg y={BE_Y} x={1370} w={130} kind="blk" />
    </g>
  </PanelSvg>
);

const BeforeContext = () => (
  <PanelSvg calloutSpace={90}>
    <PanelLabel>ДО ИИ</PanelLabel>
    <Callout cx={710} text="Блокер / хендоф" />
    <Callout cx={1305} text="Погружение в бизнес-логику задачи" />
    <RowLabel y={FE_Y}>фронтенд</RowLabel>
    <g className="rs-stagger rs-lay">
      <Seg y={FE_Y} x={330} w={130} kind="ctx" />
      <Seg y={FE_Y} x={460} w={200} kind="fe" label="работа" />
      <Seg y={FE_Y} x={660} w={100} kind="blk" />
      <Seg y={FE_Y} x={760} w={130} kind="ctx" />
      <Seg y={FE_Y} x={890} w={250} kind="fe" />
      <Seg y={FE_Y} x={1140} w={100} kind="blk" />
      <Seg y={FE_Y} x={1240} w={130} kind="ctx" />
      <Seg y={FE_Y} x={1370} w={260} kind="fe" />
    </g>
    <RowLabel y={BE_Y}>бекенд</RowLabel>
    <g className="rs-stagger rs-lay">
      <Seg y={BE_Y} x={200} w={130} kind="ctx" />
      <Seg y={BE_Y} x={330} w={230} kind="be" label="работа" />
      <Seg y={BE_Y} x={560} w={100} kind="blk" />
      <Seg y={BE_Y} x={660} w={130} kind="ctx" />
      <Seg y={BE_Y} x={790} w={250} kind="be" />
      <Seg y={BE_Y} x={1040} w={100} kind="blk" />
      <Seg y={BE_Y} x={1140} w={130} kind="ctx" />
      <Seg y={BE_Y} x={1270} w={230} kind="be" />
    </g>
  </PanelSvg>
);

const AfterContext = () => (
  <PanelSvg>
    <PanelLabel>С ИИ</PanelLabel>
    <RowLabel y={FE_Y}>фронтенд</RowLabel>
    <g className="rs-stagger rs-lay rs-fast">
      <Seg y={FE_Y} x={330} w={65} kind="ctx" />
      <Seg y={FE_Y} x={395} w={65} kind="fe" />
      <Seg y={FE_Y} x={460} w={130} kind="blk" />
      <Seg y={FE_Y} x={590} w={65} kind="ctx" />
      <Seg y={FE_Y} x={655} w={65} kind="fe" />
      <Seg y={FE_Y} x={720} w={130} kind="blk" />
      <Seg y={FE_Y} x={850} w={65} kind="ctx" />
      <Seg y={FE_Y} x={915} w={65} kind="fe" />
      <Seg y={FE_Y} x={980} w={130} kind="blk" />
      <Seg y={FE_Y} x={1110} w={65} kind="ctx" />
      <Seg y={FE_Y} x={1175} w={65} kind="fe" />
      <Seg y={FE_Y} x={1240} w={130} kind="blk" />
      <Seg y={FE_Y} x={1370} w={65} kind="ctx" />
      <Seg y={FE_Y} x={1435} w={65} kind="fe" />
      <Seg y={FE_Y} x={1500} w={130} kind="blk" />
    </g>
    <RowLabel y={BE_Y}>бекенд</RowLabel>
    <g className="rs-stagger rs-lay rs-fast">
      <Seg y={BE_Y} x={200} w={65} kind="ctx" />
      <Seg y={BE_Y} x={265} w={65} kind="be" />
      <Seg y={BE_Y} x={330} w={130} kind="blk" />
      <Seg y={BE_Y} x={460} w={65} kind="ctx" />
      <Seg y={BE_Y} x={525} w={65} kind="be" />
      <Seg y={BE_Y} x={590} w={130} kind="blk" />
      <Seg y={BE_Y} x={720} w={65} kind="ctx" />
      <Seg y={BE_Y} x={785} w={65} kind="be" />
      <Seg y={BE_Y} x={850} w={130} kind="blk" />
      <Seg y={BE_Y} x={980} w={65} kind="ctx" />
      <Seg y={BE_Y} x={1045} w={65} kind="be" />
      <Seg y={BE_Y} x={1110} w={130} kind="blk" />
      <Seg y={BE_Y} x={1240} w={65} kind="ctx" />
      <Seg y={BE_Y} x={1305} w={65} kind="be" />
      <Seg y={BE_Y} x={1370} w={130} kind="blk" />
    </g>
  </PanelSvg>
);

// ─── Схемы SDLC (SVG) ────────────────────────────────────────────────────────
const ArrowDefs = () => (
  <defs>
    <marker id="rs26-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M0,0 L12,6 L0,12 z" fill={ink} />
    </marker>
    <marker id="rs26-arrow-accent" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M0,0 L12,6 L0,12 z" fill="#04AB6A" />
    </marker>
  </defs>
);

const Arrow = ({ d, accent, both }: { d: string; accent?: boolean; both?: boolean }) => (
  <path
    d={d}
    fill="none"
    stroke={accent ? '#04AB6A' : ink}
    strokeWidth={2.5}
    markerEnd={accent ? 'url(#rs26-arrow-accent)' : 'url(#rs26-arrow)'}
    markerStart={both ? (accent ? 'url(#rs26-arrow-accent)' : 'url(#rs26-arrow)') : undefined}
  />
);

const StageBox = ({
  x,
  y,
  label,
  label2,
  inner,
  tone = 'plain',
  dashed,
  round,
}: {
  x: number;
  y: number;
  label: string;
  label2?: string;
  inner?: string;
  tone?: 'plain' | 'soft';
  dashed?: boolean;
  round?: boolean;
}) => (
  <g>
    {round ? (
      <circle cx={x + 60} cy={y + 60} r={60} fill={tint} stroke={ink} strokeWidth={2} />
    ) : (
      <rect x={x} y={y} width={120} height={120} rx={12} fill={tone === 'soft' ? tint : surface} stroke={ink} strokeWidth={2} strokeDasharray={dashed ? '10 8' : undefined} />
    )}
    {inner && (
      <text x={x + 60} y={y + 74} textAnchor="middle" fontSize={40} fontWeight={700} fill={muted}>
        {inner}
      </text>
    )}
    <text x={x + 60} y={y + 162} textAnchor="middle" fontSize={26} fill={ink}>
      {label}
    </text>
    {label2 && (
      <text x={x + 60} y={y + 194} textAnchor="middle" fontSize={26} fill={ink}>
        {label2}
      </text>
    )}
  </g>
);

const Badge = ({ x, y, text, soft }: { x: number; y: number; text: string; soft?: boolean }) => (
  <g>
    <rect x={x} y={y} width={text.length * 15 + 48} height={56} rx={8} fill={soft ? tint : surface} stroke={ink} strokeWidth={2} />
    <text x={x + 24} y={y + 36} fontSize={26} fontWeight={600} fill={ink}>
      {text}
    </text>
  </g>
);

const PanelTitle = ({ y, tag, title, inverted }: { y: number; tag: string; title: string; inverted?: boolean }) => (
  <g>
    <rect x={0} y={y} width={130} height={48} rx={6} fill={inverted ? ink : surface} stroke={ink} strokeWidth={2} />
    <text x={65} y={y + 32} textAnchor="middle" fontSize={24} fontWeight={700} fill={inverted ? dark : ink}>
      {tag}
    </text>
    <text x={160} y={y + 34} fontSize={34} fontWeight={800} fill={ink} letterSpacing="-0.02em">
      {title}
    </text>
    <line x1={title.length * 20 + 190} y1={y + 24} x2={1640} y2={y + 24} stroke={line} strokeWidth={3} />
  </g>
);

const SdlcWas = () => (
  <svg width={1640} height={330} viewBox="0 0 1640 330" style={{ display: 'block', overflow: 'visible' }}>
    <ArrowDefs />
    <PanelTitle y={0} tag="Было" title="Типичный SDLC" />
    <g className="rs-stagger rs-slow">
      <g>
        <StageBox x={60} y={90} label="Требования" inner="1" />
      </g>
      <g>
        <Arrow d="M190,150 L262,150" />
        <StageBox x={270} y={90} label="Дизайн" inner="2" />
      </g>
      <g>
        <Arrow d="M400,150 L472,150" />
        <StageBox x={480} y={90} label="Код" inner="3" />
      </g>
      <g>
        <Arrow d="M610,150 L682,150" both />
        <StageBox x={690} y={90} label="Тесты" inner="4" />
      </g>
      <g>
        <Arrow d="M820,150 L892,150" both />
        <StageBox x={900} y={90} label="Ревью" inner="5" />
      </g>
      <g>
        <Arrow d="M1030,150 L1102,150" />
        <StageBox x={1110} y={90} label="Деплой" inner="6" />
      </g>
      <g>
        <Arrow d="M1240,150 L1312,150" />
        <StageBox x={1320} y={90} label="Мониторинг" inner="7" />
      </g>
      <g>
        <Badge x={60} y={270} text="↔ 6 хендофов между этапами" />
      </g>
    </g>
  </svg>
);

const SdlcNow = () => (
  <svg width={1640} height={300} viewBox="0 0 1640 300" style={{ display: 'block', overflow: 'visible' }}>
    <ArrowDefs />
    <PanelTitle y={0} tag="Стало" title="AI-first" inverted />
    <g className="rs-stagger rs-slow">
      <g>
        <StageBox x={60} y={90} label="Намерение +" label2="ограничения" tone="soft" />
      </g>
      <g>
        <Arrow d="M190,150 L292,150" />
        <StageBox x={300} y={90} label="Цикл агента" round />
        <text x={360} y={138} textAnchor="middle" fontSize={20} fontWeight={700} fill={ink}>
          код
        </text>
        <text x={360} y={162} textAnchor="middle" fontSize={20} fontWeight={700} fill={ink}>
          тесты
        </text>
        <text x={360} y={186} textAnchor="middle" fontSize={20} fontWeight={700} fill={ink}>
          деплой
        </text>
      </g>
      <g>
        <Arrow d="M430,150 L532,150" />
        <StageBox x={540} y={90} label="Наблюдение" tone="soft" />
      </g>
      <g>
        <Arrow d="M670,150 L772,150" both accent />
        <StageBox x={780} y={90} label="Валидация" inner="✓" dashed />
      </g>
      <g>
        <Badge x={1020} y={122} text="↔ 1 хендоф: человек ↔ агент" soft />
      </g>
    </g>
  </svg>
);


const LinkArrow = ({ label, both }: { label: string; both?: boolean }) => (
  <div style={{ width: 150, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
    <svg width={150} height={28} viewBox="0 0 150 28">
      <line x1={both ? 22 : 0} y1={14} x2={128} y2={14} stroke={ink} strokeWidth={3} />
      <polygon points="126,4 150,14 126,24" fill={ink} />
      {both && <polygon points="24,4 0,14 24,24" fill={ink} />}
    </svg>
    <div style={{ fontSize: 20, color: muted, textAlign: 'center', lineHeight: 1.25 }}>{label}</div>
  </div>
);

const FlowNode = ({ n, label, hot }: { n: string; label: string; hot?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
    <div
      className={hot ? 'rs-pulse' : undefined}
      style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: hot ? accentFill : surface,
        border: hot ? 'none' : `2px solid ${line}`,
        color: hot ? '#ffffff' : muted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 800,
        boxShadow: hot ? '0 12px 28px -10px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      {n}
    </div>
    <div style={{ fontSize: 20, fontWeight: hot ? 700 : 500, color: hot ? 'var(--osd-text)' : muted, whiteSpace: 'nowrap' }}>{label}</div>
  </div>
);

const FlowRow = ({ idx, title, badge, children }: { idx: string; title: string; badge: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, background: surface, border: `1px solid ${line}`, borderRadius: 'var(--osd-radius)', padding: '20px 36px' }}>
    <div style={{ width: 220, flexShrink: 0, alignSelf: 'center' }}>
      <div style={{ fontSize: 20, color: muted, letterSpacing: '0.1em' }}>{idx}</div>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4 }}>{title}</div>
    </div>
    <div className="rs-stagger rs-fast" style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
      {children}
    </div>
    <div
      style={{
        flexShrink: 0,
        width: 320,
        height: 52,
        marginTop: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: 600,
        color: 'var(--osd-accent)',
        background: tint,
        border: `1px solid ${accentSoft}`,
        borderRadius: 999,
      }}
    >
      {badge}
    </div>
  </div>
);

const AutonomyMeter = () => (
  <div style={{ marginTop: 56 }}>
    <div style={{ position: 'relative', height: 40, borderRadius: 999, background: surface, border: `1px solid ${line}` }}>
      <div
        className="rs-fill"
        style={{
          position: 'absolute',
          left: 0,
          width: '50%',
          top: 0,
          bottom: 0,
          borderRadius: 999,
          background: `linear-gradient(90deg, var(--osd-accent) 0%, var(--osd-accent) 30%, ${accentSoft} 30%, ${accentSoft} 100%)`,
        }}
      />
    </div>
    <div style={{ position: 'relative', height: 44, marginTop: 14, fontSize: 24, color: muted }}>
      <span style={{ position: 'absolute', left: 0 }}>0 %</span>
      <span className="rs-in rs-fade rs-d6" style={{ position: 'absolute', left: '15%', transform: 'translateX(-50%)', color: 'var(--osd-accent)', fontWeight: 700 }}>
        15 %
      </span>
      <span className="rs-in rs-fade rs-d6" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'var(--osd-accent)', fontWeight: 700 }}>
        50 %
      </span>
      <span style={{ position: 'absolute', right: 0 }}>100 %</span>
    </div>
  </div>
);

const Chevron = ({ label, color }: { label: string; color: string }) => (
  <div
    style={{
      flex: 1,
      height: 56,
      background: color,
      clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 18px 50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 22,
      fontWeight: 700,
      color: '#fff',
    }}
  >
    {label}
  </div>
);

const RoleCell = ({ label, span = 1, hot, dim }: { label: string; span?: number; hot?: boolean; dim?: boolean }) => {
  const emph = !dim && (hot || span > 1);
  return (
    <div
      style={{
        gridColumn: `span ${span}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '4px 0',
        borderTop: emph ? '3px solid var(--osd-accent)' : `3px solid ${line}`,
        opacity: dim ? 0.5 : 1,
      }}
    >
      <svg width={28} height={28} viewBox="0 0 28 28" fill="none" stroke={emph ? '#04AB6A' : muted} strokeWidth={2}>
        <circle cx={14} cy={9} r={6} />
        <path d="M3 27c1.5-7 6-10 11-10s9.5 3 11 10" />
      </svg>
      <div style={{ fontSize: 22, fontWeight: emph ? 700 : 500, color: emph ? 'var(--osd-text)' : muted, textAlign: 'center', whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
};

const Tag = ({ text, tone }: { text: string; tone: 'bad' | 'good' }) => (
  <div style={{ background: tone === 'bad' ? 'rgba(242,120,120,0.16)' : 'rgba(4,171,106,0.2)', color: tone === 'bad' ? '#F4A9A9' : '#7FE3B6', fontSize: 22, fontWeight: 600, padding: '12px 20px', borderRadius: 10, whiteSpace: 'nowrap' }}>
    {/* @slide-comment id="c-b58ff4e3" ts="2026-09-18T13:39:14.831Z" text="eyJub3RlIjoi0YPQtNC-0LvQuCJ9" */}
    {text}
  </div>
);

const SdlcPanel = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ flex: 1, minWidth: 0, background: surface, border: `1px solid ${line}`, borderRadius: 'var(--osd-radius)', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
    {children}
  </div>
);

const CHEV = { idea: '#123F31', req: '#0E5039', dev: '#0B6343', test: '#0A744D', deploy: '#0A8354', support: '#139A68' };

const ModelBlock = ({
  eyebrow,
  title,
  items,
  stages,
  roles,
  cols,
  accent,
}: {
  eyebrow: string;
  title: string;
  items: [string, string, string];
  stages: ReactNode;
  roles: ReactNode;
  cols: number;
  accent?: boolean;
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      background: surface,
      border: accent ? '3px solid var(--osd-accent)' : `1px solid ${line}`,
      borderRadius: 'var(--osd-radius)',
      padding: '28px 36px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--osd-accent)', whiteSpace: 'nowrap' }}>{eyebrow}</div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</div>
    <div style={{ display: 'flex', gap: 6 }}>{stages}</div>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 6, marginTop: -8 }}>{roles}</div>
    <ul style={{ margin: 0, paddingLeft: 32, fontSize: 26, lineHeight: 1.35, listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <li>{items[0]}</li>
      <li>{items[1]}</li>
      <li>{items[2]}</li>
    </ul>
  </div>
);

const RealityRow = ({ title, text }: { title: string; text?: string }) => (
  <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', padding: '22px 0', borderBottom: `1px solid ${line}` }}>
    <span style={{ width: 16, height: 16, borderRadius: 4, background: accentFill, marginTop: 18, flexShrink: 0 }} />
    <div>
      <div style={{ fontSize: 40, lineHeight: 1.3, letterSpacing: '-0.015em' }}>{title}</div>
      {text && <div style={{ fontSize: 28, lineHeight: 1.4, color: muted, marginTop: 6 }}>{text}</div>}
    </div>
  </div>
);

const TrendCol = ({ title, dir, items }: { title: string; dir: 'down' | 'up'; items: [string, string] }) => (
  <div style={{ flex: 1, minWidth: 0, background: surface, border: dir === 'up' ? '3px solid var(--osd-accent)' : `1px solid ${line}`, borderRadius: 'var(--osd-radius)', padding: '36px 40px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width={48} height={48} viewBox="0 0 48 48">
        {dir === 'up' ? (
          <path d="M6,38 L20,22 L28,30 L42,12 M30,12 L42,12 L42,24" fill="none" stroke="#04AB6A" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6,12 L20,28 L28,20 L42,38 M30,38 L42,38 L42,26" fill="none" stroke={muted} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</div>
    </div>
    <ul style={{ margin: '24px 0 0', paddingLeft: 32, fontSize: 30, lineHeight: 1.4, listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <li>{items[0]}</li>
      <li>{items[1]}</li>
    </ul>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// СТРАНИЦЫ
// ═══════════════════════════════════════════════════════════════════════════════

// 01 — Обложка (по образцу титула шаблона AI BOOST'26)
const SpeakerPhoto = ({ size }: { size: number }) => (
  <img
    src={speakerImg}
    alt="Иван Поддубный"
    style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 18%', filter: 'grayscale(1)', display: 'block' }}
  />
);
const Cover: Page = () => (
  <Live chrome="bare" style={{ background: dark }}>
    <img className="rs-in" src={boostLogoBig} alt="AI BOOST'26" style={{ position: 'absolute', left: 80, top: 80, width: 692 }} />
    <img className="rs-in" src={partnersGreen} alt="Partners' Club" style={{ position: 'absolute', right: 80, top: 126, height: 68 }} />
    <PanelBg x={20} y={398} w={1216} h={662} green />
    <div className="rs-in rs-d1" style={{ position: 'absolute', left: 87, top: 470, width: 1080 }}>
      <Heading size={104}>
        3 вектора развития
        <br />
        AI SDLC
      </Heading>
      <div style={{ fontSize: 38, lineHeight: 1.4, color: 'rgba(255,255,255,0.8)', marginTop: 40 }}>Harness · Трансформация ролей · Автономность</div>
    </div>
    <div className="rs-in rs-d2" style={{ position: 'absolute', left: 87, right: 1920 - 1236 + 60, bottom: 76, display: 'flex', justifyContent: 'space-between', fontSize: 34, color: 'rgba(255,255,255,0.8)' }}>
      <span>22-23.10</span>
      <span>Москва</span>
    </div>
    <PanelBg x={1256} y={398} w={644} h={662} green />
    <div className="rs-in rs-d2" style={{ position: 'absolute', left: 1256, top: 398, width: 644, height: 662, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36 }}>
      <SpeakerPhoto size={380} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.15 }}>Иван Поддубный</div>
        <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.8)', marginTop: 10 }}>CTO Вебпрактик</div>
      </div>
    </div>
  </Live>
);
Cover.transition = {
  duration: 280,
  exit: {
    duration: 160,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-6px)' },
    ],
  },
  enter: {
    duration: 280,
    delay: 100,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

const CONF_LOGOS = [
  { src: logoAgenticdevconf, alt: 'AgenticDevConf' },
  { src: logoAinativeconf, alt: 'AI Native Conf' },
  { src: logoTechleadconf, alt: 'TechLead Conf' },
  { src: logoCtoconf, alt: 'CTO Conf' },
  { src: logoPodlodkaCrew, alt: 'Podlodka Crew' },
  { src: logoTeamleadconf, alt: 'TeamLead Conf' },
  { src: logoAaaconf, alt: 'AAA Conf' },
  { src: logoPyhconf, alt: 'ПыхКонф' },
];
const ConfLogos = () => (
  <div style={{ marginTop: 18, marginLeft: 44, display: 'flex', alignItems: 'center', gap: 36 }}>
    {CONF_LOGOS.map((l) => (
      <img key={l.alt} src={l.src} alt={l.alt} style={{ height: 44, maxWidth: 160, minWidth: 0, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
    ))}
  </div>
);

// 02 — Кто я
const About: Page = () => (
  <Frame title="Кто я">
    <Steps>
      <Step>
        <BulletList>
          <Bullet size={38}>15+ лет в IT: fullstack → тимлид → CTO</Bullet>
        </BulletList>
      </Step>
      <Step>
        <div style={{ marginTop: 26 }}>
          <Bullet size={38}>CTO в Вебпрактик, 150+ человек</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 26 }}>
          <Bullet size={38}>Программный комитет конференций:</Bullet>
          <ConfLogos />
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 26 }}>
          <Bullet size={38}>Помогаю в качестве организатора некоторым ростовским ИТ сообществам</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 26 }}>
          <Bullet size={38}>1,5 года трансформирую SDLC-процессы:</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 20, marginLeft: 44 }}>
          <Bullet size={32}>100% adoption среди разработчиков ещё в 2025</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 16, marginLeft: 44 }}>
          <Bullet size={32}>
            <b>Масштабирую</b> сквозной SDD-процесс на все команды
          </Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 16, marginLeft: 44 }}>
          <Bullet size={32}>
            <b>Начинаю</b> перестраивать процессы на сквозных инженеров
          </Bullet>
        </div>
      </Step>
    </Steps>
  </Frame>
);

// 03 — Вебпрактик
const Clients: Page = () => (
  <Live chrome="frame">
    <HeaderTitle size={56}>
      Вебпрактик — <A>веб-интегратор</A> для корпораций
    </HeaderTitle>
    <div style={{ position: 'absolute', left: 20, top: BODY_TOP, width: 1880, height: 1080 - BODY_TOP - 20, borderRadius: 35, overflow: 'hidden', background: '#fff' }}>
      <img
        src={clientsImg}
        alt="Логотипы клиентов Вебпрактик"
        style={{ position: 'absolute', left: 0, top: -150, width: 1880, height: 1057, objectFit: 'cover' }}
      />
    </div>
  </Live>
);



// ─── Глава 01: путь к 100% adoption ──────────────────────────────────────────


const Adoption100: Page = () => (
  <Shout eyebrow="Конец 2025 года">
    Через тернии мы пришли к <A>100% adoption</A> среди разработчиков
  </Shout>
);

// Веха на пути к 100%
const Milestone = ({ n, title, text }: { n: string; title: string; text: string }) => (
  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: accentFill,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--osd-font-display)',
          fontWeight: 800,
          fontSize: 26,
          flex: 'none',
        }}
      >
        {n}
      </div>
      <div style={{ flex: 1, height: 4, background: line }} />
    </div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 30, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', paddingRight: 16 }}>
      {title}
    </div>
    <div style={{ fontSize: 27, lineHeight: 1.45, color: muted, paddingRight: 24 }}>{text}</div>
  </div>
);
const PathTo100: Page = () => (
  <Frame title="Кратко о пути до 100% среди разработчиков" gap={80}>
    <div className="rs-steps-row" style={{ display: 'flex', gap: 24 }}>
      <Steps>
        <Step>
          <Milestone n="1" title="AI-клуб энтузиастов" text="Начали с 15 человек, потом клуб вырос до 22" />
        </Step>
        <Step>
          <Milestone n="2" title="Ресерч на сходках клуба" text="Стек, модели и основа harness" />
        </Step>
        <Step>
          <Milestone n="3" title="Трекеры из клуба" text="Каждому инженеру назначили своего трекера" />
        </Step>
        <Step>
          <Milestone n="4" title={'Парное програм\u00adмирование'} text="Довели до 95% среди разработчиков" />
        </Step>
        <Step>
          <Milestone n="5" title="Кадровые решения" text="Оставшиеся 5% добили ими" />
        </Step>
      </Steps>
    </div>
  </Frame>
);



// ─── Глава 02: почему нужен единый процесс ───────────────────────────────────

const Fabrica: Page = () => (
  <Live chrome="frame">
    <HeaderTitle>Модель зрелости AI в SDLC</HeaderTitle>
    <img
      src={fabricaImg}
      alt="Модель зрелости AI в SDLC"
      style={{ position: 'absolute', left: 60, top: BODY_TOP + 20, width: 1800, height: 1080 - BODY_TOP - 140, objectFit: 'contain' }}
    />
    <Footer />
  </Live>
);

const BusFactor: Page = () => (
  <Frame title="Автономность снижает бас-фактор" lead="Логика простая:">
    <Steps>
      <Step>
        <Bullet mark="1">Растёт продуктивность → команды потенциально уменьшаются в размере</Bullet>
      </Step>
      <Step>
        <div style={{ marginTop: 26 }}>
          <Bullet mark="2">Меньше команда → выше риск завязки на конкретных людей</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 26 }}>
          <Bullet mark="3">Повышение автономности процесса как раз и снижает бас-фактор</Bullet>
        </div>
      </Step>
    </Steps>
  </Frame>
);

const Bridge: Page = () => (
  <Live chrome="frame" style={{ padding: `${BODY_TOP + 54}px ${PAD}px 0` }}>
    <HeaderTitle>Кейс стратегической сессии</HeaderTitle>
    <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start' }}>
      <div className="rs-in" style={{ flex: 1, minWidth: 0 }}>
        <Lead>Попросили руководителей цехов нарисовать, как они видят выход на L3.</Lead>
        <Steps>
          <Step>
            <div style={{ marginTop: 56, fontSize: 36, lineHeight: 1.4, fontWeight: 600 }}>
              У каждого цеха оказался <A>свой вижен контекста</A>: свои инструменты, практики и формат. Мосты не сходились.
            </div>
          </Step>
        </Steps>
      </div>
      <div className="rs-in rs-d2 rs-pop" style={{ flex: 'none' }}>
        <img
          src={mostiImg}
          alt="Два пролёта моста, которые не сошлись"
          style={{ width: 760, height: 570, objectFit: 'cover', borderRadius: 35, display: 'block' }}
        />
      </div>
    </div>
    <Footer />
  </Live>
);


const ManagementMistake: Page = () => (
  <Frame title="Управленческая ошибка, которую совершают многие" gap={64}>
    <Steps>
      <Step>
        <Bullet>Каждый внедряет независимо: свои инструменты, практики и формат</Bullet>
      </Step>
      <Step>
        <div style={{ marginTop: 26 }}>
          <Bullet>Никто не понимает, что и как делается раньше и дальше по цепочке</Bullet>
        </div>
      </Step>
      <Step>
        <div
          style={{
            marginTop: 64,
            background: tint,
            borderLeft: '8px solid var(--osd-accent)',
            borderRadius: '0 var(--osd-radius) var(--osd-radius) 0',
            padding: '32px 40px',
            fontSize: 36,
            lineHeight: 1.4,
            fontWeight: 600,
          }}
        >
          Наш ответ — <A>сквозной SDD</A>: единый язык и процесс через всю цепочку SDLC.
        </div>
      </Step>
    </Steps>
  </Frame>
);

// ─── Глава 03: выбор фреймворка ──────────────────────────────────────────────




// ─── Глава 04: как заходили роли ─────────────────────────────────────────────

// Элементы схем (абсолютные координаты; morph требует детерминированной геометрии)
type Tone = 'accent' | 'outline' | 'soft' | 'ghost' | 'dev';
const toneStyle: Record<Tone, CSSProperties> = {
  accent: { background: accentFill, color: '#fff', border: '2px solid transparent' },
  outline: { background: surface, color: 'var(--osd-text)', border: `2px solid ${line}` },
  soft: { background: tint, color: 'var(--osd-text)', border: '2px solid transparent' },
  ghost: { background: 'transparent', color: muted, border: `2px dashed ${accentSoft}` },
  dev: { background: surface, color: 'var(--osd-text)', border: '2px solid var(--osd-accent)' },
};
const Box = ({
  id,
  x,
  y,
  w,
  h,
  title,
  sub,
  tone = 'outline',
  row,
  badge,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: ReactNode;
  sub?: ReactNode;
  tone?: Tone;
  row?: boolean;
  badge?: ReactNode;
}) => (
  <MorphElement id={id}>
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 'var(--osd-radius)',
        padding: row ? '0 36px' : '28px 36px',
        display: 'flex',
        flexDirection: row ? 'row' : 'column',
        alignItems: row ? 'center' : 'flex-start',
        justifyContent: row ? 'flex-start' : 'center',
        gap: row ? 28 : 10,
        ...toneStyle[tone],
      }}
    >
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: -18,
            right: 24,
            background: '#fff',
            color: dark,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: 999,
          }}
        >
          {badge}
        </div>
      )}
      <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 32, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
        {title}
      </div>
      {sub && <div style={{ fontSize: 23, lineHeight: 1.35, opacity: tone === 'accent' ? 0.85 : 0.8 }}>{sub}</div>}
    </div>
  </MorphElement>
);
const Gate = ({ id, x, y, h = 170 }: { id: string; x: number; y: number; h?: number }) => (
  <MorphElement id={id}>
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 104,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 999,
        background: surface,
        border: '2px solid var(--osd-accent)',
        color: 'var(--osd-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 700,
        lineHeight: 1.2,
      }}
    >
      quality
      <br />
      gate
    </div>
  </MorphElement>
);
const HArrow = ({ x, y, w = 60 }: { x: number; y: number; w?: number }) => (
  <svg
    className="rs-in rs-fade rs-morph-late"
    style={{ position: 'absolute', left: x, top: y - 14 }}
    width={w}
    height="28"
    viewBox={`0 0 ${w} 28`}
    fill="none"
    aria-hidden="true"
  >
    <path d={`M2 14h${w - 14}M${w - 22} 4l10 10-10 10`} stroke={accentSoft} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const DiagramCaption = ({ y, children }: { y: number; children: ReactNode }) => (
  <div className="rs-in rs-fade rs-morph-late" style={{ position: 'absolute', left: PAD, right: PAD, top: y, fontSize: 30, lineHeight: 1.4, color: muted }}>
    {children}
  </div>
);
const DiagramPage = ({ title, eyebrow, children }: { title: ReactNode; eyebrow?: ReactNode; children: ReactNode }) => (
  <Live chrome="frame">
    <HeaderTitle>{title}</HeaderTitle>
    {eyebrow && (
      <div style={{ position: 'absolute', left: PAD, top: BODY_TOP + 50 }}>
        <Eyebrow style={{ fontSize: 26 }}>{eyebrow}</Eyebrow>
      </div>
    )}
    {children}
    <Footer />
  </Live>
);

// Схема 1: антипаттерн
const FlowAnti: Page = () => (
  <DiagramPage title="Антипаттерн: SDD только в разработке">
    <Box id="src" x={460} y={290} w={1000} h={130} tone="ghost" title="Jira / Confluence" sub="спецификация во внешней системе: источник требований" />
    <div className="rs-in rs-fade rs-morph-late" style={{ position: 'absolute', left: 0, right: 0, top: 448, textAlign: 'center', fontSize: 26, color: muted }}>
      ↓ требования падают тикетами и текстом ↓
    </div>
    <Box id="an" x={140} y={530} w={480} h={210} title="Аналитик" sub="пишет требования в Jira / Confluence" />
    <HArrow x={630} y={635} w={80} />
    <Box id="dev" x={720} y={530} w={480} h={210} tone="dev" title="Разработчик" sub="генерит свой слой спек только под себя" badge="SDD" />
    <HArrow x={1210} y={635} w={80} />
    <Box id="qa" x={1300} y={530} w={480} h={210} title="Тестировщик" sub="вне SDD, свои сценарии" />
    <DiagramCaption y={820}>SDD живёт островом у разработчика · требования дублируются · трассировка рвётся</DiagramCaption>
  </DiagramPage>
);
FlowAnti.transition = morphT;

// Схема 2: сквозной SDD
// Подложка без морфа: иначе её проявляющаяся копия ложится поверх летящих карточек.
const Band = ({ y, h, label }: { id?: string; y: number; h: number; label: string }) => (
  <div
    style={{
      position: 'absolute',
      left: PAD,
      top: y,
      width: 1920 - PAD * 2,
      height: h,
      boxSizing: 'border-box',
      borderRadius: 28,
      background: tint,
      border: `2px solid ${accentSoft}`,
      padding: '18px 32px',
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
    }}
  >
    {label}
  </div>
);
const FlowE2E: Page = () => (
  <DiagramPage title="Сквозной SDD: платформа на всю команду">
    <Box id="src" x={460} y={290} w={1000} h={130} tone="accent" title="Спеки в том же репозитории" sub="единый источник истины вместо Jira / Confluence" />
    <Band id="band" y={460} h={420} label="единая SDD-платформа · аналитик · разработчик · тестировщик" />
    <Box id="an" x={200} y={530} w={400} h={170} title="Аналитик" sub="/explore · /propose" />
    <Gate id="gate1" x={630} y={530} />
    <Box id="dev" x={764} y={530} w={400} h={170} tone="dev" title="Разработчик" sub="/apply" />
    <Gate id="gate2" x={1194} y={530} />
    <Box id="prod" x={1328} y={530} w={392} h={170} tone="accent" title="merge / prod" />
    <Box id="qa" x={470} y={750} w={980} h={90} row title="Тестировщик" sub="держит quality gate после аналитика и после разработчика" />
    <DiagramCaption y={910}>Одни спеки, один язык, сквозная трассировка: основной профит именно здесь</DiagramCaption>
  </DiagramPage>
);
FlowE2E.transition = morphT;

// Схема 3: ошибка с e2e (v1)
const FlowV1: Page = () => (
  <DiagramPage title="Ошибка: пережиток старого мышления" eyebrow="v1 · как мы сначала думали делать e2e">
    <Box id="an" x={140} y={470} w={380} h={190} title="Аналитик" sub="/explore · /propose" />
    <Gate id="gate1" x={560} y={470} h={190} />
    <Box id="dev" x={704} y={470} w={380} h={190} tone="dev" title="Разработчик" sub="/apply" />
    <HArrow x={1094} y={565} w={70} />
    <Box id="qa" x={1174} y={470} w={400} h={190} tone="ghost" title="Тестировщик" sub="пишет e2e автотесты отдельным скилом" />
    <HArrow x={1564} y={565} w={50} />
    <Box id="prod" x={1624} y={470} w={156} h={190} tone="accent" title={<span style={{ fontSize: 24 }}>prod</span>} />
    <DiagramCaption y={760}>Думали, что e2e напишут тестировщики отдельным шагом. Но это разрывает цикл «код ↔ тесты».</DiagramCaption>
  </DiagramPage>
);
FlowV1.transition = morphT;

// Схема 4: e2e в одном цикле (v2)
const FlowV2: Page = () => (
  <DiagramPage title="Правильно: e2e в одном цикле с кодом" eyebrow="v2 · e2e отдаём агенту разработчика">
    <Band id="band" y={400} h={420} label="единая SDD-платформа · аналитик · разработчик · тестировщик" />
    <Box id="an" x={200} y={470} w={400} h={170} title="Аналитик" sub="/explore · /propose" />
    <Gate id="gate1" x={630} y={470} />
    <Box id="dev" x={764} y={470} w={400} h={170} tone="dev" title="Разработчик" sub="/apply · код ⇄ e2e" badge="+ e2e" />
    <Gate id="gate2" x={1194} y={470} />
    <Box id="prod" x={1328} y={470} w={392} h={170} tone="accent" title="merge / prod" />
    <Box id="qa" x={470} y={690} w={980} h={90} row title="Тестировщик" sub="держит quality gate после аналитика и после разработчика" />
    <DiagramCaption y={860}>Агент пишет тесты и гоняет их с правками кода в одном цикле. Разрыв этого цикла и есть пережиток.</DiagramCaption>
  </DiagramPage>
);
FlowV2.transition = morphT;




const Gherkin: Page = () => (
  <Frame title="UseCase vs Gherkin" lead="По умолчанию в OpenSpec — Gherkin." gap={44}>
    <Steps>
      <Step>
        <Bullet size={36}>Заменили на UseCase по просьбе аналитиков: человеку читается удобнее</Bullet>
      </Step>
      <Step>
        <div style={{ marginTop: 24 }}>
          <Bullet size={36}>Автотесты деградировали: Gherkin точнее как приёмочный критерий</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 24 }}>
          <Bullet size={36}>Вернули Gherkin как основу</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 24 }}>
          <Bullet size={36}>Где нужно, дополнительно генерируем UseCase отдельным файлом в change</Bullet>
        </div>
      </Step>
    </Steps>
  </Frame>
);




// ─── Глава 05: платформа под процесс ─────────────────────────────────────────








// Слой harness
const Layer = ({ title, width, base }: { title: string; width: number; base?: boolean }) => (
  <div
    style={{
      width,
      height: base ? 104 : 78,
      boxSizing: 'border-box',
      borderRadius: base ? 'var(--osd-radius)' : 14,
      background: base ? accentFill : surface,
      color: base ? '#fff' : 'var(--osd-text)',
      border: `2px solid ${base ? 'transparent' : line}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--osd-font-display)',
      fontSize: base ? 36 : 30,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      boxShadow: base ? '0 24px 48px -24px rgba(0,0,0,0.5)' : 'none',
    }}
  >
    {title}
  </div>
);
const HarnessStack: Page = () => (
  <Frame title="SDD — фундамент нашего harness" lead="Сверху кладём всё остальное." gap={36}>
    <div style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: 12 }}>
      <Layer title="Сквозной SDD" width={1640} base />
      <Steps>
        <Step>
          <Layer title="Контекст проекта" width={1400} />
        </Step>
        <Step>
          <Layer title="Правила и политики" width={1200} />
        </Step>
        <Step>
          <Layer title="Скилы" width={1000} />
        </Step>
        <Step>
          <Layer title="Инженерные практики" width={800} />
        </Step>
      </Steps>
    </div>
    <Caption top={32}>Главный источник контекста: единый источник истины для людей и агентов.</Caption>
  </Frame>
);

const SkillCol = ({ label, title, items }: { label: string; title: string; items: string[] }) => (
  <div style={{ flex: 1, minWidth: 0, background: surface, border: `1px solid ${line}`, borderRadius: 'var(--osd-radius)', padding: '36px 40px' }}>
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--osd-accent)' }}>{label}</div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', margin: '14px 0 28px' }}>{title}</div>
    <ul style={{ margin: 0, paddingLeft: 30, fontSize: 26, lineHeight: 1.45, color: muted, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((t) => (
        <li key={t}>
          {/* @slide-comment id="c-2baf778f" ts="2026-09-18T13:33:39.028Z" text="eyJub3RlIjoi0YPQtNCw0LvQuCJ9" */}{t}</li>
      ))}
    </ul>
  </div>
);
const Skills: Page = () => (
  <Frame title="Скилы — часть нашего harness" gap={56}>
    <div className="rs-steps-row" style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
      <Steps>
        <Step>
          <SkillCol label="берём из сообщества" title="Готовое" items={['superpowers: берём часть, например TDD', 'agent-browser от Vercel', 'skill.sh: независимость от агента']} />
        </Step>
        <Step>
          <SkillCol
            label="пишем сами"
            title="Свои скилы"
            items={['Свои скилы для Playwright', 'Оптимизация путей агента: дебаг, проверки, просмотр логов', 'Кастомные под наш стек на некоторых проектах']}
          />
        </Step>
        <Step>
          <SkillCol
            label="вокруг процесса"
            title="Обвязки OpenSpec"
            items={['Разбиение работы по ролям', 'Создание пирамиды тестирования', 'Экспорт в Confluence', 'Сегментирование спек по доменам', 'Критические вопросы, которые должны быть заданы']}
          />
        </Step>
      </Steps>
    </div>
  </Frame>
);


// AI-шлюз: что закрывает своё решение
const GatewayOwn: Page = () => (
  <Frame title="Свой шлюз: что он нам закрывает" lead="Полноценный корпоративный шлюз на open source компонентах." gap={40}>
    <div className="rs-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <Steps>
        <Step>
          <Card label="вход" title="SSO" text="Корпоративная учётка вместо ручной раздачи виртуальных ключей каждому" accent />
        </Step>
        <Step>
          <Card label="self-service" title="Личный кабинет" text="У каждого своя страница: потребление, лимиты, ключи" />
        </Step>
        <Step>
          <Card label="безопасность" title="Анонимизация" text="PII-детекция, которая качественно работает на русском: пришлось дообучать модели" />
        </Step>
        <Step>
          <Card label="модели" title="Единый API" text="Один вход на все модели и провайдеры для людей и агентов" />
        </Step>
        <Step>
          <Card label="экономия" title="Абьюз подписок 😉" text="Подписки Codex используем «по-чёрному»: роутим их через один шлюз улучшая утилизацию" />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ═══════════════════════════════════════════════════════════════════════════════
// СТРАНИЦЫ, ПЕРЕНЕСЁННЫЕ ИЗ production-transformation
// ═══════════════════════════════════════════════════════════════════════════════

// Автономность: цели индустрии
const Autonomy: Page = () => (
  <Live style={{ padding: `120px ${PAD}px 0` }}>
    <Steps>
      <div className="rs-in">
        <Eyebrow>Куда идёт индустрия</Eyebrow>
        <div style={{ marginTop: 24 }}>
          <Heading size={112}>Автономность</Heading>
        </div>
        <p style={{ fontSize: 40, lineHeight: 1.4, margin: '32px 0 0', maxWidth: 1500 }}>
          Задачи, которые выполняются <strong>полностью</strong> без участия человека.
        </p>
      </div>
      <Step>
        <div style={{ marginTop: 64, borderTop: '4px solid var(--osd-accent)', paddingTop: 28 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: muted, letterSpacing: '0.1em' }}>КРУПНЫЙ ФИНТЕХ · ЦЕЛИ ПО ЦЕХАМ</div>
          <div style={{ fontSize: 36, lineHeight: 1.4, marginTop: 16, maxWidth: 1500 }}>
            От 15 до 50 % автономности в зависимости от бизнес-юнита. На эти цели завязаны премии.
          </div>
          <AutonomyMeter />
        </div>
      </Step>
    </Steps>
    <Footer />
  </Live>
);

// Хендофы дороги: работа стала короче хендофа
const HandoffsExpensive: Page = () => (
  <Live style={{ padding: `100px ${PAD}px 0` }}>
    <Steps>
      <div className="rs-in">
        <Eyebrow>Хендофы дороги</Eyebrow>
        <div style={{ marginTop: 20 }}>
          <Heading size={60}>Работа стала короче хендофа</Heading>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <BeforePlain />
      </div>
      <Step>
        <div style={{ marginTop: 24 }}>
          <AfterPlain />
        </div>
      </Step>
    </Steps>
    <div style={{ display: 'flex', alignItems: 'center', gap: 48, marginTop: 28 }}>
      <LegendItem color={feColor} label="фронтенд" />
      <LegendItem color={beColor} label="бекенд" />
      <LegendItem color={blockerColor} label="блокер / хендоф" stroke />
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 30, fontWeight: 600, maxWidth: 760, lineHeight: 1.35 }}>
        Пока задача идёт от фронтенда к бекенду и обратно, агент уже мог бы её закончить.
      </div>
    </div>
    <Footer />
  </Live>
);

// Хендофы дороги: погружение в задачу
const HandoffsContext: Page = () => (
  <Live style={{ padding: `100px ${PAD}px 0` }}>
    <Steps>
      <div className="rs-in">
        <Eyebrow>Хендофы дороги</Eyebrow>
        <div style={{ marginTop: 20 }}>
          <Heading size={60}>Погружение в задачу плохо сжимается</Heading>
        </div>
      </div>
      <Step>
        <div style={{ marginTop: 16 }}>
          <BeforeContext />
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 24 }}>
          <AfterContext />
        </div>
      </Step>
      <Step>
        <div style={{ display: 'flex', alignItems: 'center', gap: 48, marginTop: 28 }}>
          <LegendItem color={ctxColor} label="погружение в бизнес-логику" />
          <LegendItem color={feColor} label="фронтенд" />
          <LegendItem color={beColor} label="бекенд" />
          <LegendItem color={blockerColor} label="блокер / хендоф" stroke />
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 28, fontWeight: 600, maxWidth: 720, lineHeight: 1.35 }}>
            Каждая передача — это повторное погружение. Дешевле, чтобы фичу целиком вёл один инженер.
          </div>
        </div>
      </Step>
    </Steps>
    <Footer />
  </Live>
);

// Хендофы дороги: шесть против одного
const HandoffsSdlc: Page = () => (
  <Live style={{ padding: `100px ${PAD}px 0` }}>
    <Steps>
      <div className="rs-in">
        <Eyebrow>Хендофы дороги</Eyebrow>
        <div style={{ marginTop: 20 }}>
          <Heading size={60}>Шесть хендофов против одного</Heading>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <SdlcWas />
      </div>
      <Step>
        <div style={{ marginTop: 28 }}>
          <SdlcNow />
        </div>
      </Step>
    </Steps>
    <Footer />
  </Live>
);

// Role-based → Agent-based SDLC
const SdlcShift: Page = () => (
  <Live style={{ padding: `100px ${PAD}px 0` }}>
    <div className="rs-in">
      <Eyebrow>Как меняется SDLC</Eyebrow>
      <div style={{ marginTop: 20 }}>
        <Heading size={60}>Role-based SDLC → Agent-based SDLC</Heading>
      </div>
      <p style={{ fontSize: 30, lineHeight: 1.4, color: muted, margin: '20px 0 0', maxWidth: 1400 }}>
        В SE 2.0 человек меньше пишет строки и больше управляет намерением, контекстом и проверкой.
      </p>
    </div>
    <div className="rs-steps-row" style={{ display: 'flex', gap: 40, marginTop: 40 }}>
      <SdlcPanel title="Software Engineering 1.0 · Role-based SDLC">
        <div style={{ display: 'flex', gap: 6 }}>
          <Chevron label="Idea" color={CHEV.idea} />
          <Chevron label="Req" color={CHEV.req} />
          <Chevron label="Dev" color={CHEV.dev} />
          <Chevron label="Test" color={CHEV.test} />
          <Chevron label="Deploy" color={CHEV.deploy} />
          <Chevron label="Support" color={CHEV.support} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
          <RoleCell label="Product" />
          <RoleCell label="Analyst" />
          <RoleCell label="Developer" />
          <RoleCell label="QA" />
          <RoleCell label="SRE" />
          <RoleCell label="Support" />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Tag text="Потери на передачах работы" tone="bad" />
          <Tag text="AI-сценарии внутри ролей" tone="good" />
          <Tag text="Локальные оптимизации" tone="bad" />
        </div>
      </SdlcPanel>
      <Steps>
        <Step>
          <SdlcPanel title="Software Engineering 2.0 · Agent-based SDLC">
            <div style={{ display: 'flex', gap: 6 }}>
              <Chevron label="Idea" color={CHEV.idea} />
              <Chevron label="Req" color={CHEV.req} />
              <Chevron label="Dev" color={CHEV.dev} />
              <Chevron label="Test" color={CHEV.test} />
              <Chevron label="Deploy" color={CHEV.deploy} />
              <Chevron label="Support" color={CHEV.support} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              <RoleCell label="Product" />
              <RoleCell label="Engineer + агенты" span={4} />
              <RoleCell label="Support" />
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Tag text="Меньше потерь на передачах" tone="good" />
              <Tag text="Быстрее e2e-сценарии" tone="good" />
            </div>
          </SdlcPanel>
        </Step>
      </Steps>
    </div>
    <Footer />
  </Live>
);

// Наша модель: человек на границе
const OurModel: Page = () => (
  <Live style={{ padding: `100px ${PAD}px 0` }}>
    <Steps>
      <div className="rs-in">
        <Eyebrow>tiny team в заказной разработке</Eyebrow>
        <div style={{ marginTop: 20 }}>
          <Heading size={64}>Нужен человек на границе</Heading>
        </div>
        <p style={{ fontSize: 30, lineHeight: 1.4, color: muted, margin: '16px 0 0' }}>
          Мы не внутри продукта: у нас внешние заказчики и договорные отношения. Поэтому граница с заказчиком остаётся за человеком.
        </p>
      </div>
      <div className="rs-steps-row" style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginTop: 32 }}>
        <div
          style={{
            width: 220,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            background: 'var(--osd-bg)',
            border: `2px dashed ${muted}`,
            borderRadius: 'var(--osd-radius)',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 36, fontWeight: 800 }}>Заказчик</div>
          <div style={{ fontSize: 22, color: muted, lineHeight: 1.3 }}>внешний, по договору</div>
        </div>
        <LinkArrow label="договор, сроки, бюджет" both />
        <Step>
          <ModelBlock
            eyebrow="Блок 1 · Front-office"
            title="ПМ и аналитик"
            cols={2}
            stages={
              <>
                <Chevron label="Idea" color={CHEV.idea} />
                <Chevron label="Req" color={CHEV.req} />
              </>
            }
            roles={
              <>
                <RoleCell label="ПМ" hot />
                <RoleCell label="Аналитик" hot />
              </>
            }
            items={['ПМ: договор, сроки, бюджет, ожидания заказчика', 'Аналитик: постановка задачи и приёмка результата', 'Иногда это два человека, иногда один']}
          />
        </Step>
        <LinkArrow label="спека → результат" both />
        <Step>
          <ModelBlock
            eyebrow="Блок 2 · Производство"
            title="Универсальный инженер"
            accent
            cols={4}
            stages={
              <>
                <Chevron label="Req" color={CHEV.req} />
                <Chevron label="Dev" color={CHEV.dev} />
                <Chevron label="Test" color={CHEV.test} />
                <Chevron label="Deploy" color={CHEV.deploy} />
              </>
            }
            roles={<RoleCell label="Инженер + агенты" span={4} />}
            items={['Ведёт задачу целиком: фронт, бекенд, тесты, деплой', 'Управляет агентами, а не пишет руками', 'Отвечает за результат, а не за роль']}
          />
        </Step>
      </div>
    </Steps>
    <Footer />
  </Live>
);


// Раз и в дамки? Нет, по плану
const Damki2: Page = () => (
  <Live style={{ padding: `100px ${PAD}px 0` }}>
    <Steps>
      <div className="rs-in">
        <Eyebrow>Универсальный инженер</Eyebrow>
        <div style={{ marginTop: 20 }}>
          <Heading size={60}>Раз и в дамки? Нет, по плану</Heading>
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        <RealityRow title="План обучения на квартал у каждого, кто растёт в универсального инженера" />
        <Step>
          <RealityRow title="Команды группируем так, чтобы инженеры перекрывали друг друга по компетенциям" />
        </Step>
        <Step>
          <RealityRow title="Границы перехвата ответственности будут расширяться по возможности" />
        </Step>
        <Step>
          <RealityRow title="Инициатива поощряется лидами, но ревью второй ролью на проекте — мастхев" />
        </Step>
        <Step>
          <RealityRow title="Командное взаимообучение на проектах" />
        </Step>
        <Step>
          <RealityRow title="Экспериментально: практики парного программирования" />
        </Step>
      </div>
    </Steps>
    <Footer />
  </Live>
);

// Всем ли нужно меняться?
const NeedToChange: Page = () => (
  <Live style={{ padding: `120px ${PAD}px 0` }}>
    <Steps>
      <div className="rs-in">
        <Eyebrow style={{ fontSize: '29px' }}>Всем ли нужно меняться?</Eyebrow>
        <div style={{ marginTop: 24 }}>
          <Heading size={60}>Моя картина мира на весну 2027</Heading>
        </div>
      </div>
      <div className="rs-stagger rs-slow" style={{ display: 'flex', gap: 40, marginTop: 56 }}>
        <TrendCol title="Узкие роли" dir="down" items={['Через полгода они ещё останутся', 'Людей на них меньше, конкуренция выше']} />
        <TrendCol title="Универсальные инженеры" dir="up" items={['В тренде, спрос растёт', 'Так же будет двигаться и рынок']} />
      </div>
      <Step>
        <div style={{ marginTop: 56, borderTop: '4px solid var(--osd-accent)', paddingTop: 24, fontSize: 34, lineHeight: 1.35 }}>
          Оставаться на старой роли — значит <A>выбирать сужающийся рынок</A>. Команду нужно преобразовывать, а не ждать.
        </div>
      </Step>
    </Steps>
    <Footer />
  </Live>
);


// Мясной прокси
const MeatProxy: Page = () => (
  <Live style={{ padding: `${PAD}px ${PAD}px 0` }}>
    <div style={{ display: 'flex', gap: 80, alignItems: 'center', marginTop: 60 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="rs-in rs-d1" style={{ fontFamily: 'var(--osd-font-display)', fontSize: 112, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em' }}>
          Мясной
          <br />
          <span style={{ color: 'var(--osd-accent)' }}>прокси</span>
        </div>
        <Steps>
          <Step>
            <p style={{ fontSize: 34, lineHeight: 1.45, marginTop: 40, maxWidth: 820 }}>
              Человек, который слепо копирует и пересылает сырой вывод ИИ, не читая, не понимая и не проверяя его.
            </p>
            <p style={{ fontSize: 26, lineHeight: 1.4, color: muted, marginTop: 24 }}>«Meat Proxy» — термин из твита @belikeabhayx, август 2026.</p>
          </Step>
        </Steps>
      </div>
      <img
        className="rs-in rs-d2 rs-pop"
        src={meatProxyImg}
        alt=""
        style={{ width: 820, height: 656, objectFit: 'cover', borderRadius: 'var(--osd-radius)', flexShrink: 0, boxShadow: '0 30px 60px -30px rgba(21,17,31,0.35)' }}
      />
    </div>
    <Footer />
  </Live>
);

// Реакция на мясной прокси (бывшая гифка, перекодирована в mp4)
const MeatProxyGif: Page = () => (
  <Live chrome="bare" style={{ background: dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <video src={meatProxyVideo} autoPlay loop muted playsInline style={{ height: 1000, width: 'auto', borderRadius: 'var(--osd-radius)' }} />
  </Live>
);

// Узкое место переезжает
const BottleneckFlow: Page = () => (
  <Live style={{ padding: `100px ${PAD}px 0` }}>
    <Steps>
      <div className="rs-in">
        <Eyebrow>Главный тезис</Eyebrow>
        <div style={{ marginTop: 20 }}>
          <Heading size={60}>Узкое место переезжает</Heading>
        </div>
        <p style={{ fontSize: 30, lineHeight: 1.4, color: muted, margin: '20px 0 0' }}>Локальное ускорение кода создаёт очередь дальше по потоку.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28 }}>
        <FlowRow idx="01" title="До AI" badge="ограничение: код">
          <FlowNode n="01" label="Постановка" />
          <FlowNode n="02" label="Спека" />
          <FlowNode n="03" label="Код" hot />
          <FlowNode n="04" label="Ревью" />
          <FlowNode n="05" label="Тесты" />
          <FlowNode n="06" label="Релиз" />
          <FlowNode n="07" label="Валидация" />
        </FlowRow>
        <Step>
          <FlowRow idx="02" title="AI в IDE" badge="очередь: ревью + тесты">
            <FlowNode n="01" label="Постановка" />
            <FlowNode n="02" label="Спека" />
            <FlowNode n="03" label="Код" />
            <FlowNode n="04" label="Ревью" hot />
            <FlowNode n="05" label="Тесты" hot />
            <FlowNode n="06" label="Релиз" />
            <FlowNode n="07" label="Валидация" />
          </FlowRow>
        </Step>
        <Step>
          <FlowRow idx="03" title="Agentic SDLC" badge="контур: intent + validation">
            <FlowNode n="01" label="Постановка" hot />
            <FlowNode n="02" label="Спека" />
            <FlowNode n="03" label="Код" />
            <FlowNode n="04" label="Ревью" />
            <FlowNode n="05" label="Тесты" />
            <FlowNode n="06" label="Релиз" />
            <FlowNode n="07" label="Валидация" hot />
          </FlowRow>
        </Step>
      </div>
      <Step>
        <p style={{ fontSize: 30, fontWeight: 600, textAlign: 'center', margin: '24px 0 0' }}>AI не убирает ограничения — он переносит их дальше по потоку.</p>
      </Step>
    </Steps>
    <Footer />
  </Live>
);



// Продукт-инженер: одна роль на весь цикл
const ProductEngineer: Page = () => (
  <Live style={{ padding: `100px ${PAD}px 0` }}>
    <Steps>
      <div className="rs-in">
        <Eyebrow>Экстремал в одном бигтехе</Eyebrow>
        <div style={{ marginTop: 20 }}>
          <Heading size={64}>Продукт-инженер: весь цикл в одной роли</Heading>
        </div>
        <p style={{ fontSize: 30, lineHeight: 1.4, color: muted, margin: '20px 0 0', maxWidth: 1500 }}>
          Следующий шаг после agent-based SDLC: один человек с агентами закрывает путь от идеи до поддержки.
        </p>
      </div>
      <div style={{ marginTop: 28 }}>
        <SdlcPanel title="Software Engineering 2.0 · Product Engineer">
          <div style={{ display: 'flex', gap: 6 }}>
            <Chevron label="Idea" color={CHEV.idea} />
            <Chevron label="Req" color={CHEV.req} />
            <Chevron label="Dev" color={CHEV.dev} />
            <Chevron label="Test" color={CHEV.test} />
            <Chevron label="Deploy" color={CHEV.deploy} />
            <Chevron label="Support" color={CHEV.support} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
            <RoleCell label="Продукт-инженер" span={6} />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Tag text="Ноль хендофов внутри цикла" tone="good" />
            <Tag text="Смысл и результат в одних руках" tone="good" />
            <Tag text="Сеньорный уровень по всему стеку" tone="bad" />
          </div>
        </SdlcPanel>
      </div>
      <Step>
        <div
          style={{
            marginTop: 28,
            background: tint,
            borderLeft: '8px solid var(--osd-accent)',
            borderRadius: '0 var(--osd-radius) var(--osd-radius) 0',
            padding: '24px 40px',
            fontSize: 32,
            lineHeight: 1.4,
            fontWeight: 600,
          }}
        >
          Это не теория: есть компании, которые уже перевели на такую расширенную зону ответственности целые юниты на <A>150+ человек</A>.
        </div>
      </Step>
    </Steps>
    <Footer />
  </Live>
);

// ─── Глава 07: куда идёт индустрия ───────────────────────────────────────────

// Матрица инженерных практик по уровням автономности
type Need = 'base' | 'must' | 'crit' | 'plus' | 'manual' | 'data' | 'wish' | 'none';
const needLabel: Record<Need, string> = {
  base: 'фундамент',
  must: 'обязательно',
  crit: 'критично',
  plus: 'усиливает',
  manual: 'ручной HITL',
  data: 'собирать данные',
  wish: 'желательно',
  none: '—',
};
const NeedChip = ({ need }: { need: Need }) => {
  const strong = need === 'must' || need === 'crit' || need === 'base';
  return (
    <span
      style={{
        display: 'inline-block',
        justifySelf: 'start',
        fontSize: 21,
        fontWeight: strong ? 700 : 500,
        lineHeight: 1,
        padding: '8px 14px',
        borderRadius: 999,
        background: need === 'base' ? accentFill : strong ? tint : 'transparent',
        color: need === 'base' ? '#fff' : strong ? 'var(--osd-accent)' : muted,
        border: strong ? '1px solid transparent' : `1px solid ${line}`,
        opacity: need === 'none' ? 0.5 : 1,
      }}
    >
      {needLabel[need]}
    </span>
  );
};
const PracticeRow = ({ name, l2, l3 }: { name: string; l2: Need; l3: Need }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '760px 1fr 1fr',
      alignItems: 'center',
      gap: 24,
      padding: '3px 28px',
      borderBottom: `1px solid ${line}`,
      fontSize: 25,
      background: surface,
    }}
  >
    <span style={{ fontWeight: 600 }}>{name}</span>
    <NeedChip need={l2} />
    <NeedChip need={l3} />
  </div>
);
const PracticesMatrix: Page = () => (
  <Frame
    title="Инженерные практики по уровням автономности"
    titleSize={56}
    lead="Что нужно закрыть, чтобы выйти с локального агента на облачный runtime."
    gap={16}
  >
    <div className="rs-in rs-d1" style={{ border: `1px solid ${line}`, borderRadius: 'var(--osd-radius)', overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '760px 1fr 1fr',
          gap: 24,
          padding: '10px 28px',
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: muted,
          borderBottom: `1px solid ${line}`,
        }}
      >
        <span>Практика</span>
        <span>L2 · локальный агент</span>
        <span>L3 · облачный runtime</span>
      </div>
      <div className="rs-stagger rs-fast">
        <PracticeRow name="Сквозной SDD" l2="base" l3="base" />
        <PracticeRow name="Quality gates перед merge" l2="plus" l3="must" />
        <PracticeRow name="Observability трейсов" l2="plus" l3="must" />
        <PracticeRow name="Sandbox: эфемерные окружения + изоляция" l2="plus" l3="must" />
        <PracticeRow name="Action Policy / HITL" l2="manual" l3="must" />
        <PracticeRow name="Evals: автотесты агентов" l2="plus" l3="crit" />
        <PracticeRow name="Resource & cost limits" l2="data" l3="must" />
        <PracticeRow name="Multi-agent coordination" l2="none" l3="must" />
        <PracticeRow name="Модельно-независимый harness" l2="wish" l3="crit" />
        <PracticeRow name="AI Gateway (LLM-прокси)" l2="plus" l3="must" />
        <PracticeRow name="Агент с выходом на L3" l2="none" l3="must" />
        <PracticeRow name="Agent-first IDP (платформа)" l2="none" l3="crit" />
      </div>
    </div>
  </Frame>
);

// AI SDLC сейчас: три трека
const Track = ({ n, title, text }: { n: string; title: string; text: string }) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      background: surface,
      border: `1px solid ${line}`,
      borderTop: '6px solid var(--osd-accent)',
      borderRadius: 'var(--osd-radius)',
      padding: '36px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}
  >
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 64, fontWeight: 800, lineHeight: 1, color: 'var(--osd-accent)', letterSpacing: '-0.03em' }}>{n}</div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 38, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{title}</div>
    <div style={{ fontSize: 28, lineHeight: 1.45, color: muted }}>{text}</div>
  </div>
);

// ─── Глава 06: что изменилось ────────────────────────────────────────────────


const Takeaway = ({ n, children }: { n: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', borderTop: '4px solid var(--osd-accent)', paddingTop: 28 }}>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 64, fontWeight: 800, lineHeight: 1, color: 'var(--osd-accent)', flex: 'none', width: 90 }}>{n}</div>
    <div style={{ fontSize: 38, lineHeight: 1.4, fontWeight: 500 }}>
      {children}</div>
  </div>
);

// Финал — Вопросы
const TgIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
);
const Questions: Page = () => (
  <Live chrome="bare" style={{ background: dark }}>
    <PanelBg x={20} y={20} w={982} h={1040} green />
    <img className="rs-in" src={boostLogo} alt="AI BOOST" style={{ position: 'absolute', left: 80, top: 60, height: 92 }} />
    <img className="rs-in" src={partnersWhite} alt="Partners' Club" style={{ position: 'absolute', right: 1920 - 1002 + 60, top: 72, height: 68 }} />
    <div className="rs-in rs-d1" style={{ position: 'absolute', left: 20, width: 982, top: 210, display: 'flex', justifyContent: 'center' }}>
      <SpeakerPhoto size={560} />
    </div>
    <div className="rs-in rs-d1" style={{ position: 'absolute', left: 80, right: 1920 - 1002 + 60, bottom: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div style={{ fontSize: 56, lineHeight: 1.05 }}>
        Иван
        <br />
        Поддубный
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 40 }}>Вебпрактик</div>
        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>CTO</div>
      </div>
    </div>
    <div className="rs-in" style={{ position: 'absolute', left: 1086, top: 80 }}>
      <Heading size={110}>Вопросы?</Heading>
      <div style={{ fontSize: 24, color: muted, textTransform: 'uppercase', marginTop: 20 }}>{TOPIC}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 28, fontSize: 32, color: 'var(--osd-accent)', fontWeight: 700 }}>
        <TgIcon />
        @northleshiy
      </div>
    </div>
    <div className="rs-in rs-d2 rs-pop" style={{ position: 'absolute', left: 1086, top: 400, display: 'flex', alignItems: 'flex-end', gap: 32 }}>
      <img src={qrChannelImg} alt="QR: канал @techlead_stream" style={{ height: 470, width: 'auto', objectFit: 'contain', borderRadius: 24 }} />
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, maxWidth: 260, lineHeight: 1.4 }}>мой канал в Telegram</div>
    </div>
    <div style={{ position: 'absolute', left: 1086, right: 80, bottom: 70, display: 'flex', justifyContent: 'space-between', fontSize: 40, color: '#CDCFCE' }}>
      <span>22-23.10</span>
      <span>Москва</span>
    </div>
  </Live>
);
Questions.transition = breath;

// ═══════════════════════════════════════════════════════════════════════════════
// AAA-conf: 3 вектора развития AI SDLC
// ═══════════════════════════════════════════════════════════════════════════════

// Тезис доклада: три вектора
const ThreeVectors: Page = () => (
  <Frame
    title={
      <>
        3 вектора развития <A>AI SDLC</A>
      </>
    }
    lead="Куда стоит преобразовывать свои процессы. Отставание по любому из векторов тормозит остальные."
    gap={56}
  >
    <div className="rs-steps-row" style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
      <Steps>
        <Step>
          <Track n="01" title="Harness" text="Качество работы агента: контекст, спеки, скилы, проверки и петля обратной связи без дёрганья человека" />
        </Step>
        <Step>
          <Track n="02" title="Трансформация ролей" text="Меньше хендофов, шире зона ответственности инженера. Иначе скорость агентов упирается в людей" />
        </Step>
        <Step>
          <Track n="03" title="Автономность" text="Доля задач, которые проходят целиком без человека. Под неё нужны платформа и инженерные практики" />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// Опрос зала: изменились ли техпроцессы
const PollOption = ({ n, children }: { n: string; children: ReactNode }) => (
  <div style={{ width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 40, padding: '36px 44px', background: surface, border: `1px solid ${line}`, borderRadius: 'var(--osd-radius)' }}>
    <span style={{ fontFamily: 'var(--osd-font-display)', fontSize: 56, fontWeight: 800, color: 'var(--osd-accent)', width: 80, flex: 'none' }}>{n}</span>
    <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.015em' }}>{children}</span>
  </div>
);
const PollChange: Page = () => (
  <Frame title="🙋 Техпроцессы изменились." lead="Поднимите руку:" gap={48}>
    <div className="rs-steps-col" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Steps>
        <Step>
          <PollOption n="1">По-старому уже не будет</PollOption>
        </Step>
        <Step>
          <PollOption n="2">Изменения минимальны</PollOption>
        </Step>
      </Steps>
    </div>
  </Frame>
);

// Серебряной пули нет: время экспериментов
const NoSilverBullet: Page = () => (
  <Live style={{ padding: `140px ${PAD}px 0` }}>
    <div className="rs-in">
      <Eyebrow style={{ fontSize: 28 }}>Для тех, кто за перемены</Eyebrow>
      <div style={{ marginTop: 28 }}>
        <Heading size={112}>
          Серебряной пули <A>нет</A>
        </Heading>
      </div>
    </div>
    <div style={{ marginTop: 72 }}>
      <Steps>
        <Step>
          <Bullet size={40}>Не придёт эксперт с книжкой и опытом «10 лет в 500 корпорациях»</Bullet>
        </Step>
        <Step>
          <div style={{ marginTop: 28 }}>
            <Bullet size={40}>Чтобы успевать за рынком, запускаем свои эксперименты и проверяем гипотезы</Bullet>
          </div>
        </Step>
        <Step>
          <div style={{ marginTop: 28 }}>
            <Bullet size={40}>
              Поэтому ценнее всего <A>реальный опыт</A>: чужие шишки и свежие идеи
            </Bullet>
          </div>
        </Step>
      </Steps>
    </div>
    <Footer />
  </Live>
);

// Наша история: старт 2026 по трём векторам
type Stance = 'focus' | 'think' | 'wait';
const stanceChip: Record<Stance, CSSProperties> = {
  focus: { background: accentFill, color: '#fff', border: '1px solid transparent' },
  think: { background: tint, color: 'var(--osd-accent)', border: '1px solid transparent' },
  wait: { background: 'transparent', color: muted, border: `1px solid ${line}` },
};
const Payoff = ({ level, label }: { level: 1 | 2 | 3; label: string }) => (
  <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: `1px solid ${line}`, display: 'flex', alignItems: 'center', gap: 18 }}>
    <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>Отдача</span>
    <span style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ width: 40, height: 14, borderRadius: 4, background: i <= level ? 'var(--osd-accent)' : line }} />
      ))}
    </span>
    <span style={{ fontSize: 26, fontWeight: 700, color: level === 3 ? 'var(--osd-accent)' : muted }}>{label}</span>
  </div>
);
const VectorStance = ({
  n,
  title,
  sub,
  stance,
  chip,
  text,
  payoff,
}: {
  n: string;
  title: string;
  sub?: string;
  stance: Stance;
  chip: string;
  text: string;
  payoff: ReactNode;
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      background: surface,
      border: `1px solid ${line}`,
      borderTop: `6px solid ${stance === 'wait' ? accentSoft : 'var(--osd-accent)'}`,
      borderRadius: 'var(--osd-radius)',
      padding: '32px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--osd-font-display)', fontSize: 48, fontWeight: 800, color: 'var(--osd-accent)' }}>{n}</span>
      <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 18px', borderRadius: 999, ...stanceChip[stance] }}>
        {chip}
      </span>
    </div>
    <div>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</div>
      {sub && <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--osd-accent)', marginTop: 6 }}>{sub}</div>}
    </div>
    <div style={{ fontSize: 27, lineHeight: 1.45, color: muted }}>{text}</div>
    {payoff}
  </div>
);
const Start2026: Page = () => (
  <Frame title="Начало 2026: где мы стояли" lead="Все разработчики уже пишут код через AI. Куда дальше?" gap={44}>
    <div className="rs-steps-row" style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
      <Steps>
        <Step>
          <VectorStance
            n="01"
            title="Harness"
            sub="во все текущие роли"
            stance="focus"
            chip="фокус"
            text="Разработка, QA, аналитика на одном harness. Сначала стабилизируем качество"
            payoff={<Payoff level={3} label="быстро" />}
          />
        </Step>
        <Step>
          <VectorStance
            n="02"
            title="Трансформация ролей"
            stance="wait"
            chip="не рискнули"
            text="Рискованно: мало реального опыта. Массовые эксперименты в России — только в H1 2026"
            payoff={<Payoff level={1} label="долго + риск" />}
          />
        </Step>
        <Step>
          <VectorStance
            n="03"
            title="Автономность"
            stance="think"
            chip="думали"
            text="Понимали, что нужно. Но строить платформу сложно: продвинулись недалеко"
            payoff={<Payoff level={1} label="долго" />}
          />
        </Step>
      </Steps>
    </div>
    <Steps>
      <Step>
        <Caption top={40}>Ставка на самую быструю отдачу: качаем harness в текущих ролях, роли почти не трогаем.</Caption>
      </Step>
    </Steps>
  </Frame>
);

// ─── Глава 01: Harness ───────────────────────────────────────────────────────
const Div01 = dividerPage('01', 'Harness', 'Первые полгода 2026: стабилизируем качество, которое выдаёт агент, прежде чем трогать роли');

// Контекст vs реализация: куда вкладывались
const LayerCard = ({ eyebrow, title, items, focus, note }: { eyebrow: string; title: string; items: string[]; focus?: boolean; note: ReactNode }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
      background: focus ? tint : 'transparent',
      border: focus ? '3px solid var(--osd-accent)' : `2px dashed ${accentSoft}`,
      borderRadius: 'var(--osd-radius)',
      padding: '32px 40px',
      boxShadow: focus ? '0 28px 56px -28px rgba(0,0,0,0.5)' : 'none',
      color: focus ? 'var(--osd-text)' : muted,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {focus && (
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: 28,
          background: '#fff',
          color: dark,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '8px 16px',
          borderRadius: 999,
        }}
      >
        наш фокус
      </div>
    )}
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: focus ? 'var(--osd-accent)' : muted }}>{eyebrow}</div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 48, fontWeight: 800, letterSpacing: '-0.025em', margin: '10px 0 22px', color: focus ? 'var(--osd-text)' : muted }}>
      {title}
    </div>
    <ul style={{ margin: 0, paddingLeft: 30, fontSize: 30, lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
    <div
      style={{
        marginTop: 'auto',
        paddingTop: 24,
        borderTop: `1px solid ${line}`,
        fontSize: 28,
        lineHeight: 1.35,
        fontWeight: 700,
        color: focus ? 'var(--osd-accent)' : muted,
      }}
    >
      {note}
    </div>
  </div>
);
const ContextVsImpl: Page = () => (
  <Frame title="Мы не упарывались в слой реализации" lead="Конец 2025: мода строить сложные мультиагентные конвейеры." gap={48}>
    <div className="rs-steps-row" style={{ display: 'flex', alignItems: 'stretch' }}>
      <div style={{ flex: 1.2, minWidth: 0, display: 'flex' }}>
        <LayerCard
          eyebrow="Что делаем"
          title="Слой контекста"
          items={['Спеки и намерение: SDD', 'Контекст проекта и кода', 'Трассировка смысла']}
          note="Остаётся и накапливается"
          focus
        />
      </div>
      <Steps>
        <Step>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ArrowRight width={96} />
            <LayerCard
              eyebrow="Как делаем"
              title="Слой реализации"
              items={['Оркестрация мультиагентов', 'Декомпозиция и параллельные прогоны']}
              note="Стал commodity: его съедают растущие возможности моделей"
            />
          </div>
        </Step>
      </Steps>
    </div>
    <Steps>
      <Step>
        <div
          style={{
            marginTop: 40,
            background: tint,
            borderLeft: '8px solid var(--osd-accent)',
            borderRadius: '0 var(--osd-radius) var(--osd-radius) 0',
            padding: '24px 40px',
            fontSize: 34,
            lineHeight: 1.4,
            fontWeight: 600,
          }}
        >
          Поэтому первым фокусом harness стал <A>SDD</A>: дать агенту контекст, а не строить ему конвейер.
        </div>
      </Step>
    </Steps>
  </Frame>
);

// Из чего выбирали SDD-фреймворк
const Candidates: Page = () => (
  <Frame title="Из чего выбирали" lead="Типовые фреймворки сквозного SDD и их популярность на GitHub*" gap={56}>
    <div className="rs-steps-row" style={{ display: 'flex', gap: 32 }}>
      <Steps>
        <Step>
          <Card label="★ ~90k" title="GitHub Spec Kit" text="Флагман от GitHub, широкая дистрибуция и экосистема" />
        </Step>
        <Step>
          <Card label="★ ~49k" title="BMAD-METHOD" text="Агентные роли, «команда агентов» на весь цикл" />
        </Step>
        <Step>
          <Card label="★ ~58k" title="OpenSpec" text="Простой вход, два состояния контекста, brownfield-идеология" accent badge="наш выбор" />
        </Step>
      </Steps>
    </div>
    <div style={{ fontSize: 22, color: muted, marginTop: 40 }}>* порядок звёзд GitHub, середина 2026, цифры ориентировочные</div>
  </Frame>
);

// OpenSpec как база harness → свой стандарт
const OpenSpecBase: Page = () => (
  <Frame title="OpenSpec: основа harness из коробки" lead="Большую часть даёт OpenSpec. От его базового флоу мы построили свой стандарт работы с harness." gap={48}>
    <div className="rs-steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 96px 1fr', alignItems: 'stretch' }}>
      <Steps>
        <Step>
          <SkillCol
            label="из коробки"
            title="OpenSpec"
            items={['Базовый флоу: explore → propose → apply → archive', 'Набор скилов и команд для агента', 'Два состояния контекста: changes и specs']}
          />
        </Step>
        <Step>
          <ArrowRight width={96} />
        </Step>
        <Step>
          <SkillCol
            label="достроили сами"
            title="Стандарт компании"
            items={['Флоу через все роли: аналитик, разработчик, QA', 'Свои скилы и обвязки вокруг процесса', 'Регламент: что через change, что нет', 'Платформа: мета-репо, шлюз, spek']}
          />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// Код-блок
const Code = ({ children, size = 27 }: { children: string; size?: number }) => (
  <pre
    style={{
      margin: 0,
      background: '#020A08',
      border: `1px solid ${line}`,
      color: '#D4EFE2',
      fontFamily: mono,
      fontSize: size,
      lineHeight: 1.5,
      padding: '36px 44px',
      borderRadius: 'var(--osd-radius)',
      whiteSpace: 'pre',
    }}
  >
    {children}
  </pre>
);

// Мета-репозиторий
const MetaRepo: Page = () => (
  <Frame title="Мета-репозиторий" lead="Мультирепо как монорепо: весь harness и OpenSpec в одной репе." gap={40}>
    <div className="rs-in rs-d1">
      <Code size={26}>{`meta-repo/                 # наш harness + OpenSpec
├── Makefile               # make up → клонирует все репы
├── agents.md              # карта: что за проект и куда идти
├── openspec/              # спеки и changes (источник истины)
├── frontend/              # монолит · фронт   ← отдельный репозиторий
│   └── agents.md          # свой контекст, работает рекурсивно
├── backend/               # монолит · бэк     ← отдельный репозиторий
│   └── agents.md
├── service-auth/          # сервис
│   └── agents.md
└── service-billing/       # микросервис
    └── agents.md`}</Code>
    </div>
  </Frame>
);

const HarnessDirections: Page = () => (
  <Frame title="Куда мы развивали harness" lead="Не один инструмент, а набор направлений вокруг агента." gap={40}>
    <div className="rs-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <Steps>
        <Step>
          <Card label="фундамент" title="Сквозной SDD" text="Спеки в репозитории: единый источник истины для людей и агентов" accent />
        </Step>
        <Step>
          <Card label="контекст" title="Мета-репозиторий" text="Мультирепо собрано в одно дерево с картой agents.md" />
        </Step>
        <Step>
          <Card label="смысл" title="Трассировка" text="Строка кода → коммит → change: зачем код писался" />
        </Step>
        <Step>
          <Card label="навыки" title="Скилы" text="Из сообщества, свои и обвязки вокруг процесса" />
        </Step>
        <Step>
          <Card label="инфраструктура" title="AI-шлюз" text="SSO, лимиты, анонимизация PII, единый API к моделям" />
        </Step>
        <Step>
          <Card label="прозрачность" title="spek" text="Свой сервис: поиск, статус и связи changes" />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ─── Глава 02: Автономность ──────────────────────────────────────────────────
const Div03 = dividerPage('03', 'Автономность', 'Вектор, который мы недооценили: без цели по автономности каждый строит свой мост');

const BridgesLesson: Page = () => (
  <Shout eyebrow="Урок">
    Harness без цели по автономности — это <A>много локальных мостов</A>
  </Shout>
);

// ─── Глава 02: Трансформация ролей ───────────────────────────────────────────
const Div02 = dividerPage('02', 'Трансформация ролей', 'Три урока, которые заставили нас начать перестраивать роли');

// H1 2026: роли не меняли, но harness — в каждую роль
const RolesH1: Page = () => (
  <Frame title={<>Harness — в <A>каждую</A> роль</>} lead="Первая половина 2026: роли не преобразовывали, структуру команды не трогали." gap={56}>
    <div className="rs-steps-row" style={{ display: 'flex', gap: 32 }}>
      <Steps>
        <Step>
          <HopRole label="Аналитик" />
        </Step>
        <Step>
          <HopRole label="Разработчик" />
        </Step>
        <Step>
          <HopRole label="Тестировщик" />
        </Step>
      </Steps>
    </div>
    <Steps>
      <Step>
        <div style={{ display: 'flex', justifyContent: 'space-around', color: accentSoft, fontSize: 44, lineHeight: 1, margin: '14px 0' }}>
          <span>↓</span>
          <span>↓</span>
          <span>↓</span>
        </div>
        <div
          style={{
            height: 110,
            borderRadius: 'var(--osd-radius)',
            background: accentFill,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--osd-font-display)',
            fontSize: 38,
            fontWeight: 700,
            boxShadow: '0 24px 48px -24px rgba(4,171,106,0.55)',
          }}
        >
          Общий контекст: спеки и harness
        </div>
      </Step>
      <Step>
        <Caption top={48}>Каждая роль работает с общим контекстом, а не живёт в своём изолированном мире.</Caption>
      </Step>
    </Steps>
  </Frame>
);

// Обзор трёх уроков
const LessonsOverview: Page = () => (
  <Frame title="Три урока" lead="Что показали полгода harness в текущих ролях." gap={56}>
    <div className="rs-steps-row" style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
      <Steps>
        <Step>
          <Track n="01" title="Тестировщики" text="e2e отдельным шагом QA рвёт цикл агента" />
        </Step>
        <Step>
          <Track n="02" title="Хендофы" text="Работа с агентом короче передачи между людьми, а уникальной работы в роли всё меньше" />
        </Step>
        <Step>
          <Track n="03" title="Еженедельный разбор" text="Большая часть проблем проектов — в передаче контекста между ролями" />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// Вводная страница урока
const LessonIntro = ({ n, title, sub }: { n: string; title: ReactNode; sub: ReactNode }) => (
  <Live style={{ padding: `0 ${PAD}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div className="rs-in">
      <Eyebrow style={{ fontSize: 30 }}>Урок {n} из 3</Eyebrow>
    </div>
    <div className="rs-in rs-d1" style={{ marginTop: 28, borderLeft: '10px solid var(--osd-accent)', paddingLeft: 56 }}>
      <Heading size={104}>{title}</Heading>
      <div style={{ fontSize: 38, lineHeight: 1.4, color: muted, marginTop: 28, maxWidth: 1300 }}>{sub}</div>
    </div>
    <Footer />
  </Live>
);
const Lesson1: Page = () => (
  <LessonIntro n="1" title="Тестировщики" sub="Думали, что e2e останутся отдельным шагом QA. Оказалось, это рвёт цикл агента." />
);
const Lesson2: Page = () => <LessonIntro n="2" title="Хендофы" sub="Работа с агентом стала короче, чем передача задачи между людьми." />;
const Lesson3: Page = () => (
  <LessonIntro n="3" title="Узкие роли" sub="Агент воспроизводит всё больше работы в каждой функции." />
);
const Lesson4: Page = () => (
  <LessonIntro n="3" title="Еженедельный разбор" sub="Каждую неделю разбираем проблемы проектов на встрече по SDD и harness." />
);

// Подвывод урока
const LessonTakeaway = ({ n, children }: { n: string; children: ReactNode }) => (
  <Shout eyebrow={<span style={{ fontSize: 30 }}>Вывод урока {n}</span>} size={72}>
    {children}
  </Shout>
);
const Takeaway1: Page = () => (
  <LessonTakeaway n="1">
    e2e — часть цикла агента. <A>Выносить его в отдельную роль</A> значит рвать цикл
  </LessonTakeaway>
);
const Takeaway2: Page = () => (
  <LessonTakeaway n="2">
    <A>Хендофы дороги</A>: работа с агентом короче передачи между людьми
  </LessonTakeaway>
);
const Takeaway3: Page = () => (
  <LessonTakeaway n="2">
    Ценность узких ролей размывается. Без уникальной работы человек становится <A>прокси</A>
  </LessonTakeaway>
);
const Takeaway4: Page = () => (
  <LessonTakeaway n="3">
    Тратим много сил на отладку процессов в старых ролях. Ощущение, что строим <A>мёртвый процесс</A> и решаем проблемы, которые можно не решать
  </LessonTakeaway>
);

// Урок 3: кейс «доработали требование»
const HopRole = ({ label, hot, ghost, h = 120, size = 32 }: { label: string; hot?: boolean; ghost?: boolean; h?: number; size?: number }) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      width: '100%',
      height: h,
      boxSizing: 'border-box',
      borderRadius: 'var(--osd-radius)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontFamily: 'var(--osd-font-display)',
      fontSize: size,
      fontWeight: 700,
      background: hot ? accentFill : ghost ? 'transparent' : surface,
      color: hot ? '#fff' : ghost ? muted : 'var(--osd-text)',
      border: `2px ${ghost ? 'dashed' : 'solid'} ${hot ? 'transparent' : ghost ? muted : line}`,
    }}
  >
    {label}
  </div>
);
const WeeklySync: Page = () => (
  <Frame title="Пример боли" lead="Проблем много, но большая часть — в передаче контекста между ролями." gap={44}>
    <div className="rs-in rs-d1" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>
      Кейс: заказчик пришёл с корректировкой в середине цикла
    </div>
    <div className="rs-in rs-d1" style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
      <HopRole label="Заказчик" ghost size={28} />
      <ArrowRight width={64} />
      <HopRole label="Аналитик" hot size={28} />
      <ArrowRight width={64} />
      <div style={{ flex: 1.3, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
        <div style={{ position: 'absolute', top: -34, left: 0, right: 0, textAlign: 'center', fontSize: 20, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--osd-accent)' }}>
          параллельно
        </div>
        <HopRole label="Фронтендер" h={56} size={24} />
        <HopRole label="Бэкендер" h={56} size={24} />
      </div>
      <ArrowRight width={64} />
      <HopRole label="Тестировщик" size={28} />
      <ArrowRight width={64} />
      <HopRole label="Ревью / релиз" size={28} />
    </div>
    <Steps>
      <Step>
        <div
          style={{
            marginTop: 20,
            height: 64,
            border: '3px dashed var(--osd-accent)',
            borderTop: 'none',
            borderRadius: '0 0 28px 28px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <span style={{ background: 'var(--osd-bg)', padding: '0 20px', marginBottom: -20, fontSize: 28, fontWeight: 700, color: 'var(--osd-accent)' }}>
            ↩ правку надо заново провести через все роли
          </span>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 64 }}>
          <BulletList gap={20}>
            <Bullet size={34}>Много переключений контекста ради иногда очень маленького изменения</Bullet>
            <Bullet size={34}>Месяцами отлаживаем новые процессы передачи контекста в хендофах. И до сих пор</Bullet>
          </BulletList>
        </div>
      </Step>
    </Steps>
  </Frame>
);

const LessonsConclusion: Page = () => (
  <Frame title="Выводы из уроков" gap={48}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Steps>
        <Step>
          <Takeaway n="1">
            <A>Хендофы дороги</A>: работа с агентом короче передачи между людьми
          </Takeaway>
        </Step>
        <Step>
          <Takeaway n="2">
            <A>Старые роли нецелесообразны</A>: цикл агента рвётся на их границах
          </Takeaway>
        </Step>
        <Step>
          <Takeaway n="3">
            AI SDLC на старых ролях <A>неминуемо приведёт</A> к той же проблеме, с которой столкнулись мы
          </Takeaway>
        </Step>
        <Step>
          <Takeaway n="4">
            А точно ли стоит <A>тратить много сил</A> на внедрение в старый процесс?
          </Takeaway>
        </Step>
      </Steps>
    </div>
  </Frame>
);

// А что на рынке
// Каждая роль агентизируется: человек между моделью и следующей ролью
const AGENT_ROLES = ['Аналитик', 'Разработчик', 'Тестировщик'];
const AGENT_STEPS = ['Погружение в контекст', 'Постановка задачи ИИ', 'Валидация результата'];
const AgentizedDiagram = () => {
  const W = 1640;
  const cardW = 440;
  const gapX = (W - cardW * 3) / 2;
  const modelH = 110;
  const cardY = 240;
  const rowH = 78;
  const cardH = 100 + rowH * 3 + 20;
  const handoffY = cardY + 100 + rowH * 1.5;
  return (
    <svg width={W} height={cardY + cardH + 4} viewBox={`0 0 ${W} ${cardY + cardH + 4}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <marker id="ag-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill={accentSoft} />
        </marker>
        <marker id="ag-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill={accentFill} />
        </marker>
      </defs>
      {/* Модель */}
      <rect x={0} y={0} width={W} height={modelH} rx={24} fill={accentFill} />
      <text x={W / 2} y={modelH / 2 + 4} textAnchor="middle" dominantBaseline="middle" fill="#fff" style={{ fontFamily: 'var(--osd-font-display)', fontSize: 38, fontWeight: 800 }}>
        LLM · большая часть работы
      </text>
      {AGENT_ROLES.map((role, i) => {
        const x = i * (cardW + gapX);
        const cx = x + cardW / 2;
        return (
          <g key={role}>
            {/* задача вверх, результат вниз */}
            <line x1={cx - 60} y1={cardY - 6} x2={cx - 60} y2={modelH + 10} stroke={accentSoft} strokeWidth={4} markerEnd="url(#ag-arrow)" />
            <line x1={cx + 60} y1={modelH + 6} x2={cx + 60} y2={cardY - 10} stroke={accentSoft} strokeWidth={4} markerEnd="url(#ag-arrow)" />
            <text x={cx - 76} y={(modelH + cardY) / 2 + 6} textAnchor="end" fill={muted} style={{ fontSize: 22, fontWeight: 600 }}>
              задача
            </text>
            <text x={cx + 76} y={(modelH + cardY) / 2 + 6} textAnchor="start" fill={muted} style={{ fontSize: 22, fontWeight: 600 }}>
              результат
            </text>
            {/* карточка роли */}
            <rect x={x} y={cardY} width={cardW} height={cardH} rx={20} fill={surface} stroke={line} strokeWidth={2} />
            <text x={x + 32} y={cardY + 58} fill={ink} style={{ fontFamily: 'var(--osd-font-display)', fontSize: 34, fontWeight: 800 }}>
              {role}
            </text>
            {AGENT_STEPS.map((step, j) => {
              const y = cardY + 90 + j * rowH;
              return (
                <g key={step}>
                  <rect x={x + 20} y={y} width={cardW - 40} height={rowH - 12} rx={14} fill={tint} />
                  <circle cx={x + 56} cy={y + (rowH - 12) / 2} r={18} fill={accentFill} />
                  <text x={x + 56} y={y + (rowH - 12) / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="#fff" style={{ fontSize: 20, fontWeight: 800 }}>
                    {j + 1}
                  </text>
                  <text x={x + 90} y={y + (rowH - 12) / 2 + 1} dominantBaseline="middle" fill={ink} style={{ fontSize: 25, fontWeight: 600 }}>
                    {step}
                  </text>
                </g>
              );
            })}
            {/* передача дальше */}
            {i < AGENT_ROLES.length - 1 && (
              <g>
                <line
                  x1={x + cardW + 8}
                  y1={handoffY}
                  x2={x + cardW + gapX - 12}
                  y2={handoffY}
                  strokeWidth={4}
                  strokeDasharray="10 8"
                  markerEnd="url(#ag-arrow-accent)"
                  style={{ stroke: 'var(--osd-accent)' }}
                />
                <text x={x + cardW + gapX / 2} y={handoffY - 18} textAnchor="middle" style={{ fill: 'var(--osd-accent)', fontSize: 22, fontWeight: 700 }}>
                  передача
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
const AgentizedRoles: Page = () => (
  <Frame title="Уникальной работы в роли всё меньше" lead="Агент воспроизводит всё больше работы в каждой функции. Это размывает ценность узких ролей." gap={40}>
    <div className="rs-in rs-d1">
      <AgentizedDiagram />
    </div>
  </Frame>
);

// ─── Автономность: платформа ─────────────────────────────────────────────────
const PathStep = ({ label }: { label: string }) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      height: 84,
      boxSizing: 'border-box',
      borderRadius: 16,
      background: surface,
      border: `2px solid ${accentSoft}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 700,
      padding: '0 10px',
    }}
  >
    {label}
  </div>
);
const AutonomyPlatform: Page = () => (
  <Frame title="Автономность не живёт на ноутбуке" lead="На локальной машине агент зависит от человека: его сессии, доступов и внимания." gap={48}>
    <div className="rs-in rs-d1" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '28px 36px', border: `2px dashed ${muted}`, borderRadius: 'var(--osd-radius)', color: muted }}>
      <span style={{ fontFamily: 'var(--osd-font-display)', fontSize: 34, fontWeight: 800, flex: 'none' }}>Ноутбук разработчика</span>
      <span style={{ fontSize: 28 }}>агент ждёт человека · окружение у каждого своё · результат не воспроизвести</span>
    </div>
    <Steps>
      <Step>
        <div style={{ marginTop: 36, background: tint, border: '3px solid var(--osd-accent)', borderRadius: 'var(--osd-radius)', padding: '28px 36px' }}>
          <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 34, fontWeight: 800, marginBottom: 22 }}>
            Платформа закрывает <A>полный путь</A>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PathStep label="Задача" />
            <span style={{ color: accentSoft, fontSize: 32 }}>→</span>
            <PathStep label="Эфемерное окружение" />
            <span style={{ color: accentSoft, fontSize: 32 }}>→</span>
            <PathStep label="Агент" />
            <span style={{ color: accentSoft, fontSize: 32 }}>→</span>
            <PathStep label="Quality gates" />
            <span style={{ color: accentSoft, fontSize: 32 }}>→</span>
            <PathStep label="Ревью" />
            <span style={{ color: accentSoft, fontSize: 32 }}>→</span>
            <PathStep label="Релиз" />
          </div>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 36, fontSize: 38, fontWeight: 700, lineHeight: 1.35 }}>
          Путь в автономность — это <A>в первую очередь платформа</A>
        </div>
      </Step>
    </Steps>
  </Frame>
);

const NoTurnkey: Page = () => (
  <Frame title="Готовых платформ под ключ нет" lead="Решения закрывают отдельные куски. Собирать целое придётся самим." gap={40}>
    <div className="rs-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <Steps>
        <Step>
          <Card label="среда" title="Эфемерные окружения" text="Sandbox есть, а поднять под задачу окружение под ваш стек — нет" accent />
        </Step>
        <Step>
          <Card label="контроль" title="Action Policy" text="Что агенту можно без человека, а где нужен HITL" />
        </Step>
        <Step>
          <Card label="качество" title="Evals и gates" text="Автотесты агентов и проверки перед merge" />
        </Step>
        <Step>
          <Card label="прозрачность" title="Observability" text="Трейсы: что агент делал и почему" />
        </Step>
        <Step>
          <Card label="деньги" title="Лимиты" text="Бюджеты на ресурсы и токены" />
        </Step>
        <Step>
          <Card label="оркестрация" title="Интеграции" text="Трекер, репозитории, CI/CD и ваш harness" />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// Централизованная петля обратной связи
const LoopNode = ({ label, hot }: { label: string; hot?: boolean }) => (
  <div
    style={{
      padding: '22px 30px',
      borderRadius: 'var(--osd-radius)',
      background: hot ? accentFill : surface,
      color: hot ? '#fff' : 'var(--osd-text)',
      border: `2px solid ${hot ? 'transparent' : line}`,
      fontFamily: 'var(--osd-font-display)',
      fontSize: 30,
      fontWeight: 700,
      textAlign: 'center',
    }}
  >
    {label}
  </div>
);
const CentralLoop: Page = () => (
  <Frame title="Централизованная петля обратной связи" lead="Задачи идут через платформу — ошибки агента видны в одном месте, и harness прокачивается быстрее." gap={48}>
    <div style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
      <div className="rs-in rs-d1" style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gridTemplateRows: 'auto 60px auto', alignItems: 'center', justifyItems: 'stretch' }}>
        <LoopNode label="Задачи команды" />
        <span style={{ color: accentSoft, fontSize: 40, textAlign: 'center' }}>→</span>
        <LoopNode label="Платформа" hot />
        <span style={{ color: accentSoft, fontSize: 40, textAlign: 'center' }}>↑</span>
        <span />
        <span style={{ color: accentSoft, fontSize: 40, textAlign: 'center' }}>↓</span>
        <LoopNode label="Harness лучше" />
        <span style={{ color: accentSoft, fontSize: 40, textAlign: 'center' }}>←</span>
        <LoopNode label="Трейсы и evals" />
      </div>
      <Steps>
        <Step>
          <div style={{ flex: 'none', width: 560, borderLeft: '8px solid var(--osd-accent)', paddingLeft: 40 }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>Кейс одной компании</div>
            <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 160, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--osd-accent)', marginTop: 16 }}>80%</div>
            <div style={{ fontSize: 32, lineHeight: 1.4, marginTop: 16 }}>
              задач через платформу — и <b>значимый прирост</b> качества harness
            </div>
          </div>
        </Step>
      </Steps>
    </div>
  </Frame>
);

const MarketTitle: Page = () => <Shout size={128}>А что на рынке?</Shout>;

const MarketNow: Page = () => (
  <Frame title="Что происходит на рынке" lead="В первом полугодии 2026 команды начали массово перестраивать роли." gap={56}>
    <div className="rs-steps-row" style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
      <Steps>
        <Step>
          <Track n="01" title="Tiny team" text="Маленькая автономная команда: каждый закрывает широкий срез работы" />
        </Step>
        <Step>
          <Track n="02" title="Схлопывание ролей" text="Аналитика, разработка и QA сходятся в одного инженера с агентами" />
        </Step>
        <Step>
          <Track n="03" title="Продукт-инженер" text="Один человек с агентами ведёт путь от идеи до поддержки" />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ─── Финал ───────────────────────────────────────────────────────────────────

// Заголовок финала
const ConclusionsTitle: Page = () => (
  <Live chrome="bare" style={{ padding: `0 ${PAD}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <PanelBg x={20} y={20} w={1880} h={1040} green />
    <img className="rs-static" src={boostLogo} alt="AI BOOST" style={{ position: 'absolute', left: 80, top: 60, height: 92 }} />
    <img className="rs-static" src={partnersWhite} alt="Partners' Club" style={{ position: 'absolute', right: 80, top: 72, height: 68 }} />
    <div className="rs-in">
      <Heading size={180}>Выводы</Heading>
    </div>
  </Live>
);
ConclusionsTitle.transition = breath;

// Личная стратегия для тех, кто на узкой роли
const PersonalStrategy: Page = () => (
  <Frame title="Ваша личная стратегия" lead="Для тех, кто сейчас на узкой роли: на какой вектор вы ставите?" gap={56}>
    <div className="rs-steps-row" style={{ display: 'flex', gap: 40, alignItems: 'stretch' }}>
      <Steps>
        <Step>
          <Card label="остаться" title="Старые процессы" text="Такие компании останутся. Но конкуренция за места в них будет выше." />
        </Step>
        <Step>
          <Card
            label="сделать ставку"
            title="Универсальный инженер или FDE"
            text="Хотите вернуться в 2019-й, когда за вами охотились и был рынок кандидата? Эта ставка даст больше уверенности в будущем."
            accent
          />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// Если бы вернуться на полгода назад
const LookBack: Page = () => (
  <Live style={{ padding: `0 ${PAD}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div className="rs-in">
      <Eyebrow style={{ fontSize: 30 }}>Если бы вернуться на полгода назад</Eyebrow>
    </div>
    <div className="rs-in rs-d1" style={{ marginTop: 36, borderLeft: '10px solid var(--osd-accent)', paddingLeft: 56 }}>
      <Heading size={76} caps={false}>
        С текущими знаниями я бы сразу запустил <A>трансформацию ролей и переобучение</A>. Параллельно с harness
      </Heading>
    </div>
    <Steps>
      <Step>
        <div style={{ marginTop: 56, paddingLeft: 66, fontSize: 38, lineHeight: 1.4, color: muted }}>
          Некоторые компании на рынке пошли этим путём — <span style={{ color: 'var(--osd-text)', fontWeight: 700 }}>и преуспели</span>.
        </div>
      </Step>
    </Steps>
    <Footer />
  </Live>
);

const VectorTakeaways: Page = () => (
  <Frame title="Развивайте все три вектора" gap={64}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
      <Steps>
        <Step>
          <Takeaway n="1">
            <A>Harness</A> — фундамент: сквозной SDD и петля обратной связи, иначе агент гадает
          </Takeaway>
        </Step>
        <Step>
          <Takeaway n="2">
            Перестраивайте <A>команду</A> под агентов: сокращайте хендофы, не держитесь за старые роли
          </Takeaway>
        </Step>
        <Step>
          <Takeaway n="3">
            Ставьте цель по <A>автономности</A> заранее: она задаёт платформу и практики, а не наоборот
          </Takeaway>
        </Step>
      </Steps>
    </div>
  </Frame>
);

export const meta: SlideMeta = {
  title: '3 вектора развития AI SDLC',
  createdAt: '2026-09-25T17:30:00.000Z',
};

export default [
  Cover,
  About,
  Clients,
  PollChange,
  NoSilverBullet,
  ThreeVectors,
  // Наша история
  Adoption100,
  PathTo100,
  Start2026,
  // 01 — Harness
  Div01,
  HarnessDirections,
  ContextVsImpl,
  Candidates,
  OpenSpecBase,
  HarnessStack,
  MetaRepo,
  Skills,
  GatewayOwn,
  BottleneckFlow,
  // 02 — Трансформация ролей
  Div02,
  RolesH1,
  Bridge,
  ManagementMistake,
  LessonsOverview,
  Lesson1,
  FlowAnti,
  FlowE2E,
  FlowV1,
  FlowV2,
  Takeaway1,
  Lesson2,
  HandoffsExpensive,
  HandoffsContext,
  HandoffsSdlc,
  AgentizedRoles,
  MeatProxy,
  MeatProxyGif,
  Takeaway2,
  Lesson4,
  WeeklySync,
  Takeaway4,
  LessonsConclusion,
  // А что на рынке
  MarketTitle,
  MarketNow,
  SdlcShift,
  ProductEngineer,
  OurModel,
  Damki2,
  NeedToChange,
  // 03 — Автономность
  Div03,
  Autonomy,
  Fabrica,
  BusFactor,
  AutonomyPlatform,
  NoTurnkey,
  PracticesMatrix,
  CentralLoop,
  // Финал
  ConclusionsTitle,
  LookBack,
  VectorTakeaways,
  PersonalStrategy,
  Questions,
] satisfies Page[];
