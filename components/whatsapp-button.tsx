"use client"

import { MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function WhatsAppButton() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const link = `https://wa.me/2347076175550?text=${encodeURIComponent("Hi! I'd like to make an enquiry.")}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed right-4 z-[55] transition-all duration-300 ${isMobile ? "bottom-[90px]" : "bottom-6"}`}
    >
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-25" />
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:scale-110 transition-transform">
          <MessageCircle size={22} />
        </div>
      </div>
    </a>
  )
}
