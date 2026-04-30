'use client'

import { motion } from 'framer-motion'

const expectItems = [
  {
    icon: '⏱️',
    title: '24hr Confirmation',
    desc: 'We confirm every booking within 24 hours — sooner for urgent requests',
  },
  {
    icon: '📍',
    title: 'We Come to You',
    desc: 'Physical services are delivered at your facility or location across Nigeria',
  },
  {
    icon: '💻',
    title: 'Virtual Available',
    desc: 'Consultations can be done via WhatsApp video or any preferred platform',
  },
  {
    icon: '🎁',
    title: 'Free First Consultation',
    desc: 'Your first supply consultation is completely free — no strings attached',
  },
  {
    icon: '📋',
    title: 'Maintenance Contracts',
    desc: 'Ask about quarterly contracts for ongoing equipment servicing',
  },
]

const contactItems = [
  {
    icon: '📞',
    title: 'Call Us',
    desc: '+234 707 617 5550',
    href: 'tel:+2347076175550',
  },
  {
    icon: '💬',
    title: 'WhatsApp',
    desc: 'Message us directly for fastest response',
    href: 'https://wa.me/2347076175550',
  },
  {
    icon: '✉️',
    title: 'Email',
    desc: 'services@cadical.com',
    href: 'mailto:services@cadical.com',
  },
]

export default function Sidebar() {
  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      {/* What to Expect */}
      <div className="bg-white rounded-[14px] border border-c-border overflow-hidden">
        <div className="bg-c-blue px-5 py-4 text-white font-playfair text-[15px] font-bold">
          What to Expect
        </div>
        <div className="p-5">
          {expectItems.map((item, i) => (
            <div
              key={item.title}
              className={`flex gap-3 py-2.5 items-start ${
                i < expectItems.length - 1 ? 'border-b border-c-border' : ''
              }`}
            >
              <span className="text-[18px] flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <h4 className="text-[13px] font-semibold text-c-text mb-0.5">{item.title}</h4>
                <p className="text-[12.5px] text-c-muted leading-[1.5]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prefer to Call? */}
      <div className="bg-white rounded-[14px] border border-c-border overflow-hidden">
        <div className="bg-c-blue px-5 py-4 text-white font-playfair text-[15px] font-bold">
          Prefer to Call?
        </div>
        <div className="p-5">
          {contactItems.map((item, i) => (
            <a
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 py-2.5 no-underline ${
                i < contactItems.length - 1 ? 'border-b border-c-border' : ''
              }`}
            >
              <div className="w-9 h-9 bg-c-blue-light rounded-lg flex items-center justify-center text-[16px] flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-c-text mb-0.5">{item.title}</h4>
                <p className="text-[12px] text-c-muted">{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency note */}
      <div className="flex gap-2.5 items-start bg-c-warn-bg border border-c-warn-border rounded-[10px] px-4 py-3.5">
        <span className="text-[18px] flex-shrink-0">🚨</span>
        <p className="text-[12.5px] text-c-warn-text leading-[1.6]">
          <strong>Equipment emergency?</strong> Don&apos;t use this form — call us directly on{' '}
          <strong>+234 707 617 5550</strong> for same-day response.
        </p>
      </div>
    </motion.div>
  )
}
