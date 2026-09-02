'use client';

import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { designTokens } from './design-system/design-tokens';
import { SemanticIcon, SemanticIconName } from './design-system/semantic-icons';

const colors = designTokens.color.light;
const radius = designTokens.radius;

type Medication = {
  id: string;
  name: string;
  dose: string;
  time: string;
  period: 'Утро' | 'День' | 'Вечер';
  enabled: boolean;
  status: 'Принято' | 'Ожидается';
};

type View = 'overview' | 'medications' | 'wellness' | 'metrics' | 'events' | 'settings';

const periods: Medication['period'][] = ['Утро', 'День', 'Вечер'];

const getPeriodFromTime = (time: string): Medication['period'] => {
  const hour = Number(time.split(':')[0]);
  if (hour >= 5 && hour < 12) return 'Утро';
  if (hour >= 12 && hour < 18) return 'День';
  return 'Вечер';
};

const pressureData = [
  { day: 'Пн', systolic: 132, diastolic: 76 },
  { day: 'Вт', systolic: 128, diastolic: 74 },
  { day: 'Ср', systolic: 136, diastolic: 79 },
  { day: 'Чт', systolic: 131, diastolic: 75 },
  { day: 'Пт', systolic: 126, diastolic: 72 },
  { day: 'Сб', systolic: 129, diastolic: 73 },
  { day: 'Сегодня', systolic: 130, diastolic: 74 },
];

const initialMedications: Medication[] = [
  { id: '1', name: 'Клопидогрел', dose: '75 мг · 1 таблетка', time: '08:00', period: 'Утро', enabled: true, status: 'Принято' },
  { id: '2', name: 'Лозартан', dose: '100 мг · 1 таблетка', time: '08:00', period: 'Утро', enabled: true, status: 'Принято' },
  { id: '3', name: 'Форсига', dose: '10 мг · 1 таблетка', time: '09:00', period: 'Утро', enabled: true, status: 'Принято' },
  { id: '4', name: 'АСК Кардио', dose: '100 мг · 1 таблетка', time: '20:00', period: 'Вечер', enabled: true, status: 'Ожидается' },
  { id: '5', name: 'Аторвастатин', dose: '40 мг · 1 таблетка', time: '21:00', period: 'Вечер', enabled: true, status: 'Ожидается' },
];

const navItems: { key: View; label: string; icon: SemanticIconName }[] = [
  { key: 'overview', label: 'Обзор', icon: 'home' },
  { key: 'medications', label: 'Лекарства', icon: 'medications' },
  { key: 'wellness', label: 'Самочувствие', icon: 'checkup' },
  { key: 'metrics', label: 'Показатели', icon: 'statistics' },
  { key: 'events', label: 'События', icon: 'warning' },
  { key: 'settings', label: 'Настройки', icon: 'settings' },
];

const checkupHistory = [
  { date: 'Сегодня, 09:14', status: 'Стабильно', tone: 'ok', note: 'Изменений не обнаружено', score: '5 из 5' },
  { date: 'Вчера, 08:52', status: 'Есть изменения', tone: 'attention', note: 'Отмечена лёгкая усталость', score: '4 из 5' },
  { date: '30 августа, 09:06', status: 'Стабильно', tone: 'ok', note: 'Изменений не обнаружено', score: '5 из 5' },
  { date: '29 августа, 09:20', status: 'Не завершена', tone: 'muted', note: 'Проверка прервана после 3 вопросов', score: '3 из 5' },
] as const;

const healthEvents = [
  { id: 'e1', title: 'Проверка самочувствия не завершена', meta: '29 августа · 09:24', level: 'attention', status: 'Новое' },
  { id: 'e2', title: 'Приём Лозартана отмечен с опозданием', meta: '28 августа · план 08:00, принято 09:17', level: 'info', status: 'Просмотрено' },
  { id: 'e3', title: 'Давление выше обычного диапазона', meta: '27 августа · 148/86 мм рт. ст.', level: 'attention', status: 'Решено' },
] as const;

const pulseData = [
  { day: 'Пн', value: 66 }, { day: 'Вт', value: 69 }, { day: 'Ср', value: 72 },
  { day: 'Чт', value: 67 }, { day: 'Пт', value: 70 }, { day: 'Сб', value: 68 }, { day: 'Сегодня', value: 68 },
];

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; }
  body { font-family: Manrope, Inter, sans-serif; color: ${colors.textPrimary}; background: ${colors.background}; }
  button, input, select { font: inherit; }
  button { -webkit-tap-highlight-color: transparent; }
  button:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid rgba(233,110,99,.28); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; }
  }
