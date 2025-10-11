import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/app/contexts/CartContext"
import { VendorProvider } from "@/app/contexts/vendor-context"
import { QueryProviders } from "./providers"  // <-- Add this import

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CleanCart - Smart Shopping Solutions",
  description: "Kenya's premier online marketplace for quality products and supplies",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CleanCart",
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <QueryProviders>  {/* <-- Add this wrapper */}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <VendorProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </VendorProvider>
          </ThemeProvider>
        </QueryProviders>  {/* <-- Close wrapper */}
      </body>
    </html>
  )
}