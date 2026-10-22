import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { Step, Steps, useIsActivePage, useSlidePageNumber } from '@open-slide/core';

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
import qrChannelImg from './assets/qr-techlead-stream.png';
import spekListImg from './assets/spek-list.png';
import langfuseLogo from './assets/langfuse.svg';

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
.kd-features > [data-osd-step] { grid-column: span 2; }
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
  noLogos,
}: {
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
  chrome?: Chrome;
  noLogos?: boolean;
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
      {chrome !== 'bare' && !noLogos && <Logos />}
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
      <span />
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
// wide — страница без логотипов, заголовок занимает всю ширину шапки.
const HeaderTitle = ({ children, size = 60, wide }: { children: ReactNode; size?: number; wide?: boolean }) => (
  <div
    className="rs-in"
    style={{ position: 'absolute', left: 87, top: 20, width: wide ? 1900 - 87 - 80 : 1880 - 67 - 640, height: HEADER_H, display: 'flex', alignItems: 'center' }}
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
  wide,
}: {
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  gap?: number;
  titleSize?: number;
  wide?: boolean;
}) => (
  <Live chrome="frame" noLogos={wide} style={{ padding: `${BODY_TOP + 54}px ${PAD}px 0` }}>
    <HeaderTitle size={titleSize} wide={wide}>{title}</HeaderTitle>
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
    <div className="rs-in rs-d1" style={{ position: 'absolute', left: 87, top: 470, width: 1110 }}>
      <Heading size={70}>
        Внедрение SDD в команды
        <br />
        и производство
        <br />
        на старых проектах
      </Heading>
      <div style={{ fontSize: 38, lineHeight: 1.4, color: 'rgba(255,255,255,0.8)', marginTop: 40 }}>OpenSpec · Платформа · Масштаб · Роли</div>
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
  <Live chrome="frame" noLogos>
    <HeaderTitle size={56} wide>
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

// Что такое SDD: спека — контейнер из трёх блоков, агент делает из неё код.
const SpecBlock = ({ children }: { children: ReactNode }) => (
  <div style={{ background: surface, border: `2px solid ${line}`, borderRadius: 16, padding: '0 32px', height: 96, display: 'flex', alignItems: 'center', fontSize: 38, fontWeight: 600 }}>
    {children}
  </div>
);

const FlowNode = ({ label, title, ghost }: { label: string; title: string; ghost?: boolean }) => (
  <div
    style={{
      width: '100%',
      borderRadius: 'var(--osd-radius)',
      padding: '28px 32px',
      background: ghost ? 'transparent' : surface,
      border: ghost ? `2px dashed ${accentSoft}` : `2px solid ${line}`,
      color: ghost ? muted : 'var(--osd-text)',
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ghost ? muted : 'var(--osd-accent)' }}>{label}</div>
    <div style={{ fontSize: 40, fontWeight: 700, marginTop: 8 }}>{title}</div>
  </div>
);

const WhatIsSdd: Page = () => (
  <Frame title="Что такое SDD" lead="Spec-Driven Development: источник истины — спецификация, а не код." gap={56}>
    <div className="rs-steps-grid" style={{ display: 'grid', gridTemplateColumns: '900px 96px 1fr 96px 1fr', alignItems: 'center' }}>
      <Steps>
        <Step>
          <div style={{ width: '100%', border: '4px solid var(--osd-accent)', background: tint, borderRadius: 28, padding: 32, boxShadow: '0 0 0 10px rgba(10,131,84,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
              <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--osd-accent)' }}>Спека</span>
              <span style={{ fontSize: 24, color: muted }}>здесь фокус</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <SpecBlock>Что надо сделать</SpecBlock>
              <SpecBlock>
                Как <span style={{ color: muted, fontWeight: 400, marginLeft: 14 }}>(технический дизайн)</span>
              </SpecBlock>
              <SpecBlock>План</SpecBlock>
            </div>
          </div>
        </Step>
        <Step>
          <ArrowRight width={96} />
        </Step>
        <Step>
          <FlowNode label="исполнитель" title="Агент" />
        </Step>
        <Step>
          <ArrowRight width={96} />
        </Step>
        <Step>
          <FlowNode ghost label="результат" title="Код" />
        </Step>
      </Steps>
    </div>
    <Steps>
      <Step>
        <Caption top={40}>Человек работает над спекой. Код — производная, его пишет агент.</Caption>
      </Step>
    </Steps>
  </Frame>
);

// Опрос зала: вопросы по одному.
const AudiencePoll: Page = () => (
  <Frame title="Вопрос к залу" gap={56}>
    <div className="rs-in" style={{ marginBottom: 56 }}>
      <Eyebrow>Поднимите руку</Eyebrow>
    </div>
    <Steps>
      <Step>
        <Bullet size={52} mark="1">Кто использует SDD?</Bullet>
      </Step>
      <Step>
        <div style={{ marginTop: 40 }}>
          <Bullet size={52} mark="2">Кто пробовал работать с OpenSpec?</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 40 }}>
          <Bullet size={52} mark="3">Кто использует OpenSpec в своих проектах?</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 40 }}>
          <Bullet size={52} mark="4">А есть те, кто против SDD?</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 40 }}>
          <Bullet size={52} mark="5">Кто видел мой предыдущий доклад про SDD?</Bullet>
        </div>
      </Step>
    </Steps>
  </Frame>
);

// ─── Глава 01: путь к 100% adoption ──────────────────────────────────────────

