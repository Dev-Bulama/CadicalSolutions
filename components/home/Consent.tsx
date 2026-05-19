"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X } from "lucide-react"

export default function Consent() {
  const [show, setShow] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("consent")) {
      setTimeout(() => setShow(true), 1500)
    }
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const accept    = () => { localStorage.setItem("consent", "all");       setShow(false) }
  const essential = () => { localStorage.setItem("consent", "essential"); setShow(false) }
  const reject    = () => { localStorage.setItem("consent", "none");      setShow(false) }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          className={`fixed left-3 right-3 sm:left-auto sm:right-5 sm:w-[360px] z-[60] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 ${
            isMobile ? "bottom-[86px]" : "bottom-5"
          }`}
        >
          <button onClick={reject} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={14} />
          </button>

          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Cookie size={16} className="text-[#1565C0]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Cookie Preferences</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">NDPA 2023 compliant</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            We use cookies to improve your experience and analyse site usage. You can customise your preferences below.
          </p>

          <div className="flex gap-2">
            <button onClick={accept}
              className="flex-1 bg-[#1565C0] hover:bg-[#0d47a1] text-white text-xs font-semibold py-2 rounded-lg transition-colors">
              Accept All
            </button>
            <button onClick={essential}
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 rounded-lg transition-colors">
              Essential Only
            </button>
            <button onClick={reject}
              className="px-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs py-2 rounded-lg transition-colors">
              Reject
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