`;

const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  background:
    radial-gradient(circle at 88% 6%, rgba(255, 184, 194, .52), transparent 26%),
    radial-gradient(circle at 76% 42%, rgba(236, 205, 245, .42), transparent 24%),
    radial-gradient(circle at 14% 88%, rgba(255, 205, 178, .34), transparent 28%),
    linear-gradient(145deg, #fffaf3 0%, #fff5ef 48%, #fff9f4 100%);

  @media (max-width: 820px) {
    display: block;
    padding-bottom: 92px;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 28px 18px;
  border-right: 1px solid rgba(224, 207, 195, .72);
  background: rgba(255, 253, 249, .78);
  backdrop-filter: blur(28px);

  @media (max-width: 820px) {
    position: fixed;
    z-index: 20;
    inset: auto 14px 14px;
    height: 72px;
    padding: 8px;
    display: flex;
    align-items: center;
    border: 1px solid rgba(224, 207, 195, .75);
    border-radius: 24px;
    box-shadow: 0 16px 42px rgba(101, 67, 46, .16);
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 28px;
  font-size: 15px;
  font-weight: 800;

  @media (max-width: 820px) { display: none; }
`;

const BrandMark = styled.span`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  color: #fff;
  border-radius: 16px;
  background: linear-gradient(145deg, #f48779, #ef625d);
  box-shadow: 0 10px 24px rgba(233,110,99,.27);
`;

const Nav = styled.nav`
  display: grid;
  gap: 7px;

  @media (max-width: 820px) {
    width: 100%;
    grid-template-columns: repeat(6, 1fr);
    gap: 2px;
  }
`;

const NavButton = styled.button<{ $active: boolean }>`
  min-height: 50px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 16px;
  color: ${({ $active }) => $active ? colors.primary : colors.textSecondary};
  background: ${({ $active }) => $active ? colors.primaryMuted : 'transparent'};
  font-weight: ${({ $active }) => $active ? 700 : 600};
  cursor: pointer;
  transition: background 180ms ease, color 180ms ease, transform 120ms ease;

  &:hover { color: ${colors.primary}; background: ${colors.primaryMuted}; }
  &:active { transform: scale(.97); }

  @media (max-width: 820px) {
    min-width: 0;
    min-height: 56px;
    padding: 4px;
    justify-content: center;
    flex-direction: column;
    gap: 2px;
    font-size: 9px;
    border-radius: 16px;
  }
`;

const SidePatient = styled.div`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 24px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid ${colors.border};
  border-radius: 20px;
  background: rgba(255,255,255,.68);
  font-size: 12px;

  @media (max-width: 820px) { display: none; }
`;

const Avatar = styled.span`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: #cf745a;
  border-radius: 50%;
  background: linear-gradient(145deg, #fff0e6, #ffe0db);
`;

const Main = styled.main`
  min-width: 0;
  padding: 30px clamp(20px, 4vw, 58px) 44px;
`;

const Topbar = styled.header`
  min-height: 58px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const IconButton = styled.button`
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(231, 218, 207, .82);
  border-radius: 50%;
  color: ${colors.textSecondary};
  background: rgba(255,255,255,.72);
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(91, 61, 42, .07);
`;

const RelativeChip = styled.div`
  min-height: 46px;
  padding: 6px 14px 6px 7px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid rgba(231, 218, 207, .82);
  border-radius: 999px;
  background: rgba(255,255,255,.72);
  box-shadow: 0 8px 24px rgba(91, 61, 42, .07);
  font-size: 12px;
  font-weight: 700;
`;
const PatientPicker = styled.button`
  min-height: 46px;
  margin-right: auto;
  padding: 6px 13px 6px 7px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid rgba(231, 218, 207, .82);
  border-radius: 999px;
  color: ${colors.textPrimary};
  background: rgba(255,255,255,.72);
  box-shadow: 0 8px 24px rgba(91, 61, 42, .07);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const PageIntro = styled.div`
  margin-bottom: 26px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;

  h1 { margin: 0; display: flex; align-items: center; gap: 10px; font-size: clamp(26px, 3vw, 38px); line-height: 1.15; letter-spacing: -.9px; }
  p { margin: 8px 0 0; color: ${colors.textSecondary}; font-size: 15px; }

  @media (max-width: 640px) { align-items: flex-start; flex-direction: column; }
`;

const HeartAccent = styled.span`color: ${colors.primary}; display: inline-flex;`;

const Button = styled.button<{ $variant?: 'primary' | 'soft' | 'danger' | 'outline' }>`
  min-height: 48px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid ${({ $variant }) => $variant === 'outline' ? colors.primary : 'transparent'};
  border-radius: 16px;
  color: ${({ $variant }) => $variant === 'primary' || $variant === 'danger' ? '#fff' : $variant === 'outline' ? colors.primary : colors.textPrimary};
  background: ${({ $variant }) => $variant === 'primary' ? colors.primary : $variant === 'danger' ? colors.emergency : $variant === 'outline' ? 'transparent' : colors.surfaceMuted};
  font-weight: 700;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 180ms ease;

  &:hover { box-shadow: 0 10px 24px rgba(233,110,99,.18); }
  &:active { transform: scale(.97); }
`;

const Surface = styled.section`
  border: 1px solid rgba(235, 223, 214, .82);
  border-radius: 28px;
  background: rgba(255, 253, 250, .84);
  box-shadow: 0 14px 38px rgba(99, 68, 49, .09);
  backdrop-filter: blur(18px);
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.14fr) minmax(350px, .86fr);
  gap: 20px;

  @media (max-width: 1120px) { grid-template-columns: 1fr; }
`;