// ─── Глава 02: почему нужен единый процесс ───────────────────────────────────

const ManagementMistake: Page = () => (
  <Frame wide title="Управленческая ошибка, которую совершают многие" gap={64}>
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

// Элементы схем ролей (абсолютные координаты)
type Tone = 'accent' | 'outline' | 'ghost' | 'dev';
const toneStyle: Record<Tone, CSSProperties> = {
  accent: { background: accentFill, color: '#fff', border: '2px solid transparent' },
  outline: { background: surface, color: 'var(--osd-text)', border: `2px solid ${line}` },
  ghost: { background: 'transparent', color: muted, border: `2px dashed ${accentSoft}` },
  dev: { background: surface, color: 'var(--osd-text)', border: '2px solid var(--osd-accent)' },
};
const Box = ({
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
);
const Gate = ({ x, y, h = 170, badge }: { x: number; y: number; h?: number; badge?: ReactNode }) => (
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
    {badge && (
      <div
        style={{
          position: 'absolute',
          top: -18,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          color: dark,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '6px 14px',
          borderRadius: 999,
          whiteSpace: 'nowrap',
        }}
      >
        {badge}
      </div>
    )}
    quality
    <br />
    gate
  </div>
);
const HArrow = ({ x, y, w = 60 }: { x: number; y: number; w?: number }) => (
  <svg style={{ position: 'absolute', left: x, top: y - 14 }} width={w} height="28" viewBox={`0 0 ${w} 28`} fill="none" aria-hidden="true">
    <path d={`M2 14h${w - 14}M${w - 22} 4l10 10-10 10`} stroke={accentSoft} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const DiagramCaption = ({ y, children }: { y: number; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: PAD, right: PAD, top: y, fontSize: 30, lineHeight: 1.4, color: muted }}>{children}</div>
);
const DiagramPage = ({ title, eyebrow, children }: { title: ReactNode; eyebrow?: ReactNode; children: ReactNode }) => (
  <Live chrome="frame" noLogos>
    <HeaderTitle wide>{title}</HeaderTitle>
    {eyebrow && (
      <div style={{ position: 'absolute', left: PAD, top: BODY_TOP + 50 }}>
        <Eyebrow style={{ fontSize: 26 }}>{eyebrow}</Eyebrow>
      </div>
    )}
    {children}
    <Footer />
  </Live>
);
const Band = ({ y, h, label }: { y: number; h: number; label: string }) => (
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

// Схема 1: антипаттерн
const FlowAnti: Page = () => (
  <DiagramPage title="Антипаттерн: SDD только в разработке">
    <Box x={460} y={290} w={1000} h={130} tone="ghost" title="Jira / Confluence" sub="спецификация во внешней системе: источник требований" />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 448, textAlign: 'center', fontSize: 26, color: muted }}>↓ требования падают тикетами и текстом ↓</div>
    <Box x={140} y={530} w={480} h={210} title="Аналитик" sub="пишет требования в Jira / Confluence" />
    <HArrow x={630} y={635} w={80} />
    <Box x={720} y={530} w={480} h={210} tone="dev" title="Разработчик" sub="генерит свой слой спек только под себя" badge="SDD" />
    <HArrow x={1210} y={635} w={80} />
    <Box x={1300} y={530} w={480} h={210} title="Тестировщик" sub="вне SDD, свои сценарии" />
    <DiagramCaption y={820}>SDD живёт островом у разработчика · требования дублируются · трассировка рвётся</DiagramCaption>
  </DiagramPage>
);

// Схема 2: сквозной SDD
const FlowE2E: Page = () => (
  <DiagramPage title="Сквозной SDD: платформа на всю команду">
    <Box x={460} y={290} w={1000} h={130} tone="accent" title="Спеки в том же репозитории" sub="единый источник истины вместо Jira / Confluence" />
    <Band y={460} h={420} label="единая SDD-платформа · аналитик · разработчик · тестировщик" />
    <Box x={200} y={530} w={400} h={170} title="Аналитик" sub="/explore · /propose" />
    <Gate x={630} y={530} />
    <Box x={764} y={530} w={400} h={170} tone="dev" title="Разработчик" sub="/apply" />
    <Gate x={1194} y={530} badge="+ e2e" />
    <Box x={1328} y={530} w={392} h={170} tone="accent" title="merge / prod" />
    <Box x={420} y={750} w={1080} h={90} row title="Тестировщик" sub="держит quality gate после аналитика и разработчика + пишет e2e" />
    <DiagramCaption y={910}>Одни спеки, один язык, сквозная трассировка: основной профит именно здесь</DiagramCaption>
  </DiagramPage>
);

// Схема 3: ошибка с e2e (v1)
const FlowV1: Page = () => (
  <DiagramPage title="Ошибка: пережиток старого мышления" eyebrow="v1 · как мы сначала думали делать e2e">
    <Box x={140} y={470} w={380} h={190} title="Аналитик" sub="/explore · /propose" />
    <Gate x={560} y={470} h={190} />
    <Box x={704} y={470} w={380} h={190} tone="dev" title="Разработчик" sub="/apply" />
    <HArrow x={1094} y={565} w={70} />
    <Box x={1174} y={470} w={400} h={190} tone="ghost" title="Тестировщик" sub="пишет e2e автотесты отдельным скилом" />
    <HArrow x={1564} y={565} w={50} />
    <Box x={1624} y={470} w={156} h={190} tone="accent" title={<span style={{ fontSize: 24 }}>prod</span>} />
    <DiagramCaption y={760}>Думали, что e2e напишут тестировщики отдельным шагом. Но это разрывает цикл «код ↔ тесты».</DiagramCaption>
  </DiagramPage>
);

// Схема 4: e2e в одном цикле (v2)
const FlowV2: Page = () => (
  <DiagramPage title="Правильно: e2e в одном цикле с кодом" eyebrow="v2 · e2e отдаём агенту разработчика">
    <Band y={400} h={420} label="единая SDD-платформа · аналитик · разработчик · тестировщик" />
    <Box x={200} y={470} w={400} h={170} title="Аналитик" sub="/explore · /propose" />
    <Gate x={630} y={470} />
    <Box x={764} y={470} w={400} h={170} tone="dev" title="Разработчик" sub="/apply · код ⇄ e2e" badge="+ e2e" />
    <Gate x={1194} y={470} />
    <Box x={1328} y={470} w={392} h={170} tone="accent" title="merge / prod" />
    <Box x={470} y={690} w={980} h={90} row title="Тестировщик" sub="держит quality gate после аналитика и после разработчика" />
    <DiagramCaption y={860}>Агент пишет тесты и гоняет их с правками кода в одном цикле. Разрыв этого цикла и есть пережиток.</DiagramCaption>
  </DiagramPage>
);

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

// AI-шлюз: упёрлись в LiteLLM → свой продукт Кордон AI.
// Слайд-вставка в фирменном стиле kordonai.ru: светлые панели, синий + золото, Wix Madefor / Unbounded.
const KORDON_FONT_ID = 'osd-webfont-boostconf-2026-kordon';
if (typeof document !== 'undefined' && !document.getElementById(KORDON_FONT_ID)) {
  const link = document.createElement('link');
  link.id = KORDON_FONT_ID;
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Unbounded:wght@600&family=Wix+Madefor+Display:wght@700;800&family=Wix+Madefor+Text:wght@400;500&display=swap';
  document.head.appendChild(link);
}
const kd = {
  ink: '#0b1324',
  ink2: '#4a5468',
  ink3: '#848ea2',
  paper: '#ffffff',
  paper2: '#f3f5f9',
  rule: '#e2e6ed',
  blue: '#2a47d6',
  onBlue2: 'rgba(255,255,255,0.76)',
  gold: '#e0b04a',
  goldInk: '#8a6210',
  red: '#d93a2f',
  display: '"Wix Madefor Display", "Segoe UI", system-ui, sans-serif',
  text: '"Wix Madefor Text", "Segoe UI", system-ui, sans-serif',
  brand: '"Unbounded", "Wix Madefor Display", system-ui, sans-serif',
};

const KordonPanel = ({ y, h }: { y: number; h: number }) => (
  <div className="rs-static" style={{ position: 'absolute', left: 20, top: y, width: 1880, height: h, borderRadius: 35, background: kd.paper, zIndex: -1 }} />
);

const KordonLogo = ({ size = 64, light }: { size?: number; light?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M58 24V18a12 12 0 0 0-12-12H18A12 12 0 0 0 6 18v28a12 12 0 0 0 12 12h28a12 12 0 0 0 12-12v-6" stroke={light ? '#fff' : kd.ink} strokeWidth="8" strokeLinecap="round" />
      <path d="M32 32H59" stroke={kd.gold} strokeWidth="8" strokeLinecap="round" />
      <circle cx="32" cy="32" r="9" fill={kd.gold} />
    </svg>
    <span style={{ fontFamily: kd.brand, fontWeight: 600, fontSize: size * 0.78, letterSpacing: '-0.02em', color: light ? '#fff' : kd.ink }}>
      Кордон <span style={{ color: light ? kd.gold : kd.goldInk }}>AI</span>
    </span>
  </div>
);

const KordonFeature = ({ label, title, text, blue }: { label: string; title: ReactNode; text: ReactNode; blue?: boolean }) => (
  <div
    style={{
      width: '100%',
      boxSizing: 'border-box',
      borderRadius: 24,
      padding: '28px 36px',
      background: blue ? kd.blue : kd.paper2,
      border: blue ? 'none' : `1px solid ${kd.rule}`,
      color: blue ? '#fff' : kd.ink,
      boxShadow: blue ? '0 24px 48px -24px rgba(42,71,214,0.55)' : 'none',
    }}
  >
    <div style={{ fontFamily: kd.display, fontSize: 20, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: blue ? kd.gold : kd.ink3 }}>{label}</div>
    <div style={{ fontFamily: kd.display, fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '8px 0 12px' }}>{title}</div>
    <div style={{ fontFamily: kd.text, fontSize: 25, lineHeight: 1.4, color: blue ? kd.onBlue2 : kd.ink2 }}>{text}</div>
  </div>
);

const KordonFooter = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div className="rs-static" style={{ position: 'absolute', left: PAD, right: 90, bottom: 54, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 22, textTransform: 'uppercase' }}>
      <span />
      <span style={{ fontSize: 24, color: kd.ink }}>
        {current} <span style={{ color: kd.blue }}>/ {total}</span>
      </span>
    </div>
  );
};

