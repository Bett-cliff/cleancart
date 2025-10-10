import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/app/contexts/CartContext'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoClean Kenya - Green Cleaning Supplies Marketplace',
  description: 'Kenya\'s premier marketplace for eco-friendly cleaning supplies, equipment, and professional cleaning products. Source from verified green suppliers across Kenya.',
  keywords: 'cleaning supplies, eco-friendly, Kenya, marketplace, green products, disinfectants, cleaning equipment',
  authors: [{ name: 'EcoClean Kenya' }],
  openGraph: {
    title: 'EcoClean Kenya - Green Cleaning Marketplace',
    description: 'Kenya\'s premier marketplace for eco-friendly cleaning supplies',
    type: 'website',
    locale: 'en_KE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}