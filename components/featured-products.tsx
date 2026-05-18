"use client"

import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useCart } from "@/context/cart-context"
import Link from "next/link"
import { ShoppingCart, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  description?: string
  image?: string
}

function formatPrice(p: number) {
  return "₦" + p.toLocaleString("en-NG")
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-4/5" />
        <div className="h-4 bg-slate-100 rounded w-3/5" />
        <div className="h-8 bg-slate-100 rounded mt-4" />
      </div>
    </div>
  )
}

export default function FeaturedProduct() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const { addToCart }           = useCart()

  useEffect(() => {
    fetch("/api/products?limit=8")
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d.slice(0, 8) : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#1565C0] text-xs font-semibold uppercase tracking-widest mb-2">MediStore</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Products</h2>
          </div>
          <Link href="/products" className="text-sm text-[#1565C0] font-semibold hover:underline hidden sm:flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image placeholder */}
                  <div className="relative h-44 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center overflow-hidden">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-300 text-5xl font-bold font-serif select-none">
                        {p.category?.charAt(0)}
                      </div>
                    )}
                    <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                    }`}>
                      {p.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-[10px] font-semibold text-[#1565C0] uppercase tracking-wider mb-1">{p.category}</p>
                    <h3 className="text-sm font-semibold text-slate-900 leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">{p.name}</h3>
                    <p className="text-base font-bold text-slate-900 mb-3">{formatPrice(p.price)}</p>
                    <button
                      onClick={() => {
                        addToCart({ id: p.id, name: p.name, price: p.price, category: p.category, image: p.image })
                        toast.success(`${p.name} added to cart`)
                      }}
                      disabled={p.stock === 0}
                      className="w-full flex items-center justify-center gap-2 bg-[#1565C0] hover:bg-[#0d47a1] disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      <ShoppingCart size={13} /> Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))
          }
        </div>

        <div className="sm:hidden mt-8 text-center">
          <Link href="/products" className="inline-flex items-center gap-1 text-sm text-[#1565C0] font-semibold hover:underline">
            View all products <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  )
}