const Kordon: Page = () => (
  <Live chrome="bare" style={{ color: kd.ink }}>
    <KordonPanel y={20} h={HEADER_H} />
    <KordonPanel y={BODY_TOP} h={1080 - BODY_TOP - 20} />
    <div style={{ position: 'absolute', left: PAD, top: 20, height: HEADER_H, display: 'flex', alignItems: 'center' }}>
      <KordonLogo />
    </div>
    <Logos />
    <div style={{ position: 'absolute', left: PAD, right: PAD, top: BODY_TOP + 40 }}>
      <div className="rs-in" style={{ fontFamily: kd.display, fontSize: 64, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1 }}>
        Свой шлюз: <span style={{ color: kd.blue }}>что он нам закрывает</span>
      </div>
      <div className="rs-in rs-d1" style={{ fontFamily: kd.text, fontSize: 30, lineHeight: 1.4, color: kd.ink2, marginTop: 12 }}>
        Упёрлись в LiteLLM и пилим свой продукт: корпоративный шлюз на open source компонентах.
      </div>
      <div className="rs-steps-grid kd-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20, marginTop: 32 }}>
        <Steps>
          <Step>
            <KordonFeature blue label="вход" title="SSO" text="Корпоративная учётка вместо ручной раздачи виртуальных ключей каждому" />
          </Step>
          <Step>
            <KordonFeature label="self-service" title="Личный кабинет" text="У каждого своя страница: потребление, лимиты, ключи" />
          </Step>
          <Step>
            <KordonFeature label="безопасность" title="Анонимизация" text="PII-детекция, которая качественно работает на русском: пришлось дообучать модели" />
          </Step>
          <Step>
            <KordonFeature label="модели" title="Единый API" text="Один вход на все модели и провайдеры для людей и агентов" />
          </Step>
          <Step>
            <KordonFeature label="контроль" title="Сбор сессий" text="Централизованно собираем и контролируем все сессии" />
          </Step>
          <Step>
            <KordonFeature label="экономия" title="Абьюз подписок 😉" text="Подписки Codex используем «по-чёрному»: роутим их через один шлюз улучшая утилизацию" />
          </Step>
        </Steps>
      </div>
    </div>
    <KordonFooter />
  </Live>
);