const StableCard = styled(Surface)`
  padding: 26px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 24px;
  overflow: hidden;
  background: linear-gradient(130deg, rgba(255,251,246,.95), rgba(255,236,232,.88));
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 600;
`;

const IconBubble = styled.span<{ $tone?: 'coral' | 'green' | 'lavender' | 'peach' }>`
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  color: ${({ $tone }) => $tone === 'green' ? colors.success : $tone === 'lavender' ? colors.lavender : $tone === 'peach' ? colors.warning : colors.primary};
  background: ${({ $tone }) => $tone === 'green' ? colors.successMuted : $tone === 'lavender' ? colors.lavenderMuted : $tone === 'peach' ? colors.warningMuted : colors.primaryMuted};
`;

const StableValue = styled.div`
  margin: 20px 0 8px;
  font-size: clamp(28px, 4vw, 46px);
  font-weight: 800;
  letter-spacing: -1.4px;
`;

const Muted = styled.p`margin: 0; color: ${colors.textSecondary}; font-size: 13px; line-height: 1.55;`;

const Ring = styled.div`
  position: relative;
  width: 112px;
  height: 112px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: conic-gradient(${colors.primary} 0 96%, rgba(239, 218, 209, .72) 96% 100%);

  &::before { content: ''; width: 88px; height: 88px; border-radius: 50%; background: #fffaf6; }
  strong { position: absolute; font-size: 22px; }
`;

const Metrics = styled.div`
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 660px) { grid-template-columns: 1fr; }
`;

const MetricCard = styled(Surface)`
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;

  strong { display: block; margin-top: 3px; font-size: 20px; }
  small { color: ${colors.textSecondary}; }
`;

const MedicationPanel = styled(Surface)`padding: 24px;`;
const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  h2 { margin: 0; font-size: 18px; }
`;

const TextButton = styled.button`
  min-height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
  border-radius: 999px;
  color: #a9573e;
  background: #fff1e9;
  font-weight: 600;
  cursor: pointer;
`;

const Schedule = styled.div`display: grid; gap: 5px;`;
const ScheduleRow = styled.div`
  padding: 13px 4px;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(235, 223, 214, .72);

  &:last-child { border-bottom: 0; }
  strong { display: block; font-size: 14px; }
  small { display: block; margin-top: 3px; color: ${colors.textSecondary}; }
`;

const StatusPill = styled.span<{ $done: boolean }>`
  min-width: 92px;
  min-height: 38px;
  padding: 0 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $done }) => $done ? 'transparent' : '#f4b384'};
  border-radius: 999px;
  color: ${({ $done }) => $done ? colors.success : '#e67a3f'};
  background: ${({ $done }) => $done ? colors.successMuted : 'transparent'};
  font-size: 12px;
  font-weight: 700;
`;

const SecondaryGrid = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(300px, .7fr);
  gap: 20px;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
`;

const ChartCard = styled(Surface)`padding: 24px; min-height: 360px;`;
const ChartArea = styled.div`
  width: 100%;
  height: 250px;
  font-size: 12px;

  .recharts-cartesian-axis-tick-value { fill: ${colors.textSecondary}; }
  .recharts-legend-item-text { color: ${colors.textSecondary} !important; }
`;
const CheckupCard = styled(Surface)`padding: 24px;`;
const CheckList = styled.div`margin: 18px 0; display: grid; gap: 12px;`;
const CheckRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  span:last-child { display: inline-flex; align-items: center; gap: 5px; color: ${colors.success}; font-weight: 700; }
`;

const Emergency = styled(Surface)`
  margin-top: 20px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-color: rgba(244, 165, 158, .52);
  background: linear-gradient(110deg, rgba(255,235,232,.92), rgba(255,247,240,.9));
  strong { display: block; }
  ${Muted} { flex: 1; }
  @media (max-width: 650px) { align-items: flex-start; flex-wrap: wrap; ${Button} { width: 100%; } }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 20px;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

const StatCard = styled(Surface)`
  padding: 18px 20px;
  small { color: ${colors.textSecondary}; }
  strong { display: block; margin-top: 8px; font-size: 27px; }
`;

const MedicationCards = styled.div`display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; @media (max-width: 760px) { grid-template-columns: 1fr; }`;
const PeriodSections = styled.div`display: grid; gap: 26px;`;
const PeriodSection = styled.section`display: grid; gap: 13px;`;
const PeriodHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h2 { margin: 0; font-size: 18px; }
  span { color: ${colors.textSecondary}; font-size: 13px; }
`;
const MedicationCard = styled(Surface)<{ $enabled: boolean }>`
  padding: 20px;
  opacity: ${({ $enabled }) => $enabled ? 1 : .58};
