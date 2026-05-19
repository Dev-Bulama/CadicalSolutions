"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState("")

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", passwordConfirm: "",
  })

  const set = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Please fill in all fields"); return
    }
    if (form.password !== form.passwordConfirm) {
      setError("Passwords do not match"); return
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters"); return
    }
    setIsLoading(true)
    try {
      const { error: authError } = await authClient.signUp.email({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
      })
      if (authError) { setError(authError.message ?? "Registration failed"); return }
      toast.success("Account created! Redirecting…")
      router.push("/products")
    } catch {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-colors disabled:bg-slate-50"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <Image src="/images/logo.png" alt="Cadical" width={40} height={40} className="w-10 h-10 rounded-xl" />
            <div className="text-left">
              <div className="text-[#1565C0] font-bold text-base">Cadical Solutions</div>
              <div className="text-slate-400 text-xs">Right Supply. Right Time.</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join Nigeria's healthcare supply platform</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                <input type="text" value={form.firstName} onChange={e => set("firstName", e.target.value)}
                  placeholder="John" required disabled={isLoading} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                <input type="text" value={form.lastName} onChange={e => set("lastName", e.target.value)}
                  placeholder="Doe" required disabled={isLoading} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="you@example.com" required disabled={isLoading} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
                placeholder="Min. 8 characters" required disabled={isLoading} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input type="password" value={form.passwordConfirm} onChange={e => set("passwordConfirm", e.target.value)}
                placeholder="••••••••" required disabled={isLoading} className={inputClass} />
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-[#1565C0] hover:bg-[#0d47a1] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors mt-2">
              {isLoading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#1565C0] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          By registering you agree to our{" "}
          <Link href="/terms" className="underline hover:text-slate-600">Terms</Link> and{" "}
          <Link href="/privacy-policy" className="underline hover:text-slate-600">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