// ═══════════════════════════════════════════════════════════════════════════════
// СТРАНИЦЫ, ПЕРЕНЕСЁННЫЕ ИЗ production-transformation
// ═══════════════════════════════════════════════════════════════════════════════

// Еженедельный разбор: откуда берём боли
const WeeklyReview: Page = () => (
  <Live style={{ padding: `0 ${PAD}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div className="rs-in rs-d1" style={{ borderLeft: '10px solid var(--osd-accent)', paddingLeft: 56 }}>
      <Heading size={104}>Еженедельный разбор</Heading>
      <div style={{ fontSize: 38, lineHeight: 1.4, color: muted, marginTop: 28, maxWidth: 1300 }}>
        Каждую неделю разбираем проблемы проектов на встрече по SDD и harness.
      </div>
    </div>
    <Footer />
  </Live>
);

// Пример боли: правка заказчика заново проходит через все роли
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


// ─── Глава 07: куда идёт индустрия ───────────────────────────────────────────

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
  <Frame wide title="Уникальной работы в роли всё меньше" lead="Агент воспроизводит всё больше работы в каждой функции. Это размывает ценность узких ролей." gap={40}>
    <div className="rs-in rs-d1">
      <AgentizedDiagram />
    </div>
  </Frame>
);

// ─── Финал ───────────────────────────────────────────────────────────────────

export const meta: SlideMeta = {
  title: 'Внедрение SDD в команды и производство на старых проектах',
  createdAt: '2026-09-25T17:30:00.000Z',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SDD: механика, платформа на легаси, грабли масштаба, роли
// ═══════════════════════════════════════════════════════════════════════════════
// Конец 2025: 100% adoption
const Adoption100: Page = () => (
  <Shout eyebrow="Конец 2025 года">
    Через тернии мы пришли к <A>100% adoption</A> среди разработчиков
  </Shout>
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


const DivSdd = dividerPage('01', 'SDD — единый контекст для команды и агента', 'Один процесс и один источник истины через все роли');
const DivPlatform = dividerPage('02', 'Платформа на легаси', 'Мультирепо, трассировка и регламент, на которых едет процесс');
const DivScale = dividerPage('03', 'Что докрутили на масштабе', 'Июнь → октябрь: что вылезло, когда SDD пошёл во все команды');
const DivRoles = dividerPage('04', 'Упёрлись в роли', 'SDD прошёл через все роли — и упёрся в сами роли');

// Две колонки «боль → что делаем».
const PainItem = ({ children }: { children: ReactNode }) => (
  <li style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}>
    <span style={{ flex: 'none', width: 12, height: 12, borderRadius: 6, background: 'currentColor', opacity: 0.6, transform: 'translateY(-4px)' }} />
    <span>{children}</span>
  </li>
);
const PainCol = ({ label, title, fix, children }: { label: string; title: string; fix?: boolean; children: ReactNode }) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      background: fix ? accentFill : surface,
      border: `1px solid ${fix ? 'transparent' : line}`,
      borderRadius: 'var(--osd-radius)',
      padding: '36px 40px',
      boxShadow: fix ? '0 24px 48px -24px rgba(0,0,0,0.5)' : 'none',
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: fix ? 'rgba(255,255,255,0.75)' : 'var(--osd-accent)' }}>{label}</div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', margin: '12px 0 26px' }}>{title}</div>
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: 28, lineHeight: 1.4, color: fix ? 'rgba(255,255,255,0.9)' : muted, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {children}
    </ul>
  </div>
);
const PainFix = ({ children }: { children: ReactNode }) => (
  <div className="rs-steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 96px 1fr', alignItems: 'stretch' }}>
    {children}
  </div>
);

// ─── 01 · Сквозной SDD ───────────────────────────────────────────────────────
const OpenSpecStates: Page = () => (
  <Frame title="OpenSpec на пальцах" lead="Два состояния контекста: что меняем прямо сейчас и как система работает сейчас." gap={40}>
    <div style={{ display: 'flex', gap: 56, alignItems: 'flex-start' }}>
      <div className="rs-in rs-d1" style={{ flex: 'none' }}>
        <Code size={26}>{`openspec/
├── specs/<domain>/spec.md   # источник истины
└── changes/<change-id>/
    ├── proposal.md          # зачем и что
    ├── design.md            # ADR, решения
    ├── tasks.md             # план реализации
    ├── test-plan.md         # тесты на пункты спеки
    └── specs/               # дельта к источнику истины`}</Code>
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingTop: 12 }}>
        <Steps>
          <Step>
            <Bullet size={32}>
              <A>changes/</A> — лог изменений: что и зачем меняем
            </Bullet>
          </Step>
          <Step>
            <div style={{ marginTop: 28 }}>
              <Bullet size={32}>
                <A>specs/</A> — как система работает сейчас
              </Bullet>
            </div>
          </Step>
          <Step>
            <div style={{ marginTop: 28 }}>
              <Bullet size={32}>Change проходит ревью и реализацию, потом дельта вливается в specs/</Bullet>
            </div>
          </Step>
        </Steps>
      </div>
    </div>
  </Frame>
);

