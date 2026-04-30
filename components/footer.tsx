// import Image from "next/image";
// import Link from "next/link";

// export  function Footer() {
//   return (
//     <footer className="bg-[#1a2332] text-white px-6 md:px-12 py-8 flex flex-wrap justify-between items-center gap-4">
//       <div>
//         <div className="flex items-center gap-2">
//           {/* <div className="w-8 h-8 bg-[#1565C0] rounded flex items-center justify-center">C</div> */}
//            <Image
//                   src={'/images/logo.png'} 
//                   alt="logo"
//                   width={6} height={6} 
//                   className="w-8 h-8 rounded-lg flex items-center justify-center" 
//                   />
//           <span className="text-sm">Cadical Solutions Ltd</span>
//         </div>

//         <div className="flex gap-4 mt-4 text-sm text-white/50 rounded-xl px-4 ">
//             <Link href="https://www.instagram.com/cadicalsolutions" className="hover:text-primary">
//               <Image src={'/images/instagram.png'} width={20} height={20} alt="instagram" />
//             </Link>
//            <Link href="https://x.com/CadicalSolution" className="hover:text-primary">
//               <Image src={'/images/twitter.png'} width={20} height={20} alt="x" />
//             </Link>
//             <Link href="https://www.linkedin.com/company/cadical-solutions/" className="hover:text-primary">
//               <Image src={'/images/linkedin.png'} width={20} height={20} alt="linkedin" />
//             </Link>
//             <Link href="https://www.facebook.com/share/1CMA1c1Czi/" className="hover:text-primary">
//               <Image src={'/images/facebook.png'} width={20} height={20} alt="facebook" />
//             </Link>
//           </div>
          
//         </div>

//         <div className="flex gap-6 text-sm text-white/50">
//           <a href="/store">Pharmacy</a>
//           <a href="/portal">Supply Portal</a>
//           <a href="#services">Services</a>
//           <a href="#contact">Contact</a>
//         </div>

//         <div className="text-xs text-white/40">© 2025 Cadical Solutions Ltd · Nigeria</div>
//       </footer>
//   )
// }

import { Instagram, Linkedin, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div> */}
               <Image
                  src={'/images/logo.png'} 
                  alt="logo"
                  width={6} height={6} 
                  className="w-8 h-8 rounded-lg flex items-center justify-center" 
                  />
              <span className="font-bold">Cadical Solutions</span>
            </div>
            <p className="text-sm text-muted-foreground">Health is life, protect yours with us.</p>
          </div>
          {/* <div className="grid grid-col-1 md:grid-cols-3 gap-4"> */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/services/consultations" className="hover:text-primary">
                  Consultations
                </Link>
              </li>
              <li>
                <Link href="/services/pharmaceuticals" className="hover:text-primary">
                  Pharmaceuticals
                </Link>
              </li>
              <li>
                <Link href="/services/diagnostics" className="hover:text-primary">
                  Diagnostics
                </Link>
              </li>
              {/* <li>
                <Link href="/services/emergency-services" className="hover:text-primary">
                  Emergency
                </Link>
              </li> */}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
              
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy-policy" className="hover:text-primary">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms
                </Link>
              </li>
              
            </ul>
          </div>
          {/* </div> */}
        </div>

        <div className="border-t border-border pt-8 flex justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2025 Cadical Solutions Limited. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="https://www.instagram.com/cadicalsolutions" className="hover:text-primary">
              <Image src={'/images/instagram.png'} width={20} height={20} alt="instagram" />
            </Link>
           <Link href="https://x.com/CadicalSolution" className="hover:text-primary">
              <Image src={'/images/twitter.png'} width={20} height={20} alt="x" />
            </Link>
            <Link href="https://www.linkedin.com/company/cadical-solutions/" className="hover:text-primary">
              <Image src={'/images/linkedin.png'} width={20} height={20} alt="linkedin" />
            </Link>
            <Link href="https://www.facebook.com/share/1CMA1c1Czi/" className="hover:text-primary">
              <Image src={'/images/facebook.png'} width={20} height={20} alt="facebook" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
