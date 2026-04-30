

export default function Services() {

    return (
        <section id="services" className="py-20 px-6 md:px-12 bg-[#f8fafc]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold">We don't just supply — we support.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">

          <div className="bg-white border rounded-xl p-8 hover:shadow-lg">
            <div className="text-2xl mb-4">🔧</div>
            <h3 className="font-serif font-bold mb-2">Equipment Maintenance & Repair</h3>
            <p className="text-[#6b7c93] mb-4">
              On-site servicing, calibration and repair of medical equipment.
            </p>
            <button className="bg-[#1565C0] text-white px-4 py-2 rounded-md">Request Service</button>
          </div>

          <div className="bg-white border rounded-xl p-8 hover:shadow-lg">
            <div className="text-2xl mb-4">💬</div>
            <h3 className="font-serif font-bold mb-2">Healthcare Supply Consultation</h3>
            <p className="text-[#6b7c93] mb-4">
              Advice for hospitals, clinics and individuals on procurement.
            </p>
            <button className="bg-[#1565C0] text-white px-4 py-2 rounded-md">Book Consultation</button>
          </div>

        </div>
      </section>
    )
}