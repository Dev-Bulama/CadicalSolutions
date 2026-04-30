
export default function Process() {
    return (
        <section className="py-20 px-6 md:px-12 bg-[#0d47a1] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize:"60px 60px"
          }}
        />

        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl font-serif font-bold">Simple from start to finish.</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative z-10">
          {["Choose","Order","We Deliver","Done"].map((t,i)=>(
            <div key={i} className="text-center">
              <div className="w-14 h-14 bg-[#F5A623] rounded-full flex items-center justify-center mx-auto mb-4 font-bold">{i+1}</div>
              <h4 className="mb-2">{t}</h4>
              <p className="text-white/60 text-sm">Step description</p>
            </div>
          ))}
        </div>
      </section>
    )
}