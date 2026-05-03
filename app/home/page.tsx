import Header from "@/components/home2/header";
import Hero from "@/components/home2/hero";
import Trust from "@/components/home2/trust";
import Doors from "@/components/home2/doors";
import Products from "@/components/home2/products";
import Process from "@/components/home2/Process";
import Coverage from "@/components/home2/Coverage";
import Compliance from "@/components/home2/Compliance";
import Testimonial from "@/components/home2/Testimonial";
import CTA from "@/components/home2/CTA";
import Footer from "@/components/home2/Footer";
import Consent from "@/components/home2/Consent";

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      <main>
        <Hero />
        <Trust />
        <Doors />
        <Products />
        <Process />
        <Coverage />
        <Compliance />
        <Testimonial />
        <CTA />
      </main>
      <Footer />
      <Consent />
    </>
  );
}