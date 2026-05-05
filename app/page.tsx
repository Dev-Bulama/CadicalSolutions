"use client";

import Compliance from "@/components/home/Compliance";
import Consent from "@/components/home/Consent";
import Coverage from "@/components/home/Coverage";
import CTA from "@/components/home/cta";
import Hero from "@/components/home/hero";
import Portals from "@/components/home/portals";
import Process from "@/components/home/process";
import Services from "@/components/home/services";
import Why from "@/components/home/why";
import { ProductCard } from "@/components/product-card";
// import Compliance from "@/components/home/compliance";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Product {
  id: string
  name: string
  price: number
  category: 'EQUIPMENT' | 'CONSUMABLES' | 'PHARMACEUTICALS'
  stock: number
  description?: string
  image?: string
}

export default function Home() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    <main className="font-sans text-[#1a2332] bg-white overflow-x-hidden">

     <Hero />

      <Portals />

      {/* WHY */}
      <Why />

      {/* SERVICES */}
      <Services />

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            category={product.category}
            stock={product.stock}
            onAddToCart={function (productId: string): void {
              throw new Error("Function not implemented.");
            }}
          />
        ))}
      </div>

      {/* PROCESS */}
      <Process />

      {/* CTA */}
      <CTA />

      {/* Compliance */}
      <Compliance />

      {/* Consent */}
      <Consent />

      {/* Coverage */}
      <Coverage />

    </main>
  );
}