"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function Coverage() {
  return (
    <section className="bg-teal-700 text-white px-5 py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

        <motion.div 
        variants={fadeUp} 
        initial="hidden" whileInView="show">
          <h2 className="text-4xl font-serif mb-6">
            Where we <span className="italic text-teal-line">deliver.</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {["Lagos", "Abuja", "Kano", "Enugu"].map((city, i) => (
              <div key={i} className="flex justify-between border-b border-white/20 py-2">
                <span>{city}</span>
                <span className="text-teal-line text-xs">24–48H</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="aspect-square border border-white/20 rounded-xl"
        />
      </div>
    </section>
  );
}