const ChangeLifecycle: Page = () => (
  <Frame title="Жизненный цикл change" lead="Один артефакт ведёт задачу от смысла до прод-кода." gap={56}>
    <div className="rs-steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 72px 1fr 72px 1fr 72px 1fr', alignItems: 'stretch' }}>
      <Steps>
        <Step>
          <Card label="опционально" title="explore" text="Прожарить идею, собрать контекст, накидать варианты" />
        </Step>
        <Step>
          <ArrowRight />
        </Step>
        <Step>
          <Card label="аналитик" title="propose" text="proposal, design, tasks и дельта спеки" />
        </Step>
        <Step>
          <ArrowRight />
        </Step>
        <Step>
          <Card label="разработчик" title="apply" text="Агент реализует по tasks, код и тесты в одном цикле" accent />
        </Step>
        <Step>
          <ArrowRight />
        </Step>
        <Step>
          <Card label="после merge" title="archive" text="Дельта вливается в источник истины" />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ─── 02 · Платформа на легаси ────────────────────────────────────────────────
const TermLine = ({ kind, children }: { kind: 'prompt' | 'act' | 'out'; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 14, color: kind === 'prompt' ? '#fff' : kind === 'act' ? '#D4EFE2' : muted, paddingLeft: kind === 'out' ? 28 : 0 }}>
    <span style={{ color: kind === 'out' ? '#55605C' : accentSoft, flex: 'none' }}>{kind === 'prompt' ? '>' : kind === 'act' ? '●' : '⎿'}</span>
    <span>{children}</span>
  </div>
);
const Traceability: Page = () => (
  <Frame wide title="Трассировка: агент ищет смысл, а не гадает" gap={0}>
    <div style={{ display: 'flex', gap: 56, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Steps>
          <Step>
            <Bullet size={32}>Каждый коммит подписан change-id</Bullet>
          </Step>
          <Step>
            <div style={{ marginTop: 28 }}>
              <Bullet size={32}>git blame → коммит → change: зачем писался код и как решали</Bullet>
            </div>
          </Step>
          <Step>
            <div style={{ marginTop: 28 }}>
              <Bullet size={32}>Change больше задачи в трекере: смысл и дизайн лежат рядом с кодом</Bullet>
            </div>
          </Step>
        </Steps>
      </div>
      <div
        className="rs-in rs-d2"
        style={{ flex: 'none', width: 880, background: '#020A08', border: `1px solid ${line}`, borderRadius: 'var(--osd-radius)', padding: '32px 40px', fontFamily: mono, fontSize: 23, lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <div style={{ color: accentSoft, fontSize: 20, marginBottom: 12 }}>✳ claude · harness</div>
        <TermLine kind="prompt">сессия истекает раньше срока — разберись и почини</TermLine>
        <TermLine kind="act">Нашёл код, который уже частично решает задачу</TermLine>
        <TermLine kind="out">auth/session.ts:42 — ротация есть, TTL захардкожен</TermLine>
        <TermLine kind="act">Ищу связанные спеки…</TermLine>
        <TermLine kind="out">specs/auth/spec.md — «TTL сессии — 30 минут»</TermLine>
        <TermLine kind="out">changes/session-ttl/ — активный change, дизайн готов</TermLine>
        <TermLine kind="act">Сверяю намерение с источником истины</TermLine>
        <TermLine kind="out">правлю по proposal + design из change▋</TermLine>
      </div>
    </div>
  </Frame>
);

const Spek: Page = () => (
  <Frame
    title={
      <>
        <span style={{ textTransform: 'none' }}>spek</span> · визуализация changes
      </>
    }
    lead="Свой сервис: поиск, связи, прогресс и коммиты каждого change. Change ≠ task: он начинается ещё на дискавери."
    gap={40}
  >
    <div className="rs-in rs-d1 rs-pop">
      <img
        src={spekListImg}
        alt="spek: список changes"
        style={{ display: 'block', width: 1640, height: 540, objectFit: 'cover', objectPosition: 'top', borderRadius: 'var(--osd-radius)', border: `1px solid ${line}` }}
      />
    </div>
  </Frame>
);

const NoChange: Page = () => (
  <Frame title="Всё ли делать через change?" lead="Нет. Что можно без change, фиксирует регламент разрешённых операций." gap={48}>
    <PainFix>
      <Steps>
        <Step>
          <PainCol label="обычным промптом" title="Без change">
            <PainItem>Косметика UI: подвинуть или покрасить кнопку</PainItem>
            <PainItem>Баг, когда поведение уже описано в спеке</PainItem>
            <PainItem>Контроль: в spek видно коммиты мимо change</PainItem>
          </PainCol>
        </Step>
        <Step>
          <ArrowRight width={96} />
        </Step>
        <Step>
          <PainCol fix label="сокращённый" title="Технический change">
            <PainItem>Рефакторинг и инженерные задачи</PainItem>
            <PainItem>Смысл · реализация · план</PainItem>
            <PainItem>Change без spec, но контекст решения сохраняется</PainItem>
          </PainCol>
        </Step>
      </Steps>
    </PainFix>
  </Frame>
);

const Effect: Page = () => (
  <Shout eyebrow="Эффект" size={80}>
    Ускорение <A>от 0% до 600%</A> в зависимости от типа задач — на своих же задачах, по переоценённому бейзлайну
  </Shout>
);

// ─── 03 · Что докрутили на масштабе ────────────────────────────────────────────────────
const BigChanges: Page = () => (
  <Frame title="Большие change копят конфликты" lead="Открытых change много, живут они долго и расходятся друг с другом." gap={48}>
    <PainFix>
      <Steps>
        <Step>
          <PainCol label="боль" title="Что видим">
            <PainItem>Change разрастается на полпроекта</PainItem>
            <PainItem>Открытые change копят конфликты между собой</PainItem>
            <PainItem>Брошенные change засоряют спеки</PainItem>
          </PainCol>
        </Step>
        <Step>
          <ArrowRight width={96} />
        </Step>
        <Step>
          <PainCol fix label="что делаем" title="Режем и чистим">
            <PainItem>Гипотезы: кривая декомпозиция и недоработка на входе</PainItem>
            <PainItem>Пилот раздельных спек</PainItem>
            <PainItem>Регулярно архивируем и чистим спеки</PainItem>
          </PainCol>
        </Step>
      </Steps>
    </PainFix>
  </Frame>
);

const Decomposition: Page = () => (
  <Frame title="Декомпозиция change" lead="Именно декомпозиция change должна задавать логику распределения работы." gap={48}>
    <Steps>
      <Step>
        <Bullet size={36}>Change явно выстраивает зависимости от других change</Bullet>
      </Step>
      <Step>
        <div style={{ marginTop: 28 }}>
          <Bullet size={36}>По этим зависимостям раздаём работу исполнителям, иначе проблемы</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 28 }}>
          <Bullet size={36}>Вложенные change не взлетели</Bullet>
        </div>
      </Step>
      <Step>
        <div style={{ marginTop: 28 }}>
          <Bullet size={36}>Параллельные change — до сих пор открытый вопрос</Bullet>
        </div>
      </Step>
    </Steps>
  </Frame>
);

const ChangeChtz: Page = () => (
  <Frame title="Change ↔ ЧТЗ" lead="В заказной разработке заказчик принимает ЧТЗ, а не change." gap={40}>
    <div style={{ display: 'flex', gap: 56, alignItems: 'flex-start' }}>
      <div className="rs-in rs-d1" style={{ flex: 'none' }}>
        <Code size={26}>{`ЧТЗ
├── Раздел 1 = change1 (capability1, capability2)
├── Раздел 2 = change2 (capability1)
└── Раздел 3 = change3 (capability3, capability2)

Задача = change1 + change2 = кусок ЧТЗ`}</Code>
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingTop: 12 }}>
        <Steps>
          <Step>
            <Bullet size={32}>Итерационные change 1 → 1.1 → 1.2 ломают ЧТЗ для аналитиков</Bullet>
          </Step>
          <Step>
            <div style={{ marginTop: 28 }}>
              <Bullet size={32}>Ищем цепочку: макеты → change → ЧТЗ</Bullet>
            </div>
          </Step>
        </Steps>
      </div>
    </div>
  </Frame>
);

