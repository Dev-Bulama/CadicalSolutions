import { motion } from "framer-motion";
import Link from "next/link";

export default function Portals() {

    return (
      <section id="portals" className="py-20 px-6 md:px-12 bg-[#f8fafc]">
        <div className="text-center mb-14">
          <div className="text-xs tracking-widest text-[#1565C0] mb-2 uppercase">What We Offer</div>
          <h2 className="text-3xl font-serif font-bold">One company. Three ways to access us.</h2>
          <p className="text-[#6b7c93]">Whether you're a hospital, a clinic or an individual — we have the right door for you.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title:"Pharmacy Store",
              sub:"For Everyone",
              icon:"💊",
              features:[
                "NAFDAC-certified products",
                "OTC & prescription medications",
                "Fast delivery across Nigeria",
                "Secure payment — card, transfer & USSD"
              ],
              link: "/products"
            },
            {
              title:"Supply Portal",
              sub:"For Institutions",
              icon:"🏥",
              features:[
                "Bulk ordering with institutional pricing",
                "Auto-generated invoices & delivery notes",
                "Monthly supply agreements available",
                "Dedicated account manager"
              ],
              link: "/institutional-portal"
            },
            {
              title:"Services",
              sub:"Physical & Virtual",
              icon:"🔧",
              features:[
                "Medical equipment servicing & repair",
                "Quarterly maintenance contracts",
                "Supply chain consultations",
                "24hr response to service requests"
              ],
              link: "/booking"
            }
          ].map((c,i)=>(
            <motion.div key={i} whileHover={{y:-6}}
              className="bg-white border border-[#e4eaf2] rounded-xl overflow-hidden flex flex-col hover:shadow-xl">

              
                <div className="text-3xl mb-4">{c.icon}</div>
                <div className="text-xs uppercase text-[#6b7c93] mb-2">{c.sub}</div>
                <h3 className="font-serif font-bold mb-2">{c.title}</h3>

                <ul>
                  {c.features.map((f,idx)=>(
                    <li key={idx} className="py-2 border-b border-[#e4eaf2] flex gap-2">
                      <span className="text-[#1565C0]">✓</span>{f}
                    </li>
                  ))}
                </ul>
              
                <Link href={c.link} className="p-6 flex-1">
              <div className="bg-[#f8fafc] border-t border-[#e4eaf2] px-6 py-4 text-[#1565C0] font-semibold flex justify-between">
                Explore <span>→</span>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    )
}