"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function Reveal({ children }: any) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
    >
      {children}
    </motion.div>
  );
}