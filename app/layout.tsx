import { Navbar } from "@/components/navbar"
import "./globals.css"
import { Manrope, Fraunces } from "next/font/google"
import { Footer } from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/context/cart-context"
import type { Metadata, Viewport } from "next"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" })
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: {
    default: "Cadical Solutions — Nigeria's Healthcare Supply Partner",
    template: "%s | Cadical Solutions",
  },
  description:
    "Medical equipment, pharmaceuticals, specialist services, maintenance, and procurement across Nigeria.",
  keywords: ["medical equipment", "healthcare supply", "Nigeria", "hospital equipment", "medical devices"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cadical",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    title: "Cadical Solutions",
    description: "Nigeria's leading medical equipment supply and service platform",
  },
}

export const viewport: Viewport = {
  themeColor: "#1565C0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-[#FBFAF7] text-[#1A1A18] font-sans antialiased">
        <CartProvider>
          <Navbar />
          {children}
          <WhatsAppButton />
          <Footer />
          <Toaster richColors position="top-right" />
        </CartProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
