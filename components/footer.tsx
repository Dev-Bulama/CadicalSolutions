import Image from "next/image"
import Link from "next/link"

const LINKS = {
  Products: [
    { label: "All Products",     href: "/products" },
    { label: "Imaging",          href: "/products?category=Imaging" },
    { label: "Diagnostics",      href: "/products?category=Diagnostics" },
    { label: "ICU Equipment",    href: "/products?category=ICU" },
    { label: "Surgical",         href: "/products?category=Surgery" },
    { label: "Consumables",      href: "/products?category=Consumables" },
  ],
  Services: [
    { label: "Equipment Repair",     href: "/booking" },
    { label: "Maintenance Plans",    href: "/booking" },
    { label: "Calibration",          href: "/booking" },
    { label: "Supply Consultation",  href: "/booking" },
  ],
  Company: [
    { label: "About",           href: "/about" },
    { label: "Contact",         href: "/contact" },
    { label: "Referrals",       href: "/referrals" },
    { label: "Become Supplier", href: "/auth/register" },
  ],
  Legal: [
    { label: "Privacy Policy",  href: "/privacy-policy" },
    { label: "Terms of Use",    href: "/terms" },
  ],
}

const SOCIALS = [
  { src: "/images/instagram.png", href: "https://www.instagram.com/cadicalsolutions", alt: "Instagram" },
  { src: "/images/twitter.png",   href: "https://x.com/CadicalSolution",            alt: "X (Twitter)" },
  { src: "/images/linkedin.png",  href: "https://www.linkedin.com/company/cadical-solutions/", alt: "LinkedIn" },
  { src: "/images/facebook.png",  href: "https://www.facebook.com/share/1CMA1c1Czi/", alt: "Facebook" },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image src="/images/logo.png" alt="Cadical" width={32} height={32} className="w-8 h-8 rounded-lg" />
              <div>
                <div className="text-white text-sm font-bold">Cadical Solutions</div>
                <div className="text-[10px] text-slate-500">Right Supply. Right Time.</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-5">
              Nigeria's trusted medical equipment supply and service platform.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(s => (
                <Link key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <Image src={s.src} alt={s.alt} width={16} height={16} className="opacity-70 hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-white font-semibold text-sm mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm hover:text-white transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Cadical Solutions Limited. All rights reserved. RC 8969474</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
