import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/app/components/layouts/Header'
import Footer from '@/app/components/layouts/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FoodGenius - Recettes personnalisées avec analyse nutritionnelle',
  description: 'Générez et gérez des recettes personnalisées avec une analyse nutritionnelle complète',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}