import type { Metadata } from 'next';
import { Rubik, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/lib/theme';
import './globals.css';

const rubik = Rubik({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-rubik',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OrionMenu — قائمة المطعم',
  description: 'تفضل بتصفح قائمة مطعمنا وأرسل طلبك مباشرةً عبر واتساب',
  icons: { icon: [] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${rubik.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:," />
      </head>
      <body
        className="min-h-screen antialiased"
        style={{ fontFamily: 'var(--font-rubik), Tajawal, Cairo, system-ui, sans-serif', background: '#060402', color: '#F0DDB8' }}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1C1510',
                color: '#F0DDB8',
                border: '1px solid rgba(255,106,0,.22)',
                fontFamily: 'var(--font-rubik), system-ui, sans-serif',
                direction: 'rtl',
                boxShadow: '0 4px 20px rgba(0,0,0,.55)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
