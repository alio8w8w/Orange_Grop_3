// app/layout.tsx
import { ReactNode } from 'react';
import '@/app/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden bg-brand-black text-brand-white">
        {children}
      </body>
    </html>
  );
}