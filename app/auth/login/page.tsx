"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"

const ROLE_REDIRECT: Record<string, string> = {
  superadmin:  "/admin/dashboard",
  admin:       "/admin/dashboard",
  technician:  "/technician/jobs",
  clinician:   "/clinician/dashboard",
  supplier:    "/supplier/dashboard",
  vendor:      "/supplier/dashboard",
  hospital:    "/products",
  customer:    "/products",
  user:        "/products",
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
      })

      if (authError) {
        setError(authError.message ?? "Invalid email or password")
        return
      }

      if (data?.user) {
        const role = (data.user as any).role ?? "user"
        const dest = ROLE_REDIRECT[role] ?? "/products"
        router.push(dest)
        router.refresh()
      }
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <Image src="/images/logo.png" alt="Cadical" width={40} height={40} className="w-10 h-10 rounded-xl" />
            <div className="text-left">
              <div className="text-[#1565C0] font-bold text-base">Cadical Solutions</div>
              <div className="text-slate-400 text-xs">Right Supply. Right Time.</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-colors disabled:bg-slate-50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-[#1565C0] hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-colors disabled:bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1565C0] hover:bg-[#0d47a1] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors"
            >
              {isLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-[#1565C0] font-semibold hover:underline">Create account</Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-700 mb-2">Demo credentials</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-slate-500">Admin:</span><span className="font-mono">admin@cadical.com</span>
            <span className="text-slate-500">Technician:</span><span className="font-mono">technician@cadical.com</span>
            <span className="text-slate-500">Supplier:</span><span className="font-mono">supplier@cadical.com</span>
            <span className="text-slate-500">Password:</span><span className="font-mono font-bold text-[#1565C0]">Cadical@2026</span>
          </div>
        </div>

      </div>
    </div>
  )
}