const AreaCapability: Page = () => (
  <Frame wide title="Area / capability: контроль границ" lead="Без контроля OpenSpec сам нарезает спеки, и границы расплываются." gap={48}>
    <PainFix>
      <Steps>
        <Step>
          <PainCol label="боль" title="Мусорные capability">
            <PainItem>OpenSpec генерирует много мусорных capability</PainItem>
            <PainItem>Домены никто не контролирует</PainItem>
          </PainCol>
        </Step>
        <Step>
          <ArrowRight width={96} />
        </Step>
        <Step>
          <PainCol fix label="что сделали" title="Взяли под контроль">
            <PainItem>Справочник capability</PainItem>
            <PainItem>Справочник доменов</PainItem>
            <PainItem>Оба справочника валидируем вручную</PainItem>
          </PainCol>
        </Step>
      </Steps>
    </PainFix>
  </Frame>
);

const ChangeSchemas: Page = () => (
  <Frame title="Схемы change под роли" lead="Одна схема на всех не работает: аналитику и инженеру нужен разный change." gap={56}>
    <div className="rs-steps-row" style={{ display: 'flex', gap: 32 }}>
      <Steps>
        <Step>
          <Card label="аналитик" title="Своя схема" text="В proposal и specs — без низкоуровневых технических деталей" />
        </Step>
        <Step>
          <Card label="инженер" title="Tech schema" text="Технический change: change без spec" />
        </Step>
        <Step>
          <Card label="обсуждаем" title="explore → propose" text="Обязательный explore перед propose: сначала прожарка идеи" />
        </Step>
      </Steps>
    </div>
    <Steps>
      <Step>
        <Caption top={48}>Правки в change — только через скилл update, не руками.</Caption>
      </Step>
    </Steps>
  </Frame>
);

