'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-lg text-slate-600">Welcome back. Here's what's happening with your business today.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/bookings" className="group">
            <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:border-blue-500 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-slate-900">Bookings</CardTitle>
                <CardDescription>Manage and view all bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">View, create, and manage all your bookings in one place</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/products" className="group">
            <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:border-green-500 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8-4m0 0l8 4m0 0v10l-8 4m0 0l-8-4m0 0v-10l8-4m0 0l8 4" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-slate-900">Products</CardTitle>
                <CardDescription>Manage and view all products</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">Update inventory, prices, and product information</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}