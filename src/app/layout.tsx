import { Outfit } from 'next/font/google';
import './global.css';
import "flatpickr/dist/flatpickr.css";

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

import ReduxProvider from '@/redux/provider';
import AuthProvider from '@/context/authProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          
            <SidebarProvider>
              {children}
            </SidebarProvider>
            {/* </AuthProvider>
          </ReduxProvider> */}
        </ThemeProvider>
      </body>
    </html>
  );
}