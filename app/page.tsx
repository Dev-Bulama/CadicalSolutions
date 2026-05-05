"use client";

import Compliance from "@/components/home/Compliance";
import CTA from "@/components/home/cta";
import Hero from "@/components/home/hero";
import Portals from "@/components/home/portals";
import Process from "@/components/home/process";
import Services from "@/components/home/services";
import Why from "@/components/home/why";
// import Compliance from "@/components/home/compliance";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="font-sans text-[#1a2332] bg-white overflow-x-hidden">

     <Hero />

      <Portals />

      {/* WHY */}
      <Why />

      {/* SERVICES */}
      <Services />

      {/* PROCESS */}
      <Process />

      {/* CTA */}
      <CTA />

      {/* Compliance */}
      <Compliance />

    </main>
  );
}