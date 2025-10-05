import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { VendorProvider } from '@/contexts/vendor-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CleanCart - Eco-Friendly Cleaning Supplies',
  description: 'Kenya\'s premier eco-friendly cleaning supplies marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VendorProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
          </ThemeProvider>
        </VendorProvider>
      </body>
    </html>
  )
}