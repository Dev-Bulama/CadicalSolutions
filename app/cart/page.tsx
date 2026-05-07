'use client'

import { useState } from 'react'
import Link from 'next/link'
// import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  // category: 'EQUIPMENT' | 'CONSUMABLES' | 'PHARMACEUTICALS'
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id)
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
    toast.success('Item removed from cart')
  }

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'CADICAL10') {
      setDiscount(10)
      toast.success('Coupon applied! 10% discount')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = subtotal * (discount / 100)
  const tax = (subtotal - discountAmount) * 0.1
  const total = subtotal - discountAmount + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* <Header /> */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto w-full px-4 py-16">
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mx-auto" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground max-w-md">
              Start shopping to add items to your cart
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Continue Shopping
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* <Header /> */}

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Shopping Cart</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg p-4 bg-card hover:border-primary/50 transition-all duration-300 animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Category: {item.category}
                      </p>
                      <p className="text-xl font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-background rounded transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-background rounded transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6 sticky top-24 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

              {/* Coupon Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button onClick={applyCoupon} variant="outline">
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: Try "CADICAL10" for 10% off
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-foreground">Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="w-full">
                <Button size="lg" className="w-full gap-2 group">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="space-y-2 text-xs text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/20" />
                  Secure checkout
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/20" />
                  Fast delivery
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/20" />
                  Easy returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
