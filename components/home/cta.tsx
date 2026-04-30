export default function CTA() {
    return (
        <section id="contact" className="py-20 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">
          Ready to work with <span className="text-[#1565C0]">Cadical?</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button className="bg-[#1565C0] text-white px-6 py-3 rounded-md">Shop Pharmacy</button>
          <button className="border px-6 py-3 rounded-md">Portal</button>
          <button className="bg-[#F5A623] text-white px-6 py-3 rounded-md">Book Service</button>
        </div>

        <div className="flex justify-center gap-6 text-sm text-[#6b7c93] flex-wrap">
          <span>📞 +234 707 617 5550</span>
          <span>💬 WhatsApp</span>
          <span>📱 @cadicalsolutions</span>
        </div>
      </section>
    )
}