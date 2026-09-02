import type { ReactNode } from 'react';

export const metadata = {
  title: 'Health with Love — Кабинет семьи',
  description: 'Семейная панель контроля здоровья и приёма лекарств',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