`;
const MedicationTop = styled.div`display: flex; align-items: flex-start; gap: 12px; h3 { margin: 2px 0 5px; font-size: 16px; }`;
const MedicationMeta = styled.div`margin: 18px 0; display: flex; gap: 8px; flex-wrap: wrap;`;
const MetaPill = styled.span`padding: 7px 10px; border-radius: 999px; color: ${colors.textSecondary}; background: ${colors.surfaceMuted}; font-size: 12px;`;
const CardActions = styled.div`display: flex; gap: 8px; ${Button} { min-height: 42px; padding: 0 13px; }`;

const Overlay = styled.div`
  position: fixed;
  z-index: 40;
  inset: 0;
  padding: 20px;
  display: grid;
  place-items: center;
  background: rgba(50, 34, 28, .34);
  backdrop-filter: blur(8px);
`;

const Dialog = styled.div`
  width: min(520px, 100%);
  max-height: calc(100vh - 40px);
  overflow: auto;
  padding: 24px;
  border-radius: 28px;
  background: #fffdf9;
  box-shadow: 0 28px 80px rgba(62, 38, 28, .22);
`;
const DialogHead = styled.div`display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 20px; h2 { margin: 0; font-size: 21px; }`;
const FormGrid = styled.form`display: grid; gap: 16px;`;
const Field = styled.label`
  display: grid;
  gap: 7px;
  color: ${colors.textSecondary};
  font-size: 12px;
  font-weight: 700;
  input, select {
    width: 100%; min-height: 50px; padding: 0 14px; border: 1px solid ${colors.border};
    border-radius: 15px; color: ${colors.textPrimary}; background: ${colors.surfaceMuted};
  }
`;
const FormColumns = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px; @media (max-width: 500px) { grid-template-columns: 1fr; }`;
const DialogActions = styled.div`display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;`;
const Toast = styled.div`
  position: fixed; z-index: 60; right: 24px; bottom: 24px; padding: 13px 18px;
  display: flex; align-items: center; gap: 8px; border-radius: 16px; color: ${colors.success};
  background: #f3faef; box-shadow: 0 14px 38px rgba(72, 98, 67, .16); font-weight: 700;
`;

const ContentGrid = styled.div<{ $columns?: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns ?? 'minmax(0, 1.3fr) minmax(300px, .7fr)'};
  gap: 20px;
  @media (max-width: 940px) { grid-template-columns: 1fr; }
`;
const Panel = styled(Surface)`padding: 24px;`;
const Timeline = styled.div`display: grid; gap: 10px;`;
const TimelineRow = styled.button`
  width: 100%;
  padding: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  text-align: left;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  color: ${colors.textPrimary};
  background: rgba(255,255,255,.58);
  cursor: pointer;
  strong { display: block; margin-bottom: 5px; font-size: 14px; }
  small { color: ${colors.textSecondary}; }
`;
const ToneBadge = styled.span<{ $tone: 'ok' | 'attention' | 'muted' | 'info' }>`
  align-self: center;
  padding: 7px 10px;
  border-radius: 999px;
  color: ${({ $tone }) => $tone === 'ok' ? colors.success : $tone === 'attention' ? '#c86a35' : $tone === 'info' ? '#7454a3' : colors.textSecondary};
  background: ${({ $tone }) => $tone === 'ok' ? colors.successMuted : $tone === 'attention' ? '#fff0e2' : $tone === 'info' ? '#f2eafb' : colors.surfaceMuted};
  font-size: 12px;
  font-weight: 700;
`;
const AttentionPanel = styled(Surface)`
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 13px;
  border-color: rgba(239,116,105,.4);
  background: linear-gradient(120deg, rgba(255,235,232,.94), rgba(255,248,241,.9));
  strong { display: block; margin-bottom: 5px; }
`;
const MetricSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
  @media (max-width: 920px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;
const RangeTabs = styled.div`display: flex; gap: 5px; padding: 4px; border-radius: 14px; background: ${colors.surfaceMuted};`;
const RangeButton = styled.button<{ $active?: boolean }>`
  min-height: 34px; padding: 0 11px; border: 0; border-radius: 11px; cursor: pointer;
  color: ${({ $active }) => $active ? colors.primary : colors.textSecondary};
  background: ${({ $active }) => $active ? '#fffdf9' : 'transparent'};
  font-size: 12px; font-weight: 700;
`;
const SettingList = styled.div`display: grid; gap: 10px;`;
const SettingRow = styled.label`
  min-height: 66px;
  padding: 13px 16px;
  display: flex;
  align-items: center;
  gap: 13px;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  background: rgba(255,255,255,.55);
  strong { display: block; font-size: 14px; }
  small { color: ${colors.textSecondary}; }
  input { margin-left: auto; width: 20px; height: 20px; accent-color: ${colors.primary}; }
`;
const RoleCard = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  background: rgba(255,255,255,.55);
  ${Muted} { flex: 1; }
`;

function Heading({ title, subtitle, action }: { title: ReactNode; subtitle: string; action?: ReactNode }) {
  return <PageIntro><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</PageIntro>;
}

