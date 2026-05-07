'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, ShoppingCart, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image?: string | null
  // category: 'EQUIPMENT' | 'CONSUMABLES' | 'PHARMACEUTICALS'
  category: string
  stock: number
  onAddToCart: (productId: string) => void
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  stock,
  onAddToCart,
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      onAddToCart(id)
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  const categoryColors = {
    EQUIPMENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    CONSUMABLES: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    PHARMACEUTICALS: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100',
  }

  const categoryLabels = {
    EQUIPMENT: 'Equipment',
    CONSUMABLES: 'Consumables',
    PHARMACEUTICALS: 'Pharmaceuticals',
  }

  return (
    <div className="group h-full flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <Zap className="h-12 w-12 text-primary/30" />
          </div>
        )}

        {/* Stock Badge */}
        {stock < 10 && stock > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            Only {stock} left
          </div>
        )}

        {stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}

        {/* Quick Action Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 left-3 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Heart
            className={`h-5 w-5 transition-all ${isLiked ? 'fill-current text-red-500' : ''}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category Badge */}
        <div className="mb-2">
          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full `}>
            {/* {categoryLabels[category]} */}
            {category}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-base text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-primary">
            N{price.toFixed(2)}
          </p>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={stock === 0 || isAdding}
          className="w-full gap-2 mt-auto group/btn"
        >
          <ShoppingCart className="h-4 w-4 group-hover/btn:animate-bounce" />
          {isAdding ? 'Adding...' : stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}
