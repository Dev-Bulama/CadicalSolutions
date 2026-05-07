'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Footer } from '@/components/footer'
import { ProductNavbar } from '@/components/product-navbar'
import { ProductCard } from '@/components/product-card'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import {
  Search,
  Filter,
  X,
} from 'lucide-react'

// ======================================================
// TYPES
// ======================================================

interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  description?: string | null
  image?: string | null
}

// ======================================================
// CONSTANTS
// ======================================================

const MAX_PRICE = 5000000

const categories = [
  {
    label: 'All Categories',
    value: null,
  },
  {
    label: 'MediStore',
    value: 'medistore',
  },
  {
    label: 'Institutional',
    value: 'institutional',
  },
]

// ======================================================
// PAGE CONTENT
// ======================================================

function ProductsContent() {
  const searchParams = useSearchParams()

  // ======================================================
  // URL FILTER
  // ======================================================

  const initialCategory =
    searchParams.get('category')

  // ======================================================
  // STATE
  // ======================================================

  const [products, setProducts] = useState<Product[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(
    null
  )

  const [showFilters, setShowFilters] =
    useState(false)

  const [searchQuery, setSearchQuery] =
    useState('')

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(initialCategory)

  const [priceRange, setPriceRange] = useState<
    [number, number]
  >([0, MAX_PRICE])

  // ======================================================
  // ACTIVE FILTERS
  // ======================================================

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedCategory !== null ||
      priceRange[0] > 0 ||
      priceRange[1] < MAX_PRICE
    )
  }, [searchQuery, selectedCategory, priceRange])

  // ======================================================
  // FETCH PRODUCTS
  // ======================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        setError(null)

        const params = new URLSearchParams()

        // CATEGORY

        if (selectedCategory) {
          params.append(
            'category',
            selectedCategory
          )
        }

        // SEARCH

        if (searchQuery.trim()) {
          params.append(
            'search',
            searchQuery.trim()
          )
        }

        // PRICE FILTERS
        // only send if changed

        if (priceRange[0] > 0) {
          params.append(
            'minPrice',
            String(priceRange[0])
          )
        }

        if (priceRange[1] < MAX_PRICE) {
          params.append(
            'maxPrice',
            String(priceRange[1])
          )
        }

        const query = params.toString()

        const endpoint = query
          ? `/api/products?${query}`
          : '/api/products'

        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(
            'Failed to fetch products'
          )
        }

        const data = await response.json()

        console.log('API RESPONSE:', data)

        setProducts(data)
      } catch (err) {
        console.error(err)

        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong'
        )

        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(
      fetchProducts,
      300
    )

    return () => clearTimeout(timeoutId)
  }, [
    searchQuery,
    selectedCategory,
    priceRange,
  ])

  // ======================================================
  // CLEAR FILTERS
  // ======================================================

  function clearFilters() {
    setSearchQuery('')
    setSelectedCategory(null)
    setPriceRange([0, MAX_PRICE])
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProductNavbar />

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="border-b bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold tracking-tight">
            Our Products
          </h1>

          <p className="mt-3 text-muted-foreground max-w-2xl">
            Explore medical equipment,
            consumables, and healthcare
            products built for modern care.
          </p>
        </div>
      </section>

      {/* ====================================================== */}
      {/* CONTENT */}
      {/* ====================================================== */}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ====================================================== */}
          {/* FILTERS */}
          {/* ====================================================== */}

          <aside
            className={`lg:block ${
              showFilters ? 'block' : 'hidden'
            }`}
          >
            <div className="border rounded-2xl bg-card p-6 space-y-6 sticky top-24">
              {/* MOBILE HEADER */}

              <div className="flex items-center justify-between lg:hidden">
                <h2 className="font-semibold text-lg">
                  Filters
                </h2>

                <button
                  onClick={() =>
                    setShowFilters(false)
                  }
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* SEARCH */}

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Search
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(
                        e.target.value
                      )
                    }
                    placeholder="Search products..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* CATEGORY */}

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Category
                </label>

                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={
                        category.value ?? 'all'
                      }
                      onClick={() =>
                        setSelectedCategory(
                          category.value
                        )
                      }
                      className={`w-full rounded-lg px-4 py-2 text-left transition-all ${
                        selectedCategory ===
                        category.value
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRICE */}

              <div className="space-y-3">
                <label className="text-sm font-medium block">
                  Max Price:
                </label>

                <p className="text-sm text-muted-foreground">
                  ₦{priceRange[1].toLocaleString()}
                </p>

                <input
                  type="range"
                  min="0"
                  max={MAX_PRICE}
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      0,
                      Number(e.target.value),
                    ])
                  }
                  className="w-full"
                />
              </div>

              {/* CLEAR */}

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </aside>

          {/* ====================================================== */}
          {/* PRODUCTS */}
          {/* ====================================================== */}

          <section className="lg:col-span-3">
            {/* MOBILE FILTER BUTTON */}

            <div className="flex items-center justify-between mb-6 lg:hidden">
              <p className="text-sm text-muted-foreground">
                {products.length} products
              </p>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  setShowFilters(!showFilters)
                }
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* LOADING */}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-80 rounded-2xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              // ERROR
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />

                <h3 className="text-xl font-semibold">
                  Failed to load products
                </h3>

                <p className="text-muted-foreground mt-2">
                  {error}
                </p>
              </div>
            ) : products.length === 0 ? (
              // EMPTY
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />

                <h3 className="text-xl font-semibold">
                  No products found
                </h3>

                <p className="text-muted-foreground mt-2 mb-6">
                  Try changing your search or
                  filters.
                </p>

                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              // PRODUCTS
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {products.length}{' '}
                    product
                    {products.length !== 1
                      ? 's'
                      : ''}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map(
                    (product, index) => (
                      <div
                        key={product.id}
                        className="animate-in fade-in slide-in-from-bottom-4"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <ProductCard
                          {...product}
                          onAddToCart={() =>
                            console.log(
                              'Added to cart'
                            )
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// ======================================================
// PAGE
// ======================================================

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background" />
      }
    >
      <ProductsContent />
    </Suspense>
  )
}