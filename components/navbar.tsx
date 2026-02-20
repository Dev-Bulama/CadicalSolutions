"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, ShoppingCart, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import AuthButtons from "./auth-buttons"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={'/'}>
          <div className="flex items-center gap-2">
            {/* <div className="w-8 h-8 rounded-lg flex items-center justify-center"> */}
              {/* <span className="text-primary-foreground font-bold text-lg">C</span> */}
              <Image 
              src={'/images/logo.png'} 
              alt="logo"
              width={6} height={6} 
              className="w-8 h-8 rounded-lg flex items-center justify-center" 
              />
            {/* </div> */}
            <span className="font-bold text-lg text-foreground">cadical</span>
          </div>
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
          >
            Products
          </Link>
          <Link
            href="/products?category=EQUIPMENT"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
          >
            Equipment
          </Link>
          <Link
            href="/products?category=CONSUMABLES"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
          >
            Consumables
          </Link>
          <Link
            href="/products?category=PHARMACEUTICALS"
            className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-sm"
          >
            Pharmaceuticals
          </Link>
        </div>
            {/* <Link href="#services" className="text-sm font-medium hover:text-primary transition">
              Services
            </Link> */}
            <Link href="#features" className="text-sm font-medium hover:text-primary transition">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition">
              Contact
            </Link>
            <div className="flex items-center">
            <Link
            href="/cart"
            className="relative p-2 hover:bg-muted rounded-lg transition-colors duration-200 group"
          >
            <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/account" className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 hidden md:block">
            <Heart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
          </Link>
          </div>
          </div>

          {/* Auth Buttons */}
          <AuthButtons />
          {/* <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Register</Link>
            </Button>
          </div> */}

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            {/* <Link href="#services" className="block text-sm font-medium hover:text-primary py-2">
              Services
            </Link> */}
            <Link href="#features" className="block text-sm font-medium hover:text-primary py-2">
              About
            </Link>
            <Link href="#contact" className="block text-sm font-medium hover:text-primary py-2">
              Contact
            </Link>
           <div className="px-4 py-4 space-y-3">
            <Link
              href="/products"
              className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
              // onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              href="/products?category=EQUIPMENT"
              className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
              // onClick={() => setIsMenuOpen(false)}
            >
              Equipment
            </Link>
            <Link
              href="/products?category=CONSUMABLES"
              className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
              // onClick={() => setIsMenuOpen(false)}
            >
              Consumables
            </Link>
            <Link
              href="/products?category=PHARMACEUTICALS"
              className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
              // onClick={() => setIsMenuOpen(false)}
            >
              Pharmaceuticals
            </Link>
            <Link
              href="/account"
              className="block py-2 text-foreground hover:text-primary transition-colors font-medium border-t border-border pt-3"
              // onClick={() => setIsMenuOpen(false)}
            >
              My Account
            </Link>
          </div>
            <AuthButtons />
          </div>
        )}
      </div>
    </nav>
  )
}
