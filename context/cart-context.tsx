'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  image?: string | null
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (
    id: string,
    quantity: number
  ) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext =
  createContext<CartContextType | null>(
    null
  )

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [cartItems, setCartItems] = useState<
    CartItem[]
  >([])

  // ==========================================
  // LOAD CART
  // ==========================================

  useEffect(() => {
    const storedCart =
      localStorage.getItem('cart')

    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  // ==========================================
  // SAVE CART
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      'cart',
      JSON.stringify(cartItems)
    )
  }, [cartItems])

  // ==========================================
  // ADD TO CART
  // ==========================================

  function addToCart(
    product: Omit<CartItem, 'quantity'>
  ) {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id
      )

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ]
    })
  }

  // ==========================================
  // REMOVE
  // ==========================================

  function removeFromCart(id: string) {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    )
  }

  // ==========================================
  // UPDATE QTY
  // ==========================================

  function updateQuantity(
    id: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    )
  }

  // ==========================================
  // CLEAR
  // ==========================================

  function clearCart() {
    setCartItems([])
  }

  // ==========================================
  // TOTALS
  // ==========================================

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
  }, [cartItems])

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    )
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}