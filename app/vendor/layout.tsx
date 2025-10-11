// app/vendor/layout.tsx
"use client"

import { VendorAuthProvider } from "@/contexts/vendor-auth-context"
import { VendorLayoutContent } from "./vendor-layout-content"

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <VendorAuthProvider>
      <VendorLayoutContent>
        {children}
      </VendorLayoutContent>
    </VendorAuthProvider>
  )
}