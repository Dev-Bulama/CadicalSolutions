'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, ShoppingCart, Package } from 'lucide-react'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image?: string | null
  category: string
  stock: number
  onAddToCart: (productId: string) => void
}

const CAT_COLORS: Record<string, string> = {
  Imaging:        "bg-blue-50 text-blue-700",
  Diagnostics:    "bg-emerald-50 text-emerald-700",
  ICU:            "bg-red-50 text-red-700",
  Surgery:        "bg-violet-50 text-violet-700",
  Laboratory:     "bg-amber-50 text-amber-700",
  Monitoring:     "bg-cyan-50 text-cyan-700",
  Dental:         "bg-pink-50 text-pink-700",
  Rehabilitation: "bg-orange-50 text-orange-700",
  Consumables:    "bg-slate-100 text-slate-600",
}

function formatPrice(p: number) {
  return "₦" + p.toLocaleString("en-NG")
}

export function ProductCard({ id, name, price, image, category, stock, onAddToCart }: ProductCardProps) {
  const [liked, setLiked]     = useState(false)
  const [adding, setAdding]   = useState(false)

  const handleAdd = () => {
    if (adding || stock === 0) return
    setAdding(true)
    onAddToCart(id)
    setTimeout(() => setAdding(false), 600)
  }

  const badgeClass = CAT_COLORS[category] ?? "bg-slate-100 text-slate-600"

  return (
    <div className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden flex items-center justify-center">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <Package className="h-10 w-10 text-slate-200" />
        )}

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart size={13} className={liked ? "fill-red-500 text-red-500" : "text-slate-400"} />
        </button>

        {/* Stock */}
        {stock === 0 ? (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border">Out of Stock</span>
          </div>
        ) : stock < 5 ? (
          <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Only {stock} left
          </span>
        ) : (
          <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            In Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <span className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${badgeClass}`}>
          {category}
        </span>

        <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-snug mb-2 flex-1 group-hover:text-[#1565C0] transition-colors">
          {name}
        </h3>

        <p className="text-lg font-bold text-slate-900 mb-3">{formatPrice(price)}</p>

        <button
          onClick={handleAdd}
          disabled={stock === 0 || adding}
          className="w-full flex items-center justify-center gap-2 bg-[#1565C0] hover:bg-[#0d47a1] disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-semibold py-2.5 rounded-xl transition-all"
        >
          <ShoppingCart size={13} className={adding ? "animate-bounce" : ""} />
          {adding ? "Adding…" : stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}
