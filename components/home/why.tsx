import Image from "next/image";


export default function Why() {
    return (
        <section id="why" className="py-20 px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">

          <div>
            <div className="text-xs text-[#1565C0] mb-2 uppercase">Why Cadical</div>
            <h2 className="text-3xl font-serif font-bold mb-4">
              Reliable supply is not a luxury.<br/>
              <span className="text-[#1565C0]">It's the baseline.</span>
            </h2>

            <p className="text-[#6b7c93] mb-6">
              Most healthcare supply chains in Nigeria fail at the last mile — late deliveries, wrong products, no follow-up.
            </p>

            <div className="space-y-4">
              {["Specialist Knowledge","Fast, Dependable Delivery","Relationship-Driven","Certified Products Only"].map((t,i)=>(
                <div key={i} className="flex gap-3">
                  <div>✅</div>
                  <div className="text-sm">{t}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* <div className="col-span-2 bg-[#1565C0] text-white p-6 rounded-xl">
              <div className="text-3xl font-serif text-[#F5A623] font-bold">850M+</div>
              <div className="text-sm">People globally living with kidney disease</div>
            </div>
            <div className="bg-[#f8fafc] p-6 rounded-xl border">
              <div className="text-2xl text-[#1565C0] font-bold">240+</div>
              <div className="text-sm">Dialysis centres</div>
            </div>
            <div className="bg-[#f8fafc] p-6 rounded-xl border">
              <div className="text-2xl text-[#1565C0] font-bold">$4B+</div>
              <div className="text-sm">Market size</div>
            </div> */}
            <Image src='/test.jpeg' alt="Why Cadical" width={500} height={500} className="rounded-xl object-cover" />
          </div>

        </div>
      </section>
    )
}