const SeniorModels: Page = () => (
  <Frame wide title="Проектирование — только на старших моделях" gap={0}>
    <PainFix>
      <Steps>
        <Step>
          <PainCol label="боль" title="Слабые спеки у части коллег">
            <PainItem>В explore и propose упускают corner cases</PainItem>
            <PainItem>Не учитывают нюансы</PainItem>
            <PainItem>Причина: спеки генерируют на Sonnet</PainItem>
          </PainCol>
        </Step>
        <Step>
          <ArrowRight width={96} />
        </Step>
        <Step>
          <PainCol fix label="что сделали" title="Жёсткий запрет">
            <PainItem>propose на слабой модели обрубается</PainItem>
            <PainItem>Спеку генерируем только старшими моделями</PainItem>
          </PainCol>
        </Step>
      </Steps>
    </PainFix>
  </Frame>
);

const HarnessHooks: Page = () => (
  <Frame wide title="Консистентность harness — хуками" lead="На масштабе у каждого «свой» harness. Проверяем автоматикой, а не договорённостями." gap={44}>
    <BulletList gap={22}>
      <Steps>
        <Step>
          <Bullet size={32}>git hook: валидация openspec и change-id в теле каждого коммита</Bullet>
        </Step>
        <Step>
          <Bullet size={32}>Проверка версии openspec: за лето 1.8 → 1.14, обновляем скилом</Bullet>
        </Step>
        <Step>
          <Bullet size={32}>Проверка, что скилы подтянулись в Claude и Codex, иначе ошибка</Bullet>
        </Step>
        <Step>
          <Bullet size={32}>Хуки зашиты в репозиторий</Bullet>
        </Step>
      </Steps>
    </BulletList>
  </Frame>
);

const TestPlanEvo: Page = () => (
  <Frame title="Тест-план: что докрутили" gap={0}>
    <BulletList gap={22}>
      <Steps>
        <Step>
          <Bullet size={32}>Агент не закрывал чекпоинты в тест-плане — прописали явно</Bullet>
        </Step>
        <Step>
          <Bullet size={32}>Слабые тесты → критерии качества тестов в скилле</Bullet>
        </Step>
        <Step>
          <Bullet size={32}>e2e упирается в стенды: docker compose и локальный разворот</Bullet>
        </Step>
      </Steps>
    </BulletList>
  </Frame>
);

const LangfuseKordon: Page = () => (
  <Frame wide title="Langfuse + Кордон: считаем ваншоты" lead="Все запросы агентов идут через шлюз, трейсы — в Langfuse." gap={56}>
    <div className="rs-steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 72px 1fr 72px 1fr 72px 1fr', alignItems: 'stretch' }}>
      <Steps>
        <Step>
          <Card label="люди" title="Агенты" text="Claude Code, Codex и др." />
        </Step>
        <Step>
          <ArrowRight />
        </Step>
        <Step>
          <Card label="шлюз" title={<KordonLogo size={44} light />} text="Один вход ко всем моделям" />
        </Step>
        <Step>
          <ArrowRight />
        </Step>
        <Step>
          <Card
            label="трейсы"
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={langfuseLogo} alt="" style={{ width: 64, height: 64, margin: '-10px -6px -10px -10px' }} />
                Langfuse
              </span>
            }
            text="Сессии, tool calls, вызовы LLM"
          />
        </Step>
        <Step>
          <ArrowRight />
        </Step>
        <Step>
          <Card label="метрики" title="% ваншотов" text="И кто как пользуется агентами" accent />
        </Step>
      </Steps>
    </div>
    <Steps>
      <Step>
        <Caption top={56}>
          Задел на самообучение harness: где агент не справился с первого раза — туда докручиваем скилы и спеки.
        </Caption>
      </Step>
    </Steps>
  </Frame>
);

// ─── 04 · Упёрлись в роли ────────────────────────────────────────────────────
// Выводы из уроков: роли упираются в хендофы
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

// ─── Рынок и наша модель tiny team ───────────────────────────────────────────
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


// Рынок: role-based → agent-based SDLC и продукт-инженер
const Tag = ({ text, tone }: { text: string; tone: 'bad' | 'good' }) => (
  <div style={{ background: tone === 'bad' ? 'rgba(242,120,120,0.16)' : 'rgba(4,171,106,0.2)', color: tone === 'bad' ? '#F4A9A9' : '#7FE3B6', fontSize: 22, fontWeight: 600, padding: '12px 20px', borderRadius: 10, whiteSpace: 'nowrap' }}>
    {text}
  </div>
);

const SdlcPanel = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ flex: 1, minWidth: 0, background: surface, border: `1px solid ${line}`, borderRadius: 'var(--osd-radius)', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
    {children}
  </div>
);

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