function Overview({ medications, onOpenMedications }: { medications: Medication[]; onOpenMedications: () => void }) {
  const upcoming = medications.filter(item => item.enabled).slice(0, 3);

  return (
    <>
      <Heading
        title={<>Доброе утро, Валерий <HeartAccent><SemanticIcon name="heart" size={30} /></HeartAccent></>}
        subtitle="Вот как Сергей чувствует себя сегодня"
      />
      <OverviewGrid>
        <div>
          <StableCard>
            <div>
              <Eyebrow><IconBubble $tone="coral"><SemanticIcon name="checkup" /></IconBubble>Ежедневная проверка</Eyebrow>
              <StableValue>Состояние стабильное</StableValue>
              <Muted>Проверка завершена сегодня в 09:14. Тревожных симптомов не отмечено.</Muted>
            </div>
            <Ring><strong>96%</strong></Ring>
          </StableCard>
          <Metrics>
            <MetricCard><IconBubble $tone="coral"><SemanticIcon name="bloodPressure" /></IconBubble><div><small>Давление</small><strong>130/74</strong></div></MetricCard>
            <MetricCard><IconBubble $tone="green"><SemanticIcon name="pulse" /></IconBubble><div><small>Пульс</small><strong>68</strong></div></MetricCard>
            <MetricCard><IconBubble $tone="lavender"><SemanticIcon name="oxygen" /></IconBubble><div><small>Кислород</small><strong>97%</strong></div></MetricCard>
          </Metrics>
        </div>
        <MedicationPanel>
          <SectionHead><h2>Ближайшие приёмы</h2><TextButton onClick={onOpenMedications}>Все лекарства <SemanticIcon name="chevronRight" size={17} /></TextButton></SectionHead>
          <Schedule>
            {upcoming.map((item, index) => (
              <ScheduleRow key={item.id}>
                <IconBubble $tone={index === 2 ? 'lavender' : 'peach'}><SemanticIcon name={item.period === 'Вечер' ? 'pending' : 'medication'} /></IconBubble>
                <div><strong>{item.time} · {item.name}</strong><small>{item.dose}</small></div>
                <StatusPill $done={item.status === 'Принято'}>{item.status === 'Принято' ? 'Принял' : 'Ожидается'}</StatusPill>
              </ScheduleRow>
            ))}
          </Schedule>
        </MedicationPanel>
      </OverviewGrid>
      <SecondaryGrid>
        <ChartCard>
          <SectionHead><div><h2>Динамика давления</h2><Muted>Последние 7 дней</Muted></div><MetaPill>130/74 сегодня</MetaPill></SectionHead>
          <ChartArea role="img" aria-label="График систолического и диастолического давления за последние семь дней">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pressureData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#eee2da" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis domain={[60, 150]} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value, name) => [`${value} мм рт. ст.`, name === 'systolic' ? 'Верхнее' : 'Нижнее']}
                  contentStyle={{ border: `1px solid ${colors.border}`, borderRadius: 16, background: '#fffdf9', boxShadow: '0 14px 34px rgba(80,50,35,.12)' }}
                />
                <Legend formatter={value => value === 'systolic' ? 'Верхнее' : 'Нижнее'} />
                <Line type="monotone" dataKey="systolic" stroke="#ef7469" strokeWidth={4} dot={{ r: 4, fill: '#fffaf4', strokeWidth: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="diastolic" stroke="#a88acf" strokeWidth={4} dot={{ r: 4, fill: '#fffaf4', strokeWidth: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartArea>
        </ChartCard>
        <CheckupCard>
          <SectionHead><div><h2>Сегодняшняя проверка</h2><Muted>Завершена в 09:14</Muted></div><StatusPill $done>5 из 5</StatusPill></SectionHead>
          <CheckList>
            {['Самочувствие', 'Речь и улыбка', 'Движения рук', 'Боль в груди', 'Дыхание'].map(item => <CheckRow key={item}><span>{item}</span><span><SemanticIcon name="success" size={17} />Норма</span></CheckRow>)}
          </CheckList>
          <Button $variant="soft">Открыть ответы</Button>
        </CheckupCard>
      </SecondaryGrid>
      <Emergency>
        <IconBubble $tone="coral"><SemanticIcon name="emergency" /></IconBubble>
        <div><strong>Сергею нужна помощь?</strong><Muted>Позвонить или быстро вызвать скорую помощь</Muted></div>
        <Muted />
        <Button $variant="danger"><SemanticIcon name="emergency" />Вызвать 112</Button>
      </Emergency>
    </>
  );
}

function MedicationsView({ medications, onAdd, onEdit, onDelete }: { medications: Medication[]; onAdd: () => void; onEdit: (item: Medication) => void; onDelete: (item: Medication) => void }) {
  const groupedMedications = periods.map(period => ({
    period,
    items: medications
      .filter(item => item.period === period)
      .sort((left, right) => left.time.localeCompare(right.time)),
  }));

  return (
    <>
      <Heading title="Управление лекарствами" subtitle="Изменения будут переданы в приложение Сергея" action={<Button $variant="primary" onClick={onAdd}><SemanticIcon name="plus" />Добавить лекарство</Button>} />
      <StatsGrid>
        <StatCard><small>Активных препаратов</small><strong>{medications.filter(item => item.enabled).length}</strong><Muted>в расписании</Muted></StatCard>
        <StatCard><small>Приёмов сегодня</small><strong>{medications.length}</strong><Muted>3 уже отмечены</Muted></StatCard>
        <StatCard><small>Ближайший приём</small><strong>20:00</strong><Muted>АСК Кардио</Muted></StatCard>
      </StatsGrid>
      <PeriodSections>
        {groupedMedications.map(group => group.items.length > 0 && (
          <PeriodSection key={group.period} aria-labelledby={`period-${group.period}`}>
            <PeriodHeading>
              <IconBubble $tone={group.period === 'Вечер' ? 'lavender' : group.period === 'День' ? 'coral' : 'peach'}>
                <SemanticIcon name={group.period === 'Вечер' ? 'pending' : 'medication'} />
              </IconBubble>
              <h2 id={`period-${group.period}`}>{group.period}</h2>
              <span>{group.items.length} {group.items.length === 1 ? 'приём' : 'приёма'}</span>
            </PeriodHeading>
            <MedicationCards>
              {group.items.map(item => (
                <MedicationCard key={item.id} $enabled={item.enabled}>
                  <MedicationTop><IconBubble $tone={item.period === 'Вечер' ? 'lavender' : 'peach'}><SemanticIcon name="medication" /></IconBubble><div><h3>{item.name}</h3><Muted>{item.dose}</Muted></div></MedicationTop>
                  <MedicationMeta><MetaPill>{item.time}</MetaPill><MetaPill>{item.enabled ? 'Активен' : 'Приостановлен'}</MetaPill></MedicationMeta>
                  <CardActions><Button $variant="soft" onClick={() => onEdit(item)}><SemanticIcon name="edit" size={18} />Изменить</Button><Button $variant="outline" onClick={() => onDelete(item)}><SemanticIcon name="delete" size={18} />Удалить</Button></CardActions>
                </MedicationCard>
              ))}
            </MedicationCards>
          </PeriodSection>
        ))}
      </PeriodSections>
    </>
  );
}

function WellnessView() {
  return (
    <>
      <Heading title="Самочувствие" subtitle="История ежедневных проверок Сергея" />
      <ContentGrid>
        <Panel>
          <SectionHead><div><h2>Последние проверки</h2><Muted>Ответы и измерения сохраняются вместе с результатом</Muted></div><MetaPill>4 записи</MetaPill></SectionHead>
          <Timeline>
            {checkupHistory.map(item => (
              <TimelineRow key={item.date}>
                <div><strong>{item.date}</strong><small>{item.note}</small></div>
                <div style={{ display: 'grid', justifyItems: 'end', gap: 7 }}><ToneBadge $tone={item.tone}>{item.status}</ToneBadge><small>{item.score}</small></div>
              </TimelineRow>
            ))}
          </Timeline>
        </Panel>
        <div style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
          <AttentionPanel><IconBubble $tone="coral"><SemanticIcon name="warning" /></IconBubble><div><strong>Есть запись, требующая внимания</strong><Muted>Вчера Сергей отметил лёгкую усталость. Экстренных признаков не было.</Muted></div></AttentionPanel>
          <Panel>
            <SectionHead><h2>За 7 дней</h2></SectionHead>
            <CheckList>
              <CheckRow><span>Проверок завершено</span><span>6 из 7</span></CheckRow>
              <CheckRow><span>Стабильных результатов</span><span>5</span></CheckRow>
              <CheckRow><span>С изменениями</span><span style={{ color: '#d67742' }}>1</span></CheckRow>
              <CheckRow><span>Экстренных результатов</span><span>0</span></CheckRow>
            </CheckList>
          </Panel>
        </div>
      </ContentGrid>
    </>
  );
}

function MetricsView() {
  const [range, setRange] = useState<'7 дней' | 'Месяц' | '3 месяца'>('7 дней');
  return (
    <>
      <Heading
        title="Показатели здоровья"
        subtitle="Измерения из проверок и мобильного приложения"
        action={<RangeTabs>{(['7 дней', 'Месяц', '3 месяца'] as const).map(item => <RangeButton key={item} $active={range === item} onClick={() => setRange(item)}>{item}</RangeButton>)}</RangeTabs>}
      />
      <MetricSummary>
        <StatCard><small>Давление</small><strong>130/74</strong><Muted>среднее 132/76</Muted></StatCard>
        <StatCard><small>Пульс</small><strong>68</strong><Muted>мин. 64 · макс. 74</Muted></StatCard>
        <StatCard><small>SpO₂</small><strong>97%</strong><Muted>в обычном диапазоне</Muted></StatCard>
        <StatCard><small>Шаги</small><strong>5 348</strong><Muted>67% дневной цели</Muted></StatCard>
      </MetricSummary>
      <ContentGrid $columns="1fr 1fr">
        <ChartCard>
          <SectionHead><div><h2>Артериальное давление</h2><Muted>{range}</Muted></div><MetaPill>без аномалий</MetaPill></SectionHead>
          <ChartArea><ResponsiveContainer width="100%" height="100%"><LineChart data={pressureData} margin={{ top: 8, right: 12, left: -16 }}><CartesianGrid stroke="#eee2da" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} /><YAxis domain={[60, 150]} axisLine={false} tickLine={false} /><Tooltip /><Legend formatter={value => value === 'systolic' ? 'Верхнее' : 'Нижнее'} /><Line type="monotone" dataKey="systolic" stroke="#ef7469" strokeWidth={4} /><Line type="monotone" dataKey="diastolic" stroke="#a88acf" strokeWidth={4} /></LineChart></ResponsiveContainer></ChartArea>
        </ChartCard>
        <ChartCard>
          <SectionHead><div><h2>Пульс</h2><Muted>{range}</Muted></div><MetaPill>68 сегодня</MetaPill></SectionHead>
          <ChartArea><ResponsiveContainer width="100%" height="100%"><LineChart data={pulseData} margin={{ top: 8, right: 12, left: -16 }}><CartesianGrid stroke="#eee2da" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} /><YAxis domain={[55, 85]} axisLine={false} tickLine={false} /><Tooltip formatter={value => [`${value} уд/мин`, 'Пульс']} /><Line type="monotone" dataKey="value" stroke="#ef7469" strokeWidth={4} dot={{ r: 4, fill: '#fffaf4', strokeWidth: 3 }} /></LineChart></ResponsiveContainer></ChartArea>
        </ChartCard>
      </ContentGrid>
    </>
  );
}

function EventsView() {
  return (
    <>
      <Heading title="События" subtitle="Всё, что может потребовать внимания родственника" action={<Button $variant="soft">Отметить всё просмотренным</Button>} />
      <StatsGrid>
        <StatCard><small>Новых событий</small><strong>1</strong><Muted>требует просмотра</Muted></StatCard>
        <StatCard><small>За последние 7 дней</small><strong>3</strong><Muted>без экстренных случаев</Muted></StatCard>
        <StatCard><small>Решено</small><strong>1</strong><Muted>с отметкой родственника</Muted></StatCard>
      </StatsGrid>
      <Panel>
        <SectionHead><h2>Лента событий</h2><MetaPill>Все типы</MetaPill></SectionHead>
        <Timeline>
          {healthEvents.map(item => <TimelineRow key={item.id}><div><strong>{item.title}</strong><small>{item.meta}</small></div><ToneBadge $tone={item.level === 'attention' ? 'attention' : 'info'}>{item.status}</ToneBadge></TimelineRow>)}
        </Timeline>
      </Panel>
    </>
  );
}

function SettingsView() {
  return (
    <>
      <Heading title="Настройки" subtitle="Доступ родственников и правила уведомлений" action={<Button $variant="primary"><SemanticIcon name="plus" />Пригласить родственника</Button>} />
      <ContentGrid>
        <Panel>
          <SectionHead><div><h2>Родственники и роли</h2><Muted>Доступ привязан к карточке Сергея</Muted></div></SectionHead>
          <SettingList>
            <RoleCard><Avatar><SemanticIcon name="profile" /></Avatar><div><strong>Валерий Попов</strong><Muted>Может просматривать данные и управлять лекарствами</Muted></div><ToneBadge $tone="info">Близкий</ToneBadge></RoleCard>
            <RoleCard><Avatar><SemanticIcon name="family" /></Avatar><div><strong>Сергей Попов</strong><Muted>Владелец данных в мобильном приложении</Muted></div><ToneBadge $tone="ok">Владелец</ToneBadge></RoleCard>
          </SettingList>
        </Panel>
        <Panel>
          <SectionHead><div><h2>Уведомления</h2><Muted>Экстренные события приходят всегда</Muted></div></SectionHead>
          <SettingList>
            <SettingRow><IconBubble $tone="coral"><SemanticIcon name="medication" /></IconBubble><div><strong>Пропущенное лекарство</strong><small>Если приём не отмечен вовремя</small></div><input type="checkbox" defaultChecked /></SettingRow>
            <SettingRow><IconBubble $tone="peach"><SemanticIcon name="checkup" /></IconBubble><div><strong>Проверка не пройдена</strong><small>Напомнить вечером</small></div><input type="checkbox" defaultChecked /></SettingRow>
            <SettingRow><IconBubble $tone="lavender"><SemanticIcon name="notifications" /></IconBubble><div><strong>Ежедневная сводка</strong><small>Один раз в 20:30</small></div><input type="checkbox" /></SettingRow>
          </SettingList>
        </Panel>
      </ContentGrid>
    </>
  );
}

function App() {
  const [view, setView] = useState<View>('overview');
  const [medications, setMedications] = useState(initialMedications);
  const [editing, setEditing] = useState<Medication | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Medication | null>(null);
  const [toast, setToast] = useState('');
  const [draft, setDraft] = useState({ name: '', dose: '', time: '08:00', period: 'Утро' as Medication['period'], enabled: true });

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openForm = (item?: Medication) => {
    setEditing(item ?? null);
    setDraft(item ? { name: item.name, dose: item.dose, time: item.time, period: item.period, enabled: item.enabled } : { name: '', dose: '', time: '08:00', period: 'Утро', enabled: true });
    setDialogOpen(true);
  };

  const saveMedication = (event: FormEvent) => {
    event.preventDefault();
    const normalizedDraft = { ...draft, period: getPeriodFromTime(draft.time) };
    if (editing) {
      setMedications(items => items.map(item => item.id === editing.id ? { ...item, ...normalizedDraft } : item));
      setToast('Лекарство обновлено');
    } else {
      setMedications(items => [...items, { ...normalizedDraft, id: crypto.randomUUID(), status: 'Ожидается' }]);
      setToast('Лекарство добавлено');
    }
    setDialogOpen(false);
  };

  const deleteMedication = () => {
    if (!pendingDelete) return;
    setMedications(items => items.filter(item => item.id !== pendingDelete.id));
    setToast('Лекарство удалено');
    setPendingDelete(null);
  };

  const contentByView: Record<View, ReactNode> = {
    overview: <Overview medications={medications} onOpenMedications={() => setView('medications')} />,
    medications: <MedicationsView medications={medications} onAdd={() => openForm()} onEdit={openForm} onDelete={setPendingDelete} />,
    wellness: <WellnessView />,
    metrics: <MetricsView />,
    events: <EventsView />,
    settings: <SettingsView />,
  };

  return (
    <>
      <Global styles={globalStyles} />
      <Shell>
        <Sidebar>
          <Brand><BrandMark><SemanticIcon name="brandHeart" size={23} /></BrandMark><span>Health with Love</span></Brand>
          <Nav aria-label="Основная навигация">
            {navItems.map(item => <NavButton key={item.key} $active={view === item.key} onClick={() => setView(item.key)}><SemanticIcon name={item.icon} size={21} /><span>{item.label}</span></NavButton>)}
          </Nav>
          <SidePatient><Avatar><SemanticIcon name="profile" /></Avatar><div><strong>Сергей Попов</strong><br /><span style={{ color: colors.success }}>● На связи</span></div></SidePatient>
        </Sidebar>
        <Main>
          <Topbar><PatientPicker><Avatar><SemanticIcon name="profile" /></Avatar><span>Папа · Сергей</span><SemanticIcon name="chevronRight" size={16} /></PatientPicker><IconButton aria-label="Уведомления"><SemanticIcon name="notifications" /></IconButton><RelativeChip><Avatar><SemanticIcon name="profile" /></Avatar><span>Валерий<br /><small style={{ color: colors.textSecondary }}>Родственник</small></span></RelativeChip></Topbar>
          {contentByView[view]}
        </Main>
      </Shell>

      {dialogOpen && (
        <Overlay role="presentation" onMouseDown={event => event.target === event.currentTarget && setDialogOpen(false)}>
          <Dialog role="dialog" aria-modal="true" aria-labelledby="medication-dialog-title">
            <DialogHead><h2 id="medication-dialog-title">{editing ? 'Изменить лекарство' : 'Добавить лекарство'}</h2><IconButton aria-label="Закрыть" onClick={() => setDialogOpen(false)}><SemanticIcon name="close" /></IconButton></DialogHead>
            <FormGrid onSubmit={saveMedication}>
              <Field>Название препарата<input required value={draft.name} onChange={event => setDraft(value => ({ ...value, name: event.target.value }))} placeholder="Например, Лозартан" /></Field>
              <Field>Дозировка<input required value={draft.dose} onChange={event => setDraft(value => ({ ...value, dose: event.target.value }))} placeholder="100 мг · 1 таблетка" /></Field>
              <FormColumns>
                <Field>Время приёма<input required type="time" value={draft.time} onChange={event => setDraft(value => ({ ...value, time: event.target.value, period: getPeriodFromTime(event.target.value) }))} /></Field>
                <Field>Часть дня<input readOnly value={getPeriodFromTime(draft.time)} aria-label="Часть дня определяется автоматически" /></Field>
              </FormColumns>
              <Field>Статус<select value={draft.enabled ? 'active' : 'paused'} onChange={event => setDraft(value => ({ ...value, enabled: event.target.value === 'active' }))}><option value="active">Активен</option><option value="paused">Приостановлен</option></select></Field>
              <DialogActions><Button type="button" $variant="soft" onClick={() => setDialogOpen(false)}>Отмена</Button><Button type="submit" $variant="primary">{editing ? 'Сохранить' : 'Добавить'}</Button></DialogActions>
            </FormGrid>
          </Dialog>
        </Overlay>
      )}

      {pendingDelete && (
        <Overlay>
          <Dialog role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
            <DialogHead><h2 id="delete-title">Удалить {pendingDelete.name}?</h2></DialogHead>
            <Muted>Препарат исчезнет из расписания в приложении.</Muted>
            <DialogActions><Button $variant="soft" onClick={() => setPendingDelete(null)}>Отмена</Button><Button $variant="danger" onClick={deleteMedication}>Удалить</Button></DialogActions>
          </Dialog>
        </Overlay>
      )}

      {toast && <Toast><SemanticIcon name="success" />{toast}</Toast>}
    </>
  );
}

export default App;
