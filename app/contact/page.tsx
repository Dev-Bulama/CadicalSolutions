"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin } from "lucide-react"

// export const metadata = {
//   title: "Contact Cadical | Healthcare Products & Medical Staffing",
//   description:
//     "Get in touch with Cadical for trusted health products and professional medical staffing solutions.",
// }

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Connect to API endpoint
    setTimeout(() => {
      setLoading(false)
      alert("Message sent successfully!")
    }, 1500)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/40 dark:to-muted/20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20">
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl top-20 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-secondary/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse" />
      </div>

      {/* Header */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch With Cadical
          </h1>
          <p className="text-muted-foreground text-lg">
            Whether you need reliable health products or qualified medical
            professionals, our team is ready to assist you.
          </p>
        </motion.div>
      </section>

      {/* Contact Content */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="rounded-2xl shadow-xl">
            <CardContent className="p-10">
              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-2xl"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8 flex items-start gap-4">
                <Mail className="w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground text-sm">
                    support@cadical.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8 flex items-start gap-4">
                <Phone className="w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-muted-foreground text-sm">
                    +234 707 617 5550
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8 flex items-start gap-4">
                <MapPin className="w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold">Office Address</h3>
                  <p className="text-muted-foreground text-sm">
                    123 Healthcare Avenue, Abuja, Nigeria
                  </p>
                </div>
              </CardContent>
            </Card> */}

            {/* <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <div className="w-full h-48 bg-muted rounded-xl flex items-center justify-center text-sm text-muted-foreground">
                  Google Map Placeholder
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-6 bg-primary text-primary-foreground text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Let’s Improve Healthcare Together
          </h2>
          <p className="mb-8 opacity-90">
            Partner with Cadical for trusted healthcare solutions tailored to
            your needs.
          </p>
          <Link href="/about">
            <Button size="lg" variant="secondary" className="rounded-2xl px-8">
              Learn More About Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
