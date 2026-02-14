import { Instagram, Linkedin, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
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

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Consultations
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Pharmaceuticals
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Diagnostics
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Emergency
                </Link>
              </li>
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
        </div>

        <div className="border-t border-border pt-8 flex justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2025 Cadical Solutions Limited. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="https://www.instagram.com/cadicalsolutions" className="hover:text-primary">
              <Image src={'/instagram.svg'} width={20} height={20} alt="instagram" />
            </Link>
           <Link href="https://x.com/CadicalSolution" className="hover:text-primary">
              <Image src={'/x.svg'} width={20} height={20} alt="x" />
            </Link>
            <Link href="https://www.linkedin.com/company/cadical-solutions/" className="hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5c0-1.191-.809-2-2-2s-2 .809-2 2v5h-3v-10h3v1.354c.417-.625 1.021-1.354 2.5-1.354 1.833 0 3.5 1.667 3.5 3.75v5z" />
              </svg>
            </Link>
            <Link href="https://www.facebook.com/share/1CMA1c1Czi/" className="hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.334C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.796.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.312h3.59l-.467 3.622h-3.123V24h6.116C23.403 24 24 23.403 24 22.667V1.333C24 .597 23.403 0 22.675 0 21.942V1.333C0 .597.597 0 1.325 0h21.35C23.403 0 24 .597 24 1.333v21.334C24 23.403 23.403 24 22.675 24z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
