"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const services = [
  { title: "Consultations", description: "Expert medical consultations across crucial health departments with international collaboration.", icon: "💬", slug: "consultations" },
  { title: "Pharmaceuticals", description: "Latest WHO-approved drugs and medical equipment with 100% efficacy assurance.", icon: "💊", slug: "pharmaceuticals" },
  { title: "Surgical Equipment", description: "Advanced surgical devices including computer-assisted and robotically-assisted systems.", icon: "⚕️", slug: "surgical-equipment" },
  { title: "Diagnostics", description: "3D radiological imaging and laboratory investigations with precision and sensitivity.", icon: "🔬", slug: "diagnostics" },
  { title: "Rehabilitation", description: "Physical therapy, occupational therapy, and sports medicine rehabilitation.", icon: "🏃", slug: "rehabilitation" },
  { title: "Emergency Services", description: "Quick response emergency medical services with advanced life support capabilities.", icon: "🚑", slug: "emergency-services" },
  { title: "Cosmetics", description: "Latest cosmetology and dermatology services with skin care solutions.", icon: "✨", slug: "cosmetics" },
  { title: "Referrals", description: "Professional referral services connecting you with expert healthcare networks.", icon: "🤝", slug: "referrals" },
]

export default function ServicesOverviewPage() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <h1 className="text-5xl font-bold text-center mb-12">Our Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Link key={service.slug} href={`/services/${service.slug}`} className="group">
            <Card className="transition-transform transform hover:scale-105 hover:shadow-xl hover:bg-primary/5 cursor-pointer">
              <CardHeader className="flex items-center gap-3">
                <span className="text-3xl">{service.icon}</span>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
