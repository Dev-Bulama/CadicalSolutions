"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, HeartPulse, Users, ShieldCheck, Stethoscope } from "lucide-react"

// SEO Metadata (for app router use in layout or separate file if needed)
// export const metadata = {
//   title: "About Cadical | Healthcare Products & Medical Staffing",
//   description:
//     "Cadical is a trusted healthcare solutions provider specializing in quality health product sales and professional medical staff outsourcing.",
//   keywords: [
//     "health products",
//     "medical staffing",
//     "healthcare outsourcing",
//     "Cadical",
//     "medical professionals for hire",
//   ],
// }

export default function AboutCadicalPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-muted/40 dark:from-background dark:via-background dark:to-muted/20">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20">
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl top-10 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-secondary/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />
      </div>

      {/* Hero Section */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 px-4 py-1 text-sm rounded-full">
              About Cadical
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Delivering Healthcare Solutions You Can Rely On
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
              Cadical bridges the gap between high-quality health products and
              skilled medical professionals. We empower healthcare facilities
              and organizations with reliable solutions that improve patient
              care and operational efficiency.
            </p>
            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="rounded-2xl px-8">
                  Partner With Us
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-8"
                >
                  Explore Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What We Do
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare solutions tailored for modern medical
              institutions and organizations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all">
              <CardContent className="p-10">
                <HeartPulse className="w-12 h-12 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  Health Product Sales
                </h3>
                <p className="text-muted-foreground mb-6">
                  We supply hospitals, clinics, and pharmacies with safe,
                  compliant, and affordable medical products sourced from
                  trusted partners.
                </p>
                <ul className="space-y-3">
                  {[
                    "Regulatory compliant products",
                    "Reliable supply chain",
                    "Affordable pricing structure",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-all">
              <CardContent className="p-10">
                <Users className="w-12 h-12 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  Medical Staff Outsourcing
                </h3>
                <p className="text-muted-foreground mb-6">
                  We connect healthcare facilities with verified and
                  credentialed professionals for short-term, long-term, and
                  contract-based roles.
                </p>
                <ul className="space-y-3">
                  {[
                    "Doctors & Specialists",
                    "Nurses & Caregivers",
                    "Pharmacists & Lab Scientists",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-24 px-6 bg-muted/40 dark:bg-muted/20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Our Mission",
              icon: <ShieldCheck className="w-10 h-10 mb-4" />,
              text: "To deliver accessible healthcare solutions through quality products and dependable medical staffing services.",
            },
            {
              title: "Our Vision",
              icon: <HeartPulse className="w-10 h-10 mb-4" />,
              text: "To become a leading healthcare solutions provider recognized for excellence, integrity, and innovation.",
            },
            {
              title: "Our Core Values",
              icon: <Stethoscope className="w-10 h-10 mb-4" />,
              text: "Integrity, Quality, Reliability, and Care guide everything we do and every partnership we build.",
            },
          ].map((item, i) => (
            <Card key={i} className="rounded-2xl shadow-lg">
              <CardContent className="p-8 text-center">
                {item.icon}
                <h3 className="text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Meet Our Team
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {["Medical Director", "Operations Lead", "Head of Staffing"].map(
              (role, i) => (
                <Card
                  key={i}
                  className="rounded-2xl shadow-lg hover:shadow-xl transition"
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-muted mb-6" />
                    <h4 className="font-semibold text-lg">Cadical Team</h4>
                    <p className="text-sm text-muted-foreground">{role}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 bg-primary text-primary-foreground text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Partner With Cadical?
          </h2>
          <p className="mb-10 text-lg opacity-90">
            Let’s provide your organization with trusted health products and
            skilled medical professionals.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="rounded-2xl px-10">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
