import FeaturedProduct from "@/components/featured-products"
import Compliance from "@/components/home/Compliance"
import Consent from "@/components/home/Consent"
import Coverage from "@/components/home/Coverage"
import CTA from "@/components/home/cta"
import Hero from "@/components/home/hero"
import Portals from "@/components/home/portals"
import Process from "@/components/home/process"
import Services from "@/components/home/services"
import Why from "@/components/home/why"
import Categories from "@/components/home/categories"
import Stats from "@/components/home/stats"
import Testimonials from "@/components/home/testimonials"
import TrackingShowcase from "@/components/home/tracking-showcase"

export default function Home() {
  return (
    <main className="font-sans text-slate-900 bg-white overflow-x-hidden pb-20 lg:pb-0">

      {/* Hero slider */}
      <Hero />

      {/* Category grid */}
      <Categories />

      {/* Portals / offerings */}
      <Portals />

      {/* Featured products */}
      <FeaturedProduct />

      {/* Why Cadical */}
      <Why />

      {/* Stats counters */}
      <Stats />

      {/* Services */}
      <Services />

      {/* Order tracking showcase */}
      <TrackingShowcase />

      {/* How it works */}
      <Process />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <CTA />

      {/* Compliance */}
      <Compliance />

      {/* Coverage map */}
      <Coverage />

      {/* Consent banner */}
      <Consent />

    </main>
  )
}
