"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, ShoppingCart, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import AuthButtons from "./auth-buttons"

export function ProductNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  return (
    <nav className="mt-12  z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            
            
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
           
           <div className="px-4 py-4 space-y-3">
           
           
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