"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import Image from "next/image";

export default function Coverage() {
  return (
    <section className="bg-[#0d47a1] text-white px-5 py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT TEXT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Where we{" "}
            <span className="italic text-teal-400">deliver.</span>
          </h2>

          <p className="text-white/70 mb-8 max-w-md">
            We provide fast, reliable medical and pharmaceutical delivery services across major cities and nationwide coverage.
          </p>

          <div className="space-y-3">
            <div className="text-teal-300 italic text-lg">
              Nationwide coverage.
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
              <div>Lagos</div>
              <div className="text-right text-teal-300">24–48H</div>

              <div>Abuja</div>
              <div className="text-right text-teal-300">24–48H</div>

              <div>Kano</div>
              <div className="text-right text-teal-300">24–72H</div>

              <div>Enugu</div>
              <div className="text-right text-teal-300">24–72H</div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT IMAGE BOX */}
        <motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="show"
  className="relative w-full flex justify-center"
>
  <div className="relative w-[320px] md:w-[380px] aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-xl">
    
    <Image
      src="/deliveries.png"
      alt="Coverage Map"
      fill
      className="object-cover"
      priority
    />

    {/* subtle overlay */}
    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
  </div>
</motion.div>

      </div>
    </section>
  );
}