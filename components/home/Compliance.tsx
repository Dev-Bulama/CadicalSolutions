"use client";

import { fadeUp, stagger } from "@/lib/animations";
import { motion } from "framer-motion";
// import { fadeUp, stagger } from "@/lib/motion";

const items = [
  { tag: "CAC", title: "Corporate Affairs Commission", id: "RC 8969474" },
  { tag: "NAFDAC", title: "Drug compliance", id: "Per-SKU" },
  { tag: "PCN", title: "Pharmacist oversight", id: "License pending" },
  { tag: "NDPA", title: "Data protection", id: "privacy@cadical.com" },
];

export default function Compliance() {
  return (
    <section  id="compliance" className="px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(3.5rem,8vw,6.5rem)] bg-[#f8fafc]">
      <div className="max-w-[1240px] mx-auto">

        <motion.div variants={fadeUp} initial="hidden" whileInView="show">
          <h2 className="font-serif text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] mb-10">
            Regulated. Registered. <span className="italic text-teal">Auditable.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          className="grid md:grid-cols-4 gap-4"
        >
          {items.map((c, i) => (
            <motion.div key={i} variants={fadeUp} className="border p-6 rounded-xl bg-white">
              <span className="text-xs bg-teal-soft text-teal px-2 py-1 rounded">
                {c.tag}
              </span>
              <h4 className="mt-3 font-serif">{c.title}</h4>
              <p className="text-sm text-[#4A4A45] mt-2">{c.id}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}