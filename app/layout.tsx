import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'SEDUH BERKAH — Kopi Robusta Bengkulu & Ekosistem Digital Masjid Kampus UNIB',
  description:
    'Platform digital pendukung operasional kedai kopi Robusta Bengkulu berbasis akad mudharabah dan transparansi sedekah produktif di lingkungan Masjid Kampus Universitas Bengkulu.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#FDFBF7] text-[#2C1810] font-sans antialiased flex flex-col selection:bg-amber-200 selection:text-[#2C1810]">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
