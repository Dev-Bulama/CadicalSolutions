"use client"
import { toast } from "sonner"
import { ProductCard } from "./product-card"
import { useEffect, useState } from "react"
import { useCart } from "@/context/cart-context"

interface Product {
  id: string
  name: string
  price: number
  category: 'EQUIPMENT' | 'CONSUMABLES' | 'PHARMACEUTICALS'
  stock: number
  description?: string
  image?: string
}

export default function FeaturedProduct () {
      const [products, setProducts] = useState<Product[]>([]);
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
    
      const { addToCart } = useCart()
      useEffect(() => {
        // Fetch products from the API
        fetch('/api/products')
          .then(response => response.json())
          .then(data => setProducts(data))
          .catch(error => {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products');
          })
          .finally(() => setLoading(false));
    
      }, []);
    
      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error}</div>;
      }
      return (
        <div className="bg-neutral-100">
        <h2 className="text-3xl text-blue-600 p-4 px-8">Featured Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4 px-8 ">
        
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            category={product.category}
            stock={product.stock}
            image={product.image}
            onAddToCart={() => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    })

    toast.success(
      `${product.name} added to cart`
    )
  }}
          />
        ))}
      </div>
      </div>
      )
}