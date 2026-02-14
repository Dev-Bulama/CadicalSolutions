"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { AlertCircle, CheckCircle2 } from "lucide-react"
// import { auth } from "@/lib/auth"

const specializations = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Internal Medicine",
  "Surgery",
  "Dentistry",
  "Dermatology",
  "Psychiatry",
  "Ophthalmology",
  "Other",
]

export default function RegisterPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<"clinician" | "admin">("clinician")
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    // User
    email: "",
    password: "",
    passwordConfirm: "",
    // Clinician
    firstName: "",
    lastName: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    bio: "",
  })

  const validateStep1 = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return false
    }
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.specialization ||
      // !formData?.licenseNumber ||
      !formData.yearsOfExperience
    ) {
      setError("Please fill in all required fields")
      return false
    }
    return true
  }

  const handleNext = () => {
    setError("")
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateStep2()) return

    setIsLoading(true)

    try {
      // Create user
      const userResponse = await authClient.signUp.email({
       
          name: formData.firstName + formData.lastName,
          email: formData.email,
          password: formData.password,
        
      })
      // await fetch("/api/auth/sign-up", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     email: formData.email,
      //     password: formData.password,
      //   }),
      // })

      if (!userResponse) {
        throw new Error("Failed to create account")
      }

      const userData =  userResponse.data?.user;

      // Create clinician profile
      const clinicianResponse = await fetch("/api/clinician/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData?.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          specialization: formData.specialization,
          licenseNumber: formData?.licenseNumber || null,
          yearsOfExperience: Number.parseInt(formData.yearsOfExperience),
          bio: formData.bio,
        }),
      })

      if (!clinicianResponse.ok) {
        throw new Error("Failed to create clinician profile")
      }

      setSuccess("Registration successful! Redirecting to your profile...")
      setTimeout(() => {
        router.push("/clinician/profile")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            {/* <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">C</span>
            </div> */}
            <Image
              src={'/images/logo.png'} 
              alt="logo"
              width={6} height={6} 
              className="w-8 h-8 rounded-lg flex items-center justify-center" 
              />
          </div>
          <h1 className="text-3xl font-bold">Join Cadical Solutions</h1>
          <p className="text-muted-foreground">Register as a healthcare professional</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Step {step} of 2 - {step === 1 ? "Account Information" : "Professional Profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p>{error}</p>
                // <Alert variant="destructive">
                //   <AlertCircle className="h-4 w-4" />
                //   <AlertDescription>{error}</AlertDescription>
                // </Alert>
              )}

              {success && (
                <p>{success}</p>
                // <Alert className="bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400">
                //   <CheckCircle2 className="h-4 w-4" />
                //   <AlertDescription>{success}</AlertDescription>
                // </Alert>
              )}

              {step === 1 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="passwordConfirm" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      id="passwordConfirm"
                      type="password"
                      placeholder="••••••••"
                      value={formData.passwordConfirm}
                      onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="button" onClick={handleNext} className="w-full" disabled={isLoading}>
                    Next
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="specialization" className="text-sm font-medium">
                      Specialization
                    </label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(val) => setFormData({ ...formData, specialization: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="licenseNumber" className="text-sm font-medium">
                      License Number (optional)
                    </label>
                    <Input
                    type="text"
                      id="licenseNumber"
                      placeholder="LIC-001234 (Optional)"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      // required={false}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="yearsOfExperience" className="text-sm font-medium">
                      Years of Experience
                    </label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      placeholder="5"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Professional Bio
                    </label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about your professional background and expertise..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