const ProductEngineers: Page = () => (
  <Frame wide title="Перестраиваемся в продукт-инженеров" lead="Один инженер ведёт фичу целиком: от спеки до прода, управляя агентами." gap={40}>
    <div className="rs-stagger">
      <BulletList gap={16}>
        <Bullet size={30}>Front-office: PM и продакты держат заказчика и пишут спеки, инженер — всё производство</Bullet>
        <Bullet size={30}>Профиль компетенций: минимальный и уверенный уровень</Bullet>
        <Bullet size={30}>План обучения на квартал у каждого, кто растёт в продукт-инженера</Bullet>
        <Bullet size={30}>Команды собираем так, чтобы инженеры перекрывали друг друга</Bullet>
        <Bullet size={30}>Границы перехвата ответственности расширяем постепенно</Bullet>
        <Bullet size={30}>Ревью второй ролью на проекте — мастхев</Bullet>
        <Bullet size={30}>Взаимообучение и, экспериментально, парное программирование</Bullet>
      </BulletList>
    </div>
  </Frame>
);

const ToolCard = ({ label, title, text, state }: { label: string; title: string; text: string; state: 'old' | 'new' }) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      background: state === 'new' ? accentFill : surface,
      color: '#fff',
      border: state === 'new' ? 'none' : `2px dashed ${muted}`,
      opacity: state === 'old' ? 0.6 : 1,
      borderRadius: 'var(--osd-radius)',
      padding: '36px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.75 }}>{label}</div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
      {state === 'old' ? (
        <span style={{ position: 'relative', display: 'inline-block' }}>
          {title}
          <span
            className="rs-strike"
            style={{ position: 'absolute', left: -6, right: -6, top: '50%', height: 6, marginTop: -3, background: 'currentColor', borderRadius: 3, transformOrigin: 'left center' }}
          />
        </span>
      ) : (
        title
      )}
    </div>
    <div style={{ fontSize: 28, lineHeight: 1.4, opacity: state === 'new' ? 0.92 : 1 }}>{text}</div>
  </div>
);
const HtmlFirst: Page = () => (
  <Frame wide title="HTML first: Figma уходит на второй план" lead="Роль дизайнера меняется так же, как остальные." gap={44}>
    <div className="rs-stagger rs-slow" style={{ display: 'flex', alignItems: 'stretch' }}>
      <ToolCard label="Вчера" title="Figma" text="Умирает как инструмент и теряет солидную долю рынка." state="old" />
      <LinkArrow label="дизайнер ближе к инженеру" />
      <ToolCard label="Сегодня" title="HTML first" text="Дизайн рождается сразу в коде, агенты собирают экраны по системе." state="new" />
    </div>
    <Steps>
      <Step>
        <div style={{ display: 'flex', gap: 64, marginTop: 44 }}>
          <div style={{ flex: 1, fontSize: 28, lineHeight: 1.4, color: muted }}>
            На Западе дизайнеры всегда были инженерами, которые умеют в код. Текущее разделение ролей — специфика СНГ.
          </div>
          <div style={{ flex: 1, borderLeft: '4px solid var(--osd-accent)', paddingLeft: 32, fontSize: 32, fontWeight: 600, lineHeight: 1.35 }}>
            Дизайнер, который остался только(!) в Figma, — уже априори устаревший дизайнер.
          </div>
        </div>
      </Step>
    </Steps>
  </Frame>
);

// ─── Финал ───────────────────────────────────────────────────────────────────
const Conclusions: Page = () => (
  <Frame title="Что забираем с собой" gap={0}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      <Steps>
        <Step>
          <Takeaway n="1">Внедряйте SDD сквозным процессом: один источник истины от требований до кода, а не остров у разработчиков</Takeaway>
        </Step>
        <Step>
          <Takeaway n="2">На масштабе держите границы: справочники capability и доменов, спеки — только на старших моделях</Takeaway>
        </Step>
        <Step>
          <Takeaway n="3">Держите harness консистентным автоматикой: хуки и метрики ваншотов</Takeaway>
        </Step>
        <Step>
          <Takeaway n="4">Сквозной процесс делает роли лишними: следующий шаг — продукт-инженеры, а спеки пишут PM и продакты</Takeaway>
        </Step>
      </Steps>
    </div>
  </Frame>
);

export default [
  Cover,
  About,
  Clients,
  WhatIsSdd,
  AudiencePoll,
  Adoption100,
  Start2026,
  DivSdd,
  Candidates,
  ChangeLifecycle,
  OpenSpecStates,
  FlowAnti,
  FlowE2E,
  FlowV1,
  FlowV2,
  Gherkin,
  // 02 — Платформа на легаси
  DivPlatform,
  MetaRepo,
  Traceability,
  Spek,
  NoChange,
  Effect,
  // 03 — Что докрутили на масштабе
  DivScale,
  AreaCapability,
  ChangeSchemas,
  SeniorModels,
  HarnessHooks,
  Kordon,
  LangfuseKordon,
  // 04 — Упёрлись в роли
  DivRoles,
  RolesH1,
  HandoffsExpensive,
  HandoffsContext,
  AgentizedRoles,
  WeeklyReview,
  WeeklySync,
  LessonsConclusion,
  // А что на рынке
  MarketTitle,
  MarketNow,
  SdlcShift,
  ProductEngineer,
  OurModel,
  ProductEngineers,
  HtmlFirst,
  // Финал
  Conclusions,
  Questions,
] satisfies Page[];
