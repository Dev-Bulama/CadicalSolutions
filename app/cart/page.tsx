'use client'

import Link from 'next/link'

import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from 'lucide-react'

// import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useCart } from '@/context/cart-context'

import { useState } from 'react'
import { toast } from 'sonner'

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart()

  const [couponCode, setCouponCode] =
    useState('')

  const [discount, setDiscount] =
    useState(0)

  // ==========================================
  // COUPON
  // ==========================================

  function applyCoupon() {
    if (
      couponCode.trim().toUpperCase() ===
      'CADICAL10'
    ) {
      setDiscount(10)

      toast.success(
        'Coupon applied successfully'
      )
    } else {
      toast.error('Invalid coupon code')
    }
  }

  // ==========================================
  // TOTALS
  // ==========================================

  const discountAmount =
    subtotal * (discount / 100)

  const tax =
    (subtotal - discountAmount) * 0.1

  const total =
    subtotal - discountAmount + tax

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />

            <h1 className="text-3xl font-bold">
              Your cart is empty
            </h1>

            <p className="text-muted-foreground mt-3 mb-6">
              Add products to continue
            </p>

            <Link href="/products">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* <Footer /> */}
      </div>
    )
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CART ITEMS */}

          <section className="mt-8 lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-2xl p-5 bg-card"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {item.name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>

                    <p className="mt-2 text-primary font-bold text-xl">
                      ₦
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* CONTROLS */}

                  <div className="flex flex-col items-end gap-4">
                    <button
                      onClick={() => {
                        removeFromCart(item.id)

                        toast.success(
                          'Removed from cart'
                        )
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3 border rounded-lg p-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-6 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* SUMMARY */}

          <aside className="border rounded-2xl bg-card p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            {/* COUPON */}

            <div className="space-y-2 mb-6">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) =>
                  setCouponCode(e.target.value)
                }
              />

              <Button
                variant="outline"
                className="w-full"
                onClick={applyCoupon}
              >
                Apply Coupon
              </Button>
            </div>

            {/* TOTALS */}

            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>
                  ₦
                  {subtotal.toLocaleString()}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount ({discount}%)
                  </span>

                  <span>
                    -₦
                    {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Tax</span>

                <span>
                  ₦{tax.toLocaleString()}
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>

                <span>
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CHECKOUT */}

            <Link href="/checkout">
              <Button className="w-full mt-6 gap-2">
                Checkout

                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </aside>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  )
}