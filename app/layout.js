import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'BorrowIt - University Peer-to-Peer Lending',
    description: 'Borrow and lend items with verified students on campus.',
};

export default function RootLayout({ children, modal }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <Navbar />
                    <main style={{ minHeight: '100vh', paddingBottom: '120px' }}>
                        {children}
                    </main>
                    {modal}
                </AuthProvider>
            </body>
        </html>
    );
}
