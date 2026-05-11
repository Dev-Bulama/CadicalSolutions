'use client'

import { useState } from 'react'
// import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Package, Heart, LogOut, Edit2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/navbar'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  date: string
  total: number
  status: 'processing' | 'shipped' | 'delivered'
  items: number
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'CAD-2024001',
    date: '2024-01-15',
    total: 219.96,
    status: 'delivered',
    items: 3,
  },
  {
    id: '2',
    orderNumber: 'CAD-2024002',
    date: '2024-01-10',
    total: 89.99,
    status: 'shipped',
    items: 1,
  },
  {
    id: '3',
    orderNumber: 'CAD-2024003',
    date: '2024-01-05',
    total: 149.97,
    status: 'processing',
    items: 2,
  },
]

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [email, setEmail] = useState('john@example.com')
  const [firstName, setFirstName] = useState('John')
  const [lastName, setLastName] = useState('Doe')
  const [phone, setPhone] = useState('+234 801 234 5678')
  const [address, setAddress] = useState('123 Medical Street, Lagos')

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully')
    setIsEditing(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    toast.success('Logged out successfully')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto w-full px-4 py-16">
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <User className="h-16 w-16 text-muted-foreground/30 mx-auto" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Please Log In
            </h1>
            <p className="text-muted-foreground max-w-md">
              Sign in to view your orders and manage your account
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg">Sign In</Button>
              <Button size="lg" variant="outline">
                Create Account
              </Button>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              My Account
            </h1>
            <p className="text-muted-foreground">Manage your profile and orders</p>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4 hidden sm:block" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4 hidden sm:block" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="h-4 w-4 hidden sm:block" />
              <span>Wishlist</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 text-center space-y-4">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {firstName} {lastName}
                    </h3>
                    <p className="text-muted-foreground text-sm">{email}</p>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit2 className="h-5 w-5 text-primary" />
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSaveProfile()
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            First Name
                          </label>
                          <Input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Last Name
                          </label>
                          <Input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Phone</label>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Address</label>
                        <Input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="gap-2">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">First Name</p>
                          <p className="text-foreground font-semibold">{firstName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Last Name</p>
                          <p className="text-foreground font-semibold">{lastName}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Email</p>
                          <p className="text-foreground font-semibold">{email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Phone</p>
                          <p className="text-foreground font-semibold">{phone}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Address</p>
                        <p className="text-foreground font-semibold">{address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-4">
              {MOCK_ORDERS.map((order, idx) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-foreground">{order.orderNumber}</h3>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.items} item{order.items !== 1 ? 's' : ''} • {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-4">
                      <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                      <Link href={`/order/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start adding your favorite products to your wishlist by clicking the heart icon on product cards.
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
