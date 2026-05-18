import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"

export default function CTA() {
  return (
    <section id="contact" className="py-20 px-4 md:px-8 bg-[#0D47A1] relative overflow-hidden">
      {/* Grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(245,166,35,0.12)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="inline-block text-white/80 text-xs font-semibold tracking-widest uppercase border border-white/20 bg-white/10 px-4 py-1.5 rounded-full mb-6">
          Get Started Today
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight font-serif">
          Ready to work with Nigeria's most reliable medical supply partner?
        </h2>

        <p className="text-white/65 mb-10 text-base leading-relaxed max-w-lg mx-auto">
          Open a free account and get access to 100+ certified products, institutional pricing, and a dedicated support team.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/auth/register"
            className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#e0962a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 shadow-lg"
          >
            Open Free Account <ArrowRight size={15} />
          </Link>
          <a
            href="https://wa.me/2347076175550"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            <MessageCircle size={15} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
