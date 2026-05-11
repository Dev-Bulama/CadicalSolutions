import { CTASection } from "@/components/cta-section";
import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero-section";
// import { ServicesSection } from "@/components/services-section";


export default function Home() {
  return (
    <div >
      <HeroSection />
      {/* <ServicesSection /> */}
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
