import { ReactNode } from 'react';
import '@/app/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro" className="scroll-smooth">
      <body className="overflow-x-hidden bg-brand-black text-brand-white antialiased">
        {children}
      </body>
    </html>
  );
}