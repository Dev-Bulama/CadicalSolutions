"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-[#e4eaf2] h-[68px] flex items-center justify-between px-4 md:px-12">

      {/* LEFT LOGO */}
      <div className="flex items-center gap-3">
        <Link href="/">
        <Image
          src={"/images/logo.png"}
          alt="logo"
          width={32}
          height={32}
          className="w-8 h-8 rounded-lg"
        />
        </Link>

        <Link href="/" className="leading-tight">
          <div className="text-[#1565C0] text-sm font-semibold">
            Cadical Solutions
          </div>
          <div className="text-[10px] text-[#6b7c93] font-light">
            Health is Wealth
          </div>
        </Link>
      </div>

      {/* DESKTOP LINKS */}
      <div className="hidden md:flex md:text-center md:justify-center gap-8 text-sm text-[#6b7c93]">
        <a href="#portals" className="hover:text-[#1565C0]">What We Offer</a>
        <a href="#services" className="hover:text-[#1565C0]">Services</a>
        <a href="#why" className="hover:text-[#1565C0]">Why Cadical</a>
        <a href="#contact" className="hover:text-[#1565C0]">Contact</a>
        <a href="#compliance" className="hover:text-[#1565C0]">Compliance</a>
        <Link href="/products?type=institutional" className="hover:text-[#1565C0]">
        <Button variant="outline" className="border border-[#1565C0] text-[#1565C0] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#1565C0] hover:text-white transition">
          Institutional Portal
        </Button>
        </Link>
      </div>

      {/* DESKTOP CTA */}
      <div className="hidden md:flex gap-3">
        <Link href={'/booking'} className="border border-[#1565C0] text-[#1565C0] px-4 py-2 rounded text-sm font-semibold hover:bg-[#1565C0] hover:text-white transition">
          Book Now
        </Link>

        <Link
          href="/products"
          className="bg-[#1565C0] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#0d47a1] transition"
        >
          Shop Now
        </Link>
      </div>

      {/* MOBILE HAMBURGER */}
      <button
        className="md:hidden text-[#1565C0]"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute top-[68px] left-0 right-0 bg-white border-b border-[#e4eaf2] shadow-lg md:hidden">
          
          <div className="flex flex-col px-6 py-4 gap-4 text-sm text-[#6b7c93]">
            <a href="#portals" onClick={() => setOpen(false)}>What We Offer</a>
            <a href="#services" onClick={() => setOpen(false)}>Services</a>
            <a href="#why" onClick={() => setOpen(false)}>Why Cadical</a>
            <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
            <a href="#compliance" onClick={() => setOpen(false)}>Compliance</a>
          </div>

          <div className="flex flex-col gap-3 px-6 pb-5">
            <button className="border border-[#1565C0] text-[#1565C0] px-4 py-2 rounded text-sm font-semibold">
              Institutional Portal
            </button>

            <Link
              href="/products"
              className="bg-[#1565C0] text-white px-4 py-2 rounded text-sm font-semibold text-center"
              onClick={() => setOpen(false)}
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Heart, Menu, ShoppingCart, X } from "lucide-react"
// import { useState } from "react"
// import Image from "next/image"
// import AuthButtons from "./auth-buttons"

// export function Navbar() {
  // const [isOpen, setIsOpen] = useState(false)
  // const [cartCount, setCartCount] = useState(0)

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href={'/'}>
//           <div className="flex items-center gap-2">
//             {/* <div className="w-8 h-8 rounded-lg flex items-center justify-center"> */}
//               {/* <span className="text-primary-foreground font-bold text-lg">C</span> */}
//               <Image 
//               src={'/images/logo.png'} 
//               alt="logo"
//               width={6} height={6} 
//               className="w-8 h-8 rounded-lg flex items-center justify-center" 
//               />
//             {/* </div> */}
//             <span className="font-bold text-lg text-foreground">cadical</span>
//           </div>
//           </Link>
//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-8">
//             {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-8">
//           <Link
//             href="/products"
//             className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
//           >
//             Products
//           </Link>
//           <Link
//             href="/products?category=EQUIPMENT"
//             className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
//           >
//             Equipment
//           </Link>
//           <Link
//             href="/products?category=CONSUMABLES"
//             className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
//           >
//             Consumables
//           </Link>
//           <Link
//             href="/products?category=PHARMACEUTICALS"
//             className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
//           >
//             Pharmaceuticals
//           </Link>
//         </div>
//             {/* <Link href="#services" className="text-sm font-medium hover:text-primary transition">
//               Services
//             </Link> */}
//             <Link href="#features" className="text-sm font-medium hover:text-primary transition">
//               About
//             </Link>
//             <Link href="#contact" className="text-sm font-medium hover:text-primary transition">
//               Contact
//             </Link>
//             <div className="flex items-center">
//             <Link
//             href="/cart"
//             className="relative p-2 hover:bg-muted rounded-lg transition-colors duration-200 group"
//           >
//             <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
//             {cartCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
//                 {cartCount}
//               </span>
//             )}
//           </Link>

//           <Link href="/account" className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 hidden md:block">
//             <Heart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
//           </Link>
//           </div>
//           </div>

//           {/* Auth Buttons */}
//           <AuthButtons />
//           {/* <div className="hidden md:flex items-center gap-3">
//             <Button variant="outline" asChild>
//               <Link href="/auth/login">Sign In</Link>
//             </Button>
//             <Button asChild>
//               <Link href="/auth/register">Register</Link>
//             </Button>
//           </div> */}

//           {/* Mobile Menu Button */}
//           <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <div className="md:hidden border-t border-border py-4 space-y-3">
//             {/* <Link href="#services" className="block text-sm font-medium hover:text-primary py-2">
//               Services
//             </Link> */}
//             <Link href="#features" className="block text-sm font-medium hover:text-primary py-2">
//               About
//             </Link>
//             <Link href="#contact" className="block text-sm font-medium hover:text-primary py-2">
//               Contact
//             </Link>
//            <div className="px-4 py-4 space-y-3">
//             <Link
//               href="/products"
//               className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
//               // onClick={() => setIsMenuOpen(false)}
//             >
//               All Products
//             </Link>
//             <Link
//               href="/products?category=EQUIPMENT"
//               className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
//               // onClick={() => setIsMenuOpen(false)}
//             >
//               Equipment
//             </Link>
//             <Link
//               href="/products?category=CONSUMABLES"
//               className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
//               // onClick={() => setIsMenuOpen(false)}
//             >
//               Consumables
//             </Link>
//             <Link
//               href="/products?category=PHARMACEUTICALS"
//               className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
//               // onClick={() => setIsMenuOpen(false)}
//             >
//               Pharmaceuticals
//             </Link>
//             <Link
//               href="/account"
//               className="block py-2 text-foreground hover:text-primary transition-colors font-medium border-t border-border pt-3"
//               // onClick={() => setIsMenuOpen(false)}
//             >
//               My Account
//             </Link>
//           </div>
//             <AuthButtons />
//           </div>
//         )}
//       </div>
//     </nav>
//   )
// }
