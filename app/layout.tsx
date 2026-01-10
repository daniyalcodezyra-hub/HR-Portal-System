import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
    themeColor: '#000000',
};

export const metadata: Metadata = {
    title: 'Codezyra | Enterprise Attendance Portal',
    description: 'HR and Employee Attendance Management System',
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
        apple: '/pwa-192x192.png',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Attendance Portal',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <AuthProvider>
                    {children}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </AuthProvider>
            </body>
        </html>
    );
}
